import React, { useMemo, useState } from 'react';
import { AnalysisResult, Currency, Language, Transaction, Category } from '../types';
import { TRANSLATIONS, EXCHANGE_RATE_MXN_TO_USD, EXCHANGE_RATE_USD_TO_MXN } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Search, ArrowUpDown, Filter, Calendar, Download } from 'lucide-react';

interface Props {
  data: AnalysisResult;
  language: Language;
  currency: Currency;
  onReset: () => void;
}

// Define specific colors for each category to ensure consistency across charts and table
// Colors chosen for accessibility and distinctness
const CATEGORY_COLORS: Record<string, string> = {
  [Category.FOOD_AND_BEVERAGE]: '#0D9488', // Teal (Combined Food & Drink)
  [Category.ROOM]: '#3B82F6',      // Blue (Primary)
  [Category.TAX]: '#EF4444',       // Red (Alert/Cost)
  [Category.SERVICE]: '#8B5CF6',   // Violet (Distinct)
  [Category.DISCOUNT]: '#F59E0B',  // Amber (Highlight/Savings)
  [Category.OTHER]: '#64748B',     // Slate (Neutral)
};

const DEFAULT_COLOR = '#9CA3AF'; // Gray (Fallback for unknown categories)

export const Dashboard: React.FC<Props> = ({ data, language, currency, onReset }) => {
  const t = TRANSLATIONS[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Helper to convert amounts based on selected currency preference vs detected currency
  const convert = (amount: number) => {
    // If detected is MXN and user wants USD
    if (data.detectedCurrency.includes('MXN') && currency === Currency.USD) {
      return amount * EXCHANGE_RATE_MXN_TO_USD;
    }
    // If detected is USD and user wants MXN
    if (data.detectedCurrency.includes('USD') && currency === Currency.MXN) {
      return amount * EXCHANGE_RATE_USD_TO_MXN;
    }
    // Same currency or undefined detected, return as is (assuming 1:1 for display if unknown)
    return amount;
  };

  // 1. Normalize transactions
  const normalizedTransactions = useMemo(() => {
    return data.transactions.map(tx => {
      const convertedAmount = convert(tx.amount);
      return {
        ...tx,
        convertedAmount
      };
    });
  }, [data.transactions, currency]);

  // Helper to parse transaction date (DD/MM/YYYY)
  const parseTxDate = (dateStr: string) => {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    // Month is 0-indexed in JS Date
    return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  };

  // Helper to parse input date (YYYY-MM-DD)
  const parseInputDate = (dateStr: string) => {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  };

  // 2. Filter transactions for the Table view
  const filteredTransactions = useMemo(() => {
    const start = parseInputDate(startDate);
    const end = parseInputDate(endDate);

    return normalizedTransactions.filter(tx => {
      const matchesSearch = tx.cleanName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            tx.originalDescription.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || tx.category === categoryFilter;
      
      let matchesDate = true;
      if (start || end) {
        const txDate = parseTxDate(tx.date);
        if (txDate) {
          // Compare using timestamps of dates at 00:00:00
          if (start && txDate.getTime() < start.getTime()) {
            matchesDate = false;
          }
          if (end && txDate.getTime() > end.getTime()) {
            matchesDate = false;
          }
        }
      }

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [normalizedTransactions, searchTerm, categoryFilter, startDate, endDate]);

  const filteredTotal = useMemo(() => {
    return filteredTransactions.reduce((acc, tx) => acc + tx.convertedAmount, 0);
  }, [filteredTransactions]);

  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const totalSpend = convert(data.totalAmount);

  // 3. Aggregate data for Charts. This data should only be affected by the date range,
  // not by the category or search filters, so the charts provide a stable overview.
  const chartData = useMemo(() => {
    const start = parseInputDate(startDate);
    const end = parseInputDate(endDate);

    const transactionsForCharts = normalizedTransactions.filter(tx => {
      let matchesDate = true;
      if (start || end) {
        const txDate = parseTxDate(tx.date);
        if (txDate) {
          if (start && txDate.getTime() < start.getTime()) {
            matchesDate = false;
          }
          if (end && txDate.getTime() > end.getTime()) {
            matchesDate = false;
          }
        } else {
          matchesDate = !start && !end;
        }
      }
      return matchesDate;
    });

    const agg: Record<string, number> = {};
    transactionsForCharts.forEach(tx => {
        const amt = Math.abs(tx.convertedAmount);
        if (amt !== 0) {
            agg[tx.category] = (agg[tx.category] || 0) + amt;
        }
    });
    return Object.keys(agg).map(key => ({ name: key, value: agg[key] }));
  }, [normalizedTransactions, startDate, endDate]);

  // Clone and sort for BarChart
  const topExpenses = useMemo(() => {
    return [...chartData].sort((a, b) => b.value - a.value).slice(0, 5);
  }, [chartData]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(language === Language.ES ? 'es-MX' : 'en-US', {
      style: 'currency',
      currency: currency
    }).format(val);
  };

  // Enhanced Chart Click Handler - simplified to work with direct component clicks
  const handleCategoryClick = (data: any) => {
    if (data && data.name) {
      setCategoryFilter(prev => prev === data.name ? 'All' : data.name);
    }
  };

  const handleExportCSV = () => {
    // CSV Header
    const headers = [t.date, t.cleanName, t.description, t.category, t.amount, 'Currency'];
    
    // CSV Rows
    const rows = filteredTransactions.map(tx => [
      tx.date,
      `"${tx.cleanName.replace(/"/g, '""')}"`, // Escape quotes
      `"${tx.originalDescription.replace(/"/g, '""')}"`,
      tx.category,
      tx.convertedAmount.toFixed(2),
      currency
    ]);

    // Combine with BOM for Excel UTF-8 compatibility
    const csvContent = "\uFEFF" + [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create Blob and Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${data.hotelName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* Header Info - Updated Layout */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-6">
          <div className="flex items-center">
            <img 
              src="/MAYAN PALACE SIN FONDO.png" 
              alt="Mayan Palace" 
              className="h-16 md:h-20 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-right">
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Gasto Total</h2>
            <p className="text-3xl md:text-4xl font-black text-blue-600 tracking-tight">
              {formatCurrency(totalSpend)}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-5 rounded-lg border border-gray-100">
            <div className="space-y-3">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500 font-medium">{t.guest}</span>
                    <span className="text-gray-900 font-semibold">{data.guestName}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500 font-medium">{t.room}</span>
                    <span className="text-gray-900 font-semibold">{data.roomNumber}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">{t.folio}</span>
                    <span className="text-gray-900 font-semibold">{data.confirmationNumber}</span>
                </div>
            </div>
            <div className="space-y-3">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500 font-medium">{t.checkIn}</span>
                    <span className="text-gray-900 font-semibold">{data.checkIn}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500 font-medium">{t.checkOut}</span>
                    <span className="text-gray-900 font-semibold">{data.checkOut}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">{t.timeshareNo}</span>
                    <span className="text-gray-900 font-semibold truncate max-w-[200px]" title={data.timeshareNo}>{data.timeshareNo}</span>
                </div>
            </div>
        </div>
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-800 tracking-tight">{t.categoryDistribution}</h3>
          </div>
          
          <div className="w-full h-72 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={95}
                  paddingAngle={2}
                  dataKey="value"
                  cursor="pointer"
                  stroke="none"
                  onClick={handleCategoryClick}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CATEGORY_COLORS[entry.name] || DEFAULT_COLOR} 
                      opacity={categoryFilter === 'All' || categoryFilter === entry.name ? 1 : 0.2}
                      className="transition-all duration-300 outline-none"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const total = chartData.reduce((a, b) => a + b.value, 0);
                      return (
                        <div className="bg-white p-3 shadow-2xl rounded-xl border border-gray-100 ring-1 ring-black/5 z-50 relative">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                            {data.name.split('/')[language === Language.ES ? 0 : 1]}
                          </p>
                          <p className="text-lg font-black text-gray-900">
                            {formatCurrency(data.value)}
                          </p>
                          <p className="text-[10px] text-gray-500 font-medium">
                            {((data.value / total) * 100).toFixed(1)}% {t.ofTotal}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-0">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Total</p>
              <p className="text-xl font-black text-gray-800 leading-none">
                {formatCurrency(chartData.reduce((acc, curr) => acc + curr.value, 0)).split('.')[0]}
              </p>
            </div>
          </div>
          
          {/* Custom Legend */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
            {chartData.map((entry, index) => {
              const isActive = categoryFilter === 'All' || categoryFilter === entry.name;
              const color = CATEGORY_COLORS[entry.name] || DEFAULT_COLOR;
              const label = entry.name.split('/')[language === Language.ES ? 0 : 1];
              
              return (
                <button
                  key={`legend-${index}`}
                  onClick={() => setCategoryFilter(prev => prev === entry.name ? 'All' : entry.name)}
                  className={`flex items-center gap-1.5 transition-all duration-200 group ${
                    isActive ? 'opacity-100 scale-100' : 'opacity-30 scale-95'
                  }`}
                >
                  <div className="w-2 h-2 rounded-full transition-transform group-hover:scale-125" style={{ backgroundColor: color }} />
                  <span className="text-[11px] font-bold text-gray-600 uppercase tracking-tight">{label}</span>
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-gray-400 mt-4 text-center italic font-medium">Pulsa en un segmento o leyenda para filtrar</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 tracking-tight mb-4">
            {t.topExpenses}
          </h3>
          <div className="w-full h-72">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart 
                 data={topExpenses} 
                 layout="vertical"
                 margin={{ left: 20, right: 30, top: 0, bottom: 0 }}
               >
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={100} 
                    tick={({ x, y, payload }) => (
                      <g transform={`translate(${x},${y})`}>
                        <text 
                          x={-10} 
                          y={0} 
                          dy={4} 
                          textAnchor="end" 
                          fill="#6B7280" 
                          className="text-[10px] font-bold uppercase tracking-tighter"
                        >
                          {payload.value.split('/')[language === Language.ES ? 0 : 1]}
                        </text>
                      </g>
                    )}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const total = chartData.reduce((a, b) => a + b.value, 0);
                        return (
                          <div className="bg-white p-3 shadow-2xl rounded-xl border border-gray-100 ring-1 ring-black/5 z-50 relative">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                              {data.name.split('/')[language === Language.ES ? 0 : 1]}
                            </p>
                            <p className="text-lg font-black text-gray-900">
                              {formatCurrency(data.value)}
                            </p>
                            <p className="text-[10px] text-gray-500 font-medium">
                              {((data.value / total) * 100).toFixed(1)}% {t.ofTotal}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[0, 6, 6, 0]}
                    cursor="pointer"
                    barSize={32}
                    onClick={handleCategoryClick}
                  >
                     {topExpenses.map((entry, index) => (
                       <Cell 
                         key={`cell-${index}`} 
                         fill={CATEGORY_COLORS[entry.name] || DEFAULT_COLOR} 
                         opacity={categoryFilter === 'All' || categoryFilter === entry.name ? 1 : 0.2}
                         className="transition-all duration-300"
                       />
                     ))}
                  </Bar>
               </BarChart>
             </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center italic font-medium">Pulsa en las barras para filtrar detalles</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center bg-gray-50">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full xl:w-auto">
             <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold whitespace-nowrap">{t.transactions}</h3>
                {categoryFilter !== 'All' && (
                  <span 
                    className="text-xs px-2 py-1 rounded-full flex items-center gap-1 font-medium border"
                    style={{ 
                      backgroundColor: `${CATEGORY_COLORS[categoryFilter] || DEFAULT_COLOR}20`, 
                      color: CATEGORY_COLORS[categoryFilter] || DEFAULT_COLOR,
                      borderColor: `${CATEGORY_COLORS[categoryFilter] || DEFAULT_COLOR}40`
                    }}
                  >
                    {categoryFilter.split('/')[language === Language.ES ? 0 : 1]}
                    <button onClick={() => setCategoryFilter('All')} className="font-bold ml-1 hover:opacity-75">×</button>
                  </span>
                )}
             </div>

             {/* Date Range Inputs */}
             <div className="flex items-center gap-2 bg-white px-2 py-1.5 rounded-lg border border-gray-300 shadow-sm w-full sm:w-auto">
                <Calendar size={16} className="text-gray-400" />
                <div className="flex items-center gap-1">
                   <div className="relative">
                      <input 
                        type="date" 
                        className="text-xs border-none focus:ring-0 p-0 text-gray-600 w-[100px] outline-none"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        placeholder={t.startDate}
                        title={t.startDate}
                      />
                   </div>
                   <span className="text-gray-400">-</span>
                   <div className="relative">
                      <input 
                        type="date" 
                        className="text-xs border-none focus:ring-0 p-0 text-gray-600 w-[100px] outline-none"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        placeholder={t.endDate}
                        title={t.endDate}
                      />
                   </div>
                </div>
                {(startDate || endDate) && (
                   <button 
                     onClick={() => { setStartDate(''); setEndDate(''); }} 
                     className="text-gray-400 hover:text-gray-600 ml-1"
                   >
                     ×
                   </button>
                )}
             </div>
          </div>
          
          <div className="flex gap-2 w-full xl:w-auto flex-wrap sm:flex-nowrap">
            <div className="relative flex-1 sm:min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
               <select 
                  className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white appearance-none focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer w-full sm:w-auto"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
               >
                 <option value="All">All Categories</option>
                 {Object.values(Category).map(cat => (
                   <option key={cat} value={cat}>{cat}</option>
                 ))}
               </select>
               <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>
          </div>
        </div>

        <div className="w-full overflow-hidden">
          <table className="w-full text-[10px] sm:text-xs md:text-sm text-left table-fixed border-collapse">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="px-2 md:px-4 py-3 w-[15%] md:w-[12%]">{t.date}</th>
                <th className="px-2 md:px-4 py-3 w-[55%] md:w-[58%]">{t.cleanName} / {t.description}</th>
                <th className="px-2 md:px-4 py-3 w-[15%] md:w-[15%]">{t.category}</th>
                <th className="px-2 md:px-4 py-3 text-right w-[15%] md:w-[15%]">{t.amount}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map((tx, idx) => {
                const badgeColor = CATEGORY_COLORS[tx.category] || DEFAULT_COLOR;
                const isExpanded = expandedIdx === idx;
                
                return (
                  <tr 
                    key={idx} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer align-top"
                    onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                  >
                    <td className="px-2 md:px-4 py-3 whitespace-nowrap text-gray-500">{tx.date}</td>
                    <td className="px-2 md:px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-gray-900 text-[10px] md:text-sm break-words leading-tight">
                          {tx.cleanName}
                        </span>
                        <div className="flex items-start justify-between gap-1 group">
                          <div className={`text-[9px] md:text-xs text-gray-500 transition-all duration-300 overflow-hidden ${isExpanded ? 'whitespace-normal break-words leading-relaxed' : 'truncate'}`}>
                            {tx.originalDescription.split(' ').map((word, i) => {
                              const isCheck = word.toUpperCase().includes('CHECK#') || word.toUpperCase().includes('CH#');
                              return (
                                <span key={i} className={isCheck ? 'font-bold text-blue-600' : ''}>
                                  {word}{' '}
                                </span>
                              );
                            })}
                          </div>
                          <span className={`text-[8px] mt-0.5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                            ▼
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 md:px-4 py-3">
                      <span 
                        className="inline-flex items-center px-1.5 md:px-2.5 py-0.5 rounded-full text-[8px] md:text-xs font-medium leading-tight"
                        style={{ 
                          backgroundColor: `${badgeColor}20`, 
                          color: badgeColor
                        }}
                      >
                        {tx.category.split('/')[language === Language.ES ? 0 : 1]}
                      </span>
                    </td>
                    <td className={`px-2 md:px-4 py-3 text-right font-medium ${tx.convertedAmount < 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {formatCurrency(tx.convertedAmount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {filteredTransactions.length > 0 && (
              <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                <tr>
                  <td colSpan={3} className="px-2 md:px-4 py-4 text-right font-bold text-gray-700 uppercase tracking-wider">
                    {t.total}
                  </td>
                  <td className="px-2 md:px-4 py-4 text-right font-black text-blue-600 text-sm md:text-base">
                    {formatCurrency(filteredTotal)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
          {filteredTransactions.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No transactions found matching your filters.
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-center pt-6 pb-12">
        <button 
          onClick={onReset}
          className="text-gray-500 hover:text-gray-800 underline text-sm transition-colors"
        >
          {t.reset}
        </button>
      </div>
    </div>
  );
};