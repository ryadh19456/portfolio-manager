"use server"

import nodemailer from "nodemailer"
import { MailtrapTransport } from "mailtrap"

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

  const token =
    process.env.MAILTRAP_API_KEY ||
    process.env.Mailtrap_API_KEY ||
    process.env.MAILTRAP_TOKEN ||
    process.env.MAILTRAP_API_TOKEN

  const toEmail = process.env.CONTACT_TO_EMAIL
  const fromEmail =
    process.env.MAILTRAP_SENDER_EMAIL ||
    process.env.CONTACT_FROM_EMAIL ||
    "hello@ryad2004.me"

  if (!token || !toEmail) {
    return {
      ok: false,
      error: "Email is not configured yet. Add MAILTRAP_API_KEY and CONTACT_TO_EMAIL to .env.local.",
    }
  }

  try {
    const transport = nodemailer.createTransport(
      MailtrapTransport({
        token,
      }),
    )

    await transport.sendMail({
      from: {
        name: "Portfolio Contact",
        address: fromEmail,
      },
      to: [toEmail],
      replyTo: email,
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #111827;">
          <h2 style="margin-bottom: 12px;">New portfolio contact message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="white-space: pre-wrap; background: #f3f4f6; padding: 16px; border-radius: 8px; margin-top: 8px;">${message.replace(
            /\n/g,
            "<br />",
          )}</div>
        </div>
      `,
      category: "Portfolio Contact",
    })

    return { ok: true }
  } catch (error) {
    console.error("Failed to send contact email:", error)
    return { ok: false, error: "Something went wrong while sending the message." }
  }
}
