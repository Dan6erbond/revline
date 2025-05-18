"use client";

import { Accordion, AccordionItem } from "@heroui/react";
import {
  Calendar,
  FileText,
  Flame,
  Lock,
  Image as LucideImage,
  Settings,
  Share2,
  Upload,
  Wrench,
} from "lucide-react";

const faqItems = [
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
    icon: <FileText className="w-5 h-5 text-primary" />,
    question: "What's the point of the DIY tier?",
    answer:
      "If you've got more than one car or you're the type to keep a PDF for every mod you buy, this tier is for you. Secure document storage and multi-car support give garage tinkerers a real edge.",
  },
  {
    key: "3",
    icon: <Flame className="w-5 h-5 text-primary" />,
    question: "I'm deep into modding—why would I need the Enthusiast tier?",
    answer:
      "Because you want more than a spreadsheet. Enthusiast mode gives you a kanban board for mod planning, lets you log dyno and drag sessions, track product ideas, and soon even document your entire build.",
  },
  {
    key: "4",
    icon: <LucideImage className="w-5 h-5 text-primary" />,
    question: "Can I share my build photos or is this just private logging?",
    answer:
      "Both. Snap and share individual photos or entire albums. Keep it private or make it public—your garage, your rules.",
  },
  {
    key: "6",
    icon: <Upload className="w-5 h-5 text-primary" />,
    question: "How can I import dyno charts into Revline 1?",
    answer:
      "You can use a plot digitizer app like PlotDigitizer to convert your dyno charts into a digital format. Check out our guide on how to do this step-by-step.",
  },
  {
    key: "7",
    icon: <Lock className="w-5 h-5 text-primary" />,
    question: "How secure is the document storage in the DIY tier?",
    answer:
      "Your documents are stored securely using S3 storage in a private bucket. Access is granted via a temporary 1-hour link, requiring authorization to ensure that only you can view your secure documents.",
  },
  {
    key: "8",
    icon: <Calendar className="w-5 h-5 text-primary" />,
    question: "Can I schedule service reminders in Revline 1?",
    answer:
      "While service reminders aren't available just yet, you can track service logs and create service schedules. Revline 1 will show you upcoming services in order of next by kilometer or next due date. Stay tuned for email and push notifications coming soon!",
  },
  {
    key: "9",
    icon: <Share2 className="w-5 h-5 text-primary" />,
    question: "Can I collaborate with others on my car projects?",
    answer:
      "Currently, Revline 1 focuses on individual use, but we are exploring features that will allow collaboration in future updates.",
  },
  {
    key: "10",
    icon: <Settings className="w-5 h-5 text-primary" />,
    question: "How do I customize the units in Revline 1?",
    answer:
      "You can easily customize your preferred units in the settings menu. Whether you prefer metric or imperial units, Revline 1 has you covered.",
  },
];

export default function FAQ() {
  return (
    <section className="container mx-auto text-content4-foreground p-6">
      <h2 className="text-3xl font-bold mb-2 text-center">
        Frequently Asked Questions
      </h2>
      <p className="text-center mb-6">
        Everything you need to know about Revline 1&apos;s tiers and features
      </p>
      <Accordion>
        {faqItems.map((item) => (
          <AccordionItem
            key={item.key}
            aria-label={item.question}
            startContent={item.icon}
            subtitle="Press to expand"
            title={item.question}
          >
            <p className="text-sm leading-relaxed">{item.answer}</p>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
