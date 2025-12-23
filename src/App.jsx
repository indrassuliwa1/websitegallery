import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Heart, Gamepad2, Smartphone } from 'lucide-react';

const robloxPhotos = [
  { id: 1, url: '/IMAGES/1.png', title: 'Gunung' },
  { id: 2, url: '/IMAGES/2.png', title: 'Gunung Lagi' },
  { id: 3, url: '/IMAGES/3.png', title: 'Gunung Atin' },
  { id: 4, url: '/IMAGES/4.png', title: 'W TIna <3' },
  { id: 5, url: '/IMAGES/5.png', title: 'Fish It' },
  { id: 6, url: '/IMAGES/6.png', title: 'Fish It Lagi' },
  { id: 7, url: '/IMAGES/7.png', title: 'W gustina' },
  { id: 8, url: '/IMAGES/8.png', title: 'Gunung Lagi' },
];

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio('/MUSIC/AUDIO.mp3'));

  const handleEnter = () => {
    setHasEntered(true);
    setIsPlaying(true);
    audioRef.current.play();
    audioRef.current.loop = true;
  };

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="text-white min-h-screen font-sans overflow-x-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0ea5e9] bg-attachment-fixed">
      
      {/* 1. OVERLAY ENTRANCE */}
      <AnimatePresence>
        {!hasEntered && (
          <motion.div 
            key="entrance-overlay"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0, 
              scale: 2, 
              filter: "blur(20px)",
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0ea5e9] p-6 text-center"
          >
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1] 
              }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="mb-8"
            >
              <Gamepad2 size={100} className="text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.6)]" />
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-black mb-8 tracking-tighter text-white"
            >
              POTO ROBLOK <br/> BY INDRA
            </motion.h1>

            <button
              onClick={handleEnter}
              className="bg-white/20 backdrop-blur-lg border border-white/30 relative overflow-hidden group w-full max-w-[280px] py-4 rounded-2xl font-bold text-lg shadow-[0_20px_50px_rgba(0,0,0,0.2)] active:scale-95 transition-transform"
            >
              <motion.div 
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
              <span className="relative z-10">KLIK DISINI ANJAYY 🚀</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MAIN CONTENT */}
      <AnimatePresence>
        {hasEntered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Navbar */}
            <nav className="fixed top-0 left-0 w-full z-40 p-4">
              <motion.div 
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 mx-auto max-w-lg px-5 py-3 rounded-2xl flex justify-between items-center shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-black text-xs">RBX</div>
                  <span className="font-bold text-sm tracking-tight italic">POTO POTO</span>
                </div>
                <button 
                  onClick={toggleMusic}
                  className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl hover:bg-white/20 active:scale-90 transition-all"
                >
                  {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
              </motion.div>
            </nav>

            <main className="pt-28 px-4 pb-12 max-w-5xl mx-auto">
              <header className="text-center mb-10 px-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="inline-block bg-white/20 px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-3 border border-white/10"
                >
                  Roblox Collection
                </motion.div>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-4xl font-black mb-2 drop-shadow-lg"
                >
                  GALLERY ROSBLOK 🧊
                </motion.h2>
                <p className="text-blue-100 text-sm opacity-80">Melihat kegabutan saya dalam meng-scinsut roblog</p>
              </header>

              {/* Grid Foto */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {robloxPhotos.map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: (index % 4) * 0.1, duration: 0.5 }}
                    whileHover={{ y: -5 }} // Sedikit naik saat kursor di atasnya
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 p-2.5 rounded-3xl flex flex-col shadow-xl group overflow-hidden"
                  >
                    {/* BINGKAI FOTO DENGAN ZOOM IN */}
                    <div className="aspect-square rounded-2xl overflow-hidden mb-3 relative">
                      <img 
                        src={photo.url} 
                        alt={photo.title}
                        className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-125" // ZOOM IN DISINI
                        onError={(e) => { e.target.src = 'https://placehold.co/400x400/0ea5e9/white?text=RBX'; }}
                      />
                      {/* Overlay tipis saat hover */}
                      <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors duration-500" />
                    </div>

                    <div className="flex justify-between items-center px-2 pb-1">
                      <span className="text-[12px] font-bold truncate pr-2 uppercase tracking-tight text-white/90">
                        {photo.title}
                      </span>
                      <Heart size={14} className="text-pink-400 fill-pink-400 group-hover:scale-125 transition-transform" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </main>

            <footer className="py-8 text-center border-t border-white/10 mx-6">
              <div className="flex justify-center gap-4 mb-4 opacity-50">
                <Smartphone size={16} />
                <Gamepad2 size={16} />
              </div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-blue-100/40 font-bold">
                Created by Indra Suliwa ( Supri)
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}