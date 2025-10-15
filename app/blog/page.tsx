import { BlogPosts } from "app/components/posts";
import { Warp } from "@paper-design/shaders-react";
import { ScrollAnimate } from "app/components/scroll-animate";
import { Navbar } from "app/components/nav";
import { PageWrapper } from "app/components/page-wrapper";

export const metadata = {
  title: "Blog",
  description: "Read my blog.",
};

export default function Page({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = Number(searchParams.page) || 1;

  return (
    <>
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 z-50 p-6">
        <Navbar />
      </div>

      <PageWrapper>
        <section className="flex flex-col lg:flex-row min-h-screen">
          {/* Left Section - Blog Posts */}
          <div className="lg:w-1/2 flex flex-col py-8 lg:py-0 lg:pr-8 m-6 pt-20 lg:pt-24">
            <ScrollAnimate>
              <h1 className="font-semibold text-2xl mb-8 tracking-tighter">
                My Writing
              </h1>
            </ScrollAnimate>
            <ScrollAnimate delay={100}>
              <BlogPosts page={currentPage} />
            </ScrollAnimate>
          </div>

          {/* Right Section - Warp Visualization (Fixed) */}
          <ScrollAnimate
            delay={200}
            className="lg:w-1/2 flex items-center justify-center min-h-[400px] lg:min-h-screen lg:fixed lg:right-0 lg:top-0"
          >
            <div className="w-full h-full flex items-center justify-center">
              <Warp
                width={1280}
                height={720}
                colors={["#a7e58b", "#324471", "#0b190e"]}
                proportion={0.64}
                softness={1}
                distortion={0.2}
                swirl={0.86}
                swirlIterations={7}
                shape="edge"
                shapeScale={0.6}
                speed={10}
                scale={0.9}
                rotation={160}
              />
            </div>
          </ScrollAnimate>
        </section>
      </PageWrapper>
    </>
  );
}
