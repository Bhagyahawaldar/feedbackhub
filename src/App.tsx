import { useState, useEffect } from 'react';
import { auth, signInWithPopup, googleProvider, onAuthStateChanged, User } from './lib/firebase';
import { LayoutDashboard, MessageSquarePlus, LogOut, LogIn, Github, Box } from 'lucide-react';
import FeedbackForm from './components/FeedbackForm';
import AdminDashboard from './components/AdminDashboard';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [view, setView] = useState<'submit' | 'admin'>('submit');
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => auth.signOut();

  const isAdmin = user?.email === 'radhikasalolli@gmail.com' || user?.email?.endsWith('@admin.com'); // Simplified admin check for demo

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl text-white">
              <Box className="w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900 uppercase">FeedbackHub<span className="text-indigo-600">AI</span></span>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-gray-50 p-1 rounded-2xl">
            <button 
              onClick={() => setView('submit')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                view === 'submit' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <MessageSquarePlus className="w-4 h-4" />
              Give Feedback
            </button>
            <button 
              onClick={() => setView('admin')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                view === 'admin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin Dashboard
            </button>
          </div>

          <div className="flex items-center gap-4">
            {authLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-bold leading-none">{user.displayName}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-10 h-10 rounded-2xl border-2 border-indigo-50 shadow-sm" />
                <button 
                  onClick={handleLogout}
                  className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all text-sm"
              >
                <LogIn className="w-4 h-4" />
                Login as Admin
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 md:p-12">
        <AnimatePresence mode="wait">
          {view === 'submit' ? (
            <motion.div
              key="submit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <FeedbackForm />
            </motion.div>
          ) : (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-6xl mx-auto"
            >
              {!user ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <LayoutDashboard className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold mb-2">Admin Access Required</h2>
                  <p className="text-gray-500 mb-8 max-w-sm mx-auto">Please login with an authorized account to view the feedback analytics and dashboard.</p>
                  <button 
                    onClick={handleLogin}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                  >
                    Login with Google
                  </button>
                </div>
              ) : !isAdmin ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <h2 className="text-2xl font-bold mb-2">Unauthorized</h2>
                  <p className="text-gray-500">You do not have permission to access the admin dashboard.</p>
                </div>
              ) : (
                <AdminDashboard />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Box className="w-5 h-5" />
            <span className="text-sm font-bold tracking-tight uppercase">FeedbackHub<span className="text-indigo-600">AI</span></span>
          </div>
          <div className="flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-gray-900">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900">Terms of Service</a>
            <a href="#" className="hover:text-gray-900">Contact Support</a>
          </div>
          <div className="flex items-center gap-4">
             <a href="#" className="p-2 text-gray-400 hover:text-gray-900 transition-all">
                <Github className="w-5 h-5" />
             </a>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-gray-400 font-medium">
          &copy; {new Date().getFullYear()} FeedbackHub AI System. Powering mini-projects with AI.
        </div>
      </footer>
    </div>
  );
}
