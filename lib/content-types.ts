export type Hero = {
  name: string
  role: string
  headline: string
  intro: string
  location: string
  availability: string
  avatarUrl: string | null
  ctaLabel: string
  ctaHref: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
}

export type About = {
  heading: string
  body: string
  skillsHeading: string
  skills: string[]
  photoUrl: string | null
}

export type Contact = {
  heading: string
  body: string
  email: string
  buttonLabel: string
  footerNote: string
}

export type NavItem = {
  label: string
  href: string
}

export type Settings = {
  siteTitle: string
  siteDescription: string
  workHeading: string
  workSubheading: string
  experienceHeading: string
  showExperience: boolean
  showAbout: boolean
  showContact: boolean
  footerText: string
  navItems: NavItem[]
}

export type HeroContent = Hero
export type AboutContent = About
export type ContactContent = Contact
export type SiteSettings = Settings

export type Project = {
  id: number
  slug: string
  title: string
  tagline: string
  description: string
  content: string
  tech: string[]
  imageUrl: string | null
  liveUrl: string | null
  repoUrl: string | null
  year: string
  role: string
  featured: boolean
  published: boolean
  sortOrder: number
  createdAt: Date | string | null
  updatedAt: Date | string | null
}

export type Experience = {
  id: number
  role: string
  company: string
  location: string
  period: string
  description: string
  url: string | null
  sortOrder: number
  createdAt: Date | string | null
}

export type SocialLink = {
  id: number
  label: string
  url: string
  icon: string
  sortOrder: number
  createdAt: Date | string | null
}

export const DEFAULT_HERO: Hero = {
  name: "Your Name",
  role: "Software Engineer",
  headline: "I design and build things for the web.",
  intro: "Add a short introduction about yourself here.",
  location: "Earth",
  availability: "Available for work",
  avatarUrl: null,
  ctaLabel: "View my work",
  ctaHref: "#work",
  secondaryCtaLabel: "Get in touch",
  secondaryCtaHref: "#contact",
}

export const DEFAULT_ABOUT: About = {
  heading: "About",
  body: "Tell your story here.",
  skillsHeading: "Skills",
  skills: [],
  photoUrl: null,
}

export const DEFAULT_CONTACT: Contact = {
  heading: "Let us work together",
  body: "Have a project in mind? Get in touch.",
  email: "hello@example.com",
  buttonLabel: "Send me an email",
  footerNote: "",
}

export const DEFAULT_SETTINGS: Settings = {
  siteTitle: "Portfolio",
  siteDescription: "My portfolio",
  workHeading: "Selected Work",
  workSubheading: "",
  experienceHeading: "Experience",
  showExperience: true,
  showAbout: true,
  showContact: true,
  footerText: "All rights reserved.",
  navItems: [
    { label: "Work", href: "/#work" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ],
}

export type ContentKey = "hero" | "about" | "contact" | "settings"
