import React from 'react';
import HelmetIcon from '../components/HelmetIcon';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-yellow-50'>
      <HelmetIcon />
      <h1 className='text-3xl font-bold my-4'>WebTest</h1>
      <div className='mb-6 text-gray-700'>Тестування з охорони праці</div>
      <div className='flex gap-4'>
        <Link to='/themes' className='px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition'>
          Почати тест
        </Link>
        <Link to='/admin' className='px-6 py-2 bg-gray-200 text-gray-800 rounded shadow hover:bg-gray-300 transition'>
          Вхід для адміністратора
        </Link>
      </div>
      <div className='mt-8 text-sm text-gray-400'>Місце для вашого логотипу</div>
    </div>
  );
}
