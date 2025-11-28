import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { Recycle, Trash2, Waves, Ban } from 'lucide-react';
import { Button } from './ui/button';
import { Logo } from './Logo';
import { ImageWithFallback } from './figma/ImageWithFallback';
import ecoHeroImage from 'figma:asset/ca8d8b001d799089c0fdd42ef4943de276d3c084.png';

interface Station2GameProps {
  onComplete: () => void;
}

type TrashType = 'recycle' | 'organic';

interface TrashItem {
  id: number;
  type: TrashType;
  emoji: string;
  x: number;
  y: number;
  isCleaned: boolean;
}

const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// --- Components ---

import { GameDragLayer } from './GameDragLayer';

function EcoHeroGuide({ message, isError }: { message: string, isError?: boolean }) {
  const borderColor = isError ? 'border-red-500' : 'border-green-500';
  const textColor = isError ? 'text-red-700' : 'text-slate-800';

  return (
    <motion.div
      className="fixed bottom-0 right-4 md:right-12 z-50 pointer-events-none"
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring' }}
    >
      <div className="relative w-72 h-72 md:w-96 md:h-96 translate-y-6">
         {/* Thought Bubble */}
         <div className={`absolute bottom-[85%] left-1/2 -translate-x-1/2 w-64 bg-white border-4 ${borderColor} p-5 rounded-[2rem] shadow-lg text-center z-20 transition-colors duration-300`}>
            <p className={`font-bold ${textColor} text-sm md:text-base leading-snug transition-colors duration-300`}>{message}</p>
            
            {/* Thought Dots connecting to head */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
               <div className={`w-4 h-4 bg-white border-4 ${borderColor} rounded-full transition-colors duration-300`}></div>
               <div className={`w-2 h-2 bg-white border-2 ${borderColor} rounded-full translate-y-1 transition-colors duration-300`}></div>
            </div>
         </div>

         <ImageWithFallback 
            src={ecoHeroImage} 
            alt="Eco Hero" 
            className="w-full h-full object-contain drop-shadow-xl"
         />
      </div>
    </motion.div>
  );
}

function Splash() {
  return (
    <motion.div
      className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-12 z-0 pointer-events-none"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 1.2] }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Splash Rings */}
      <div className="absolute inset-0 border-4 border-white/60 rounded-[100%] animate-ping" />
      <div className="absolute inset-0 border-2 border-blue-300/60 rounded-[100%] animate-ping delay-100" />
      
      {/* Droplets */}
      <div className="absolute top-0 left-0 w-2 h-2 bg-blue-200 rounded-full animate-bounce" style={{ animationDuration: '0.6s' }} />
      <div className="absolute top-0 right-0 w-2 h-2 bg-blue-200 rounded-full animate-bounce" style={{ animationDuration: '0.7s' }} />
      <div className="absolute -top-4 left-1/2 w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDuration: '0.5s' }} />
    </motion.div>
  );
}

function DraggableTrash({ item, isRejected }: { item: TrashItem, isRejected: boolean }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'trash',
    item: { id: item.id, type: item.type, emoji: item.emoji },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  if (item.isCleaned) return null;

  return (
    <div 
      ref={drag}
      className={`absolute z-30 flex items-center justify-center touch-none ${isDragging ? 'z-50' : 'z-10'}`}
      style={{ left: `${item.x}%`, top: `${item.y}%`, touchAction: 'none' }}
    >
      <motion.div
        className={`cursor-grab active:cursor-grabbing text-6xl md:text-7xl
          ${isDragging ? 'opacity-0' : 'opacity-80 hover:opacity-100'}
        `}
        animate={
           isRejected ? { 
             x: [0, -20, 20, -20, 20, 0],
             rotate: [0, -10, 10, -10, 10, 0],
             scale: [1, 0.8, 1], // Shrink slightly as if hitting water
           } :
           !isDragging ? { 
             y: [0, 15, 0],
             rotate: [0, 10, -10, 0],
             scale: [1, 1.05, 1]
           } : {}
        }
        transition={
           isRejected ? { duration: 0.5 } :
           { 
             duration: 4,
             repeat: Infinity,
             ease: "easeInOut",
             delay: item.id * 0.5
           }
        }
      >
        {/* Water Ripple Effect under the item */}
        {!isDragging && (
          <div className="absolute -bottom-2 w-16 h-4 bg-black/20 blur-sm rounded-[100%] animate-pulse"></div>
        )}
        
        {/* Splash Effect on Rejection */}
        {isRejected && <Splash />}
        
        {/* Rejection Icon Overlay */}
        {isRejected && (
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-1 shadow-lg z-20"
          >
            <Ban className="w-6 h-6" />
          </motion.div>
        )}

        <div className="relative drop-shadow-2xl filter">
          {item.emoji}
        </div>
      </motion.div>
    </div>
  );
}

function Bin({ type, onDrop }: { type: TrashType, onDrop: (id: number, type: TrashType) => void }) {
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [{ isOver, draggedItem }, drop] = useDrop(() => ({
    accept: 'trash',
    drop: (item: { id: number, type: TrashType }) => {
      if (item.type !== type) {
        setIsError(true);
        setTimeout(() => setIsError(false), 1500);
      } else {
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 1000);
      }
      // CRITICAL FIX: Pass the BIN's type (type), not the ITEM's type (item.type).
      // This ensures the parent handleDrop compares the item vs the specific bin dropped into.
      onDrop(item.id, type);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      draggedItem: monitor.getItem() as { id: number, type: TrashType } | null,
    }),
  }), [type, onDrop]);

  const isRecycle = type === 'recycle';
  const isWrongHover = isOver && draggedItem?.type && draggedItem.type !== type;
  
  // Determine visual state
  const showRedError = isError || isWrongHover;
  const showGoldSuccess = isSuccess; // We could also add logic for "isCorrectHover" if we wanted a preview
  
  let colorClass = isRecycle ? 'bg-blue-600 border-blue-800' : 'bg-green-600 border-green-800';
  
  if (showRedError) colorClass = 'bg-red-600 border-red-800';
  if (showGoldSuccess) colorClass = 'bg-yellow-400 border-yellow-600';
  
  const icon = isRecycle ? <Recycle className="text-white w-10 h-10 md:w-12 md:h-12" /> : <Trash2 className="text-white w-10 h-10 md:w-12 md:h-12" />;
  const label = isRecycle ? 'Reciclaje' : 'Orgánico';

  // Lid logic: Open if hovering with CORRECT item, or if success animation is playing.
  // Closed if hovering with WRONG item (rejected) or not hovering.
  const isLidOpen = (isOver && !isWrongHover) || isSuccess;

  return (
    <div ref={drop} className="relative group -mt-12 z-40">
      <motion.div
        className={`
          w-36 h-40 md:w-48 md:h-52 rounded-t-2xl border-x-4 border-t-4 shadow-2xl flex flex-col items-center justify-start pt-6 gap-2
          ${colorClass}
          ${isOver && !isWrongHover ? 'scale-110 -translate-y-4' : 'scale-100'} 
          ${isWrongHover ? 'shake-animation' : ''}
          transition-all duration-200 ease-out relative overflow-visible
          ${showGoldSuccess ? 'shadow-[0_0_100px_30px_rgba(255,223,0,0.9)] ring-8 ring-yellow-200 z-50' : ''}
        `}
        animate={
           isError ? { x: [0, -10, 10, -10, 10, 0] } : 
           isSuccess ? { 
             scale: [1, 1.25, 1], 
             y: [0, -30, 0],
             filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'] 
           } : 
           {}
        }
        transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
      >
         {/* Prohibited Sign Overlay - Now more prominent */}
         {showRedError && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/50 backdrop-blur-sm rounded-t-xl p-2 text-center"
            >
               <Ban className="w-16 h-16 md:w-24 md:h-24 text-red-500 drop-shadow-[0_0_15px_rgba(255,0,0,0.8)] stroke-[3]" />
               <span className="text-white font-bold text-xs md:text-sm mt-1 uppercase tracking-wider drop-shadow-md">
                 {isRecycle ? '¡Solo Reciclaje!' : '¡Solo Orgánico!'}
               </span>
            </motion.div>
         )}
         
         {/* SUPER Success Sparkles & Effects */}
         {showGoldSuccess && (
            <div className="absolute inset-0 z-50 pointer-events-none overflow-visible">
               {/* Inner flash */}
               <div className="absolute inset-0 bg-white/60 animate-pulse rounded-t-xl"></div>
               
               {/* Giant Star Burst */}
               <motion.div 
                 initial={{ scale: 0, rotate: 0, opacity: 1 }}
                 animate={{ scale: 2.5, rotate: 180, opacity: 0 }}
                 transition={{ duration: 0.8 }}
                 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-yellow-300/30 rounded-full blur-md"
               />

               {/* Floating Stars */}
               <motion.div 
                  initial={{ y: 0, opacity: 1 }} animate={{ y: -100, opacity: 0 }} transition={{ duration: 1 }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 text-6xl drop-shadow-lg"
               >
                 🌟
               </motion.div>
               
               <div className="absolute -top-10 -left-10 text-yellow-300 text-5xl animate-bounce">✨</div>
               <div className="absolute -top-10 -right-10 text-yellow-300 text-5xl animate-bounce delay-75">✨</div>
               <div className="absolute top-20 -left-16 text-white text-4xl animate-pulse">⭐</div>
               <div className="absolute top-20 -right-16 text-white text-4xl animate-pulse delay-100">⭐</div>
            </div>
         )}

         <div className="bg-black/20 p-3 rounded-full shadow-inner relative z-10">
            {icon}
         </div>
         <span className="text-white font-black uppercase tracking-wider text-sm md:text-lg drop-shadow-md relative z-10">
            {label}
         </span>

         {/* Lid */}
         <motion.div 
            className="absolute -top-5 left-0 right-0 h-8 rounded-t-lg bg-inherit border-inherit border-4 border-b-0 origin-bottom-left shadow-lg"
            animate={{ rotate: isLidOpen ? -110 : 0 }}
            transition={{ type: "spring", stiffness: 120 }}
         />
      </motion.div>
    </div>
  );
}

function RiverBackground({ progress }: { progress: number }) {
  // Wave SVG data URI for surface foam - MATCHING TOP BORDER
  const waveSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 100' preserveAspectRatio='none'%3E%3Cpath fill='%23ffffff' fill-opacity='0.6' d='M0,50 C150,120 350,-10 550,60 C750,130 950,-10 1150,60 C1250,95 1350,30 1440,50 L1440,100 L0,100 Z'/%3E%3C/svg%3E`;

  const riverColor = progress < 0.5 
      ? '#5D4037' // Murky brown end color
      : '#0288D1'; // Vibrant blue end color
      
  // We use a solid color for the connector waves to match the gradient's edge approximately, 
  // or we can try to match the gradient. For simplicity in cartoon style, solid edge colors often look better or we match the closest stop.
  const topRiverColor = progress < 0.5 ? '#8D6E63' : '#4FC3F7'; // Top color of the gradient
  const bottomRiverColor = progress < 0.5 ? '#5D4037' : '#0288D1'; // Bottom color of the gradient

  return (
    <div className="absolute inset-0 overflow-hidden z-0 bg-[#B2EBF2]"> {/* Light cartoon sky */}
       
       {/* Cartoon Clouds */}
       <div className="absolute top-0 w-full h-[30%] z-10">
          <motion.div 
             className="absolute top-[10%] left-[10%] w-32 h-12 bg-white rounded-full opacity-90 shadow-sm"
             animate={{ x: [0, 20, 0] }}
             transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
             <div className="absolute -top-6 left-4 w-12 h-12 bg-white rounded-full"></div>
             <div className="absolute -top-8 left-12 w-16 h-16 bg-white rounded-full"></div>
          </motion.div>
          
          <motion.div 
             className="absolute top-[5%] right-[15%] w-40 h-14 bg-white rounded-full opacity-80 shadow-sm"
             animate={{ x: [0, -30, 0] }}
             transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          >
             <div className="absolute -top-6 left-6 w-14 h-14 bg-white rounded-full"></div>
             <div className="absolute -top-10 left-16 w-20 h-20 bg-white rounded-full"></div>
          </motion.div>
       </div>

       {/* TOP WAVE BORDER (Sky meeting River) */}
       <div className="absolute top-[12%] w-full h-20 z-20 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 1440 100" preserveAspectRatio="none">
             <path 
                d="M0,50 C150,120 350,-10 550,60 C750,130 950,-10 1150,60 C1250,95 1350,30 1440,50 L1440,100 L0,100 Z" 
                fill={topRiverColor}
                className="transition-colors duration-1000"
             />
             {/* White foam line on top of the wave */}
             <path 
                d="M0,50 C150,120 350,-10 550,60 C750,130 950,-10 1150,60 C1250,95 1350,30 1440,50" 
                fill="none" 
                stroke="white" 
                strokeWidth="8" 
                strokeLinecap="round"
                opacity="0.8"
             />
          </svg>
       </div>

       {/* Main River Body */}
       <div className="absolute top-[16%] bottom-[20%] left-0 right-0 transition-colors duration-1000 overflow-hidden"
          style={{ 
             background: `linear-gradient(to bottom, ${topRiverColor}, ${bottomRiverColor})`
          }}
       >
          {/* Moving Foam/Waves Layer - Repeated from top to bottom */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-x-0 h-24 w-[200%]"
              style={{
                top: `${i * 12}%`,
                backgroundImage: `url("${waveSvg}")`,
                backgroundRepeat: 'repeat-x',
                backgroundSize: '50% 100%',
                backgroundPosition: 'top',
                opacity: 0.4 + (i % 3) * 0.1, // Varied opacity slightly
                left: '-50%',
                mixBlendMode: 'overlay'
              }}
              animate={{ 
                x: i % 2 === 0 ? ['0%', '25%'] : ['25%', '0%'],
                y: [0, -5, 0]
              }}
              transition={{ 
                 x: { duration: 15 + i * 2, repeat: Infinity, ease: "linear" },
                 y: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" }
              }}
            />
          ))}

          {/* Deep Water Texture overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>

          {/* Murky Overlay (fades out) */}
          <motion.div 
             className="absolute inset-0 bg-[#3E2723] mix-blend-multiply pointer-events-none"
             animate={{ opacity: (1 - progress) * 0.85 }}
          />

          {/* POLLUTION ELEMENTS (Oil & Dead Fish) - Only visible when dirty */}
          {progress < 1 && (
             <div className="absolute inset-0 pointer-events-none z-0">
                {/* Oil Spills */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={`oil-${i}`}
                    className="absolute bg-black rounded-[100%]"
                    style={{
                      width: `${100 + Math.random() * 150}px`,
                      height: `${60 + Math.random() * 80}px`,
                      top: `${10 + Math.random() * 70}%`,
                      left: `${Math.random() * 80}%`,
                      filter: 'blur(12px)',
                      mixBlendMode: 'overlay'
                    }}
                    animate={{ 
                       x: [0, 30, 0],
                       scale: [1, 1.2, 1],
                       opacity: (1 - progress) * 0.7 
                    }}
                    transition={{ 
                       duration: 15 + Math.random() * 10, 
                       repeat: Infinity,
                       ease: "easeInOut"
                    }}
                  />
                ))}

                {/* Drowned Fish */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={`dead-fish-${i}`}
                    className="absolute text-5xl opacity-60 grayscale brightness-50"
                    style={{
                      top: `${20 + Math.random() * 60}%`,
                      left: `${10 + Math.random() * 80}%`,
                    }}
                    animate={{ 
                       y: [0, 10, 0],
                       rotate: [160, 200, 160], // Upside down and wobbling
                       opacity: (1 - progress) * 0.8
                    }}
                    transition={{ 
                       duration: 5 + Math.random() * 3, 
                       repeat: Infinity,
                       ease: "easeInOut",
                       delay: i * 0.5
                    }}
                  >
                     🐟
                     <span className="absolute -top-2 left-2 text-xl font-bold text-black">x x</span>
                  </motion.div>
                ))}
             </div>
          )}
       </div>

       {/* BOTTOM WAVE BORDER (River meeting Shore) */}
       <div className="absolute bottom-[17%] w-full h-24 z-20 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
             {/* The shore color filling UP into the wave shape */}
             <path 
                d="M0,60 C180,140 360,-10 540,60 C720,130 900,-10 1080,60 C1260,130 1380,20 1440,60 L1440,120 L0,120 Z" 
                fill="#F5DEB3" 
             />
             {/* Foam line at the shore edge */}
             <path 
                d="M0,60 C180,140 360,-10 540,60 C720,130 900,-10 1080,60 C1260,130 1380,20 1440,60" 
                fill="none" 
                stroke="white" 
                strokeWidth="8" 
                strokeLinecap="round"
                opacity="0.6"
             />
          </svg>
       </div>

       {/* Shore Body */}
       <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-[#F5DEB3] z-20">
           {/* Stylized pebbles/sand pattern */}
           <div className="absolute inset-0 opacity-30" style={{ 
              backgroundImage: 'radial-gradient(#DEB887 20%, transparent 20%)', 
              backgroundSize: '20px 20px' 
           }}></div>
       </div>

       {/* Fish (Only visible when clean) */}
       {progress === 1 && (
          <div className="absolute top-[15%] bottom-[20%] left-0 right-0 pointer-events-none z-30">
             {/* Swimming Fish */}
             {[...Array(15)].map((_, i) => (
                <motion.div
                   key={`swim-${i}`}
                   className="absolute text-4xl md:text-5xl drop-shadow-lg"
                   style={{ top: `${20 + Math.random() * 70}%` }}
                   initial={{ x: -100, opacity: 0 }}
                   animate={{ 
                      x: ['-10vw', '110vw'],
                      y: [0, Math.random() * 30 - 15, 0],
                      opacity: 1
                   }}
                   transition={{ 
                      duration: 8 + Math.random() * 12, 
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "linear"
                   }}
                >
                   {['🐟', '🐠', '🐡'][i % 3]}
                </motion.div>
             ))}

             {/* Jumping Fish */}
             {[...Array(6)].map((_, i) => (
                <motion.div
                   key={`jump-${i}`}
                   className="absolute text-5xl md:text-6xl drop-shadow-2xl"
                   style={{ top: '40%', left: `${10 + Math.random() * 80}%` }}
                   initial={{ y: 0, opacity: 0, scale: 0.5 }}
                   animate={{ 
                      y: [0, -180, 0], // Jump higher out of water
                      x: [0, (i % 2 === 0 ? 60 : -60)],
                      rotate: [0, (i % 2 === 0 ? -45 : 45), 0], // Turn into the jump
                      opacity: [0, 1, 1, 0],
                      scale: [0.5, 1.2, 0.5]
                   }}
                   transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: Math.random() * 3 + 1,
                      ease: "easeInOut",
                      delay: Math.random() * 2
                   }}
                >
                   {['🐬', '🐟'][i % 2]}
                </motion.div>
             ))}
          </div>
       )}
    </div>
  );
}

function GameContent({ onComplete }: { onComplete: () => void }) {
  const [trashItems, setTrashItems] = useState<TrashItem[]>([
    { id: 1, type: 'recycle', emoji: '🧴', x: 20, y: 30, isCleaned: false },
    { id: 2, type: 'organic', emoji: '🍌', x: 50, y: 40, isCleaned: false },
    { id: 3, type: 'recycle', emoji: '🥫', x: 80, y: 25, isCleaned: false },
    { id: 4, type: 'organic', emoji: '🍎', x: 30, y: 50, isCleaned: false },
    { id: 5, type: 'recycle', emoji: '🥤', x: 70, y: 45, isCleaned: false },
    { id: 6, type: 'organic', emoji: '🦴', x: 40, y: 35, isCleaned: false },
  ]);

  const [guideMessage, setGuideMessage] = useState("¡El río está contaminado, ayúdanos a limpiarlo!");
  const [guideIsError, setGuideIsError] = useState(false);
  const [rejectedId, setRejectedId] = useState<number | null>(null);

  const handleDrop = (id: number, targetBinType: TrashType) => {
    const item = trashItems.find(t => t.id === id);
    if (!item) return;

    if (item.type === targetBinType) {
      setTrashItems(prev => prev.map(t => t.id === id ? { ...t, isCleaned: true } : t));
      setGuideIsError(false);
      setGuideMessage(item.type === 'recycle' 
        ? "¡Fantástico! El reciclaje ayuda al planeta. ♻️✨" 
        : "¡Excelente! Lo orgánico volverá a la tierra. 🍌🌱"
      );
    } else {
      setRejectedId(id);
      setTimeout(() => setRejectedId(null), 1000); // Reset rejection state
      
      setGuideIsError(true);
      setGuideMessage(targetBinType === 'recycle' 
        ? "¡Alto! Eso es basura orgánica, no reciclable. 🚫🍎" 
        : "¡Espera! Eso es material reciclable, no orgánico. 🚫🥤"
      );
    }
  };

  const cleanedCount = trashItems.filter(t => t.isCleaned).length;
  const progress = cleanedCount / trashItems.length;
  const isComplete = cleanedCount === trashItems.length;

  useEffect(() => {
    if (isComplete) {
      setGuideMessage("¡Lo lograste! ¡Peces felices! 🐟✨");
    }
  }, [isComplete]);

  return (
    <div className="w-full h-full relative overflow-hidden font-sans flex flex-col select-none">
      <GameDragLayer />
      <RiverBackground progress={progress} />
      
      {/* Header */}
      <div className="relative z-40 p-2 md:p-4 flex flex-col items-center shrink-0">
        <Logo />
        <motion.div 
           className="mt-2 bg-white/90 backdrop-blur px-4 py-2 md:px-6 rounded-full shadow-lg border-2 border-blue-400"
           initial={{ y: -50 }}
           animate={{ y: 0 }}
        >
           <h2 className="text-lg md:text-2xl font-black text-blue-800 uppercase tracking-wide flex items-center gap-2">
              <Waves className="w-5 h-5 md:w-6 md:h-6" /> <span className="hidden md:inline">Estación Río: Agua y Limpieza</span><span className="md:hidden">Río: Limpieza</span>
           </h2>
        </motion.div>
      </div>

      <EcoHeroGuide message={guideMessage} isError={guideIsError} />

      {/* Game Area: Water Zone for Trash */}
      {/* The river is roughly top: 15% to bottom: 20% */}
      <div className="absolute top-[20%] bottom-[25%] left-0 right-0 z-30 overflow-hidden">
         {trashItems.map(item => (
            <DraggableTrash 
               key={item.id} 
               item={item} 
               isRejected={rejectedId === item.id}
            />
         ))}
      </div>

      {/* Bins Panel on Shore */}
      <div className="fixed bottom-0 left-0 right-0 z-40 h-[25%] md:h-[20%] flex items-end justify-center pb-4 gap-8 md:gap-24 pointer-events-none">
         {/* Pointer events auto so bins are interactive */}
         <div className="pointer-events-auto flex gap-8 md:gap-24">
            <Bin type="recycle" onDrop={handleDrop} />
            <Bin type="organic" onDrop={handleDrop} />
         </div>
      </div>

      {/* Success Button */}
      {isComplete && (
        <motion.div 
           className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full flex justify-center"
           initial={{ scale: 0 }}
           animate={{ scale: 1 }}
        >
           <Button onClick={onComplete} className="bg-blue-500 hover:bg-blue-600 text-white px-12 py-6 rounded-full text-2xl shadow-2xl animate-bounce border-4 border-white font-black">
              ¡Misión Cumplida! 🌊
           </Button>
        </motion.div>
      )}
      
    </div>
  );
}

export function Station2Game({ onComplete }: Station2GameProps) {
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
