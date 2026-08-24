import type { LucideIcon } from 'lucide-react'
import {
  Mail,
  Globe,
  Link2,
  Bird,
  Camera,
  Play,
  PenTool,
} from 'lucide-react'

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.58 2 12.217c0 4.512 2.865 8.344 6.839 9.699.5.094.682-.223.682-.494 0-.244-.009-.89-.014-1.748-2.782.618-3.369-1.38-3.369-1.38-.455-1.186-1.11-1.5-1.11-1.5-.909-.634.069-.62.069-.62 1.004.072 1.533 1.053 1.533 1.053.893 1.56 2.341 1.109 2.912.848.091-.66.35-1.109.636-1.364-2.221-.258-4.556-1.135-4.556-5.06 0-1.117.386-2.032 1.021-2.747-.103-.259-.443-1.302.097-2.714 0 0 .833-.273 2.733 1.045A9.256 9.256 0 0 1 12 6.837c.843.004 1.694.116 2.488.34 1.897-1.318 2.728-1.045 2.728-1.045.542 1.412.202 2.455.1 2.714.637.715 1.02 1.63 1.02 2.747 0 3.934-2.338 4.799-4.565 5.052.359.316.678.94.678 1.894 0 1.367-.012 2.468-.012 2.801 0 .273.18.594.688.494A10.02 10.02 0 0 0 22 12.217C22 6.58 17.523 2 12 2Z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6.94 8.5A1.5 1.5 0 1 1 6.94 5.5a1.5 1.5 0 0 1 0 3Zm-1.25 1.55h2.5v8.1h-2.5v-8.1Zm4.27 0h2.39v1.1h.03c.33-.63 1.14-1.3 2.35-1.3 2.52 0 2.98 1.66 2.98 3.82v5.48h-2.5v-5.13c0-1.22-.02-2.8-1.7-2.8-1.72 0-1.98 1.33-1.98 2.7v5.23h-2.5v-8.1Z" />
    </svg>
  )
}

const MAP: Record<string, LucideIcon> = {
  github: GitHubIcon as unknown as LucideIcon,
  git: GitHubIcon as unknown as LucideIcon,
  linkedin: LinkedInIcon as unknown as LucideIcon,
  x: Bird,
  twitter: Bird,
  instagram: Camera,
  youtube: Play,
  dribbble: PenTool,
  mail: Mail,
  email: Mail,
  website: Globe,
  globe: Globe,
  link: Link2,
}

export const SOCIAL_ICON_OPTIONS = [
  'github',
  'linkedin',
  'x',
  'instagram',
  'youtube',
  'dribbble',
  'mail',
  'website',
  'link',
]

export function SocialIcon({
  icon,
  className,
}: {
  icon: string
  className?: string
}) {
  const Icon = MAP[icon?.toLowerCase()] ?? Link2
  return <Icon className={className} />
}
