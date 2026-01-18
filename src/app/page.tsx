import prisma from '@/lib/prisma';
import { Hero } from '@/components/home/Hero';
import { Features } from '@/components/home/Features';
import { Trending } from '@/components/home/Trending';
import { CallToAction } from '@/components/home/CallToAction';
import { Footer } from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const nfts = await prisma.nFT.findMany({
    where: { isListed: true },
    include: { owner: true },
    orderBy: { createdAt: 'desc' },
    take: 8 // Limit to 8 trending items for the home page
  });

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
