import { motion } from 'motion/react';
import { Train } from 'lucide-react';

interface TrainCharacterProps {
  isHappy?: boolean;
  size?: 'small' | 'medium' | 'large';
}


export function TrainCharacter({ isHappy = false, size = 'medium' }: TrainCharacterProps) {
  const sizeMap = {
    small: { loco: 'w-16 h-14', wagon: 'w-12 h-10', font: 'text-sm' },
    medium: { loco: 'w-32 h-28', wagon: 'w-24 h-20', font: 'text-2xl' },
    large: { loco: 'w-48 h-44', wagon: 'w-32 h-28', font: 'text-4xl' }
  };

  const currentSize = sizeMap[size];

  const wagons = [
    { id: 1, color: isHappy ? 'from-blue-400 to-blue-600' : 'from-gray-400 to-gray-600', passengers: '👨‍👩‍👧' },
    { id: 2, color: isHappy ? 'from-green-400 to-green-600' : 'from-gray-500 to-gray-700', passengers: '👴👵' },
    { id: 3, color: isHappy ? 'from-yellow-400 to-orange-500' : 'from-gray-400 to-gray-600', passengers: '🧑‍🏫' },
    { id: 4, color: isHappy ? 'from-purple-400 to-pink-500' : 'from-gray-500 to-gray-700', passengers: '👫' },
    { id: 5, color: isHappy ? 'from-red-400 to-red-600' : 'from-gray-400 to-gray-600', passengers: '👮‍♀️' },
    { id: 6, color: isHappy ? 'from-teal-400 to-cyan-500' : 'from-gray-500 to-gray-700', passengers: '🐕🐈' },
  ];

  return (
    <div className="relative perspective-[1000px]">
      {/* Railway tracks - 3D Depth */}
      <div className="absolute -bottom-2 left-0 right-0 flex flex-col items-center transform rotate-x-60 origin-bottom z-0">
         <div className="w-full h-4 bg-amber-900/80 shadow-lg"></div>
      </div>

      <motion.div
        className="flex items-end gap-1 relative z-10"
        animate={{
          x: [0, 5, 0],
          rotateX: [0, 5, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Main Locomotive */}
        <motion.div
          className={`${currentSize.loco} relative flex-shrink-0`}
          animate={{
            y: [0, -4, 0],
            scale: isHappy ? [1, 1.02, 1] : [1, 1.02, 1]
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {/* 3D Body */}
          <div className={`w-full h-full rounded-3xl flex items-center justify-center relative 
            shadow-[inset_0_-8px_10px_rgba(0,0,0,0.3),0_10px_20px_rgba(0,0,0,0.4)]
            ${isHappy ? 'bg-gradient-to-b from-green-400 to-green-700' : 'bg-gradient-to-b from-red-400 to-red-700'}
          `}>
            {/* Shine */}
            <div className="absolute top-2 left-2 right-2 h-1/3 bg-white/20 rounded-2xl blur-[1px]"></div>

            {/* Driver Cabin Window */}
            <div className="relative z-10 w-3/4 h-3/4 bg-sky-300/30 rounded-xl border-4 border-white/30 shadow-inner flex items-end justify-center overflow-hidden backdrop-blur-sm">
               <div className="translate-y-2 filter drop-shadow-lg transform hover:scale-110 transition-transform duration-300" style={{ fontSize: currentSize.loco === 'w-48 h-44' ? '3.8rem' : '2.2rem' }}>
                  <div style={{ transform: 'scaleX(-1)' }}>
                    👮‍♂️
                  </div>
               </div>
            </div>
            
            {/* Chimney - 3D Cylinder effect */}
            <div className={`absolute -top-6 left-1/4 w-1/4 h-8 rounded-t-lg z-0
               shadow-[inset_-4px_0_5px_rgba(0,0,0,0.2)]
               ${isHappy ? 'bg-gradient-to-r from-green-600 via-green-500 to-green-700' : 'bg-gradient-to-r from-red-600 via-red-500 to-red-700'}
            `}>
               <div className="absolute top-0 w-full h-2 bg-black/20 rounded-full"></div>
              <motion.div
                className="absolute -top-4 left-1/2 -translate-x-1/2 text-lg"
                animate={{
                  y: [-2, -20],
                  opacity: [0.8, 0],
                  scale: [0.5, 1.5],
                  rotate: [0, 45]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              >
                {isHappy ? '✨' : '💨'}
              </motion.div>
            </div>
            
            {/* Face */}
            <div className="absolute top-1/4 left-1/4 flex gap-2 z-20">
              <div className="w-3 h-3 bg-white rounded-full shadow-inner flex items-center justify-center">
                <div className={`w-1.5 h-1.5 rounded-full ${isHappy ? 'bg-green-900' : 'bg-purple-900'}`}></div>
              </div>
              <div className="w-3 h-3 bg-white rounded-full shadow-inner flex items-center justify-center">
                <div className={`w-1.5 h-1.5 rounded-full ${isHappy ? 'bg-green-900' : 'bg-purple-900'}`}></div>
              </div>
            </div>
            
            {/* Mouth */}
            <div className="absolute bottom-1/4 z-20">
              {isHappy ? (
                <div className="w-8 h-3 bg-white/80 rounded-b-full shadow-sm"></div>
              ) : (
                <div className="w-8 h-2 bg-black/50 rounded-t-full"></div>
              )}
            </div>
            
            {/* Wheels - Chunky 3D */}
            <motion.div
              className="absolute -bottom-3 left-2 w-10 h-10 rounded-full bg-slate-800 border-4 border-slate-600 shadow-lg flex items-center justify-center z-20"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-8 h-1 bg-slate-500"></div>
              <div className="w-1 h-8 bg-slate-500 absolute"></div>
              <div className="w-3 h-3 bg-slate-400 rounded-full absolute shadow-inner"></div>
            </motion.div>
            <motion.div
              className="absolute -bottom-3 right-2 w-10 h-10 rounded-full bg-slate-800 border-4 border-slate-600 shadow-lg flex items-center justify-center z-20"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-8 h-1 bg-slate-500"></div>
              <div className="w-1 h-8 bg-slate-500 absolute"></div>
              <div className="w-3 h-3 bg-slate-400 rounded-full absolute shadow-inner"></div>
            </motion.div>
          </div>
        </motion.div>

        {/* Wagons */}
        {wagons.map((wagon, index) => (
          <motion.div
            key={wagon.id}
            className={`${currentSize.wagon} relative flex-shrink-0`}
            animate={{
              y: [0, -3, 0],
              rotateZ: [0, 1, -1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.1 * (index + 1)
            }}
          >
            <div className={`
               w-full h-full rounded-2xl flex items-center justify-center relative 
               bg-gradient-to-br ${wagon.color}
               shadow-[inset_0_-5px_10px_rgba(0,0,0,0.2),0_8px_15px_rgba(0,0,0,0.3)]
               border-t border-white/30
            `}>
              {/* Window with people - Recessed */}
              <div className="w-3/4 h-1/2 bg-sky-200/80 rounded-lg shadow-[inset_0_2px_5px_rgba(0,0,0,0.2)] border-b border-white/50 flex items-center justify-center overflow-hidden backdrop-blur-sm">
                <span className={`${currentSize.font} leading-none select-none drop-shadow-sm filter`}>
                  {wagon.passengers}
                </span>
              </div>
              
              {/* Wheels */}
              <motion.div
                className="absolute -bottom-2 left-1 w-8 h-8 bg-slate-800 rounded-full border-2 border-slate-600 shadow-md z-20"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                 <div className="w-full h-1 bg-slate-500 absolute top-1/2 -translate-y-1/2"></div>
              </motion.div>
              <motion.div
                className="absolute -bottom-2 right-1 w-8 h-8 bg-slate-800 rounded-full border-2 border-slate-600 shadow-md z-20"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                 <div className="w-full h-1 bg-slate-500 absolute top-1/2 -translate-y-1/2"></div>
              </motion.div>
            </div>
            
            {/* Connector */}
            <div className="absolute top-1/2 -left-2 w-3 h-2 bg-slate-800 rounded-full -z-10"></div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
