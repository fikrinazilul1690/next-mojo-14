'use client';

import toast, { Toaster as ReactHotToaster, ToastBar } from 'react-hot-toast';
import { HiX } from 'react-icons/hi';

export default function Toaster() {
  return (
    <ReactHotToaster
      containerStyle={{
        top: 70,
        left: 20,
        bottom: 20,
        right: 20,
      }}
      toastOptions={{
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <>
              {icon}
              {message}
              {t.type !== 'loading' && (
                <button
                  className='rounded-full p-1 ring-primary-400 transition hover:bg-[#444] focus:outline-none focus-visible:ring'
                  onClick={() => toast.dismiss(t.id)}
                >
                  <HiX />
                </button>
              )}
            </>
          )}
        </ToastBar>
      )}
    </ReactHotToaster>
  );
}
