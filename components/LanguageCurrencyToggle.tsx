import React from 'react';
import { Currency, Language } from '../types';
import { Globe, DollarSign } from 'lucide-react';

interface Props {
  language: Language;
  setLanguage: (l: Language) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
}

export const LanguageCurrencyToggle: React.FC<Props> = ({ 
  language, 
  setLanguage, 
  currency, 
  setCurrency 
}) => {
  return (
    <div className="flex space-x-2 bg-[#B8936A] p-1 rounded-lg shadow-sm border border-[#A68259]">
      <button
        onClick={() => setLanguage(language === Language.ES ? Language.EN : Language.ES)}
        className="flex items-center space-x-1 px-2 py-0.5 rounded-md hover:bg-white/10 transition-colors text-xs font-medium text-white"
      >
        <Globe size={14} />
        <span>{language}</span>
      </button>
      
      <div className="w-px bg-white/30 mx-1 h-4 self-center"></div>

      <button
        onClick={() => setCurrency(currency === Currency.MXN ? Currency.USD : Currency.MXN)}
        className="flex items-center space-x-1 px-2 py-0.5 rounded-md hover:bg-white/10 transition-colors text-xs font-medium text-white"
      >
        <DollarSign size={14} />
        <span>{currency}</span>
      </button>
    </div>
  );
};