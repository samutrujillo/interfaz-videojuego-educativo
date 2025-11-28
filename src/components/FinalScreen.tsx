import { motion } from 'motion/react';
import { TrainCharacter } from './TrainCharacter';
import { SunCharacter } from './SunCharacter';
import { EarthCharacter } from './EarthCharacter';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Logo } from './Logo';

interface FinalScreenProps {
  onRestart: () => void;
}

export function FinalScreen({ onRestart }: FinalScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-300 via-yellow-200 to-green-300 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Logo */}
      <Logo />

      {/* Background */}
      <div className="absolute inset-0 opacity-20">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1739734963154-7a8b3c8e5944?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZWxlYnJhdGlvbiUyMHBhcnR5JTIwY29uZmV0dGl8ZW58MXx8fHwxNzYzOTk1MTY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Celebration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Confetti */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`confetti-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: -20,
            fontSize: '2rem',
          }}
          animate={{
            y: ['0vh', '110vh'],
            rotate: [0, Math.random() * 720 - 360],
            x: [0, Math.random() * 200 - 100],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          {['🎊', '🎉', '⭐', '✨', '💚', '💛', '💙', '🌟'][Math.floor(Math.random() * 8)]}
        </motion.div>
      ))}

      {/* Happy characters dancing */}
      <motion.div
        className="absolute top-10 left-10"
        animate={{
          y: [0, -20, 0],
          rotate: [-5, 5, -5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        <SunCharacter isHappy={true} size="large" />
      </motion.div>

      <motion.div
        className="absolute top-10 right-10"
        animate={{
          y: [0, -15, 0],
          rotate: [5, -5, 5],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
        }}
      >
        <EarthCharacter isHappy={true} size="large" />
      </motion.div>

      {/* Dancing animals */}
      {[
        { emoji: '🐟', left: '10%', top: '30%' },
        { emoji: '🦋', left: '15%', top: '50%' },
        { emoji: '🐻', left: '85%', top: '40%' },
        { emoji: '🦌', left: '90%', top: '60%' },
        { emoji: '🐦', left: '10%', top: '70%' },
        { emoji: '🐠', left: '85%', top: '75%' },
      ].map((animal, i) => (
        <motion.div
          key={i}
          className="absolute text-6xl"
          style={{ left: animal.left, top: animal.top }}
          animate={{
            y: [0, -30, 0],
            rotate: [-10, 10, -10],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5 + Math.random(),
            repeat: Infinity,
            delay: Math.random() * 0.5,
          }}
        >
          {animal.emoji}
        </motion.div>
      ))}

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center max-w-4xl"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.3 }}
      >
        {/* Happy Green Train */}
        <motion.div
          className="mb-8"
          animate={{
            x: [-100, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            x: { duration: 2, type: 'spring' },
            rotate: { duration: 2, repeat: Infinity },
          }}
        >
          <TrainCharacter isHappy={true} size="large" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="text-7xl mb-4 text-green-800">
            ¡Lo lograste!
          </h1>
          <h2 className="text-5xl mb-6 text-green-700">
            🎉 Fiesta en Neiva 🎊
          </h2>
        </motion.div>

        {/* Main message */}
        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl mb-6 max-w-3xl mx-auto"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            🌍
          </motion.div>

          <p className="text-3xl text-green-800 mb-4">
            La Tierra está feliz 💚
          </p>
          
          <p className="text-xl text-green-700 mb-3">
            El Tren Verde viajó por toda Colombia
          </p>
          
          <p className="text-lg text-green-600 mb-4">
            Limpiaste el río, instalaste energía limpia,
            <br />
            plantaste árboles y salvaste el bosque
          </p>

          {/* Achievement badges */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <motion.div
              className="bg-blue-100 rounded-2xl p-3 shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <div className="text-4xl mb-1">💧</div>
              <p className="text-xs">Río Limpio</p>
            </motion.div>
            <motion.div
              className="bg-yellow-100 rounded-2xl p-3 shadow-lg"
              whileHover={{ scale: 1.1, rotate: -5 }}
            >
              <div className="text-4xl mb-1">☀️</div>
              <p className="text-xs">Energía Limpia</p>
            </motion.div>
            <motion.div
              className="bg-green-100 rounded-2xl p-3 shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <div className="text-4xl mb-1">🌲</div>
              <p className="text-xs">Reforestación</p>
            </motion.div>
            <motion.div
              className="bg-emerald-100 rounded-2xl p-3 shadow-lg"
              whileHover={{ scale: 1.1, rotate: -5 }}
            >
              <div className="text-4xl mb-1">🔥</div>
              <p className="text-xs">Bosque Salvado</p>
            </motion.div>
          </div>

          <motion.p
            className="text-2xl text-green-800"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          >
            ¡Eres un héroe del planeta! 🌟
          </motion.p>
        </motion.div>

        {/* Gobernador */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mb-6"
        >
          <p className="text-xl text-green-800 mb-1">Gobernador del Huila</p>
          <p className="text-2xl text-green-900">RODRIGO VILLALBA MOSQUERA</p>
        </motion.div>

        {/* Restart button */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: 'spring' }}
        >
          <Button
            onClick={onRestart}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-12 py-6 rounded-full text-3xl shadow-2xl"
          >
            Jugar otra vez 🚂
          </Button>
        </motion.div>
      </motion.div>

      {/* Floating hearts */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`heart-${i}`}
          className="absolute text-4xl"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: -50,
          }}
          animate={{
            y: [0, -800],
            x: [0, Math.random() * 100 - 50],
            rotate: [0, 360],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          💚
        </motion.div>
      ))}
    </div>
  );
}