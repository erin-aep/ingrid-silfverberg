"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { contactPage, site, web3formsKey } from "@/lib/data";
import {
  BriefReceipt,
  briefProgress,
  type BriefData,
} from "@/components/sections/contact/BriefReceipt";

type Status = "idle" | "submitting" | "success" | "error";

const pillBase =
  "rounded-full border px-5 py-2.5 font-mono text-[0.6rem] tracking-[0.12em] uppercase transition-colors";
const pillOff =
  "border-[rgba(200,125,232,0.28)] text-muted hover:border-chrome2 hover:text-chrome2";
const pillOn = "border-chrome1 bg-[rgba(160,80,200,0.42)] text-[#fdf2f8]";

const fieldLabel =
  "font-serif text-[clamp(1.1rem,1.5vw,1.35rem)] text-text";
const inputBase =
  "mt-4 w-full border-b border-[rgba(200,125,232,0.28)] bg-transparent pb-3 font-serif text-[1.05rem] text-text outline-none transition-colors placeholder:text-[rgba(240,232,248,0.25)] focus:border-chrome1";
const helper = "font-serif mt-3 text-[0.9rem] text-muted italic";

/** Textarea whose height tracks its content, so the underline sits just
 *  below the text (no awkward gap, and it grows as the user types). */
function GrowTextarea({
  value,
  onChange,
  ...rest
}: Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "onChange"
> & {
  value: string;
  onChange: (v: string) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const resize = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };
  useEffect(resize, [value]);
  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    />
  );
}

export function BriefForm() {
  const [data, setData] = useState<BriefData>({
    name: "",
    email: "",
    company: "",
    types: [],
    building: "",
    success: "",
    budget: "",
    timing: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState<Date | null>(null);

  // live local-time readout (first fill deferred so we never setState
  // synchronously in the effect body, and to avoid a hydration mismatch)
  useEffect(() => {
    const update = () => setNow(new Date());
    const t = setTimeout(update, 50);
    const id = setInterval(update, 30_000);
    return () => {
      clearTimeout(t);
      clearInterval(id);
    };
  }, []);

  const localTime = useMemo(() => {
    if (!now) return null;
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: contactPage.timezone,
    }).format(now);
  }, [now]);

  const set = <K extends keyof BriefData>(key: K, value: BriefData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const toggleType = (t: string) =>
    setData((d) => ({
      ...d,
      types: d.types.includes(t)
        ? d.types.filter((x) => x !== t)
        : [...d.types, t],
    }));

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim());
  const canSubmit =
    data.name.trim().length > 0 &&
    emailValid &&
    data.types.length > 0 &&
    data.building.trim().length > 0 &&
    data.budget.length > 0 &&
    data.timing.length > 0;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!canSubmit) {
      setError("Please add your name, a valid email, a project type, what we're creating, a budget, and timing.");
      return;
    }
    if (!web3formsKey) {
      setError(
        "Brief delivery isn't configured yet — reach me directly at " + site.email + ".",
      );
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: web3formsKey,
          subject: `New project brief — ${data.name}`,
          from_name: data.name,
          email: data.email,
          Company: data.company || "—",
          Type: data.types.join(", ") || "—",
          Building: data.building,
          Success: data.success || "—",
          Budget: data.budget || "—",
          Timing: data.timing || "—",
          botcheck: "",
        }),
      });
      const json = await res.json();
      if (json.success) setStatus("success");
      else {
        setStatus("error");
        setError("Something went wrong sending the brief. Please try again or email me.");
      }
    } catch {
      setStatus("error");
      setError("Couldn't reach the server. Please try again or email me.");
    }
  };

  const progress = briefProgress(data);

  if (status === "success") {
    return (
      <div className="mx-auto max-w-[700px] py-24 text-center">
        <p className="font-mono text-[0.6rem] tracking-[0.2em] text-chrome2 uppercase">
          Brief sent · {progress}% written
        </p>
        <h2 className="font-display mt-5 text-gradient-hero text-[clamp(2rem,5vw,3.5rem)] leading-[1.1]">
          Got it — thank you.
        </h2>
        <p className="font-serif mt-5 text-[1.15rem] text-muted italic">
          Your brief landed in my inbox. {contactPage.responseNote}
        </p>
        <Link
          href="/"
          data-cursor="big"
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-[rgba(200,125,232,0.3)] px-7 py-3 font-mono text-[0.6rem] tracking-[0.15em] text-chrome2 uppercase transition-colors hover:border-chrome1 hover:text-chrome1"
        >
          ← Back home
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* header row: title + intro/meta */}
      <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        <h1 className="font-display text-gradient-hero text-[clamp(3.5rem,12vw,9rem)] leading-[0.95]">
          {contactPage.heading}
        </h1>
        <div className="lg:pt-6">
          <p className="font-serif text-[clamp(1rem,1.2vw,1.15rem)] leading-[1.55] text-text/90">
            {contactPage.intro}
          </p>
          <dl className="mt-9 space-y-3 text-[0.95rem]">
            <div className="flex gap-6">
              <dt className="w-28 shrink-0 font-serif text-muted">Email</dt>
              <dd>
                <a
                  href={`mailto:${site.email}`}
                  data-cursor="big"
                  className="font-serif text-text/90 transition-colors hover:text-chrome1"
                >
                  {site.email}
                </a>
              </dd>
            </div>
            <div className="flex gap-6">
              <dt className="w-28 shrink-0 font-serif text-muted">Response</dt>
              <dd className="font-serif text-text/90">{contactPage.responseNote}</dd>
            </div>
            <div className="flex gap-6">
              <dt className="w-28 shrink-0 font-serif text-muted">Local time</dt>
              <dd className="font-serif text-text/90">
                {localTime ? `${localTime} ${contactPage.timezoneLabel}` : "—"}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* form + sticky receipt */}
      <div className="mt-20 grid gap-x-16 gap-y-16 lg:grid-cols-[1.3fr_1fr] lg:items-start md:mt-28">
        <form onSubmit={onSubmit} noValidate>
          {/* name + email */}
          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2">
            <div>
              <label htmlFor="bf-name" className={fieldLabel}>
                Your name
              </label>
              <input
                id="bf-name"
                type="text"
                value={data.name}
                onChange={(e) => set("name", e.target.value)}
                className={inputBase}
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="bf-email" className={fieldLabel}>
                Email
              </label>
              <input
                id="bf-email"
                type="email"
                value={data.email}
                onChange={(e) => set("email", e.target.value)}
                className={inputBase}
                autoComplete="email"
              />
            </div>
          </div>

          {/* company */}
          <div className="mt-12">
            <label htmlFor="bf-company" className={fieldLabel}>
              Company <span className="text-muted">(optional)</span>
            </label>
            <input
              id="bf-company"
              type="text"
              value={data.company}
              onChange={(e) => set("company", e.target.value)}
              className={inputBase}
              autoComplete="organization"
            />
          </div>

          {/* project type */}
          <fieldset className="mt-14">
            <legend className={fieldLabel}>
              What kind of project?
            </legend>
            <div className="mt-5 flex flex-wrap gap-3">
              {contactPage.projectTypes.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleType(t)}
                  aria-pressed={data.types.includes(t)}
                  data-cursor="big"
                  className={`${pillBase} ${data.types.includes(t) ? pillOn : pillOff}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </fieldset>

          {/* building */}
          <div className="mt-14">
            <label htmlFor="bf-building" className={fieldLabel}>
              What are we creating?
            </label>
            <GrowTextarea
              id="bf-building"
              value={data.building}
              onChange={(v) => set("building", v)}
              className={`${inputBase} resize-none overflow-hidden`}
            />
            <p className={helper}>The product, its target market, and its journey so far.</p>
          </div>

          {/* success */}
          <div className="mt-14">
            <label htmlFor="bf-success" className={fieldLabel}>
              What would make this a success? <span className="text-muted">(optional)</span>
            </label>
            <GrowTextarea
              id="bf-success"
              value={data.success}
              onChange={(v) => set("success", v)}
              className={`${inputBase} resize-none overflow-hidden`}
            />
            <p className={helper}>The outcome you are hoping for — a feeling, a metric, a milestone.</p>
          </div>

          {/* budget */}
          <fieldset className="mt-14">
            <legend className={fieldLabel}>Rough budget</legend>
            <p className={helper}>A rough estimate is fine. It helps me define the right scope for your project.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {contactPage.budgets.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => set("budget", data.budget === b ? "" : b)}
                  aria-pressed={data.budget === b}
                  data-cursor="big"
                  className={`${pillBase} ${data.budget === b ? pillOn : pillOff}`}
                >
                  {b}
                </button>
              ))}
            </div>
          </fieldset>

          {/* timing */}
          <fieldset className="mt-14">
            <legend className={fieldLabel}>
              Timing
            </legend>
            <div className="mt-5 flex flex-wrap gap-3">
              {contactPage.timings.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set("timing", data.timing === t ? "" : t)}
                  aria-pressed={data.timing === t}
                  data-cursor="big"
                  className={`${pillBase} ${data.timing === t ? pillOn : pillOff}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </fieldset>

          {/* submit */}
          <div className="mt-16 flex flex-wrap items-center gap-6">
            <button
              type="submit"
              disabled={status === "submitting"}
              data-cursor="big"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-br from-chrome1 to-chrome2 px-10 py-4 font-display text-[1.3rem] text-bg disabled:opacity-60"
            >
              <span
                className="absolute inset-0 bg-gradient-to-br from-chrome2 to-chrome3 opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden
              />
              <span className="relative z-[1]">
                {status === "submitting" ? "Sending…" : "Send the brief →"}
              </span>
            </button>
            <p className="font-serif text-[0.85rem] text-muted">
              {contactPage.privacyNote}
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="font-mono mt-5 text-[0.75rem] tracking-[0.04em] text-pink"
            >
              {error}
            </p>
          )}
        </form>

        {/* live receipt */}
        <div className="lg:sticky lg:top-28">
          <BriefReceipt data={data} />
        </div>
      </div>
    </>
  );
}
