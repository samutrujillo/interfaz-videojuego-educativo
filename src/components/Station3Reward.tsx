import { motion } from 'motion/react';
import { SunCharacter } from './SunCharacter';
import { Button } from './ui/button';
import { Lightbulb, CloudOff, Building2, Zap } from 'lucide-react';
import { Logo } from './Logo';

interface Station3RewardProps {
  onContinue: () => void;
}

export function Station3Reward({ onContinue }: Station3RewardProps) {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background Transition */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-sky-400 via-blue-300 to-indigo-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />
      
      {/* City Silhouette (Bright) */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-1/2 z-0 flex items-end justify-center opacity-60"
        initial={{ filter: 'grayscale(100%) brightness(50%)' }}
        animate={{ filter: 'grayscale(0%) brightness(100%)' }}
        transition={{ duration: 3 }}
      >
         <svg viewBox="0 0 1200 320" className="w-full h-full fill-indigo-800" preserveAspectRatio="none">
             <path d="M0,320 L100,200 L200,320 L250,150 L350,320 L450,250 L600,320 L800,100 L900,320 L1000,180 L1200,320 Z" />
         </svg>
         {/* Windows turning on */}
         {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-yellow-300 w-2 h-3 md:w-4 md:h-6 shadow-[0_0_10px_rgba(253,224,71,0.8)]"
              style={{ 
                left: `${10 + Math.random() * 80}%`, 
                bottom: `${Math.random() * 30}%` 
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5, 1] }}
              transition={{ delay: 1 + Math.random() * 2, duration: 0.5 }}
            />
         ))}
      </motion.div>

      {/* Fading Smoke */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-10"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0, y: -200 }}
        transition={{ duration: 4 }}
      >
         {[...Array(5)].map((_, i) => (
           <CloudOff key={i} className="absolute text-gray-600 w-32 h-32 opacity-50" 
             style={{ left: `${20 + i * 15}%`, top: `${30 + (i%2)*10}%` }} 
           />
         ))}
      </motion.div>

      {/* Logo */}
      <Logo />

      {/* Sun */}
      <motion.div
        className="absolute top-10 right-10"
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 1, delay: 2 }}
      >
        <SunCharacter isHappy={true} size="large" />
      </motion.div>

      {/* Main content */}
      <motion.div
        className="relative z-20 text-center mt-10"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 2.5 }}
      >
        <motion.div
          className="mb-6 flex justify-center gap-4 items-center"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="relative">
             <Building2 className="w-24 h-24 text-indigo-600" />
             <motion.div 
               className="absolute -top-4 -right-4"
               animate={{ scale: [1, 1.2, 1] }}
               transition={{ duration: 1, repeat: Infinity }}
             >
                <Lightbulb className="w-12 h-12 text-yellow-400 fill-yellow-400 drop-shadow-lg" />
             </motion.div>
          </div>
        </motion.div>

        <h2 className="text-5xl md:text-6xl font-black mb-4 text-indigo-900 drop-shadow-lg bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full">
          ¡Ciudad Brillante!
        </h2>

        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-2xl border-4 border-yellow-400 mx-auto"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 3 }}
        >
          <p className="text-2xl text-indigo-800 font-bold mb-4">
             ¡La energía limpia ilumina el futuro! ⚡
          </p>
          <p className="text-xl text-slate-600 font-medium">
             El humo se ha ido y las luces brillan con energía solar.
          </p>
          
          {/* Energy Flow Animation */}
          <div className="flex justify-center gap-2 mt-6">
             {[...Array(5)].map((_, i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, scale: 0 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 3.5 + i * 0.2 }}
               >
                  <Zap className="w-8 h-8 text-yellow-500 fill-yellow-500" />
               </motion.div>
             ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 4, type: 'spring' }}
        >
          <Button
            onClick={onContinue}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-12 py-6 rounded-full text-3xl shadow-2xl font-black border-4 border-white"
          >
            Siguiente Misión ➡️
          </Button>
        </motion.div>
      </motion.div>
      
      {/* Sparkles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute w-4 h-4 bg-yellow-300 rounded-full blur-sm"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: Math.random() * 2 + 2
          }}
        />
      ))}
    </div>
  );
}
