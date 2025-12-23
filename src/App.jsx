import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Heart, Gamepad2, Smartphone, X, Play, Film } from 'lucide-react';

// --- DATA CONFIGURATION ---
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

const robloxVideos = [
  { id: 1, url: '/VIDEOS/vid1.mp4', title: 'Epic Moment 1', thumb: '/IMAGES/1.png' },
  { id: 2, url: '/VIDEOS/vid2.mp4', title: 'Lucu Banget', thumb: '/IMAGES/2.png' },
];

// --- BACKGROUND EFFECT: SHOOTING STARS ---
const ShootingStars = () => {
  const stars = Array.from({ length: 10 });
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: `${Math.random() * 50}%`, left: `${Math.random() * 100}%` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ x: [0, 400], y: [0, 400], opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{ duration: Math.random() * 2 + 1.5, repeat: Infinity, delay: Math.random() * 10, ease: "easeIn" }}
        >
          <div className="w-20 h-[2px] bg-gradient-to-r from-white to-transparent -rotate-45 blur-[1px]" />
          <div className="absolute left-0 top-0 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]" />
        </motion.div>
      ))}
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [isVideoSection, setIsVideoSection] = useState(false);
  
  const audioRef = useRef(new Audio('/MUSIC/AUDIO.mp3'));
  const videoSectionRef = useRef(null);

  // Smooth Scroll & Color Transition Logic
  useEffect(() => {
    const handleScroll = () => {
      if (videoSectionRef.current) {
        const rect = videoSectionRef.current.getBoundingClientRect();
        // Trigger transisi warna saat section video terlihat 50% di layar
        setIsVideoSection(rect.top < window.innerHeight * 0.5);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEnter = () => {
    setHasEntered(true);
    setIsPlaying(true);
    audioRef.current.play().catch(() => console.log("Audio blocked"));
    audioRef.current.loop = true;
  };

  const toggleMusic = () => {
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="text-white min-h-screen font-sans selection:bg-purple-500 overflow-x-hidden">
      
      {/* 1. LAYER BACKGROUND DINAMIS (Smooth Transition) */}
      <div 
        className={`fixed inset-0 z-[-2] transition-colors duration-[1500ms] ease-in-out ${
          isVideoSection ? 'bg-[#1a0b2e]' : 'bg-[#0f172a]'
        }`} 
      />
      
      {/* GRADIENT OVERLAY (Blue Glass vs Purple Glass) */}
      <div 
        className={`fixed inset-0 z-[-1] transition-opacity duration-[1500ms] ease-in-out bg-gradient-to-br from-[#2e1065] via-[#4c1d95] to-[#7c3aed] ${
          isVideoSection ? 'opacity-80' : 'opacity-0'
        }`} 
      />
      <div 
        className={`fixed inset-0 z-[-1] transition-opacity duration-[1500ms] ease-in-out bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0ea5e9] ${
          isVideoSection ? 'opacity-0' : 'opacity-100'
        }`} 
      />

      <ShootingStars />

      {/* 2. ENTRANCE OVERLAY */}
      <AnimatePresence>
        {!hasEntered && (
          <motion.div 
            key="entrance"
            exit={{ opacity: 0, scale: 2, filter: "blur(20px)" }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0ea5e9] p-6 text-center"
          >
            <motion.div animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="mb-8">
              <Gamepad2 size={100} className="text-white drop-shadow-lg" />
            </motion.div>
            <h1 className="text-4xl font-black mb-8 tracking-tighter uppercase">POTO ROBLOK <br/> BY INDRA</h1>
            <button 
              onClick={handleEnter} 
              className="bg-white/20 backdrop-blur-lg border border-white/30 px-12 py-4 rounded-2xl font-bold text-lg shadow-2xl active:scale-95 transition-all"
            >
              KLIK DISINI ANJAYY 🚀
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. MAIN CONTENT */}
      <AnimatePresence>
        {hasEntered && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            
            {/* NAVBAR */}
            <nav className="fixed top-0 left-0 w-full z-40 p-4">
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 mx-auto max-w-lg px-5 py-3 rounded-2xl flex justify-between items-center shadow-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center font-bold text-[10px]">RBX</div>
                  <span className="font-bold text-xs italic uppercase tracking-widest">Indra Gallery</span>
                </div>
                <button onClick={toggleMusic} className="p-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                  {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
              </div>
            </nav>

            <main className="max-w-5xl mx-auto px-4">
              {/* SECTION: PHOTOS */}
              <section className="pt-32 pb-20 text-center">
                <header className="mb-12">
                  <h2 className="text-4xl font-black uppercase tracking-tighter drop-shadow-lg">Gallery Rosblok 🧊</h2>
                  <p className="text-blue-100 text-sm opacity-60 italic">"Melihat kegabutan saya dalam meng-scinsut roblog"</p>
                </header>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {robloxPhotos.map((photo, index) => (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: (index % 4) * 0.1 }}
                      whileHover={{ y: -10 }}
                      onClick={() => setSelectedImg(photo.url)}
                      className="bg-white/10 backdrop-blur-md border border-white/20 p-2.5 rounded-3xl shadow-xl group cursor-pointer"
                    >
                      <div className="aspect-square rounded-2xl overflow-hidden relative">
                        <img src={photo.url} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" alt={photo.title} />
                      </div>
                      <div className="mt-3 flex justify-between items-center px-1">
                        <span className="text-[10px] font-bold uppercase opacity-80 tracking-widest">{photo.title}</span>
                        <Heart size={14} className="text-pink-500 fill-pink-500 group-hover:scale-125 transition-transform" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* SECTION: VIDEOS */}
              <section ref={videoSectionRef} className="py-40 min-h-screen border-t border-white/5">
                <div className="text-center mb-16">
                   <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-bold mb-4 animate-bounce transition-colors duration-500 ${isVideoSection ? 'bg-purple-600' : 'bg-blue-600'}`}>
                     <Film size={14} /> NEW CLIPS
                   </div>
                   <h2 className="text-5xl font-black uppercase italic tracking-tighter drop-shadow-lg">Epic Moments! 🎬</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {robloxVideos.map((video) => (
                    <motion.div 
                      key={video.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl group hover:border-purple-500/50 transition-all duration-500"
                    >
                      <div className="aspect-video bg-black relative">
                        <video src={video.url} controls className="w-full h-full object-cover" poster={video.thumb} />
                      </div>
                      <div className={`p-6 transition-colors duration-1000 ${isVideoSection ? 'bg-purple-900/20' : 'bg-blue-900/20'}`}>
                        <h3 className="text-xl font-bold italic tracking-tight uppercase">{video.title}</h3>
                        <p className="text-[10px] opacity-40 uppercase tracking-[0.3em]">Cinematic Experience</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </main>

            {/* FOOTER */}
            <footer className="py-20 text-center border-t border-white/5 mx-6">
              <div className="flex justify-center gap-6 mb-6 opacity-30">
                <Smartphone size={20} />
                <Gamepad2 size={20} />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.5em] opacity-40">Created by Indra Suliwa (Supri)</p>
            </footer>

          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. MODAL ZOOM PHOTO */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.button className="absolute top-6 right-6 p-3 bg-white/10 rounded-full hover:bg-white/20"><X size={24} /></motion.button>
            <motion.img 
              initial={{ scale: 0.8, rotate: -5 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              src={selectedImg} className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border border-white/20" 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}