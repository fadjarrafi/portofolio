"use client";

import { useState, useEffect } from "react";
import { ScrollAnimate } from "./scroll-animate";

interface Experience {
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  highlights?: string[];
  technologies: string[];
}

export function WorkExperience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    fetch("/data/experiences.json")
      .then((res) => res.json())
      .then((data) => setExperiences(data))
      .catch((err) => console.error("Error loading experiences:", err));
  }, []);

  return (
    <section>
      <ScrollAnimate delay={0}>
        <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-6">
          Experience
        </h2>
      </ScrollAnimate>

      <div className="space-y-10">
        {experiences.map((exp, index) => (
          <ScrollAnimate key={index} delay={100 * (index + 1)}>
            <div>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 tabular-nums mb-1">
                {exp.period}
              </p>
              <h3 className="text-base font-medium mb-2">
                {exp.role}, {exp.company}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {exp.description}
              </p>
            </div>
          </ScrollAnimate>
        ))}
      </div>
    </section>
  );
}
