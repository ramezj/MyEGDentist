import { createFileRoute } from '@tanstack/react-router'

const highlights = [
  {
    title: 'Clear treatment planning',
    description:
      'Start with a straightforward path for consultations, treatment choices, and a realistic timeline before you travel.',
  },
  {
    title: 'Travel-friendly coordination',
    description:
      'Keep your dental visit and your stay in Egypt aligned, so the trip feels manageable from arrival to follow-up.',
  },
  {
    title: 'Comfort in a new destination',
    description:
      'Designed for international patients who want quality dental care without losing sight of the overall travel experience.',
  },
]

const tripSteps = [
  'Share the treatment you need and the dates that work for your trip.',
  'Review a simple plan for your visit, treatment sequence, and recovery time.',
  'Arrive in Egypt ready for an organized appointment flow and a smoother stay.',
]

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      {
        title: 'My EG Dentist | Dental Care in Egypt',
      },
      {
        name: 'description',
        content:
          'A simple introduction to My EG Dentist, a dental tourism platform for international patients planning treatment in Egypt.',
      },
    ],
  }),
  component: Home,
})

function Home() {
  return (
    <main className="pb-16 text-[var(--sea-ink)]" id="top">
      <section className="relative overflow-hidden px-4 pb-18 pt-6 sm:px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top_left,rgba(79,184,178,0.32),transparent_40%),radial-gradient(circle_at_top_right,rgba(47,106,74,0.18),transparent_38%)]"
        />
        <div className="page-wrap relative">
          <div className="flex items-center justify-between py-4">
            <span className="display-title text-2xl font-bold tracking-tight">
              My EG Dentist
            </span>
            <span className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--sea-ink-soft)]">
              Egypt
            </span>
          </div>

          <div className="max-w-3xl space-y-8 pt-12 sm:pt-18">
            <p className="island-kicker rise-in">
              Dental tourism for international visitors
            </p>
            <div className="rise-in space-y-5 [animation-delay:100ms]">
              <h1 className="display-title max-w-3xl text-5xl leading-[0.95] font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Simple dental care planning in Egypt.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--sea-ink-soft)] sm:text-xl">
                My EG Dentist helps foreign visitors explore dental treatment in
                Egypt with a clear path for planning care, timing their trip,
                and understanding the visit before they arrive.
              </p>
            </div>

            <div className="rise-in flex flex-wrap gap-4 [animation-delay:180ms]">
              <a
                className="rounded-full bg-[var(--sea-ink)] px-6 py-3 text-sm font-semibold text-white no-underline shadow-[0_18px_38px_rgba(23,58,64,0.16)] hover:bg-[color-mix(in_oklab,var(--sea-ink)_88%,black)]"
                href="#start"
              >
                Start your plan
              </a>
              <a
                className="rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-6 py-3 text-sm font-semibold text-[var(--sea-ink)] no-underline hover:bg-[var(--link-bg-hover)]"
                href="#how-it-works"
              >
                See how it works
              </a>
            </div>

            <dl className="rise-in grid gap-6 border-t border-[var(--line)] pt-8 text-sm sm:grid-cols-3 [animation-delay:260ms]">
              <div>
                <dt className="font-semibold uppercase tracking-[0.18em] text-[var(--sea-ink-soft)]">
                  Focus
                </dt>
                <dd className="mt-2 text-base font-medium text-[var(--sea-ink)]">
                  Dental treatment for foreign visitors
                </dd>
              </div>
              <div>
                <dt className="font-semibold uppercase tracking-[0.18em] text-[var(--sea-ink-soft)]">
                  Place
                </dt>
                <dd className="mt-2 text-base font-medium text-[var(--sea-ink)]">
                  Egypt-based care planning
                </dd>
              </div>
              <div>
                <dt className="font-semibold uppercase tracking-[0.18em] text-[var(--sea-ink-soft)]">
                  Goal
                </dt>
                <dd className="mt-2 text-base font-medium text-[var(--sea-ink)]">
                  A more organized treatment trip
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8" id="start">
        <div className="page-wrap">
          <div className="max-w-2xl">
            <p className="island-kicker">What My EG Dentist offers</p>
            <h2 className="display-title mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              A calmer first step for treatment abroad.
            </h2>
          </div>

          <div className="mt-10 grid gap-8 border-t border-[var(--line)] pt-8 lg:grid-cols-3 lg:gap-10">
            {highlights.map((highlight) => (
              <article
                className="space-y-3 border-b border-[var(--line)] pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8 last:border-r-0 last:pr-0"
                key={highlight.title}
              >
                <h3 className="text-xl font-semibold tracking-tight">
                  {highlight.title}
                </h3>
                <p className="text-base leading-7 text-[var(--sea-ink-soft)]">
                  {highlight.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8" id="how-it-works">
        <div className="page-wrap grid gap-10 lg:grid-cols-[0.9fr_minmax(0,1.1fr)] lg:items-start">
          <div className="space-y-4">
            <p className="island-kicker">How it works</p>
            <h2 className="display-title text-3xl font-bold tracking-tight sm:text-4xl">
              Built around a straightforward trip flow.
            </h2>
            <p className="max-w-xl text-base leading-7 text-[var(--sea-ink-soft)]">
              The first version of My EG Dentist does one job: explain the
              dental tourism idea clearly and keep the journey easy to
              understand for someone traveling to Egypt for care.
            </p>
          </div>

          <ol className="island-shell rounded-[2rem] p-6 sm:p-8">
            {tripSteps.map((step, index) => (
              <li
                className="grid gap-4 border-b border-[var(--line)] py-5 first:pt-0 last:border-b-0 last:pb-0 sm:grid-cols-[auto_1fr]"
                key={step}
              >
                <span className="display-title text-3xl font-bold text-[var(--lagoon-deep)]">
                  0{index + 1}
                </span>
                <p className="max-w-xl text-base leading-7 text-[var(--sea-ink)]">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-4 pt-8 sm:px-6 lg:px-8">
        <div className="page-wrap">
          <div className="island-shell rounded-[2rem] px-6 py-10 text-center sm:px-10 sm:py-14">
            <p className="island-kicker">My EG Dentist</p>
            <h2 className="display-title mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              A basic landing page, ready to introduce the platform.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[var(--sea-ink-soft)]">
              This first page establishes the product clearly: dental care in
              Egypt for foreign visitors, presented with a simple story and
              direct navigation through the essentials.
            </p>
            <a
              className="mt-8 inline-flex rounded-full bg-[var(--lagoon-deep)] px-6 py-3 text-sm font-semibold text-white no-underline shadow-[0_18px_38px_rgba(50,143,151,0.18)] hover:bg-[color-mix(in_oklab,var(--lagoon-deep)_86%,black)]"
              href="#top"
            >
              Back to top
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
