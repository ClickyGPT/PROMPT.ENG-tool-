
import React, { useEffect, useState } from 'react';

interface ScoreCircleProps {
  score: number;
}

export const ScoreCircle: React.FC<ScoreCircleProps> = ({ score }) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setDisplayScore(score));
    return () => cancelAnimationFrame(animation);
  }, [score]);

  const getStrokeColor = (s: number) => {
    if (s < 40) return '#E3350D'; // pkmn-red
    if (s < 70) return '#FFCB05'; // pkmn-yellow
    return '#3B4CCA'; // pkmn-blue
  };

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;
  const strokeColor = getStrokeColor(displayScore);

  return (
    <div className="relative flex items-center justify-center w-32 h-32">
      <svg className="w-full h-full" viewBox="0 0 120 120">
        <circle
          className="text-pkmn-border"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
        <circle
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke={strokeColor}
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
          transform="rotate(-90 60 60)"
          style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
      </svg>
      <span className="absolute text-3xl font-bold" style={{ color: strokeColor }}>
        {Math.round(displayScore)}
      </span>
    </div>
  );
};
