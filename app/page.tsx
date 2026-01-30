import { FeaturedBlogPosts } from "./components/featured-posts";
import { FeaturedCaseStudies } from "./components/featured-case-studies";
import { Navbar } from "./components/nav";
import { ScrollAnimate } from "./components/scroll-animate";
import { WorkExperience } from "./components/work-experience";

function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Page() {
  return (
    <>
      <section>
        <Navbar />

        <ScrollAnimate delay={0}>
          <h1 className="mb-4 text-2xl font-semibold tracking-tighter opacity-0 animate-[fadeInUp_0.8s_ease-out_forwards]">
            Fadjar Rafi
          </h1>
          <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
            Full-stack developer building systems where technology meets people—content management, e-learning, and tools that make work feel lighter.
          </p>
          <div className="flex gap-4 text-sm text-neutral-500 dark:text-neutral-400 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.3s_forwards]">
            <a
              className="flex items-center gap-1 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
              href="https://github.com/fadjarrafi"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ArrowIcon />
              github
            </a>
            <a
              className="flex items-center gap-1 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
              href="https://www.linkedin.com/in/fadjar-irfan-rafi"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ArrowIcon />
              linkedin
            </a>
          </div>
        </ScrollAnimate>

        <ScrollAnimate delay={200}>
          <div className="mt-16">
            <WorkExperience />
          </div>
        </ScrollAnimate>

        <ScrollAnimate delay={200}>
          <div className="mt-16">
            <FeaturedCaseStudies />
          </div>
        </ScrollAnimate>

        <ScrollAnimate delay={200}>
          <div className="mt-16">
            <FeaturedBlogPosts />
          </div>
        </ScrollAnimate>

        <div className="mt-16 mb-16" />
      </section>
    </>
  );
}
