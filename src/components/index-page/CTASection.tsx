'use client';

import { motion } from 'framer-motion';
import { Heart, Users } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-[#111111] py-24 sm:py-32">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-[100%] h-[100%] rounded-full bg-[#172B6B]/20 blur-[120px]" />
        <div className="absolute -bottom-1/2 -right-1/2 w-[100%] h-[100%] rounded-full bg-[#3C9D23]/20 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl"
        >
          <h2 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
            Together We Can Create <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
              Lasting Change
            </span>
          </h2>
          
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-300 mb-10">
            Join our mission to empower communities, protect the environment, and build a sustainable future for Odisha. Every contribution matters.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/volunteers"
              className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-[#111111] transition-all hover:bg-gray-100 hover:scale-105 shadow-xl shadow-white/10"
            >
              <Users className="h-5 w-5" />
              Become a Volunteer
            </Link>

            <Link
              href="/donate"
              className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#3C9D23] px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-[#348a1e] hover:scale-105 shadow-xl shadow-green-900/20"
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
