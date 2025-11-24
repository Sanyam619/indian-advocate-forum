import React, { useState } from 'react';
import Link from 'next/link';
import { Judge } from '../types/judges';

interface JudgeCardProps {
  judge: Judge;
  variant?: 'default' | 'chief-justice';
}

const JudgeCard: React.FC<JudgeCardProps> = ({ judge, variant = 'default' }) => {
  const [imageError, setImageError] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };
  
  return (
    <Link href={`/judges/${judge.id}`} className="block">
      <div 
        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer h-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${rotateX !== 0 || rotateY !== 0 ? '-8px' : '0px'})`,
          transition: 'transform 0.1s ease-out, box-shadow 0.3s ease'
        }}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center overflow-hidden">
          {judge.image && !imageError ? (
            <img
              src={judge.image}
              alt={judge.name}
              className="w-full h-full object-cover"
              onError={() => {
                setImageError(true);
              }}
            />
          ) : (
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-blue-600 text-sm font-medium">{judge.name}</p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 text-center bg-gradient-to-t from-gray-50 to-white">
          <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors duration-200 leading-tight line-clamp-2">
            {judge.name}
          </h3>
          <p className="text-gray-600 text-sm font-medium bg-blue-50 px-3 py-1 rounded-full inline-block">{judge.position}</p>
        </div>
      </div>
    </Link>
  );
};

export default JudgeCard;