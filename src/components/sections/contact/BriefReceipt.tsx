"use client";

export type BriefData = {
  name: string;
  email: string;
  company: string;
  types: string[];
  building: string;
  success: string;
  budget: string;
  timing: string;
};

/** Weighted completion of the brief, 0–100. Weights sum to 100. */
export function briefProgress(d: BriefData): number {
  const weights: [boolean, number][] = [
    [d.name.trim().length > 0, 14],
    [d.email.trim().length > 0, 16],
    [d.company.trim().length > 0, 4],
    [d.types.length > 0, 14],
    [d.building.trim().length > 0, 20],
    [d.success.trim().length > 0, 12],
    [d.budget.length > 0, 12],
    [d.timing.length > 0, 8],
  ];
  return Math.round(weights.reduce((sum, [on, w]) => sum + (on ? w : 0), 0));
}

const DASH = "—"; // em dash placeholder

/** Clip long free-text to a max length, continuing with an ellipsis. */
function clip(s: string, max = 90): string {
  const t = s.trim();
  return t.length > max ? t.slice(0, max).trimEnd() + "…" : t;
}

/** Renders text one span per character so each newly-typed character runs a
 *  one-shot white→rose→white flash. Stable keys mean only new chars animate;
 *  spaces stay plain text so lines still wrap naturally. */
function Typed({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((ch, i) =>
        ch === " " ? (
          " "
        ) : (
          <span key={`${i}-${ch}`} className="char-flash">
            {ch}
          </span>
        ),
      )}
    </>
  );
}

/** Zigzag torn edge: page-coloured triangles biting into the card. */
function Zig({ edge }: { edge: "top" | "bottom" }) {
  const teeth = 16;
  const pts: string[] = [];
  // Baseline at the card's outer side; tips point inward.
  if (edge === "top") {
    pts.push("0,0");
    for (let i = 0; i < teeth; i++) {
      pts.push(`${((i + 0.5) / teeth) * 100},10`);
      pts.push(`${((i + 1) / teeth) * 100},0`);
    }
  } else {
    pts.push("0,10");
    for (let i = 0; i < teeth; i++) {
      pts.push(`${((i + 0.5) / teeth) * 100},0`);
      pts.push(`${((i + 1) / teeth) * 100},10`);
    }
  }
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 10"
      preserveAspectRatio="none"
      className={`absolute inset-x-0 z-[3] h-[14px] w-full ${
        edge === "top" ? "top-0" : "bottom-0"
      }`}
    >
      <polygon points={pts.join(" ")} fill="var(--bg)" />
    </svg>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="font-serif text-[rgba(255,221,232,0.7)]">{label}</span>
      <span
        className={`font-serif text-right ${
          value ? "text-[#fdf2f8]" : "text-[rgba(255,221,232,0.55)]"
        }`}
      >
        {value ? <Typed text={value} /> : DASH}
      </span>
    </div>
  );
}

function Block({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-serif text-[rgba(255,221,232,0.55)]">{label}</div>
      <p className="font-serif mt-1 leading-[1.5] text-[#fdf2f8]">
        {value ? <Typed text={clip(value)} /> : DASH}
      </p>
    </div>
  );
}

export function BriefReceipt({ data }: { data: BriefData }) {
  const p = briefProgress(data);
  const f = p / 100;
  const done = p >= 100;

  return (
    <div
      className="relative overflow-hidden px-8 pt-12 pb-10 md:px-9"
      style={{ background: "var(--bg)" }}
    >
      <Zig edge="top" />
      <Zig edge="bottom" />

      {/* organic pink→purple blob that rises from the bottom as the brief
          gets written (outer = rise), while an inner layer morphs/breathes
          continuously (animated, no straight waterline) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute bottom-0 left-1/2"
          style={{
            width: "165%",
            height: "112%",
            transformOrigin: "50% 100%",
            transform: `translate(-50%, ${(1 - f) * 112}%)`,
            willChange: "transform",
            transition: "transform 820ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <div
            aria-hidden
            className="animate-blobmorph absolute"
            style={{
              inset: "-5%",
              borderRadius: "46% 54% 58% 42% / 42% 46% 54% 58%",
              background:
                "linear-gradient(170deg, #E07A93 0%, #804AC1 100%)",
              filter: "blur(25px)",
              willChange: "transform, border-radius",
            }}
          />
        </div>
      </div>

      <div className="relative z-[2]">
        {/* header — both turn deep-plum once the brief is fully written */}
        <div className="flex items-baseline justify-between">
          <span
            className={`font-serif text-[1.4rem] italic transition-colors duration-500 ${
              done ? "" : "text-gradient-chrome"
            }`}
            style={done ? { color: "#1A0B22" } : undefined}
          >
            Your brief
          </span>
          <span
            className="font-serif italic transition-colors duration-500"
            style={{ color: done ? "#1A0B22" : "rgba(255,221,232,0.5)" }}
          >
            Draft
          </span>
        </div>

        {/* rows */}
        <div className="mt-10 space-y-3.5 text-[clamp(1.1rem,1.35vw,1.3rem)]">
          <Row label="From" value={data.name} />
          <Row label="Reply to" value={data.email} />
          <Row label="Company" value={data.company} />
          <Row label="Type" value={data.types.join(", ")} />
        </div>

        <div className="mt-7 space-y-6 text-[clamp(1.1rem,1.35vw,1.3rem)]">
          <Block label="Building" value={data.building} />
          <Block label="A success" value={data.success} />
        </div>

        <div className="mt-7 space-y-3.5 text-[clamp(1.1rem,1.35vw,1.3rem)]">
          <Row label="Budget" value={data.budget} />
          <Row label="Timing" value={data.timing} />
        </div>

        {/* written % */}
        <div className="mt-12 flex items-end justify-between">
          <span className="font-serif text-[rgba(255,221,232,0.7)] text-[clamp(1.1rem,1.35vw,1.3rem)]">
            Written
          </span>
          <span
            className="font-display leading-none text-[#fdf2f8] text-[clamp(3rem,6vw,4.5rem)] tabular-nums transition-all duration-500"
            style={{ textShadow: `0 0 ${f * 26}px rgba(255,220,235,${f * 0.6})` }}
          >
            {p}%
          </span>
        </div>
      </div>
    </div>
  );
}
