import { useEffect, useState } from 'react';
import { 
  db, 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc 
} from '../lib/firebase';
import { Star, CheckCircle, Trash2, MessageSquare, User, Mail, Brain, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function AdminDashboard() {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFeedback(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const markAsReviewed = async (id: string) => {
    await updateDoc(doc(db, 'feedback', id), {
      status: 'Reviewed'
    });
  };

  const deleteFeedback = async (id: string) => {
    if (confirm('Are you sure you want to delete this feedback?')) {
      await deleteDoc(doc(db, 'feedback', id));
    }
  };

  const [search, setSearch] = useState('');
  const [filterSentiment, setFilterSentiment] = useState<string>('All');

  const filteredFeedback = feedback.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) || 
                          f.message.toLowerCase().includes(search.toLowerCase()) ||
                          f.email.toLowerCase().includes(search.toLowerCase());
    const matchesSentiment = filterSentiment === 'All' || f.sentiment === filterSentiment;
    return matchesSearch && matchesSentiment;
  });

  const stats = {
    total: feedback.length,
    pending: feedback.filter(f => f.status === 'Pending').length,
    avgRating: feedback.length ? (feedback.reduce((acc, f) => acc + (Number(f.rating) || 0), 0) / feedback.length).toFixed(1) : 0,
    sentimentData: [
      { name: 'Positive', value: feedback.filter(f => f.sentiment === 'Positive').length, color: '#10b981' },
      { name: 'Neutral', value: feedback.filter(f => f.sentiment === 'Neutral').length, color: '#6366f1' },
      { name: 'Negative', value: feedback.filter(f => f.sentiment === 'Negative').length, color: '#f43f5e' },
    ],
    ratingDist: [1, 2, 3, 4, 5].map(r => ({
      rating: `${r} Stars`,
      count: feedback.filter(f => f.rating === r).length
    }))
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <BarChart3 className="w-8 h-8 animate-pulse text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Responses</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Pending Review</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold">Action Required</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Average Rating</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-gray-900">{stats.avgRating}</p>
            <Star className="w-5 h-5 text-amber-400 fill-current" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">User Satisfaction</p>
          <p className="text-3xl font-bold text-gray-900">
            {Math.round((stats.sentimentData[0].value / stats.total) * 100) || 0}%
          </p>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-[350px]">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-500" /> Sentiment Breakdown (AI Powered)
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {stats.sentimentData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-[350px]">
          <h3 className="text-lg font-bold mb-6">Rating Distribution</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.ratingDist}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="rating" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip cursor={{ fill: '#f9fafb' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Feedback Feed */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold">Feedback Feed</h3>
          <div className="flex flex-col md:flex-row gap-3">
            <input 
              type="text"
              placeholder="Search feedback..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 rounded-xl bg-gray-50 border-none text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64"
            />
            <select
              value={filterSentiment}
              onChange={(e) => setFilterSentiment(e.target.value)}
              className="px-4 py-2 rounded-xl bg-gray-50 border-none text-sm focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
            >
              <option value="All">All Sentiments</option>
              <option value="Positive">Positive Only</option>
              <option value="Neutral">Neutral Only</option>
              <option value="Negative">Negative Only</option>
            </select>
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          <AnimatePresence>
            {filteredFeedback.map((f) => (
              <motion.div 
                key={f.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-indigo-50 p-2 rounded-full">
                        <User className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{f.name}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {f.email}
                        </p>
                      </div>
                      <div className="ml-auto flex items-center gap-1">
                        <span className="font-bold text-amber-500">{f.rating}</span>
                        <Star className="w-4 h-4 text-amber-500 fill-current" />
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl mb-3">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                        <p className="text-gray-700">{f.message}</p>
                      </div>
                    </div>

                    {f.summary && (
                      <div className="flex items-center gap-2 text-xs mb-3">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md font-bold uppercase tracking-tighter">AI Summary</span>
                        <p className="text-gray-500 italic">"{f.summary}"</p>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                       <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        f.sentiment === 'Positive' ? 'bg-green-100 text-green-700' :
                        f.sentiment === 'Negative' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {f.sentiment}
                      </span>
                      {f.status === 'Pending' ? (
                         <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-700">
                          Pending
                        </span>
                      ) : (
                         <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-500">
                          Reviewed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2">
                    {f.status === 'Pending' && (
                      <button 
                        onClick={() => markAsReviewed(f.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-all"
                        title="Mark as Reviewed"
                      >
                        <CheckCircle className="w-6 h-6" />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteFeedback(f.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Delete Feedback"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {feedback.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No feedback received yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
