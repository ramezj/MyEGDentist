import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Globe2,
  Plane,
  ShieldCheck,
} from "lucide-react";

const journeySteps = [
  {
    title: "Compare verified clinics",
    description:
      "Review Egyptian dentists by treatment focus, location, and patient-ready clinic details.",
  },
  {
    title: "Plan treatment remotely",
    description:
      "Share your goals before travel so consultations, timing, and estimates are easier to compare.",
  },
  {
    title: "Arrive with a care plan",
    description:
      "Land in Egypt with your first appointment, next steps, and clinic expectations already clear.",
  },
];

const trustCues = [
  {
    icon: ShieldCheck,
    label: "Verified clinic profiles",
  },
  {
    icon: Globe2,
    label: "English-speaking coordination",
  },
  {
    icon: CalendarCheck,
    label: "Transparent treatment estimates",
  },
];

export function LandingPage() {
  return (
    <main className="bg-[#f8faf7] text-[#14211d]">
      <section className="relative isolate min-h-[calc(100vh-var(--header-height))] overflow-hidden">
        <img
          src="/pyramids.jpg"
          alt="The pyramids near Cairo at sunset"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[#13231f]/70" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-[#f8faf7] to-transparent" />

        <div className="mx-auto flex min-h-[calc(100vh-var(--header-height))] w-full max-w-6xl flex-col justify-center px-5 py-16 sm:px-8 lg:px-10">
          <div className="max-w-3xl text-white">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur">
              <Plane className="h-4 w-4" aria-hidden="true" />
              Dental tourism for Egypt
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-normal sm:text-5xl lg:text-6xl">
              Dental care in Egypt, planned before you fly
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82">
              My EG Dentist helps international patients compare trusted
              Egyptian clinics, understand treatment options, and book with a
              clearer plan before travel.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#clinics"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#f4c45d] px-5 py-3 text-sm font-semibold text-[#14211d] shadow-sm transition hover:bg-[#ffd779] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f4c45d]"
              >
                Find a dentist
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="/bookings"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/35 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/18 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Start a booking
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        id="clinics"
        className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10"
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#2b6d67]">
            Simple path to care
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-[#14211d] sm:text-4xl">
            Built for patients crossing borders for treatment
          </h2>
          <p className="mt-4 text-base leading-7 text-[#53635e]">
            The first decision is not a checkout form. It is knowing which
            clinic can help, what the visit may involve, and how the trip fits
            around treatment.
          </p>
        </div>

        <div className="grid gap-3">
          {journeySteps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-lg border border-[#dfe7e2] bg-white p-5 shadow-sm"
            >
              <div className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e4f0ed] text-sm font-semibold text-[#2b6d67]">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-[#14211d]">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#53635e]">
                    {step.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-[#dfe7e2] bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-3 px-5 py-10 sm:px-8 md:grid-cols-3 lg:px-10">
          {trustCues.map((cue) => {
            const Icon = cue.icon;

            return (
              <div
                key={cue.label}
                className="flex items-center gap-3 rounded-lg border border-[#dfe7e2] p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f4c45d]/25 text-[#9a6a05]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    className="h-4 w-4 shrink-0 text-[#2b6d67]"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-medium text-[#14211d]">
                    {cue.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
