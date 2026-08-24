"use server"

import { Resend } from "resend"

export type ContactFormResult = {
  ok: boolean
  error?: string
}

export async function sendContactEmail(formData: FormData): Promise<ContactFormResult> {
  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const message = String(formData.get("message") ?? "").trim()

  if (!name || !email || !message) {
    return { ok: false, error: "Please fill in your name, email, and message." }
  }

  const apiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.CONTACT_TO_EMAIL
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev"

  if (!apiKey || !toEmail) {
    return {
      ok: false,
      error: "Email is not configured yet. Add RESEND_API_KEY and CONTACT_TO_EMAIL to .env.local.",
    }
  }

  try {
    const resend = new Resend(apiKey)

    await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: email,
      subject: `New message from ${name}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #111827;">
          <h2 style="margin-bottom: 12px;">New portfolio contact message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="white-space: pre-wrap; background: #f3f4f6; padding: 16px; border-radius: 8px; margin-top: 8px;">${message.replace(/\n/g, "<br />")}</div>
        </div>
      `,
    })

    return { ok: true }
  } catch (error) {
    console.error("Failed to send contact email:", error)
    return { ok: false, error: "Something went wrong while sending the message." }
  }
}
