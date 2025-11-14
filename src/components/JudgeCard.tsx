import React, { useState } from 'react';
import Link from 'next/link';
import { Judge } from '../types/judges';

interface JudgeCardProps {
  judge: Judge;
  variant?: 'default' | 'chief-justice';
}

const JudgeCard: React.FC<JudgeCardProps> = ({ judge, variant = 'default' }) => {
  const [imageError, setImageError] = useState(false);
  
  return (
    <Link href={`/judges/${judge.id}`} className="block">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100 cursor-pointer">
        {/* Image Container */}
        <div className="relative h-64 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center overflow-hidden">
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
            <div className="text-center">
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
        <div className="p-6 text-center bg-gradient-to-t from-gray-50 to-white">
          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors duration-200 leading-tight">
            {judge.name}
          </h3>
          <p className="text-gray-600 text-sm font-medium bg-blue-50 px-3 py-1 rounded-full inline-block">{judge.position}</p>
        </div>
      </div>
    </Link>
  );
};

export default JudgeCard;