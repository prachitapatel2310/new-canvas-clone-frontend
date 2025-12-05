// app/Courses/[cid]/Quizzes/quiz.utils.ts

/**
 * Helper function to determine quiz availability status based on dates.
 */
export const getAvailability = (availableDateString: string, untilDateString: string) => {
  const now = new Date();
  const available = new Date(availableDateString);
  const until = new Date(untilDateString);
  
  if (isNaN(available.getTime()) || isNaN(until.getTime())) {
    return { status: 'Unknown', message: 'Unknown Availability' };
  }

  until.setHours(23, 59, 59, 999);
  
  if (now < available) {
    return { 
      status: 'NotAvailable', 
      message: `Not available until ${available.toLocaleDateString()}` 
    };
  }

  if (now >= available && now <= until) {
    return { 
      status: 'Available', 
      message: `Available until ${until.toLocaleDateString()}` 
    };
  }

  if (now > until) {
    return { 
      status: 'Closed', 
      message: `Closed` 
    };
  }

  return { status: 'Unknown', message: 'Unknown Availability' };
};