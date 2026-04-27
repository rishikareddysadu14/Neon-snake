import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Zap, Activity, Cpu } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-dark-bg selection:bg-neon-cyan selection:text-dark-bg py-10 px-6 overflow-x-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-pink/5 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03]" 
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Global Navigation / Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-neon-cyan rounded flex items-center justify-center">
                <Zap className="text-dark-bg" size={20} fill="currentColor" />
              </div>
              <h1 className="text-2xl font-display font-black tracking-tighter text-white">
                NEON<span className="text-neon-cyan">RHYTHM</span>
              </h1>
            </div>
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.4em] ml-11">
              Experimental Core v2.4.0
            </p>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/5 rounded-full">
              <Activity size={14} className="text-neon-green" />
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">System Stable</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/5 rounded-full">
              <Cpu size={14} className="text-neon-cyan" />
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Neural Link Active</span>
            </div>
          </div>
        </header>

        {/* Main Interface Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Stats & Secondary Meta */}
          <section className="hidden lg:flex lg:col-span-3 flex-col gap-8">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
              <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-6">User Telemetry</h4>
              <div className="space-y-6">
                {[
                  { label: 'Neural Sync', value: '98.2%', color: 'bg-neon-cyan' },
                  { label: 'Latency', value: '4ms', color: 'bg-neon-green' },
                  { label: 'Buffer', value: 'Locked', color: 'bg-neon-pink' }
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="flex justify-between text-[11px] font-display font-medium text-white/70 mb-2">
                       <span>{stat.label}</span>
                       <span>{stat.value}</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${stat.color} w-3/4 opacity-50`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-neon-pink/10 blur-2xl group-hover:bg-neon-pink/20 transition-colors" />
               <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4">Firmware Notes</h4>
               <p className="text-xs text-gray-400 leading-relaxed font-mono">
                  The rhythm engine dynamically adjusts background visuals based on your snake precision. Maintain streak for overdrive.
               </p>
            </div>
          </section>

          {/* Center Column: The Game */}
          <section className="lg:col-span-6 flex flex-col items-center">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full"
            >
              <div className="mb-4 text-center">
                <span className="text-[10px] font-mono text-neon-cyan/60 uppercase tracking-[0.5em]">Game Window - 01</span>
              </div>
              <SnakeGame />
            </motion.div>
          </section>

          {/* Right Column: Audio Hub */}
          <section className="lg:col-span-3 flex flex-col items-center lg:items-end gap-12">
            <motion.div 
               initial={{ x: 20, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ duration: 0.5, delay: 0.4 }}
               className="w-full"
            >
               <div className="mb-4 text-right hidden lg:block">
                <span className="text-[10px] font-mono text-neon-pink/60 uppercase tracking-[0.5em]">Audio Module - 02</span>
              </div>
              <MusicPlayer />
            </motion.div>

            {/* Simple Volume / Context Visualizer */}
            <div className="hidden lg:flex w-full flex-col gap-4">
              <div className="flex justify-between items-center text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                <span>Spectral Analysis</span>
                <span>Active</span>
              </div>
              <div className="flex items-center gap-1.5 h-16 w-full">
                {Array.from({ length: 16 }).map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: [`${20 + Math.random() * 80}%`, `${20 + Math.random() * 80}%`] }}
                    transition={{ duration: 0.5 + Math.random(), repeat: Infinity, repeatType: 'reverse' }}
                    className="flex-1 rounded-full bg-white/5 hover:bg-neon-pink/30 transition-colors"
                  />
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
          <p>© 2026 ARCHIVE-NEON_RHYTHM</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-neon-cyan transition-colors">Documentation</a>
            <a href="#" className="hover:text-neon-cyan transition-colors">Hardcore Mode</a>
            <a href="#" className="hover:text-neon-cyan transition-colors">Terminals</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
