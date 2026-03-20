'use client';

import { useState, useEffect } from 'react';

const INDIAN_NAMES = [
  'Priya', 'Amit', 'Neha', 'Rahul', 'Deepa', 'Vikram', 'Anjali', 'Suresh',
  'Kavita', 'Rajesh', 'Pooja', 'Sanjay', 'Meera', 'Arjun', 'Shreya', 'Vijay',
  'Nisha', 'Rohan', 'Divya', 'Karan', 'Anita', 'Manish', 'Ritu', 'Ashok'
];

const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Jaipur',
  'Ahmedabad', 'Lucknow', 'Chandigarh', 'Noida', 'Gurgaon', 'Indore', 'Bhopal', 'Nagpur'
];

interface Notification {
  id: number;
  name: string;
  city: string;
  amount: number;
}

export default function CommissionNotification() {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showNotification = () => {
      const name = INDIAN_NAMES[Math.floor(Math.random() * INDIAN_NAMES.length)];
      const city = INDIAN_CITIES[Math.floor(Math.random() * INDIAN_CITIES.length)];
      const amount = Math.floor(Math.random() * 500 + 100);

      setNotification({ id: Date.now(), name, city, amount });
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setNotification(null), 500);
      }, 3000);
    };

    // Initial delay
    const initialTimer = setTimeout(() => {
      showNotification();
    }, 5000);

    // Interval
    const interval = setInterval(showNotification, 30000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  if (!notification) return null;

  return (
    <div className={`commission-notification ${isVisible ? 'show' : ''}`}>
      <div className="notification-content">
        <div className="notification-avatar">
          <span className="avatar-text">{notification.name.charAt(0)}</span>
        </div>
        <div className="notification-info">
          <div className="notification-title">
            <span className="notification-name">{notification.name}</span>
            <span className="notification-city">📍 {notification.city}</span>
          </div>
          <div className="notification-amount">
            कमीशन मिला: <span className="amount-value">₹{notification.amount}</span>
          </div>
        </div>
        <div className="notification-time">अभी</div>
      </div>
    </div>
  );
}
