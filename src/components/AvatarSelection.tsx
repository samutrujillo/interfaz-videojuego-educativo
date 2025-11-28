import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Logo } from './Logo';
import { Check, User } from 'lucide-react';

export interface Avatar {
  id: string;
  name: string;
  color: string;
  emoji: string;
  description: string;
}

const AVATARS: Avatar[] = [
  { id: 'huila-1', name: 'María Bambuco', color: 'bg-rose-500', emoji: '💃', description: 'Bailarina del Sanjuanero' },
  { id: 'huila-2', name: 'José Arriero', color: 'bg-amber-600', emoji: '🤠', description: 'Campesino Cafetero' },
  { id: 'huila-3', name: 'Guardián Pijao', color: 'bg-emerald-600', emoji: '🦅', description: 'Protector del Nevado' },
  { id: 'huila-4', name: 'Lupita Tatacoa', color: 'bg-orange-500', emoji: '🔭', description: 'Astrónoma del Desierto' },
];

interface AvatarSelectionProps {
  onSelect: (avatar: Avatar) => void;
}

export function AvatarSelection({ onSelect }: AvatarSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <Logo />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 z-10"
      >
        <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg mb-2">
          ¡Elige tu Héroe!
        </h2>
        <p className="text-xl text-white/90 font-medium">
          ¿Quién conducirá el Tren del Futuro Verde hoy?
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 z-10 w-full max-w-5xl">
        {AVATARS.map((avatar, index) => (
          <motion.button
            key={avatar.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(avatar)}
            className="relative group"
          >
            <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl transform rotate-2 group-hover:rotate-0 transition-transform duration-300"></div>
            <div className={`relative bg-white p-6 rounded-3xl shadow-lg border-4 border-transparent hover:border-yellow-400 transition-colors h-full flex flex-col items-center`}>
              
              {/* Avatar Circle */}
              <div className={`w-32 h-32 rounded-full ${avatar.color} flex items-center justify-center text-6xl shadow-inner mb-4 group-hover:scale-110 transition-transform`}>
                {avatar.emoji}
              </div>

              <h3 className="text-2xl font-bold text-slate-800 mb-1">{avatar.name}</h3>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-4">{avatar.description}</p>
              
              <div className={`mt-auto px-6 py-2 rounded-full text-white font-bold ${avatar.color} opacity-0 group-hover:opacity-100 transition-opacity flex items-center`}>
                Elegir <Check className="ml-2 w-5 h-5" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 text-white/20 animate-pulse">
         <User size={100} />
      </div>
      <div className="absolute bottom-20 right-10 text-white/20 animate-pulse">
         <User size={150} />
      </div>
    </div>
  );
}
