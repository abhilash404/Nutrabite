import Image from 'next/image';
import { MoveRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 dark:bg-neutral-950 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12 md:flex-row lg:gap-20">
          
          {/* LEFT SIDE: IMAGE */}
          <div className="w-full md:w-1/2">
            <Image
              src="/assets/salad4.png"
              alt="Healthy food"
              width={600}
              height={400}
              className="w-full rounded-3xl object-contain"
              loading='eager'
            />
          </div>

          {/* RIGHT SIDE: TEXT CONTENT */}
          <div className="flex w-full flex-col space-y-6 md:w-1/2">
            
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-green-50 px-4 py-1.5 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <Sparkles className="h-4 w-4" />
              <span>Nutrition without compromise</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-5xl lg:text-6xl">
              Eat Healthy, <br />
              <span className="text-green-600 dark:text-green-500">Feel Amazing</span>
            </h1>

            <p className="max-w-lg text-lg text-neutral-600 dark:text-neutral-400">
              Personalized nutrition plans and chef-crafted meals delivered 
              straight to your door. Experience the perfect balance of 
              taste and wellness.
            </p>

            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                <Link href='/menu'>
                <button className="flex items-center justify-center gap-2 rounded-full bg-green-600 px-8 py-4 text-white hover:bg-green-700">
                Explore Menu
                <MoveRight className="h-5 w-5" />
              </button>
                </Link>
              
              <Link href='/plans'>
              <button className="rounded-full border border-neutral-200 px-8 py-4 font-medium text-neutral-900 dark:border-neutral-700 dark:text-white">
                Get Custom Plan
              </button>
              </Link>
              
            </div>

            <div className="pt-8 border-t border-neutral-100 dark:border-neutral-800">
              <p className="text-sm text-neutral-500">
                Trusted by 10,000+ healthy eaters
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}