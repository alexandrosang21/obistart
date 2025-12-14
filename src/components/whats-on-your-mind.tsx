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
      setIsEditing(true)
    } else {
      if (savedFocus) {
        setFocus(savedFocus)
        setIsEditing(false)
      }
      if (savedCompleted) {
        setIsCompleted(savedCompleted === "true")
      }
      if (savedSubtasks) {
        setSubtasks(JSON.parse(savedSubtasks))
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
                    w-8 h-8 rounded-sm border-2 flex items-center justify-center transition-all duration-300
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
                    text-3xl md:text-4xl font-medium transition-all duration-300
                    ${isCompleted ? "line-through text-muted-foreground decoration-2" : "text-foreground"}
                    `}
                >
                    {focus}
                </span>
                
                <div className="absolute -right-24 top-1/2 -translate-y-1/2 flex gap-2 opacity-0 group-hover/main:opacity-100 transition-opacity duration-200">
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
       <div className="w-full max-w-md flex flex-col gap-2">
            
            <div className="flex flex-col gap-2 w-full">
                {subtasks.map(task => (
                    <div key={task.id} className="group/item flex items-center gap-3 w-full p-1 animate-in slide-in-from-top-2 duration-300">
                        <button
                            onClick={() => toggleSubtask(task.id)}
                            className={`
                                w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200
                                ${task.completed ? "bg-muted-foreground border-muted-foreground text-background" : "border-foreground/20 hover:border-foreground/50"}
                            `}
                        >
                             {task.completed && <Check className="w-3 h-3" />}
                        </button>
                        <span className={`flex-1 text-sm text-left ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                            {task.text}
                        </span>
                        <button 
                            onClick={() => deleteSubtask(task.id)}
                            className="opacity-0 group-hover/item:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {!showSubtasks && subtasks.length === 0 ? (
                <Button variant="ghost" size="sm" onClick={() => setShowSubtasks(true)} className="text-muted-foreground/50 hover:text-muted-foreground self-center">
                    + Add subtask
                </Button>
            ) : (
                <form onSubmit={addSubtask} className="w-full mt-2">
                     <Input 
                        value={newSubtask}
                        onChange={(e) => setNewSubtask(e.target.value)}
                        placeholder="Add a step..."
                        className="border-none bg-transparent shadow-none text-center placeholder:text-muted-foreground/30 focus-visible:ring-0"
                     />
                </form>
            )}
       </div>
    </div>
  )
}
