"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { MessageCircle, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { track } from "@/lib/analytics";
import {
  BUSINESS,
  BUDGET_RANGES,
  ENQUIRY_GROUP_SIZES,
  TRAVELER_TYPES,
  TRIP_DURATIONS,
  whatsappLink,
} from "@/lib/site-config";

const PHONE_RE = /^[+\d][\d\s-]{7,14}$/;

const SELECT_CLASS =
  "flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50";

/**
 * Customize My Trip form — composes a structured WhatsApp message from the
 * traveller's answers. Zero backend: opens wa.me with everything pre-filled.
 * Supports ?package=slug and ?destination=Name prefill via search params.
 */
export function CustomizeForm({
  destinationOptions,
  packages,
}: {
  destinationOptions: string[];
  packages: { slug: string; name: string; destinationName: string }[];
}) {
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const pkgSlug = searchParams.get("package");
  const destParam = searchParams.get("destination");
  const preselectedPackage = packages.find((p) => p.slug === pkgSlug);

  // Prefill destination from ?package= / ?destination= directly in the
  // initial state — no effect needed.
  const [values, setValues] = useState(() => ({
    name: "",
    phone: "",
    destination:
      preselectedPackage?.destinationName ??
      (destParam && destinationOptions.includes(destParam) ? destParam : ""),
    month: "",
    duration: "",
    group: "",
    travelerType: "",
    budget: "",
    notes: "",
  }));
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
    if (!values.name.trim()) nextErrors.name = "Please tell us your name.";
    if (!PHONE_RE.test(values.phone.trim()))
      nextErrors.phone = "Please enter a valid phone number we can reach you on.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const lines = [
      "Hi Davis Trip Holidays! I'd like to plan a custom trip.",
      "",
      `Name: ${values.name.trim()}`,
      `Phone: ${values.phone.trim()}`,
    ];
    if (preselectedPackage) lines.push(`Starting point: ${preselectedPackage.name} (${pkgSlug})`);
    if (values.destination) lines.push(`Destination: ${values.destination}`);
    if (values.month) lines.push(`Travel month: ${values.month}`);
    if (values.duration) lines.push(`Duration: ${values.duration}`);
    if (values.group) lines.push(`Group size: ${values.group}`);
    if (values.travelerType) lines.push(`Traveller type: ${values.travelerType}`);
    if (values.budget) lines.push(`Budget: ${values.budget}`);
    if (values.notes.trim()) lines.push(`Notes: ${values.notes.trim()}`);
    lines.push("", "Please share a plan. Thanks!");

    track("customize_submit", {
      form: "customize",
      destination: values.destination || "unspecified",
      ...(preselectedPackage ? { package: pkgSlug ?? "" } : {}),
    });

    window.open(whatsappLink(lines.join("\n")), "_blank", "noopener,noreferrer");
    toast({
      title: "Opening WhatsApp…",
      description: "Your trip details are pre-filled — just hit send. We aim to respond within 2 working hours.",
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {preselectedPackage && (
        <div className="rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 text-sm">
          <p className="font-semibold text-foreground">Starting point: {preselectedPackage.name}</p>
          <p className="mt-0.5 text-muted-foreground">
            We&apos;ll use this package as the base and adjust it to your answers below.
          </p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="cu-name">Your name *</Label>
          <Input
            id="cu-name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Rahul Sharma"
            aria-invalid={!!errors.name}
            required
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cu-phone">Phone / WhatsApp *</Label>
          <Input
            id="cu-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+91 98XXXXXXXX"
            aria-invalid={!!errors.phone}
            required
          />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="cu-destination">Destination</Label>
          <Select value={values.destination} onValueChange={(v) => set("destination", v)}>
            <SelectTrigger id="cu-destination" className={SELECT_CLASS}>
              <SelectValue placeholder="Where do you want to go?" />
            </SelectTrigger>
            <SelectContent>
              {destinationOptions.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cu-month">Travel month</Label>
          <Input
            id="cu-month"
            type="month"
            value={values.month}
            onChange={(e) => set("month", e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="cu-duration">Trip length</Label>
          <Select value={values.duration} onValueChange={(v) => set("duration", v)}>
            <SelectTrigger id="cu-duration" className={SELECT_CLASS}>
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              {TRIP_DURATIONS.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cu-group">Group size</Label>
          <Select value={values.group} onValueChange={(v) => set("group", v)}>
            <SelectTrigger id="cu-group" className={SELECT_CLASS}>
              <SelectValue placeholder="Who's coming?" />
            </SelectTrigger>
            <SelectContent>
              {ENQUIRY_GROUP_SIZES.map((g) => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cu-type">Traveller type</Label>
          <Select value={values.travelerType} onValueChange={(v) => set("travelerType", v)}>
            <SelectTrigger id="cu-type" className={SELECT_CLASS}>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {TRAVELER_TYPES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cu-budget">Budget per person</Label>
        <Select value={values.budget} onValueChange={(v) => set("budget", v)}>
          <SelectTrigger id="cu-budget" className={SELECT_CLASS}>
            <SelectValue placeholder="Rough budget helps us suggest the right hotels" />
          </SelectTrigger>
          <SelectContent>
            {BUDGET_RANGES.map((b) => (
              <SelectItem key={b} value={b}>{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cu-notes">Anything else? (optional)</Label>
        <Textarea
          id="cu-notes"
          rows={4}
          value={values.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Must-visit places, hotel preferences, food needs, celebrations on the trip…"
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-full bg-accent py-4 text-base font-semibold text-accent-foreground shadow-lg transition-transform hover:scale-[1.01] hover:bg-accent/90"
      >
        <Send className="mr-2 h-5 w-5" aria-hidden />
        Send my trip brief on WhatsApp
      </Button>

      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        Prefer to talk?{" "}
        <a
          href={BUSINESS.phoneHref}
          onClick={() => track("phone_click", { location: "customize_form" })}
          className="font-semibold text-primary hover:text-accent"
        >
          <Phone className="mr-1 inline h-3 w-3" aria-hidden />
          Call {BUSINESS.phone}
        </a>{" "}
        · Your details go straight to our travel experts — never to any third party.{" "}
        <MessageCircle className="ml-1 inline h-3 w-3" aria-hidden />
        We aim to respond within 2 working hours.
      </p>
    </form>
  );
}
