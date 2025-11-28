import { motion } from 'motion/react';
import { TrainCharacter } from './TrainCharacter';
import { SunCharacter } from './SunCharacter';
import { EarthCharacter } from './EarthCharacter';
import { Play } from 'lucide-react';
import { Button } from './ui/button';
import { Logo } from './Logo';

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FCD116] via-[#003893] to-[#CE1126] flex flex-col items-center justify-center p-8 relative overflow-hidden perspective-[1000px]">
      {/* 3D Parallax Background Layers */}
      <div 
         className="absolute inset-0 w-full h-full transform-style-3d"
         style={{ transform: 'translateZ(-200px) scale(1.5)' }}
      >
         {/* Deep Sky Pattern or Clouds */}
         <div className="absolute top-20 left-10 opacity-50 blur-xl bg-white w-64 h-64 rounded-full"></div>
         <div className="absolute bottom-20 right-10 opacity-30 blur-xl bg-blue-300 w-96 h-96 rounded-full"></div>
      </div>

      {/* Logo */}
      <div className="absolute top-8 left-8 z-50" style={{ transform: 'translateZ(50px)' }}>
         <Logo className="block" />
      </div>

      {/* Sad clouds - Floating closer */}
      <motion.div
        className="absolute top-20 left-10 text-8xl opacity-90 z-10"
        style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))', transform: 'translateZ(20px)' }}
        animate={{ 
          x: [0, 30, 0],
          y: [0, 10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        ☁️
      </motion.div>
      <motion.div
        className="absolute top-32 right-20 text-7xl opacity-80 z-10"
        style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))', transform: 'translateZ(-50px)' }}
        animate={{ 
          x: [0, -20, 0],
          y: [0, -15, 0],
          scale: [1, 1.15, 1]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        ☁️
      </motion.div>
      
      {/* Sad sun - Floating in back */}
      <div className="absolute top-10 right-10 z-0" style={{ transform: 'translateZ(-100px) scale(0.8)' }}>
        <SunCharacter isHappy={false} size="large" />
      </div>
      
      {/* Sad earth - Floating in front left */}
      <div className="absolute bottom-20 left-10 z-20" style={{ transform: 'translateZ(50px) rotateY(10deg)' }}>
        <div className="drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]">
           <EarthCharacter isHappy={false} size="medium" />
        </div>
      </div>
      
      {/* Dead trees - 3D Element */}
      <motion.div
        className="absolute bottom-32 right-20 text-6xl opacity-90 z-10"
        style={{ 
           filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.5))',
           transform: 'translateZ(0px)'
        }}
        animate={{ 
          rotate: [0, 5, -5, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        🌳
      </motion.div>
      
      {/* Title - 3D Pop */}
      <motion.div
        className="relative z-40 mb-8 text-center"
        initial={{ scale: 0, rotateX: -90 }}
        animate={{ scale: 1, rotateX: 0 }}
        transition={{ type: "spring", duration: 1.5, bounce: 0.5 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
         <h1 className="text-6xl text-slate-900 font-black drop-shadow-[0_5px_0_rgba(255,255,255,1)]" style={{ transform: 'translateZ(20px)' }}>
            El Tren del
         </h1>
         <h1 className="text-7xl font-black text-green-700 drop-shadow-[0_5px_0_rgba(0,50,0,0.5)] tracking-tighter" style={{ transform: 'translateZ(40px)' }}>
            Futuro Verde
         </h1>
      </motion.div>
      
      {/* Sad train - Coming from depth */}
      <motion.div
        className="mb-12 relative z-30"
        initial={{ x: '100vw', opacity: 0, scale: 0.5, rotateY: 45 }}
        animate={{ x: 0, opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 1.5, delay: 0.5, type: "spring", stiffness: 50 }}
        style={{ transform: 'scaleX(-1)', transformStyle: 'preserve-3d' }}
      >
        <div className="drop-shadow-[0_30px_30px_rgba(0,0,0,0.4)]">
           <TrainCharacter isHappy={false} size="large" />
        </div>
      </motion.div>
      
      {/* Play button - 3D Button */}
      <motion.div
        className="relative z-50 perspective-[500px]"
        initial={{ scale: 0, rotateX: 90 }}
        animate={{ scale: 1, rotateX: 0 }}
        transition={{ delay: 1, type: "spring" }}
        whileHover={{ scale: 1.1, rotateX: 10 }}
        whileTap={{ scale: 0.9, rotateX: -10 }}
      >
        <Button
          onClick={onStart}
          className="
            bg-gradient-to-b from-green-400 to-green-600 text-white px-16 py-10 rounded-full text-4xl 
            border-b-8 border-green-800 shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_2px_0_rgba(255,255,255,0.5)]
            transform transition-transform active:translate-y-2 active:border-b-0
          "
        >
          <Play className="w-14 h-14 mr-4 drop-shadow-md" fill="white" />
          <span className="drop-shadow-md font-black tracking-wide">¡Jugar!</span>
        </Button>
      </motion.div>
      
      {/* Description */}
      <motion.p
        className="mt-12 text-xl text-center text-white font-bold max-w-md drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] bg-black/20 backdrop-blur-sm p-4 rounded-2xl border border-white/10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        style={{ transform: 'translateZ(10px)' }}
      >
        Ayuda al tren a viajar por Colombia
        <br />
        y hacer que el planeta sea feliz 🌍
      </motion.p>

      {/* Gobernador */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
        className="mt-8 mb-4 text-center relative z-10 bg-black/30 backdrop-blur-md py-3 px-8 rounded-full border border-white/10 shadow-xl"
      >
        <p className="text-xl text-yellow-300 mb-1 font-bold uppercase tracking-wide drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Gobernador del Huila</p>
        <p className="text-3xl text-white font-black tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>RODRIGO VILLALBA MOSQUERA</p>
      </motion.div>
    </div>
  );
}
