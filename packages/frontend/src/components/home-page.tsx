const treatmentHighlights = [
  'Implants, veneers, and full smile restorations',
  'Airport pickup and clinic coordination in one place',
  'English-speaking support before, during, and after treatment',
]

const travelSteps = [
  'Share your case and treatment goals',
  'Receive a simple plan with timing and next steps',
  'Travel to Egypt for treatment and supported recovery',
]

export function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="px-6 pb-20 pt-6 sm:px-8 lg:px-12">
        <div className="mx-auto flex min-h-[calc(100svh-3rem)] w-full max-w-6xl flex-col justify-between overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(243,250,245,0.72))] px-6 py-8 shadow-[0_28px_80px_rgba(23,58,64,0.12)] backdrop-blur sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          <header className="flex items-center justify-between gap-4">
            <div>
              <p className="island-kicker">Dental tourism in Egypt</p>
              <p className="mt-2 text-sm text-[color:var(--sea-ink-soft)]">
                My EG Dentist
              </p>
            </div>
            <a
              className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-4 py-2 text-sm font-semibold no-underline"
              href="mailto:care@myegdentist.com"
            >
              Plan my visit
            </a>
          </header>

          <div className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.85fr)] lg:items-end lg:gap-14">
            <div className="max-w-2xl">
              <p className="rise-in text-sm font-semibold uppercase tracking-[0.28em] text-[color:var(--kicker)]">
                Simple landing page
              </p>
              <h1 className="display-title rise-in mt-5 text-5xl leading-none font-semibold text-[color:var(--sea-ink)] sm:text-6xl lg:text-7xl">
                Dental care in Egypt, made easy for international patients.
              </h1>
              <p className="rise-in mt-6 max-w-xl text-base leading-7 text-[color:var(--sea-ink-soft)] sm:text-lg">
                We help you move from online consultation to treatment trip with
                clear planning, trusted clinics, and support that stays simple.
              </p>

              <div className="rise-in mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  className="rounded-full bg-[color:var(--sea-ink)] px-6 py-3 text-center text-sm font-semibold text-white no-underline shadow-[0_18px_34px_rgba(23,58,64,0.16)]"
                  href="mailto:care@myegdentist.com?subject=My%20EG%20Dentist%20consultation"
                >
                  Request a consultation
                </a>
                <a
                  className="rounded-full border border-[var(--chip-line)] bg-white/70 px-6 py-3 text-center text-sm font-semibold text-[color:var(--sea-ink)] no-underline"
                  href="#how-it-works"
                >
                  How it works
                </a>
              </div>
            </div>

            <aside className="island-shell rise-in rounded-[1.75rem] p-6 sm:p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--kicker)]">
                What you get
              </p>
              <ul className="mt-6 space-y-4 text-sm leading-6 text-[color:var(--sea-ink-soft)] sm:text-base">
                {treatmentHighlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 border-b border-[var(--line)] pb-4 last:border-b-0 last:pb-0"
                  >
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[color:var(--lagoon-deep)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="page-wrap grid gap-6 px-1 pb-14 lg:grid-cols-3"
      >
        {travelSteps.map((step, index) => (
          <div
            key={step}
            className="feature-card rounded-[1.5rem] border border-[var(--line)] p-6"
          >
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--kicker)]">
              Step {index + 1}
            </p>
            <p className="mt-4 text-lg font-semibold text-[color:var(--sea-ink)]">
              {step}
            </p>
          </div>
        ))}
      </section>

      <section className="page-wrap px-1 pb-18">
        <div className="rounded-[1.75rem] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] px-6 py-8 sm:px-8">
          <p className="island-kicker">Why patients choose Egypt</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
            <div>
              <h2 className="display-title text-3xl font-semibold text-[color:var(--sea-ink)] sm:text-4xl">
                Quality treatment, practical travel, and one clear point of
                contact.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--sea-ink-soft)]">
                My EG Dentist is built for travelers who want straightforward
                dental planning without chasing separate clinic, accommodation,
                and arrival details.
              </p>
            </div>
            <div className="flex justify-start lg:justify-end">
              <a
                className="rounded-full bg-[color:var(--lagoon-deep)] px-6 py-3 text-sm font-semibold text-white no-underline shadow-[0_18px_34px_rgba(50,143,151,0.2)]"
                href="mailto:care@myegdentist.com?subject=I%20want%20to%20start%20my%20trip"
              >
                Start planning
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
