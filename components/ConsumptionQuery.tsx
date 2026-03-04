import React, { useState } from 'react';
import { AnalysisResult, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { FileText, User, Home, Utensils, Search, ArrowLeft, Info } from 'lucide-react';

interface Props {
  data: AnalysisResult;
  language: Language;
  onBack: () => void;
}

const CONSUMPTION_CENTERS = [
  'Jade',
  'Deli Jade',
  'Tramonto',
  'Gong',
  'The Burger Custom Made',
  'Quinto',
  'Ola Mulata',
  'Balche',
  'Fresh Co',
  'Samba',
  'Epazote'
];

export const ConsumptionQuery: React.FC<Props> = ({ data, language, onBack }) => {
  const t = TRANSLATIONS[language];
  const [checkNumber, setCheckNumber] = useState('');
  const [consumptionCenter, setConsumptionCenter] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for query would go here
    alert(`Consultando Check #${checkNumber} en ${consumptionCenter}`);
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-6 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Volver al Dashboard</span>
      </button>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-[#B8936A] p-8 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Search size={28} />
            Consulta de Consumos
          </h2>
          <p className="text-white/80 mt-2">Ingrese los detalles del consumo para obtener información detallada.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Extracted Info (Read-only) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <User size={14} />
                Nombre del Huésped
              </label>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 font-semibold">
                {data.guestName || 'No detectado'}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Home size={14} />
                Número de Habitación
              </label>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 font-semibold">
                {data.roomNumber || 'No detectado'}
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100 my-2"></div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="checkNumber" className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <FileText size={14} />
                Número de #Check
              </label>
              <input
                id="checkNumber"
                type="text"
                value={checkNumber}
                onChange={(e) => setCheckNumber(e.target.value)}
                placeholder="Ej. 12345"
                className="w-full p-4 bg-white rounded-2xl border-2 border-gray-100 focus:border-[#B8936A] focus:outline-none transition-all font-medium text-gray-800 placeholder:text-gray-300"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="center" className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Utensils size={14} />
                Centro de Consumo
              </label>
              <select
                id="center"
                value={consumptionCenter}
                onChange={(e) => setConsumptionCenter(e.target.value)}
                className="w-full p-4 bg-white rounded-2xl border-2 border-gray-100 focus:border-[#B8936A] focus:outline-none transition-all font-medium text-gray-800 appearance-none cursor-pointer"
                required
              >
                <option value="" disabled>Seleccione un centro...</option>
                {CONSUMPTION_CENTERS.map(center => (
                  <option key={center} value={center}>{center}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#B8936A] hover:bg-[#A68259] text-white font-bold rounded-2xl shadow-lg shadow-[#B8936A]/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <Search size={20} />
            Consultar Consumo
          </button>
        </form>
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-start gap-4">
        <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
          <Info size={20} />
        </div>
        <div>
          <h4 className="font-bold text-blue-800">Información Importante</h4>
          <p className="text-sm text-blue-600 mt-1">
            Esta consulta le permite ver el detalle de los cargos realizados a su habitación. 
            Si no encuentra un cargo, verifique que el número de check sea correcto.
          </p>
        </div>
      </div>
    </div>
  );
};
