import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from '@supabase/supabase-js';

import {
  Volume2,
  VolumeX,
  Heart,
  Gamepad2,
  Smartphone,
  X,
  Play,
  Film,
  Trash2
} from "lucide-react";

// --- DATA CONFIGURATION ---
const robloxPhotos = [
  { id: 1, url: "/IMAGES/1.png", title: "Gunung" },
  { id: 2, url: "/IMAGES/2.png", title: "Gunung Lagi" },
  { id: 3, url: "/IMAGES/3.png", title: "Gunung Atin" },
  { id: 4, url: "/IMAGES/4.png", title: "W TIna <3" },
  { id: 5, url: "/IMAGES/5.png", title: "Fish It" },
  { id: 6, url: "/IMAGES/6.png", title: "Fish It Lagi" },
  { id: 7, url: "/IMAGES/7.png", title: "W gustina" },
  { id: 8, url: "/IMAGES/8.png", title: "Gunung Lagi" },
];

const robloxVideos = [
  { id: 1, url: "/VIDEOS/vid1.mp4", title: "Epic Moment 1", thumb: "/IMAGES/1.png" },
  { id: 2, url: "/VIDEOS/vid2.mp4", title: "Lucu Banget", thumb: "/IMAGES/2.png" },
];

// --- SUPABASE CONFIGURATION ---
// PASTI KAN URL DAN KEY SUDAH BENAR DARI DASHBOARD SUPABASE
const supabaseUrl = 'https://fqongxqnqyqesostbmxh.supabase.co'; 
const supabaseKey = 'sb_publishable_KoN2ZHUqJcwnNgUsh0C3uQ_v-iaVPcM'; 
const supabase = createClient(supabaseUrl, supabaseKey);

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

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [isVideoSection, setIsVideoSection] = useState(false);
  const [isAtGuestbook, setIsAtGuestbook] = useState(false);

  // --- STATE BUKU TAMU ---
  const [guestMessages, setGuestMessages] = useState([]);
  const [nameInput, setNameInput] = useState("");
  const [msgInput, setMsgInput] = useState("");
  const [showNotif, setShowNotif] = useState(false);

  const audioRef = useRef(new Audio("/MUSIC/AUDIO.mp3"));
  const videoSectionRef = useRef(null);
  const guestbookRef = useRef(null);

  // 1. Ambil Data Awal dari Supabase
  const fetchMessages = async () => {
    const { data } = await supabase
      .from('supridata')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      const formattedData = data.map(item => ({
        ...item,
        date: new Date(item.created_at).toLocaleDateString()
      }));
      setGuestMessages(formattedData);
    }
  };


  useEffect(() => {
  fetchMessages();

  // Membuka jalur komunikasi real-time
  const channel = supabase
    .channel('perubahan-data')
    .on(
      'postgres_changes', 
      { event: '*', schema: 'public', table: 'supridata' }, 
      (payload) => {
        console.log('Ada data baru masuk!', payload);
        fetchMessages(); // Ambil ulang data secara otomatis
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

  // 2. Fungsi Kirim Pesan
  const handleSendMessage = async (e) => {
  e.preventDefault();
  if (!nameInput.trim() || !msgInput.trim()) return;

  const { error } = await supabase
    .from('supridata')
    .insert([{ name: nameInput, message: msgInput }]);

  if (!error) {
    setNameInput("");
    setMsgInput("");
    
    // Munculkan notifikasi pop-up selama 3 detik
    setShowNotif(true);
    setTimeout(() => setShowNotif(false), 3000);
  }
};

  // 3. Fungsi Hapus
  const deleteMessage = async (id) => {
    const { error } = await supabase.from('supridata').delete().eq('id', id);
    if (!error) {
      setGuestMessages(prev => prev.filter(msg => msg.id !== id));
    }
  };

  // 4. Logic Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (videoSectionRef.current) {
        const rectV = videoSectionRef.current.getBoundingClientRect();
        setIsVideoSection(rectV.top < window.innerHeight * 0.5);
      }
      if (guestbookRef.current) {
        const rectG = guestbookRef.current.getBoundingClientRect();
        setIsAtGuestbook(rectG.top < window.innerHeight * 0.7);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleEnter = () => {
    setHasEntered(true);
    setIsPlaying(true);
    audioRef.current.play().catch(() => {});
    audioRef.current.loop = true;
  };

  const toggleMusic = () => {
    if (isPlaying) { audioRef.current.pause(); } 
    else { audioRef.current.play(); }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="text-white min-h-screen font-sans selection:bg-purple-500 overflow-x-hidden">
      <AnimatePresence>
      {showNotif && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: "-50%" }}
          animate={{ opacity: 1, y: 20, x: "-50%" }}
          exit={{ opacity: 0, y: -50, x: "-50%" }}
          className="fixed top-0 left-1/2 z-[200] bg-[#EEA727] text-black px-6 py-3 rounded-2xl font-bold shadow-2xl border-2 border-white flex items-center gap-3"
        >
          <span>🚀 Pesan Terkirim, Anjayy!</span>
        </motion.div>
      )}
    </AnimatePresence>
      
      {/* 1. LAYER BACKGROUND DINAMIS */}
      <div
        className={`fixed inset-0 z-[-2] transition-colors duration-[1500ms] ease-in-out ${
          isAtGuestbook ? "bg-[#452c00]" : isVideoSection ? "bg-[#1a0b2e]" : "bg-[#0f172a]"
        }`}
      />

      {/* GRADIENT OVERLAY (Blue vs Purple vs Gold EEA727) */}
      <div
        className={`fixed inset-0 z-[-1] transition-opacity duration-[1500ms] ease-in-out bg-gradient-to-br from-[#EEA727]/40 via-[#EEA727]/20 to-transparent ${
          isAtGuestbook ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`fixed inset-0 z-[-1] transition-opacity duration-[1500ms] ease-in-out bg-gradient-to-br from-[#2e1065] via-[#4c1d95] to-[#7c3aed] ${
          isVideoSection && !isAtGuestbook ? "opacity-80" : "opacity-0"
        }`}
      />
      <div
        className={`fixed inset-0 z-[-1] transition-opacity duration-[1500ms] ease-in-out bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0ea5e9] ${
          isVideoSection || isAtGuestbook ? "opacity-0" : "opacity-100"
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
            <motion.div
              animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="mb-8"
            >
              <Gamepad2 size={100} className="text-white drop-shadow-lg" />
            </motion.div>
            <h1 className="text-4xl font-black mb-8 tracking-tighter uppercase">
              POTO ROBLOK <br /> BY INDRA
            </h1>
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

             {/* SECTION: BUKU TAMU (GOLD EEA727) */}
<section ref={guestbookRef} className="mt-40 mb-32 px-4 relative">
  {/* KOTAK INPUT UTAMA */}
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="max-w-3xl mx-auto bg-white/5 backdrop-blur-3xl border border-[#EEA727]/30 rounded-[3rem] p-8 md:p-12 shadow-2xl relative z-10"
  >
    <div className="text-center mb-10">
      <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2 text-[#EEA727]">Buku Tamu ✍️</h2>
      <p className="text-[10px] opacity-50 uppercase tracking-[0.3em] text-white">Tinggalkan pesan di bawah!</p>
    </div>

    <form onSubmit={handleSendMessage} className="space-y-4">
      <input 
        type="text" 
        value={nameInput}
        onChange={(e) => setNameInput(e.target.value)}
        placeholder="Nama / Nickname..." 
        className="w-full bg-black/40 border border-white/10 px-6 py-4 rounded-2xl focus:outline-none focus:border-[#EEA727]/50 transition-all text-sm text-white"
      />
      <textarea 
        rows="3" 
        value={msgInput}
        onChange={(e) => setMsgInput(e.target.value)}
        placeholder="Ketik pesan kerenmu di sini..." 
        className="w-full bg-black/40 border border-white/10 px-6 py-4 rounded-2xl focus:outline-none focus:border-[#EEA727]/50 transition-all resize-none text-sm text-white"
      ></textarea>
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full bg-[#EEA727] text-black py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-orange-900/20 transition-all"
      >
        Kirim Reaksi 🚀
      </motion.button>
    </form>
  </motion.div>

 {/* --- SECTION: BUKU TAMU TERBARU (MARQUEE PANJANG TANPA ICON HAPUS) --- */}
<div className="mt-12 relative overflow-hidden w-full py-10">
  {/* Gradient pemudar agar ujung kiri-kanan smooth */}
  <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-transparent to-transparent z-10 pointer-events-none" />
  <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-transparent to-transparent z-10 pointer-events-none" />

  <motion.div 
    className="flex gap-6 w-max px-4"
    animate={{ x: ["0%", "-50%"] }} 
    transition={{ 
      ease: "linear", 
      duration: 50, // Angka lebih besar = jalan lebih lambat & smooth
      repeat: Infinity 
    }}
  >
    {/* Kita render data 4 kali supaya barisnya jadi sangat panjang dan tidak ada jeda kosong */}
    {[...guestMessages, ...guestMessages, ...guestMessages, ...guestMessages].map((item, index) => (
      <motion.div 
        key={`${item.id}-${index}`}
        whileHover={{ y: -8, scale: 1.02 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl min-w-[300px] max-w-[320px] relative overflow-hidden group"
        style={{ boxShadow: '0 20px 40px -15px rgba(238, 167, 39, 0.2)' }}
      >
        {/* Aksen Emas di Samping */}
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#EEA727] opacity-60" />
        
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-col">
            <span className="text-[13px] font-black text-[#EEA727] uppercase tracking-wider">
              @{item.name}
            </span>
            <span className="text-[10px] opacity-40 italic text-white">
              {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : 'Baru saja'}
            </span>
          </div>
          <Heart size={16} className="text-[#EEA727] opacity-20" />
        </div>
        
        <p className="text-sm opacity-90 leading-relaxed font-medium text-white italic">
          "{item.message}"
        </p>

        {/* Efek Kilau Cahaya yang terus bergerak pelan di dalam kartu */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent z-[-1]"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        />
      </motion.div>
    ))}
  </motion.div>
</div>
</section>
            </main>

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