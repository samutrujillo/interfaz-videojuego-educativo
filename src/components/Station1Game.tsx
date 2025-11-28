import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { Sprout, Trees, Droplets, CloudSun } from 'lucide-react';
import { Button } from './ui/button';
import { Logo } from './Logo';
import { TrainCharacter } from './TrainCharacter';

import { ImageWithFallback } from './figma/ImageWithFallback';
import { GameDragLayer } from './GameDragLayer';

interface Station1GameProps {
  onComplete: () => void;
}

type SpotState = 'empty' | 'seeded' | 'grown';

interface PlantingSpot {
  id: number;
  x: number;
  y: number;
  state: SpotState;
}

const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// --- Assets ---

const Butterfly = ({ color, delay }: { color: string, delay: number }) => (
  <motion.svg
    viewBox="0 0 24 24"
    className={`w-16 h-16 absolute z-50 ${color}`}
    initial={{ scale: 0 }}
    animate={{ 
      scale: 1,
      x: [0, 20, -20, 0], 
      y: [0, -15, 0], 
      rotate: [0, 10, -10, 0] 
    }}
    transition={{ duration: 4, repeat: Infinity, delay }}
    style={{ filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.2))' }}
  >
    <path fill="currentColor" d="M12 2C12 2 11 3 11 5C11 7 12 9 12 9C12 9 13 7 13 5C13 3 12 2 12 2ZM11 5C9 3 5 2 5 5C5 8 9 9 11 9C9 9 6 11 6 14C6 17 9 16 11 14C11 16 10 19 12 21C14 19 13 16 13 14C15 16 18 17 18 14C18 11 15 9 13 9C15 9 19 8 19 5C19 2 15 3 13 5C13 5 11 5 11 5Z" />
  </motion.svg>
);

const BirdSVG = ({ className }: { className?: string }) => (
   <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M21.4 7.5C22.1 6.6 22.5 5.5 22.5 4.3C22.5 2.5 21 1 19.2 1C18.6 1 18 1.2 17.5 1.5C17.2 1.3 16.8 1.2 16.4 1.2C14.5 1.2 13 2.7 13 4.6C13 5.1 13.1 5.5 13.3 5.9C11.8 6.5 10.5 7.5 9.5 8.8C8.8 8.5 8.1 8.4 7.3 8.4C4.4 8.4 2 10.8 2 13.7C2 16.6 4.4 19 7.3 19C9.4 19 11.2 17.8 12.1 16.1C12.6 16.3 13.1 16.4 13.6 16.4C17.5 16.4 20.7 13.2 20.7 9.3C20.7 8.7 20.6 8.1 20.4 7.5H21.4Z" />
   </svg>
);

// --- Components ---

function Tool({ type }: { type: 'seed' | 'water' }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'tool',
    item: { toolType: type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div 
       ref={drag}
       className={`relative z-50 touch-none ${isDragging ? 'opacity-50' : 'opacity-100'}`}
       style={{ touchAction: 'none' }}
    >
       <motion.div
         whileHover={{ scale: 1.1 }}
         whileTap={{ scale: 0.9 }}
         className={`
           w-16 h-16 md:w-24 md:h-24 rounded-2xl flex flex-col items-center justify-center gap-1 md:gap-2 shadow-xl border-4 cursor-grab active:cursor-grabbing
           ${type === 'seed' ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-blue-100 border-blue-300 text-blue-600'}
         `}
       >
          {type === 'seed' ? <Sprout className="w-6 h-6 md:w-10 md:h-10" /> : <Droplets className="w-6 h-6 md:w-10 md:h-10" />}
          <span className="font-bold text-[10px] md:text-sm uppercase">{type === 'seed' ? 'Semillas' : 'Agua'}</span>
          
          {/* Hint badge */}
          <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 bg-white rounded-full p-1 shadow-sm border">
             <span className="text-[10px] md:text-xs font-bold px-1">{type === 'seed' ? '1' : '2'}</span>
          </div>
       </motion.div>
    </div>
  );
}

function Spot({ spot, onInteract }: { spot: PlantingSpot, onInteract: (id: number, tool: 'seed' | 'water') => void }) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'tool',
    drop: (item: { toolType: 'seed' | 'water' }) => onInteract(spot.id, item.toolType),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div 
      ref={drop}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-300"
      style={{ 
         left: `${spot.x}%`, 
         top: `${spot.y}%`,
         transformStyle: 'preserve-3d',
         zIndex: Math.floor(spot.y) // Depth sorting
      }}
    >
       {/* 3D Ground Patch */}
       <motion.div 
         className={`
           w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center relative
           shadow-[0_20px_30px_rgba(0,0,0,0.4)] transition-all duration-500
           ${spot.state === 'empty' ? 'bg-gradient-to-b from-[#8D6E63] to-[#5D4037] ring-4 ring-[#3E2723]' : ''}
           ${spot.state === 'seeded' ? 'bg-gradient-to-b from-[#6D4C41] to-[#4E342E] ring-4 ring-[#3E2723]' : ''}
           ${spot.state === 'grown' ? 'bg-transparent shadow-none' : ''}
           ${isOver ? 'scale-110 shadow-[0_0_30px_rgba(255,215,0,0.6)] ring-[#FFD700]' : ''}
         `}
         style={{ transform: 'rotateX(0deg)' }}
       >
          {/* Inner Hole Depth Effect */}
          {spot.state !== 'grown' && (
             <div className="absolute inset-3 rounded-full bg-[#3E2723] shadow-[inset_0_10px_10px_rgba(0,0,0,0.6)] border-b border-[#5D4037]"></div>
          )}

          {/* Pop-up Content (Counter-rotated to stand up) */}
          <div 
            className="relative z-10 flex items-center justify-center pointer-events-none" 
            style={{ 
               transform: 'rotateX(-45deg) translateY(-30px) scale(1.3)', 
               transformOrigin: 'bottom center',
               filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.3))'
            }}
          >
             {spot.state === 'empty' && (
                <div className="text-amber-100/60 font-black text-xs md:text-sm text-center leading-none tracking-wide">
                   TIERRA<br/>FÉRTIL
                </div>
             )}
             
             {spot.state === 'seeded' && (
                <motion.div 
                   initial={{ scale: 0, rotate: -20 }} 
                   animate={{ scale: 1, rotate: 0 }} 
                   className="bg-white/20 p-2 rounded-full backdrop-blur-sm"
                >
                   <Sprout className="w-12 h-12 text-green-400 fill-green-400" strokeWidth={2} />
                </motion.div>
             )}

             {spot.state === 'grown' && (
                <div className="relative">
                   {/* Growth Animation Container */}
                   <div className="relative w-32 h-40 flex flex-col items-center justify-end" style={{ transform: 'scale(1.5) translateY(-50px)' }}>
                      
                      {/* Trunk - Grows upwards */}
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 64, opacity: 1 }} // h-16 is 64px
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-6 bg-gradient-to-r from-amber-900 to-amber-700 rounded-full relative z-10 origin-bottom"
                      ></motion.div>

                      {/* Leaves Layers - Pop sequentially */}
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1.1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 10 }}
                        className="absolute bottom-10 w-24 h-24 bg-gradient-to-br from-green-400 to-green-700 rounded-full shadow-lg z-20"
                      ></motion.div>

                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1.1 }}
                        transition={{ delay: 0.7, type: "spring", stiffness: 200, damping: 10 }}
                        className="absolute bottom-20 w-20 h-20 bg-gradient-to-br from-green-300 to-green-600 rounded-full shadow-lg z-30"
                      ></motion.div>

                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1.1 }}
                        transition={{ delay: 0.9, type: "spring", stiffness: 200, damping: 10 }}
                        className="absolute bottom-28 w-16 h-16 bg-gradient-to-br from-green-200 to-green-500 rounded-full shadow-lg z-40"
                      ></motion.div>

                      {/* Apples/Flowers decoration appearing last */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                        className="absolute top-10 right-6 text-red-500 text-xl z-50 drop-shadow-md"
                      >🍎</motion.div>
                      <motion.div 
                         initial={{ opacity: 0, scale: 0 }}
                         animate={{ opacity: 1, scale: 1 }}
                         transition={{ delay: 1.4, duration: 0.5 }}
                         className="absolute top-20 left-6 text-red-500 text-xl z-50 drop-shadow-md"
                      >🍎</motion.div>

                      {/* Sparkles */}
                      <motion.div 
                        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }} 
                        transition={{ repeat: Infinity, duration: 2, delay: 1.5 }} 
                        className="absolute top-0 right-0 text-yellow-300 text-2xl z-50"
                      >✨</motion.div>
                   </div>
                </div>
             )}
          </div>

          {/* Hint Bubble */}
          {isOver && (
             <div 
               className="absolute -top-24 bg-white text-slate-800 px-4 py-2 rounded-2xl font-black text-sm shadow-xl z-50 animate-bounce border-b-4 border-slate-200"
               style={{ transform: 'rotateX(-45deg)' }}
             >
                {spot.state === 'empty' ? '🌱 ¡PLANTAR!' : spot.state === 'seeded' ? '💧 ¡REGAR!' : '✨ ¡LISTO!'}
             </div>
          )}
       </motion.div>
    </div>
  );
}

function MovingTrainGuide({ message, mood }: { message: string; mood: 'happy' | 'neutral' }) {
  return (
    <motion.div
      className="fixed top-0 left-0 z-50 pointer-events-none"
      initial={{ x: '-30vw', y: '60vh', rotate: -10 }}
      animate={{ 
         x: '130vw',
         y: ['60vh', '42vh', '60vh'],
         rotate: [-10, 0, 10]
      }}
      transition={{ 
         duration: 25, 
         repeat: Infinity, 
         ease: "linear",
         y: { ease: "easeInOut", duration: 25, repeat: Infinity },
         rotate: { ease: "easeInOut", duration: 25, repeat: Infinity }
      }}
    >
      <div className="relative flex flex-col items-center mb-4 -translate-y-full">
        <div className="mb-2 bg-white border-4 border-green-500 p-4 rounded-2xl shadow-lg w-64 text-center relative">
          <p className="font-bold text-slate-800 text-lg">{message}</p>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-5 h-5 bg-white border-b-4 border-r-4 border-green-500 rotate-45"></div>
        </div>
        <div className="transform scale-x-[-1]">
           <TrainCharacter isHappy={mood === 'happy'} size="medium" />
        </div>
      </div>
    </motion.div>
  );
}


function ForestBackground({ isComplete }: { isComplete: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden transition-all duration-[2000ms] perspective-[1200px]" style={{ filter: isComplete ? 'none' : 'sepia(30%) grayscale(30%) brightness(90%)' }}>
       {/* Sky - Deep Depth */}
       <div 
          className="absolute inset-0 bg-gradient-to-b from-sky-300 via-blue-200 to-green-100"
          style={{ transform: 'translateZ(-600px) scale(3)' }}
       ></div>
       
       {/* Sun - Glowing */}
       <motion.div 
         className="absolute top-[-10%] left-[10%]"
         animate={{ rotate: 360 }}
         transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
         style={{ transform: 'translateZ(-500px) scale(2)' }}
       >
          <div className="w-64 h-64 bg-yellow-300 rounded-full blur-3xl opacity-50 absolute top-10 left-10"></div>
          <CloudSun size={200} strokeWidth={1} className="text-yellow-400 drop-shadow-[0_0_50px_rgba(253,224,71,0.8)]" />
       </motion.div>

       {/* Clouds Layer */}
       <motion.div 
          className="absolute top-20 inset-x-0 h-64 opacity-80"
          animate={{ x: [-100, 100] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          style={{ transform: 'translateZ(-400px) scale(2)' }}
       >
          {/* Cloud shapes using CSS or simple SVGs could go here, but we'll keep it clean */}
       </motion.div>

       {/* Hills - Layered 3D Parallax */}
       <div 
          className="absolute bottom-[30%] -left-[20%] -right-[20%] h-[80%] bg-gradient-to-t from-green-600 to-green-400 rounded-t-[100%] shadow-[0_-20px_60px_rgba(0,0,0,0.2)]"
          style={{ transform: 'translateZ(-300px) scale(1.6)' }}
       ></div>
       
       <div 
          className="absolute bottom-[10%] -left-[10%] -right-[10%] h-[60%] bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-[80%] shadow-[0_-20px_40px_rgba(0,0,0,0.1)]"
          style={{ transform: 'translateZ(-150px) scale(1.3)' }}
       ></div>
       
       {/* Foreground Ground Merge */}
       <div 
          className="absolute bottom-[-20%] left-0 right-0 h-[50%] bg-gradient-to-t from-[#5D4037] to-emerald-500 blur-xl opacity-80"
          style={{ transform: 'translateZ(-50px)' }}
       ></div>
       
       {/* Decor Trees - Pop-up Style */}
       <motion.div animate={{ opacity: isComplete ? 1 : 0, y: isComplete ? 0 : 100 }} transition={{ duration: 1 }}>
          <div className="absolute bottom-[30%] left-[5%]" style={{ transform: 'translateZ(-200px) scale(1.5)' }}>
             <Trees size={120} className="text-green-800 drop-shadow-2xl filter brightness-75" />
          </div>
          <div className="absolute bottom-[35%] right-[10%]" style={{ transform: 'translateZ(-250px) scale(1.8)' }}>
             <Trees size={160} className="text-green-900 drop-shadow-2xl filter brightness-75" />
          </div>
       </motion.div>

       {/* Celebration Animals - Realistic & Animated */}
       {isComplete && (
          <div className="absolute inset-0 pointer-events-none z-20 transform-style-3d">
             {/* Left Side Group - Deers */}
             <motion.div 
                initial={{ scale: 0, x: -50 }} animate={{ scale: 1, x: 0 }} 
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute bottom-[25%] left-[10%] w-32 h-32 rounded-full border-4 border-white/80 shadow-2xl overflow-hidden"
                style={{ transform: 'translateZ(-150px)' }}
             >
                <ImageWithFallback 
                   src="https://images.unsplash.com/photo-1593799723560-499b89c0397c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHRhaWxlZCUyMGRlZXJ8ZW58MXx8fHwxNzY0MzExNzgxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                   alt="Venado"
                   className="w-full h-full object-cover"
                />
             </motion.div>
             
             <motion.div 
                initial={{ scale: 0, x: -30 }} animate={{ scale: 0.8, x: 0 }} 
                transition={{ delay: 0.7, type: "spring" }}
                className="absolute bottom-[25%] left-[20%] w-24 h-24 rounded-full border-4 border-white/80 shadow-2xl overflow-hidden"
                style={{ transform: 'translateZ(-180px)' }}
             >
                <ImageWithFallback 
                   src="https://images.unsplash.com/photo-1593799723560-499b89c0397c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHRhaWxlZCUyMGRlZXJ8ZW58MXx8fHwxNzY0MzExNzgxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                   alt="Venado Joven"
                   className="w-full h-full object-cover scale-110"
                />
             </motion.div>

             {/* Rabbit - Keeping Emoji or replacing? Prompt said "osos... realistas". Let's keep rabbit as extra or replace with squirrel if needed, but I'll replace with Squirrel image for consistency */}
             <motion.div 
                initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0, rotate: [0, 5, 0] }} 
                transition={{ delay: 0.8, repeat: Infinity, repeatDelay: 2 }}
                className="absolute bottom-[20%] left-[30%] w-20 h-20 rounded-full border-4 border-white/80 shadow-2xl overflow-hidden"
                style={{ transform: 'translateZ(-100px)' }}
             >
                <ImageWithFallback 
                   src="https://images.unsplash.com/photo-1611394808293-30b2c57d5201?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcXVpcnJlbCUyMGFuaW1hbHxlbnwxfHx8fDE3NjQzMTE3ODB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                   alt="Ardilla"
                   className="w-full h-full object-cover"
                />
             </motion.div>

             {/* Right Side Group - Spectacled Bear */}
             <div className="absolute bottom-[28%] right-[15%] transform-style-3d" style={{ transform: 'translateZ(-180px)' }}>
                <motion.div 
                   initial={{ scale: 0, x: 50 }} animate={{ scale: 1, x: 0 }} 
                   transition={{ delay: 0.7, type: "spring" }}
                   className="w-40 h-40 rounded-full border-4 border-white/80 shadow-2xl overflow-hidden relative bg-white"
                >
                   <ImageWithFallback 
                      src="https://images.unsplash.com/photo-1761424621191-5889a39fb0eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGVjdGFjbGVkJTIwYmVhciUyMGFuaW1hbHxlbnwxfHx8fDE3NjQzMTE3ODB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Oso de Anteojos"
                      className="w-full h-full object-cover"
                   />
                </motion.div>
             </div>

             {/* Fox/Other replaced with Squirrel 2 */}
             <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }} 
                transition={{ delay: 1.0, type: "spring" }}
                className="absolute bottom-[22%] right-[28%] w-24 h-24 rounded-full border-4 border-white/80 shadow-2xl overflow-hidden"
                style={{ transform: 'translateZ(-120px)' }}
             >
                <ImageWithFallback 
                   src="https://images.unsplash.com/photo-1611394808293-30b2c57d5201?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcXVpcnJlbCUyMGFuaW1hbHxlbnwxfHx8fDE3NjQzMTE3ODB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                   alt="Ardilla"
                   className="w-full h-full object-cover scale-x-[-1]"
                />
             </motion.div>

             {/* Birds & Flying Animals - Realistic Images */}
             <motion.div 
                initial={{ x: -100, y: 50, opacity: 0 }} animate={{ x: '120vw', y: -50, opacity: 1 }} 
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute top-[15%] left-0 w-32 h-32 rounded-full border-2 border-white/50 shadow-xl overflow-hidden"
                style={{ transform: 'translateZ(-300px)' }}
             >
                <ImageWithFallback 
                   src="https://images.unsplash.com/photo-1557401620-67270b61ea82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbHlpbmclMjBlYWdsZXxlbnwxfHx8fDE3NjQzMTE3ODF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                   alt="Águila"
                   className="w-full h-full object-cover"
                />
             </motion.div>

             <motion.div 
                initial={{ x: '120vw', opacity: 0 }} animate={{ x: -100, opacity: 1 }} 
                transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
                className="absolute top-[25%] right-0 w-28 h-28 rounded-full border-2 border-white/50 shadow-xl overflow-hidden"
                style={{ transform: 'translateZ(-400px)' }}
             >
                <ImageWithFallback 
                   src="https://images.unsplash.com/photo-1708310945058-d01a27bff936?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzc2NhcmxldCUyMG1hY2F3fGVufMXx8fHwxNzY0MzExNzkzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                   alt="Guacamaya"
                   className="w-full h-full object-cover scale-x-[-1]"
                />
             </motion.div>
             
             {/* Butterfly Swarm - Using Realistic Image */}
             {[...Array(8)].map((_, i) => (
                <motion.div
                   key={`butterfly-${i}`}
                   className="absolute w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/30 shadow-sm overflow-hidden bg-white/10 backdrop-blur-sm"
                   initial={{ scale: 0 }}
                   animate={{ 
                      scale: 1,
                      x: [0, Math.random() * 40 - 20, 0],
                      y: [0, Math.random() * -30, 0],
                   }}
                   transition={{ 
                      delay: 1.5 + i * 0.1,
                      duration: 3 + Math.random(),
                      repeat: Infinity,
                   }}
                   style={{ 
                      left: `${10 + Math.random() * 80}%`, 
                      bottom: `${20 + Math.random() * 50}%`,
                      transform: `translateZ(${Math.random() * 100 - 50}px)`
                   }}
                >
                   <ImageWithFallback 
                      src="https://images.unsplash.com/photo-1564514476902-542f8c30121e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwYnV0dGVyZmx5fGVufDF8fHx8MTc2NDMxMTc4MHww&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Mariposa"
                      className="w-full h-full object-cover hover:scale-110 transition-transform"
                   />
                </motion.div>
             ))}
          </div>
       )}

       {/* Drought/Dead Elements */}
       <motion.div 
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: isComplete ? 0 : 1 }}
          transition={{ duration: 2 }}
       >
          {/* Dead trees with 3D feel */}
          <div className="absolute bottom-[25%] left-[15%] text-stone-600 transform -rotate-6 translate-z-[-100px]" style={{ transform: 'translateZ(-100px) rotate(-6deg)' }}>
             <Trees size={140} strokeWidth={1.5} />
          </div>
          <div className="absolute bottom-[30%] right-[20%] text-stone-700 transform rotate-12" style={{ transform: 'translateZ(-180px) rotate(12deg)' }}>
             <Trees size={180} strokeWidth={1.5} />
          </div>
       </motion.div>

       {/* Magical Particles (Disney Dust) */}
       {isComplete && (
          <div className="absolute inset-0 pointer-events-none">
             {[...Array(20)].map((_, i) => (
                <motion.div
                   key={i}
                   className="absolute w-2 h-2 bg-white rounded-full blur-[1px]"
                   initial={{ 
                      x: Math.random() * window.innerWidth, 
                      y: window.innerHeight, 
                      opacity: 0 
                   }}
                   animate={{ 
                      y: -100, 
                      opacity: [0, 0.8, 0],
                      scale: [0, 1.5, 0]
                   }}
                   transition={{ 
                      duration: 5 + Math.random() * 5, 
                      repeat: Infinity, 
                      delay: Math.random() * 5,
                      ease: "easeOut"
                   }}
                   style={{ left: 0, top: 0 }}
                />
             ))}
          </div>
       )}
    </div>
  );
}

function GameContent({ onComplete }: { onComplete: () => void }) {
  const [spots, setSpots] = useState<PlantingSpot[]>([
    { id: 1, x: 20, y: 65, state: 'empty' },
    { id: 2, x: 35, y: 65, state: 'empty' },
    { id: 3, x: 50, y: 65, state: 'empty' },
    { id: 4, x: 65, y: 65, state: 'empty' },
    { id: 5, x: 80, y: 65, state: 'empty' },
  ]);
  
  const [guideMessage, setGuideMessage] = useState("¡Bienvenido al Bosque! Arrastra las semillas a la tierra. 🌱");

  const handleInteract = (id: number, tool: 'seed' | 'water') => {
    setSpots(prev => prev.map(spot => {
       if (spot.id !== id) return spot;

       // Logic for state transition
       if (spot.state === 'empty' && tool === 'seed') {
          setGuideMessage("¡Bien sembrado! Ahora necesita agua. 💧");
          return { ...spot, state: 'seeded' };
       }
       if (spot.state === 'seeded' && tool === 'water') {
          setGuideMessage("¡Creció un árbol! ¡El bosque revive! 🌳");
          return { ...spot, state: 'grown' };
       }
       
       // Feedback for wrong tool
       if (spot.state === 'empty' && tool === 'water') {
          setGuideMessage("¡Primero necesitas una semilla! 🌱");
       }
       if (spot.state === 'grown') {
          setGuideMessage("¡Este árbol ya está fuerte y sano! ✨");
       }

       return spot;
    }));
  };

  const plantedCount = spots.filter(s => s.state === 'grown').length;
  const isComplete = plantedCount === spots.length;

  useEffect(() => {
     if (isComplete) {
        setGuideMessage("¡Misión Cumplida! Mira cómo regresan los animales. 🦋🐦");
     }
  }, [isComplete]);

  return (
    <div className="w-full h-full relative overflow-hidden font-sans flex flex-col select-none">
      <GameDragLayer />
      <ForestBackground isComplete={isComplete} />
      
      {/* Header */}
      <div className="relative z-40 p-2 md:p-4 flex flex-col items-center shrink-0">
        <Logo />
        <motion.div 
          className="mt-2 md:mt-4 bg-white/90 backdrop-blur px-4 py-2 md:px-6 rounded-full shadow-lg border-2 border-green-400"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
        >
           <h2 className="text-lg md:text-2xl font-black text-green-800 uppercase tracking-wide flex items-center gap-2">
              <Trees className="w-5 h-5 md:w-6 md:h-6" /> <span className="hidden md:inline">Estación Bosque: Semillas y Árboles</span><span className="md:hidden">Bosque: Semillas</span>
           </h2>
        </motion.div>
      </div>

      <MovingTrainGuide message={guideMessage} mood={isComplete ? 'happy' : 'neutral'} />

      {/* Game Area with 3D Ground Plane */}
      <div className="relative z-30 flex-grow w-full perspective-[1200px] flex items-end justify-center pb-24 md:pb-20 overflow-hidden">
         <div 
            className="relative w-[150%] md:w-[120%] h-[60vh] md:h-[800px] bg-gradient-to-b from-emerald-600 to-emerald-800 rounded-[50%] origin-bottom shadow-[0_-50px_100px_rgba(0,0,0,0.3)]"
            style={{ 
               transform: 'rotateX(40deg) translateY(20%) scale(1.5)',
               transformStyle: 'preserve-3d' 
            }}
         >
             {/* Ground Texture */}
             <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

             {/* Spots on the tilted ground */}
             {spots.map(spot => (
                <Spot key={spot.id} spot={spot} onInteract={handleInteract} />
             ))}
         </div>
      </div>

      {/* Tools Panel */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md p-6 rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-40 border-t-4 border-green-200">
         <div className="max-w-md mx-auto flex justify-center gap-8 md:gap-16">
            <Tool type="seed" />
            <Tool type="water" />
         </div>
         <p className="text-center text-slate-500 font-bold mt-4 uppercase text-xs tracking-widest">
            Herramientas de Reforestación
         </p>
      </div>

      {/* Success Button */}
      {isComplete && (
        <motion.div 
           className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
           initial={{ scale: 0 }}
           animate={{ scale: 1 }}
        >
           <Button onClick={onComplete} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-12 py-6 rounded-full text-2xl shadow-2xl animate-bounce border-4 border-white font-black">
              ¡Continuar! 🦋
           </Button>
        </motion.div>
      )}
    </div>
  );
}

export function Station1Game({ onComplete }: Station1GameProps) {
  // Universal Backend for robust touch support
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