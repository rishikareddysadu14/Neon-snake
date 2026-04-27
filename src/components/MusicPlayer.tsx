import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Music2, Share2, Volume2, Repeat, Shuffle } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Drift",
    artist: "AI Gen: Alpha",
    duration: "3:42",
    color: "from-neon-cyan/40",
    accent: "text-neon-cyan"
  },
  {
    id: 2,
    title: "Cyber Pulse",
    artist: "AI Gen: Beta",
    duration: "4:15",
    color: "from-neon-pink/40",
    accent: "text-neon-pink"
  },
  {
    id: 3,
    title: "Synth Wave",
    artist: "AI Gen: Gamma",
    duration: "2:58",
    color: "from-neon-green/40",
    accent: "text-neon-green"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);
  const track = TRACKS[currentTrackIndex];

  // Simulation of progress
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 0.1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  return (
    <div className="w-full max-w-[450px]">
      <div className="relative p-6 bg-dark-card border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        {/* Abstract Background Glow */}
        <div className={`absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br ${track.color} to-transparent blur-[80px] opacity-30`} />
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
              <Music2 size={16} className={track.accent} />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-400">Rhythm Engine v1.0</span>
          </div>
          <button className="text-gray-500 hover:text-white transition-colors">
            <Share2 size={18} />
          </button>
        </div>

        {/* Track Info */}
        <div className="flex items-center gap-8 mb-10 relative z-10">
          <motion.div 
            key={track.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${track.color} to-transparent border border-white/10 flex items-center justify-center shadow-lg overflow-hidden shrink-0`}
          >
             {/* Visualizer animation when playing */}
             <div className="flex items-end gap-[3px] h-12">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div 
                    key={i}
                    animate={isPlaying ? { height: ['20%', '100%', '40%', '80%', '20%'] } : { height: '20%' }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                    className={`w-1.5 rounded-full bg-current ${track.accent}`}
                  />
                ))}
             </div>
          </motion.div>

          <div className="flex flex-col min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={track.id}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
              >
                <h3 className="text-2xl font-display font-bold text-white truncate mb-1">
                  {track.title}
                </h3>
                <p className="text-sm font-mono text-gray-500 uppercase tracking-widest">
                  {track.artist}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 relative z-10">
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full bg-gradient-to-r from-transparent to-current ${track.accent} shadow-[0_0_10px_rgba(var(--current-color),0.5)]`}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between mt-2 font-mono text-[10px] text-gray-500 uppercase tracking-tighter">
            <span>0:42</span>
            <span>{track.duration}</span>
          </div>
        </div>

        {/* Essential Controls */}
        <div className="flex items-center justify-center gap-8 mb-8 relative z-10">
          <button 
            onClick={handlePrev}
            className="text-gray-400 hover:text-white hover:scale-110 active:scale-95 transition-all"
          >
            <SkipBack size={24} fill="currentColor" />
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              isPlaying ? 'bg-white text-dark-bg' : 'bg-neon-cyan text-dark-bg neon-glow-cyan'
            } hover:scale-105 active:scale-95`}
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
          </button>

          <button 
            onClick={handleNext}
            className="text-gray-400 hover:text-white hover:scale-110 active:scale-95 transition-all"
          >
            <SkipForward size={24} fill="currentColor" />
          </button>
        </div>

        {/* Footer Meta Controls */}
        <div className="flex justify-between items-center py-4 border-t border-white/5 relative z-10 px-2">
           <Volume2 size={16} className="text-gray-600 hover:text-white cursor-pointer" />
           <div className="flex gap-6">
              <Shuffle size={14} className="text-gray-600 hover:text-neon-cyan cursor-pointer transition-colors" />
              <Repeat size={14} className="text-gray-600 hover:text-neon-cyan cursor-pointer transition-colors" />
           </div>
        </div>
      </div>

       {/* Playlist Preview */}
       <div className="mt-4 flex gap-2">
          {TRACKS.map((t, idx) => (
            <button 
              key={t.id}
              onClick={() => { setCurrentTrackIndex(idx); setProgress(0); setIsPlaying(true); }}
              className={`flex-1 py-3 px-4 rounded-xl border transition-all truncate text-[10px] font-mono tracking-widest uppercase ${
                currentTrackIndex === idx 
                ? `bg-white/5 border-neon-cyan/50 text-neon-cyan` 
                : 'bg-white/[0.02] border-white/5 text-gray-500 hover:bg-white/5'
              }`}
            >
              {t.title}
            </button>
          ))}
       </div>
    </div>
  );
}
