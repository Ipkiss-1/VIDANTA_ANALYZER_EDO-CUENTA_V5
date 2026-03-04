import React from 'react';
import { Instagram, Facebook, Youtube, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full text-white font-sans">
      {/* Top Section - Dark Gray */}
      <div className="bg-[#4a4a4a] py-6 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: DESTINOS */}
          <div className="space-y-3">
            <div className="border-b border-white/20 pb-1">
              <h3 className="text-xs tracking-[0.2em] font-medium uppercase">Destinos</h3>
            </div>
            <ul className="space-y-1.5 text-[10px] tracking-[0.15em] text-gray-300 uppercase">
              <li className="hover:text-white cursor-pointer transition-colors">Vallarta - Nuevo Nayarit</li>
              <li className="hover:text-white cursor-pointer transition-colors">Riviera Maya</li>
              <li className="hover:text-white cursor-pointer transition-colors">East Cape</li>
              <li className="hover:text-white cursor-pointer transition-colors">Los Cabos</li>
              <li className="hover:text-white cursor-pointer transition-colors">Acapulco</li>
              <li className="hover:text-white cursor-pointer transition-colors">Puerto Peñasco</li>
              <li className="hover:text-white cursor-pointer transition-colors">Puerto Vallarta</li>
              <li className="hover:text-white cursor-pointer transition-colors">Mazatlán</li>
            </ul>
          </div>

          {/* Column 2: HOTELES RESORT */}
          <div className="space-y-3 border-l border-white/10 pl-0 lg:pl-8">
            <div className="border-b border-white/20 pb-1">
              <h3 className="text-xs tracking-[0.2em] font-medium uppercase">Hoteles Resort</h3>
            </div>
            <ul className="space-y-1.5 text-[10px] tracking-[0.15em] text-gray-300 uppercase">
              <li className="hover:text-white cursor-pointer transition-colors">The Estates</li>
              <li className="hover:text-white cursor-pointer transition-colors">Grand Luxxe</li>
              <li className="hover:text-white cursor-pointer transition-colors">Deluxxe at the Grand Mayan</li>
              <li className="hover:text-white cursor-pointer transition-colors">Kingdom of the Sun</li>
              <li className="hover:text-white cursor-pointer transition-colors">The Grand Bliss</li>
              <li className="hover:text-white cursor-pointer transition-colors">The Grand Mayan</li>
              <li className="hover:text-white cursor-pointer transition-colors">Celebrate Park</li>
              <li className="hover:text-white cursor-pointer transition-colors">The Bliss</li>
              <li className="hover:text-white cursor-pointer transition-colors">Mayan Palace</li>
              <li className="hover:text-white cursor-pointer transition-colors font-semibold">Hoteles Resorts</li>
            </ul>
          </div>

          {/* Column 3: THE VIDANTA INSIDER */}
          <div className="space-y-3 border-l border-white/10 pl-0 lg:pl-8">
            <div className="border-b border-white/20 pb-1">
              <h3 className="text-xs tracking-[0.2em] font-medium uppercase">The Vidanta Insider</h3>
            </div>
            <div className="flex gap-3 items-start">
              <img 
                src="https://picsum.photos/seed/magazine/200/280" 
                alt="Vidanta Insider" 
                className="w-16 shadow-lg border border-white/10"
                referrerPolicy="no-referrer"
              />
              <div className="text-[10px] tracking-[0.1em] text-gray-300 uppercase leading-tight">
                <p>Conozca</p>
                <p>Nuestra</p>
                <p>Revista</p>
              </div>
            </div>
          </div>

          {/* Column 4: MANTÉNGASE CONECTADO & VIDANTA APP */}
          <div className="space-y-4 border-l border-white/10 pl-0 lg:pl-8">
            <div className="space-y-2">
              <div className="border-b border-white/20 pb-1">
                <h3 className="text-xs tracking-[0.2em] font-medium uppercase">Manténgase Conectado</h3>
              </div>
              <div className="flex gap-3">
                <Instagram size={16} className="text-gray-300 hover:text-white cursor-pointer transition-colors" />
                <Facebook size={16} className="text-gray-300 hover:text-white cursor-pointer transition-colors" />
                <Youtube size={16} className="text-gray-300 hover:text-white cursor-pointer transition-colors" />
                <Twitter size={16} className="text-gray-300 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="border-b border-white/20 pb-1">
                <h3 className="text-xs tracking-[0.2em] font-medium uppercase">Vidanta App</h3>
              </div>
              <div className="flex gap-3 items-center">
                <div className="w-10 h-16 bg-blue-900 rounded-sm border border-white/20 flex items-center justify-center p-1">
                  <div className="w-full h-full border border-white/10 rounded-[2px] flex items-center justify-center">
                    <span className="text-[7px] font-serif">V</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="text-[9px] tracking-[0.05em] text-gray-300 leading-tight">
                    App Vidanta
                  </p>
                  <div className="flex gap-1.5">
                    <div className="h-5 w-14 bg-black rounded border border-white/20 flex items-center justify-center px-1">
                      <span className="text-[5px] uppercase font-bold">iOS</span>
                    </div>
                    <div className="h-5 w-14 bg-black rounded border border-white/20 flex items-center justify-center px-1">
                      <span className="text-[5px] uppercase font-bold">Android</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Section - Black */}
      <div className="bg-[#1a1a1a] py-4 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-6 md:gap-10 transition-all duration-500">
          <div className="flex items-center gap-2">
            <img 
              src="/vidanta-logo.png" 
              alt="Vidanta" 
              className="h-12 object-contain brightness-0 invert" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="h-8 w-px bg-white/10 hidden md:block"></div>
          <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 hover:text-white transition-colors">The Estates</span>
          <div className="h-8 w-px bg-white/10 hidden md:block"></div>
          <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 hover:text-white transition-colors">The Grand Bliss</span>
          <div className="h-8 w-px bg-white/10 hidden md:block"></div>
          <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 hover:text-white transition-colors">The Grand Mayan</span>
          <div className="h-8 w-px bg-white/10 hidden md:block"></div>
          <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 hover:text-white transition-colors">Mayan Palace</span>
        </div>
        <div className="mt-4 text-center text-[8px] text-gray-500 tracking-widest uppercase">
          © {new Date().getFullYear()} Vidanta. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
