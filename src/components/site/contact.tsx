"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  BUSINESS,
  ENQUIRY_DESTINATIONS,
  ENQUIRY_GROUP_SIZES,
  whatsappLink,
} from "@/lib/site-config";
import { track } from "@/lib/analytics";

const PHONE_RE = /^[+\d][\d\s-]{7,14}$/;

/**
 * Contact v4 — Atlas Field Journal.
 *
 * Asymmetric split: form takes 7 cols left, info takes 5 cols right.
 * Inputs are 1px hairline borders, sharp 2px radius (no shadow, no card
 * container). Submit is a text-link style arrow, not a button. Info column
 * uses caption-style metadata blocks separated by hairlines.
 */
export function Contact() {
  const { toast } = useToast();
  const [values, setValues] = useState({
    name: "",
    phone: "",
    destination: "",
    month: "",
    group: "",
    notes: "",
  });
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  function set<K extends keyof typeof values>(key: K, v: string) {
    setValues((prev) => ({ ...prev, [key]: v }));
    if (key === "name" || key === "phone") {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nextErrors: { name?: string; phone?: string } = {};
    if (!values.name.trim()) {
      nextErrors.name = "Please tell us your name.";
    }
    if (!PHONE_RE.test(values.phone.trim())) {
      nextErrors.phone = "Please enter a valid phone number.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const lines = [
      "New website enquiry",
      "",
      `Name: ${values.name.trim()}`,
      `Phone: ${values.phone.trim()}`,
      `Destination: ${values.destination || "Not sure yet"}`,
      `When: ${values.month.trim() || "Flexible"}`,
      `Travellers: ${values.group || "Not specified"}`,
    ];
    if (values.notes.trim()) {
      lines.push(`Notes: ${values.notes.trim()}`);
    }

    track("enquiry_submit", {
      form: "contact",
      destination: values.destination || "unspecified",
    });
    window.open(whatsappLink(lines.join("\n")), "_blank", "noopener");
    toast({
      title: "Opening WhatsApp…",
      description: "Your enquiry is ready to send — just hit send in WhatsApp.",
    });
  }

  return (
    <section
      id="contact"
      className="fp-plate section-y bg-[var(--paper)]"
      aria-label="Contact and enquiry"
    >
      <div className="fp-inner mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-10">
        {/* Section header — R12 mobile: numeral 56 → 44px, pb-8 → pb-6,
            intro copy 16 → 15px. The old mobile header alone measured 281px
            of a 780px plate. */}
        <div className="section-intro grid grid-cols-12 gap-x-6 gap-y-3 border-b border-[var(--ink)] pb-6 sm:gap-y-4 sm:pb-8 lg:pb-10">
          <div className="col-span-12 sm:col-span-2 lg:col-span-1 self-baseline">
            <span className="font-display text-[44px] font-light leading-[0.85] tracking-[-0.05em] text-[var(--ink)] tabular-nums sm:text-[56px] lg:text-[72px]">
              07
            </span>
          </div>
          <div className="col-span-12 sm:col-span-10 lg:col-span-7">
            <p className="eyebrow mb-3">Get in touch</p>
            <h2
              className="font-display text-display-lg text-[var(--ink)]"
              style={{ fontVariationSettings: '"opsz" 72' }}
            >
              Plan your <em className="font-display italic font-light">trip.</em>
            </h2>
            {/* R6 P2 #19: paragraph->HR gap 40px -> 32px (mt-5 = 20px was
                disproportionate vs 30px below HR). Now both at 32px.
                R12 mobile: hidden on phones — the submit caption ("Opens
                WhatsApp with your details pre-filled") already carries the
                mechanic, and the plate's job is the form, not the preamble.
                Saves a 2-line block, pulls the first input up ~70px. */}
            <p className="mt-5 hidden max-w-[58ch] text-[15px] leading-[1.55] text-[var(--ink-soft)] sm:block sm:text-[16px]">
              Fill this in and we&apos;ll carry it straight into WhatsApp —
              or call, message, or walk into our Manali office. Replies within
              two working hours, every day.
            </p>
          </div>
        </div>

        {/* Form + info — asymmetric split.
            R12 mobile: 2-col field pairs (was one long single-column stack —
            the plate measured 1517px, roughly TWO phone viewports) and a
            compact one-row info strip (the 4-block aside duplicated phone /
            email / address / hours already printed in the footer). Target:
            one scroll, submit visible within the first screen and a half. */}
        <div className="mt-5 grid grid-cols-1 gap-x-12 gap-y-6 sm:mt-6 lg:mt-8 lg:grid-cols-12">
          {/* Form — 7 cols */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleSubmit}
            noValidate
            aria-label="Trip enquiry form"
            className="lg:col-span-7"
          >
            {/* R6 P2 #19: every label uses uniform space-y-2 (8px) gap to input.
                Input heights all h-12 for visual consistency.
                R12 mobile: base grid is 2-col (name+phone, destination+when
                pair up) — six stacked rows become four. */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:gap-x-6 sm:gap-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="enq-name"
                  className="caption-ink"
                >
                  Your name <span className="text-[var(--ember)]">*</span>
                </Label>
                <Input
                  id="enq-name"
                  name="name"
                  autoComplete="name"
                  placeholder="Rahul Sharma"
                  value={values.name}
                  onChange={(e) => set("name", e.target.value)}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "enq-name-error" : undefined}
                  required
                  className="h-12 rounded-[2px] border-[var(--hairline-strong)] bg-transparent text-[16px] text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus-visible:border-[var(--ink)] focus-visible:ring-[var(--ink)]"
                />
                {errors.name && (
                  <p id="enq-name-error" className="text-[12px] font-medium text-[var(--ember)]">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="enq-phone" className="caption-ink">
                  Phone / WhatsApp <span className="text-[var(--ember)]">*</span>
                </Label>
                <Input
                  id="enq-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="98XXXXXXXX"
                  value={values.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "enq-phone-error" : undefined}
                  required
                  className="h-12 rounded-[2px] border-[var(--hairline-strong)] bg-transparent text-[16px] text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus-visible:border-[var(--ink)] focus-visible:ring-[var(--ink)]"
                />
                {errors.phone && (
                  <p id="enq-phone-error" className="text-[12px] font-medium text-[var(--ember)]">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="col-span-2 space-y-2 sm:col-span-1">
                <Label htmlFor="enq-dest" className="caption-ink">
                  Where to
                </Label>
                {/* R7 polish: VLM R6 said Select trigger was shorter than
                    text Input. Added min-h-[3rem] (48px) to match Input h-12
                    exactly + leading to keep text vertically centered.
                    R12 mobile: full-width — destination values are long
                    ("Himachal Pradesh — Manali & Spiti") and a half-width
                    select truncates them. */}
                <Select value={values.destination} onValueChange={(v) => set("destination", v)}>
                  <SelectTrigger
                    id="enq-dest"
                    className="min-h-[3rem] h-12 rounded-[2px] border-[var(--hairline-strong)] bg-transparent text-[16px] text-[var(--ink)] leading-[1.5] focus-visible:border-[var(--ink)] focus-visible:ring-[var(--ink)]"
                  >
                    <SelectValue placeholder="Pick a destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {ENQUIRY_DESTINATIONS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="enq-when" className="caption-ink">
                  When
                </Label>
                <Input
                  id="enq-when"
                  name="month"
                  placeholder="June 2026, or 'flexible'"
                  value={values.month}
                  onChange={(e) => set("month", e.target.value)}
                  className="h-12 rounded-[2px] border-[var(--hairline-strong)] bg-transparent text-[16px] text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus-visible:border-[var(--ink)] focus-visible:ring-[var(--ink)]"
                />
              </div>

            {/* R12 mobile: pairs with the When field (two short inputs,
                one row) — VLM flagged the textarea sharing a half-width
                row with this select as "visually unbalanced". sm+: full
                width, as before. */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="enq-group" className="caption-ink">
                  Who&apos;s travelling
                </Label>
                {/* R7 polish: same min-h-[3rem] fix as 'Where to' above. */}
                <Select value={values.group} onValueChange={(v) => set("group", v)}>
                  <SelectTrigger
                    id="enq-group"
                    className="min-h-[3rem] h-12 rounded-[2px] border-[var(--hairline-strong)] bg-transparent text-[16px] text-[var(--ink)] leading-[1.5] focus-visible:border-[var(--ink)] focus-visible:ring-[var(--ink)]"
                  >
                    <SelectValue placeholder="Group size" />
                  </SelectTrigger>
                  <SelectContent>
                    {ENQUIRY_GROUP_SIZES.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="enq-notes" className="caption-ink">
                  Anything else
                </Label>
                <Textarea
                  id="enq-notes"
                  name="notes"
                  rows={3}
                  placeholder="Budget range, hotel preferences, must-visit places, kids joining…"
                  value={values.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  className="rounded-[2px] border-[var(--hairline-strong)] bg-transparent text-[16px] text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus-visible:border-[var(--ink)] focus-visible:ring-[var(--ink)]"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col items-start gap-3 sm:mt-8">
              {/* R10: submit is now a solid editorial button — a form's
                  submit must look like a button (affordance). */}
              <button
                type="submit"
                className="btn-solid h-12"
              >
                Send enquiry
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </button>
              <p className="text-[12px] leading-[1.5] text-[var(--ink-soft)]">
                Opens WhatsApp with your details pre-filled — nothing is stored.
              </p>
            </div>
          </motion.form>

          {/* Info — 5 cols right.
              R12 mobile: one compact hairline row (Call · Email · Maps) —
              phone, email, address and hours all already live in the footer,
              so the four-block editorial column was pure duplication on a
              phone. lg keeps the full column, unchanged. */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 lg:pl-8"
            aria-label="Office contact details"
          >
            {/* Mobile — compact row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[var(--hairline-strong)] pt-4 lg:hidden">
              <a
                href={BUSINESS.phoneHref}
                onClick={() => track("phone_click", { location: "contact_info" })}
                className="text-[13px] font-medium text-[var(--ink)] underline decoration-[var(--hairline-strong)] underline-offset-4 transition-colors hover:text-[var(--pine)] tabular-nums"
              >
                Call {BUSINESS.phone}
              </a>
              <a
                href={`mailto:${BUSINESS.email}`}
                className="text-[13px] font-medium text-[var(--ink)] underline decoration-[var(--hairline-strong)] underline-offset-4 transition-colors hover:text-[var(--pine)]"
              >
                Email
              </a>
              <a
                href={BUSINESS.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[13px] font-medium text-[var(--ink)] underline decoration-[var(--hairline-strong)] underline-offset-4 transition-colors hover:text-[var(--pine)]"
              >
                Maps
                <ArrowRight className="h-3 w-3" aria-hidden />
              </a>
            </div>

            {/* Desktop — full editorial column */}
            <div className="hidden flex-col gap-8 lg:flex">
              <div>
                <p className="caption-ink mb-2">Call the office</p>
                <a
                  href={BUSINESS.phoneHref}
                  onClick={() => track("phone_click", { location: "contact_info" })}
                  className="group block font-display text-[24px] font-normal leading-[1.1] tracking-[-0.02em] text-[var(--ink)] transition-colors hover:text-[var(--pine)]"
                  style={{ fontVariationSettings: '"opsz" 60' }}
                >
                  {BUSINESS.phone}
                </a>
              </div>

              <hr className="hairline" />

              <div>
                <p className="caption-ink mb-2">Email</p>
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="group block font-display text-[20px] font-normal leading-[1.2] tracking-[-0.01em] text-[var(--ink)] transition-colors hover:text-[var(--pine)]"
                  style={{ fontVariationSettings: '"opsz" 60' }}
                >
                  {BUSINESS.email}
                </a>
              </div>

              <hr className="hairline" />

              <div>
                <p className="caption-ink mb-2">Visit the office</p>
                <p className="font-display text-[16px] font-normal leading-[1.5] tracking-[-0.005em] text-[var(--ink)]">
                  {BUSINESS.address}
                </p>
                <a
                  href={BUSINESS.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--ink-soft)] transition-colors hover:text-[var(--pine)]"
                >
                  Open in Maps
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden
                  />
                </a>
              </div>

              <hr className="hairline" />

              <div>
                <p className="caption-ink mb-2">Hours</p>
                <p className="font-display text-[16px] font-normal leading-[1.5] text-[var(--ink)]">
                  {BUSINESS.hours}
                </p>
                <p className="mt-1 caption">
                  On-trip support on WhatsApp every day
                </p>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
