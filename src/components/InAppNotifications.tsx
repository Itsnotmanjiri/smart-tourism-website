import React, { useState, useEffect } from 'react';
import { X, Bell, Check, AlertCircle, Info, DollarSign, Calendar, Users, Car } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error' | 'booking' | 'payment' | 'chat' | 'carpool';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

interface InAppNotificationsProps {
  onClose?: () => void;
}

// Global notification state
let notificationListeners: Array<(notification: Notification) => void> = [];
let allNotifications: Notification[] = [];

export function addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
  const newNotification: Notification = {
    ...notification,
    id: `notif-${Date.now()}-${Math.random()}`,
    timestamp: new Date(),
    read: false
  };
  
  allNotifications = [newNotification, ...allNotifications];
  
  // Save to localStorage
  try {
    localStorage.setItem('notifications', JSON.stringify(allNotifications.slice(0, 50))); // Keep last 50
  } catch (e) {
    console.error('Failed to save notifications', e);
  }
  
  // Notify all listeners
  notificationListeners.forEach(listener => listener(newNotification));
  
  return newNotification;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  useEffect(() => {
    // Load from localStorage
    try {
      const saved = localStorage.getItem('notifications');
      if (saved) {
        allNotifications = JSON.parse(saved).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        setNotifications(allNotifications);
      }
    } catch (e) {
      console.error('Failed to load notifications', e);
    }
    
    // Subscribe to new notifications
    const listener = (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
    };
    
    notificationListeners.push(listener);
    
    return () => {
      notificationListeners = notificationListeners.filter(l => l !== listener);
    };
  }, []);
  
  return notifications;
}

export function InAppNotifications({ onClose }: InAppNotificationsProps) {
  const notifications = useNotifications();
  const [localNotifications, setLocalNotifications] = useState(notifications);
  
  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);
  
  const markAsRead = (id: string) => {
    const updated = localNotifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setLocalNotifications(updated);
    allNotifications = updated;
    
    try {
      localStorage.setItem('notifications', JSON.stringify(allNotifications));
    } catch (e) {
      console.error('Failed to save notifications', e);
    }
  };
  
  const markAllAsRead = () => {
    const updated = localNotifications.map(n => ({ ...n, read: true }));
    setLocalNotifications(updated);
    allNotifications = updated;
    
    try {
      localStorage.setItem('notifications', JSON.stringify(allNotifications));
    } catch (e) {
      console.error('Failed to save notifications', e);
    }
  };
  
  const deleteNotification = (id: string) => {
    const updated = localNotifications.filter(n => n.id !== id);
    setLocalNotifications(updated);
    allNotifications = updated;
    
    try {
      localStorage.setItem('notifications', JSON.stringify(allNotifications));
    } catch (e) {
      console.error('Failed to save notifications', e);
    }
  };
  
  const clearAll = () => {
    setLocalNotifications([]);
    allNotifications = [];
    localStorage.removeItem('notifications');
  };
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'booking':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'payment':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'chat':
        return <Users className="w-5 h-5 text-purple-600" />;
      case 'carpool':
        return <Car className="w-5 h-5 text-orange-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'booking':
        return 'bg-blue-50 border-blue-200';
      case 'payment':
        return 'bg-green-50 border-green-200';
      case 'chat':
        return 'bg-purple-50 border-purple-200';
      case 'carpool':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };
  
  const unreadCount = localNotifications.filter(n => !n.read).length;
  
  return (
    <div className="fixed top-0 right-0 h-screen w-full md:w-[450px] bg-white shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6" />
          <div>
            <h2 className="font-semibold">Notifications</h2>
            <p className="text-xs text-blue-200">{unreadCount} unread</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Actions */}
      {localNotifications.length > 0 && (
        <div className="p-3 bg-gray-50 border-b flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-900 hover:underline"
            >
              Mark all as read
            </button>
          )}
          <button
            onClick={clearAll}
            className="text-sm text-red-600 hover:underline ml-auto"
          >
            Clear all
          </button>
        </div>
      )}
      
      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {localNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
            <Bell className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No notifications</p>
            <p className="text-sm text-gray-400 text-center mt-2">
              You're all caught up! Notifications will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {localNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 transition-all hover:bg-gray-50 ${
                  !notification.read ? 'bg-blue-50/30' : ''
                }`}
              >
                <div className="flex gap-3">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(notification.type)}`}>
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-gray-900 text-sm">
                        {notification.title}
                        {!notification.read && (
                          <span className="ml-2 inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </h3>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center gap-3 mt-2">
                      <p className="text-xs text-gray-500">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                      
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function formatTimestamp(timestamp: Date): string {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return timestamp.toLocaleDateString();
}

// Notification Badge Component
export function NotificationBadge() {
  const notifications = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;
  
  if (unreadCount === 0) return null;
  
  return (
    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
      {unreadCount > 9 ? '9+' : unreadCount}
    </span>
  );
}
