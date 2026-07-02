import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Hotel,
  Plane,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "#/components/ui/button";

import type { ReactNode } from "react";

export function LandingPage() {
  return (
    <main className="bg-[#f8f5ee] text-[#1d2c2d]">
      <section className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden">
        <img
          src="/pyramids.jpg"
          alt="The pyramids in Egypt"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,34,35,0.92),rgba(13,34,35,0.72)_46%,rgba(13,34,35,0.16))]" />
        <div className="relative mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-6xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl pt-8">
            <p className="mb-5 inline-flex items-center gap-2 border border-white/25 bg-white/10 px-3 py-1 text-sm font-medium uppercase tracking-[0.2em] text-[#f5d38b] backdrop-blur">
              <Sparkles className="h-4 w-4" />
              My EG Dentist
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-normal text-white sm:text-6xl lg:text-7xl">
              Dental care in Egypt, planned before you fly
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82 sm:text-xl">
              Compare verified Egyptian dentists, book treatment windows around
              your trip, and arrive with clinic, hotel, and timing details
              already coordinated.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-12 rounded-sm bg-[#f5d38b] px-6 text-base font-semibold text-[#183233] hover:bg-[#ffe1a2]"
              >
                <a href="/auth">
                  Find a dentist
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-sm border-white/40 bg-white/10 px-6 text-base font-semibold text-white hover:bg-white/20 hover:text-white"
              >
                <a href="/auth">Join as a clinic</a>
              </Button>
            </div>
          </div>

          <div className="mt-14 grid max-w-4xl gap-px overflow-hidden border border-white/18 bg-white/18 sm:grid-cols-3">
            {[
              ["Save 50-70%", "Against typical UK, EU, and Gulf prices"],
              ["Verified clinics", "Profiles, services, and patient fit"],
              ["Trip-aware booking", "Care windows matched to your stay"],
            ].map(([value, label]) => (
              <div
                key={value}
                className="bg-[#102f30]/82 px-5 py-4 text-white backdrop-blur"
              >
                <p className="text-2xl font-semibold">{value}</p>
                <p className="mt-1 text-sm leading-6 text-white/70">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#d8d0bf] bg-[#fffdf8]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a35f2f]">
              Built for dental travel
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
              One plan for treatment, travel, and trust.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Feature
              icon={<Search className="h-5 w-5" />}
              title="Compare verified Egyptian dentists"
              body="Review services, cities, specialties, and clinic details before you commit to a trip."
            />
            <Feature
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Transparent tourist pricing"
              body="See treatment pricing designed to stay meaningfully below home-country benchmarks."
            />
            <Feature
              icon={<CalendarCheck className="h-5 w-5" />}
              title="English-speaking coordination"
              body="Line up availability and care expectations clearly before your appointment window."
            />
            <Feature
              icon={<Hotel className="h-5 w-5" />}
              title="Airport, hotel, and clinic timing"
              body="Plan dental visits around arrival, recovery, sightseeing, and return travel."
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a35f2f]">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal">
              From quote to clinic chair.
            </h2>
          </div>
          <div className="grid gap-4 lg:col-span-2">
            <Step
              number="01"
              title="Choose the treatment goal"
              body="Start with cleaning, veneers, implants, orthodontics, or a full consultation."
            />
            <Step
              number="02"
              title="Match with a clinic"
              body="Shortlist dentists by city, specialty, availability, and tourist-patient readiness."
            />
            <Step
              number="03"
              title="Travel with a confirmed plan"
              body="Arrive in Egypt with appointments, documents, and timing already aligned."
            />
          </div>
        </div>
      </section>

      <section className="bg-[#173f40] text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#f5d38b]">
              For clinics
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
              Earn more from tourist appointments without negotiating each case.
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-white/76">
              My EG Dentist gives clinics a channel for international patients
              while keeping local pricing as the foundation. The platform adds
              tourist demand, booking structure, and partner distribution.
            </p>
          </div>
          <div className="grid content-center gap-3">
            {[
              "Keep your local price as the baseline",
              "Receive qualified international appointment requests",
              "Grow cosmetic, surgical, and preventive bookings",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 text-white/86">
                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#f5d38b]" />
                <span>{item}</span>
              </div>
            ))}
            <Button
              asChild
              className="mt-5 h-12 justify-self-start rounded-sm bg-white px-6 text-base font-semibold text-[#173f40] hover:bg-[#f5d38b]"
            >
              <a href="/auth">
                Register your clinic
                <Plane className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <article className="border border-[#d8d0bf] bg-[#f8f5ee] p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center bg-[#173f40] text-[#f5d38b]">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 leading-7 text-[#536061]">{body}</p>
    </article>
  );
}

function Step({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <article className="grid gap-4 border-t border-[#d8d0bf] py-5 sm:grid-cols-[5rem_1fr]">
      <p className="text-sm font-semibold tracking-[0.18em] text-[#a35f2f]">
        {number}
      </p>
      <div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-2 leading-7 text-[#536061]">{body}</p>
      </div>
    </article>
  );
}
