import {
  ArrowLeft,
  Clock,
  Calendar,
  Tv,
  Award,
  Play,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

import { Container } from "@/components/shared/Container";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function isValidYouTubeUrl(url?: string): boolean {
  if (!url || typeof url !== "string" || !url.trim()) return false;
  try {
    const parsed = new URL(url.trim());
    const hostname = parsed.hostname.toLowerCase();
    return (
      hostname === "youtube.com" ||
      hostname === "www.youtube.com" ||
      hostname === "youtu.be"
    );
  } catch {
    return false;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  return {
    title: "Podcast Episode Not Found | UDBHAV FOUNDATION",
  };
}

export default async function PodcastEpisodePage({ params }: PageProps) {
  const { slug } = await params;
  
  // Real database podcast fetching would go here.
  // Since podcast data is not yet implemented in DB, we always return 404.
  notFound();

  return null;
}
