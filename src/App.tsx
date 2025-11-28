import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { StartScreen } from './components/StartScreen';
import { AvatarSelection, Avatar } from './components/AvatarSelection';
import { MapScreen } from './components/MapScreen';
import { Station1Game } from './components/Station1Game';
import { Station1Reward } from './components/Station1Reward';
import { Station2Game } from './components/Station2Game';
import { Station2Reward } from './components/Station2Reward';
import { Station3Game } from './components/Station3Game';
import { Station3Reward } from './components/Station3Reward';
import { Station4Game } from './components/Station4Game';
import { Station4Reward } from './components/Station4Reward';
import { FinalScreen } from './components/FinalScreen';

type GameScreen = 
  | 'start'
  | 'avatar-selection'
  | 'map'
  | 'station1-game'
  | 'station1-reward'
  | 'station2-game'
  | 'station2-reward'
  | 'station3-game'
  | 'station3-reward'
  | 'station4-game'
  | 'station4-reward'
  | 'final';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('start');
  const [completedStations, setCompletedStations] = useState([false, false, false, false]);
  const [currentStation, setCurrentStation] = useState(0);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);

  const handleStart = () => {
    setCurrentScreen('avatar-selection');
  };

  const handleAvatarSelect = (avatar: Avatar) => {
    setSelectedAvatar(avatar);
    setCurrentScreen('map');
  };

  const handleStationSelect = (stationId: number) => {
    switch (stationId) {
      case 1:
        setCurrentScreen('station1-game');
        break;
      case 2:
        setCurrentScreen('station2-game');
        break;
      case 3:
        setCurrentScreen('station3-game');
        break;
      case 4:
        setCurrentScreen('station4-game');
        break;
    }
  };

  const handleStation1Complete = () => {
    setCurrentScreen('station1-reward');
  };

  const handleStation1Reward = () => {
    setCompletedStations([true, false, false, false]);
    setCurrentStation(1);
    setCurrentScreen('map');
  };

  const handleStation2Complete = () => {
    setCurrentScreen('station2-reward');
  };

  const handleStation2Reward = () => {
    setCompletedStations([true, true, false, false]);
    setCurrentStation(2);
    setCurrentScreen('map');
  };

  const handleStation3Complete = () => {
    setCurrentScreen('station3-reward');
  };

  const handleStation3Reward = () => {
    setCompletedStations([true, true, true, false]);
    setCurrentStation(3);
    setCurrentScreen('map');
  };

  const handleStation4Complete = () => {
    setCurrentScreen('station4-reward');
  };

  const handleStation4Reward = () => {
    setCompletedStations([true, true, true, true]);
    setCurrentScreen('final');
  };

  const handleRestart = () => {
    setCurrentScreen('start');
    setCompletedStations([false, false, false, false]);
    setCurrentStation(0);
    setSelectedAvatar(null);
  };

  return (
    <div className="w-full h-[100dvh] bg-slate-900 overflow-hidden relative">
      <style>{`
        body, html {
           overscroll-behavior: none;
           height: 100%;
           overflow: hidden;
           position: fixed;
           width: 100%;
        }
        /* Remove tap highlight */
        * {
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }
      `}</style>
      
      <AnimatePresence mode="wait">
        {currentScreen === 'start' && (
          <motion.div key="start" className="w-full h-full absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <StartScreen onStart={handleStart} />
          </motion.div>
        )}
        
        {currentScreen === 'avatar-selection' && (
          <motion.div key="avatar" className="w-full h-full absolute inset-0" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}>
            <AvatarSelection onSelect={handleAvatarSelect} />
          </motion.div>
        )}
        
        {currentScreen === 'map' && (
          <motion.div key="map" className="w-full h-full absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MapScreen
              currentStation={currentStation}
              completedStations={completedStations}
              onStationSelect={handleStationSelect}
              avatar={selectedAvatar}
            />
          </motion.div>
        )}
        
        {currentScreen === 'station1-game' && (
          <motion.div key="s1-game" className="w-full h-full absolute inset-0" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <Station1Game onComplete={handleStation1Complete} />
          </motion.div>
        )}
        
        {currentScreen === 'station1-reward' && (
          <motion.div key="s1-reward" className="w-full h-full absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Station1Reward onContinue={handleStation1Reward} />
          </motion.div>
        )}
        
        {currentScreen === 'station2-game' && (
          <motion.div key="s2-game" className="w-full h-full absolute inset-0" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <Station2Game onComplete={handleStation2Complete} />
          </motion.div>
        )}
        
        {currentScreen === 'station2-reward' && (
          <motion.div key="s2-reward" className="w-full h-full absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Station2Reward onContinue={handleStation2Reward} />
          </motion.div>
        )}
        
        {currentScreen === 'station3-game' && (
          <motion.div key="s3-game" className="w-full h-full absolute inset-0" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <Station3Game onComplete={handleStation3Complete} />
          </motion.div>
        )}
        
        {currentScreen === 'station3-reward' && (
          <motion.div key="s3-reward" className="w-full h-full absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Station3Reward onContinue={handleStation3Reward} />
          </motion.div>
        )}
        
        {currentScreen === 'station4-game' && (
          <motion.div key="s4-game" className="w-full h-full absolute inset-0" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <Station4Game onComplete={handleStation4Complete} />
          </motion.div>
        )}
        
        {currentScreen === 'station4-reward' && (
          <motion.div key="s4-reward" className="w-full h-full absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Station4Reward onContinue={handleStation4Reward} />
          </motion.div>
        )}
        
        {currentScreen === 'final' && (
          <motion.div key="final" className="w-full h-full absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FinalScreen onRestart={handleRestart} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
