'use client'

import { useEffect, useState } from 'react'
import { supabase, type Task } from '@/lib/supabase'
import { CheckCircle2, Circle, Heart } from 'lucide-react'

export default function KidView() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [message, setMessage] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch initial data
  useEffect(() => {
    fetchData()
  }, [])

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('tasks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
        },
        (payload) => {
          console.log('Real-time update:', payload)
          // Refetch data on any change
          fetchData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchData = async () => {
    try {
      // Fetch the latest message
      const { data: messageData } = await supabase
        .from('tasks')
        .select('*')
        .eq('type', 'message')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (messageData) {
        setMessage(messageData)
      }

      // Fetch all tasks
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .eq('type', 'task')
        .order('created_at', { ascending: false })

      if (tasksData) {
        // Sort: unfinished tasks first, then completed tasks
        // Within each group, sort by created_at (newest first)
        const sortedTasks = tasksData.sort((a, b) => {
          // First, sort by completion status (false before true)
          if (a.is_completed !== b.is_completed) {
            return a.is_completed ? 1 : -1
          }
          // Then, sort by created_at (newest first)
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })
        setTasks(sortedTasks)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleTask = async (taskId: number, currentStatus: boolean) => {
    try {
      await supabase
        .from('tasks')
        .update({ is_completed: !currentStatus })
        .eq('id', taskId)

      // Optimistically update UI with proper sorting
      const updatedTasks = tasks.map(task => 
        task.id === taskId 
          ? { ...task, is_completed: !currentStatus }
          : task
      )
      
      // Sort: unfinished tasks first, then completed tasks
      const sortedTasks = updatedTasks.sort((a, b) => {
        if (a.is_completed !== b.is_completed) {
          return a.is_completed ? 1 : -1
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
      
      setTasks(sortedTasks)
    } catch (error) {
      console.error('Error toggling task:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            My Tasks
          </h1>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Message from Parent */}
        {message && (
          <div className="mb-8 animate-slide-in">
            <div className="bg-gradient-to-r from-pink-400 to-purple-400 rounded-3xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="text-white" size={24} fill="white" />
                <h2 className="text-xl font-semibold text-white">Message from Mom/Dad</h2>
              </div>
              <p className="text-white text-lg leading-relaxed">
                {message.content}
              </p>
            </div>
          </div>
        )}

        {/* Tasks Section */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Tasks for Today
          </h2>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 shadow-md text-center">
              <p className="text-gray-500 text-lg">No tasks yet! Enjoy your free time! 🎉</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white rounded-3xl p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer ${
                  task.is_completed ? 'task-completed bg-green-50' : ''
                } animate-slide-in`}
                onClick={() => toggleTask(task.id, task.is_completed)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {task.is_completed ? (
                      <CheckCircle2 
                        size={40} 
                        className="text-green-500" 
                        strokeWidth={2}
                      />
                    ) : (
                      <Circle 
                        size={40} 
                        className="text-gray-300 hover:text-blue-400 transition-colors" 
                        strokeWidth={2}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-lg md:text-xl ${
                      task.is_completed 
                        ? 'line-through text-gray-500' 
                        : 'text-gray-800'
                    }`}>
                      {task.content}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Completion Stats */}
        {tasks.length > 0 && (
          <div className="mt-8 bg-white rounded-3xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Progress</span>
              <span className="text-2xl font-bold text-blue-600">
                {tasks.filter(t => t.is_completed).length} / {tasks.length}
              </span>
            </div>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(tasks.filter(t => t.is_completed).length / tasks.length) * 100}%` 
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
