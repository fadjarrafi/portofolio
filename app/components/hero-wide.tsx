import { GrainGradient } from "@paper-design/shaders-react";

export function HeroWide() {
  return (
    <section className="w-full relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* GrainGradient Background - positioned behind content */}
      <div className="absolute inset-0 w-full h-full -z-10">
        <GrainGradient
          width={1920}
          height={1080}
          colors={["#7300ff", "#eba8ff", "#00bfff", "#2b00ff"]}
          colorBack="#000000"
          softness={0.5}
          intensity={0.5}
          noise={0.25}
          shape="corners"
          speed={1}
        />
      </div>

      {/* Centered Text Content */}
      <div className="relative z-10 flex items-center justify-center w-full px-6">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white text-center opacity-0 animate-[fadeInUp_0.8s_ease-out_forwards]">
          Your Heading Text Here
        </h1>
      </div>
    </section>
  );
}
