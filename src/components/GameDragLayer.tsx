import { useDragLayer } from 'react-dnd';
import { Sprout, Droplets, Sun, Recycle, Trash2 } from 'lucide-react';

// Styles for the drag layer container
const layerStyles: React.CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 9999, // Very high z-index to be above everything
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  touchAction: 'none'
};

function getItemStyles(initialOffset: { x: number; y: number } | null, currentOffset: { x: number; y: number } | null) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    };
  }

  let { x, y } = currentOffset;

  // Use GPU acceleration
  const transform = `translate3d(${x}px, ${y}px, 0)`;
  return {
    transform,
    WebkitTransform: transform,
    // Center the preview under the finger better on mobile
    marginTop: '-30px', 
    marginLeft: '-30px'
  };
}

export function GameDragLayer() {
  const { itemType, isDragging, item, initialOffset, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging) {
    return null;
  }

  return (
    <div style={layerStyles}>
      <div style={getItemStyles(initialOffset, currentOffset)}>
        {renderPreview(itemType, item)}
      </div>
    </div>
  );
}

function renderPreview(type: any, item: any) {
  switch (type) {
    case 'tool':
      return <ToolPreview type={item.toolType} />;
    case 'trash':
      return <TrashPreview emoji={item.emoji} />;
    case 'solar-panel':
      return <SolarPanelPreview />;
    case 'animal':
      return <AnimalPreview emoji={item.emoji} />;
    default:
      return null;
  }
}

// --- Preview Components ---

const ToolPreview = ({ type }: { type: 'seed' | 'water' }) => (
  <div className={`
    w-20 h-20 md:w-24 md:h-24 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-2xl border-4
    ${type === 'seed' ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-blue-100 border-blue-300 text-blue-600'}
    opacity-100 scale-105 origin-center
  `}>
     {type === 'seed' ? <Sprout className="w-8 h-8 md:w-10 md:h-10" /> : <Droplets className="w-8 h-8 md:w-10 md:h-10" />}
     <span className="font-bold text-xs md:text-sm uppercase">{type === 'seed' ? 'Semillas' : 'Agua'}</span>
  </div>
);

const TrashPreview = ({ emoji }: { emoji: string }) => (
  <div className="text-7xl md:text-8xl drop-shadow-2xl scale-110 origin-center">
    {emoji}
  </div>
);

const SolarPanelPreview = () => (
  <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl border-2 border-blue-300 flex items-center justify-center shadow-2xl relative overflow-hidden opacity-100 scale-105 origin-center">
    <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[1px] bg-blue-900 opacity-30">
       <div></div><div></div><div></div><div></div>
    </div>
    <Sun className="text-yellow-300 w-10 h-10 md:w-12 md:h-12 relative z-10" />
  </div>
);

const AnimalPreview = ({ emoji }: { emoji: string }) => (
  <div className="text-7xl md:text-8xl drop-shadow-2xl scale-110 origin-center">
     {emoji}
  </div>
);
