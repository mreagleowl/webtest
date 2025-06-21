import React from 'react';
export default function ProgressBar({ total, answers, current, onJump }) {
  return (
    <div className='flex gap-1 mt-4 justify-center'>
      {[...Array(total).keys()].map(i => (
        <button
          key={i}
          onClick={() => onJump(i)}
          className={
            'w-6 h-3 rounded ' +
            (i === current
              ? 'bg-blue-500'
              : answers[i]
              ? 'bg-green-400'
              : 'bg-gray-300')
          }
          aria-label={'Питання ' + (i + 1)}
        />
      ))}
    </div>
  );
}
