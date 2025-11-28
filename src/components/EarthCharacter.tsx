import { motion } from 'motion/react';

interface EarthCharacterProps {
  isHappy?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function EarthCharacter({ isHappy = false, size = 'medium' }: EarthCharacterProps) {
  const sizeMap = {
    small: 'w-20 h-20',
    medium: 'w-32 h-32',
    large: 'w-48 h-48'
  };

  return (
    <motion.div
      className={`${sizeMap[size]} relative perspective-[500px]`}
      animate={{
        y: [0, -10, 0],
        rotate: [0, 2, -2, 0]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Planet Body - 3D Sphere Look */}
      <div className={`
        w-full h-full rounded-full relative overflow-hidden
        bg-gradient-to-br from-blue-400 via-blue-500 to-blue-800
        shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.5),0_10px_20px_rgba(0,0,0,0.4)]
        border-2 border-blue-300/50
      `}>
        {/* Continents - Animated to simulate rotation */}
        <motion.div 
          className="absolute inset-0 w-[200%]"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
           {/* Set 1 */}
           <div className="absolute top-1/4 left-4 w-1/3 h-1/3 bg-green-500 rounded-full blur-[2px] opacity-80"></div>
           <div className="absolute bottom-1/4 left-1/3 w-1/4 h-1/4 bg-green-600 rounded-full blur-[1px] opacity-80"></div>
           <div className="absolute top-1/2 left-2/3 w-1/3 h-1/3 bg-green-500 rounded-full blur-[2px] opacity-80"></div>
           
           {/* Set 2 (Copy for seamless loop) */}
           <div className="absolute top-1/4 left-[54%] w-1/3 h-1/3 bg-green-500 rounded-full blur-[2px] opacity-80"></div>
           <div className="absolute bottom-1/4 left-[83%] w-1/4 h-1/4 bg-green-600 rounded-full blur-[1px] opacity-80"></div>
           <div className="absolute top-1/2 left-[116%] w-1/3 h-1/3 bg-green-500 rounded-full blur-[2px] opacity-80"></div>
        </motion.div>

        {/* Atmosphere Glow */}
        <div className="absolute inset-0 rounded-full shadow-[inset_10px_10px_20px_rgba(255,255,255,0.3)]"></div>

        {/* Face */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="relative w-2/3 h-2/3 flex flex-col items-center justify-center gap-2">
            {/* Eyes */}
            <div className="flex gap-6">
              <div className="w-6 h-8 bg-white rounded-full flex items-center justify-center relative overflow-hidden shadow-sm">
                 <div className={`absolute ${isHappy ? 'top-1/3' : 'bottom-1/3'} w-3 h-3 bg-black rounded-full`}></div>
                 {!isHappy && <div className="absolute top-0 w-full h-1/2 bg-blue-700/30 rounded-b-xl"></div>} {/* Eyelid for sad */}
              </div>
              <div className="w-6 h-8 bg-white rounded-full flex items-center justify-center relative overflow-hidden shadow-sm">
                 <div className={`absolute ${isHappy ? 'top-1/3' : 'bottom-1/3'} w-3 h-3 bg-black rounded-full`}></div>
                 {!isHappy && <div className="absolute top-0 w-full h-1/2 bg-blue-700/30 rounded-b-xl"></div>}
              </div>
            </div>
            
            {/* Cheeks */}
            {isHappy && (
              <div className="absolute top-1/2 w-full flex justify-between px-2">
                 <div className="w-4 h-2 bg-pink-400/50 rounded-full blur-sm"></div>
                 <div className="w-4 h-2 bg-pink-400/50 rounded-full blur-sm"></div>
              </div>
            )}
            
            {/* Mouth */}
            <div className="mt-1">
              {isHappy ? (
                <div className="w-8 h-4 bg-red-900 rounded-b-full relative overflow-hidden border-2 border-red-900/20">
                   <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-3 bg-red-500 rounded-t-full opacity-80"></div>
                </div>
              ) : (
                <div className="w-8 h-3 bg-transparent border-t-4 border-blue-900/60 rounded-t-full"></div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Happy decorations */}
      {isHappy && (
        <>
          <motion.div
            className="absolute -top-4 -right-4 text-3xl"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨
          </motion.div>
          <motion.div
            className="absolute bottom-0 -left-4 text-3xl"
            animate={{ scale: [1, 1.2, 1], y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            🌱
          </motion.div>
        </>
      )}
      
      {/* Sad decorations */}
      {!isHappy && (
         <motion.div
            className="absolute -top-2 right-0 text-2xl opacity-80"
            animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
         >
            💨
         </motion.div>
      )}
    </motion.div>
  );
}
