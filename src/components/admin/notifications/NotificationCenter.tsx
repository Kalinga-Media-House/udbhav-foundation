/* eslint-disable */
'use client';

import { formatDistanceToNow } from 'date-fns';
import { Bell, CheckCircle2, AlertCircle, Info, Loader2, RefreshCw } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { listUserNotificationsAction, markNotificationAsReadAction, markAllNotificationsAsReadAction } from '@/features/notifications/actions';

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterUnread, setFilterUnread] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listUserNotificationsAction({ limit: 50, offset: 0 } as any, filterUnread);
      if (res.success && res.data) {
        setNotifications(res.data);
      } else {
        toast.error(res.error || 'Failed to fetch notifications');
      }
    } catch (e: any) { void e;
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [filterUnread]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id: string) => {
    const res = await markNotificationAsReadAction(id);
    if (res.success) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'read', read_at: new Date().toISOString() } : n));
      toast.success('Marked as read');
    } else {
      toast.error(res.error || 'Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    const res = await markAllNotificationsAsReadAction();
    if (res.success) {
      setNotifications(prev => prev.map(n => ({ ...n, status: 'read', read_at: new Date().toISOString() })));
      toast.success('All marked as read');
    } else {
      toast.error(res.error || 'Failed to mark all as read');
    }
  };

  const getIcon = (priority: string, category: string) => {
    if (priority === 'critical') return <AlertCircle className="w-5 h-5 text-rose-500" />;
    if (category === 'system') return <Info className="w-5 h-5 text-blue-500" />;
    return <Bell className="w-5 h-5 text-zinc-500" />;
  };

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden flex flex-col h-[800px]">
      
      {/* Header Controls */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="flex space-x-2">
          <Button 
            variant={!filterUnread ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setFilterUnread(false)}
          >
            All
          </Button>
          <Button 
            variant={filterUnread ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setFilterUnread(true)}
          >
            Unread
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={fetchNotifications} title="Refresh">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            <CheckCircle2 className="w-4 h-4 mr-2" /> Mark all read
          </Button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
            <Bell className="w-12 h-12 opacity-20" />
            <p>No notifications found.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors flex gap-4 ${!notification.read_at ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}
              >
                <div className="mt-1">
                  {getIcon(notification.priority, notification.category)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm ${!notification.read_at ? 'font-semibold text-zinc-900 dark:text-zinc-50' : 'font-medium text-zinc-700 dark:text-zinc-300'}`}>
                      {notification.title}
                    </h4>
                    <span className="text-xs text-zinc-500 whitespace-nowrap ml-4">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{notification.message}</p>
                  
                  {notification.action_url && (
                    <div className="mt-3">
                      <Button variant="outline" size="sm" onClick={() => window.location.href = notification.action_url}>
                        View Details
                      </Button>
                    </div>
                  )}
                </div>
                
                {!notification.read_at && (
                  <div className="flex items-start">
                    <button 
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="w-3 h-3 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-colors"
                      title="Mark as read"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
