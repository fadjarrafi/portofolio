import { BlogPosts } from "app/components/posts";
import { FeaturedBlogPosts } from "./components/featured-posts";
import { Dithering } from "@paper-design/shaders-react";
import { Navbar } from "./components/nav";
import Footer from "./components/footer";
import { ScrollAnimate } from "./components/scroll-animate";
import { HeroWide } from "./components/hero-wide";
import { Hero } from "./components/hero";

export default function Page() {
  return (
    <>
      {/* Navbar - Fixed top left */}
      <div className="fixed top-0 left-0 z-50 p-6 opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]">
        <Navbar />
      </div>

      {/* <HeroWide /> */}
      <Hero />

      <section className="flex flex-col lg:flex-row gap-0 min-h-screen">
        {/* Left Section - Dithering Visualization */}
        <ScrollAnimate
          delay={100}
          className="lg:w-1/2 flex items-center justify-center min-h-[400px] lg:min-h-0"
        >
          <div className="w-full h-full flex items-center justify-center">
            <Dithering
              width={1280}
              height={720}
              colorBack="#181A18"
              colorFront="#00b3ff"
              shape="sphere"
              type="4x4"
              size={2}
              speed={1}
              scale={0.6}
            />
          </div>
        </ScrollAnimate>

        {/* Left Section - Portfolio Content */}
        <div className="lg:w-1/2 flex flex-col py-8 lg:py-0 lg:pr-8 m-6 pt-20 lg:pt-24">
          <ScrollAnimate delay={0}>
            <p className="mb-4 text-xs lg:text-base leading-relaxed opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
              {`I'm a full-stack developer based in Indonesia, experienced in hospitality solutions that bridge technology with human experience.`}
            </p>

            <p className="mb-4 text-xs lg:text-base leading-relaxed opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
              {`I've been building at PT. SaranaInsan MudaSelaras IPTV platforms, Android TV applications, and content management systems that serve 6+ hotel clients. I care about scalability, meaningful user interactions, and systems that work reliably under pressure.`}
            </p>
          </ScrollAnimate>
        </div>
      </section>

      <section className="flex flex-col lg:flex-row gap-0 min-h-screen">
        {/* Blog Posts Section - With scroll animations */}
        <div className="lg:w-1/2 flex flex-col px-6 py-16">
          <ScrollAnimate delay={0}>
            <h2 className="text-2xl font-semibold tracking-tighter mb-8">
              Featured Posts
            </h2>
          </ScrollAnimate>
          <ScrollAnimate delay={200}>
            <FeaturedBlogPosts />
          </ScrollAnimate>

          <ScrollAnimate delay={200}>
            <a
              href="/blog"
              className="group inline-flex items-center gap-2 mt- text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              <span>See more</span>
              <span className="inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          </ScrollAnimate>
        </div>

        {/* Right Section - Dithering Visualization */}
        <ScrollAnimate
          delay={100}
          className="lg:w-1/2 flex items-center justify-center min-h-[400px] lg:min-h-0"
        >
          <div className="w-full h-full flex items-center justify-center">
            <Dithering
              width={1280}
              height={720}
              colorBack="#181A18"
              colorFront="#56ae6c"
              shape="warp"
              type="4x4"
              size={2}
              speed={1}
              scale={0.6}
            />
          </div>
        </ScrollAnimate>
      </section>

      {/* Footer - Fixed bottom left */}
      <div className="bottom-0 left-0 z-50 p-6 opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]">
        <Footer />
      </div>
    </>
  );
}
