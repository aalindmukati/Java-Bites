import { UtensilsCrossed } from "lucide-react";

function HeroGeometric({
  badge = "Java Bites",
  title1 = "SRM's Food Court",
  title2 = "Every stall. Every menu.",
  title3 = "No guesswork",
  subtitle = "The SRM food court — finally in one place.",
}: {
  badge?: string;
  title1?: string;
  title2?: string;
  title3?: string;
  subtitle?: string;
}) {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto grid min-h-[430px] max-w-6xl items-end gap-10 px-5 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-24 md:grid-cols-[1.15fr_0.85fr] md:items-center md:py-24">
        <div className="max-w-3xl">
          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <UtensilsCrossed className="h-4 w-4 text-primary" strokeWidth={1.5} />
            <span>{badge}</span>
          </div>
          <h1 className="max-w-2xl text-4xl font-medium leading-[1.06] tracking-[-0.025em] text-foreground sm:text-5xl md:text-6xl">
            {title1}
            <span className="block text-primary">{title2}</span>
            <span className="block">{title3}</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
            {subtitle}
          </p>
        </div>

        <div className="relative hidden min-h-72 overflow-hidden rounded-2xl border border-border bg-card p-6 md:block">
          <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
          <div className="flex h-full flex-col justify-between">
            <p className="max-w-48 text-sm leading-6 text-muted-foreground">
              Find what you want before you join the queue
            </p>
            <div className="border-t border-border pt-5">
              <p className="text-xs text-muted-foreground">Built for the SRM food court</p>
              <div className="mt-3 flex gap-2">
                <span className="h-2 w-16 rounded-full bg-primary" />
                <span className="h-2 w-9 rounded-full bg-secondary" />
                <span className="h-2 w-12 rounded-full bg-secondary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { HeroGeometric };
