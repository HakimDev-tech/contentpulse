import { Card } from "@/components/ui/Card";
import type { ContentAtom as ContentAtomType } from "@/lib/types";

type ContentAtomProps = {
  atom: ContentAtomType;
};

export function ContentAtom({
  atom,
}: ContentAtomProps) {
  return (
    <Card>
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Content atom
          </p>

          <h2 className="mt-2 text-xl font-semibold text-zinc-950 dark:text-white">
            {atom.coreInsight}
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Core problem
            </p>

            <p className="mt-2 text-sm leading-6 text-zinc-800 dark:text-zinc-200">
              {atom.coreProblem}
            </p>
          </div>

          <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Audience
            </p>

            <p className="mt-2 text-sm leading-6 text-zinc-800 dark:text-zinc-200">
              {atom.audience}
            </p>
          </div>

          <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Angle
            </p>

            <p className="mt-2 text-sm leading-6 text-zinc-800 dark:text-zinc-200">
              {atom.angle}
            </p>
          </div>

          <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Promise
            </p>

            <p className="mt-2 text-sm leading-6 text-zinc-800 dark:text-zinc-200">
              {atom.promise}
            </p>
          </div>
        </div>

        {atom.keyEvidence.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Key evidence
            </p>

            <ul className="mt-3 space-y-2">
              {atom.keyEvidence.map(
                (evidence, index) => (
                  <li
                    key={`${index}-${evidence}`}
                    className="flex gap-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />

                    <span>{evidence}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        )}

        <div className="grid gap-4 border-t border-zinc-200 pt-5 md:grid-cols-2 dark:border-zinc-800">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Call to action
            </p>

            <p className="mt-2 text-sm leading-6 text-zinc-800 dark:text-zinc-200">
              {atom.callToAction}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Opportunity
            </p>

            <p className="mt-2 truncate text-xs text-zinc-500 dark:text-zinc-400">
              {atom.opportunityId}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}