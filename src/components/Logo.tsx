import { motion } from 'motion/react';
import logo from 'figma:asset/a7e19fda6fb02282a50681fc2aebecec82d146b0.png';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function Logo({ size = 'medium', className = "absolute top-8 left-8 z-50" }: LogoProps) {
  const sizeMap = {
    small: 'w-24',
    medium: 'w-32',
    large: 'w-40'
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <img 
        src={logo} 
        alt="Gobernación del Huila - Secretaría de Agricultura y Minería" 
        className={`${sizeMap[size]} h-auto drop-shadow-lg`}
      />
    </motion.div>
  );
}