# HomeConnect 🏠

A minimalist web app for parents to send tasks and messages to their child's iPad with real-time updates.

## ✨ Features

### Kid's Dashboard (Default View)
- 🎨 Clean, friendly interface optimized for iPad
- ✅ Big, tappable task cards with visual feedback
- 💝 "Message from Mom/Dad" section for encouragement
- ⚡ Real-time updates - tasks appear instantly without refresh
- 📊 Progress tracker to visualize completion

### Parent's Control Panel (Protected)
- 🔒 PIN-protected access (default PIN: 1234)
- 📝 Smart Input: Paste long messages and auto-split into tasks
- 💬 Quick message input for short notes
- 🗑️ Easy task management (delete individual or all tasks)
- 📱 Mobile-optimized for iPhone

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- A Supabase account (free tier works great!)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API to get your credentials
3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the SQL script from `DATABASE_SETUP.md` in your Supabase SQL Editor
5. Enable Realtime for the `tasks` table (Database → Replication)

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Usage

### For Kids (iPad)
1. Open the app on the iPad
2. View tasks for today
3. Tap on any task to mark it as complete
4. See the encouraging message from Mom/Dad
5. Watch the progress bar fill up!

### For Parents (iPhone/Computer)
1. Tap the small lock icon in the bottom-right corner
2. Enter PIN (default: **1234**)
3. **Send a Quick Message**: Type and send encouraging notes
4. **Generate Checklist**: 
   - Paste a long message (e.g., from a teacher)
   - Each line becomes a separate task
   - Click "Generate Checklist"
5. **Manage Tasks**: View all tasks/messages and delete as needed

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database & Real-time**: Supabase
- **Language**: TypeScript

## 📂 Project Structure

```
SunnyConn/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page with view toggle & PIN
│   └── globals.css         # Global styles & animations
├── components/
│   ├── KidView.tsx         # Kid's dashboard with real-time
│   ├── ParentView.tsx      # Parent control panel
├── lib/
│   └── supabase.ts         # Supabase client configuration
├── DATABASE_SETUP.md       # Database setup instructions
└── README.md               # This file
```

## 🔧 Configuration

### Change the PIN
Edit the `CORRECT_PIN` constant in `app/page.tsx`:

```typescript
const CORRECT_PIN = '1234' // Change this to your desired PIN
```

### Customize Colors
The app uses a gradient color scheme. You can modify colors in:
- `tailwind.config.js` for theme colors
- Component files for gradient backgrounds

## 🌟 Features Explained

### Real-time Updates
The app uses Supabase's real-time subscriptions to instantly sync data:
- When a parent adds a task, it appears on the kid's iPad immediately
- When a kid completes a task, the parent sees the update in real-time
- No page refresh needed!

### Smart Checklist Generator
Perfect for copy-pasting homework assignments from messaging apps:
1. Copy the entire message from Zalo/WhatsApp/etc.
2. Paste into the textarea
3. Click "Generate Checklist"
4. Each line becomes a separate task!

Example input:
```
Finish math homework page 42-45
Practice spelling words
Read chapter 3 of the book
Clean your room
```

Becomes 4 separate tasks automatically!

## 🎨 Design Principles

1. **No-friction**: Minimal typing, just paste and go
2. **Mobile-first**: Optimized for iPad (kid) and iPhone (parent)
3. **Visual feedback**: Animations and color changes for better UX
4. **Real-time**: Everything syncs instantly across devices

## 🐛 Troubleshooting

### Tasks not appearing in real-time?
1. Check that Realtime is enabled in Supabase (Database → Replication)
2. Verify your `.env.local` file has correct credentials
3. Check browser console for errors

### Can't connect to Supabase?
1. Make sure `.env.local` exists and has the correct values
2. Restart the dev server after adding environment variables
3. Check that your Supabase project is active

### PIN not working?
- Default PIN is `1234`
- Check `app/page.tsx` if you changed it
- Make sure you're entering exactly 4 digits

## 📝 Database Schema

```sql
tasks (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  type TEXT CHECK (type IN ('task', 'message')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel project settings
4. Deploy!

The app will automatically rebuild and deploy on every push.

## 📄 License

This project is open source and available for personal use.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

Made with ❤️ for better parent-child communication
