import React from 'react';
import { ExternalLink, Calendar, DollarSign, Award, Info, BookOpen, Heart } from 'lucide-react';
import { formatDistanceToNow, isValid, parse } from 'date-fns';

const ScholarshipCard = ({ scholarship, isFavorite, onToggleFavorite, animationDelay = 0 }) => {
  // Parse deadline string to Date object
  const getDeadlineDate = () => {
    if (scholarship.deadline === 'Deadline Varies') return null;
    
    const deadlineDate = parse(scholarship.deadline, 'MMMM d, yyyy', new Date());
    return isValid(deadlineDate) ? deadlineDate : null;
  };

  // Format amount for display
  const formatAmount = (amount) => {
    if (amount === 'Amount Varies') return amount;
    
    // Extract the numeric part and format it
    const numericAmount = amount.replace(/[^0-9]/g, '');
    if (!numericAmount) return amount;
    
    const formattedAmount = parseInt(numericAmount).toLocaleString('en-US');
    return `$${formattedAmount}`;
  };

  // Determine deadline status and class
  const getDeadlineStatus = () => {
    const deadlineDate = getDeadlineDate();
    if (!deadlineDate) return { text: scholarship.deadline, class: 'deadline-unknown' };
    
    const now = new Date();
    const diff = deadlineDate - now;
    const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (daysLeft <= 14) {
      return { 
        text: `${formatDistanceToNow(deadlineDate)} left! (${scholarship.deadline})`, 
        class: 'deadline-urgent'
      };
    } else if (daysLeft <= 30) {
      return { 
        text: `${formatDistanceToNow(deadlineDate)} left (${scholarship.deadline})`, 
        class: 'deadline-upcoming'
      };
    } else {
      return { 
        text: scholarship.deadline, 
        class: 'deadline-future'
      };
    }
  };

  const deadlineStatus = getDeadlineStatus();
  const formattedAmount = formatAmount(scholarship.amount);

  // Determine style based on amount
  const getAmountStyle = () => {
    if (scholarship.amount === 'Amount Varies') return 'bg-gray-100';
    
    const amount = parseInt(scholarship.amount.replace(/[^0-9]/g, '')) || 0;
    
    if (amount >= 10000) return 'bg-amber-100 text-amber-800';
    if (amount >= 5000) return 'bg-blue-100 text-blue-800';
    if (amount >= 1000) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const amountStyle = getAmountStyle();

  return (
    <div 
      className="card hover:-translate-y-1 transition-all duration-300"
      style={{ 
        animationDelay: `${animationDelay}s`, 
        animation: 'fadeIn 0.3s ease-in forwards, slideUp 0.4s ease-out forwards' 
      }}
    >
      <div className="p-5">
        <div className="flex justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{scholarship.name}</h3>
            <p className="text-sm text-gray-500 mb-3">Source: {scholarship.source}</p>
          </div>
          
          <div className="flex flex-col items-end">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${amountStyle} mb-2`}>
              {formattedAmount}
            </div>
            
            <button 
              onClick={onToggleFavorite}
              className="text-gray-400 hover:text-red-500 transition-colors focus:outline-none"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart size={20} fill={isFavorite ? "#ef4444" : "none"} color={isFavorite ? "#ef4444" : "currentColor"} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <div className="flex items-start">
            <Calendar size={16} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <span className="text-xs text-gray-500 block">Deadline</span>
              <span className={`text-sm ${deadlineStatus.class}`}>{deadlineStatus.text}</span>
            </div>
          </div>
          
          <div className="flex items-start">
            <DollarSign size={16} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <span className="text-xs text-gray-500 block">Amount</span>
              <span className="text-sm font-medium">{scholarship.amount}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-5 flex justify-between items-center">
          {scholarship.link ? (
            <a 
              href={scholarship.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary text-sm"
            >
              <ExternalLink size={14} className="mr-1" />
              Apply Now
            </a>
          ) : (
            <button className="btn btn-outline text-sm">
              <Info size={14} className="mr-1" />
              More Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScholarshipCard;