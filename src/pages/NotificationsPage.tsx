import React from 'react';
import { Bell, CheckCheck, Trash2, AlertOctagon, MessageSquare, ThumbsUp } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useCommunity();

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2.5">
          <Bell className="w-6 h-6 text-indigo-600" />
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Notifications</h1>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 border border-slate-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl text-slate-500 text-xs font-medium">
            You have no notifications at this time.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationAsRead(n.id)}
              className={`p-4 rounded-2xl border flex items-start justify-between gap-3 cursor-pointer transition-colors ${
                !n.isRead
                  ? 'bg-white border-indigo-200 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    n.type === 'safety_alert'
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </div>

                <div>
                  <h3
                    className={`text-sm font-extrabold ${
                      !n.isRead ? 'text-slate-900' : 'text-slate-700'
                    }`}
                  >
                    {n.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">{n.message}</p>
                  <span className="text-[10px] text-slate-400 font-medium block mt-1">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {!n.isRead && (
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0 mt-1"></span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
