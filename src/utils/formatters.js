import { format, isValid, parse, differenceInDays } from 'date-fns';

/**
 * Format a deadline date with status indicator
 * @param {string} deadlineStr Deadline string (e.g., "May 31, 2025")
 * @returns {Object} Object with formatted text and status class
 */
export const formatDeadline = (deadlineStr) => {
  if (deadlineStr === 'Deadline Varies') {
    return {
      text: 'Deadline Varies',
      class: 'deadline-unknown',
      daysLeft: null
    };
  }
  
  try {
    const deadlineDate = parse(deadlineStr, 'MMMM d, yyyy', new Date());
    
    if (!isValid(deadlineDate)) {
      return {
        text: deadlineStr,
        class: 'deadline-unknown',
        daysLeft: null
      };
    }
    
    const today = new Date();
    const daysLeft = differenceInDays(deadlineDate, today);
    
    if (daysLeft <= 14) {
      return {
        text: `${daysLeft} days left!`,
        fullText: `${daysLeft} days left! (${format(deadlineDate, 'MMM d, yyyy')})`,
        class: 'deadline-urgent',
        daysLeft
      };
    } else if (daysLeft <= 30) {
      return {
        text: `${daysLeft} days left`,
        fullText: `${daysLeft} days left (${format(deadlineDate, 'MMM d, yyyy')})`,
        class: 'deadline-upcoming',
        daysLeft
      };
    } else {
      return {
        text: format(deadlineDate, 'MMM d, yyyy'),
        fullText: format(deadlineDate, 'MMMM d, yyyy'),
        class: 'deadline-future',
        daysLeft
      };
    }
  } catch (err) {
    return {
      text: deadlineStr,
      class: 'deadline-unknown',
      daysLeft: null
    };
  }
};

/**
 * Format scholarship amount for display
 * @param {string} amountStr Amount string (e.g., "$10,000")
 * @returns {Object} Object with formatted amount and style class
 */
export const formatAmount = (amountStr) => {
  if (amountStr === 'Amount Varies') {
    return {
      text: 'Amount Varies',
      value: 0,
      class: 'amount-unknown'
    };
  }
  
  // Extract numeric part
  const numericAmount = amountStr.replace(/[^0-9]/g, '');
  const amount = parseInt(numericAmount) || 0;
  
  // Format with commas
  const formattedAmount = amount.toLocaleString('en-US');
  
  // Determine CSS class based on amount
  let amountClass = 'amount-small';
  
  if (amount >= 10000) {
    amountClass = 'amount-very-large';
  } else if (amount >= 5000) {
    amountClass = 'amount-large';
  } else if (amount >= 1000) {
    amountClass = 'amount-medium';
  }
  
  return {
    text: `$${formattedAmount}`,
    value: amount,
    class: amountClass
  };
};