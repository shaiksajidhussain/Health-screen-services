import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MMC_LOGO_URL, SiteHeader, SITE_OLIVE } from '../components/SiteHeader'

const HERO_BG_URL =
  'https://islandhospital.com/wp-content/uploads/2025/03/3-Health-Screening-Guide_1.png'
const ABOUT_SIDE_IMAGE_URL =
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=80'

const OLIVE = SITE_OLIVE

function Reveal({ children, className = '', delayMs = 0 }) {
  return (
    <div
      data-reveal
      className={`reveal-up ${className}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  )
}

function ServiceCard({ title, description, icon }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-[#EEEEEE]/90 dark:bg-[#3a3a3a] px-6 py-8 text-center shadow-md">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full text-2xl text-white"
        style={{ backgroundColor: OLIVE }}
      >
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">{description}</p>
      <Link
        to="/screening#general"
        className="mt-6 rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:opacity-90"
        style={{ backgroundColor: OLIVE }}
      >
        Read more
      </Link>
    </div>
  )
}

export default function AboutUs() {
  const [isDark, setIsDark] = useState(() => {
    try {
      const stored = localStorage.getItem('theme')
      if (stored === 'dark') return true
      if (stored === 'light') return false
      return false
    } catch {
      return false
    }
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    if (!els.length) return
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            obs.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev
      try {
        localStorage.setItem('theme', next ? 'dark' : 'light')
      } catch {
        /* ignore */
      }
      return next
    })
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-[#2a2a2a] dark:text-slate-50">
      <SiteHeader isDark={isDark} onToggleTheme={toggleTheme} showTopBar />

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG_URL})` }}
        />
        <div className="absolute inset-0 bg-[#1a1517]/70" />
        <div className="relative container mx-auto px-4 py-20 text-center sm:py-28">
          <h1 className="text-4xl font-black uppercase tracking-tight text-white sm:text-5xl md:text-6xl">
            About us
          </h1>
          {/* <nav className="mt-4 text-sm text-white/90" aria-label="Breadcrumb">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <span className="mx-2 opacity-70" aria-hidden>
              &gt;&gt;
            </span>
            <span className="font-medium">About Us</span>
          </nav> */}
        </div>
      </section>

      <section className="container mx-auto px-4 py-14 sm:py-20">
        <Reveal>
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <img
                src={ABOUT_SIDE_IMAGE_URL}
                alt="Clinical care and preventive health"
                className="h-full w-full object-cover aspect-[4/5] lg:aspect-auto lg:min-h-[420px]"
              />
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Who we are
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Our vision for better healthcare
              </h2>
              <div className="mt-6 space-y-4 text-sm leading-7 text-slate-800 dark:text-slate-200 sm:text-base">
                <p>
                  Maeda Medical Clinic brings together experienced clinicians and structured screening
                  pathways so you can understand your health with clarity. We focus on accurate
                  diagnostics, doctor-reviewed reports, and follow-up that fits your life.
                </p>
                <p>
                  Our mission is to make preventive care approachable: clear package options,
                  transparent pricing where possible, and support for your next steps—whether that is
                  reassurance, lifestyle guidance, or specialist referral.
                </p>
                <p>
                  From general health panels to wellness combinations and targeted screening, we combine
                  sound clinical practice with a calm, respectful experience at Camden Medical Centre.
                </p>
              </div>
              <div className="mt-8">
                <Link
                  to="/screening#top"
                  className="inline-flex rounded-full bg-[#63644A] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:scale-[1.02]"
                >
                  View screening packages
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="border-t border-slate-200 bg-[#fafafa] py-14 dark:border-slate-700 dark:bg-[#323232] sm:py-20">
        <div className="container mx-auto px-4">
          <Reveal delayMs={40}>
            <div className="mx-auto max-w-6xl">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    What we offer
                  </p>
                  <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                    Our clinical services
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-6 text-slate-700 dark:text-slate-200 lg:text-right">
                  Comprehensive screening and general medical support with emphasis on accurate
                  results, clear reporting, and personalised follow-up.
                </p>
              </div>
              <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <ServiceCard
                  icon={<span aria-hidden>🩺</span>}
                  title="General health screening"
                  description="Structured laboratory panels, physical metrics, and doctor review—ideal for annual baselines and proactive monitoring."
                />
                <ServiceCard
                  icon={<span aria-hidden>📋</span>}
                  title="Wellness & targeted panels"
                  description="Focused combinations for metabolic health, allergies, and specific concerns—built to complement your goals."
                />
                <ServiceCard
                  icon={<span aria-hidden>💬</span>}
                  title="Consultation & next steps"
                  description="Post-screening review with our team to interpret findings and plan sensible, timely follow-up."
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="text-white" style={{ backgroundColor: OLIVE }}>
        <div className="container mx-auto px-4 py-14">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/40 bg-white/10 p-1">
                <img src={MMC_LOGO_URL} alt="" className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="font-bold tracking-wide">MAEDA MEDICAL CLINIC</p>
                <p className="mt-3 text-sm text-white/85 leading-6">
                  Preventive screening and general care with clarity and trust.
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/80">Quick links</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link to="/screening#top" className="border-b border-white/30 hover:border-white">
                    » Home
                  </Link>
                </li>
                <li>
                  <Link to="/" className="border-b border-white/30 hover:border-white">
                    » About Us
                  </Link>
                </li>
                <li>
                  <Link to="/screening#general" className="border-b border-white/30 hover:border-white">
                    » Our Services
                  </Link>
                </li>
                <li>
                  <Link to="/screening#contact" className="border-b border-white/30 hover:border-white">
                    » Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/80">Services</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link to="/screening#general" className="border-b border-white/30 hover:border-white">
                    » Health Screening Services
                  </Link>
                </li>
                <li>
                  <Link to="/screening#std" className="border-b border-white/30 hover:border-white">
                    » STD &amp; HIV Screening
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/80">Contact</p>
              <ul className="mt-4 space-y-2 text-sm text-white/90">
                <li>62980360</li>
                <li>82585070 (WhatsApp)</li>
                <li>camden.mmc@gmail.com</li>
                <li className="text-xs leading-5 text-white/80">
                  1 Orchard Boulevard, #09-08, Camden Medical Centre, Singapore 248649
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-white/20 pt-6 text-center text-sm text-white/80">
            Maeda Medical Clinic {new Date().getFullYear()}. All rights reserved.
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/6582585070"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-2xl text-white shadow-lg transition hover:scale-105"
        aria-label="Chat on WhatsApp"
      >
        <span aria-hidden>💬</span>
      </a>
    </div>
  )
}
