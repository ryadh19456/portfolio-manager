"use client"

import { useLanguage } from "./language-provider"

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div
      aria-label={t('language.label')}
      className="inline-flex items-center rounded-md border border-border p-0.5"
    >
      {(["en", "ar"] as const).map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={language === option}
          onClick={() => setLanguage(option)}
          className={`min-w-8 rounded px-2 py-1 text-xs font-medium uppercase transition-colors ${
            language === option
              ? "bg-secondary text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}