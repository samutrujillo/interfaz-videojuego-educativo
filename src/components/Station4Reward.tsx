import { motion } from 'motion/react';
import { SunCharacter } from './SunCharacter';
import { Button } from './ui/button';
import { Mountain, Heart, Cloud } from 'lucide-react';
import { Logo } from './Logo';

interface Station4RewardProps {
  onContinue: () => void;
}

export function Station4Reward({ onContinue }: Station4RewardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-blue-200 to-green-100 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Logo */}
      <Logo />

      {/* Mountain Background */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 z-0 flex items-end justify-center opacity-80">
         <svg viewBox="0 0 1000 500" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,500 L300,200 L500,500 L700,300 L1000,500 Z" fill="#78716c" />
            <path d="M400,200 L500,50 L600,200 L550,180 L500,220 L450,180 Z" fill="white" />
         </svg>
      </div>

      {/* Floating Clouds */}
      <motion.div 
        className="absolute top-20 left-10 text-white/80"
        animate={{ x: [0, 50, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      >
         <Cloud className="w-32 h-20 fill-white" />
      </motion.div>

      {/* Sun */}
      <motion.div
        className="absolute top-10 right-10"
        initial={{ scale: 0, y: -100 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 1 }}
      >
        <SunCharacter isHappy={true} size="large" />
      </motion.div>

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center mt-10"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.5 }}
      >
        <motion.div
          className="mb-6 flex justify-center gap-4 items-center"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Mountain className="w-24 h-24 text-green-700" />
          <motion.div 
            className="text-9xl"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🏔️
          </motion.div>
        </motion.div>

        <h2 className="text-5xl md:text-6xl font-black mb-4 text-green-900 drop-shadow-lg">
          ¡La Vida Regresa!
        </h2>

        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-2xl border-4 border-green-500 mx-auto"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-2xl text-green-800 font-bold mb-4">
            ¡Gracias a ti, los animales están a salvo! 🐾
          </p>
          <p className="text-xl text-slate-600 font-medium">
            Perezosos, monos y aves vuelven a llenar de alegría la montaña.
          </p>
          
          {/* Returning Animals Animation */}
          <div className="relative h-32 mt-6 w-full overflow-hidden rounded-xl bg-green-100/50">
             {/* Sloth */}
             <motion.div 
               className="absolute bottom-2 left-[20%] text-6xl"
               initial={{ y: 100 }} animate={{ y: 0 }} transition={{ delay: 1.5, type: 'spring' }}
             >
               🦥
             </motion.div>
             {/* Monkey */}
             <motion.div 
               className="absolute bottom-2 right-[20%] text-6xl"
               initial={{ y: 100 }} animate={{ y: 0 }} transition={{ delay: 1.8, type: 'spring' }}
             >
               🐒
             </motion.div>
             {/* Bird */}
             <motion.div 
               className="absolute top-4 left-[50%] text-6xl"
               initial={{ x: -200, y: -50 }} animate={{ x: 0, y: 0 }} transition={{ delay: 2, type: 'spring' }}
             >
               🦅
             </motion.div>

             {/* Hearts */}
             {[...Array(5)].map((_, i) => (
                <motion.div
                   key={i}
                   className="absolute"
                   style={{ left: `${20 + i * 15}%`, bottom: '40%' }}
                   initial={{ opacity: 0, scale: 0 }}
                   animate={{ opacity: 1, scale: 1, y: -50 }}
                   transition={{ delay: 2.5 + i * 0.2, duration: 2, repeat: Infinity }}
                >
                   <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                </motion.div>
             ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 3, type: 'spring' }}
        >
          <Button
            onClick={onContinue}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-12 py-6 rounded-full text-3xl shadow-2xl font-black border-4 border-white"
          >
            ¡Completar Viaje! 🏁
          </Button>
        </motion.div>
      </motion.div>
      
      {/* Confetti */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`confetti-${i}`}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: ['#22c55e', '#3b82f6', '#ef4444'][i % 3],
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          animate={{
            y: [0, 100],
            opacity: [1, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  );
}
