import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { Cloud, Heart, Mountain } from 'lucide-react';
import { Button } from './ui/button';
import { Logo } from './Logo';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { GameDragLayer } from './GameDragLayer';
import ecoHeroImage from 'figma:asset/ca8d8b001d799089c0fdd42ef4943de276d3c084.png';

interface Animal {
  id: number;
  type: 'sloth' | 'monkey' | 'bird';
  emoji: string;
  name: string;
  rescued: boolean;
  habitat: 'tree' | 'sky';
}

interface HabitatProps {
  type: 'tree' | 'sky';
  onDrop: (item: Animal) => void;
  animals: Animal[];
}

interface Station4GameProps {
  onComplete: () => void;
}

const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// --- Visual Components ---

import { TrainCharacter } from './TrainCharacter';

function MovingGuide({ message }: { message: string }) {
  return (
    <motion.div
      className="fixed bottom-24 md:bottom-4 z-50 pointer-events-none"
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
        
        {/* Character Avatar */}
        <div className="w-40 h-40 relative transform scale-x-[-1]"> {/* Face right */}
           <ImageWithFallback 
              src={ecoHeroImage} 
              alt="Eco Hero" 
              className="w-full h-full object-contain drop-shadow-2xl"
           />
        </div>
      </div>
    </motion.div>
  );
}

function AnimatedSnowBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden z-0 bg-gradient-to-b from-sky-500 via-blue-300 to-emerald-100 perspective-[1000px]">
      
      {/* Pale Sun/Moon with Glow */}
      <motion.div 
        className="absolute top-10 right-10 w-24 h-24 bg-white rounded-full shadow-[0_0_60px_rgba(255,255,255,0.9)] opacity-90 z-0"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{ transform: 'translateZ(-300px)' }}
      />

      {/* Moving Clouds - 3D Layers */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-white/40 z-10"
          style={{ 
             top: `${10 + i * 10}%`,
             transform: `translateZ(-${100 + i * 50}px)` 
          }}
          initial={{ x: -150 }}
          animate={{ x: '110vw' }}
          transition={{ 
            duration: 30 + i * 5, 
            repeat: Infinity, 
            ease: "linear",
            delay: i * 10 
          }}
        >
          <Cloud className="w-48 h-32 fill-current filter blur-sm" />
        </motion.div>
      ))}

      {/* 3D Mountain Parallax */}
      <div className="absolute bottom-0 left-0 right-0 h-[70vh] opacity-100 z-0 flex justify-center items-end transform-style-3d">
         {/* Back Mountains */}
         <div className="absolute bottom-0 w-full h-[80%] opacity-50 grayscale brightness-50" style={{ transform: 'translateZ(-200px) scale(1.2)' }}>
            <svg viewBox="0 0 1000 500" className="w-full h-full" preserveAspectRatio="none">
               <path d="M-200,500 L100,100 L400,500 L600,300 L900,500 L1200,200 L1400,500 Z" fill="#4a4e69" />
            </svg>
         </div>

         {/* Main Nevado del Huila - Pop-up Style */}
         <div className="absolute bottom-0 w-full h-full flex justify-center items-end" style={{ transform: 'translateZ(-100px)' }}>
            <svg viewBox="0 0 1000 500" className="w-full h-full drop-shadow-2xl" preserveAspectRatio="none">
               {/* Base with Gradient */}
               <defs>
                  <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                     <stop offset="0%" stopColor="#78716c" />
                     <stop offset="100%" stopColor="#44403c" />
                  </linearGradient>
               </defs>
               <path d="M0,500 L300,200 L500,500 L700,300 L1000,500 Z" fill="url(#mountainGrad)" />
               {/* Main Peak */}
               <path d="M200,500 L500,50 L800,500 Z" fill="#57534e" />
               {/* Snow Cap - Glowing */}
               <path d="M400,200 L500,50 L600,200 L550,180 L500,220 L450,180 Z" fill="white" filter="drop-shadow(0 0 10px rgba(255,255,255,0.8))" />
            </svg>
         </div>
      </div>
      
      {/* Fog/Mist at base */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-white/60 to-transparent z-10 blur-xl"></div>
    </div>
  )
}

function DraggableAnimal({ animal }: { animal: Animal }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'animal',
    item: animal,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  if (animal.rescued) return null;

  return (
    <div 
      ref={drag}
      className={`cursor-grab active:cursor-grabbing relative ${isDragging ? 'opacity-50' : 'opacity-100'} m-2 perspective-[600px] touch-none z-50`}
      style={{ touchAction: 'none' }}
    >
      <motion.div
        whileHover={{ scale: 1.1, rotateY: 10 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* 3D Cage Card */}
        <div className="relative w-20 h-20 md:w-28 md:h-28 transform-style-3d transition-all duration-300 group">
           
           {/* Shadow */}
           <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-black/40 blur-md rounded-full z-[-1]"></div>
  
           {/* Cage Body */}
           <div className="absolute inset-0 bg-slate-800/40 backdrop-blur-sm rounded-xl border-4 border-slate-600 flex items-center justify-center overflow-hidden shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
              {/* Back Bars */}
              <div className="absolute inset-0 flex justify-evenly pointer-events-none opacity-50" style={{ transform: 'translateZ(-20px)' }}>
                 <div className="w-1 h-full bg-slate-400"></div>
                 <div className="w-1 h-full bg-slate-400"></div>
                 <div className="w-1 h-full bg-slate-400"></div>
              </div>
              
              {/* The Animal - Floating in center */}
              <div className="text-4xl md:text-6xl relative z-10 drop-shadow-2xl grayscale-[0.5] group-hover:grayscale-0 transition-all transform" style={{ transform: 'translateZ(10px)' }}>
                {animal.emoji}
              </div>
  
              {/* Front Bars */}
              <div className="absolute inset-0 flex justify-evenly pointer-events-none z-20" style={{ transform: 'translateZ(20px)' }}>
                 <div className="w-2 h-full bg-slate-600 shadow-lg"></div>
                 <div className="w-2 h-full bg-slate-600 shadow-lg"></div>
                 <div className="w-2 h-full bg-slate-600 shadow-lg"></div>
              </div>
           </div>
        </div>
        
        <div className="bg-red-500 text-white text-center text-[10px] md:text-xs font-black px-3 py-1 rounded-full mt-2 shadow-md mx-auto w-max border border-red-700 relative z-30 transform -translate-y-2">
          ¡SOCORRO!
        </div>
      </motion.div>
    </div>
  );
}

function HabitatZone({ type, onDrop, animals }: HabitatProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'animal',
    drop: (item: Animal) => {
      if (item.habitat === type) {
        onDrop(item);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  // Visuals for different habitats
  const isTree = type === 'tree';

  return (
    <div 
      ref={drop}
      className={`relative transition-all duration-500 perspective-[1000px] ${
        isTree 
          ? 'w-1/2 h-[300px] md:h-[400px] flex flex-col items-center justify-end' 
          : 'w-full h-[150px] flex items-center justify-center absolute top-0 left-0 right-0 z-10'
      }`}
    >
      {/* Visual Container for Habitat */}
      {isTree ? (
        // TREE VISUAL - Stylized 3D "Disney" Animated Tree
        <motion.div 
            className="relative w-full h-full flex items-end justify-center group perspective-[1000px]"
            animate={isOver ? { scale: 1.1 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
           {/* Ground Shadow */}
           <div className="absolute bottom-4 w-32 h-8 bg-emerald-900/40 blur-lg rounded-[100%] z-[-1]"></div>

           {/* Animated Tree Container */}
           <div className="relative w-48 h-64 md:w-60 md:h-80 flex flex-col items-center justify-end transform-style-3d">
              
              {/* Trunk */}
              <motion.div 
                 className="w-8 md:w-12 h-1/2 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 rounded-full relative z-10 shadow-xl origin-bottom"
                 animate={{ rotateZ: [1, -1, 1] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                 {/* Bark Texture */}
                 <div className="absolute top-1/3 left-1/3 w-full h-full border-l-2 border-amber-950/30 rounded-full opacity-50"></div>
              </motion.div>

              {/* Foliage - Multi-layered 3D Cloud Style */}
              <motion.div 
                 className="absolute top-0 w-48 h-48 md:w-64 md:h-64 z-20 transform-style-3d origin-bottom"
                 animate={{ rotateZ: [-2, 2, -2] }}
                 transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                  {/* Back Dark Layer */}
                  <motion.div 
                     className="absolute top-12 left-2 w-24 h-24 bg-emerald-800 rounded-full shadow-2xl"
                     animate={{ y: [0, -5, 0] }}
                     transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div 
                     className="absolute top-12 right-2 w-24 h-24 bg-emerald-800 rounded-full shadow-2xl"
                     animate={{ y: [0, -5, 0] }}
                     transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  />

                  {/* Middle Medium Layer */}
                  <motion.div 
                     className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-to-br from-green-500 to-green-700 rounded-full shadow-lg z-10"
                     animate={{ scale: [1, 1.05, 1] }}
                     transition={{ duration: 4, repeat: Infinity }}
                  />
                  
                  {/* Front Light Bubbles */}
                  <motion.div 
                     className="absolute top-8 left-6 w-20 h-20 bg-green-400 rounded-full opacity-90 z-20 shadow-inner"
                     animate={{ x: [0, 2, 0] }}
                     transition={{ duration: 5, repeat: Infinity }}
                  />
                  <motion.div 
                     className="absolute top-8 right-6 w-20 h-20 bg-green-400 rounded-full opacity-90 z-20 shadow-inner"
                     animate={{ x: [0, -2, 0] }}
                     transition={{ duration: 5, repeat: Infinity }}
                  />

                  {/* Sparkles/Life Particles */}
                  <motion.div
                     className="absolute -top-4 left-1/2 text-yellow-300 text-2xl z-30"
                     animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], y: -20 }}
                     transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  >✨</motion.div>
              </motion.div>

           </div>

           {/* Drop Zone Indicator */}
           {isOver && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border-4 border-yellow-400 border-dashed rounded-full animate-spin-slow z-50 pointer-events-none"></div>
           )}
           
           {/* Label */}
           <div className="absolute bottom-6 bg-emerald-900 text-white px-6 py-2 rounded-full text-sm font-bold z-50 shadow-lg border-2 border-emerald-500 transform translate-z-30">
             Bosque Vivo
           </div>
        </motion.div>
      ) : (
        // SKY VISUAL
        <div className="w-full h-full flex items-center justify-center transform-style-3d">
           {isOver && (
              <div className="absolute inset-x-20 inset-y-4 bg-sky-400/10 rounded-[3rem] border-4 border-sky-400/30 border-dashed animate-pulse z-0"></div>
           )}
           {/* Label */}
           <div className="absolute top-8 bg-sky-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg border-2 border-sky-400 transform translate-z-20">
             Cielo Andino
           </div>
        </div>
      )}

      {/* Rescued Animals in this Habitat - Floating 3D */}
      <div className="absolute inset-0 pointer-events-none z-20 transform-style-3d">
         {animals.map((animal, index) => (
           <motion.div
             key={animal.id}
             className="absolute text-4xl md:text-6xl drop-shadow-2xl"
             initial={{ scale: 0, rotateY: 180 }}
             animate={{ scale: 1, rotateY: 0, rotate: [0, 5, -5, 0] }}
             transition={{ type: "spring", rotate: { duration: 3, repeat: Infinity } }}
             style={{
               left: isTree 
                  ? `${30 + (index % 2) * 30}%` 
                  : `${20 + (index * 15)}%`,
               top: isTree 
                  ? `${20 + (index % 3) * 20}%` 
                  : '30%',
               transform: 'translateZ(50px)'
             }}
           >
             <div className="relative">
               {animal.emoji}
               <motion.div 
                  className="absolute -top-4 -right-4"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1, y: -10 }}
                  transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
               >
                  <Heart className="w-8 h-8 text-red-500 fill-red-500 drop-shadow-md" />
               </motion.div>
             </div>
           </motion.div>
         ))}
      </div>
    </div>
  );
}

function GameContent({ onComplete }: { onComplete: () => void }) {
  const [animals, setAnimals] = useState<Animal[]>([
    { id: 1, type: 'sloth', emoji: '🦥', name: 'Perezoso', rescued: false, habitat: 'tree' },
    { id: 2, type: 'monkey', emoji: '🐒', name: 'Mono', rescued: false, habitat: 'tree' },
    { id: 3, type: 'bird', emoji: '🦅', name: 'Cóndor', rescued: false, habitat: 'sky' },
    { id: 4, type: 'bird', emoji: '🦜', name: 'Loro', rescued: false, habitat: 'tree' },
    { id: 5, type: 'monkey', emoji: '🦍', name: 'Mono', rescued: false, habitat: 'tree' },
  ]);
  
  const [guideMessage, setGuideMessage] = useState("¡Rescata a los animales! Arrástralos a su hogar. 🐾");

  const handleDrop = (animalItem: Animal) => {
    setAnimals(prev => prev.map(a => a.id === animalItem.id ? { ...a, rescued: true } : a));
    setGuideMessage("¡Bien hecho! ¡Libre al fin! ❤️");
  };

  const allRescued = animals.every(a => a.rescued);
  const rescuedInTree = animals.filter(a => a.rescued && a.habitat === 'tree');
  const rescuedInSky = animals.filter(a => a.rescued && a.habitat === 'sky');

  useEffect(() => {
    if (allRescued) {
      setGuideMessage("¡Fauna protegida! La montaña sonríe. 🏔️");
    }
  }, [allRescued]);

  return (
    <div className="w-full h-full relative overflow-hidden font-sans flex flex-col select-none">
      <GameDragLayer />
      
      {/* Background */}
      <AnimatedSnowBackground />
      
      {/* Train Guide (Now Avatar Guide) */}
      <MovingGuide message={guideMessage} />
      
      {/* Header */}
      <div className="relative z-40 p-2 md:p-4 flex flex-col items-center shrink-0">
        <Logo />
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-2 bg-white/90 backdrop-blur-md px-4 py-2 md:px-8 md:py-3 rounded-3xl shadow-xl border-4 border-green-500 flex items-center gap-2"
        >
          <Mountain className="w-6 h-6 md:w-8 md:h-8 text-green-700" />
          <h2 className="text-base md:text-3xl font-black text-emerald-800 tracking-tight text-center uppercase">
            Estación Montaña: Fauna y Protección
          </h2>
        </motion.div>
      </div>

      {/* Main Game Area - 3D World */}
      <div className="relative z-30 flex-grow w-full max-w-6xl mx-auto flex flex-col justify-between pb-4 perspective-[1200px] overflow-hidden">
        
        {/* Habitat Zones Layer - 3D Space */}
        <div className="relative flex-grow w-full transform-style-3d flex flex-col justify-end pb-20 md:pb-0">
           {/* Sky Habitat - Far Back */}
           <div style={{ transform: 'translateZ(-100px)' }} className="absolute top-10 inset-x-0 h-1/3">
              <HabitatZone type="sky" onDrop={handleDrop} animals={rescuedInSky} />
           </div>

           {/* Tree Habitats - Closer and Pop-up */}
           <div className="relative w-full h-[40vh] md:h-[50vh] flex justify-between px-4 md:px-20 items-end transform-style-3d">
              <div style={{ transform: 'rotateX(10deg)' }} className="w-1/2 h-full flex justify-center">
                 <HabitatZone type="tree" onDrop={handleDrop} animals={rescuedInTree.filter((_,i) => i % 2 === 0)} />
              </div>
              {/* Gap for mountain visibility */}
              <div style={{ transform: 'rotateX(10deg)' }} className="w-1/2 h-full flex justify-center">
                 <HabitatZone type="tree" onDrop={handleDrop} animals={rescuedInTree.filter((_,i) => i % 2 !== 0)} />
              </div>
           </div>
        </div>

        {/* Cages Area (The Source) */}
        <div className="relative z-50 mt-auto mb-2 md:mb-8 shrink-0">
           {!allRescued && (
             <div className="bg-gray-900/60 backdrop-blur-md p-2 md:p-4 rounded-3xl border-t-4 border-gray-600 mx-4 max-w-3xl md:mx-auto">
               <p className="text-center text-white font-bold mb-2 md:mb-4 uppercase tracking-wider text-[10px] md:text-sm">Zona de Peligro ⚠️ ¡Libéralos!</p>
               <div className="flex flex-wrap justify-center gap-2 md:gap-4 min-h-[80px] md:min-h-[100px]">
                 {animals.map(animal => (
                   <DraggableAnimal key={animal.id} animal={animal} />
                 ))}
               </div>
             </div>
           )}

           {/* Success Message */}
           {allRescued && (
              <motion.div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl border-4 border-green-500 max-w-lg text-center z-[60]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                 <div className="text-6xl mb-4">🎉🦥🦅</div>
                 <h3 className="text-3xl font-black text-emerald-700">¡Fauna Salvada!</h3>
                 <p className="text-gray-600 font-medium text-lg">Has devuelto la vida a la montaña.</p>
                 
                 <Button 
                   onClick={onComplete}
                   className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-full shadow-xl animate-bounce text-xl w-full"
                 >
                   ¡Misión Cumplida!
                 </Button>
              </motion.div>
           )}
        </div>

      </div>
    </div>
  );
}

export function Station4Game({ onComplete }: Station4GameProps) {
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
