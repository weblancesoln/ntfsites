import prisma from '@/lib/prisma';
import { Hero } from '@/components/home/Hero';
import { Features } from '@/components/home/Features';
import { Trending } from '@/components/home/Trending';
import { CallToAction } from '@/components/home/CallToAction';
import { Footer } from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let nfts = [];
  try {
    nfts = await prisma.nFT.findMany({
      where: { isListed: true },
      include: { owner: true },
      orderBy: { createdAt: 'desc' },
      take: 8
    });
  } catch (error) {
    console.error('Home page data fetch error:', error);
    // Fallback to empty list so the page still renders with mock data
    nfts = [];
  }

  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <Trending nfts={nfts} />
      <CallToAction />
      <Footer />
    </main>
  );
}
