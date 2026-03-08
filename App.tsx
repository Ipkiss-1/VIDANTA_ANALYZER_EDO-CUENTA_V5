import React, { useState } from 'react';
import { AnalysisResult, Currency, Language } from './types';
import { TRANSLATIONS } from './constants';
import { analyzeStatement } from './services/geminiService';
import { LanguageCurrencyToggle } from './components/LanguageCurrencyToggle';
import { Dashboard } from './components/Dashboard';
import { ConsumptionQuery } from './components/ConsumptionQuery';
import { DersanIshInfo } from './components/DersanIshInfo';
import Footer from './components/Footer';
import { Upload, Loader2, AlertCircle, Menu, X, DollarSign, Euro, Coins, FileText, Search, Sparkles, Info, Settings, ChevronRight } from 'lucide-react';
import { EXCHANGE_RATE_USD_TO_MXN, EXCHANGE_RATE_EUR_TO_MXN, EXCHANGE_RATE_CAD_TO_MXN } from './constants';
import vidantaLogo from './vidanta-logo.png'

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(Language.ES);
  const [currency, setCurrency] = useState<Currency>(Currency.MXN);
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExchangeRateOpen, setIsExchangeRateOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'query' | 'dersan'>('dashboard');

  const t = TRANSLATIONS[language];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError("Please select a PDF file.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await analyzeStatement(file);
      setData(result);
    } catch (err) {
      console.error(err);
      setError(t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setData(null);
    setError(null);
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navbar */}
      <nav className="bg-gray-50 pt-6 pb-4 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Left: Menu Button */}
            <div className="flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-700"
                aria-label="Menu"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>

            {/* Center: Logo (shifted 15px left) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mt-1 -ml-[15px]">
              <img 
              src={vidantaLogo} 
              alt="Vidanta Logo" 
              className="h-20 sm:h-28 w-auto object-contain"
            />
            </div>

            {/* Right: Toggle */}
            <LanguageCurrencyToggle 
              language={language} 
              setLanguage={setLanguage}
              currency={currency}
              setCurrency={setCurrency}
            />
          </div>
        </div>

        {/* Hamburger Menu Content */}
        {/* Hamburger Menu Content */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full sm:w-64 bg-[#B8936A] shadow-2xl border border-[#A68259] z-[60] mt-2 mx-4 sm:ml-8 rounded-lg p-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="space-y-0.5">
              {/* 1. Facturación */}
              <button className="w-full flex items-center gap-2.5 p-1.5 hover:bg-white/10 rounded-md transition-colors text-left group">
                <FileText size={16} className="text-white/80 group-hover:text-white" />
                <span className="text-[13px] font-medium text-white/90 group-hover:text-white">Facturación</span>
              </button>

              {/* 2. Tipo de Cambio (Collapsible) */}
              <div>
                <button 
                  onClick={() => setIsExchangeRateOpen(!isExchangeRateOpen)}
                  className="w-full flex items-center justify-between p-1.5 hover:bg-white/10 rounded-md transition-colors text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <Coins size={16} className="text-white/80 group-hover:text-white" />
                    <span className="text-[13px] font-medium text-white/90 group-hover:text-white">Tipo de Cambio</span>
                  </div>
                  <ChevronRight 
                    size={12} 
                    className={`text-white/40 transition-transform duration-200 ${isExchangeRateOpen ? 'rotate-90' : ''}`} 
                  />
                </button>
                
                {isExchangeRateOpen && (
                  <div className="ml-6 mt-0.5 mb-1 space-y-0.5 border-l border-white/20 pl-3 animate-in fade-in slide-in-from-left-1 duration-150">
                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-[10px] text-white/60 font-bold uppercase tracking-tight">USD</span>
                      <span className="text-[11px] font-mono text-white">${EXCHANGE_RATE_USD_TO_MXN.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-[10px] text-white/60 font-bold uppercase tracking-tight">EUR</span>
                      <span className="text-[11px] font-mono text-white">${EXCHANGE_RATE_EUR_TO_MXN.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Consulta de Consumos */}
              <button 
                onClick={() => { setCurrentView('query'); setIsMenuOpen(false); }}
                className={`w-full flex items-center gap-2.5 p-1.5 hover:bg-white/10 rounded-md transition-colors text-left group ${currentView === 'query' ? 'bg-white/10' : ''}`}
              >
                <Search size={16} className="text-white/80 group-hover:text-white" />
                <span className="text-[13px] font-medium text-white/90 group-hover:text-white">Consulta de Consumos</span>
              </button>

              {/* 4. Análisis de Consumo con IA */}
              <button 
                onClick={() => { setCurrentView('dashboard'); setIsMenuOpen(false); }}
                className={`w-full flex items-center justify-between p-1.5 hover:bg-white/10 rounded-md transition-colors text-left group ${currentView === 'dashboard' ? 'bg-white/10' : ''}`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles size={16} className="text-white/80 group-hover:text-white" />
                  <span className="text-[13px] font-medium text-white/90 group-hover:text-white">Análisis con IA</span>
                </div>
                <span className="text-[8px] border border-white/30 text-white px-1 rounded font-bold">NUEVO</span>
              </button>

              {/* 5. ¿Qué es el DERSAN y el ISH QROO? */}
              <button 
                onClick={() => { setCurrentView('dersan'); setIsMenuOpen(false); }}
                className={`w-full flex items-center gap-2.5 p-1.5 hover:bg-white/10 rounded-md transition-colors text-left group ${currentView === 'dersan' ? 'bg-white/10' : ''}`}
              >
                <Info size={16} className="text-white/80 group-hover:text-white" />
                <span className="text-[13px] font-medium text-white/90 group-hover:text-white">DERSAN e ISH QROO</span>
              </button>

              <div className="my-1 border-t border-white/10"></div>

              {/* 6. Configuración */}
              <button className="w-full flex items-center gap-2.5 p-1.5 hover:bg-white/10 rounded-md transition-colors text-left group">
                <Settings size={16} className="text-white/80 group-hover:text-white" />
                <span className="text-[13px] font-medium text-white/90 group-hover:text-white">Configuración</span>
              </button>
            </div>
            
            <div className="mt-3 pt-2 border-t border-white/10 flex justify-center">
              <p className="text-[8px] text-white/40 font-medium tracking-tight">
                Vidanta Financial Services v1.2.0
              </p>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
        
        {/* Error Notification */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
            <AlertCircle className="text-red-500 mr-3 mt-0.5" size={20} />
            <div>
              <p className="text-sm text-red-700 font-medium">Error</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          // Loading State
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">{t.analyzing}</h3>
            <p className="text-gray-500 mt-2 max-w-md text-center">
              Gemini is extracting tables, cleaning descriptions, and categorizing expenses...
            </p>
          </div>
        ) : !data ? (
          // Empty State / Upload
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-full max-w-lg">
              <label 
                htmlFor="file-upload" 
                className="group relative flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-white hover:bg-gray-50 hover:border-blue-400 transition-all duration-200 shadow-sm"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="p-4 bg-blue-50 rounded-full mb-4 group-hover:bg-blue-100 transition-colors">
                    <Upload className="w-8 h-8 text-blue-500" />
                  </div>
                  <p className="mb-2 text-lg text-gray-700 font-medium">{t.uploadPrompt}</p>
                  <p className="text-xs text-gray-400">PDF, max 10MB</p>
                </div>
                <input 
                  id="file-upload" 
                  type="file" 
                  accept="application/pdf"
                  className="hidden" 
                  onChange={handleFileUpload}
                />
              </label>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <p className="font-semibold text-blue-600">1. Extract</p>
                  <p className="text-xs text-gray-500 mt-1">AI reads tables from PDF</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <p className="font-semibold text-blue-600">2. Clean</p>
                  <p className="text-xs text-gray-500 mt-1">Normalizes merchant names</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <p className="font-semibold text-blue-600">3. Categorize</p>
                  <p className="text-xs text-gray-500 mt-1">Groups by spending type</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Dashboard or Query View
          currentView === 'dashboard' ? (
            <Dashboard 
              data={data} 
              language={language} 
              currency={currency} 
              onReset={handleReset}
            />
          ) : currentView === 'query' ? (
            <ConsumptionQuery 
              data={data} 
              language={language} 
              onBack={() => setCurrentView('dashboard')}
            />
          ) : (
            <DersanIshInfo 
              language={language} 
              onBack={() => setCurrentView('dashboard')}
            />
          )
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
