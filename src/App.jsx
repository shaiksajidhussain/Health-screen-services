import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import {
  GENERAL_PACKAGES,
  WELLNESS_COMBOS,
  GLOBAL_STD,
  ALLERGY_SECTION,
  STD_HIV_PACKAGES,
  STD_URINARY_PACKAGES,
} from './data/healthScreeningData'

import PackageDetailsDrawer from './components/PackageDetailsDrawer'
import { SiteHeader } from './components/SiteHeader'

const HEALTH_GUIDE_BG_URL =
  'https://islandhospital.com/wp-content/uploads/2025/03/3-Health-Screening-Guide_1.png'
const MMC_LOGO_URL = 'https://maedamedical.com/wp-content/uploads/2026/01/MMC_logo.png'
const UNIFORM_CARD_MIN_HEIGHT = 'min-h-[340px]'
const ADDON_ORIGINAL_PRICE = 169
const ADDON_DISCOUNTED_PRICE = 109
const METABOLIC_PANEL_ID = 'wellness-recommended-addon'
const METABOLIC_PANEL_PRICE = 163.5
const APPOINTMENT_TIME_START_MIN = 8 * 60
const APPOINTMENT_TIME_END_MIN = 17 * 60
const APPOINTMENT_TIME_STEP_MIN = 30
const API_BASE_URL = 'https://maeda.kiora.care'
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002'

/** YYYY-MM-DD in the user's local timezone (not UTC — `toISOString()` breaks `min` and past-day checks near midnight). */
function formatLocalDateKey(date) {
  const d = date instanceof Date ? date : new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
/** Horizontal gap between package cards (Tailwind gap-4). */
const PACKAGE_CAROUSEL_GAP_PX = 16
/**
 * Total horizontal “peek” budget on mobile (each side gets half via track padding so cards stay centered).
 */
const MOBILE_PACKAGE_PEEK_REM = 2.75

/** Shared class for package carousels: centered snap + symmetric inset on mobile only. */
const PACKAGE_CAROUSEL_TRACK_CLASS = [
  'flex w-full min-w-0 max-w-full overflow-y-hidden items-stretch gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-2 overscroll-x-contain',
  `max-sm:px-[calc(${MOBILE_PACKAGE_PEEK_REM}rem/2)]`,
  `max-sm:[scroll-padding-inline:calc(${MOBILE_PACKAGE_PEEK_REM}rem/2)]`,
].join(' ')

function packageCarouselSlideStyle(isMobile, cardsPerRowEffective) {
  if (isMobile) {
    /* Explicit 100% row + minWidth 0 so % flex-basis resolves to the scrollport, not max-content. */
    return {
      flex: '0 0 100%',
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
    }
  }
  return {
    flexBasis: `calc((100% - ${(cardsPerRowEffective - 1) * PACKAGE_CAROUSEL_GAP_PX}px) / ${cardsPerRowEffective})`,
    minWidth: 0,
    maxWidth: '100%',
  }
}

function packageCarouselSlideClassName() {
  /* max-sm: full-width slides; sm+: width from flex-basis in style (avoid w-auto min-content overflow). */
  return 'snap-center sm:snap-start shrink-0 flex min-w-0 w-full max-w-full sm:w-auto sm:max-w-none'
}
const STD_COMPREHENSIVE_PACKAGES = [
  {
    id: 'std-comprehensive-male',
    label: 'COMPREHENSIVE MALE',
    price: '$425.10',
    items: [
      'HIV',
      'Syphilis',
      'Hepatitis B Antibody',
      'Hepatitis B Antigen',
      'Herpes Simplex Virus Type I & II',
      'Chlamydia & Gonorrhea PCR',
      'Monilia',
      'Trichomoniasis',
      'Microplasma',
      'Ureaplasma',
      'Urine FEME',
      'Urine Culture & Sensitivity',
    ],
  },
  {
    id: 'std-comprehensive-female',
    label: 'COMPREHENSIVE FEMALE',
    price: '$523.20',
    items: [
      'HIV',
      'Syphilis',
      'Hepatitis B Antibody',
      'Hepatitis B Antigen',
      'Herpes Simplex Virus Type I & II',
      'Chlamydia & Gonorrhea PCR',
      'Monilia',
      'Trichomoniasis',
      'Microplasma',
      'Ureaplasma',
      'Urine FEME',
      'Urine Culture & Sensitivity',
      'Vaginal Swab',
    ],
  },
]

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

function toAmount(value) {
  if (!value) return 0
  const numeric = Number(String(value).replace(/[^0-9.]/g, ''))
  return Number.isFinite(numeric) ? numeric : 0
}

function formatSGD(amount) {
  return `SGD ${amount.toFixed(2)}`
}

function hashString(value = '') {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function bookedThisMonth(seed, min = 12, max = 140) {
  const span = max - min + 1
  return min + (hashString(seed) % span)
}

function PackageCard({ pkg, selected, onSelect, onViewDetails }) {
  const includedChips = (pkg?.cards?.[0]?.groups || [])
    .slice(0, 4)
    .map((g) => (g?.items?.[0] ? String(g.items[0]) : String(g?.label || '')))
    .filter(Boolean)

  return (
    <div
      className={`relative h-full min-w-0 max-w-full ${UNIFORM_CARD_MIN_HEIGHT} rounded-2xl border bg-white/85 backdrop-blur-xl dark:bg-[rgba(0,0,0,0.3)] dark:border-slate-500 p-4 shadow-sm transition font-dm-sans ${
        selected
          ? 'border-2 border-emerald-600 !bg-[#F5F8F5] dark:!bg-[#505050] ring-4 ring-inset ring-emerald-100/60 dark:ring-emerald-400/20 shadow-[0_28px_80px_rgba(0,0,0,0.14),0_12px_34px_rgba(16,185,129,0.24)]'
          : 'border-slate-200 hover:border-slate-300'
      } cursor-pointer`}
      role="button"
      tabIndex={0}
      aria-label={selected ? `${pkg.name} selected` : `Select ${pkg.name}`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onSelect()
      }}
    >
      {selected ? (
        <div className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
          ✓
        </div>
      ) : null}
      <div className="flex h-full min-w-0 max-w-full flex-col overflow-hidden p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 max-w-full">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">
              General Health Screening
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 break-words dark:text-slate-50">
              {pkg.name}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
              A structured lab panel with clear included categories and optional add-ons.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {includedChips.map((chip) => (
            <span
              key={chip}
              className="inline-flex max-w-full items-center rounded-full border border-slate-200 bg-[#F5F4F0] px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:border-slate-500 dark:bg-[#4b4b4b] dark:text-slate-100"
              title={chip}
            >
              {chip}
            </span>
          ))}
        </div>

        <div className="mt-2 flex items-center justify-end">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onViewDetails?.()
            }}
            className="text-xs p-2 mr-auto font-semibold text-[#63644A] hover:text-[#004999] underline decoration-[1.5px] underline-offset-2 transition"
          >
            Learn more
          </button>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-200">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-300">From</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50 leading-none">
                {formatSGD(toAmount(pkg.price))}
                <span className="ml-1 text-xs font-medium text-slate-600 dark:text-slate-300">/ person</span>
              </p>
            </div>
            <p className="text-right text-xs text-slate-600 dark:text-slate-300 leading-4 shrink-0">
              {bookedThisMonth(pkg.id, 22, 160)} booked
              <br />
              this month
            </p>
          </div>

          <div className="mt-3 flex items-center justify-start">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onSelect?.()
              }}
              className={`inline-flex flex-none items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition ${
                selected
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-[#63644A] text-white hover:bg-[#004999]'
              }`}
            >
              {selected ? 'Selected' : 'Select package'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function WellnessComboCard({ item, selected, onSelect, onViewDetails }) {
  return (
    <div
      className={`relative h-full min-w-0 max-w-full ${UNIFORM_CARD_MIN_HEIGHT} rounded-2xl border bg-white/85 backdrop-blur-xl dark:bg-[rgba(0,0,0,0.3)] dark:border-slate-500 shadow-sm transition-all duration-300 hover:shadow-soft font-dm-sans ${
        selected
          ? 'border-2 border-emerald-600 !bg-[#F5F8F5] dark:!bg-[#505050] ring-4 ring-inset ring-emerald-100/60 dark:ring-emerald-400/20 shadow-[0_28px_80px_rgba(0,0,0,0.14),0_12px_34px_rgba(16,185,129,0.24)]'
          : 'border-slate-200'
      } cursor-pointer`}
      role="button"
      tabIndex={0}
      aria-label={selected ? `${item.title} selected` : `Select ${item.title}`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onSelect()
      }}
    >
      {selected ? (
        <div className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
          ✓
        </div>
      ) : null}
      <div className="flex h-full min-w-0 max-w-full flex-col overflow-hidden p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 max-w-full">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-300">
              Wellness Screening
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-900 break-words dark:text-slate-50">
              {item.title}
            </h3>
          </div>
        </div>

        <ul className="mt-4 min-w-0 space-y-2">
          {item.bullets.slice(0, 4).map((b) => (
            <li key={b} className="text-sm text-slate-800 leading-5 dark:text-slate-200">
              ✓ {b}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full border border-slate-200 bg-[#F5F4F0] px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:border-slate-500 dark:bg-[#4b4b4b] dark:text-slate-100">
            Faster targeted checks
          </span>
          <span className="rounded-full border border-slate-200 bg-[#F5F4F0] px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:border-slate-500 dark:bg-[#4b4b4b] dark:text-slate-100">
            Clear client reporting
          </span>
        </div>

        <div className="mt-2 flex items-center justify-start">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onViewDetails?.()
            }}
            className="text-sm font-semibold text-[#63644A] hover:text-[#004999] underline decoration-[1.5px] underline-offset-2 transition"
          >
            Learn more
          </button>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-200">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-300">From</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50 leading-none">
                {formatSGD(toAmount(item.price))}
                <span className="ml-1 text-xs font-medium text-slate-600 dark:text-slate-300">/ person</span>
              </p>
            </div>
            <p className="text-right text-xs text-slate-600 dark:text-slate-300 leading-4 shrink-0">
              {bookedThisMonth(item.id, 10, 80)} booked
              <br />
              this month
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onSelect()
            }}
            className={`mt-3 inline-flex w-fit items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition ${
              selected ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-[#63644A] text-white hover:bg-[#004999]'
            }`}
          >
            {selected ? 'Selected' : 'Select package'}
          </button>
        </div>
      </div>
    </div>
  )
}

function StdPackageCard({ label, price, items, selected, onSelect, onViewDetails, bookedSeed }) {
  return (
    <div
      className={`relative h-full min-w-0 max-w-full ${UNIFORM_CARD_MIN_HEIGHT} rounded-2xl border bg-white/85 backdrop-blur-xl dark:bg-[rgba(0,0,0,0.3)] dark:border-slate-500 p-4 shadow-sm transition-all duration-300 font-dm-sans ${
        selected
          ? 'border-2 border-emerald-600 !bg-[#F5F8F5] dark:!bg-[#505050] ring-4 ring-inset ring-emerald-100/60 dark:ring-emerald-400/20 shadow-[0_28px_80px_rgba(0,0,0,0.14),0_12px_34px_rgba(16,185,129,0.24)]'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {selected ? (
        <div className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
          ✓
        </div>
      ) : null}

      <div className="flex h-full min-w-0 max-w-full flex-col overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 max-w-full">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-300 break-words">
              {label}
            </p>
            <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-slate-50 leading-none">
              {formatSGD(toAmount(price))}
              <span className="ml-1 text-xs font-medium text-slate-600 dark:text-slate-300">/ person</span>
            </p>
          </div>
        </div>

        <ul className="mt-4 space-y-1">
          {items.slice(0, 7).map((it) => (
            <li key={it} className="text-sm text-slate-700 dark:text-slate-200 leading-5">
              ✓ {it}
            </li>
          ))}
        </ul>

        <div className="mt-2">
          <button
            type="button"
            onClick={onViewDetails}
            className="text-xs font-semibold text-[#63644A] hover:text-[#004999] underline decoration-[1.5px] underline-offset-2 transition"
          >
            Learn more
          </button>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-200 flex items-end justify-between gap-3">
          <p className="text-right text-xs text-slate-600 dark:text-slate-300 leading-4">
            {bookedThisMonth(bookedSeed, 18, 96)} booked
            <br />
            this month
          </p>
          <button
            type="button"
            className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition ${
              selected ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-[#63644A] text-white hover:bg-[#004999]'
            }`}
            onClick={onSelect}
          >
            {selected ? 'Selected' : 'Select package'}
          </button>
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ kicker, title, desc }) {
  return (
    <div className="max-w-3xl">
      {kicker ? (
        <p className="text-sm font-bold uppercase tracking-widest text-brand-700">{kicker}</p>
      ) : null}
      <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
        {title}
      </h2>
      {desc ? (
        <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-6">
          {desc}
        </p>
      ) : null}
    </div>
  )
}

function AddOnToggle({ label, price, enabled, onChange }) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="text-xs text-slate-500">+ {price}</p>
      </div>
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[#63644A]"
      />
    </label>
  )
}

function RecommendedAddOnCard({ essentialEnabled, onToggle }) {
  const discountedPrice = ADDON_DISCOUNTED_PRICE
  const originalPrice = ADDON_ORIGINAL_PRICE

  return (
    <div
      className="mt-2 rounded-xl border px-4 py-3 sm:px-5 sm:py-4 shadow-[0_12px_36px_rgba(0,0,0,0.14)]"
      style={{ backgroundColor: '#283B51', borderColor: '#1F2F3F' }}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-200">Recommended add-on</p>
          <h5 className="mt-1 text-lg font-semibold text-white">Metabolic Body Composition Panel</h5>
          <div className="mt-1 max-w-3xl text-[13px] leading-5 text-slate-200">
            <p>Goes beyond standard blood tests to measure what you're made of:</p>
            <ul className="mt-1.5 space-y-0.5 list-disc pl-4">
              <li>Body fat %, muscle mass, bone mass, and visceral fat</li>
              <li>BMI and BMR</li>
              <li>Hydration status (total body water, ECF, ICF)</li>
              <li>Physical vitality markers: grip strength, gait speed, and skin fold thickness</li>
            </ul>
          </div>
        </div>

        <div className="flex items-center gap-3 md:pt-1">
          <div className="text-right">
            <p className="text-[11px] text-slate-200/90">Add for just</p>
            <div className="flex items-end gap-1.5 justify-end">
              <p className="text-sm font-bold text-slate-100 line-through decoration-[2px] decoration-slate-100/90">
                {formatSGD(originalPrice)}
              </p>
              <p className="text-[40px] font-semibold text-amber-200 leading-none">{formatSGD(discountedPrice)}</p>
            </div>
            <p className="text-[11px] text-slate-200/90">more</p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={essentialEnabled}
            onClick={() => onToggle(!essentialEnabled)}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
              essentialEnabled ? 'bg-emerald-400' : 'bg-slate-400/60'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                essentialEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>

          <p className={`text-xs font-semibold ${essentialEnabled ? 'text-white' : 'text-slate-300'}`}>
            {essentialEnabled ? 'Added' : 'Add'}
          </p>
        </div>
      </div>
    </div>
  )
}

function WellnessAddOnCard({ isSelected, onSelectPackage }) {
  return (
    <div
      className={`relative h-full min-w-0 max-w-full ${UNIFORM_CARD_MIN_HEIGHT} rounded-2xl border p-5 shadow-sm transition font-dm-sans ${
        isSelected
          ? 'border-2 border-emerald-600 !bg-[#F5F8F5] dark:!bg-[#505050] ring-4 ring-inset ring-emerald-100/60 dark:ring-emerald-400/20 shadow-[0_28px_80px_rgba(0,0,0,0.14),0_12px_34px_rgba(16,185,129,0.24)]'
          : 'border-slate-200 bg-white/85 backdrop-blur-xl dark:bg-[rgba(0,0,0,0.3)] dark:border-slate-500'
      }`}
    >
      {isSelected ? (
        <div className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
          ✓
        </div>
      ) : null}
  
      <div className="flex h-full min-w-0 max-w-full flex-col overflow-hidden">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">Wellness Screening</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900 break-words dark:text-slate-50">METABOLIC BODY COMPOSITION PANEL</h3>
          <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
            Goes beyond standard blood tests to measure what you're made of:
          </p>
          <ul className="mt-2 space-y-1 list-disc pl-5 text-sm leading-6 text-slate-700 dark:text-slate-200">
            <li>Body fat %, muscle mass, bone mass, and visceral fat</li>
            <li>BMI and BMR</li>
            <li>Hydration status (total body water, ECF, ICF)</li>
            <li>Physical vitality markers: grip strength, gait speed, and skin fold thickness</li>
          </ul>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-500">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-300">From</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50 leading-none">
                {formatSGD(METABOLIC_PANEL_PRICE)}
                <span className="ml-1 text-xs font-medium text-slate-600 dark:text-slate-300">/ person</span>
              </p>
              {/* <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Original price</p> */}
            </div>
            <p className="text-right text-xs text-slate-600 dark:text-slate-300 leading-4 shrink-0">
              {bookedThisMonth('wellness-addon', 10, 70)} booked
              <br />
              this month
            </p>
          </div>

          <div className="mt-3 flex items-center justify-start">
            <button
              type="button"
              onClick={onSelectPackage}
              className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition ${
                isSelected ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-[#63644A] text-white hover:bg-[#004999]'
              }`}
            >
              {isSelected ? 'Selected' : 'Select package'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function RowSelector({ value, onChange }) {
  const options = [
    { value: 3, label: 'Comfort view', hint: '3 cards' },
    { value: 4, label: 'Compact view', hint: '4 cards' },
  ]

  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white p-1 shadow-sm dark:border-slate-500 dark:bg-[rgba(0,0,0,0.3)] dark:backdrop-blur-xl">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-lg px-3 py-2 text-left transition ${
              value === opt.value
                ? 'bg-[#63644A] text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10'
            }`}
            aria-pressed={value === opt.value}
          >
            <span className="mb-1 flex items-center gap-1">
              {Array.from({ length: opt.value }).map((_, i) => (
                <span
                  // Mini bars to visually represent cards-per-view
                  key={`${opt.value}-${i}`}
                  className={`inline-block h-2.5 w-2.5 rounded-[3px] ${
                    value === opt.value ? 'bg-white/95' : 'bg-slate-400'
                  }`}
                />
              ))}
            </span>
            {/* <span className="block text-[11px] font-bold uppercase tracking-widest">{opt.hint}</span> */}
            <span className="block text-[12px] font-semibold">{opt.label}</span>
          </button>
        ))}
    </div>
  )
}

function CarouselControls({ onPrev, onNext, prevLabel, nextLabel, canPrev = true, canNext = true }) {
  return (
    <>
      <button
        type="button"
        aria-label={prevLabel}
        disabled={!canPrev}
        className={`hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 items-center justify-center h-10 w-10 rounded-full border shadow-sm transition-all ${
          canPrev
            ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
        }`}
        onClick={onPrev}
      >
        ‹
      </button>
      <button
        type="button"
        aria-label={nextLabel}
        disabled={!canNext}
        className={`hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 items-center justify-center h-10 w-10 rounded-full border shadow-sm transition-all ${
          canNext
            ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
        }`}
        onClick={onNext}
      >
        ›
      </button>
    </>
  )
}

/** Compact overlay arrows + edge fades below sm only (desktop uses CarouselControls). */
function MobileHorizontalScrollHints({ canPrev, canNext, onPrev, onNext, prevLabel, nextLabel }) {
  if (!canPrev && !canNext) return null
  /** Match carousel `pb-2` so arrows center on the card strip, not card+padding. */
  return (
    <div className="pointer-events-none absolute left-1 right-1 top-0 bottom-2 z-[15] flex items-center justify-between sm:hidden">
      <div className="relative flex h-full w-11 shrink-0 items-center justify-center">
        {canPrev ? (
          <button
            type="button"
            aria-label={prevLabel}
            onClick={onPrev}
            className="pointer-events-auto relative z-20 flex h-9 w-9 items-center justify-center rounded-full border border-slate-300/90 bg-white/95 text-base font-semibold leading-none text-slate-700 shadow-md dark:border-slate-500 dark:bg-[rgba(0,0,0,0.5)] dark:text-white"
          >
            ‹
          </button>
        ) : null}
      </div>
      <div className="relative flex h-full w-11 shrink-0 items-center justify-center">
        {canNext ? (
          <button
            type="button"
            aria-label={nextLabel}
            onClick={onNext}
            className="pointer-events-auto relative z-20 flex h-9 w-9 items-center justify-center rounded-full border border-slate-300/90 bg-white/95 text-base font-semibold leading-none text-slate-700 shadow-md dark:border-slate-500 dark:bg-[rgba(0,0,0,0.5)] dark:text-white"
          >
            ›
          </button>
        ) : null}
      </div>
    </div>
  )
}

function FooterLink({ to, href, label }) {
  const className =
    'text-sm text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white transition'
  if (to) {
    return (
      <Link to={to} className={className}>
        {label}
      </Link>
    )
  }
  return (
    <a href={href} className={className}>
      {label}
    </a>
  )
}

function Footer() {
  return (
    <footer
      id="footer"
      className="mt-16 bg-white text-slate-900 dark:bg-[rgba(0,0,0,0.3)] dark:backdrop-blur-xl dark:text-white relative overflow-hidden"
    >
      <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-brand-500/20 blur-3xl animate-floaty" />
      <div className="relative container mx-auto px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-full bg-white/10 dark:bg-white/15 flex items-center justify-center border border-white/20 dark:border-white/25">
                <img src={MMC_LOGO_URL} alt="MMC logo" className="h-full w-full object-contain p-1.5" />
              </div>
              <div>
                <p className="font-bold tracking-wide">MAEDA MEDICAL CLINIC</p>
                <p className="text-xs text-slate-600 dark:text-slate-200">
                  Health screening & wellness
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-200 max-w-xs leading-6">
              Preventive screening made simple, informative, and doctor reviewed for peace of mind.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-200">
              Quick Links
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <FooterLink to="/" label="About Us" />
              <FooterLink to="/screening#general" label="Our Services" />
              <FooterLink to="/screening#top" label="Dialysis" />
              <FooterLink to="/screening#top" label="Our Team" />
              <FooterLink to="/screening#contact" label="Contact Us" />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-200">
              Services
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <FooterLink to="/screening#general" label="General Outpatient Services" />
              <FooterLink to="/screening#top" label="Health Screening Services" />
              <FooterLink to="/screening#std" label="Fatigue Screening" />
              <FooterLink to="/screening#std" label="STD & HIV Screening" />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-200">
              Contact Info
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-200">
              <p>
                Phone: <span className="text-slate-900 dark:text-white">62980360</span>
              </p>
              <p>
                WhatsApp: <span className="text-slate-900 dark:text-white">82585070</span>
              </p>
              <p>
                Email: <span className="text-slate-900 dark:text-white">camden.mmc@gmail.com</span>
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-5">
                1 Orchard Boulevard, #09-08, Camden Medical Centre, Singapore 248649
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200/70 dark:border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-600 dark:text-slate-400">
          <p>Maeda Medical Clinic 2025. All rights reserved.</p>
          <p>Built for clarity, trust, and early detection.</p>
        </div>
      </div>
    </footer>
  )
}

export function ScreeningServicesPage() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.replace(/^#/, '')
    const el = document.getElementById(id)
    if (el) {
      requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
  }, [location.pathname, location.hash])

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

  const heroBreadcrumb = useMemo(() => ['Home', 'Health Screening Services'], [])
  const [isDark, setIsDark] = useState(() => {
    try {
      const stored = localStorage.getItem('theme')
      if (stored === 'dark') return true
      if (stored === 'light') return false
      // Default to light mode
      return false
    } catch {
      return false
    }
  })
  const [selectedPackageIds, setSelectedPackageIds] = useState([])
  const [selectedWellnessIds, setSelectedWellnessIds] = useState([])
  const [selectedMetabolicPanel, setSelectedMetabolicPanel] = useState(false)
  const [selectedStdProfiles, setSelectedStdProfiles] = useState([])
  const [selectedStdHivPackageIds, setSelectedStdHivPackageIds] = useState([])
  const [detailsPackageId, setDetailsPackageId] = useState(null)
  const [cardsPerRow, setCardsPerRow] = useState(4)
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(max-width: 639px)').matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return () => {}
    const mql = window.matchMedia('(max-width: 639px)')
    const onChange = () => setIsMobile(mql.matches)
    onChange()
    // Safari fallback: older versions may not support addEventListener on MediaQueryList
    if (mql.addEventListener) mql.addEventListener('change', onChange)
    else mql.addListener(onChange)
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange)
      else mql.removeListener(onChange)
    }
  }, [])

  const cardsPerRowEffective = isMobile ? 1 : cardsPerRow
  const carouselMaxWidth =
    cardsPerRowEffective === 4
      ? '1360px'
      : cardsPerRowEffective === 3
        ? '1180px'
        : '100%'
  const [selectedAddOns, setSelectedAddOns] = useState({
    essential: false,
  })
  const [showSelectionPopover, setShowSelectionPopover] = useState(false)
  const [bookingStep, setBookingStep] = useState(1)
  const [appointmentForm, setAppointmentForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    service: '',
    bookingAmount: 0,
    appointmentDate: '',
    appointmentTime: '',
    message: '',
  })
  const [appointmentErrors, setAppointmentErrors] = useState({})
  const [scheduleApiError, setScheduleApiError] = useState('')
  const [contactForm, setContactForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    interest: 'general',
    notes: '',
  })
  const [contactErrors, setContactErrors] = useState({})
  const [isSubmittingContact, setIsSubmittingContact] = useState(false)
  const [contactSubmitError, setContactSubmitError] = useState('')
  const [contactSubmitSuccess, setContactSubmitSuccess] = useState('')
  const [paymentForm, setPaymentForm] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  })
  const [isSchedulingTest, setIsSchedulingTest] = useState(false)
  const [showScheduleSuccess, setShowScheduleSuccess] = useState(false)
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)
  const generalCarouselRef = useRef(null)
  const wellnessCarouselRef = useRef(null)
  const stdHivCarouselRef = useRef(null)
  const stdUrinaryCarouselRef = useRef(null)
  const previousSelectedIdRef = useRef(null)
  const [carouselStatus, setCarouselStatus] = useState({
    general: { canPrev: false, canNext: true },
    wellness: { canPrev: false, canNext: true },
    stdHiv: { canPrev: false, canNext: true },
    stdUrinary: { canPrev: false, canNext: true },
  })

  const allAppointmentSlots = useMemo(() => {
    const slots = []
    for (
      let totalMinutes = APPOINTMENT_TIME_START_MIN;
      totalMinutes <= APPOINTMENT_TIME_END_MIN;
      totalMinutes += APPOINTMENT_TIME_STEP_MIN
    ) {
      const hh = String(Math.floor(totalMinutes / 60)).padStart(2, '0')
      const mm = String(totalMinutes % 60).padStart(2, '0')
      slots.push(`${hh}:${mm}`)
    }
    return slots
  }, [])

  const availableAppointmentSlots = useMemo(() => {
    const selectedDate = appointmentForm.appointmentDate
    if (!selectedDate) return allAppointmentSlots

    const now = new Date()
    const todayKey = formatLocalDateKey(now)
    if (selectedDate < todayKey) return []
    if (selectedDate > todayKey) return allAppointmentSlots

    const nowMinutes = now.getHours() * 60 + now.getMinutes()
    return allAppointmentSlots.filter((slot) => {
      const [h, m] = slot.split(':').map(Number)
      const slotMinutes = h * 60 + m
      return slotMinutes > nowMinutes
    })
  }, [appointmentForm.appointmentDate, allAppointmentSlots])

  useEffect(() => {
    if (!appointmentForm.appointmentTime) return
    if (availableAppointmentSlots.includes(appointmentForm.appointmentTime)) return
    updateAppointmentField('appointmentTime', '')
  }, [appointmentForm.appointmentTime, availableAppointmentSlots])

  /** If the page was left open past midnight, drop a date that is now in the past. */
  useEffect(() => {
    const d = appointmentForm.appointmentDate
    if (!d) return
    const todayKey = formatLocalDateKey(new Date())
    if (d < todayKey) {
      setAppointmentForm((prev) => ({ ...prev, appointmentDate: '', appointmentTime: '' }))
    }
  }, [appointmentForm.appointmentDate])

  useEffect(() => {
    if (cardsPerRow < 3) setCardsPerRow(3)
  }, [cardsPerRow])

  const sortedGeneralPackages = useMemo(
    () => [...GENERAL_PACKAGES].sort((a, b) => toAmount(a.price) - toAmount(b.price)),
    []
  )
  const sortedWellnessCombos = useMemo(
    () => [...WELLNESS_COMBOS].sort((a, b) => toAmount(a.price) - toAmount(b.price)),
    []
  )
  const sortedStdHivPackages = useMemo(
    () => [...STD_HIV_PACKAGES].sort((a, b) => toAmount(a.price) - toAmount(b.price)),
    []
  )
  const sortedStdUrinaryPackages = useMemo(
    () => [...STD_URINARY_PACKAGES].sort((a, b) => toAmount(a.price) - toAmount(b.price)),
    []
  )
  const sortedStdComprehensivePackages = useMemo(
    () => [...STD_COMPREHENSIVE_PACKAGES].sort((a, b) => toAmount(a.price) - toAmount(b.price)),
    []
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const selectedPackages = useMemo(() => {
    if (!selectedPackageIds.length) return []
    return selectedPackageIds
      .map((packageId) => GENERAL_PACKAGES.find((p) => p.id === packageId) ?? null)
      .filter(Boolean)
  }, [selectedPackageIds])

  const selectedWellnesses = useMemo(() => {
    if (!selectedWellnessIds.length) return []
    return selectedWellnessIds
      .map((wellnessId) => WELLNESS_COMBOS.find((w) => w.id === wellnessId) ?? null)
      .filter(Boolean)
  }, [selectedWellnessIds])

  const detailsPackage = useMemo(() => {
    if (!detailsPackageId) return null
    const toStdDrawerPackage = (pkg, categoryTitle) => ({
      id: pkg.id,
      name: `${categoryTitle} (${pkg.label})`,
      price: pkg.price,
      cards: [
        {
          title: categoryTitle,
          groups: [{ label: 'Included tests', items: pkg.items ?? [] }],
        },
      ],
      optionalAddOns: null,
    })

    const general = GENERAL_PACKAGES.find((p) => p.id === detailsPackageId) ?? null
    if (general) return general

    const wellness = WELLNESS_COMBOS.find((w) => w.id === detailsPackageId) ?? null
    if (wellness) {
      // Convert wellness combo shape to the structure expected by PackageDetailsDrawer.
      return {
        id: wellness.id,
        name: wellness.title,
        price: wellness.price,
        cards: [
          {
            title: 'Wellness details',
            groups: [
              {
                label: 'Included tests',
                items: wellness.bullets ?? [],
              },
            ],
          },
        ],
        optionalAddOns: null,
      }
    }

    if (detailsPackageId === 'global-std-male') {
      return {
        id: 'global-std-male',
        name: 'Global Health and STD (Male)',
        price: GLOBAL_STD.malePrice,
        cards: [
          {
            title: 'Global Health + STD (Male)',
            groups: [{ label: 'Male', items: GLOBAL_STD.maleTests ?? [] }],
          },
        ],
        optionalAddOns: null,
      }
    }

    if (detailsPackageId === 'global-std-female') {
      return {
        id: 'global-std-female',
        name: 'Global Health and STD (Female)',
        price: GLOBAL_STD.femalePrice,
        cards: [
          {
            title: 'Global Health + STD (Female)',
            groups: [{ label: 'Female', items: GLOBAL_STD.femaleTests ?? [] }],
          },
        ],
        optionalAddOns: null,
      }
    }

    const stdHiv = STD_HIV_PACKAGES.find((p) => p.id === detailsPackageId) ?? null
    if (stdHiv) return toStdDrawerPackage(stdHiv, 'STD and HIV Screening')

    const urinary = STD_URINARY_PACKAGES.find((p) => p.id === detailsPackageId) ?? null
    if (urinary) return toStdDrawerPackage(urinary, 'Urinary pathway')

    const comprehensive = STD_COMPREHENSIVE_PACKAGES.find((p) => p.id === detailsPackageId) ?? null
    if (comprehensive) return toStdDrawerPackage(comprehensive, 'Comprehensive')

    return null
  }, [detailsPackageId])

  useEffect(() => {
    setSelectedAddOns({ essential: false })
  }, [selectedPackageIds, selectedWellnessIds, selectedMetabolicPanel, selectedStdProfiles, selectedStdHivPackageIds])

  const handleDrawerBook = () => {
    // Close drawer and scroll to appointment form.
    setDetailsPackageId(null)
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSelectStdHivPackage = (id) => {
    setSelectedStdHivPackageIds((prev) => (prev.includes(id) ? prev.filter((packageId) => packageId !== id) : [...prev, id]))
    setDetailsPackageId(null)
  }

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev
      // Sync immediately so UI updates without waiting for the effect.
      document.documentElement.classList.toggle('dark', next)
      try {
        localStorage.setItem('theme', next ? 'dark' : 'light')
      } catch {
        // ignore storage issues
      }
      return next
    })
  }

  const addOnTotal = useMemo(() => {
    let total = 0
    if (selectedAddOns.essential) total += ADDON_DISCOUNTED_PRICE
    return total
  }, [selectedAddOns])
  const selectedStdSummaries = useMemo(() => {
    if (!selectedStdProfiles.length) return []
    return selectedStdProfiles.map((profile) =>
      profile === 'male'
        ? { id: 'std-male', name: 'Global Health + STD (Male)', price: GLOBAL_STD.malePrice }
        : { id: 'std-female', name: 'Global Health + STD (Female)', price: GLOBAL_STD.femalePrice }
    )
  }, [selectedStdProfiles])
  const selectedStdHivPackages = useMemo(() => {
    if (!selectedStdHivPackageIds.length) return []
    return selectedStdHivPackageIds
      .map((selectedId) => {
        const std = STD_HIV_PACKAGES.find((p) => p.id === selectedId)
        if (std) {
          return {
            id: std.id,
            name: `STD and HIV Screening (${std.label})`,
            price: std.price,
          }
        }
        const urinary = STD_URINARY_PACKAGES.find((p) => p.id === selectedId)
        if (urinary) {
          return {
            id: urinary.id,
            name: `Urinary pathway (${urinary.label})`,
            price: urinary.price,
          }
        }
        const comprehensive = STD_COMPREHENSIVE_PACKAGES.find((p) => p.id === selectedId)
        if (comprehensive) {
          return {
            id: comprehensive.id,
            name: `Comprehensive (${comprehensive.label})`,
            price: comprehensive.price,
          }
        }
        return null
      })
      .filter(Boolean)
  }, [selectedStdHivPackageIds])
  const selectedMetabolicPanelSummary = selectedMetabolicPanel
    ? {
        id: METABOLIC_PANEL_ID,
        name: 'METABOLIC BODY COMPOSITION PANEL',
        price: METABOLIC_PANEL_PRICE,
        hasAddOns: false,
      }
    : null
  const selectedServices = useMemo(() => {
    const services = []
    selectedPackages.forEach((pkg) => services.push({ id: pkg.id, name: pkg.name, price: toAmount(pkg.price) }))
    selectedWellnesses.forEach((wellness) => services.push({ id: wellness.id, name: wellness.title, price: toAmount(wellness.price) }))
    selectedStdSummaries.forEach((std) => services.push({ id: std.id, name: std.name, price: toAmount(std.price) }))
    selectedStdHivPackages.forEach((pkg) => services.push({ id: pkg.id, name: pkg.name, price: toAmount(pkg.price) }))
    if (selectedMetabolicPanelSummary) {
      services.push({
        id: selectedMetabolicPanelSummary.id,
        name: selectedMetabolicPanelSummary.name,
        price: toAmount(selectedMetabolicPanelSummary.price),
      })
    }
    return services
  }, [selectedPackages, selectedWellnesses, selectedStdSummaries, selectedStdHivPackages, selectedMetabolicPanelSummary])

  const activeSelection = selectedServices.length
    ? {
        id: selectedServices[0].id,
        name: selectedServices.length === 1 ? selectedServices[0].name : `${selectedServices.length} packages selected`,
        total: selectedServices.reduce((sum, service) => sum + service.price, 0) + addOnTotal,
        hasAddOns: true,
        serviceSummary: [
          ...selectedServices.map((service) => service.name),
          ...(selectedAddOns.essential ? ['Metabolic Body Composition Test (Add. on)'] : []),
        ].join(', '),
      }
    : null

  useEffect(() => {
    if (!activeSelection?.name) {
      setBookingStep(1)
      setShowSelectionPopover(false)
      return
    }
    setAppointmentForm((prev) => ({
      ...prev,
      service: activeSelection.serviceSummary || activeSelection.name,
      bookingAmount: Number(activeSelection.total || 0),
    }))
  }, [activeSelection?.name, activeSelection?.serviceSummary, activeSelection?.total])

  useEffect(() => {
    if (bookingStep !== 1) return
    const currentId = activeSelection?.id ?? null
    const previousId = previousSelectedIdRef.current
    const isNewSelection = !previousId && !!currentId

    if (isNewSelection) {
      window.scrollBy({ top: 180, behavior: 'smooth' })
    }

    previousSelectedIdRef.current = currentId
  }, [activeSelection?.id, bookingStep])

  const clearCurrentSelection = () => {
    setSelectedPackageIds([])
    setSelectedWellnessIds([])
    setSelectedMetabolicPanel(false)
    setSelectedStdProfiles([])
    setSelectedStdHivPackageIds([])
    setSelectedAddOns({ essential: false })
    setShowSelectionPopover(false)
  }

  const scrollToSelectedCard = () => {
    if (!activeSelection?.id) return
    const runScroll = () => {
      const target = document.querySelector(`[data-package-anchor="${activeSelection.id}"]`)
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    if (bookingStep !== 1) {
      setBookingStep(1)
      setTimeout(runScroll, 120)
    } else {
      runScroll()
    }
    setShowSelectionPopover(false)
  }

  const handlePaymentSubmit = () => {
    if (isSubmittingPayment) return
    setIsSubmittingPayment(true)
    setTimeout(() => {
      setIsSubmittingPayment(false)
      setShowPaymentSuccess(true)
    }, 3000)
  }

  const updateAppointmentField = (field, value) => {
    setAppointmentForm((prev) => ({ ...prev, [field]: value }))
    setAppointmentErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const validateAppointmentForm = () => {
    const errors = {}
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneDigits = appointmentForm.phone.replace(/\D/g, '')

    if (!appointmentForm.firstName.trim()) errors.firstName = 'First name is required.'
    if (!appointmentForm.email.trim()) errors.email = 'Email address is required.'
    else if (!emailPattern.test(appointmentForm.email.trim())) errors.email = 'Enter a valid email address.'
    if (!appointmentForm.phone.trim()) errors.phone = 'Phone number is required.'
    else if (phoneDigits.length < 8) errors.phone = 'Enter a valid phone number.'
    if (!appointmentForm.service.trim()) errors.service = 'Service is required.'
    if (!appointmentForm.appointmentDate) errors.appointmentDate = 'Appointment date is required.'
    if (!appointmentForm.appointmentTime) errors.appointmentTime = 'Appointment time is required.'
    else if (appointmentForm.appointmentDate) {
      const todayKey = formatLocalDateKey(new Date())
      if (appointmentForm.appointmentDate < todayKey) {
        errors.appointmentDate = 'Please choose today or a future date.'
      } else if (appointmentForm.appointmentDate === todayKey) {
        const [h, m] = appointmentForm.appointmentTime.split(':').map(Number)
        const slotMinutes = h * 60 + m
        const now = new Date()
        const nowMinutes = now.getHours() * 60 + now.getMinutes()
        if (slotMinutes <= nowMinutes) {
          errors.appointmentTime = 'Please choose a time after the current time.'
        }
      }
    }

    setAppointmentErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleScheduleTest = () => {
    if (isSchedulingTest) return
    if (!validateAppointmentForm()) return
    setScheduleApiError('')
    setShowScheduleSuccess(false)
    setIsSchedulingTest(true)
    fetch(`${API_BASE_URL}/api/schedule-test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentForm),
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}))
        if (!response.ok) {
          throw new Error(data.message || 'Failed to schedule test.')
        }
        setShowScheduleSuccess(true)
        setAppointmentForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          service: '',
          bookingAmount: 0,
          appointmentDate: '',
          appointmentTime: '',
          message: '',
        })
        setAppointmentErrors({})
      })
      .catch((error) => {
        setScheduleApiError(error?.message || 'Something went wrong. Please try again.')
      })
      .finally(() => {
        setIsSchedulingTest(false)
      })
  }

  const updateContactField = (field, value) => {
    setContactForm((prev) => ({ ...prev, [field]: value }))
    setContactErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const validateContactForm = () => {
    const errors = {}
    const contactEmail = String(contactForm.email || '').trim()
    const contactPhoneDigits = String(contactForm.phone || '').replace(/\D/g, '')
    if (!String(contactForm.fullName || '').trim()) errors.fullName = 'Full name is required.'
    if (!String(contactForm.phone || '').trim()) errors.phone = 'Phone number is required.'
    else if (contactPhoneDigits.length < 8) errors.phone = 'Enter a valid phone number.'
    if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) errors.email = 'Enter a valid email address.'
    if (!String(contactForm.interest || '').trim()) errors.interest = 'Please choose an interest.'
    setContactErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleContactSubmit = async (event) => {
    event.preventDefault()
    if (isSubmittingContact) return
    if (!validateContactForm()) return
    setIsSubmittingContact(true)
    setContactSubmitError('')
    setContactSubmitSuccess('')
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit contact request.')
      }
      setContactSubmitSuccess('Thanks! Your contact request has been submitted.')
      setContactForm({
        fullName: '',
        phone: '',
        email: '',
        interest: 'general',
        notes: '',
      })
    } catch (error) {
      setContactSubmitError(error?.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmittingContact(false)
    }
  }

  const scrollCarousel = (ref, dir) => {
    const el = ref.current
    if (!el) return
    let step
    if (isMobile) {
      const first = el.firstElementChild
      step = first
        ? first.getBoundingClientRect().width + PACKAGE_CAROUSEL_GAP_PX
        : Math.max(el.clientWidth * 0.88, 260)
    } else {
      step = Math.max(el.clientWidth / cardsPerRowEffective, 260)
    }
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  useEffect(() => {
    const mappings = [
      ['general', generalCarouselRef],
      ['wellness', wellnessCarouselRef],
      ['stdHiv', stdHivCarouselRef],
      ['stdUrinary', stdUrinaryCarouselRef],
    ]

    const eps = 2
    const listeners = []

    const update = (key, ref) => {
      const el = ref.current
      if (!el) return
      const max = el.scrollWidth - el.clientWidth
      setCarouselStatus((prev) => ({
        ...prev,
        [key]: {
          canPrev: el.scrollLeft > eps,
          canNext: el.scrollLeft < max - eps,
        },
      }))
    }

    mappings.forEach(([key, ref]) => {
      const el = ref.current
      if (!el) return
      const onScroll = () => update(key, ref)
      el.addEventListener('scroll', onScroll, { passive: true })
      listeners.push(() => el.removeEventListener('scroll', onScroll))
      update(key, ref)
    })

    const onResize = () => mappings.forEach(([key, ref]) => update(key, ref))
    window.addEventListener('resize', onResize)
    onResize()

    return () => {
      listeners.forEach((off) => off())
      window.removeEventListener('resize', onResize)
    }
  }, [cardsPerRowEffective, isMobile])

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F5F4F0] dark:bg-[#343434] text-slate-900 dark:text-slate-50">
      <a
        href="#general"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-3 focus:py-2 focus:rounded-lg"
      >
        Skip to content
      </a>

      <SiteHeader isDark={isDark} onToggleTheme={toggleTheme} showTopBar />

      {bookingStep === 1 ? (
      <section id="top" className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HEALTH_GUIDE_BG_URL})` }}
        />
        <div className="absolute inset-0 bg-[#3B2D31]/55" />
        <div className="absolute inset-0 hidden dark:block bg-gradient-to-r from-brand-500/15 via-sky-500/10 to-fuchsia-500/15 mix-blend-screen opacity-70" />
        <div className="absolute inset-0 block dark:hidden bg-[#000000] opacity-50" />
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-brand-500/25 blur-3xl animate-floaty" />
        <div className="absolute top-28 right-10 h-56 w-56 rounded-full bg-sky-500/20 blur-3xl animate-floaty" />

        <div className="relative container mx-auto px-4">
          <div className="py-20 sm:py-24">
            <Reveal>
              <div className="text-center">
                <div className="relative z-[70] mb-3 inline-flex">
                  {/* <div className="h-[100px] w-[100px] overflow-hidden rounded-full border-[3px] border-white bg-white shadow-[0_10px_30px_rgba(0,0,0,0.24)]">
                    <img src={MMC_LOGO_URL} alt="MMC logo" className="h-full w-full object-contain p-1" />
                  </div> */}
                </div>
                {/* <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white dark:text-white/70">
                  {heroBreadcrumb.map((b, idx) => (
                    <span key={b} className="inline-flex items-center gap-2">
                      <span>{b}</span>
                      {idx === heroBreadcrumb.length - 1 ? null : (
                        <span aria-hidden="true" className="opacity-60">
                          /
                        </span>
                      )}
                    </span>
                  ))} 
                </div> */}
                <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
                  <span className="text-white">
                    HEALTH SCREENING SERVICES
                  </span>
                </h1>
                <p className="mt-5 text-white max-w-2xl mx-auto leading-6 text-sm sm:text-base">
                  Early detection, doctor reviewed results, and clear next steps—built to help clients feel confident about their health.
                </p>
              </div>  
            </Reveal>
          </div>
        </div>
      </section>
      ) : null}

      {bookingStep === 1 ? (
      <main className={`container mx-auto min-w-0 max-w-full px-4 ${activeSelection ? 'pb-[220px]' : ''}`}>
        <section className="py-10 sm:py-14">
          <Reveal>
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Health Screening Packages
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-7 max-w-3xl mx-auto">
                At MMC, we offer a variety of health screening options to suit different needs. Detailed pricing and package information can be found in the images under the titles below.
              </p>
            </div>
          </Reveal>
        </section>

        <section id="general" className="pb-8 sm:pb-12">
          <div className="mx-auto min-w-0 max-w-full" style={{ maxWidth: carouselMaxWidth }}>
            <div className="py-2">
              <Reveal delayMs={30}>
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-brand-700">General Health Screening</p>
                  <div className="mt-2 flex items-start justify-between gap-3">
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                      Choose the right panel for your goals
                    </h2>
                    <div className="hidden sm:block shrink-0 relative  relative bottom-[30px]">
                      <RowSelector value={cardsPerRow} onChange={setCardsPerRow} />
                    </div>
                  </div>
                  <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-6">
                    Open any package to see included checkups, full lab panel categories, and optional add-ons.
                  </p>
                </div>
              </Reveal>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <p className="text-sm text-slate-600 dark:text-slate-200">Choose one or more packages and then customize add-ons below.</p>
            </div>

            <div className="relative mx-auto mt-5 min-w-0 max-w-full" style={{ maxWidth: carouselMaxWidth }}>
              <div
                ref={generalCarouselRef}
                className={PACKAGE_CAROUSEL_TRACK_CLASS}
              >
                {sortedGeneralPackages.map((pkg, idx) => (
                  <div
                    key={pkg.id}
                    data-package-anchor={pkg.id}
                    className={packageCarouselSlideClassName()}
                    style={packageCarouselSlideStyle(isMobile, cardsPerRowEffective)}
                  >
                    <Reveal delayMs={idx * 40} className="h-full w-full">
                      <PackageCard
                        pkg={pkg}
                        selected={selectedPackageIds.includes(pkg.id)}
                        onSelect={() => {
                          setSelectedPackageIds((prev) =>
                            prev.includes(pkg.id)
                              ? prev.filter((packageId) => packageId !== pkg.id)
                              : [...prev, pkg.id]
                          )
                        }}
                        onViewDetails={() => setDetailsPackageId(pkg.id)}
                      />
                    </Reveal>
                  </div>
                ))}
              </div>
              {carouselStatus.general.canPrev || carouselStatus.general.canNext ? (
                <>
                  <MobileHorizontalScrollHints
                    canPrev={carouselStatus.general.canPrev}
                    canNext={carouselStatus.general.canNext}
                    onPrev={() => scrollCarousel(generalCarouselRef, -1)}
                    onNext={() => scrollCarousel(generalCarouselRef, 1)}
                    prevLabel="Previous general packages"
                    nextLabel="Next general packages"
                  />
                  <CarouselControls
                    onPrev={() => scrollCarousel(generalCarouselRef, -1)}
                    onNext={() => scrollCarousel(generalCarouselRef, 1)}
                    prevLabel="Previous general packages"
                    nextLabel="Next general packages"
                    canPrev={carouselStatus.general.canPrev}
                    canNext={carouselStatus.general.canNext}
                  />
                </>
              ) : null}
            </div>
          </div>
        </section>

        <section id="wellness" className="pb-10 sm:pb-14">
          <div className="mx-auto min-w-0 max-w-full" style={{ maxWidth: carouselMaxWidth }}>
            <Reveal delayMs={60}>
              <SectionTitle
                kicker="Wellness Screening Combos"
                title="Targeted checks for men and women"
                desc="Short, focused screening options that blend imaging and profile testing for a more guided next step."
              />
            </Reveal>
            <div className="relative mx-auto mt-8 min-w-0 max-w-full" style={{ maxWidth: carouselMaxWidth }}>
              <div
                ref={wellnessCarouselRef}
                className={PACKAGE_CAROUSEL_TRACK_CLASS}
              >
                <div
                  key="wellness-recommended-addon"
                  data-package-anchor="wellness-recommended-addon"
                  className={packageCarouselSlideClassName()}
                  style={packageCarouselSlideStyle(isMobile, cardsPerRowEffective)}
                >
                  <Reveal delayMs={0} className="h-full w-full">
                    <WellnessAddOnCard
                      isSelected={selectedMetabolicPanel}
                      onSelectPackage={() => {
                        setSelectedMetabolicPanel((prev) => !prev)
                      }}
                    />
                  </Reveal>
                </div>
                {sortedWellnessCombos.map((item, idx) => (
                  <div
                    key={item.id}
                    data-package-anchor={item.id}
                    className={packageCarouselSlideClassName()}
                    style={packageCarouselSlideStyle(isMobile, cardsPerRowEffective)}
                  >
                    <Reveal delayMs={idx * 50} className="h-full w-full">
                      <WellnessComboCard
                        item={item}
                        selected={selectedWellnessIds.includes(item.id)}
                        onSelect={() => {
                          setSelectedWellnessIds((prev) =>
                            prev.includes(item.id)
                              ? prev.filter((wellnessId) => wellnessId !== item.id)
                              : [...prev, item.id]
                          )
                        }}
                        onViewDetails={() => setDetailsPackageId(item.id)}
                      />
                    </Reveal>
                  </div>
                ))}
              </div>
              {carouselStatus.wellness.canPrev || carouselStatus.wellness.canNext ? (
                <>
                  <MobileHorizontalScrollHints
                    canPrev={carouselStatus.wellness.canPrev}
                    canNext={carouselStatus.wellness.canNext}
                    onPrev={() => scrollCarousel(wellnessCarouselRef, -1)}
                    onNext={() => scrollCarousel(wellnessCarouselRef, 1)}
                    prevLabel="Previous wellness packages"
                    nextLabel="Next wellness packages"
                  />
                  <CarouselControls
                    onPrev={() => scrollCarousel(wellnessCarouselRef, -1)}
                    onNext={() => scrollCarousel(wellnessCarouselRef, 1)}
                    prevLabel="Previous wellness packages"
                    nextLabel="Next wellness packages"
                    canPrev={carouselStatus.wellness.canPrev}
                    canNext={carouselStatus.wellness.canNext}
                  />
                </>
              ) : null}
            </div>
          </div>
        </section>

        <section id="std" className="pb-10 sm:pb-14">
          <div className="mx-auto min-w-0 max-w-full" style={{ maxWidth: carouselMaxWidth }}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <Reveal delayMs={40}>
                <SectionTitle
                  kicker="Global + STD Screening"
                  title="Early detection for sexual health and prevention"
                  desc="Confidential testing with a panel designed for timely treatment and peace of mind."
                />
              </Reveal>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-xl dark:bg-[rgba(0,0,0,0.3)] dark:border-slate-500 p-6">
              <div className="grid gap-6">
                <div className="rounded-xl border border-slate-200 bg-slate-50 dark:bg-[rgba(0,0,0,0.3)] dark:border-slate-500 backdrop-blur-xl p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">
                    Global Health + STD Screening
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                    {GLOBAL_STD.title}
                  </p>
                  <p className="mt-3 max-w-4xl text-slate-600 dark:text-slate-200 text-sm leading-6">{GLOBAL_STD.description}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div
                    data-package-anchor="std-male"
                    className={`relative min-w-0 max-w-full rounded-2xl border bg-white/85 backdrop-blur-xl dark:bg-[rgba(0,0,0,0.3)] dark:border-slate-500 p-5 ${UNIFORM_CARD_MIN_HEIGHT} flex flex-col overflow-hidden font-dm-sans ${
                      selectedStdProfiles.includes('male')
                        ? 'border-2 border-emerald-600 !bg-[#F5F8F5] dark:!bg-[#505050] ring-4 ring-inset ring-emerald-100/60 dark:ring-emerald-400/20 shadow-[0_28px_80px_rgba(0,0,0,0.14),0_12px_34px_rgba(16,185,129,0.24)]'
                        : 'border-slate-200'
                    }`}
                  >
                    {selectedStdProfiles.includes('male') ? (
                      <div className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                        ✓
                      </div>
                    ) : null}
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">Male</p>
                    <ul className="mt-4 space-y-2">
                      {GLOBAL_STD.maleTests.slice(0, 8).map((t) => (
                        <li key={t} className="text-sm text-slate-700 dark:text-slate-200">
                          ✓ {t}
                        </li>
                        
                      ))}
                         <button
                          type="button"
                          className="w-fit text-xs font-semibold text-[#63644A] p-2 hover:text-[#004999] underline decoration-[1.5px] underline-offset-2 transition"
                          onClick={() => setDetailsPackageId('global-std-male')}
                        >
                          Learn more
                        </button>
                    </ul>

                    <div className="mt-auto pt-4 border-t border-slate-200">
                      <div className="flex items-end justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-300">From</p>
                          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50 leading-none">
                            {formatSGD(toAmount(GLOBAL_STD.malePrice))}
                            <span className="ml-1 text-xs font-medium text-slate-600 dark:text-slate-300">/ person</span>
                          </p>
                        </div>
                        <p className="text-right text-xs text-slate-600 dark:text-slate-300 leading-4">
                          {bookedThisMonth('global-std-male', 18, 96)} booked
                          <br />
                          this month
                        </p>
                      </div>

                      <div className="mt-3 flex flex-col items-start gap-2">
                        <button
                          type="button"
                          className={`inline-flex w-fit items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold transition ${
                            selectedStdProfiles.includes('male')
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-[#63644A] text-white hover:bg-[#004999]'
                          }`}
                          onClick={() => {
                            setSelectedStdProfiles((prev) =>
                              prev.includes('male')
                                ? prev.filter((profile) => profile !== 'male')
                                : [...prev, 'male']
                            )
                          }}
                        >
                          {selectedStdProfiles.includes('male') ? 'Selected' : 'Select package'}
                        </button>

                     
                      </div>
                    </div>
                  </div>
                  <div
                    data-package-anchor="std-female"
                    className={`relative min-w-0 max-w-full rounded-2xl border bg-white/85 backdrop-blur-xl dark:bg-[rgba(0,0,0,0.3)] dark:border-slate-500 p-5 ${UNIFORM_CARD_MIN_HEIGHT} flex flex-col overflow-hidden font-dm-sans ${
                      selectedStdProfiles.includes('female')
                        ? 'border-2 border-emerald-600 !bg-[#F5F8F5] dark:!bg-[#505050] ring-4 ring-inset ring-emerald-100/60 dark:ring-emerald-400/20 shadow-[0_28px_80px_rgba(0,0,0,0.14),0_12px_34px_rgba(16,185,129,0.24)]'
                        : 'border-slate-200'
                    }`}
                  >
                    {selectedStdProfiles.includes('female') ? (
                      <div className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                        ✓
                      </div>
                    ) : null}
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">Female</p>
                    <ul className="mt-4 space-y-2">
                      {GLOBAL_STD.femaleTests.slice(0, 8).map((t) => (
                        <li key={t} className="text-sm text-slate-700 dark:text-slate-200">
                          ✓ {t}
                        </li>
                        
                      ))}
                          <button
                          type="button"
                          className="w-fit text-xs font-semibold text-[#63644A] hover:text-[#004999] underline decoration-[1.5px] underline-offset-2 transition"
                          onClick={() => setDetailsPackageId('global-std-female')}
                        >
                          Learn more
                        </button>
                    </ul>
                    
                    <div className="mt-auto pt-4 border-t border-slate-200">
                      <div className="flex items-end justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-300">From</p>
                          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50 leading-none">
                            {formatSGD(toAmount(GLOBAL_STD.femalePrice))}
                            <span className="ml-1 text-xs font-medium text-slate-600 dark:text-slate-300">/ person</span>
                          </p>
                        </div>
                        <p className="text-right text-xs text-slate-600 dark:text-slate-300 leading-4">
                          {bookedThisMonth('global-std-female', 18, 96)} booked
                          <br />
                          this month
                        </p>
                      </div>

                      <div className="mt-3 flex flex-col items-start gap-2">
                        <button
                          type="button"
                          className={`inline-flex w-fit items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold transition ${
                            selectedStdProfiles.includes('female')
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-[#63644A] text-white hover:bg-[#004999]'
                          }`}
                          onClick={() => {
                            setSelectedStdProfiles((prev) =>
                              prev.includes('female')
                                ? prev.filter((profile) => profile !== 'female')
                                : [...prev, 'female']
                            )
                          }}
                        >
                          {selectedStdProfiles.includes('female') ? 'Selected' : 'Select package'}
                        </button>

                    
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <Reveal delayMs={40}>
                  <SectionTitle
                    kicker="STD and HIV SCREENING"
                    title="STD and HIV SCREENING"
                    desc="Our STD and HIV screening services offer confidential, accurate testing aligned with international clinical standards. We focus on early detection, prompt guidance, and appropriate follow-up care."
                  />
                </Reveal>
              </div>

              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
                  Packages
                </p>
                <div className="relative mx-auto min-w-0 max-w-full" style={{ maxWidth: carouselMaxWidth }}>
                  <div
                    ref={stdHivCarouselRef}
                    className={PACKAGE_CAROUSEL_TRACK_CLASS}
                  >
                    {sortedStdHivPackages.map((p, idx) => (
                      <div
                        key={p.id}
                        data-package-anchor={p.id}
                        className={packageCarouselSlideClassName()}
                        style={packageCarouselSlideStyle(isMobile, cardsPerRowEffective)}
                      >
                        <Reveal delayMs={idx * 50} className="h-full w-full">
                          <StdPackageCard
                            label={p.label}
                            price={p.price}
                            items={p.items}
                            selected={selectedStdHivPackageIds.includes(p.id)}
                            onSelect={() => handleSelectStdHivPackage(p.id)}
                            onViewDetails={() => setDetailsPackageId(p.id)}
                            bookedSeed={p.id}
                          />
                        </Reveal>
                      </div>
                    ))}
                  </div>

                  {carouselStatus.stdHiv.canPrev || carouselStatus.stdHiv.canNext ? (
                    <>
                      <MobileHorizontalScrollHints
                        canPrev={carouselStatus.stdHiv.canPrev}
                        canNext={carouselStatus.stdHiv.canNext}
                        onPrev={() => scrollCarousel(stdHivCarouselRef, -1)}
                        onNext={() => scrollCarousel(stdHivCarouselRef, 1)}
                        prevLabel="Previous STD & HIV packages"
                        nextLabel="Next STD & HIV packages"
                      />
                      <CarouselControls
                        onPrev={() => scrollCarousel(stdHivCarouselRef, -1)}
                        onNext={() => scrollCarousel(stdHivCarouselRef, 1)}
                        prevLabel="Previous STD & HIV packages"
                        nextLabel="Next STD & HIV packages"
                        canPrev={carouselStatus.stdHiv.canPrev}
                        canNext={carouselStatus.stdHiv.canNext}
                      />
                    </>
                  ) : null}
                </div>
              </div>

              <div className="mt-10">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
                  Urinary pathway
                </p>
                <div className="relative mx-auto min-w-0 max-w-full" style={{ maxWidth: carouselMaxWidth }}>
                  <div
                    ref={stdUrinaryCarouselRef}
                    className={PACKAGE_CAROUSEL_TRACK_CLASS}
                  >
                    {sortedStdUrinaryPackages.map((p, idx) => (
                      <div
                        key={p.id}
                        data-package-anchor={p.id}
                        className={packageCarouselSlideClassName()}
                        style={packageCarouselSlideStyle(isMobile, cardsPerRowEffective)}
                      >
                        <Reveal delayMs={idx * 50} className="h-full w-full">
                          <StdPackageCard
                            label={p.label}
                            price={p.price}
                            items={p.items}
                            selected={selectedStdHivPackageIds.includes(p.id)}
                            onSelect={() => handleSelectStdHivPackage(p.id)}
                            onViewDetails={() => setDetailsPackageId(p.id)}
                            bookedSeed={p.id}
                          />
                        </Reveal>
                      </div>
                    ))}
                  </div>

                  {carouselStatus.stdUrinary.canPrev || carouselStatus.stdUrinary.canNext ? (
                    <>
                      <MobileHorizontalScrollHints
                        canPrev={carouselStatus.stdUrinary.canPrev}
                        canNext={carouselStatus.stdUrinary.canNext}
                        onPrev={() => scrollCarousel(stdUrinaryCarouselRef, -1)}
                        onNext={() => scrollCarousel(stdUrinaryCarouselRef, 1)}
                        prevLabel="Previous urinary pathway packages"
                        nextLabel="Next urinary pathway packages"
                      />
                      <CarouselControls
                        onPrev={() => scrollCarousel(stdUrinaryCarouselRef, -1)}
                        onNext={() => scrollCarousel(stdUrinaryCarouselRef, 1)}
                        prevLabel="Previous urinary pathway packages"
                        nextLabel="Next urinary pathway packages"
                        canPrev={carouselStatus.stdUrinary.canPrev}
                        canNext={carouselStatus.stdUrinary.canNext}
                      />
                    </>
                  ) : null}
                </div>
              </div>

              <div className="mt-10">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
                  Comprehensive
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {sortedStdComprehensivePackages.map((p, idx) => (
                    <div key={p.id} data-package-anchor={p.id} className="flex">
                      <Reveal delayMs={idx * 50} className="h-full w-full">
                        <StdPackageCard
                          label={p.label}
                          price={p.price}
                          items={p.items}
                          selected={selectedStdHivPackageIds.includes(p.id)}
                          onSelect={() => handleSelectStdHivPackage(p.id)}
                          onViewDetails={() => setDetailsPackageId(p.id)}
                          bookedSeed={p.id}
                        />
                      </Reveal>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* BASIC STD package carousel removed as requested. */}
        </section>  

        <section id="allergy" className="pb-10 sm:pb-14">
          <div className="mx-auto min-w-0 max-w-full" style={{ maxWidth: carouselMaxWidth }}>
            <Reveal delayMs={40}>
              <SectionTitle
                kicker="Allergy + Comprehensive Testing"
                title="Understand triggers with clear allergen panels"
                desc="Text-based, client-friendly reporting so you can take informed next steps."
              />
            </Reveal>
          </div>

          <div className="mx-auto mt-8 min-w-0 max-w-full" style={{ maxWidth: carouselMaxWidth }}>
            <div className="rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-xl dark:bg-[rgba(0,0,0,0.3)] dark:border-slate-500 p-6 sm:p-8 lg:p-10 shadow-sm">
              <div className="grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">Common allergen groups</p>
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ALLERGY_SECTION.allergenGroups.map((g) => (
                      <div key={g} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 dark:bg-[rgba(0,0,0,0.3)] dark:border-slate-500 dark:text-slate-100">
                        {g}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">Comprehensive panel</p>
                  <h3 className="mt-2 text-3xl font-extrabold leading-tight text-slate-900 dark:text-slate-50">{ALLERGY_SECTION.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-200">{ALLERGY_SECTION.description}</p>
                  <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-200">
                    We are pleased to extend the following allergy panel comprising common allergens for practical day-to-day screening.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="pb-16">
          <Reveal delayMs={50}>
            <div className="mx-auto min-w-0 max-w-full" style={{ maxWidth: carouselMaxWidth }}>
              <div className="rounded-3xl border border-slate-200 dark:border-slate-500 bg-white/80 dark:bg-[rgba(0,0,0,0.3)] backdrop-blur-xl shadow-sm overflow-hidden">
                <div className="grid gap-6 lg:grid-cols-5 lg:gap-0">
                  <div className="lg:col-span-2 p-6 sm:p-8 bg-gradient-to-br from-brand-500/10 via-sky-500/10 to-transparent dark:from-white/5 dark:via-transparent">
                    <p className="text-sm font-bold uppercase tracking-widest text-brand-700 dark:text-sky-300">Appointment request</p>
                    <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                      Ready to find the right panel?
                    </h2>
                    <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm leading-7">
                      After you submit your details, our team will contact you with schedule options and a suggested package based on your needs.
                    </p>
                    <div className="mt-5 rounded-2xl border border-slate-200 bg-white/70 dark:border-slate-500 dark:bg-[rgba(0,0,0,0.3)] backdrop-blur-xl p-4">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Fast contact</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                        Phone: <span className="font-semibold">62980360</span>
                        <br />
                        WhatsApp: <span className="font-semibold">82585070</span>
                      </p>
                    </div>
                  </div>

                  <div className="lg:col-span-3 p-6 sm:p-8">
                    <form
                      className="space-y-4"
                      onSubmit={handleContactSubmit}
                    >
                      <div className="grid sm:grid-cols-2 gap-4">
                        <label className="block">
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Full name</span>
                          <input
                            required
                            value={contactForm.fullName}
                            onChange={(e) => updateContactField('fullName', e.target.value)}
                            className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-500 bg-white/90 dark:bg-[rgba(0,0,0,0.3)] backdrop-blur-xl px-4 py-3 text-sm outline-none text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-brand-500"
                            placeholder="e.g., Sanju"
                          />
                          {contactErrors.fullName ? <p className="mt-1 text-xs text-rose-600">{contactErrors.fullName}</p> : null}
                        </label>
                        <label className="block">
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Phone / WhatsApp</span>
                          <input
                            required
                            value={contactForm.phone}
                            onChange={(e) => updateContactField('phone', e.target.value)}
                            className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-500 bg-white/90 dark:bg-[rgba(0,0,0,0.3)] backdrop-blur-xl px-4 py-3 text-sm outline-none text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-brand-500"
                            placeholder="e.g., 8XXXXXXXX"
                          />
                          {contactErrors.phone ? <p className="mt-1 text-xs text-rose-600">{contactErrors.phone}</p> : null}
                        </label>
                      </div>
                      <label className="block">
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Email (optional)</span>
                        <input
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => updateContactField('email', e.target.value)}
                          className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-500 bg-white/90 dark:bg-[rgba(0,0,0,0.3)] backdrop-blur-xl px-4 py-3 text-sm outline-none text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-brand-500"
                          placeholder="e.g., sanju@example.com"
                        />
                        {contactErrors.email ? <p className="mt-1 text-xs text-rose-600">{contactErrors.email}</p> : null}
                      </label>
                      <label className="block">
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">What are you interested in?</span>
                        <select
                          value={contactForm.interest}
                          onChange={(e) => updateContactField('interest', e.target.value)}
                          className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-500 bg-white/90 dark:bg-[rgba(0,0,0,0.3)] backdrop-blur-xl px-4 py-3 text-sm outline-none text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-brand-500"
                        >
                          <option value="general">General Health Screening</option>
                          <option value="wellness">Wellness Screening Combos</option>
                          <option value="std">Global Health + STD Screening</option>
                          <option value="allergy">Allergy / Comprehensive Testing</option>
                        </select>
                        {contactErrors.interest ? <p className="mt-1 text-xs text-rose-600">{contactErrors.interest}</p> : null}
                      </label>
                      <label className="block">
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Notes (optional)</span>
                        <textarea
                          rows={4}
                          value={contactForm.notes}
                          onChange={(e) => updateContactField('notes', e.target.value)}
                          className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-500 bg-white/90 dark:bg-[rgba(0,0,0,0.3)] backdrop-blur-xl px-4 py-3 text-sm outline-none text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-brand-500"
                          placeholder="Symptoms, age, or goals (e.g., annual checkup, travel readiness...)"
                        />
                      </label>

                      <button
                        type="submit"
                        disabled={isSubmittingContact}
                        className="w-full inline-flex items-center justify-center rounded-xl bg-[#63644A] px-6 py-3 text-sm font-bold text-white transition hover:scale-[1.02] hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
                      >
                        {isSubmittingContact ? 'Submitting...' : 'Request callback'}
                      </button>
                      {contactSubmitSuccess ? <p className="text-sm text-emerald-700">{contactSubmitSuccess}</p> : null}
                      {contactSubmitError ? <p className="text-sm text-rose-600">{contactSubmitError}</p> : null}
                      <p className="text-xs text-slate-500 leading-5">
                        By submitting, you agree to be contacted about your health screening request.
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/*
        <section id="about" className="pb-6">
          <Reveal delayMs={10}>
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 backdrop-blur p-6">
              <p className="text-brand-700 font-bold uppercase tracking-widest text-sm">About</p>
              <h3 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">Built for clarity and early detection</h3>
              <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm leading-7 max-w-3xl">
                Our screening approach focuses on evidence-based checks, doctor-reviewed results, and client-friendly explanations.
                You get a structured panel, a clear report, and support for the next best step.
              </p>
            </div>
          </Reveal>
        </section>

        <section id="services" className="pb-6">
          <Reveal delayMs={20}>
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 backdrop-blur p-6">
              <p className="text-brand-700 font-bold uppercase tracking-widest text-sm">Our Services</p>
              <h3 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">A complete preventive pathway</h3>
              <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm leading-7 max-w-3xl">
                Health Screening Services, Fatigue Screening, and STD & HIV Screening panels designed for prevention and timely action.
              </p>
            </div>
          </Reveal>
        </section>

        <section id="dialysis" className="pb-6">
          <Reveal delayMs={30}>
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 backdrop-blur p-6">
              <p className="text-brand-700 font-bold uppercase tracking -widest text-sm">Dialysis</p>
              <h3 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">Care with empathy</h3>
              <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm leading-7 max-w-3xl">
                We partner with trusted providers so patients can get consistent and compassionate care.
              </p>
            </div>
          </Reveal>
        </section>

        <section id="team" className="pb-12">
          <Reveal delayMs={40}>
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 backdrop-blur p-6">
              <p className="text-brand-700 font-bold uppercase tracking-widest text-sm">Our Team</p>
              <h3 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">Doctor-guided next steps</h3>
              <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm leading-7 max-w-3xl">
                You’ll receive structured explanations and guidance for follow-up where needed—so the report is actionable, not confusing.
              </p>
            </div>
          </Reveal>
        </section>
        */}
      </main>
      ) : null}

      {activeSelection && bookingStep === 1 ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom,0px)] dark:border-slate-600 dark:bg-[#3f3f3f]/95">
          {activeSelection.id !== METABOLIC_PANEL_ID ? (
            <div className="container mx-auto px-4 py-2">
              <RecommendedAddOnCard
                essentialEnabled={selectedAddOns.essential}
                onToggle={(checked) => setSelectedAddOns({ essential: checked })}
              />
            </div>
          ) : null}
          <div className="relative border-t border-slate-200 dark:border-slate-600">
            <div
              className={`absolute left-4 right-4 bottom-full mb-2 transition-all duration-300 ease-out ${
                showSelectionPopover ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-3 opacity-0 pointer-events-none'
              }`}
            >
              <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-600 dark:bg-[#4a4a4a]">
                <button
                  type="button"
                  onClick={scrollToSelectedCard}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50 transition dark:text-slate-100 dark:hover:bg-[#555]"
                >
                  Go to {activeSelection.name}
                </button>
                <button
                  type="button"
                  onClick={clearCurrentSelection}
                  className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50 transition dark:text-rose-300 dark:hover:bg-rose-900/30"
                >
                  Remove selected package
                </button>
              </div>
            </div>
            <div className="container mx-auto flex flex-col gap-3 px-4 py-3 min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between min-[480px]:gap-4 min-[480px]:py-2.5">
              <div className="min-w-0 flex-1 max-w-full">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-300">
                  Selected package
                </p>
                <div className="mt-1 min-w-0">
                  <button
                    type="button"
                    onClick={scrollToSelectedCard}
                    className="block w-full max-w-full text-left text-sm font-semibold text-slate-800 line-clamp-2 hover:text-[#63644A] hover:underline transition dark:text-slate-100 dark:hover:text-sky-300 sm:line-clamp-1"
                  >
                    {activeSelection.name}
                  </button>
                  {selectedAddOns.essential && activeSelection.id !== METABOLIC_PANEL_ID ? (
                    <p className="mt-0.5 text-[12px] font-medium text-slate-700 line-clamp-2 dark:text-slate-200 sm:line-clamp-1">
                      + Metabolic Body Composition test (one time test)
                    </p>
                  ) : null}
                </div>
                {/* <button
                  type="button"
                  onClick={() => setShowSelectionPopover((prev) => !prev)}
                  className="mt-1 text-[11px] font-semibold text-slate-500 hover:text-slate-700 transition"
                >
                  {showSelectionPopover ? 'Hide options' : 'Manage selection'}
                </button> */}
              </div>

              <div className="flex shrink-0 flex-row items-center justify-between gap-3 border-t border-slate-200/90 pt-3 min-[480px]:w-auto min-[480px]:justify-end min-[480px]:gap-5 min-[480px]:border-t-0 min-[480px]:pt-0 dark:border-slate-600">
                <div className="min-w-0 text-left min-[480px]:text-right">
                  <p className="text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-300">
                    Estimated total
                  </p>
                  <p className="text-lg font-bold tabular-nums text-slate-900 min-[480px]:text-xl dark:text-slate-50">
                    {formatSGD(activeSelection.total)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setBookingStep(2)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#0b7b6d] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0a6a5c] transition min-[480px]:px-5"
                >
                  Continue
                  <span aria-hidden="true" className="text-lg leading-none">
                    →
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {detailsPackage && bookingStep === 1 ? (
        <PackageDetailsDrawer
          key={detailsPackage.id}
          open
          packageData={detailsPackage}
          onClose={() => setDetailsPackageId(null)}
          onBook={handleDrawerBook}
        />
      ) : null}

      {bookingStep > 1 && activeSelection ? (
        <div className="pb-14">
          <section className="relative overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${HEALTH_GUIDE_BG_URL})` }}
            />
            <div className="absolute inset-0 bg-black/55" />
            <div className="relative container mx-auto px-4 py-12 sm:py-16 text-center text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em]">Preventive health · Camden Medical Centre</p>
              <h2 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight">Know Your Health,</h2>
              <p className="mt-1 text-4xl sm:text-5xl italic text-amber-100">Before It Knows You</p>
            </div>
          </section>

          <section className="container mx-auto px-4 pt-8">
            <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white px-4 py-4 sm:px-6 dark:border-slate-500 dark:bg-[rgba(0,0,0,0.3)] dark:backdrop-blur-xl">
              <div className="flex items-center justify-center gap-3 sm:gap-5 text-xs sm:text-sm">
                <div className={`inline-flex items-center gap-2 ${bookingStep >= 1 ? 'text-teal-700' : 'text-slate-400'}`}>
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-current">1</span>
                  <span className="font-semibold">Choose Package</span>
                </div>
                <div className="h-px w-8 sm:w-16 bg-slate-200 dark:bg-slate-500" />
                <div className={`inline-flex items-center gap-2 ${bookingStep >= 2 ? 'text-teal-700' : 'text-slate-400'}`}>
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-current">2</span>
                  <span className="font-semibold">Your Details</span>
                </div>
                <div className="h-px w-8 sm:w-16 bg-slate-200 dark:bg-slate-500" />
                <div className={`inline-flex items-center gap-2 ${bookingStep >= 3 ? 'text-teal-700' : 'text-slate-400'}`}>
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-current">3</span>
                  <span className="font-semibold">Confirmation</span>
                </div>
              </div>
            </div>
          </section>

          {bookingStep === 2 ? (
            <section className="container mx-auto px-4 pt-8">
              <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-500 dark:bg-[rgba(0,0,0,0.3)] dark:backdrop-blur-xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">Make an appointment</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">Book Your Appointment with Our Experts</h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-200">
                  Share your details and we will reserve your screening slot.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">First Name *</span>
                    <input
                      value={appointmentForm.firstName}
                      onChange={(e) => updateAppointmentField('firstName', e.target.value)}
                      className={`mt-2 w-full rounded-xl border bg-white/90 dark:bg-[rgba(0,0,0,0.3)] backdrop-blur-xl px-4 py-3 text-sm outline-none text-slate-900 dark:text-slate-50 focus:ring-2 ${
                        appointmentErrors.firstName
                          ? 'border-red-400 focus:ring-red-400 dark:border-red-400'
                          : 'border-slate-200 dark:border-slate-500 focus:ring-brand-500'
                      }`}
                      placeholder="First Name"
                    />
                    {appointmentErrors.firstName ? (
                      <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-300">{appointmentErrors.firstName}</p>
                    ) : null}
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Last Name</span>
                    <input
                      value={appointmentForm.lastName}
                      onChange={(e) => updateAppointmentField('lastName', e.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-500 bg-white/90 dark:bg-[rgba(0,0,0,0.3)] backdrop-blur-xl px-4 py-3 text-sm outline-none text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-brand-500"
                      placeholder="Last Name"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Email Address *</span>
                    <input
                      type="email"
                      value={appointmentForm.email}
                      onChange={(e) => updateAppointmentField('email', e.target.value)}
                      className={`mt-2 w-full rounded-xl border bg-white/90 dark:bg-[rgba(0,0,0,0.3)] backdrop-blur-xl px-4 py-3 text-sm outline-none text-slate-900 dark:text-slate-50 focus:ring-2 ${
                        appointmentErrors.email
                          ? 'border-red-400 focus:ring-red-400 dark:border-red-400'
                          : 'border-slate-200 dark:border-slate-500 focus:ring-brand-500'
                      }`}
                      placeholder="Email Address"
                    />
                    {appointmentErrors.email ? (
                      <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-300">{appointmentErrors.email}</p>
                    ) : null}
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Phone Number *</span>
                    <input
                      value={appointmentForm.phone}
                      onChange={(e) => updateAppointmentField('phone', e.target.value)}
                      className={`mt-2 w-full rounded-xl border bg-white/90 dark:bg-[rgba(0,0,0,0.3)] backdrop-blur-xl px-4 py-3 text-sm outline-none text-slate-900 dark:text-slate-50 focus:ring-2 ${
                        appointmentErrors.phone
                          ? 'border-red-400 focus:ring-red-400 dark:border-red-400'
                          : 'border-slate-200 dark:border-slate-500 focus:ring-brand-500'
                      }`}
                      placeholder="Phone Number"
                    />
                    {appointmentErrors.phone ? (
                      <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-300">{appointmentErrors.phone}</p>
                    ) : null}
                  </label>
                </div>

                <label className="mt-4 block">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Service Required</span>
                  <input
                    value={appointmentForm.service}
                    onChange={(e) => updateAppointmentField('service', e.target.value)}
                    className={`mt-2 w-full rounded-xl border bg-white/90 dark:bg-[rgba(0,0,0,0.3)] backdrop-blur-xl px-4 py-3 text-sm outline-none text-slate-900 dark:text-slate-50 focus:ring-2 ${
                      appointmentErrors.service
                        ? 'border-red-400 focus:ring-red-400 dark:border-red-400'
                        : 'border-slate-200 dark:border-slate-500 focus:ring-brand-500'
                    }`}
                  />
                  {appointmentErrors.service ? (
                    <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-300">{appointmentErrors.service}</p>
                  ) : null}
                </label>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Appointment Date *</span>
                    <input
                      type="date"
                      min={formatLocalDateKey(new Date())}
                      value={appointmentForm.appointmentDate}
                      onChange={(e) => updateAppointmentField('appointmentDate', e.target.value)}
                      className={`mt-2 w-full rounded-xl border bg-white/90 dark:bg-[rgba(0,0,0,0.3)] backdrop-blur-xl px-4 py-3 text-sm outline-none text-slate-900 dark:text-slate-50 focus:ring-2 ${
                        appointmentErrors.appointmentDate
                          ? 'border-red-400 focus:ring-red-400 dark:border-red-400'
                          : 'border-slate-200 dark:border-slate-500 focus:ring-brand-500'
                      }`}
                    />
                    {appointmentErrors.appointmentDate ? (
                      <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-300">{appointmentErrors.appointmentDate}</p>
                    ) : null}
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Appointment Time *</span>
                    <select
                      value={appointmentForm.appointmentTime}
                      onChange={(e) => updateAppointmentField('appointmentTime', e.target.value)}
                      disabled={availableAppointmentSlots.length === 0}
                      className={`mt-2 w-full rounded-xl border bg-white/90 dark:bg-[rgba(0,0,0,0.3)] backdrop-blur-xl px-4 py-3 text-sm outline-none text-slate-900 dark:text-slate-50 focus:ring-2 ${
                        appointmentErrors.appointmentTime
                          ? 'border-red-400 focus:ring-red-400 dark:border-red-400'
                          : 'border-slate-200 dark:border-slate-500 focus:ring-brand-500'
                      }`}
                    >
                      <option value="">
                        {availableAppointmentSlots.length ? 'Select time slot' : 'No slots available'}
                      </option>
                      {availableAppointmentSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                    {appointmentErrors.appointmentTime ? (
                      <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-300">{appointmentErrors.appointmentTime}</p>
                    ) : null}
                  </label>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-500 dark:bg-[rgba(0,0,0,0.3)] backdrop-blur-xl">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    Maeda Medical Clinic, Camden Medical, Singapore
                  </p>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">Monday - Friday: 8:30 AM - 5:30 PM</p>
                  <p className="text-sm text-slate-700 dark:text-slate-200">Saturday: 8:30 AM - 1:00 PM</p>
                  <p className="text-sm text-slate-700 dark:text-slate-200">Sunday & Public Holidays: Closed</p>
                </div>

                <label className="mt-4 block">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Message</span>
                  <textarea
                    value={appointmentForm.message}
                    onChange={(e) => updateAppointmentField('message', e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-500 bg-white/90 dark:bg-[rgba(0,0,0,0.3)] backdrop-blur-xl px-4 py-3 text-sm outline-none text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-brand-500"
                    rows={4}
                    placeholder="Any additional notes"
                  />
                </label>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-between gap-4 dark:border-slate-500 dark:bg-[rgba(0,0,0,0.3)] backdrop-blur-xl">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-300">Selected package</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50">{activeSelection.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-300">Amount payable</p>
                    <p className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-50">{formatSGD(activeSelection.total)}</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setBookingStep(1)
                      setShowScheduleSuccess(false)
                    }}
                    className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition dark:border-slate-500 dark:text-slate-200 dark:hover:bg-white/10"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleScheduleTest}
                    disabled={isSchedulingTest}
                    className={`rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition ${
                      isSchedulingTest ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#0b7b6d] hover:bg-[#0a6a5c]'
                    }`}
                  >
                    {isSchedulingTest ? 'Scheduling Test...' : 'Schedule Test'}
                  </button>
                </div>
                {scheduleApiError ? (
                  <p className="mt-3 text-sm font-medium text-red-600 dark:text-red-300">{scheduleApiError}</p>
                ) : null}
              </div>
            </section>
          ) : null}

          {bookingStep === 3 ? (
            <section className="container mx-auto px-4 pt-8">
              <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-500 dark:bg-[rgba(0,0,0,0.3)] dark:backdrop-blur-xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">Payment</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">Complete Your Booking</h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-200">Secure payment to confirm your appointment request.</p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="sm:col-span-2 block">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Name on Card</span>
                    <input
                      value={paymentForm.cardName}
                      onChange={(e) => setPaymentForm((prev) => ({ ...prev, cardName: e.target.value }))}
                      className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-500 bg-white/90 dark:bg-[rgba(0,0,0,0.3)] backdrop-blur-xl px-4 py-3 text-sm outline-none text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-brand-500"
                      placeholder="Cardholder Name"
                    />
                  </label>
                  <label className="sm:col-span-2 block">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Card Number</span>
                    <input
                      value={paymentForm.cardNumber}
                      onChange={(e) => setPaymentForm((prev) => ({ ...prev, cardNumber: e.target.value }))}
                      className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-500 bg-white/90 dark:bg-[rgba(0,0,0,0.3)] backdrop-blur-xl px-4 py-3 text-sm outline-none text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-brand-500"
                      placeholder="1234 5678 9012 3456"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Expiry</span>
                    <input
                      value={paymentForm.expiry}
                      onChange={(e) => setPaymentForm((prev) => ({ ...prev, expiry: e.target.value }))}
                      className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-500 bg-white/90 dark:bg-[rgba(0,0,0,0.3)] backdrop-blur-xl px-4 py-3 text-sm outline-none text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-brand-500"
                      placeholder="MM/YY"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">CVV</span>
                    <input
                      value={paymentForm.cvv}
                      onChange={(e) => setPaymentForm((prev) => ({ ...prev, cvv: e.target.value }))}
                      className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-500 bg-white/90 dark:bg-[rgba(0,0,0,0.3)] backdrop-blur-xl px-4 py-3 text-sm outline-none text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-brand-500"
                      placeholder="123"
                    />
                  </label>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-between gap-4 dark:border-slate-500 dark:bg-[rgba(0,0,0,0.3)] backdrop-blur-xl">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-300">Package</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50">{activeSelection.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-300">Total</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-50">{formatSGD(activeSelection.total)}</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setBookingStep(2)}
                    className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition dark:border-slate-500 dark:text-slate-200 dark:hover:bg-white/10"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handlePaymentSubmit}
                    disabled={isSubmittingPayment}
                    className={`rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition ${
                      isSubmittingPayment ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#0b7b6d] hover:bg-[#0a6a5c]'
                    }`}
                  >
                    {isSubmittingPayment ? 'Processing...' : `Pay ${formatSGD(activeSelection.total)}`}
                  </button>
                </div>
              </div>
            </section>
          ) : null}
        </div>
      ) : null}

      {isSubmittingPayment ? (
        <div className="fixed inset-0 z-[70] bg-black/55 backdrop-blur-sm">
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/15 bg-[rgba(0,0,0,0.5)] px-6 py-5 text-white">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-white/30 border-t-white" />
              <p className="text-sm font-semibold">Processing payment...</p>
            </div>
          </div>
        </div>
      ) : null}

      {isSchedulingTest ? (
        <div className="fixed inset-0 z-[72] bg-black/70 backdrop-blur-sm">
          <div className="flex h-full w-full items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/95 px-6 py-7 shadow-xl dark:border-slate-500 dark:bg-[#3f3f3f]/95">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600 dark:border-teal-900/50 dark:border-t-teal-300" />
                <p className="text-base font-semibold text-slate-900 dark:text-slate-50">Scheduling Test...</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {showScheduleSuccess ? (
        <div className="fixed inset-0 z-[73] bg-black/70 backdrop-blur-sm">
          <div className="flex h-full w-full items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl border border-teal-200 bg-white/95 p-6 shadow-2xl dark:border-teal-400/30 dark:bg-[#3f3f3f]/95">
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-50">Test Scheduled</h4>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-200">
                Your request for Health Screening test is scheduled. Our team will contact you.
              </p>
              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowScheduleSuccess(false)}
                  className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 transition"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {showPaymentSuccess ? (
        <div className="fixed inset-0 z-[75] bg-black/60 backdrop-blur-sm">
          <div className="flex h-full w-full items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl border border-emerald-200 bg-white p-6 shadow-2xl dark:border-emerald-400/30 dark:bg-[#3f3f3f]">
              {/* <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-300">
                Payment successful
              </p> */}
              <h4 className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-50">Appointment request submitted</h4>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-200">
                Thanks! Your payment is confirmed and our team will contact you shortly.
              </p>
              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowPaymentSuccess(false)}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {bookingStep === 1 ? <Footer /> : null}
    </div>
  )
}

function DashboardPage() {
  const [credentials, setCredentials] = useState(() => {
    try {
      const raw = sessionStorage.getItem('healthDashboardAuth')
      return raw ? JSON.parse(raw) : { username: '', password: '' }
    } catch {
      return { username: '', password: '' }
    }
  })
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [data, setData] = useState({
    totals: { bookings: 0, contactRequests: 0, logs: 0 },
    metrics: { uniqueBookingEmails: 0, uniqueContactEmails: 0, successEvents: 0, errorEvents: 0 },
    bookings: [],
    contactRequests: [],
    recentLogs: [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const hasSavedCredentials = Boolean(credentials.username && credentials.password)

  const loadDashboard = async (activeCredentials, options = {}) => {
    const { showLoginError = false, clearSessionOnUnauthorized = false } = options
    if (!activeCredentials?.username || !activeCredentials?.password) return false
    const authHeader = `Basic ${btoa(`${activeCredentials.username}:${activeCredentials.password}`)}`
    setLoading(true)
    if (!showLoginError) setError('')
    setLoginError('')
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
        headers: { Authorization: authHeader },
      })
      const payload = await response.json().catch(() => ({}))
      if (response.status === 401) throw new Error('Invalid dashboard username or password.')
      if (!response.ok) throw new Error(payload.message || 'Failed to load dashboard.')
      setData({
        totals: payload.totals || { bookings: 0, contactRequests: 0, logs: 0 },
        metrics: payload.metrics || { uniqueBookingEmails: 0, uniqueContactEmails: 0, successEvents: 0, errorEvents: 0 },
        bookings: Array.isArray(payload.bookings) ? payload.bookings : [],
        contactRequests: Array.isArray(payload.contactRequests) ? payload.contactRequests : [],
        recentLogs: Array.isArray(payload.recentLogs) ? payload.recentLogs : [],
      })
      setIsAuthenticated(true)
      setError('')
      return true
    } catch (loadError) {
      const message = loadError?.message || 'Could not load dashboard data.'
      setIsAuthenticated(false)
      if (showLoginError) {
        setLoginError(message)
      } else {
        setError(message)
      }
      if (clearSessionOnUnauthorized) {
        setCredentials({ username: '', password: '' })
        try {
          sessionStorage.removeItem('healthDashboardAuth')
        } catch {
          // ignore session storage errors
        }
      }
      return false
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!hasSavedCredentials) return
    loadDashboard(credentials, { clearSessionOnUnauthorized: true })
  }, [hasSavedCredentials])

  const handleLogin = async (event) => {
    event.preventDefault()
    const username = String(loginForm.username || '').trim()
    const password = String(loginForm.password || '').trim()
    if (!username || !password) {
      setLoginError('Username and password are required.')
      return
    }
    const nextCredentials = { username, password }
    setLoginError('')
    const isValidLogin = await loadDashboard(nextCredentials, { showLoginError: true })
    if (!isValidLogin) return
    setCredentials(nextCredentials)
    setIsAuthenticated(true)
    try {
      sessionStorage.setItem('healthDashboardAuth', JSON.stringify(nextCredentials))
    } catch {
      // ignore session storage errors
    }
  }

  const handleLogout = () => {
    setCredentials({ username: '', password: '' })
    setLoginForm({ username: '', password: '' })
    setIsAuthenticated(false)
    setLoginError('')
    setError('')
    try {
      sessionStorage.removeItem('healthDashboardAuth')
    } catch {
      // ignore session storage errors
    }
  }

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 py-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('https://maedamedical.com/wp-content/uploads/2026/01/in-the-hospital-2026-01-07-07-28-14-utc-scaled.jpg')",
        }}
      >
        <div className="w-full max-w-md rounded-2xl border border-white/60 bg-white/92 p-6 shadow-xl backdrop-blur-[2px]">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Login</h1>
          <p className="mt-2 text-sm text-slate-600">Enter your dashboard username and password.</p>
          <form className="mt-5 space-y-4" onSubmit={handleLogin}>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Username</span>
              <input
                value={loginForm.username}
                onChange={(event) => setLoginForm((prev) => ({ ...prev, username: event.target.value }))}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                placeholder="Username"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Password</span>
              <input
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                placeholder="Password"
              />
            </label>
            {loginError ? <p className="text-sm text-rose-600">{loginError}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Checking...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat px-4 py-8 text-slate-900"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('https://maedamedical.com/wp-content/uploads/2026/01/in-the-hospital-2026-01-07-07-28-14-utc-scaled.jpg')",
      }}
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Health Screening Dashboard</h1>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => loadDashboard(credentials)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold"
            >
              Logout
            </button>
            <Link to="/" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold">
              Back
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-7">
          <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Bookings</p><p className="text-2xl font-bold">{data.totals.bookings}</p></div>
          <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Contact Forms</p><p className="text-2xl font-bold">{data.totals.contactRequests}</p></div>
          <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Logs</p><p className="text-2xl font-bold">{data.totals.logs}</p></div>
          <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Booking Emails</p><p className="text-2xl font-bold">{data.metrics.uniqueBookingEmails}</p></div>
          <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Contact Emails</p><p className="text-2xl font-bold">{data.metrics.uniqueContactEmails}</p></div>
          <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Success Events</p><p className="text-2xl font-bold">{data.metrics.successEvents}</p></div>
          <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Error Events</p><p className="text-2xl font-bold">{data.metrics.errorEvents}</p></div>
        </div>

        {loading ? <p className="text-sm">Loading dashboard...</p> : null}
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">Test Submissions</h2>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-3 py-2 text-left">Time</th>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Email</th>
                  <th className="px-3 py-2 text-left">Phone</th>
                  <th className="px-3 py-2 text-left">Service</th>
                  <th className="px-3 py-2 text-left">Price</th>
                  <th className="px-3 py-2 text-left">Source</th>
                </tr>
              </thead>
              <tbody>
                {data.bookings.length ? data.bookings.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="px-3 py-2">{item.submittedAt ? new Date(item.submittedAt).toLocaleString() : '-'}</td>
                    <td className="px-3 py-2">{[item.firstName, item.lastName].filter(Boolean).join(' ') || '-'}</td>
                    <td className="px-3 py-2">{item.email || '-'}</td>
                    <td className="px-3 py-2">{item.phone || '-'}</td>
                    <td className="px-3 py-2">{item.service || '-'}</td>
                    <td className="px-3 py-2">{item.bookingAmount ? formatSGD(Number(item.bookingAmount)) : '-'}</td>
                    <td className="px-3 py-2">{item.source || '-'}</td>
                  </tr>
                )) : <tr><td className="px-3 py-3 text-slate-500" colSpan={7}>No test submissions yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        {/* <section className="space-y-2">
          <h2 className="text-lg font-bold">Contact Form Submissions</h2>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            No contact submissions yet.
          </div>
        </section> */}

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">System Logs</h2>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-3 py-2 text-left">Time</th>
                  <th className="px-3 py-2 text-left">Level</th>
                  <th className="px-3 py-2 text-left">Event</th>
                  <th className="px-3 py-2 text-left">Details</th>
                </tr>
              </thead>
              <tbody>
                {data.recentLogs.length ? data.recentLogs.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="px-3 py-2">{item.at ? new Date(item.at).toLocaleString() : '-'}</td>
                    <td className="px-3 py-2">{item.level || '-'}</td>
                    <td className="px-3 py-2">{item.event || '-'}</td>
                    <td className="px-3 py-2">{item.details ? JSON.stringify(item.details) : '-'}</td>
                  </tr>
                )) : <tr><td className="px-3 py-3 text-slate-500" colSpan={4}>No logs yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ScreeningServicesPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/screening" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
