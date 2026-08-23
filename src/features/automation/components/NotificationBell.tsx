/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Bell } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { getUnreadNotifications, markNotificationAsRead } from '../actions';

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Initial fetch
    getUnreadNotifications().then(setNotifications).catch(console.error);

    // Supabase realtime subscription could be wired here for live updates
  }, []);

  const handleRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-muted-foreground" />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-destructive rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-background border border-border shadow-lg rounded-md overflow-hidden z-50">
          <div className="p-3 border-b border-border bg-muted/50 font-semibold text-sm">
            Notifications
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-sm text-center text-muted-foreground">
                No new notifications
              </div>
            ) : (
              notifications.map(n => (
                <div key={n.id} className="p-3 border-b border-border hover:bg-muted/30 cursor-pointer" onClick={() => handleRead(n.id)}>
                  <div className="font-medium text-sm">{n.title}</div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.message}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
