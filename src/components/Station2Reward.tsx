import { motion } from 'motion/react';
import { SunCharacter } from './SunCharacter';
import { Button } from './ui/button';
import { Sparkles, Waves, Fish } from 'lucide-react';
import { Logo } from './Logo';

interface Station2RewardProps {
  onContinue: () => void;
}

export function Station2Reward({ onContinue }: Station2RewardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-400 via-blue-500 to-blue-700 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Logo */}
      <Logo />

      {/* Underwater Light Rays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.4),transparent_70%)]"></div>

      {/* Happy sun */}
      <motion.div
        className="absolute top-10 right-10"
        initial={{ scale: 0, y: -100 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 1 }}
      >
        <SunCharacter isHappy={true} size="large" />
      </motion.div>

      {/* Fish School */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`fish-${i}`}
          className="absolute text-white/80"
          style={{
             top: `${Math.random() * 100}%`,
             left: '-10%'
          }}
          animate={{
             x: '120vw',
             y: [0, Math.random() * 100 - 50, 0],
          }}
          transition={{
             duration: Math.random() * 10 + 5,
             repeat: Infinity,
             delay: Math.random() * 5,
             ease: "linear"
          }}
        >
           {i % 2 === 0 ? <Fish size={32 + Math.random() * 32} /> : <span className="text-4xl">🐟</span>}
        </motion.div>
      ))}

      {/* Bubbles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`bubble-${i}`}
          className="absolute bg-white/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: '-10%',
            width: Math.random() * 20 + 10,
            height: Math.random() * 20 + 10,
          }}
          animate={{
            bottom: '110%',
            x: Math.sin(i) * 50,
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: Math.random() * 5 + 3,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeIn"
          }}
        />
      ))}

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.3 }}
      >
        <motion.div
          className="mb-6 flex justify-center gap-4 items-center"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Waves className="w-24 h-24 text-blue-200" />
          <motion.span 
            className="text-9xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🌊
          </motion.span>
          <Waves className="w-24 h-24 text-blue-200" />
        </motion.div>

        <h2 className="text-5xl md:text-7xl font-black mb-4 text-white drop-shadow-lg">
          ¡Increíble!
        </h2>

        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl max-w-2xl border-4 border-blue-300"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-3xl text-blue-900 mb-4 font-bold">
            ¡El agua está cristalina! 💧
          </p>
          <p className="text-2xl text-blue-700 font-medium">
            Has limpiado el río y los peces han regresado felices.
          </p>
          
          <div className="flex justify-center gap-6 mt-6 text-5xl items-center">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>🐠</motion.div>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}>🦀</motion.div>
            <motion.div animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}>🐙</motion.div>
          </div>
        </motion.div>

        <motion.div
          className="mt-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: 'spring' }}
        >
          <Button
            onClick={onContinue}
            className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-12 py-6 rounded-full text-3xl shadow-[0_0_40px_rgba(59,130,246,0.6)] font-black border-4 border-white"
          >
            Siguiente mapa 🗺️
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
