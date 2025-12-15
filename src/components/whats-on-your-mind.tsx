"use client"

import * as React from "react"
import { Check, Pencil, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SubTask {
  id: string
  text: string
  completed: boolean
}

export function WhatsOnYourMind() {
  const [focus, setFocus] = React.useState<string>("")
  const [isEditing, setIsEditing] = React.useState(true)
  const [isCompleted, setIsCompleted] = React.useState(false)
  const [subtasks, setSubtasks] = React.useState<SubTask[]>([])
  const [newSubtask, setNewSubtask] = React.useState("")
  const [showSubtasks, setShowSubtasks] = React.useState(false)
  const [editingSubtaskId, setEditingSubtaskId] = React.useState<string | null>(null)
  const [editingSubtaskText, setEditingSubtaskText] = React.useState("")

  React.useEffect(() => {
    const savedFocus = localStorage.getItem("obistart-focus")
    const savedCompleted = localStorage.getItem("obistart-focus-completed")
    const savedDate = localStorage.getItem("obistart-focus-date")
    const savedSubtasks = localStorage.getItem("obistart-subtasks")
    
    // Clear focus if it's a new day
    if (savedDate !== new Date().toDateString()) {
      localStorage.removeItem("obistart-focus")
      localStorage.removeItem("obistart-focus-completed")
      localStorage.removeItem("obistart-focus-date")
      localStorage.removeItem("obistart-subtasks")
      setSubtasks([])
      setFocus("")
      setIsEditing(true)
    } else {
      if (savedFocus && savedFocus.trim().length > 0) {
        setFocus(savedFocus)
        setIsEditing(false)
      } else {
        setIsEditing(true)
      }
      
      if (savedCompleted) {
        setIsCompleted(savedCompleted === "true")
      }
      if (savedSubtasks) {
        try {
            const parsed = JSON.parse(savedSubtasks) as SubTask[]
            setSubtasks(parsed.filter(t => t.text && t.text.trim().length > 0))
        } catch (e) {
            console.error("Failed to parse subtasks", e)
            setSubtasks([])
        }
      }
    }
  }, [])

  const saveSubtasks = (tasks: SubTask[]) => {
    setSubtasks(tasks)
    localStorage.setItem("obistart-subtasks", JSON.stringify(tasks))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (focus.trim()) {
      setIsEditing(false)
      localStorage.setItem("obistart-focus", focus)
      localStorage.setItem("obistart-focus-date", new Date().toDateString())
    }
  }

  const toggleComplete = () => {
    const newState = !isCompleted
    setIsCompleted(newState)
    localStorage.setItem("obistart-focus-completed", String(newState))
  }

  const clearFocus = () => {
    setFocus("")
    setIsCompleted(false)
    setIsEditing(true)
    setSubtasks([])
    localStorage.removeItem("obistart-focus")
    localStorage.removeItem("obistart-focus-completed")
    localStorage.removeItem("obistart-subtasks")
  }

  const addSubtask = (e: React.FormEvent) => {
    e.preventDefault()
    if (newSubtask.trim()) {
      const newTask = {
        id: Date.now().toString(),
        text: newSubtask,
        completed: false
      }
      const updatedTasks = [...subtasks, newTask]
      saveSubtasks(updatedTasks)
      setNewSubtask("")
    }
  }

  const toggleSubtask = (id: string) => {
    const updatedTasks = subtasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    )
    saveSubtasks(updatedTasks)
  }

  const deleteSubtask = (id: string) => {
      const updatedTasks = subtasks.filter(t => t.id !== id)
      saveSubtasks(updatedTasks)
  }

  const startEditingSubtask = (task: SubTask) => {
    setEditingSubtaskId(task.id)
    setEditingSubtaskText(task.text)
  }

  const saveSubtaskEdit = (id: string) => {
    if (editingSubtaskText.trim()) {
      const updatedTasks = subtasks.map(t => 
        t.id === id ? { ...t, text: editingSubtaskText } : t
      )
      saveSubtasks(updatedTasks)
    } else {
        deleteSubtask(id)
    }
    setEditingSubtaskId(null)
  }

  if (isEditing) {
    return (
      <div className="w-full max-w-xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h2 className="text-2xl md:text-3xl font-light mb-6 text-foreground/80">
          What is your main focus for today?
        </h2>
        <form onSubmit={handleSubmit} className="relative">
          <Input
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            className="text-2xl md:text-3xl h-16 border-b-2 border-t-0 border-x-0 rounded-none border-foreground/20 focus-visible:ring-0 focus-visible:border-foreground/80 text-center bg-transparent placeholder:text-muted-foreground/30"
            placeholder="..."
            autoFocus
          />
        </form>
      </div>
    )
  }

  return (
    <div className="group w-full max-w-2xl mx-auto flex flex-col items-center gap-6 animate-in zoom-in-95 duration-500">
       <div className="text-center w-full">
            <h3 className="uppercase tracking-widest text-xs font-semibold text-muted-foreground mb-4">
                Today
            </h3>
            
            <div className="flex items-center justify-center gap-4 group/main relative">
                <button 
                    onClick={toggleComplete}
                    className={`
                    w-8 h-8 rounded-sm border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0
                    ${isCompleted 
                        ? "bg-primary border-primary text-primary-foreground" 
                        : "border-foreground/30 hover:border-foreground/60"
                    }
                    `}
                >
                    {isCompleted && <Check className="w-5 h-5" />}
                </button>
                
                <span 
                    className={`
                    text-2xl md:text-4xl font-medium transition-all duration-300 text-center
                    ${isCompleted ? "line-through text-muted-foreground decoration-2" : "text-foreground"}
                    `}
                >
                    {focus}
                </span>
                
                <div className="flex gap-1 opacity-0 group-hover/main:opacity-100 transition-opacity duration-200">
                    <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={clearFocus}>
                      <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>
       </div>

       {/* Subtasks Section */}
       <div className="w-full max-w-lg flex flex-col gap-2">
            
            <div className="flex flex-col gap-2 w-full">
                {subtasks.map(task => (
                    <div key={task.id} className="group/item flex items-center gap-3 w-full p-2 rounded-md hover:bg-white/5 transition-colors animate-in slide-in-from-top-2 duration-300">
                        <button
                            onClick={() => toggleSubtask(task.id)}
                            className={`
                                w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200 flex-shrink-0
                                ${task.completed ? "bg-muted-foreground border-muted-foreground text-background" : "border-foreground/20 hover:border-foreground/50"}
                            `}
                        >
                             {task.completed && <Check className="w-3 h-3" />}
                        </button>
                        
                        {editingSubtaskId === task.id ? (
                             <form 
                                className="flex-1"
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    saveSubtaskEdit(task.id)
                                }}
                             >
                                <Input 
                                    value={editingSubtaskText}
                                    onChange={(e) => setEditingSubtaskText(e.target.value)}
                                    className="h-8 py-1 px-2 text-sm"
                                    autoFocus
                                    onBlur={() => saveSubtaskEdit(task.id)}
                                />
                             </form>
                        ) : (
                            <span 
                                className={`flex-1 text-base text-left transition-all ${task.completed ? "line-through text-muted-foreground" : "text-foreground/90"}`}
                                onDoubleClick={() => startEditingSubtask(task)}
                            >
                                {task.text}
                            </span>
                        )}

                        <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                onClick={() => startEditingSubtask(task)}
                            >
                                <Pencil className="w-3 h-3" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                onClick={() => deleteSubtask(task.id)}
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={addSubtask} className="w-full mt-2 px-2 transition-opacity duration-300 opacity-60 focus-within:opacity-100">
                    <Input 
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    placeholder="+ Add a step..."
                    className="border-none bg-transparent shadow-none text-left placeholder:text-muted-foreground/50 focus-visible:ring-0 px-9 py-2 h-auto"
                    />
            </form>
       </div>
    </div>
  )
}
