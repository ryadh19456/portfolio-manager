import { SiteHeader } from '@/components/site/site-header'
import { HeroSection } from '@/components/site/hero-section'
import { WorkSection } from '@/components/site/work-section'
import { AboutSection } from '@/components/site/about-section'
import { ExperienceSection } from '@/components/site/experience-section'
import { ContactSection } from '@/components/site/contact-section'
import {
  getAbout,
  getContact,
  getExperience,
  getHero,
  getPublishedProjects,
  getSettings,
  getSocialLinks,
} from '@/lib/queries'

export default async function Page() {
  const [hero, about, contact, settings, projects, experience, socials] = await Promise.all([
    getHero(),
    getAbout(),
    getContact(),
    getSettings(),
    getPublishedProjects(),
    getExperience(),
    getSocialLinks(),
  ])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader name={settings.siteTitle} settings={settings} />
      <HeroSection hero={hero} socials={socials} />
      {settings.showAbout ? <AboutSection about={about} /> : null}
      <WorkSection projects={projects} settings={settings} />
      {settings.showExperience ? (
        <ExperienceSection experience={experience} settings={settings} />
      ) : null}
      {settings.showContact ? (
        <ContactSection contact={contact} socials={socials} settings={settings} />
      ) : null}
    </main>
  )
}
