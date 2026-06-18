export function HomeLanding() {
  return (
    <main className="min-h-screen">
      <section className="px-6 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-6xl flex-col justify-between gap-12 rounded-[2rem] border border-white/45 bg-white/72 px-6 py-8 shadow-[0_32px_80px_rgba(23,58,64,0.12)] backdrop-blur md:px-10 md:py-10">
          <header className="flex items-center justify-between gap-4">
            <div>
              <p className="display-title text-2xl font-bold text-[var(--sea-ink)]">
                My EG Dentist
              </p>
              <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
                Dental tourism for international patients in Egypt
              </p>
            </div>
            <a
              className="rounded-full border border-[var(--line)] bg-white/85 px-4 py-2 text-sm font-semibold text-[var(--sea-ink)] no-underline"
              href="#contact"
            >
              Start planning
            </a>
          </header>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-end">
            <div className="rise-in max-w-3xl">
              <p className="island-kicker">My EG Dentist</p>
              <h1 className="display-title mt-4 text-5xl leading-[0.95] font-bold text-[var(--sea-ink)] sm:text-6xl lg:text-7xl">
                Simple dental trips to Egypt, planned with clarity.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--sea-ink-soft)]">
                Connect with trusted dental care, understand the treatment path,
                and organize your visit in one place.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  className="rounded-full bg-[var(--sea-ink)] px-6 py-3 text-center text-sm font-semibold text-white no-underline shadow-[0_14px_30px_rgba(23,58,64,0.22)]"
                  href="#contact"
                >
                  Request information
                </a>
                <a
                  className="rounded-full border border-[var(--line)] px-6 py-3 text-center text-sm font-semibold text-[var(--sea-ink)] no-underline"
                  href="#how-it-works"
                >
                  See how it works
                </a>
              </div>
            </div>

            <div className="grid gap-4 text-sm text-[var(--sea-ink)]">
              <div className="rounded-[1.75rem] border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(229,243,236,0.88))] p-6 shadow-[0_18px_40px_rgba(23,58,64,0.08)]">
                <p className="island-kicker">What you get</p>
                <ul className="mt-4 space-y-3 text-base leading-7 text-[var(--sea-ink-soft)]">
                  <li>Clear guidance before you book your trip</li>
                  <li>Treatment coordination with clinics in Egypt</li>
                  <li>One simple place to begin your dental journey</li>
                </ul>
              </div>
              <div className="rounded-[1.75rem] border border-[var(--line)] bg-white/78 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--kicker)]">
                  Built for visitors
                </p>
                <p className="mt-3 text-base leading-7 text-[var(--sea-ink-soft)]">
                  Designed for patients traveling from abroad who want affordable
                  dental treatment in Egypt without unnecessary complexity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-8 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:py-12"
      >
        <div>
          <p className="island-kicker">How it works</p>
          <h2 className="display-title mt-4 text-3xl font-bold text-[var(--sea-ink)] sm:text-4xl">
            Start with the essentials.
          </h2>
          <p className="mt-4 max-w-md text-base leading-7 text-[var(--sea-ink-soft)]">
            This first version keeps the message focused: why the service exists,
            who it is for, and how a patient can take the next step.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-[1.5rem] border border-[var(--line)] bg-white/72 p-5">
            <p className="text-sm font-semibold text-[var(--kicker)]">1. Share</p>
            <h3 className="mt-3 text-lg font-semibold text-[var(--sea-ink)]">
              Tell us your case
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--sea-ink-soft)]">
              Start with the treatment you need and your travel timing.
            </p>
          </article>
          <article className="rounded-[1.5rem] border border-[var(--line)] bg-white/72 p-5">
            <p className="text-sm font-semibold text-[var(--kicker)]">2. Review</p>
            <h3 className="mt-3 text-lg font-semibold text-[var(--sea-ink)]">
              Get guidance
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--sea-ink-soft)]">
              Review the care path and what your visit to Egypt could look like.
            </p>
          </article>
          <article className="rounded-[1.5rem] border border-[var(--line)] bg-white/72 p-5">
            <p className="text-sm font-semibold text-[var(--kicker)]">3. Travel</p>
            <h3 className="mt-3 text-lg font-semibold text-[var(--sea-ink)]">
              Plan the trip
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--sea-ink-soft)]">
              Move forward with a simpler dental tourism experience.
            </p>
          </article>
        </div>
      </section>

      <section id="contact" className="px-6 py-8 pb-12 sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 rounded-[2rem] bg-[var(--sea-ink)] px-6 py-8 text-white shadow-[0_32px_70px_rgba(23,58,64,0.28)] md:flex-row md:items-end md:justify-between md:px-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
              Contact
            </p>
            <h2 className="display-title mt-3 text-3xl font-bold sm:text-4xl">
              Ready to ask about dental care in Egypt?
            </h2>
            <p className="mt-4 text-base leading-7 text-white/76">
              This basic landing page is the first touchpoint for international
              patients who want to learn more and start a conversation.
            </p>
          </div>
          <a
            className="rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-[var(--sea-ink)] no-underline"
            href="mailto:hello@myegdentist.com"
          >
            hello@myegdentist.com
          </a>
        </div>
      </section>
    </main>
  )
}
