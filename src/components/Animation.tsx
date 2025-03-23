import React, { useState, useEffect } from 'react';

import AAnimation from '../../animations/A.png';
import OAnimation from '../../animations/O.png';
import EAnimation from '../../animations/E.png';
import WRAnimation from '../../animations/WR.png';
import TSAnimation from '../../animations/TS.png';
import LnAnimation from '../../animations/LN.png';
import UqAnimation from '../../animations/UQ.png';
import MbpAnimation from '../../animations/MBP.png';
import FvAnimation from '../../animations/FV.png';

// Mapping of letters to animation files
const animationMap: { [key: string]: string } = {
  A: AAnimation,
  O: OAnimation,
  E: EAnimation,
  WR: WRAnimation,
  TS: TSAnimation,
  LN: LnAnimation,
  UQ: UqAnimation,
  MBP: MbpAnimation,
  FV: FvAnimation,
};

// Props for the component
interface LipSyncAnimationProps {
  sentence: string;
  interval?: number;
}

const LipSyncAnimation: React.FC<LipSyncAnimationProps> = ({
  sentence = 'HELLO WORLD', // make sure the string is ALL CAPS
  interval = 1000,
}) => {
  // Function to convert a sentence into a script array
  const generateScript = (sentence: string): string[] => {
    const script: string[] = [];
    const words = sentence.toUpperCase().split(' ');

    for (const word of words) {
      for (let i = 0; i < word.length; i++) {
        const currentChar = word[i];
        const nextChar = word[i + 1];

        if (currentChar === 'W' && nextChar === 'R') {
          script.push('WR');
          i++;
        } else if (currentChar === 'T' && nextChar === 'S') {
          script.push('TS');
          i++;
        } else if (currentChar === 'L' && nextChar === 'N') {
          script.push('LN');
          i++;
        } else if (currentChar === 'U' && nextChar === 'Q') {
          script.push('UQ');
          i++;
        } else if (currentChar === 'M' && (nextChar === 'B' || nextChar === 'P')) {
          script.push('MBP');
          i++;
        } else if (currentChar === 'F' && nextChar === 'V') {
          script.push('FV');
          i++;
        } else if (['A', 'O', 'E'].includes(currentChar)) {
          script.push(currentChar);
        } else {
          // Default to a neutral animation for unsupported characters
          script.push('E');
        }
      }
      // Add a space (pause) between words
      script.push('E'); // Use 'E' as a neutral mouth shape for spaces
    }

    return script;
  };

  const script = generateScript(sentence);
  const [currentAnimation, setCurrentAnimation] = useState<string>(animationMap[script[0]]);
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (index + 1) % script.length;
      setCurrentAnimation(animationMap[script[nextIndex]]);
      setIndex(nextIndex);
    }, interval);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [index, script, interval]);

  return (
    <div className="-translate-x-4vh" style={{ width: '35vw', height: '35vh', margin: '20vh auto', borderRadius: '10px' }}>
      <img
        src={currentAnimation}
        alt="Lip Sync Animation"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
  );
};

export default LipSyncAnimation;