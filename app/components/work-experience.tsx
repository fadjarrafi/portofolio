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
    <section className="my-8">
      <ScrollAnimate delay={0}>
        <h2 className="text-2xl font-semibold tracking-tighter mb-8">
          Experience
        </h2>
      </ScrollAnimate>

      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <ScrollAnimate key={index} delay={100 * (index + 1)}>
            <div className="flex gap-4 group">
              {/* Timeline Icon */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    {index + 1}
                  </span>
                </div>
                {index < experiences.length - 1 && (
                  <div className="w-px h-full bg-neutral-200 dark:bg-neutral-800 mt-2" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
                  <div>
                    <span className="text-xs text-neutral-500 dark:text-neutral-500 tabular-nums mb-2 sm:mb-3">
                      {exp.period}
                    </span>
                    <h3 className="text-base font-medium">
                      {exp.role} • {exp.company}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 leading-relaxed">
                  {exp.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1.5">
                  {exp.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </ScrollAnimate>
        ))}
      </div>
    </section>
  );
}
