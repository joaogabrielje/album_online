"use client"

import { ReactNode } from "react"
import { Toaster } from "@/components/ui/toaster"

interface ClientLayoutProps {
  children: ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}