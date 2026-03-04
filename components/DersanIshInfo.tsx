import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Info, ArrowLeft, Landmark, TreePine, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  language: Language;
  onBack: () => void;
}

export const DersanIshInfo: React.FC<Props> = ({ language, onBack }) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300 pb-12">
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
            <Info size={28} />
            DERSAN e ISH Quintana Roo
          </h2>
          <p className="text-white/80 mt-2">
            Información importante sobre los impuestos y derechos aplicables en el estado de Quintana Roo, México.
          </p>
        </div>

        <div className="p-8 space-y-10">
          <section className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
            <p className="text-gray-700 leading-relaxed">
              En Quintana Roo, México, el <strong>DERSAN (Derecho de Saneamiento Ambiental)</strong> y el <strong>ISH (Impuesto sobre Hospedaje)</strong> son dos cobros distintos que los turistas deben cubrir al alojarse en hoteles, moteles, posadas o rentas vacacionales.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* ISH Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[#B8936A]">
                <div className="p-2 bg-[#B8936A]/10 rounded-xl">
                  <Landmark size={24} />
                </div>
                <h3 className="text-xl font-bold">1. ¿Qué es el ISH QRoo?</h3>
              </div>
              <p className="text-sm text-gray-500 font-medium italic">(Impuesto sobre Hospedaje)</p>
              
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-700">Objetivo:</span>
                    <p className="text-sm text-gray-600">Financiar la promoción turística, publicidad y mejoras en la infraestructura del estado.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-700">Tasa:</span>
                    <p className="text-sm text-gray-600">5% general y 6% para plataformas digitales (como Airbnb) sobre el precio de la habitación (sin IVA).</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-700">Quién lo paga:</span>
                    <p className="text-sm text-gray-600">El huésped final, pero el hotel o plataforma es responsable de retenerlo y pagarlo al gobierno estatal.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* DERSAN Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[#B8936A]">
                <div className="p-2 bg-[#B8936A]/10 rounded-xl">
                  <TreePine size={24} />
                </div>
                <h3 className="text-xl font-bold">2. ¿Qué es el DERSAN?</h3>
              </div>
              <p className="text-sm text-gray-500 font-medium italic">(Derecho de Saneamiento Ambiental)</p>
              
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-700">Objetivo:</span>
                    <p className="text-sm text-gray-600">Financiar la preservación y mejora del entorno natural, como la limpieza de playas y gestión de residuos.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-700">Tasa (Ejemplo 2026):</span>
                    <p className="text-sm text-gray-600">Basado en la UMA. Cancún: ~$83 MXN por cuarto/noche (70% UMA). Playa del Carmen: ~30% UMA (~$36 MXN).</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-700">Quién lo paga:</span>
                    <p className="text-sm text-gray-600">El visitante al hacer el check-in o check-out en el establecimiento.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">Resumen de diferencias en Quintana Roo</h3>
            <div className="overflow-hidden border border-gray-100 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">Característica</th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">ISH (Hospedaje)</th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">DERSAN (Saneamiento)</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr>
                    <td className="p-4 font-bold text-gray-700 border-b border-gray-50">Nivel</td>
                    <td className="p-4 text-gray-600 border-b border-gray-50">Estatal (Gobierno de QRoo)</td>
                    <td className="p-4 text-gray-600 border-b border-gray-50">Municipal (Ayuntamiento)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-gray-700 border-b border-gray-50">Tasa</td>
                    <td className="p-4 text-gray-600 border-b border-gray-50">5% - 6% sobre tarifa</td>
                    <td className="p-4 text-gray-600 border-b border-gray-50">~30-70% de una UMA por noche</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-gray-700 border-b border-gray-50">Destino</td>
                    <td className="p-4 text-gray-600 border-b border-gray-50">Promoción Turística</td>
                    <td className="p-4 text-gray-600 border-b border-gray-50">Ecología y Servicios Públicos</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-gray-700">Obligatorio</td>
                    <td className="p-4 text-gray-600">Sí (hoteles y Airbnb)</td>
                    <td className="p-4 text-gray-600">Sí (hoteles y Airbnb)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
              <AlertCircle size={20} />
            </div>
            <p className="text-sm text-amber-800 leading-relaxed">
              Es importante destacar que el <strong>DERSAN</strong> es un pago que se añade al costo de la noche, mientras que el <strong>ISH</strong> ya viene incorporado en la tarifa, pero ambos suman un costo extra al turista en Quintana Roo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
