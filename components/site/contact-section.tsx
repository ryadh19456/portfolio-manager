'use client'

import { useState, useTransition } from 'react'
import { ArrowUpRight } from 'lucide-react'
import type { ContactContent, SiteSettings, SocialLink } from '@/lib/content-types'
import { Editable } from '@/components/admin/editable'
import { ContactEditor } from '@/components/admin/editors/contact-editor'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { SocialIcon } from './social-icon'
import { sendContactEmail } from '@/app/actions/contact'
import { toast } from 'sonner'

const EMPTY_FORM = {
  name: '',
  email: '',
  message: '',
}

export function ContactSection({
  contact,
  socials,
  settings,
}: {
  contact: ContactContent
  socials: SocialLink[]
  settings: SiteSettings
}) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [pending, startTransition] = useTransition()
  const year = new Date().getFullYear()

  function update<K extends keyof typeof EMPTY_FORM>(key: K, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()

    const data = new FormData()
    data.set('name', form.name)
    data.set('email', form.email)
    data.set('message', form.message)

    startTransition(async () => {
      const res = await sendContactEmail(data)
      if (res.ok) {
        setForm(EMPTY_FORM)
        toast.success('Message sent')
      } else {
        toast.error(res.error ?? 'Could not send message')
      }
    })
  }

  return (
    <footer
      id="contact"
      className="scroll-mt-20 border-t border-border bg-secondary/30"
    >
      <div className="mx-auto max-w-5xl px-6 py-20">
        <Editable label="contact" onEdit={() => setOpen(true)}>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col items-start gap-6">
              <h2 className="max-w-2xl text-balance font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
                {contact.heading}
              </h2>
              {contact.body ? (
                <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
                  {contact.body}
                </p>
              ) : null}
              {contact.email ? (
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
                >
                  {contact.buttonLabel || 'Get in touch'}
                  <ArrowUpRight className="size-4" />
                </a>
              ) : null}
              <div className="mt-2 flex items-center gap-1">
                {socials.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    aria-label={s.label}
                  >
                    <SocialIcon icon={s.icon} className="size-5" />
                  </a>
                ))}
              </div>
            </div>

            <form onSubmit={submit} className="rounded-2xl border border-border bg-background/70 p-5 shadow-sm">
              <div className="mb-5">
                <h3 className="font-serif text-2xl tracking-tight">Send a message</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="text-sm font-medium">Name</label>
                  <Input
                    id="contact-name"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-sm font-medium">Email</label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="text-sm font-medium">Message</label>
                  <Textarea
                    id="contact-message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    placeholder="Tell me a bit about your project..."
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={pending}>
                  {pending ? 'Sending…' : 'Send message'}
                </Button>
              </div>
            </form>
          </div>
        </Editable>

        <div className="mt-16 flex flex-col items-start justify-between gap-2 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {year} {contact.footerNote}
          </p>
          <p>{settings.footerText}</p>
        </div>
      </div>
    </footer>
  )
}
