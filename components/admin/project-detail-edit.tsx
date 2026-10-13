'use client'

import { useState } from 'react'
import { Pencil } from 'lucide-react'
import type { Project } from '@/lib/content-types'
import { useAdmin } from './admin-provider'
import { ProjectEditor } from './editors/project-editor'
import { Button } from '@/components/ui/button'

export function ProjectDetailEdit({ project }: { project: Project }) {
  const { editMode } = useAdmin()
  const [open, setOpen] = useState(false)

  if (!editMode) return null

  return (
    <>
      <Button className="mt-6" onClick={() => setOpen(true)}>
        <Pencil />
        Edit project
      </Button>
      <ProjectEditor open={open} onOpenChange={setOpen} project={project} />
    </>
  )
}