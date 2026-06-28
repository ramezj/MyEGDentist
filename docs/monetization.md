# Monetization Plan

## The Core Mechanic

Egyptian dentists set two prices for every service:

- **Local price** — what Egyptian patients pay (e.g. 1,000 EGP)
- **Tourist price** — a markup for tourists booked through the platform (e.g. 2,000 EGP)

The platform captures the **surplus** (tourist price minus local price) and distributes it across all stakeholders. The dentist always receives their full local price as a floor, plus a share of the surplus on top.

Tourists benefit because even at 2x Egyptian prices, dental work here is a fraction of what it costs in Europe, the US, or the Gulf. They get quality care at a significant discount compared to home — that's the tourist value proposition.

---

## Why the Dentist Must Come First

The biggest churn risk is dentists taking tourists offline — meeting a patient through the platform, then handling future visits directly to avoid the fee. The only reliable counter to this is making the platform deal so attractive that going around it isn't worth it.

That means the dentist's cut of the surplus must be large enough that they feel they are genuinely profiting from every tourist booking, not just tolerating a tax on their work.

---

## Surplus Distribution

On a 1,000 EGP surplus (local price 1,000 → tourist price 2,000):

| Stakeholder    | Share of Surplus | Amount (EGP) | Total Dentist Revenue |
|----------------|-----------------|--------------|----------------------|
| Dentist        | 60%             | 600          | 1,600 EGP            |
| Platform       | 25%             | 250          | —                    |
| Tourist Agency | 15%             | 150          | —                    |

**The dentist earns 60% more per visit than they would from an Egyptian patient.** This is the loyalty anchor. A dentist who bypasses the platform loses 600 EGP on every future tourist booking from that patient — and loses access to all future tourist referrals.

Tourist agencies receive a 15% referral cut, paid per completed appointment, not per lead. This aligns their incentive with actual conversions, not just traffic.

---

## How to Set the Surplus

The surplus is not derived from the local price. It is derived from what the tourist would pay at home. That is the only number that determines how attractive the deal is to them.

### The Method

**Step 1 — Find the home-country benchmark.**
Look up the average price for this specific service in the tourist's most likely origin market (UK, Germany, UAE, etc.). Use published dental clinic pricing or health tourism data. This is the tourist's mental reference point — the number they compare against when deciding whether to book.

**Step 2 — Set the tourist price at a 50–70% discount to that benchmark.**
The tourist should feel they are getting a significant, undeniable deal. A 50% saving is motivating. Below 40% the deal stops feeling exceptional. Above 70% some tourists start to distrust the quality.

> Tourist price = Home-country benchmark × (1 − target discount)

**Step 3 — Verify the tourist price clears the local price by a meaningful margin.**
If the tourist price is too close to the local price, the surplus is too thin to distribute meaningfully. As a floor, the tourist price should be at least 1.5x the local price, or the service is not suitable for the platform.

**Step 4 — The surplus follows automatically.**
> Surplus = Tourist price − Local price

This surplus is then split per the distribution model (60/25/15).

---

### Worked Examples

**Teeth cleaning**

| | |
|---|---|
| UK benchmark | ~£65 ≈ 4,900 EGP |
| Target discount | 65% |
| Tourist price | ~1,700 EGP |
| Local price | 400 EGP |
| Surplus | 1,300 EGP |
| Dentist gets | 1,180 EGP (local + 60% surplus) |

**Single dental implant**

| | |
|---|---|
| UK benchmark | ~£2,500 ≈ 188,000 EGP |
| Target discount | 70% |
| Tourist price | ~56,000 EGP |
| Local price | 18,000 EGP |
| Surplus | 38,000 EGP |
| Dentist gets | 40,800 EGP (local + 60% surplus) |

**Porcelain veneer (per tooth)**

| | |
|---|---|
| UK benchmark | ~£800 ≈ 60,000 EGP |
| Target discount | 65% |
| Tourist price | ~21,000 EGP |
| Local price | 5,000 EGP |
| Surplus | 16,000 EGP |
| Dentist gets | 14,600 EGP (local + 60% surplus) |

Notice that high-value procedures (implants, veneers) generate enormous surpluses in absolute terms, which is why dental tourism economics work — the platform earns more on one implant than on dozens of cleanings.

---

### Guard Rails

The tourist price must satisfy **both** of these constraints, not just one:

1. **Tourist discount check** — tourist price must be ≥ 40% below the home-country benchmark. If it isn't, the deal is not compelling enough to motivate travel.
2. **Multiplier cap** — tourist price must not exceed **3x the local price**. Beyond this, the gap feels exploitative to the tourist even if it is technically still a saving, and it invites the dentist to game their local price downward to inflate the surplus.

If a service fails the discount check, the local price is too high relative to international prices to be a good fit for the platform. If it fails the multiplier cap, the local price is too low.

---

## Service Multipliers

### The Principle

Each service category has a **platform-set surplus multiplier**. This multiplier is fixed, non-negotiable, and identical for every dentist on the platform.

> Tourist price = Local price × Multiplier

The dentist sets only their local price. The platform computes the tourist price automatically. No dentist can negotiate a better or worse deal than any other dentist in the same category — the multiplier is a system constant, not a parameter.

This matters for trust: if dentists ever compared notes, any variation would be perceived as favoritism and would trigger demands for renegotiation. A single published multiplier per category removes that risk entirely.

---

### How Multipliers Are Derived

Each category's multiplier is set so that the resulting tourist price delivers a **≥ 50% discount vs. the home-country benchmark** across the typical local price range for that category. This was computed from UK, EU, and Gulf benchmark data and held against the guard rails defined in the surplus-setting methodology.

The multiplier is the same for all dentists but the absolute surplus scales with the dentist's local price — a higher-priced dentist generates more surplus in EGP terms, but the same percentage deal for everyone.

---

### Multiplier Table by Service Category

| Category | Example Services | Multiplier | Surplus % of Local Price | Dentist Earns vs. Local Patient |
|---|---|---|---|---|
| Preventive | Cleaning, checkup, x-rays | 2.5x | 150% | +90% |
| Restorative | Fillings, root canals, crowns | 2.5x | 150% | +90% |
| Cosmetic | Veneers, whitening, bonding | 3x | 200% | +120% |
| Surgical | Implants, extractions, bone graft | 3x | 200% | +120% |
| Orthodontic | Braces, clear aligners | 2x | 100% | +60% |

Orthodontics is lower because treatments span months — the tourist is not present for most visits, so multi-visit logistics limit how aggressively it can be priced.

Cosmetic and surgical are higher because these are exactly why tourists travel: high-cost procedures where the home-country price gap is largest.

---

### What This Looks Like in Practice

**Dr. Ahmed charges 800 EGP for a cleaning (Preventive, 2.5x):**
- Tourist price: 2,000 EGP
- Surplus: 1,200 EGP
- Dr. Ahmed gets: 800 + 720 = **1,520 EGP** (90% more than a local patient)

**Dr. Sara charges 1,200 EGP for a cleaning (Preventive, 2.5x):**
- Tourist price: 3,000 EGP
- Surplus: 1,800 EGP
- Dr. Sara gets: 1,200 + 1,080 = **2,280 EGP** (90% more than a local patient)

Both dentists get the same percentage lift. Dr. Sara earns more in absolute terms because she charges more — which is fair. Neither can claim the other got a better deal from the platform.

---

## Payment Flow

1. Tourist pays the full tourist price to the platform at booking time.
2. After the appointment is confirmed complete, the platform releases:
   - Local price + dentist's surplus share → dentist
   - Agency share → referring tourist agency
   - Platform share → retained
3. The platform holds funds until appointment completion to protect against no-shows.

---

## Tourist Agency Role

Tourist agencies are marketing partners. They drive tourist traffic to the platform in exchange for a 15% cut of the surplus on every booking they originate. An agency is credited when a tourist signs up or books through their referral link or code.

Agencies are **not** involved in appointment logistics — that is purely between the tourist, the dentist, and the platform.

---

## Open Questions

- What is the exact tourist price cap? (2x, 2.5x, or dentist-set with a recommended range?)
- Are tourist agencies paid per booking or per referred tourist (across all their bookings)?
- Does the platform take a flat fee on top, or is the 25% the only platform revenue?
- How are no-shows and cancellations handled — who absorbs the cost?
