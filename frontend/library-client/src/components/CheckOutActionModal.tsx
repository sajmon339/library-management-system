import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CheckOut } from '../types/checkOut';
import { useTranslation } from 'react-i18next';

interface CheckOutActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReturn: () => void;
  onRenew: () => void;
  checkOut: CheckOut | null;
}

const CheckOutActionModal = ({ isOpen, onClose, onReturn, onRenew, checkOut }: CheckOutActionModalProps) => {
  const { t, i18n } = useTranslation();
  const [actionType, setActionType] = useState<'return' | 'renew'>('return');
  
  if (!isOpen || !checkOut) return null;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  const getDaysLeft = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    
    // Reset hours to compare dates only
    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  const isOverdue = getDaysLeft(checkOut.dueDate) < 0;
  const daysLeft = getDaysLeft(checkOut.dueDate);
  
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
                {t('checkOutAction.title')}
              </h3>
              
              <div className="mt-4 bg-neutral-50 p-4 rounded-lg">
                <h4 className="font-medium text-neutral-900">{checkOut.bookTitle}</h4>
                <p className="text-sm text-neutral-600">{t('books.catalogNumber')}: {checkOut.catalogNumber}</p>
                
                <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-neutral-500">{t('admin.manageCheckouts.checkedOutDate')}:</span>
                    <p className="font-medium">{formatDate(checkOut.checkOutDate)}</p>
                  </div>
                  <div>
                    <span className="text-neutral-500">{t('books.dueDate')}:</span>
                    <p className={`font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                      {formatDate(checkOut.dueDate)}
                    </p>
                  </div>
                </div>
                
                <div className={`mt-3 text-sm ${isOverdue ? 'text-red-600 font-semibold' : 'text-primary-600'}`}>
                  {isOverdue
                    ? t('common.overdue') + ': ' + Math.abs(daysLeft) + ' ' + t(Math.abs(daysLeft) === 1 ? 'common.day' : 'common.days')
                    : daysLeft + ' ' + t(daysLeft === 1 ? 'common.day' : 'common.days') + ' ' + t('books.left')}
                </div>
              </div>
              
              <div className="mt-4">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="action-return"
                      name="action-type"
                      type="radio"
                      checked={actionType === 'return'}
                      onChange={() => setActionType('return')}
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-neutral-300"
                    />
                    <label htmlFor="action-return" className="ml-3">
                      <span className="block text-sm font-medium text-neutral-700">{t('checkOutAction.returnBook')}</span>
                      <span className="block text-xs text-neutral-500">{t('checkOutAction.returnDescription', 'The book will be marked as returned and available for others')}</span>
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="action-renew"
                      name="action-type"
                      type="radio"
                      checked={actionType === 'renew'}
                      onChange={() => setActionType('renew')}
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-neutral-300"
                      disabled={isOverdue}
                    />
                    <label htmlFor="action-renew" className={`ml-3 ${isOverdue ? 'opacity-50' : ''}`}>
                      <span className="block text-sm font-medium text-neutral-700">{t('checkOutAction.renewBook')}</span>
                      <span className="block text-xs text-neutral-500">{t('checkOutAction.renewDescription', 'Extend the due date by 14 days')}</span>
                      {isOverdue && (
                        <span className="block text-xs text-red-600 mt-1">{t('checkOutAction.cannotRenewOverdue', 'Cannot renew overdue books')}</span>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm
                ${actionType === 'return' 
                  ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                  : 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'}`}
              onClick={() => actionType === 'return' ? onReturn() : onRenew()}
            >
              {actionType === 'return' ? t('checkOutAction.returnBook') : t('checkOutAction.renewBook')}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-neutral-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOutActionModal;
