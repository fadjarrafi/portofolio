"use client";

import { useState, useEffect } from "react";
import { Navbar } from "app/components/nav";
import { PageWrapper } from "app/components/page-wrapper";
import { ScrollAnimate } from "app/components/scroll-animate";

interface Experience {
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  highlights?: string[];
  technologies: string[];
}

export default function WorkPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    fetch("/data/experiences.json")
      .then((res) => res.json())
      .then((data) => setExperiences(data))
      .catch((err) => console.error("Error loading experiences:", err));
  }, []);

  return (
    <>
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 z-50 p-6">
        <Navbar />
      </div>

      <PageWrapper>
        <section className="min-h-screen flex items-center justify-center py-24">
          {/* Centered Content */}
          <div className="max-w-3xl w-full px-6">
            <ScrollAnimate>
              <h1 className="font-semibold text-2xl mb-2 tracking-tighter">
                My Journey
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-12 leading-relaxed">
                A journey through my professional development as a full-stack
                developer, from internships to leading comprehensive projects in
                hospitality technology and digital marketing.
              </p>
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
                          <h2 className="text-base font-medium">
                            {exp.role} • {exp.company}
                          </h2>
                        </div>
                        <span className="text-xs text-neutral-500 dark:text-neutral-500 tabular-nums mt-1 sm:mt-0">
                          {exp.period}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 leading-relaxed">
                        {exp.description}
                      </p>

                      {/* Highlights if available */}
                      {exp.highlights && exp.highlights.length > 0 && (
                        <ul className="space-y-1.5 mb-4">
                          {exp.highlights.map((highlight, i) => (
                            <li
                              key={i}
                              className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed flex items-start"
                            >
                              <span className="text-neutral-400 dark:text-neutral-600 mr-2 mt-1 text-xs">
                                •
                              </span>
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      )}

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

            {/* Footer Section */}
            <ScrollAnimate delay={400}>
              <div className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  Interested in working together?{" "}
                  <a
                    href="#"
                    className="underline underline-offset-2 hover:text-neutral-900 dark:hover:text-neutral-100"
                  >
                    Get in touch
                  </a>
                  .
                </p>
                <div className="flex gap-4 text-sm">
                  <a
                    href="mailto:your.email@example.com"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                  >
                    ✉ Email
                  </a>
                  <a
                    href="#"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                  >
                    GitHub
                  </a>
                  <a
                    href="#"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="#"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                  >
                    Instagram
                  </a>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-8">
                  Fadjar Irfan Rafi • © 2025 • Fadjar Rafi
                </p>
              </div>
            </ScrollAnimate>
          </div>
        </section>
      </PageWrapper>
    </>
  );
}
