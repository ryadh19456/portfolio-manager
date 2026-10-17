"use client"

import { createContext, useContext, useEffect, useState } from "react"

export type Language = "en" | "ar"

const translations: Record<string, string> = {
  "nav.work": "الأعمال",
  "nav.about": "نبذة عني",
  "nav.contact": "تواصل",
  "language.label": "اللغة",
  "hero.role": "مبرمج وطالب تقنية معلومات",
  "hero.headline": "أبني برمجيات موثوقة تتمحور حول المستخدم.",
  "hero.intro": "أنا طالب تقنية معلومات ومبرمج مهتم ببناء تطبيقات موثوقة وسهلة الاستخدام في مجالات تطوير الهواتف والويب والأنظمة الخلفية.",
  "hero.availability": "أركز على تطوير البرمجيات",
  "hero.cta": "استعرض أعمالي",
  "hero.contact": "تواصل معي",
  "about.heading": "نبذة عني",
  "about.body": "أنا طالب تقنية معلومات ومبرمج مهتم ببناء تطبيقات موثوقة وسهلة الاستخدام. تشمل اهتماماتي Flutter وReact وNode.js وقواعد البيانات وهندسة البرمجيات.\n\nمجالات التركيز: تطوير البرمجيات وتطبيقات الهواتف والويب والأنظمة الخلفية.\n\nنقاط القوة: حل المشكلات وتصحيح الأخطاء والفهم الشامل للتطوير والتعلم المستمر والمرونة وكتابة شيفرات واضحة وقابلة للصيانة وهندسة البرمجيات.\n\nأعمل حاليًا على تطوير مهاراتي في Flutter المتقدم والأنظمة الخلفية وتصميم واجهات البرمجة وقواعد البيانات وهندسة البرمجيات وTypeScript وReact والتواصل المهني.\n\nهدفي المهني: أن أصبح مطور برمجيات محترفًا وأسهم في بناء برمجيات موثوقة وقابلة للصيانة ومتمحورة حول المستخدم.\n\nالتعليم: طالب تقنية معلومات يدرس البرمجة وتطوير البرمجيات وقواعد البيانات والشبكات ونظم المعلومات الحديثة.\n\nاللغات: العربية (اللغة الأم) والإنجليزية (قيد التطوير).",
  "about.skills": "المهارات التقنية",
  "work.heading": "مشاريع مختارة",
  "work.subheading": "أعمال حديثة في تطوير البرمجيات وتطبيقات الهواتف والويب.",
  "work.add": "إضافة مشروع",
  "work.noProjectsEdit": "لا توجد مشاريع بعد. أضف مشروعك الأول.",
  "work.noProjects": "ستُعرض المشاريع قريبًا.",
  "work.empty": "لا توجد مشاريع بعد. أضف مشروعك الأول.",
  "work.soon": "ستُعرض المشاريع قريبًا.",
  "project.featured": "مميز",
  "project.builtWith": "التقنيات المستخدمة",
  "project.viewLive": "عرض المشروع",
  "project.viewSource": "عرض الشيفرة المصدرية",
  "project.back": "العودة إلى المشاريع",
  "project.all": "عرض جميع المشاريع",
  "project.editText": "تعديل النص هنا",
  "project.saveText": "حفظ النص",
  "project.cancel": "إلغاء",
  "contact.heading": "لنبنِ شيئًا مميزًا معًا.",
  "contact.body": "أتعاون مع المؤسسين وفرق المنتجات والوكالات لتصميم تجارب رقمية مدروسة ومفيدة وقابلة للقياس.",
  "contact.email": "راسلني عبر البريد الإلكتروني",
  "contact.formTitle": "أرسل رسالة",
  "contact.name": "الاسم",
  "contact.namePlaceholder": "اسمك",
  "contact.emailLabel": "البريد الإلكتروني",
  "contact.message": "الرسالة",
  "contact.messagePlaceholder": "أخبرني قليلًا عن مشروعك...",
  "contact.sending": "جارٍ الإرسال…",
  "contact.send": "إرسال الرسالة",
  "contact.sent": "تم إرسال الرسالة",
  "contact.sendError": "تعذر إرسال الرسالة",
  "contact.messageSent": "تم إرسال الرسالة",
  "contact.messageError": "تعذر إرسال الرسالة",
  "contact.footer": "صُنع بعناية.",
  "experience.heading": "الخبرات",
  "featured": "مميز",
  "builtBy": "مطور",
  "message.sent": "تم إرسال الرسالة",
  "message.error": "تعذر إرسال الرسالة",
  "sample.title": "مشروع تجريبي",
  "sample.tagline": "مشروع أولي للمحفظة الشخصية",
  "sample.description": "هذا مشروع تجريبي أُنشئ أثناء الإعداد المحلي.",
  "sample.content": "## مشروع تجريبي\n\nاستبدل هذا النص بتفاصيل مشروعك.",
  "sample.role": "مطور متكامل",
  "edit.draft": "مسودة",
  "edit.order": "الترتيب",
  "edit.up": "أعلى",
  "edit.down": "أسفل",
  "edit.edit": "تعديل",
}

const englishTranslations: Record<string, string> = {
  "language.label": "Language",
  "work.add": "Add project",
  "work.noProjectsEdit": "No projects yet. Add your first project.",
  "work.noProjects": "Projects coming soon.",
  "project.featured": "Featured",
  "project.builtWith": "Built with",
  "project.viewLive": "View live project",
  "project.viewSource": "View source code",
  "project.back": "Back to projects",
  "project.all": "See all projects",
  "project.editText": "Edit text here",
  "project.saveText": "Save text",
  "project.cancel": "Cancel",
  "contact.formTitle": "Send a message",
  "contact.name": "Name",
  "contact.namePlaceholder": "Your name",
  "contact.emailLabel": "Email",
  "contact.message": "Message",
  "contact.messagePlaceholder": "Tell me a bit about your project...",
  "contact.sending": "Sending…",
  "contact.send": "Send message",
  "contact.messageSent": "Message sent",
  "contact.messageError": "Could not send message",
  "edit.draft": "Draft",
  "edit.order": "Order",
  "edit.up": "Up",
  "edit.down": "Down",
  "edit.edit": "Edit",
}

const contentTranslations = new Map<string, string>([
  ["Programmer & Information Technology Student", translations["hero.role"]],
  ["I build reliable, user-focused software.", translations["hero.headline"]],
  ["I am an Information Technology student and programmer interested in building reliable, user-focused applications across mobile, web, and backend development.", translations["hero.intro"]],
  ["Focused on software development", translations["hero.availability"]],
  ["View my work", translations["hero.cta"]],
  ["Get in touch", translations["hero.contact"]],
  ["About", translations["about.heading"]],
  ["Work", translations["nav.work"]],
  ["Contact", translations["nav.contact"]],
  ["Email", "البريد الإلكتروني"],
  ["Syria, Damascus", "سوريا، دمشق"],
  ["Selected Work", "أعمال مختارة"],
  ["Technical Skills", translations["about.skills"]],
  ["Selected Projects", translations["work.heading"]],
  ["Recent work across software development, mobile apps, and web applications.", translations["work.subheading"]],
  ["Let’s build something meaningful.", translations["contact.heading"]],
  ["I partner with founders, product teams, and agencies to design and build digital experiences that are thoughtful, useful, and measurable.", translations["contact.body"]],
  ["email me", translations["contact.email"]],
  ["Made with care.", translations["contact.footer"]],
  ["Sample Project", translations["sample.title"]],
  ["A starter portfolio project", translations["sample.tagline"]],
  ["This is a sample project created during local setup.", translations["sample.description"]],
  ["## Example project\n\nReplace this with your real project details.", translations["sample.content"]],
  ["Full Stack Developer", translations["sample.role"]],
  ["All rights reserved.", "جميع الحقوق محفوظة."],
  ["I am an Information Technology student and programmer interested in building reliable, user-focused applications. My main areas of interest include Flutter, React, Node.js, databases, and software architecture.\n\nFocus: Software Development, Mobile Development, Web Development, and Backend Development.\n\nStrengths: Problem solving, debugging, full-stack understanding, continuous learning, adaptability, clean and maintainable code, and software architecture.\n\nCurrently improving: Advanced Flutter development, backend development, API and database design, software architecture, TypeScript and React, and professional communication.\n\nCareer goal: To grow into a professional software developer and contribute to reliable, maintainable, and user-focused software.\n\nEducation: Information Technology Student studying programming, software development, databases, networking, and modern information systems.\n\nLanguages: Arabic (native) and English (improving).", translations["about.body"]],
])

type LanguageContextValue = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
  localize: (value: string) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const stored = window.localStorage.getItem("site-language")
    if (stored === "ar" || stored === "en") setLanguage(stored)
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
    window.localStorage.setItem("site-language", language)
  }, [language])

  const value: LanguageContextValue = {
    language,
    setLanguage,
    t: (key) => language === "ar" ? translations[key] ?? key : englishTranslations[key] ?? key,
    localize: (text) => language === "ar" ? contentTranslations.get(text) ?? text : text,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider")
  return context
}