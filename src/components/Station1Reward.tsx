import { motion } from 'motion/react';
import { SunCharacter } from './SunCharacter';
import { Button } from './ui/button';
import { Logo } from './Logo';
import { Trees, Bird } from 'lucide-react';

interface Station1RewardProps {
  onContinue: () => void;
}

const Butterfly = ({ color, delay, x, y }: { color: string, delay: number, x: number, y: number }) => (
  <motion.svg
    viewBox="0 0 24 24"
    className={`w-12 h-12 absolute z-20 ${color}`}
    style={{ top: `${y}%`, left: `${x}%` }}
    initial={{ scale: 0 }}
    animate={{ 
      scale: 1,
      x: [0, 20, -20, 0], 
      y: [0, -15, 0], 
      rotate: [0, 10, -10, 0] 
    }}
    transition={{ duration: 4, repeat: Infinity, delay }}
  >
    <path fill="currentColor" d="M12 2C12 2 11 3 11 5C11 7 12 9 12 9C12 9 13 7 13 5C13 3 12 2 12 2ZM11 5C9 3 5 2 5 5C5 8 9 9 11 9C9 9 6 11 6 14C6 17 9 16 11 14C11 16 10 19 12 21C14 19 13 16 13 14C15 16 18 17 18 14C18 11 15 9 13 9C15 9 19 8 19 5C19 2 15 3 13 5C13 5 11 5 11 5Z" />
  </motion.svg>
);

export function Station1Reward({ onContinue }: Station1RewardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 via-emerald-300 to-emerald-600 flex flex-col items-center justify-center p-8 relative overflow-hidden perspective-[1000px]">
      {/* Logo */}
      <div className="relative z-50 transform-style-3d" style={{ transform: 'translateZ(50px)' }}>
         <Logo />
      </div>

      {/* Background Trees - 3D Depth */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-green-800/40 to-transparent pointer-events-none" style={{ transform: 'translateZ(-100px)' }}></div>
      <div className="absolute bottom-0 left-10 text-green-900/20 transform scale-150" style={{ transform: 'translateZ(-50px)' }}>
         <Trees size={200} />
      </div>
      <div className="absolute bottom-0 right-10 text-green-900/20 transform scale-150" style={{ transform: 'translateZ(-80px)' }}>
         <Trees size={180} />
      </div>

      {/* Happy sun - 3D Pop */}
      <motion.div
        className="absolute top-10 right-10"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 1 }}
        style={{ transform: 'translateZ(-100px)' }}
      >
        <SunCharacter isHappy={true} size="large" />
      </motion.div>

      {/* Butterflies - Floating */}
      <div className="absolute inset-0 transform-style-3d">
         <Butterfly color="text-pink-500" delay={0} x={10} y={20} />
         <Butterfly color="text-yellow-400" delay={1.5} x={80} y={15} />
         <Butterfly color="text-purple-600" delay={0.5} x={20} y={60} />
         <Butterfly color="text-orange-500" delay={2} x={70} y={70} />
      </div>

      {/* Flying Bird */}
      <motion.div
        className="absolute top-1/4 -left-20 text-blue-700"
        animate={{
          x: ['0vw', '120vw'],
          y: [0, -30, 0, 50, 0],
          rotateY: 180
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ transform: 'translateZ(20px)' }}
      >
        <Bird size={64} />
      </motion.div>

      {/* Main content - Floating Card */}
      <motion.div
        className="relative z-10 text-center transform-style-3d"
        initial={{ scale: 0, rotateX: 90 }}
        animate={{ scale: 1, rotateX: 0 }}
        transition={{ type: 'spring', delay: 0.3, duration: 1.5 }}
      >
        <motion.div
          className="text-9xl mb-6 drop-shadow-2xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          style={{ transform: 'translateZ(60px)' }}
        >
          🎉
        </motion.div>

        <h2 className="text-5xl md:text-6xl font-black mb-4 text-white drop-shadow-[0_5px_0_rgba(0,0,0,0.2)]" style={{ transform: 'translateZ(40px)' }}>
          ¡Bosque Salvado!
        </h2>

        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] max-w-2xl border-b-8 border-green-300"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ transform: 'rotateX(10deg)' }}
        >
          <p className="text-3xl text-green-800 mb-4 font-bold">
            ¡Los árboles están creciendo! 🌳
          </p>
          <p className="text-2xl text-green-600 font-medium">
            Las aves y mariposas han regresado a su hogar gracias a ti.
          </p>
          
          <div className="flex justify-center gap-6 mt-6 text-5xl">
             <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>🐦</motion.div>
             <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}>🦋</motion.div>
             <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }}>🌲</motion.div>
          </div>
        </motion.div>

        <motion.div
          className="mt-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: 'spring' }}
          style={{ transform: 'translateZ(80px)' }}
        >
          <Button
            onClick={onContinue}
            className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-yellow-900 px-12 py-8 rounded-full text-3xl shadow-[0_10px_30px_rgba(234,179,8,0.4),inset_0_2px_0_rgba(255,255,255,0.5)] font-black border-4 border-white"
          >
            Siguiente estación 🚂
          </Button>
        </motion.div>
      </motion.div>

      {/* Nature sparkles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl text-yellow-200 z-0"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            transform: `translateZ(${Math.random() * 100 - 50}px)`
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        >
          ✨
        </motion.div>
      ))}
    </div>
  );
}
