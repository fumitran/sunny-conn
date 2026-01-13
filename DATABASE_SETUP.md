# Database Setup Instructions
beautiful
## Supabase Configuration

### 1. Create a Supabase Project
- Go to [supabase.com](https://supabase.com)
- Create a new project
- Copy your project URL and anon key

### 2. Create Environment Variables
Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Create the Database Table

Go to the SQL Editor in your Supabase dashboard and run this SQL:

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

-- Create a policy that allows all operations (for simplicity)
-- In production, you'd want more restrictive policies
CREATE POLICY "Allow all operations on tasks"
ON tasks
FOR ALL
USING (true)
WITH CHECK (true);

-- Create an index for faster queries
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX idx_tasks_type ON tasks(type);
```

### 4. Enable Realtime

In your Supabase dashboard:
1. Go to Database → Replication
2. Enable replication for the `tasks` table
3. This allows real-time subscriptions to work

### Table Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGSERIAL | Primary key, auto-increment |
| `content` | TEXT | Task description or message content |
| `is_completed` | BOOLEAN | Whether the task is completed (default: false) |
| `type` | TEXT | Either 'task' or 'message' |
| `created_at` | TIMESTAMP | Timestamp of creation (UTC) |

## Testing the Setup

After creating the table, you can test with some sample data:

```sql
-- Insert a sample message
INSERT INTO tasks (content, type) 
VALUES ('Great job on your homework today! 🌟', 'message');

-- Insert sample tasks
INSERT INTO tasks (content, type) 
VALUES 
  ('Finish math homework', 'task'),
  ('Practice piano for 30 minutes', 'task'),
  ('Clean your room', 'task');
```
