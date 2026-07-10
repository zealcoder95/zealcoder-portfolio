"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Contact() {
  const { t, lang } = useLanguage();

  const contactItems = [
    {
      label: "LinkedIn",
      value: "linkedin.com/in/gizemgulcu",
      href: "https://www.linkedin.com/in/gizemgulcu",
    },
    {
      label: "GitHub",
      value: "github.com/zealcoder95",
      href: "https://github.com/zealcoder95",
    },
    {
      label: "Kaggle",
      value: "kaggle.com/gizemglc",
      href: "https://www.kaggle.com/gizemglc",
    },
    {
      label: "Email",
      value: "gizemgulcu95@gmail.com",
      href: "mailto:gizemgulcu95@gmail.com",
    },
  ];

  return (
    <section
      id="contact"
      className="min-h-screen bg-slate-950 px-6 py-28 text-white"
    >
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 text-sm font-black uppercase tracking-[0.4em] text-cyan-300">
          {t.contact.kicker}
        </p>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h1 className="mb-8 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
              {t.contact.title}
            </h1>

            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              {t.contact.text}
            </p>

            <p className="mt-6 max-w-2xl leading-7 text-slate-400">
              {lang === "en"
                ? "Whether you are a recruiter, collaborator or fellow learner, I am always open to meaningful conversations and new opportunities."
                : "İster işe alım uzmanı, ister birlikte çalışabileceğim bir ekip arkadaşı, ister öğrenme yolculuğunda bir arkadaş olun; anlamlı iletişimlere ve yeni fırsatlara açığım."}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="mailto:gizemgulcu95@gmail.com"
                className="rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 px-7 py-4 font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-1"
              >
                {lang === "en" ? "Send an Email" : "E-posta Gönder"}
              </a>

              <a
                href="/resume"
                className="rounded-full border border-purple-300/40 bg-white/5 px-7 py-4 font-bold text-purple-300 transition hover:-translate-y-1 hover:bg-purple-300/10"
              >
                {lang === "en" ? "View Resume" : "Özgeçmişi Gör"}
              </a>

              <a
                href="/cv.pdf"
                download="Gizem-Gulcu-CV.pdf"
                className="rounded-full border border-cyan-300/40 bg-white/5 px-7 py-4 font-bold text-cyan-300 transition hover:-translate-y-1 hover:bg-cyan-300/10"
              >
                {t.footer.cv}
              </a>
            </div>
          </div>

          <div className="rounded-[34px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <p className="mb-6 text-sm font-bold uppercase tracking-[0.3em] text-purple-300">
              {lang === "en" ? "Let’s Connect" : "Bağlantılar"}
            </p>

            <div className="space-y-4">
              {contactItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.label === "Email" ? undefined : "_blank"}
                  rel={item.label === "Email" ? undefined : "noreferrer"}
                  className="group block rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-cyan-400/5"
                >
                  <p className="font-bold text-cyan-300 transition group-hover:text-white">
                    {item.label}
                  </p>

                  <p className="mt-1 break-all text-sm text-slate-400">
                    {item.value}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}