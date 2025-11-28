import { motion } from 'motion/react';
import { TrainCharacter } from './TrainCharacter';
import { Check, Recycle, Waves, Sun, Zap, Trees, Sprout, Building2, Lightbulb, Fish, Mountain } from 'lucide-react';
import { Logo } from './Logo';
import { Avatar } from './AvatarSelection';

interface Station {
  id: number;
  name: string;
  location: string;
  completed: boolean;
  color: string;
}

interface MapScreenProps {
  currentStation: number;
  completedStations: boolean[];
  onStationSelect: (station: number) => void;
  avatar: Avatar | null;
}

export function MapScreen({ currentStation, completedStations, onStationSelect, avatar }: MapScreenProps) {
  const stations: Station[] = [
    { id: 1, name: 'Estación Bosque', location: 'Semillas y Árboles', completed: completedStations[0], color: 'from-emerald-400 to-green-600' },
    { id: 2, name: 'Estación Río', location: 'Agua y Limpieza', completed: completedStations[1], color: 'from-cyan-400 to-blue-600' },
    { id: 3, name: 'Estación Cuidado', location: 'Energía y Consumo', completed: completedStations[2], color: 'from-yellow-400 to-orange-500' },
    { id: 4, name: 'Estación Montaña', location: 'Fauna y Protección', completed: completedStations[3], color: 'from-green-500 to-emerald-700' }
  ];

  // Determine current page based on progress (0 for Stations 1-2, 1 for Stations 3-4)
  const page = currentStation < 2 ? 0 : 1;
  const visibleStations = stations.slice(page * 2, (page + 1) * 2);

  const allCompleted = completedStations.every(s => s);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-400 via-purple-500 to-fuchsia-600 flex flex-col items-center justify-center p-8 relative overflow-hidden perspective-[1200px]">
      {/* 3D Environment - Sky/Background */}
      <div className="absolute inset-0 overflow-hidden transform-style-3d">
         <div className="absolute top-0 left-0 w-full h-[60%] bg-gradient-to-b from-indigo-900/20 to-transparent z-0"></div>
         {/* Floating Islands or clouds in background */}
         <div className="absolute top-20 left-[-10%] w-96 h-40 bg-white/10 blur-3xl rounded-full transform translate-z-[-200px]"></div>
      </div>

      {/* Logo */}
      <div className="absolute top-8 left-8 z-50 scale-75 origin-top-left drop-shadow-xl">
         <Logo />
      </div>

      {/* Avatar Display - Floating Card */}
      {avatar && (
        <motion.div 
          initial={{ x: -100, opacity: 0, rotateY: 30 }}
          animate={{ x: 0, opacity: 1, rotateY: 0 }}
          className="absolute top-4 right-4 z-50 flex items-center bg-white/90 backdrop-blur-md p-2 pr-6 rounded-l-full shadow-[0_10px_30px_rgba(0,0,0,0.2)] border-l-4 border-white"
        >
           <div className={`w-14 h-14 rounded-full ${avatar.color} flex items-center justify-center text-3xl shadow-inner border-2 border-white`}>
             {avatar.emoji}
           </div>
           <div className="ml-3 text-right">
             <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Conductor</p>
             <p className="text-lg font-black text-slate-800">{avatar.name}</p>
           </div>
        </motion.div>
      )}

      {/* Title - Floating */}
      <motion.h2
        className="text-6xl text-center mb-8 text-white drop-shadow-[0_5px_0_rgba(0,0,0,0.2)] mt-20 md:mt-0 font-black tracking-tight relative z-40"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        key={page} 
        style={{ transform: 'translateZ(50px)' }}
      >
        🚂 Mapa - Parte {page + 1}
      </motion.h2>
      
      {/* 3D Map Plane */}
      <div 
         className="relative w-full max-w-5xl flex-grow flex items-center justify-center transform-style-3d"
         style={{ transform: 'rotateX(25deg) translateY(20px)' }}
      >
        {/* Ground/Map Base */}
        <div className="absolute inset-x-0 top-1/4 bottom-1/4 bg-white/10 rounded-[100px] blur-3xl transform translate-z-[-100px]"></div>
        
        {/* Connecting Path - Drawn on ground */}
        <svg className="absolute top-1/2 left-0 w-full h-64 -translate-y-1/2" style={{ transform: 'rotateX(0deg) translateZ(-10px)', opacity: 0.6 }}>
           <motion.path
            d="M 100 120 Q 500 -50, 900 120"
            stroke={allCompleted ? '#10b981' : '#ffffff'}
            strokeWidth="20"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="30,30"
            className="drop-shadow-2xl"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2 }}
          />
        </svg>

        {/* Train traveling on path - 3D */}
        <motion.div
          className="absolute top-0 right-20 z-30"
          animate={{ 
             x: [0, 20, 0],
             y: [0, -10, 0],
             rotateZ: [0, 2, 0]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ transform: 'translateZ(50px)' }}
        >
          <TrainCharacter isHappy={allCompleted} size="medium" />
        </motion.div>

        {/* Stations Grid - Standing up */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 w-full px-8 md:px-20 perspective-[800px]">
          {visibleStations.map((station, index) => (
            <motion.div
              key={station.id}
              className="relative z-20 group"
              initial={{ scale: 0, opacity: 0, rotateX: 90 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              transition={{ delay: index * 0.2, type: "spring", duration: 1.5 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
               {/* Selection Halo */}
               {station.id === currentStation + 1 && (
                  <div className="absolute -inset-6 bg-yellow-400/30 rounded-[3rem] blur-xl animate-pulse transform rotate-x-90 scale-y-50 translate-y-10 -z-10"></div>
               )}

              <motion.button
                onClick={() => {
                  if (station.id === currentStation + 1) {
                    onStationSelect(station.id);
                  }
                }}
                disabled={station.id !== currentStation + 1}
                className={`
                  w-full p-8 rounded-[2.5rem] text-left relative overflow-hidden transition-all transform-style-3d
                  ${station.completed
                    ? `bg-gradient-to-br ${station.color} shadow-[0_20px_50px_rgba(0,0,0,0.3),inset_0_2px_0_rgba(255,255,255,0.4)]`
                    : station.id === currentStation + 1
                    ? 'bg-gradient-to-br from-amber-300 to-orange-400 shadow-[0_30px_60px_rgba(251,191,36,0.4),inset_0_2px_0_rgba(255,255,255,0.6)] ring-4 ring-white'
                    : 'bg-slate-200/50 backdrop-blur-sm shadow-inner cursor-not-allowed border-4 border-white/20'
                  }
                `}
                whileHover={station.id === currentStation + 1 ? { scale: 1.05, translateZ: 20, rotateX: -5 } : {}}
                whileTap={station.id === currentStation + 1 ? { scale: 0.95, translateZ: 0 } : {}}
              >
                 {/* Card Content */}
                <div className="flex items-center justify-between mb-4 relative z-10" style={{ transform: 'translateZ(20px)' }}>
                  <div className={`w-20 h-20 rounded-2xl ${
                    station.completed ? 'bg-white/20' : 'bg-white/80'
                  } backdrop-blur-md flex items-center justify-center shadow-lg border-2 border-white/50`}>
                    {station.completed ? (
                      <Check className="w-10 h-10 text-white drop-shadow-md" strokeWidth={4} />
                    ) : (
                      <div className="transform scale-110">
                        {station.id === 1 && <Recycle className="w-10 h-10 text-blue-600" strokeWidth={2.5} />}
                        {station.id === 2 && <Fish className="w-10 h-10 text-blue-600" strokeWidth={2.5} />}
                        {station.id === 3 && <Zap className="w-10 h-10 text-orange-500" strokeWidth={2.5} />}
                        {station.id === 4 && <Mountain className="w-10 h-10 text-green-600" strokeWidth={2.5} />}
                      </div>
                    )}
                  </div>
                  <motion.div 
                    className="text-6xl filter drop-shadow-lg opacity-90"
                    animate={{ 
                       y: [0, -10, 0],
                       rotate: [0, 5, -5, 0] 
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {station.id === 1 && <Waves className="w-16 h-16 text-white" />}
                    {station.id === 2 && <Waves className="w-16 h-16 text-white" />}
                    {station.id === 3 && <Lightbulb className="w-16 h-16 text-white" />}
                    {station.id === 4 && <Trees className="w-16 h-16 text-white" />}
                  </motion.div>
                </div>
                
                <div className="relative z-10" style={{ transform: 'translateZ(10px)' }}>
                  <h3 className="text-3xl text-white mb-1 font-black tracking-wide drop-shadow-md">
                    Estación {station.id}
                  </h3>
                  <p className="text-xl text-white/90 font-bold uppercase tracking-wider mb-1 drop-shadow-sm">
                    {station.name}
                  </p>
                  <p className="text-lg text-white/80 font-medium bg-black/10 inline-block px-3 py-1 rounded-lg">
                    {station.location}
                  </p>
                </div>

                {/* 3D Depth Thickness (Pseudo-element simulation) */}
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-black/20 blur-sm transform translate-y-2"></div>
              </motion.button>
              
              {/* Floating Badge */}
              <motion.div
                className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-white to-slate-200 rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.3)] z-30 border-4 border-white"
                style={{ transform: 'translateZ(40px)' }}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-3xl font-black text-slate-700">{station.id}</span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Progress indicator - Floating Panel */}
      <motion.div
        className="mt-8 bg-white/90 backdrop-blur-md px-10 py-6 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.2)] z-50 border-b-8 border-slate-200"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, type: 'spring' }}
      >
        <p className="text-2xl text-center text-slate-800 font-black flex items-center gap-3">
           <span className="text-4xl">🌟</span>
          Progreso: {completedStations.filter(s => s).length} de 4 misiones
        </p>
      </motion.div>
    </div>
  );
}
