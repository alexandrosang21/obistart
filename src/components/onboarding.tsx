"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface OnboardingProps {
  open: boolean
  onComplete: (name: string) => void
}

export function Onboarding({ open, onComplete }: OnboardingProps) {
  const [name, setName] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length > 0) {
      onComplete(name.trim())
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md [&>button]:hidden interactive-none" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome to Obistart</DialogTitle>
          <DialogDescription>
            Let's get to know each other. What should we call you?
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
          <Input
            id="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-center text-lg h-12"
            autoFocus
          />
          <DialogFooter>
            <Button type="submit" disabled={!name.trim()} className="w-full">
              Get Started
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
