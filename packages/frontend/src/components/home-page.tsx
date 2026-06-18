const tripSteps = [
  {
    title: 'Share your case',
    description:
      'Send your dental goals and recent scans so the clinic can suggest a practical treatment path before you travel.',
  },
  {
    title: 'Plan your visit',
    description:
      'Pick travel dates, understand the treatment timeline, and arrive in Egypt with the logistics already sorted.',
  },
  {
    title: 'Receive care in Cairo',
    description:
      'Complete your treatment with a local dental team while keeping the experience simple and easy to follow.',
  },
]

const highlights = [
  'Designed for international patients traveling to Egypt',
  'Simple care planning before flights and hotel bookings',
  'Clear steps for treatment, timing, and arrival',
]

export function HomePage() {
  return (
    <main className="text-[var(--sea-ink)]">
      <section className="page-wrap flex min-h-screen flex-col justify-between py-6 sm:py-8">
        <header className="rise-in flex items-center justify-between gap-4">
          <div>
            <p className="island-kicker mb-2">Dental tourism in Egypt</p>
            <a className="display-title text-3xl font-bold text-[var(--sea-ink)] no-underline" href="/">
              My EG Dentist
            </a>
          </div>
          <a
            className="rounded-full border border-[var(--line)] bg-white/80 px-5 py-2 text-sm font-semibold text-[var(--sea-ink)] no-underline shadow-sm backdrop-blur"
            href="#plan-visit"
          >
            Start planning
          </a>
        </header>

        <div className="grid items-end gap-12 py-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:py-20">
          <div className="rise-in max-w-2xl">
            <p className="island-kicker mb-5">Simple landing page</p>
            <h1 className="display-title text-5xl leading-tight font-bold text-balance sm:text-6xl">
              Straightforward dental trips to Egypt for international patients.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--sea-ink-soft)]">
              My EG Dentist helps visitors understand the path from treatment planning to arrival in
              Cairo, without forcing them through a complicated website.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                className="rounded-full bg-[var(--lagoon-deep)] px-6 py-3 text-center font-semibold text-white no-underline shadow-lg shadow-cyan-950/10"
                href="#plan-visit"
              >
                Start your treatment plan
              </a>
              <a
                className="rounded-full border border-[var(--line)] bg-white/72 px-6 py-3 text-center font-semibold text-[var(--sea-ink)] no-underline backdrop-blur"
                href="#how-it-works"
              >
                See how it works
              </a>
            </div>
          </div>

          <aside className="rise-in island-shell rounded-[2rem] p-6 sm:p-8" id="plan-visit">
            <p className="island-kicker mb-3">What the first step looks like</p>
            <h2 className="display-title text-3xl font-bold">A calm, clear starting point.</h2>
            <p className="mt-4 leading-7 text-[var(--sea-ink-soft)]">
              This page is intentionally basic. Its job is to explain the offer, show who it is for,
              and point people toward planning a visit in Egypt.
            </p>
            <ul className="mt-6 space-y-3 text-sm leading-6 text-[var(--sea-ink-soft)]">
              {highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3"
                >
                  {highlight}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="page-wrap py-10 sm:py-14" id="how-it-works">
        <div className="rise-in max-w-2xl">
          <p className="island-kicker mb-3">How it works</p>
          <h2 className="display-title text-4xl font-bold">Three simple steps from inquiry to care.</h2>
          <p className="mt-4 text-lg leading-8 text-[var(--sea-ink-soft)]">
            The focus is clarity: understand the treatment, schedule the travel, and arrive knowing
            what comes next.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {tripSteps.map((step, index) => (
            <article
              key={step.title}
              className="feature-card rise-in rounded-[1.75rem] border border-[var(--line)] p-6"
            >
              <p className="island-kicker mb-4">Step {index + 1}</p>
              <h3 className="text-2xl font-semibold">{step.title}</h3>
              <p className="mt-3 leading-7 text-[var(--sea-ink-soft)]">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-wrap py-10 sm:py-14">
        <div className="rise-in rounded-[2rem] border border-[var(--line)] bg-white/72 px-6 py-10 text-center shadow-xl shadow-emerald-950/5 backdrop-blur sm:px-10">
          <p className="island-kicker mb-3">Why this exists</p>
          <h2 className="display-title text-4xl font-bold">A basic foundation for My EG Dentist.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[var(--sea-ink-soft)]">
            This landing page gives the project a clear front door now, while leaving room for richer
            patient flows, clinic details, and inquiry forms later.
          </p>
        </div>
      </section>

      <footer className="site-footer mt-10">
        <div className="page-wrap flex flex-col gap-3 py-8 text-sm text-[var(--sea-ink-soft)] sm:flex-row sm:items-center sm:justify-between">
          <p>My EG Dentist</p>
          <p>Dental travel support for visitors coming to Egypt.</p>
        </div>
      </footer>
    </main>
  )
}
