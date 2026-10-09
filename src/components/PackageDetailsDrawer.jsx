import { useEffect, useMemo, useState } from 'react'

import { GENERAL_IN_ALL } from '../data/healthScreeningData'

function groupByLabel(groups) {
  const map = new Map()
  for (const g of groups) {
    if (!g?.label) continue
    if (!map.has(g.label)) map.set(g.label, [])
    map.get(g.label).push(...(g.items ?? []))
  }
  return [...map.entries()].map(([label, items]) => ({
    label,
    items: Array.from(new Set(items)),
  }))
}

export default function PackageDetailsDrawer({
  open,
  packageData,
  onClose,
  onBook,
}) {
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0)

  // Prevent the underlying page from scrolling while the drawer is open.
  useEffect(() => {
    if (!open) return
    if (typeof document === 'undefined') return () => {}

    const prevOverflow = document.body.style.overflow
    const prevPaddingRight = document.body.style.paddingRight

    // Avoid layout shift when scrollbars disappear.
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollBarWidth > 0) document.body.style.paddingRight = `${scrollBarWidth}px`

    return () => {
      document.body.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPaddingRight
    }
  }, [open])

  const categories = useMemo(() => {
    const groups =
      packageData?.cards?.flatMap((c) => c.groups ?? []) ?? []
    return groupByLabel(groups)
  }, [packageData])

  // Drawer is expected to be remounted when `packageData` changes (via `key` in App),
  // so we don't need to reset local state here.

  useEffect(() => {
    if (!open) return

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  const selected = categories[selectedCategoryIdx]

  return (
    <div
      className={`fixed inset-0 z-[60] ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={open ? 'false' : 'true'}
    > 
      <div
        className={`absolute inset-0 bg-slate-950/50 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => onClose?.()}
      />

      <aside
        role="dialog"
        aria-modal="true"
        className={`absolute right-0 top-0 h-full w-full max-w-3xl bg-white dark:bg-slate-950 shadow-2xl border-l border-slate-200 dark:border-slate-800 transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur sticky top-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-300">
                Package details
              </p>
              <h3 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {packageData?.name ?? ''}
              </h3>
              <p className="mt-1 text-brand-700 font-bold text-lg">
                {packageData?.price ?? ''}
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-6">
                Structured lab categories, clear included panel list, and optional add-ons.
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <button
                type="button"
                className="rounded-xl border border-white/50 bg-white dark:bg-slate-950/40 px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white hover:bg-gradient-to-r hover:from-brand-50 hover:via-sky-50 hover:to-fuchsia-50 hover:shadow-sm transition-all duration-200 hover:scale-[1.02]"
                onClick={() => onClose?.()}
              >
                Close
              </button>
              <button
                type="button"
                className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700 transition-all duration-200 w-fit hover:scale-[1.02] hover:shadow-sm"
                onClick={() => onBook?.()}
              >
                Book consultation
              </button>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 overflow-auto h-[calc(100vh-86px)]">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-cyan-500/12 via-white dark:via-slate-950 to-sky-500/10 p-4 sm:p-6 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-brand-700">
                  Maeda Medical Clinic
                </p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 leading-6">
                  Poster-style breakdown: Included → Categories → Add-ons.
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-brand-600 animate-softPulse" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Doctor reviewed</span>
              </div>
            </div>

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-[220px]">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-700">
                  Included in all health screening packages
                </p>
                <div className="mt-3">
                  <ul className="space-y-2">
                    {GENERAL_IN_ALL.map((t) => (
                      <li
                        key={t}
                        className="flex gap-2 text-sm leading-5 text-slate-700 dark:text-slate-300"
                      >
                        <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-50 text-brand-700 font-semibold">
                          ✓
                        </span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Middle categories */}
              <div className="flex-1 min-w-[240px]">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-700">
                  Laboratory categories
                </p>
                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c, idx) => (
                      <button
                        key={c.label}
                        type="button"
                        onClick={() => setSelectedCategoryIdx(idx)}
                        className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all transform-gpu duration-200 ease-out ${
                          idx === selectedCategoryIdx
                            ? 'bg-[#63644A] text-white border-[#63644A] hover:shadow-soft hover:scale-[1.02] hover:brightness-105'
                            : 'bg-white/70 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-brand-50 hover:via-sky-50 hover:to-fuchsia-50 hover:border-brand-300/60 hover:-translate-y-[1px] hover:scale-[1.02] hover:brightness-105'
                        } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/40 p-4">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {selected?.label ?? 'Select a category'}
                    </p>
                    {selected ? (
                      <div key={`${selectedCategoryIdx}-${selected?.label}`} className="animate-fadeSlideIn">
                        <ul className="mt-3 space-y-1">
                          {selected.items.map((it) => (
                            <li key={it} className="text-sm text-slate-700 dark:text-slate-300">
                              • {it}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        Choose a category to view the included tests.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right add-ons */}
              <div className="min-w-[260px]">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-700">
                  Optional add-ons
                </p>

                <div className="mt-3 space-y-3">
                  {packageData?.optionalAddOns?.preMarital ? (
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/40 p-4">
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-300">
                        {packageData.optionalAddOns.preMarital.title}
                      </p>
                      <p className="mt-2 font-black text-brand-700">
                        {packageData.optionalAddOns.preMarital.price}
                      </p>
                      <ul className="mt-3 space-y-1">
                        {packageData.optionalAddOns.preMarital.items.map((it) => (
                          <li key={it} className="text-sm text-slate-700 dark:text-slate-300">
                            • {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {packageData?.optionalAddOns?.fertility ? (
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/40 p-4">
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-300">
                        {packageData.optionalAddOns.fertility.title}
                      </p>
                      <p className="mt-2 font-black text-brand-700">
                        {packageData.optionalAddOns.fertility.price}
                      </p>
                      <ul className="mt-3 space-y-1">
                        {packageData.optionalAddOns.fertility.items.map((it) => (
                          <li key={it} className="text-sm text-slate-700 dark:text-slate-300">
                            • {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {packageData?.optionalAddOns?.vaccinations?.length ? (
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/40 p-4">
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-300">
                        Vaccinations
                      </p>
                      <ul className="mt-3 space-y-1">
                        {packageData.optionalAddOns.vaccinations.map((it) => (
                          <li key={it} className="text-sm text-slate-700 dark:text-slate-300">
                            • {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {!packageData?.optionalAddOns ? (
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Optional add-ons available upon consultation.
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 text-xs text-slate-500 dark:text-slate-300 leading-5">
            Note: This demo uses extracted text for display. Final clinical recommendations should be reviewed with our team.
          </div>
        </div>
      </aside>
    </div>
  )
}

