'use client';

import { motion } from 'framer-motion';
import { Heart, Users } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-[#FAFBFC] py-24 sm:py-32 border-t border-gray-100">
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl"
        >
          <h2 className="font-heading text-4xl font-extrabold tracking-tight text-[#233A8B] sm:text-5xl mb-6">
            Together We Can Create <br className="hidden sm:block" />
            <span className="text-[#5E9F3B]">Lasting Change</span>
          </h2>
          
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600 mb-10">
            Join our mission to empower communities, protect the environment, and build a sustainable future for Odisha. Every contribution matters.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/volunteers"
              className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#233A8B] px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-[#1a2b6c] hover:-translate-y-0.5 shadow-lg shadow-[#233A8B]/20"
            >
              <Users className="h-5 w-5" />
              Become a Volunteer
            </Link>

            <Link
              href="/donate"
              className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#5E9F3B] px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-[#4a802e] hover:-translate-y-0.5 shadow-lg shadow-[#5E9F3B]/20"
            >
              <Heart className="h-5 w-5" />
              Donate Now
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
