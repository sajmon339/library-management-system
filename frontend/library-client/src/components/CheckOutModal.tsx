import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CheckOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (daysToReturn: number) => void;
  bookTitle: string;
}

const CheckOutModal = ({ isOpen, onClose, onConfirm, bookTitle }: CheckOutModalProps) => {
  const [daysToReturn, setDaysToReturn] = useState(14); // Default to 14 days
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-neutral-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-neutral-400 hover:text-neutral-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-neutral-900" id="modal-title">
                Check Out Book
              </h3>
              <div className="mt-2">
                <p className="text-sm text-neutral-500 mb-4">
                  You are about to check out <span className="font-medium text-neutral-700">"{bookTitle}"</span>. How many days would you like to borrow this book?
                </p>
                
                <div className="mb-6">
                  <label htmlFor="daysToReturn" className="block text-sm font-medium text-neutral-700 mb-1">
                    Days to Return
                  </label>
                  <select
                    id="daysToReturn"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    value={daysToReturn}
                    onChange={(e) => setDaysToReturn(parseInt(e.target.value))}
                  >
                    <option value={7}>7 days (1 week)</option>
                    <option value={14}>14 days (2 weeks)</option>
                    <option value={21}>21 days (3 weeks)</option>
                    <option value={30}>30 days (1 month)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => onConfirm(daysToReturn)}
            >
              Confirm Check Out
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-neutral-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOutModal;
