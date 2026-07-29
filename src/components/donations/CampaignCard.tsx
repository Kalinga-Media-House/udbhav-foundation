import { HeartHandshake } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';


interface CampaignCardProps {
  title: string;
  slug: string;
  description: string;
  raised: number;
  goal: number;
  image: string;
}

export function CampaignCard({ title, slug, description, raised, goal, image }: CampaignCardProps) {
  const progress = Math.min((raised / goal) * 100, 100);

  return (
    <Card className="group overflow-hidden rounded-2xl border-none shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl bg-white flex flex-col h-full">
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white line-clamp-1">{title}</h3>
        </div>
      </div>
      
      <CardContent className="p-6 flex-grow flex flex-col">
        <p className="text-gray-600 line-clamp-2 mb-6 text-sm flex-grow">
          {description}
        </p>

        <div className="space-y-3 mb-2 mt-auto">
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-[#3C9D23]">₹{raised.toLocaleString()} raised</span>
            <span className="text-gray-500">₹{goal.toLocaleString()}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#3C9D23] to-[#5CE038] transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-right text-xs text-gray-400 font-medium">
            {progress.toFixed(0)}% funded
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Link href={`/campaigns/${slug}`} className="w-full">
          <Button className="w-full bg-[#172B6B] hover:bg-[#101F55] text-white rounded-xl h-12 text-md font-semibold transition-all group-hover:shadow-md">
            <HeartHandshake className="w-5 h-5 mr-2" />
            Support this Cause
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
