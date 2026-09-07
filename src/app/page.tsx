import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "Analyze comments, questions, and discussions from your audience.",
  },
  {
    number: "02",
    title: "Prove",
    description:
      "Find recurring problems and see the audience evidence behind them.",
  },
  {
    number: "03",
    title: "Create",
    description:
      "Turn the strongest opportunity into platform-native content.",
  },
  {
    number: "04",
    title: "Learn",
    description:
      "Use performance data to understand what resonates with your audience.",
  },
];

const exampleSignals = [
  "I don't know where to start with AI automation.",
  "Which automation tool should I learn first?",
  "AI seems way too complicated for beginners.",
];

const sourceTypes = ["Comments", "Questions", "Discussions", "Reviews"];
const analysisSteps = ["Analyze", "Cluster", "Rank", "Explain", "Create"];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-zinc-950">
      {/* Navigation */}
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-sm font-bold text-white">
            C
          </div>

          <span className="text-lg font-semibold tracking-tight">
            ContentPulse
          </span>
        </Link>

        <Link
          href="/workspace"
          className="rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          Try the demo
        </Link>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-24 pt-20 text-center lg:px-8 lg:pt-28">
        <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-600">
          <span
            className="h-2 w-2 rounded-full bg-emerald-500"
            aria-hidden="true"
          />
          AI audience intelligence for creators
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-semibold tracking-tight text-zinc-950 sm:text-6xl lg:text-7xl">
          Turn what your audience says into what you should publish next.
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-zinc-600 sm:text-xl">
          ContentPulse analyzes real audience signals, discovers recurring
          problems, and ranks evidence-backed content opportunities.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/workspace"
            className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-950 px-7 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Analyze your audience
            <span className="ml-2" aria-hidden="true">
              →
            </span>
          </Link>

          <span className="text-sm text-zinc-500">
            No account required for the demo
          </span>
        </div>

        {/* Product Preview */}
        <div className="mx-auto mt-20 max-w-4xl rounded-2xl border border-zinc-200 bg-zinc-50 p-2 shadow-2xl shadow-zinc-200/50">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 text-left sm:p-8">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-5">
              <div className="min-w-0 pr-4">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Top content opportunity
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  Where beginners should start with AI automation
                </h2>
              </div>

              <div className="hidden shrink-0 rounded-xl bg-zinc-950 px-4 py-3 text-center sm:block">
                <div className="text-2xl font-bold text-white">87</div>

                <div className="text-[10px] uppercase tracking-wider text-zinc-400">
                  Score
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {/* Evidence */}
              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold">
                    Why this opportunity?
                  </h3>

                  <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    High confidence
                  </span>
                </div>

                <p className="text-sm leading-6 text-zinc-600">
                  Beginners are not asking for more AI tools. They are asking
                  for a clear starting point.
                </p>

                <div className="mt-5 space-y-3">
                  {exampleSignals.map((signal) => (
                    <div
                      key={signal}
                      className="rounded-lg border border-zinc-100 bg-zinc-50 p-3 text-sm text-zinc-600"
                    >
                      &ldquo;{signal}&rdquo;
                    </div>
                  ))}
                </div>
              </div>

              {/* Score */}
              <div className="rounded-xl bg-zinc-50 p-5">
                <h3 className="text-sm font-semibold">
                  Opportunity breakdown
                </h3>

                <div className="mt-5 space-y-4">
                  <ScoreRow label="Demand" value={92} />
                  <ScoreRow label="Pain intensity" value={84} />
                  <ScoreRow label="Audience relevance" value={91} />
                  <ScoreRow label="Content gap" value={78} />
                  <ScoreRow label="Actionability" value={88} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-y border-zinc-100 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
              The problem
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Stop guessing what to create.
            </h2>

            <p className="mt-5 text-lg leading-8 text-zinc-600">
              Your audience is already telling you what they need. The
              challenge is turning thousands of scattered signals into clear,
              actionable content opportunities.
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-4">
            {sourceTypes.map((item, index) => (
              <div
                key={item}
                className="rounded-2xl border border-zinc-200 bg-white p-6"
              >
                <div className="text-sm text-zinc-400">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="mt-8 text-lg font-medium">{item}</div>

                <div className="mt-2 text-sm text-zinc-500">
                  Raw audience signal
                </div>
              </div>
            ))}
          </div>

          <div className="my-8 text-center text-2xl text-zinc-300" aria-hidden="true">
            ↓
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-950 p-8 text-white sm:p-10">
            <p className="text-sm font-medium text-zinc-400">ContentPulse</p>

            <h3 className="mt-3 text-2xl font-semibold">
              Discover the problems your audience repeatedly talks about.
            </h3>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
              {analysisSteps.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-zinc-700 px-4 py-2 text-zinc-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Differentiator */}
      <section className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Evidence first
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Every opportunity comes with a reason.
          </h2>

          <p className="mt-5 text-lg leading-8 text-zinc-600">
            ContentPulse does not simply generate an idea. It shows the
            audience signals supporting the opportunity and separates
            opportunity strength from evidence confidence.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <FeatureCard
            number="01"
            title="Real audience evidence"
            description="See the actual questions, frustrations, and discussions behind each opportunity."
          />

          <FeatureCard
            number="02"
            title="Explainable scoring"
            description="Understand why an opportunity ranks highly instead of relying on a black-box recommendation."
          />

          <FeatureCard
            number="03"
            title="From insight to content"
            description="Turn a validated audience problem into platform-native content when you are ready."
          />
        </div>
      </section>

      {/* Workflow */}
      <section className="border-y border-zinc-100 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
              The workflow
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Discover → Prove → Create → Learn
            </h2>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-200 md:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="bg-white p-7">
                <span className="text-xs font-semibold tracking-wider text-zinc-400">
                  {step.number}
                </span>

                <h3 className="mt-8 text-lg font-semibold">{step.title}</h3>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-4xl px-6 py-28 text-center lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Your audience already knows
        </p>

        <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Find out what they are trying to tell you.
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-600">
          Turn scattered audience signals into evidence-backed content
          opportunities.
        </p>

        <Link
          href="/workspace"
          className="mt-9 inline-flex h-12 items-center justify-center rounded-full bg-zinc-950 px-7 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          Try ContentPulse
          <span className="ml-2" aria-hidden="true">
            →
          </span>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span>ContentPulse</span>
          <span>Audience intelligence for creators.</span>
        </div>
      </footer>
    </main>
  );
}

function ScoreRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="text-zinc-500">{label}</span>
        <span className="font-medium text-zinc-800">{value}</span>
      </div>

      <div
        className="h-1.5 overflow-hidden rounded-full bg-zinc-200"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${value}%`}
      >
        <div
          className="h-full rounded-full bg-zinc-900"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function FeatureCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-7">
      <span className="text-xs font-semibold tracking-wider text-zinc-400">
        {number}
      </span>

      <h3 className="mt-8 text-lg font-semibold">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-zinc-500">{description}</p>
    </div>
  );
}