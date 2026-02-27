# Project GDG - AI Mindfulness & Productivity Assistant

A premium, Gemini-powered assistant designed to enhance mindfulness and streamline daily productivity. This project features a React-based frontend and an Express backend integrated with the Google Gemini API for advanced conversational capabilities and tool calling.

## 🚀 Features

- **Gemini 2.5 Flash Integration**: Leverages the latest Google Generative AI for intelligent, context-aware conversations.
- **Service Integration (Mock Tools)**:
  - **Foodpanda**: AI-driven food ordering flow.
  - **inDrive**: Seamless ride-booking assistance.
- **Mindfulness Dashboard**: Tailored routines and insights to help users stay grounded.
- **Premium UI/UX**: Modern, glassmorphic design system using React and Vite.
- **API Status Dashboards**: High-quality HTML landing and health status pages.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Lucide React, Tailwind CSS (optional/minimal), Vanilla CSS.
- **Backend**: Node.js, Express 5.
- **AI Engine**: Google Generative AI SDK (`@google/generative-ai`).
- **Deployment**: Configured for Vercel.

## ⚙️ Local Setup

### 1. Prerequisites
- Node.js (v18+)
- A Google Gemini API Key.

### 2. Backend Setup
1. Navigate to the `api` directory:
   ```bash
   cd api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   PORT=3001
   GEMINI_API_KEY=your_api_key_here
   ```
4. Start the server:
   ```bash
   node index.js
   ```

### 3. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 👤 Credits

Created and Maintained by **Ammara Dawood**.

---
*Built with ❤️ during the Project GDG initiative.*
