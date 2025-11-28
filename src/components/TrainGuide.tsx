import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrainCharacter } from './TrainCharacter';

interface TrainGuideProps {
  message: string;
  mood?: 'happy' | 'sad' | 'neutral';
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  visible?: boolean;
}

export function TrainGuide({ message, mood = 'happy', position = 'bottom-left', visible = true }: TrainGuideProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Simulate speaking animation when message changes
  useEffect(() => {
    setIsSpeaking(true);
    const timer = setTimeout(() => setIsSpeaking(false), 2000);
    return () => clearTimeout(timer);
  }, [message]);

  const positionClasses = {
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top-left': 'top-20 left-4', // Lower to avoid header collisions
    'top-right': 'top-20 right-4',
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className={`fixed ${positionClasses[position]} z-50 flex items-end pointer-events-none`}
        >
          {/* Train Character Container */}
          <motion.div 
            className="relative z-10"
            animate={isSpeaking ? { y: [0, -5, 0] } : {}}
            transition={{ duration: 0.5, repeat: isSpeaking ? Infinity : 0 }}
          >
             <div className="drop-shadow-2xl transform scale-x-[-1]"> {/* Flip to face right if on left, usually train faces left in original SVG so flip creates variety or faces content */}
                {/* Actually original Train faces LEFT. If position is bottom-left, it faces OUT. 
                    Let's control flip based on position.
                */}
                <div style={{ transform: position.includes('right') ? 'scaleX(-1)' : 'none' }}>
                   <TrainCharacter isHappy={mood === 'happy'} size="medium" />
                </div>
             </div>
          </motion.div>

          {/* Speech Bubble */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            key={message} // Re-animate on new message
            className={`
              absolute bottom-24 ${position.includes('right') ? 'right-0 mr-4' : 'left-0 ml-4'}
              bg-white border-4 border-green-500 rounded-3xl p-4 shadow-xl
              w-64 md:w-80 pointer-events-auto
            `}
          >
             <p className="text-lg md:text-xl font-bold text-slate-800 text-center leading-tight">
               {message}
             </p>
             
             {/* Bubble Triangle */}
             <div 
               className={`
                 absolute -bottom-3 w-6 h-6 bg-white border-b-4 border-r-4 border-green-500 transform rotate-45
                 ${position.includes('right') ? 'right-10' : 'left-10'}
               `}
             />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
