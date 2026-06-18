const services = [
  {
    title: 'Treatment matching',
    description:
      'Share the dental service you need and get a simple shortlist of suitable options in Egypt.',
  },
  {
    title: 'Travel coordination',
    description:
      'Keep flights, accommodation, and treatment timing aligned before you arrive.',
  },
  {
    title: 'Local guidance',
    description:
      'Travel with a clear plan for clinic visits, recovery time, and the basics of your stay.',
  },
]

const steps = [
  'Tell us the treatment you need and when you want to travel.',
  'Review a simple plan for your care, trip timing, and next steps.',
  'Arrive in Egypt with your appointments and travel details in one place.',
]

export function HomeLanding() {
  return (
    <div className="min-h-screen pb-12">
      <header className="page-wrap flex items-center justify-between py-6">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full border border-[color:var(--line)] bg-white/70 shadow-[0_10px_24px_rgba(23,58,64,0.08)]" />
          <div>
            <p className="island-kicker">My EG Dentist</p>
            <p className="text-sm text-[color:var(--sea-ink-soft)]">
              Dental tourism in Egypt
            </p>
          </div>
        </div>
        <a
          href="#contact"
          className="rounded-full border border-[color:var(--line)] bg-white/80 px-5 py-2 text-sm font-semibold text-[color:var(--sea-ink)] no-underline shadow-[0_12px_28px_rgba(23,58,64,0.08)] hover:bg-white"
        >
          Start planning
        </a>
      </header>

      <main>
        <section className="pb-16 pt-6">
          <div className="page-wrap grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-center">
            <div className="max-w-2xl">
              <p className="island-kicker rise-in">Simple trip planning</p>
              <h1 className="display-title rise-in mt-4 text-5xl leading-tight font-semibold text-[color:var(--sea-ink)] sm:text-6xl">
                A simple way to plan dental care in Egypt.
              </h1>
              <p className="rise-in mt-6 max-w-xl text-lg leading-8 text-[color:var(--sea-ink-soft)] [animation-delay:120ms]">
                My EG Dentist helps international patients compare their options,
                organise travel, and arrive with a clear treatment plan.
              </p>
              <div className="rise-in mt-8 flex flex-wrap gap-4 [animation-delay:220ms]">
                <a
                  href="#contact"
                  className="rounded-full bg-[color:var(--sea-ink)] px-6 py-3 text-sm font-semibold text-white no-underline shadow-[0_18px_34px_rgba(23,58,64,0.18)] hover:bg-[color:var(--lagoon-deep)]"
                >
                  Plan my visit
                </a>
                <a
                  href="#services"
                  className="rounded-full border border-[color:var(--line)] px-6 py-3 text-sm font-semibold text-[color:var(--sea-ink)] no-underline hover:bg-white/70"
                >
                  View services
                </a>
              </div>
              <div className="mt-10 grid gap-4 text-sm text-[color:var(--sea-ink-soft)] sm:grid-cols-3">
                <p className="border-t border-[color:var(--line)] pt-4">
                  Clear treatment and travel guidance.
                </p>
                <p className="border-t border-[color:var(--line)] pt-4">
                  Designed for patients visiting from abroad.
                </p>
                <p className="border-t border-[color:var(--line)] pt-4">
                  Built around a calm, organised arrival experience.
                </p>
              </div>
            </div>

            <aside className="island-shell rise-in rounded-[2rem] p-8 [animation-delay:320ms]">
              <p className="island-kicker">What you get</p>
              <div className="mt-6 space-y-6">
                <div>
                  <p className="text-sm font-semibold text-[color:var(--sea-ink)]">
                    Before you book
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[color:var(--sea-ink-soft)]">
                    A straightforward overview of the dental service you are
                    seeking and how it fits into your travel window.
                  </p>
                </div>
                <div className="border-t border-[color:var(--line)] pt-6">
                  <p className="text-sm font-semibold text-[color:var(--sea-ink)]">
                    Before you fly
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[color:var(--sea-ink-soft)]">
                    A simple schedule that keeps appointments, travel, and rest
                    in sync.
                  </p>
                </div>
                <div className="border-t border-[color:var(--line)] pt-6">
                  <p className="text-sm font-semibold text-[color:var(--sea-ink)]">
                    When you arrive
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[color:var(--sea-ink-soft)]">
                    One clear plan for your first days in Egypt so nothing feels
                    improvised.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section id="services" className="page-wrap border-t border-[color:var(--line)] py-16">
          <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
            <div>
              <p className="island-kicker">Services</p>
              <h2 className="display-title mt-4 text-3xl text-[color:var(--sea-ink)]">
                A very simple landing page, focused on the essentials.
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {services.map((service) => (
                <article key={service.title} className="border-l border-[color:var(--line)] pl-4">
                  <h3 className="text-lg font-semibold text-[color:var(--sea-ink)]">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--sea-ink-soft)]">
                    {service.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="page-wrap border-t border-[color:var(--line)] py-16">
          <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
            <div>
              <p className="island-kicker">How it works</p>
              <h2 className="display-title mt-4 text-3xl text-[color:var(--sea-ink)]">
                Three calm steps from first message to arrival.
              </h2>
            </div>
            <ol className="grid gap-6 md:grid-cols-3">
              {steps.map((step, index) => (
                <li
                  key={step}
                  className="island-shell rounded-[1.5rem] p-6 text-sm leading-7 text-[color:var(--sea-ink-soft)]"
                >
                  <span className="text-xs font-semibold tracking-[0.2em] text-[color:var(--kicker)] uppercase">
                    Step {index + 1}
                  </span>
                  <p className="mt-3">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="contact" className="page-wrap border-t border-[color:var(--line)] pt-16">
          <div className="flex flex-col gap-6 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="island-kicker">Contact</p>
              <h2 className="display-title mt-4 text-3xl text-[color:var(--sea-ink)]">
                Start with the treatment you need and your preferred travel dates.
              </h2>
              <p className="mt-4 text-base leading-8 text-[color:var(--sea-ink-soft)]">
                Keep the first step simple. Tell us what you are looking for, and
                we can help shape the rest of the trip from there.
              </p>
            </div>
            <a
              href="mailto:hello@myegdentist.com"
              className="rounded-full bg-[color:var(--lagoon-deep)] px-6 py-3 text-center text-sm font-semibold text-white no-underline shadow-[0_18px_34px_rgba(50,143,151,0.24)] hover:bg-[color:var(--sea-ink)]"
            >
              hello@myegdentist.com
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}
