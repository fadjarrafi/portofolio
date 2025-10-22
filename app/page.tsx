import { BlogPosts } from "app/components/posts";
import { FeaturedBlogPosts } from "./components/featured-posts";
import { Dithering } from "@paper-design/shaders-react";
import { Navbar } from "./components/nav";
import Footer from "./components/footer";
import { ScrollAnimate } from "./components/scroll-animate";
import { HeroWide } from "./components/hero-wide";
import { Hero } from "./components/hero";
import { WorkExperience } from "./components/work-experience";

export default function Page() {
  return (
    <>
      <section>
        <Navbar />

        <ScrollAnimate delay={0}>
          <h1 className="mb-8 text-2xl font-semibold tracking-tighter opacity-0 animate-[fadeInUp_0.8s_ease-out_forwards]">
            Fadjar Rafi
          </h1>
          <p className="mb-4 text-xs lg:text-base opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
            {`I'm a full-stack developer based in Indonesia, experienced in hospitality solutions that bridge technology with human experience.`}
          </p>
        </ScrollAnimate>

        <ScrollAnimate delay={200}>
          <div className="my-8">
            <WorkExperience />
          </div>
        </ScrollAnimate>

        <ScrollAnimate delay={200}>
          <div className="my-8">
            <FeaturedBlogPosts />
          </div>
        </ScrollAnimate>

        <ScrollAnimate delay={300}>
          <Footer />
        </ScrollAnimate>
      </section>
    </>
  );
}
