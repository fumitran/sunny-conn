# 🚀 Quick Start Guide

## Step-by-Step Setup (5 minutes)

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Create Supabase Project
1. Go to https://supabase.com
2. Click "New Project"
3. Choose a name, database password, and region
4. Wait for project to be ready (~2 minutes)

### 3️⃣ Get Your Credentials
1. In Supabase dashboard, click "Settings" (gear icon)
2. Go to "API" section
3. Copy:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (the long string under "Project API keys")

### 4️⃣ Create Environment File
Create a file named `.env.local` in the root folder:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_long_anon_key_here
```

### 5️⃣ Set Up Database
1. In Supabase dashboard, click "SQL Editor" 
2. Click "New Query"
3. Copy and paste this SQL:

```sql
-- Create tasks table
CREATE TABLE tasks (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  type TEXT NOT NULL CHECK (type IN ('task', 'message')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations
CREATE POLICY "Allow all operations on tasks"
ON tasks
FOR ALL
USING (true)
WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX idx_tasks_type ON tasks(type);
```

4. Click "Run" button

### 6️⃣ Enable Real-time
1. In Supabase dashboard, go to "Database" → "Replication"
2. Find the `tasks` table
3. Toggle the switch to enable replication

### 7️⃣ Run the App
```bash
npm run dev
```

Open http://localhost:3000 🎉

## 🧪 Test It Out

### Add Sample Data (Optional)
In Supabase SQL Editor, run:

```sql
-- Add a sample message
INSERT INTO tasks (content, type) 
VALUES ('Great job on your homework today! 🌟', 'message');

-- Add sample tasks
INSERT INTO tasks (content, type) 
VALUES 
  ('Finish math homework', 'task'),
  ('Practice piano for 30 minutes', 'task'),
  ('Clean your room', 'task');
```

Now refresh your app and you'll see the tasks!

## 🔑 Access Parent View

1. Look for the small lock icon in bottom-right corner
2. Click it
3. Enter PIN: **1234**
4. You're in the Parent Control Panel!

## 💡 Tips

- **Kid's Device**: Open the app in full-screen mode on iPad
- **Parent's Device**: Bookmark the app on iPhone home screen
- **Real-time**: Keep both devices open to see instant updates
- **Change PIN**: Edit the PIN in `app/page.tsx`

## ⚠️ Common Issues

**"Error connecting to Supabase"**
- Make sure `.env.local` file exists
- Check that values don't have quotes or extra spaces
- Restart dev server: Press Ctrl+C, then `npm run dev`

**"Tasks not showing up"**
- Verify Replication is enabled for `tasks` table
- Check browser console (F12) for errors
- Make sure SQL script ran successfully

**"Real-time not working"**
- Enable Replication in Supabase (Step 6)
- Check that you're using the latest Supabase client version

## 📱 Next Steps

1. **Deploy to Production**: See README.md for Vercel deployment
2. **Customize Colors**: Edit `tailwind.config.js`
3. **Change PIN**: Edit `app/page.tsx`
4. **Add Features**: Extend the components as needed!

Happy connecting! 🏠❤️
