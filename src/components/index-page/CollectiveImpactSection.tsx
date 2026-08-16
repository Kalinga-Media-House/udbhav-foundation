'use client';

import { motion, useInView } from 'framer-motion';
import React, { useRef, useState, useEffect } from 'react';

function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (inView) {
      let startTime: number | null = null;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(easeOut * value));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [inView, value, duration]);

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
    <section id="collective-impact" className="bg-white pb-16 pt-8 sm:pb-24 sm:pt-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none text-center">
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 w-full max-w-full">
            {IMPACT_STATS.map((stat, idx) => (
              <motion.div 
                key={stat.label} 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col items-center justify-center rounded-xl sm:rounded-2xl lg:rounded-[2rem] bg-[#FAFBFC] p-4 sm:p-6 lg:p-10 border border-gray-100 shadow-sm min-w-0"
              >
                <dt className="text-xs sm:text-sm font-semibold leading-tight sm:leading-6 text-[#233A8B]/70 uppercase tracking-tight sm:tracking-wider text-center mt-1 sm:mt-0 break-words w-full px-2 sm:px-0">
                  {stat.label.split(' ').map((word, i, arr) => (
                    <React.Fragment key={i}>
                      {word}
                      {i !== arr.length - 1 && <br className="block sm:hidden" />}
                      {i !== arr.length - 1 && <span className="hidden sm:inline"> </span>}
                    </React.Fragment>
                  ))}
                </dt>
                <dd className="order-first font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#5E9F3B] mb-1 sm:mb-3 whitespace-nowrap">
                  <AnimatedCounter value={stat.value} />
                  {stat.suffix}
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
