import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { ROLE_NAMES } from '../utils/constants';
import { playBellSound } from '../utils/helpers';
import ProfileModal from './ProfileModal';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { getUnreadNotifications, markNotificationsRead } = useData();
  const toast = useToast();
  const [showProfile, setShowProfile] = useState(false);
  const processedRef = useRef(new Set());

  useEffect(() => {
    if (!user) return;
    const check = () => {
      const unread = getUnreadNotifications(user.role).filter(n => !processedRef.current.has(n.id));
      if (unread.length > 0) {
        unread.forEach(n => {
          toast(n.message, 'info');
          processedRef.current.add(n.id);
        });
        playBellSound();
        markNotificationsRead(user.role);
      }
    };
    check();
    const interval = setInterval(check, 2000);
    return () => clearInterval(interval);
  }, [user, getUnreadNotifications, markNotificationsRead, toast]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-flask text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 leading-tight">LabConnect</h1>
                <p className="text-xs text-slate-500">{ROLE_NAMES[user.role]}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
                <div className="w-2 h-2 bg-emerald-500 rounded-full relative">
                  <span className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75" />
                </div>
                <span className="text-xs font-medium">En ligne</span>
              </div>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <button
                  onClick={() => setShowProfile(true)}
                  className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 border-slate-200 hover:border-sky-400 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
                  title="Modifier le profil"
                >
                  {user.photo ? (
                    <img src={user.photo} alt="Profil" className="w-full h-full object-cover" />
                  ) : (
                    <i className="fa-solid fa-user text-slate-400 text-lg" />
                  )}
                </button>
                <button onClick={logout} className="text-slate-400 hover:text-rose-500 transition-colors p-2">
                  <i className="fa-solid fa-right-from-bracket text-lg" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </div>
  );
}
