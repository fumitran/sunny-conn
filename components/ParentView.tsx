'use client'

import { useEffect, useState } from 'react'
import { supabase, type Task } from '@/lib/supabase'
import { Send, Trash2, Sparkles, X, List } from 'lucide-react'

interface ParentViewProps {
  onClose: () => void
}

export default function ParentView({ onClose }: ParentViewProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [pasteText, setPasteText] = useState('')
  const [quickMessage, setQuickMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [])

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('parent_tasks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
        },
        () => {
          fetchTasks()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchTasks = async () => {
    try {
      const { data } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) {
        setTasks(data)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  const generateChecklist = async () => {
    if (!pasteText.trim()) return

    setLoading(true)
    try {
      // Split by line breaks and filter out empty lines
      const lines = pasteText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)

      // Insert all tasks
      const tasksToInsert = lines.map(line => ({
        content: line,
        type: 'task' as const,
        is_completed: false,
      }))

      const { error } = await supabase
        .from('tasks')
        .insert(tasksToInsert)

      if (error) throw error

      setPasteText('')
      alert(`✅ Created ${lines.length} tasks successfully!`)
    } catch (error) {
      console.error('Error creating tasks:', error)
      alert('❌ Error creating tasks. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const sendQuickMessage = async () => {
    if (!quickMessage.trim()) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('tasks')
        .insert({
          content: quickMessage,
          type: 'message',
          is_completed: false,
        })

      if (error) throw error

      setQuickMessage('')
      alert('✅ Message sent!')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('❌ Error sending message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const deleteTask = async (taskId: number) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

      if (error) throw error

      setTasks(tasks.filter(task => task.id !== taskId))
    } catch (error) {
      console.error('Error deleting task:', error)
      alert('❌ Error deleting task. Please try again.')
    }
  }

  const deleteAllTasks = async () => {
    const confirmed = confirm('⚠️ Are you sure you want to delete ALL tasks and messages?')
    if (!confirmed) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .neq('id', 0) // Delete all rows

      if (error) throw error

      setTasks([])
      alert('✅ All tasks deleted!')
    } catch (error) {
      console.error('Error deleting all tasks:', error)
      alert('❌ Error deleting tasks. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pt-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-1">Parent Control</h1>
            <p className="text-gray-600">Manage tasks and messages</p>
          </div>
          <button
            onClick={onClose}
            className="bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:bg-gray-100"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Quick Message Section */}
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Send className="text-purple-500" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">Quick Message</h2>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={quickMessage}
              onChange={(e) => setQuickMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendQuickMessage()}
              placeholder="Send an encouraging note to your child..."
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-purple-400 text-lg"
              disabled={loading}
            />
            <button
              onClick={sendQuickMessage}
              disabled={loading || !quickMessage.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>

        {/* Paste & Split Section */}
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-blue-500" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">Smart Checklist Generator</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Paste a long message (e.g., from teacher) and split it into individual tasks
          </p>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="Paste your text here... Each line will become a task.&#10;&#10;Example:&#10;Finish math homework page 42-45&#10;Practice spelling words&#10;Read chapter 3 of the book"
            className="w-full h-48 px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-400 text-lg resize-none"
            disabled={loading}
          />
          <div className="mt-4 flex gap-3">
            <button
              onClick={generateChecklist}
              disabled={loading || !pasteText.trim()}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <List size={20} />
              Generate Checklist
            </button>
            <button
              onClick={() => setPasteText('')}
              disabled={loading}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-semibold hover:bg-gray-300 transition-all"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Current Tasks & Messages */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Current Tasks & Messages ({tasks.length})
            </h2>
            {tasks.length > 0 && (
              <button
                onClick={deleteAllTasks}
                disabled={loading}
                className="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center gap-1"
              >
                <Trash2 size={16} />
                Delete All
              </button>
            )}
          </div>

          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No tasks or messages yet</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-start gap-3 p-4 rounded-2xl ${
                    task.type === 'message'
                      ? 'bg-purple-50 border-2 border-purple-200'
                      : task.is_completed
                      ? 'bg-green-50 border-2 border-green-200'
                      : 'bg-gray-50 border-2 border-gray-200'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          task.type === 'message'
                            ? 'bg-purple-200 text-purple-700'
                            : 'bg-blue-200 text-blue-700'
                        }`}
                      >
                        {task.type === 'message' ? 'MESSAGE' : 'TASK'}
                      </span>
                      {task.type === 'task' && task.is_completed && (
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-200 text-green-700">
                          COMPLETED
                        </span>
                      )}
                    </div>
                    <p className={`text-gray-800 ${task.is_completed ? 'line-through' : ''}`}>
                      {task.content}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(task.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-400 hover:text-red-600 transition-colors p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
