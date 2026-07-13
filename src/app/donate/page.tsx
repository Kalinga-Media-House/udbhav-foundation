import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { DonateDemoForm } from "@/components/donate/DonateDemoForm";
import { CheckCircle2, HeartHandshake, Leaf, Users, BrainCircuit } from "lucide-react";

export const metadata: Metadata = {
  title: "Support Our Mission | UDBHAV FOUNDATION",
  description: "Support UDBHAV Foundation's community initiatives across Odisha through transparent contributions.",
};

export default function DonatePage() {
  return (
    <main className="min-h-screen bg-[#FCFCF8]">
      {/* DONATION HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#172B6B] via-[#101F55] to-[#12245F] text-white pt-16 pb-24 sm:pt-20 sm:pb-32 lg:pt-24 lg:pb-36">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#3C9D23]/10 blur-[100px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white/5 blur-[80px]" />
        </div>

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-heading font-bold tracking-wider uppercase mb-6">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>SUPPORT A PURPOSE</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold leading-[1.15] mb-6">
                Your Support Can Create <br />
                <span className="text-[#3C9D23]">Lasting Change.</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-white/80 leading-relaxed mb-8 max-w-xl">
                Every contribution helps UDBHAV Foundation expand access to education, strengthen community well-being, support environmental action, empower young changemakers, and build a more inclusive future.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                <div className="flex items-center gap-2.5 text-white/90">
                  <CheckCircle2 className="w-5 h-5 text-[#3C9D23]" />
                  <span className="font-medium">Secure Online Contribution</span>
                </div>
                <div className="flex items-center gap-2.5 text-white/90">
                  <CheckCircle2 className="w-5 h-5 text-[#3C9D23]" />
                  <span className="font-medium">Transparent Community Impact</span>
                </div>
              </div>
            </div>

            {/* Right Photo Collage */}
            <div className="relative h-[400px] sm:h-[500px] w-full hidden md:block">
              {/* Main large image */}
              <div className="absolute right-0 top-0 w-3/4 h-[85%] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 rotate-1 hover:rotate-0 transition-transform duration-500">
                <Image 
                  src="/hero/hero-02.png" 
                  alt="UDBHAV Foundation Community Impact" 
                  fill 
                  className="object-cover"
                />
              </div>
              {/* Smaller image 1 */}
              <div className="absolute left-0 bottom-4 w-1/2 h-[45%] rounded-3xl overflow-hidden shadow-xl border-4 border-white/10 -rotate-3 hover:-rotate-1 transition-transform duration-500 z-10">
                <Image 
                  src="/hero/hero-08.png" 
                  alt="UDBHAV Foundation Youth Empowerment" 
                  fill 
                  className="object-cover"
                />
              </div>
              {/* Smaller image 2 */}
              <div className="absolute right-[65%] top-8 w-[40%] h-[40%] rounded-3xl overflow-hidden shadow-xl border-4 border-white/10 -rotate-6 hover:-rotate-3 transition-transform duration-500 z-20">
                <Image 
                  src="/hero/hero-01.png" 
                  alt="UDBHAV Foundation Environmental Action" 
                  fill 
                  className="object-cover"
                />
              </div>
            </div>

            {/* Mobile simplified image */}
            <div className="relative h-[300px] w-full md:hidden rounded-3xl overflow-hidden shadow-xl border-2 border-white/10">
              <Image 
                src="/hero/hero-02.png" 
                alt="UDBHAV Foundation Community Impact" 
                fill 
                className="object-cover"
              />
            </div>
            
          </div>
        </Container>
      </section>

      {/* DONATION FORM & IMPACT SECTION */}
      <section className="relative z-20 -mt-10 sm:-mt-16 pb-20 sm:pb-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Form Column */}
            <div className="lg:col-span-7 xl:col-span-6 lg:col-start-6 xl:col-start-7 row-start-1 lg:row-start-auto">
              <DonateDemoForm />
            </div>

            {/* Information Column */}
            <div className="lg:col-span-5 xl:col-span-5 lg:col-start-1 row-start-2 lg:row-start-1 lg:pt-16">
              
              <div className="mb-12">
                <h3 className="text-sm font-bold text-[#3C9D23] tracking-widest uppercase mb-3">
                  Your Trust Matters
                </h3>
                <h2 className="text-3xl font-heading font-bold text-[#172B6B] mb-6">
                  Where Your Support Creates Impact
                </h2>
                <p className="text-gray-600 leading-relaxed mb-8">
                  UDBHAV Foundation is committed to responsible, transparent, and purpose-driven use of every contribution. We channel your support directly into active grassroots initiatives.
                </p>

                <div className="space-y-6">
                  {/* Impact Cards */}
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <Users className="w-6 h-6 text-udbhav-blue" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-udbhav-blue-deep mb-1">Education & Mentorship</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">Providing free coaching, scholarships, and career guidance to deserving students from rural and underprivileged backgrounds.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                      <Leaf className="w-6 h-6 text-[#3C9D23]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-udbhav-blue-deep mb-1">Environmental Responsibility</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">Organizing massive plantation drives and ecological awareness campaigns to create a sustainable and greener future.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                      <BrainCircuit className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-udbhav-blue-deep mb-1">Mental Well-being</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">Normalizing mental health conversations and providing psychological support initiatives for youth and local communities.</p>
                    </div>
                  </div>
                  
                </div>
              </div>

              {/* Transparency Panel */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                <h4 className="font-heading font-bold text-udbhav-blue mb-4">Our Commitment</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-[#3C9D23] shrink-0" />
                    <span>Secure processing and data protection</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-[#3C9D23] shrink-0" />
                    <span>Transparent contribution records</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-[#3C9D23] shrink-0" />
                    <span>Responsible use of funds</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-[#3C9D23] shrink-0" />
                    <span>Verified payment acknowledgements</span>
                  </li>
                </ul>
              </div>

            </div>

          </div>
        </Container>
      </section>
    </main>
  );
}
