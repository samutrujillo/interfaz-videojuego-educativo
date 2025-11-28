import { motion } from 'motion/react';
import { Sun } from 'lucide-react';

interface SunCharacterProps {
  isHappy?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function SunCharacter({ isHappy = false, size = 'medium' }: SunCharacterProps) {
  const sizeMap = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  return (
    <motion.div
      className={`${sizeMap[size]} relative`}
      style={{ 
        filter: isHappy 
          ? 'drop-shadow(0 0 30px rgba(251, 191, 36, 0.9)) drop-shadow(0 0 60px rgba(255, 200, 0, 0.6))' 
          : 'drop-shadow(0 0 30px rgba(255, 220, 50, 0.8)) drop-shadow(0 0 50px rgba(255, 180, 0, 0.7))'
      }}
      animate={{
        rotate: 360,
        scale: [1, 1.1, 1]
      }}
      transition={{
        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <Sun 
        className={`w-full h-full ${isHappy ? 'text-yellow-400' : 'text-yellow-400'}`} 
        strokeWidth={2}
        fill={isHappy ? '#fbbf24' : '#fcd34d'}
      />
      
      {/* Face */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-1/2 h-1/2">
          {/* Eyes */}
          <div className="absolute top-1/4 left-1/4 flex gap-1">
            <div className={`w-2 h-2 rounded-full ${isHappy ? 'bg-orange-800' : 'bg-gray-600'}`}></div>
            <div className={`w-2 h-2 rounded-full ${isHappy ? 'bg-orange-800' : 'bg-gray-600'}`}></div>
          </div>
          
          {/* Mouth */}
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2">
            {isHappy ? (
              <div className="w-6 h-3 border-2 border-orange-800 border-t-0 rounded-b-full"></div>
            ) : (
              <div className="w-6 h-3 border-2 border-gray-600 border-b-0 rounded-t-full"></div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}