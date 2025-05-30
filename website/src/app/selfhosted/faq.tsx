"use client";

import { Accordion, AccordionItem } from "@heroui/react";
import { FileText, Lock, Settings, Share2, Wrench } from "lucide-react";

import { JSX } from "react";

const faqItems: (
  | {
      key: string;
      icon: JSX.Element;
      questionLabel?: never;
      question: string;
      answer: string | JSX.Element;
    }
  | {
      key: string;
      icon: JSX.Element;
      questionLabel: string;
      question: JSX.Element;
      answer: string | JSX.Element;
    }
)[] = [
  {
    key: "1",
    icon: <Wrench className="w-5 h-5 text-primary" />,
    question:
      "Is the free version just a teaser, or can I actually use it long-term?",
    answer:
      "You're not being funneled into a paid tier. The free version is a fully usable toolkit for tracking your expenses, fuel-ups, service records, and odometer logs. Plenty of users never upgrade—and that's fine.",
  },
  {
    key: "2",
    icon: <Lock className="w-5 h-5 text-primary" />,
    questionLabel: "How do I generate a secure AUTH_SECRET?",
    question: (
      <>
        How do I generate a secure <code>AUTH_SECRET</code>?
      </>
    ),
    answer: (
      <>
        Use a cryptographically secure random string with at least 32
        characters. For example, run <code>openssl rand -base64 32</code> on
        your local machine to generate a strong secret.
      </>
    ),
  },
  {
    key: "3",
    icon: <FileText className="w-5 h-5 text-primary" />,
    question: "Where do I get my license key?",
    answer:
      "Your license JWT token is sent after purchase via email. This key unlocks your chosen tier for all users on your self-hosted instance.",
  },
  {
    key: "4",
    icon: <Settings className="w-5 h-5 text-primary" />,
    question: "What path should I use for config.yaml volume mount?",
    answer: (
      <>
        Replace <code>/absolute/path/to/config.yaml</code> in the backend Docker
        command with the full absolute path on your host machine where your
        config.yaml is located, e.g.,{" "}
        <code>/home/user/revline/config.yaml</code>.
      </>
    ),
  },
  {
    key: "5",
    icon: <Share2 className="w-5 h-5 text-primary" />,
    question: "Why set AUTH_TRUST_HOST to true?",
    answer: (
      <code>
        In most self-hosted setups behind proxies or load balancers, setting
        <code>AUTH_TRUST_HOST=true</code> ensures the backend correctly trusts
        forwarded host headers for authentication flows.
      </code>
    ),
  },
];

export default function FAQ() {
  return (
    <section className="container mx-auto text-content4-foreground p-6">
      <h2 className="text-3xl font-bold mb-2 text-center">
        Frequently Asked Questions
      </h2>
      <p className="text-center mb-6">
        Everything you need to know about running Revline 1 self-hosted
      </p>
      <Accordion>
        {faqItems.map((item) => (
          <AccordionItem
            key={item.key}
            aria-label={item.questionLabel ?? item.question}
            startContent={item.icon}
            subtitle="Press to expand"
            title={item.question}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {item.answer}
            </p>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
