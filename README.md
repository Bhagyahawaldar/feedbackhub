# FeedbackHub AI - Smart Feedback Collection System

FeedbackHub AI is a modern, full-stack feedback collection and management system enhanced with Gemini AI for sentiment analysis and message summarization.

## 🚀 Features

- **AI-Powered Analysis**: Automatically detects sentiment (Positive, Neutral, Negative) and generates a concise summary for every feedback entry using the Gemini 1.5 Flash model.
- **Real-time Admin Dashboard**: Monitor feedback as it arrives with live updates powered by Firestore `onSnapshot`.
- **Advanced Analytics**: Visual insights including sentiment breakdown (Pie Chart) and rating distribution (Bar Chart) using Recharts.
- **Smart Filtering**: Search through feedback by name, email, or message, and filter by sentiment category.
- **Secure Authentication**: Admin access protection using Firebase Google Authentication.
- **Polished UI**: Crafted with React, Tailwind CSS, and Motion for smooth transitions and a premium feel.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Motion, Lucide React
- **Backend**: Node.js, Express (serving as a full-stack host)
- **Database**: Firebase Firestore
- **AI**: Google Gemini API (@google/genai)
- **Visualization**: Recharts

## 📦 Project Structure

```
/
├── server.ts         # Express server entry point (Vite middleware)
├── firebase-blueprint.json # Data schema definition
├── firestore.rules   # Secure access control
├── src/
│   ├── App.tsx       # Main layout and routing
│   ├── components/   # UI components (Dashboard, Form, etc.)
│   ├── lib/          # Firebase configuration
│   └── services/     # AI analysis service
└── package.json      # Dependencies and scripts
```

## 🚦 Getting Started

1. Submit feedback using the main form.
2. Login as admin (using Google Login) to view the analytics dashboard.
3. Mark feedback as "Reviewed" or delete entries as needed.
