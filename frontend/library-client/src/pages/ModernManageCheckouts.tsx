import { useState, useEffect } from 'react';
import { checkOutService } from '../api/checkOutService';
import { CheckOutStatus } from '../types/checkOut';
import type { CheckOut } from '../types/checkOut';
import { ArrowPathIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const ModernManageCheckouts = () => {
  const [checkouts, setCheckouts] = useState<CheckOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'overdue'>('all');
  
  useEffect(() => {
    fetchCheckouts();
  }, [activeTab]);
  
  const fetchCheckouts = async () => {
    try {
      setLoading(true);
      let data: CheckOut[];
      
      switch (activeTab) {
        case 'active':
          data = await checkOutService.getActiveCheckOuts();
          break;
        case 'overdue':
          data = await checkOutService.getOverdueCheckOuts();
          break;
        default:
          data = await checkOutService.getAllCheckOuts();
      }
      
      setCheckouts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load checkouts. Please try again later.');
      console.error('Error fetching checkouts:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleReturnBook = async (id: number) => {
    try {
      await checkOutService.returnBook(id);
      
      // Update local state
      setCheckouts(checkouts.map(checkout => 
        checkout.id === id
          ? { 
              ...checkout, 
              status: CheckOutStatus.Returned,
              returnDate: new Date().toISOString()
            }
          : checkout
      ));
      
      setError(null);
    } catch (err) {
      setError('Failed to return book. Please try again.');
      console.error('Error returning book:', err);
    }
  };
  
  const handleRenewBook = async (id: number) => {
    try {
      const updatedCheckout = await checkOutService.renewCheckOut(id);
      
      // Update local state
      setCheckouts(checkouts.map(checkout => 
        checkout.id === id ? updatedCheckout : checkout
      ));
      
      setError(null);
    } catch (err) {
      setError('Failed to renew checkout. Please try again.');
      console.error('Error renewing checkout:', err);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  const getDaysLeft = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const getStatusClass = (status: CheckOutStatus, dueDate: string) => {
    if (status === CheckOutStatus.Returned) {
      return 'bg-green-100 text-green-800';
    }
    
    const daysLeft = getDaysLeft(dueDate);
    
    if (status === CheckOutStatus.Overdue || daysLeft < 0) {
      return 'bg-red-100 text-red-800';
    }
    
    if (daysLeft <= 3) {
      return 'bg-yellow-100 text-yellow-800';
    }
    
    return 'bg-blue-100 text-blue-800';
  };
  
  return (
    <div className="bg-neutral-50 min-h-screen pt-24 pb-16">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-2">
            Manage Checkouts
          </h1>
          <p className="text-neutral-600">
            View and manage library book checkouts
          </p>
        </div>
        
        <div className="mb-6">
          <div className="border-b border-neutral-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                All Checkouts
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'active'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setActiveTab('overdue')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overdue'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                Overdue
              </button>
            </nav>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Book
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Checkout Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <svg className="animate-spin h-8 w-8 text-primary-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </td>
                  </tr>
                ) : checkouts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                      No checkouts found.
                    </td>
                  </tr>
                ) : (
                  checkouts.map((checkout) => {
                    const daysLeft = getDaysLeft(checkout.dueDate);
                    const isOverdue = daysLeft < 0;
                    const isReturned = checkout.returnDate !== undefined;
                    
                    return (
                      <tr key={checkout.id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-neutral-900">{checkout.bookTitle}</div>
                          <div className="text-sm text-neutral-500">{checkout.catalogNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-800">{checkout.userName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-800">
                            {formatDate(checkout.checkOutDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-800">
                            {formatDate(checkout.dueDate)}
                          </div>
                          {!isReturned && (
                            <div className={`text-xs ${isOverdue ? 'text-red-600 font-semibold' : 'text-neutral-500'}`}>
                              {isOverdue
                                ? `${Math.abs(daysLeft)} days overdue`
                                : `${daysLeft} days left`}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            getStatusClass(checkout.status, checkout.dueDate)
                          }`}>
                            {isReturned 
                              ? 'Returned' 
                              : isOverdue 
                              ? 'Overdue' 
                              : 'Active'}
                          </span>
                          {isReturned && (
                            <div className="text-xs text-neutral-500 mt-1">
                              {formatDate(checkout.returnDate!)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {!isReturned && (
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleReturnBook(checkout.id)}
                                className="inline-flex items-center p-1.5 border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                title="Return book"
                              >
                                <CheckCircleIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleRenewBook(checkout.id)}
                                className="inline-flex items-center p-1.5 border border-transparent rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                title="Renew checkout"
                              >
                                <ArrowPathIcon className="h-5 w-5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernManageCheckouts;
