import React, { useState } from 'react';
import { analyzeFeedback } from '../services/gemini';
import { db, collection, addDoc, serverTimestamp } from '../lib/firebase';
import { Star, Send, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function FeedbackForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    try {
      // Analyze with AI
      const analysis = await analyzeFeedback(message);

      // Save to Firestore
      await addDoc(collection(db, 'feedback'), {
        name,
        email,
        message,
        rating,
        status: 'Pending',
        sentiment: analysis.sentiment,
        summary: analysis.summary,
        createdAt: serverTimestamp()
      });

      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      setRating(5);
    } catch (error) {
      console.error(error);
      alert('Error submitting feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-12 bg-white rounded-3xl shadow-sm border border-gray-100"
      >
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Send className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Thank you!</h2>
        <p className="text-gray-500 mb-8">Your feedback has been received and analyzed by our AI.</p>
        <button 
          onClick={() => setSubmitted(false)}
          className="text-indigo-600 font-medium hover:underline"
        >
          Submit another response
        </button>
      </motion.div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Share your thoughts</h2>
        <p className="text-gray-500">We value your input to make our service better.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">How would you rate us?</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`p-2 transition-all ${rating >= star ? 'text-amber-400' : 'text-gray-200'} hover:scale-110`}
              >
                <Star className={`w-8 h-8 ${rating >= star ? 'fill-current' : ''}`} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
          <textarea 
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
            placeholder="Tell us what you think..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white font-semibold py-4 rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:bg-indigo-300"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing & Saving...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Feedback
            </>
          )}
        </button>
      </form>
    </div>
  );
}
