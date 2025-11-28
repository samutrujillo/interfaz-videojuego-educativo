import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { Lightbulb, Sun, Cloud, CloudOff, Wind, BatteryCharging } from 'lucide-react';
import { Button } from './ui/button';
import { Logo } from './Logo';
import { TrainCharacter } from './TrainCharacter';
import { GameDragLayer } from './GameDragLayer';

interface HouseData {
  id: number;
  type: 'house' | 'building';
  x: number;
  y: number;
  lightsOn: boolean;
  hasPanel: boolean;
}

interface Station3GameProps {
  onComplete: () => void;
}

const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// --- Components ---

function MovingTrainGuide({ message, mood }: { message: string; mood: 'happy' | 'neutral' }) {
  return (
    <motion.div
      className="fixed top-16 md:top-32 z-50 pointer-events-none"
      initial={{ x: -400 }}
      animate={{ x: '120vw' }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
    >
      <div className="relative flex flex-col items-center mb-4">
        {/* Bubble */}
        <div className="mb-2 bg-white border-4 border-green-500 p-4 rounded-2xl shadow-lg w-64 text-center relative">
          <p className="font-bold text-slate-800 text-lg">{message}</p>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-5 h-5 bg-white border-b-4 border-r-4 border-green-500 rotate-45"></div>
        </div>
        
        {/* Character */}
        <div className="transform scale-x-[-1]"> {/* Face right */}
           <TrainCharacter isHappy={mood === 'happy'} size="medium" />
        </div>
      </div>
    </motion.div>
  );
}

function DraggablePanel() {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'solar-panel',
    item: {},
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div 
      ref={drag} 
      className={`cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50' : 'opacity-100'} m-2 touch-none relative z-50`}
      style={{ touchAction: 'none' }}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl border-2 border-blue-300 flex items-center justify-center shadow-lg relative overflow-hidden group">
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[1px] bg-blue-900 opacity-30">
             <div></div><div></div><div></div><div></div>
          </div>
          <Sun className="text-yellow-300 w-8 h-8 md:w-10 md:h-10 relative z-10 animate-[spin_10s_linear_infinite]" />
          <div className="absolute inset-0 bg-white/20 group-hover:animate-pulse"></div>
        </div>
        <p className="text-center font-bold text-blue-900 mt-1 text-[10px] md:text-sm">Panel Solar</p>
      </motion.div>
    </div>
  );
}

function ModernBuilding({ data, onToggleLight, onPlacePanel }: { data: HouseData; onToggleLight: (id: number) => void; onPlacePanel: (id: number) => void }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'solar-panel',
    drop: () => onPlacePanel(data.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  // Modern styling based on type
  const isHighRise = data.type === 'building';
  
  return (
    <motion.div 
      className="absolute flex flex-col items-center transform-style-3d"
      style={{ left: `${data.x}%`, top: `${data.y}%`, zIndex: Math.floor(data.y) }}
      initial={{ y: 100, opacity: 0, rotateX: 90 }}
      animate={{ y: 0, opacity: 1, rotateX: 0 }}
      transition={{ duration: 0.8, delay: data.id * 0.2, type: "spring" }}
    >
      {/* 3D Building Construction */}
      <div className="relative preserve-3d group">
         
         {/* Shadow */}
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-8 bg-black/30 blur-md rounded-full transform rotate-x-90 translate-y-4 z-[-1]"></div>

         {/* Roof / Solar Panel Area */}
         <div ref={drop} className="relative z-20 -mb-1 w-full flex justify-center transform-style-3d">
            <motion.div 
               className={`
               relative transition-all duration-500 flex items-center justify-center shadow-lg
               ${isHighRise ? 'w-16 md:w-28 h-8 md:h-12' : 'w-20 md:w-36 h-10 md:h-16'}
               ${data.hasPanel ? 'bg-blue-900 border-blue-600' : 'bg-slate-700 border-slate-600'}
               border-b-8 rounded-t-lg
               `}
               style={{ 
                  transform: isHighRise ? 'translateZ(20px)' : 'translateZ(10px) rotateX(10deg)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
               }}
               animate={isOver && !data.hasPanel ? { scale: 1.1, borderColor: '#4ade80', y: -10 } : { scale: 1, y: 0 }}
            >
               {data.hasPanel ? (
                  <motion.div 
                  initial={{ scale: 0, y: -50 }} 
                  animate={{ scale: 1, y: 0 }} 
                  className="w-full h-full flex items-center justify-center overflow-hidden relative rounded-t-md"
                  >
                     <div className="w-full h-full grid grid-cols-4 gap-[1px] bg-blue-400 opacity-60 transform skew-x-12">
                        <div className="bg-blue-950"></div><div className="bg-blue-900"></div>
                        <div className="bg-blue-950"></div><div className="bg-blue-900"></div>
                     </div>
                     {/* Shiny reflection */}
                     <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-50"></div>
                     <div className="absolute top-0 right-0 w-4 h-4 bg-white rounded-full blur-md"></div>
                  </motion.div>
               ) : (
                  <>
                  <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity ${isOver ? 'opacity-0' : 'opacity-100'}`}>
                     <div className="bg-yellow-400/90 text-slate-900 text-[8px] md:text-xs font-bold px-2 py-1 rounded shadow-sm border border-yellow-600 animate-pulse whitespace-nowrap transform -translate-y-4">
                        Energía Solar
                     </div>
                  </div>
                  {isOver && (
                     <div className="absolute inset-0 bg-green-400/50 flex items-center justify-center text-[8px] md:text-xs text-white font-bold animate-pulse rounded-t-md">
                        ¡Suelta Aquí!
                     </div>
                  )}
                  </>
               )}
            </motion.div>
         </div>

         {/* Building Body - 3D Box Illusion */}
         <div className={`
            relative z-10 flex flex-col items-center justify-start shadow-[inset_0_0_30px_rgba(0,0,0,0.1)] overflow-hidden
            ${isHighRise ? 'w-16 md:w-28 h-28 md:h-56 bg-gradient-to-b from-sky-100 to-sky-300' : 'w-20 md:w-36 h-16 md:h-32 bg-gradient-to-b from-gray-100 to-gray-300'}
            border-x-2 border-b-8 border-slate-400 rounded-b-lg
         `}>
            {/* Side Walls (Pseudo-3D) */}
            <div className="absolute top-0 bottom-0 right-0 w-2 bg-black/20"></div>
            <div className="absolute top-0 bottom-0 left-0 w-2 bg-white/40"></div>

            {/* Glass Reflection Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 pointer-events-none z-20"></div>

            {/* Windows Grid */}
            <div className="flex flex-wrap justify-center content-start gap-2 md:gap-3 p-2 md:p-4 z-30 w-full h-full">
               {[...Array(isHighRise ? 6 : 2)].map((_, i) => (
                  <motion.button
                  key={i}
                  whileTap={{ scale: 0.9, translateZ: -5 }}
                  onClick={() => onToggleLight(data.id)}
                  className={`
                     rounded-md flex items-center justify-center transition-all duration-300 relative overflow-hidden shadow-md
                     ${isHighRise ? 'w-8 h-8 md:w-10 md:h-10' : 'w-8 h-8 md:w-12 md:h-12'}
                     ${data.lightsOn 
                        ? 'bg-yellow-200 border-yellow-400 shadow-[0_0_20px_rgba(253,224,71,0.8)]' 
                        : 'bg-slate-800 border-slate-600 shadow-inner'}
                     border-2
                  `}
                  >
                  {data.lightsOn && <div className="absolute inset-0 bg-white/50 blur-sm rounded-full transform scale-50"></div>}
                  </motion.button>
               ))}
            </div>

            {/* Entrance */}
            <div className="w-8 md:w-14 h-10 md:h-16 bg-slate-800 mt-auto rounded-t-lg border-4 border-slate-600 relative shadow-inner flex items-end justify-center">
               <div className="w-full h-1 bg-blue-400/50 shadow-[0_0_10px_#60a5fa]"></div>
            </div>
         </div>
      </div>
    </motion.div>
  );
}

const WindTurbine = ({ delay, x, scale }: { delay: number, x: string, scale: number }) => (
  <div className="absolute bottom-32 z-0 pointer-events-none opacity-80" style={{ left: x, transform: `scale(${scale})` }}>
    <div className="relative flex flex-col items-center">
      <motion.div 
        className="w-32 h-32 md:w-48 md:h-48 absolute -top-16 md:-top-24 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear", delay }}
      >
        <div className="w-2 h-full bg-white/90 rounded-full absolute shadow-lg"></div>
        <div className="h-2 w-full bg-white/90 rounded-full absolute shadow-lg"></div>
      </motion.div>
      <div className="w-2 h-32 md:h-48 bg-gradient-to-b from-white to-gray-300"></div>
    </div>
  </div>
);

function AnimatedBackground({ completed }: { completed: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden transition-colors duration-2000 bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-700 perspective-[1000px]">
      {/* Sun/Moon */}
      <motion.div 
        className="absolute top-8 right-8 w-24 h-24 bg-yellow-200 rounded-full shadow-[0_0_80px_rgba(253,224,71,0.6)] z-0"
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: completed ? 1 : 0.8
        }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ transform: 'translateZ(-200px)' }}
      >
      </motion.div>

      {/* Wind Turbines - Far Background */}
      <div className="absolute inset-0 transform-style-3d">
        <div style={{ transform: 'translateZ(-100px)' }}>
           <WindTurbine delay={0} x="10%" scale={0.6} />
           <WindTurbine delay={1.5} x="85%" scale={0.8} />
           <WindTurbine delay={0.8} x="40%" scale={0.5} />
        </div>
      </div>

      {/* Clouds 3D Layers */}
      <motion.div 
         className="absolute top-20 left-[10%] z-10"
         animate={{ x: ['-5vw', '5vw', '-5vw'] }}
         transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
         style={{ transform: 'translateZ(-50px)' }}
      >
        <Cloud className="w-32 h-16 text-white/20 fill-current filter drop-shadow-xl" />
      </motion.div>
      
      {/* 3D Ground Grid (Tron style or City Grid) */}
      <div className="absolute bottom-0 w-full h-[50%] origin-bottom transform rotate-x-60 perspective-[500px] overflow-hidden z-0">
          <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(255,255,255,.1)_25%,rgba(255,255,255,.1)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.1)_75%,rgba(255,255,255,.1)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(255,255,255,.1)_25%,rgba(255,255,255,.1)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.1)_75%,rgba(255,255,255,.1)_76%,transparent_77%,transparent)] bg-[length:50px_50px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 via-transparent to-transparent"></div>
      </div>

      {/* Pollution/Smog overlay 3D */}
      {!completed && (
        <motion.div 
          className="absolute inset-0 z-20 pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
           {/* 3D Smog Clouds */}
           {[...Array(6)].map((_, i) => (
             <motion.div
               key={i}
               className="absolute bottom-0 bg-gray-500/30 blur-3xl rounded-full"
               style={{ 
                  width: '300px', height: '200px',
                  left: `${Math.random() * 100}%`,
                  transform: `translateZ(${Math.random() * 100}px)`
               }}
               animate={{ 
                  y: [-50, -150, -50], 
                  x: [0, 50, 0],
                  opacity: [0.4, 0.7, 0.4] 
               }}
               transition={{ duration: 10, repeat: Infinity, delay: i * 2 }}
             />
           ))}
        </motion.div>
      )}
      
      {/* Clean Air / Northern Lights Effect when clean */}
      {completed && (
         <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
             <motion.div 
               className="absolute inset-0 bg-gradient-to-t from-green-500/20 via-blue-500/10 to-transparent"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 2 }}
             />
             {/* Aurora Borealis simulation */}
             <motion.div
                className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(74,222,128,0.1)_50deg,transparent_100deg)] blur-3xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
             />
         </div>
      )}

      {/* Distant City Silhouette - 3D Parallax Layer */}
      <div className="absolute bottom-20 left-0 right-0 h-40 opacity-40 z-0" style={{ transform: 'translateZ(-150px) scale(1.2)' }}>
         <svg viewBox="0 0 1200 320" className="w-full h-full fill-indigo-950 drop-shadow-2xl" preserveAspectRatio="none">
             <path d="M0,320 L100,200 L200,320 L250,150 L350,320 L450,250 L600,320 L800,100 L900,320 L1000,180 L1200,320 Z" />
         </svg>
      </div>
    </div>
  );
}

function GameContent({ onComplete }: { onComplete: () => void }) {
  const [houses, setHouses] = useState<HouseData[]>([
    // Layout adjusted for mobile/tablet overlap
    { id: 1, type: 'house', x: 10, y: 35, lightsOn: true, hasPanel: false },
    { id: 2, type: 'building', x: 38, y: 20, lightsOn: true, hasPanel: false },
    { id: 3, type: 'house', x: 65, y: 45, lightsOn: true, hasPanel: false },
    { id: 4, type: 'building', x: 85, y: 25, lightsOn: true, hasPanel: false },
  ]);

  const [guideMessage, setGuideMessage] = useState("¡Modernicemos la ciudad! Usa energía solar. ☀️");

  const handleToggleLight = (id: number) => {
    setHouses(prev => prev.map(h => h.id === id ? { ...h, lightsOn: !h.lightsOn } : h));
    
    const house = houses.find(h => h.id === id);
    if (house?.lightsOn) { // If it was on and we turned it off
        setGuideMessage("¡Bien! Apagando luces innecesarias. 💡");
    }
  };

  const handlePlacePanel = (id: number) => {
    setHouses(prev => prev.map(h => h.id === id ? { ...h, hasPanel: true } : h));
    setGuideMessage("¡Panel instalado! Energía limpia generada. ⚡");
  };

  const allLightsOff = houses.every(h => !h.lightsOn);
  const allPanelsPlaced = houses.every(h => h.hasPanel);
  const isComplete = allLightsOff && allPanelsPlaced;

  useEffect(() => {
    if (isComplete) {
      setGuideMessage("¡Ciudad Futura completada! 🚀");
    }
  }, [isComplete]);

  return (
    <div className="w-full h-full relative overflow-hidden font-sans flex flex-col bg-sky-200 select-none">
      <GameDragLayer />
      
      {/* Background with Smog/Clean states */}
      <AnimatedBackground completed={isComplete} />
      
      {/* Header */}
      <div className="relative z-40 p-2 md:p-4 flex flex-col items-center shrink-0">
        <Logo />
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-2 bg-white/90 backdrop-blur-md px-4 py-2 md:px-6 md:py-3 rounded-full shadow-xl border-4 border-yellow-400 flex items-center gap-2"
        >
           <BatteryCharging className="w-5 h-5 md:w-6 md:h-6 text-green-600 animate-pulse" />
           <h2 className="text-lg md:text-3xl font-black text-slate-800 tracking-tight uppercase">
             Estación Cuidado
           </h2>
        </motion.div>
      </div>

      {/* Train Guide (Moving) */}
      <MovingTrainGuide message={guideMessage} mood={isComplete ? 'happy' : 'neutral'} />

      {/* Game Area - 3D Perspective */}
      <div className="relative z-30 flex-grow w-full max-w-6xl mx-auto mt-4 perspective-[1200px] overflow-hidden">
        
        {/* 3D Ground Plane for Houses */}
        <div 
           className="relative w-full h-full md:h-[500px] transform-style-3d origin-center pb-32 md:pb-0"
           style={{ transform: 'translateY(60px)' }} 
        >
            {/* On mobile we flatten the 3D slightly to make it easier to hit targets and see layout */}
            <style>{`
              @media (min-width: 768px) {
                 .transform-style-3d { transform: rotateX(20deg) translateY(150px) !important; }
              }
            `}</style>
            
            {/* Ground Shadow/Glow */}
            <div className="absolute inset-x-10 inset-y-0 bg-white/5 blur-3xl rounded-full"></div>

           {houses.map(house => (
             <ModernBuilding 
               key={house.id} 
               data={house} 
               onToggleLight={handleToggleLight} 
               onPlacePanel={handlePlacePanel}
             />
           ))}
        </div>

        {/* Bottom Control Panel */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg p-4 rounded-t-[2rem] shadow-[0_-10px_50px_rgba(0,0,0,0.2)] flex justify-between items-center max-w-4xl mx-auto border-t-4 border-blue-400 z-50 pb-8 md:pb-4">
           
           {/* Solar Panel Source */}
           <div className="flex items-center gap-4 pl-4">
              <div className="hidden md:block text-sm font-bold text-slate-500 w-24 text-right leading-tight">
                Arrastra los paneles solares
              </div>
              <DraggablePanel />
           </div>

           {/* Status Indicators */}
           <div className="flex gap-4 md:gap-12 pr-4">
              <div className={`flex flex-col items-center transition-colors ${allLightsOff ? 'text-green-600' : 'text-slate-400'}`}>
                 <Lightbulb className={`w-8 h-8 ${allLightsOff ? 'animate-bounce' : ''}`} />
                 <span className="font-bold text-xs md:text-sm mt-1">Luces</span>
              </div>
              <div className={`flex flex-col items-center transition-colors ${allPanelsPlaced ? 'text-green-600' : 'text-slate-400'}`}>
                 <Sun className={`w-8 h-8 ${allPanelsPlaced ? 'animate-spin' : ''}`} />
                 <span className="font-bold text-xs md:text-sm mt-1">Solar</span>
              </div>
           </div>

           {/* Completion Button */}
           {isComplete && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-20 left-1/2 -translate-x-1/2 md:static md:transform-none md:ml-4"
              >
                 <Button 
                   onClick={onComplete}
                   className="bg-green-500 hover:bg-green-600 text-white font-black py-4 px-8 rounded-full shadow-2xl animate-bounce text-lg border-4 border-white ring-4 ring-green-200"
                 >
                   ¡Siguiente! ➡️
                 </Button>
              </motion.div>
           )}
        </div>

      </div>

      {/* Success Overlay Effects */}
      {isComplete && (
         <>
           {/* Fireworks/Confetti */}
           {[...Array(15)].map((_, i) => (
             <motion.div
               key={i}
               className="absolute w-3 h-3 rounded-full z-20"
               style={{ 
                 backgroundColor: ['#facc15', '#4ade80', '#3b82f6'][i % 3],
                 left: `${Math.random() * 100}%`,
                 top: `${Math.random() * 100}%`
               }}
               initial={{ scale: 0 }}
               animate={{ scale: [0, 1.5, 0], y: -150 }}
               transition={{ duration: 2.5, repeat: Infinity, delay: Math.random() * 2 }}
             />
           ))}
           
           {/* Big Message */}
           <motion.div
             className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-center pointer-events-none w-full"
             initial={{ scale: 0, rotate: -5 }}
             animate={{ scale: 1, rotate: 0 }}
           >
              <h2 className="text-4xl md:text-6xl font-black text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.2)] tracking-tighter">
                 ¡ENERGÍA LIMPIA!
              </h2>
           </motion.div>
         </>
      )}

    </div>
  );
}

export function Station3Game({ onComplete }: Station3GameProps) {
  // Force TouchBackend with mouse events enabled for universal support (Tablet/Mobile/Desktop)
  // This fixes issues where hybrid devices or some mobile browsers fail to detect touch support correctly
  // or where HTML5Backend doesn't handle touch events at all.
  const backendOptions = { 
    enableMouseEvents: true, 
    delayTouchStart: 0, 
    ignoreContextMenu: true
  };
  
  return (
    <DndProvider backend={TouchBackend} options={backendOptions}>
      <GameContent onComplete={onComplete} />
    </DndProvider>
  );
}
