'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import React, { useRef, useState, useEffect } from 'react';

function AnimatedCounter({ value, duration = 1.8 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, margin: '-50px' });
  const prefersReducedMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setCount(value);
      return;
    }

    if (inView) {
      let startTime: number | null = null;
      let animationFrame: number;
      
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        // easeOutQuart
        const easeOut = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOut * value));
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };
      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    } else {
      setCount(0);
    }
  }, [inView, value, duration, prefersReducedMotion]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

const IMPACT_STATS = [
  { label: 'Saplings Planted', value: 1000, suffix: '+' },
  { label: 'Students Supported', value: 500, suffix: '+' },
  { label: 'Districts Reached', value: 20, suffix: '+' },
  { label: 'Active Volunteers', value: 50, suffix: '+' },
];

export function CollectiveImpactSection() {
  return (
    <section id="collective-impact" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none text-center">
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 sm:gap-y-16 lg:gap-y-0 lg:divide-x lg:divide-gray-200/60 w-full max-w-full">
            {IMPACT_STATS.map((stat, idx) => (
              <motion.div 
                key={stat.label} 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: 'easeOut' }}
                className="flex flex-col items-center justify-center min-w-0 px-4 sm:px-6"
              >
                <dd className="order-first font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#5E9F3B] mb-2 sm:mb-4 whitespace-nowrap">
                  <AnimatedCounter value={stat.value} />
                  {stat.suffix}
                </dd>
                <dt className="text-xs sm:text-sm font-medium leading-tight text-[#233A8B]/70 uppercase tracking-[0.1em] sm:tracking-[0.15em] text-center w-full">
                  {stat.label.split(' ').map((word, i, arr) => (
                    <React.Fragment key={i}>
                      {word}
                      {i !== arr.length - 1 && <br className="block sm:hidden" />}
                      {i !== arr.length - 1 && <span className="hidden sm:inline"> </span>}
                    </React.Fragment>
                  ))}
                </dt>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
