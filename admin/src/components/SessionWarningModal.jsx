import React from 'react';

const SessionWarningModal = ({ isVisible, timeLeft, onExtend, onLogout }) => {
  if (!isVisible) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              className="w-8 h-8 text-yellow-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Sessão Prestes a Expirar
          </h3>
          
          <p className="text-gray-600 mb-4">
            Sua sessão irá expirar em{' '}
            <span className="font-bold text-red-600">
              {minutes.toString().padStart(2, '0')}:
              {seconds.toString().padStart(2, '0')}
            </span>{' '}
            minutos devido à inatividade.
          </p>
          
          <p className="text-sm text-gray-500 mb-6">
            Para continuar trabalhando, clique em "Continuar Logado".
          </p>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={onLogout}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Sair
            </button>
            <button
              onClick={onExtend}
              className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-opacity-90 transition-colors"
            >
              Continuar Logado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionWarningModal;