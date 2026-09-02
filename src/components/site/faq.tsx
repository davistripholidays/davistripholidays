"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { whatsappLink } from "@/lib/site-config";
import type { FaqItemData } from "@/lib/types";

/**
 * FAQ v3 — Atlas Field Journal.
 *
 * Paper-soft background. Hairline-divided list of Q&A pairs. Each item:
 * - Number (01–07) on left as small tabular numeral
 * - Question in Fraunces 400 22px
 * - Answer in Inter 400 15px with leading 1.65
 * No boxes, no shadow, no accent border.
 */
export function Faq({ faqs }: { faqs: FaqItemData[] }) {
  return (
    <section
      id="faq"
      className="fp-plate section-y bg-[var(--paper-soft)]"
      aria-label="Frequently asked questions"
    >
      <div className="fp-inner mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-10">
        {/* Section header — R12 mobile: numeral 56 → 44px, tighter pb. */}
        <div className="section-intro grid grid-cols-12 gap-x-6 gap-y-3 border-b border-[var(--ink)] pb-5 sm:gap-y-4 sm:pb-8 lg:pb-10">
          <div className="col-span-12 sm:col-span-2 lg:col-span-1 self-baseline">
            <span className="font-display text-[44px] font-light leading-[0.85] tracking-[-0.05em] text-[var(--ink)] tabular-nums sm:text-[56px] lg:text-[72px]">
              06
            </span>
          </div>
          <div className="col-span-12 sm:col-span-10 lg:col-span-7">
            <p className="eyebrow mb-3">Questions</p>
            <h2
              className="font-display text-display-lg text-[var(--ink)]"
              style={{ fontVariationSettings: '"opsz" 72' }}
            >
              Before you <em className="font-display italic font-light">ask.</em>
            </h2>
          </div>
        </div>

        {/* Accordion — R6 P2 #18: header->accordion 40/50px -> 24/32px rhythm,
            accordion row padding 24/28 -> 24/24 equal top/bottom + items-center
            flex so chevron & question baseline-align. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="mt-3 sm:mt-4 lg:mt-6"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem
                key={f.question}
                value={`faq-${i}`}
                className="grid grid-cols-[auto_1fr] items-center gap-x-4 border-0 border-b border-[var(--hairline-strong)] px-0 py-3.5 last:border-b-0 sm:gap-x-10 sm:py-5 [&[data-state=open]]:bg-transparent"
              >
                {/* Number — small, left — baseline-aligned with question */}
                <span className="caption-ink tabular-nums self-center">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Question + answer container */}
                <div className="min-w-0">
                  <AccordionTrigger className="py-0 text-left font-display text-[20px] font-normal leading-[1.2] tracking-[-0.015em] text-[var(--ink)] hover:no-underline hover:text-[var(--pine)] sm:text-[22px] [&>svg]:text-[var(--ink)] [&>svg]:h-5 [&>svg]:w-5 sm:[&>svg]:h-4 sm:[&>svg]:w-4">
                    {f.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-0 pt-4 text-[15px] leading-[1.7] text-[var(--ink-soft)] measure-wide">
                    {f.answer}
                  </AccordionContent>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* CTA below — R7 polish: VLM R6 said this CTA was typographically
            weak (12-14px, default underline). Bumped to editorial arrow-link
            style with 14px medium weight + underline + arrow translateX on
            hover. */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-5 border-t border-[var(--hairline-strong)] pt-4 sm:mt-10 sm:pt-8"
        >
          <div className="flex items-center gap-4">
            <span className="text-[14px] leading-[1.5] text-[var(--ink-soft)]">
              Still have questions?
            </span>
            <a
              href={whatsappLink(
                "Hi Davis Trip Holidays! I have a question before booking."
              )}
              className="group inline-flex items-center gap-1.5 border-b border-[var(--ink)] pb-1 text-[14px] font-medium text-[var(--ink)] transition-colors hover:border-[var(--pine)] hover:text-[var(--pine)]"
            >
              WhatsApp us
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
