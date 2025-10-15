import { Heatmap } from "@paper-design/shaders-react";
import { ScrollAnimate } from "./scroll-animate";

export function Hero() {
  return (
    <section className="flex flex-col lg:flex-row gap-0 min-h-screen">
      {/* Left Section - Portfolio Content */}
      <div className="lg:w-1/2 flex flex-col py-8 lg:py-0 lg:pr-8 m-6 pt-20 lg:pt-24">
        <h1 className="mb-8 text-2xl font-semibold tracking-tighter opacity-0 animate-[fadeInUp_0.8s_ease-out_forwards]">
          Fadjar Rafi
        </h1>
        <p className="mb-4 text-xs lg:text-base opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
          {`I'm a full-stack developer based in Indonesia, experienced in hospitality solutions that bridge technology with human experience.`}
        </p>

        {/* <p className="mb-4 text-xs lg:text-base opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
          {`I've been building at PT. SaranaInsan MudaSelaras IPTV platforms, Android TV applications, and content management systems that serve 6+ hotel clients. I care about scalability, meaningful user interactions, and systems that work reliably under pressure.`}
        </p> */}
      </div>

      {/* Right Section - Heatmap Visualization */}
      <ScrollAnimate
        delay={50}
        className="lg:w-1/2 flex items-center justify-center min-h-[400px] lg:min-h-0"
      >
        <div className="w-full h-full flex items-center justify-center">
          <Heatmap
            width={1280}
            height={720}
            image="https://shaders.paper.design/images/logos/diamond.svg"
            colors={[
              "#112069",
              "#1f3ca3",
              "#3265e7",
              "#6bd8ff",
              "#ffe77a",
              "#ff9a1f",
              "#ff4d00",
            ]}
            colorBack="#181a18"
            contour={0.5}
            angle={0}
            noise={0}
            innerGlow={0.5}
            outerGlow={0.5}
            speed={1}
            scale={0.75}
          />
        </div>
      </ScrollAnimate>
    </section>
  );
}
