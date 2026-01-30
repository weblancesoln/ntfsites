'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface User {
    id: string;
    address: string | null;
}

interface BuyButtonProps {
    nftId: string;
    price: number;
    ownerAddress: string;
}

export function BuyButton({ nftId, price, ownerAddress }: BuyButtonProps) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [buying, setBuying] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                }
            } catch (err) {
                console.error('Auth check error:', err);
            } finally {
                setAuthLoading(false);
            }
        };
        checkAuth();
    }, []);

    if (authLoading) {
        return <div className="h-10 flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>;
    }

    if (!user) {
        return (
            <Link href="/login" className="btn btn-primary w-full text-center py-3 flex items-center justify-center gap-2">
                Log In to Buy
            </Link>
        );
    }

    const isOwner = user.address === ownerAddress || user.id === ownerAddress; // Support both checks

    if (isOwner) {
        return (
            <button className="w-full bg-white/5 border border-white/10 text-muted-foreground rounded-xl py-3 cursor-not-allowed flex items-center justify-center gap-2" disabled>
                <AlertCircle className="w-4 h-4" /> You own this NFT
            </button>
        );
    }

    const handleBuy = async () => {
        if (!confirm(`Buy this NFT for ${price} ETH?`)) return;

        setBuying(true);
        try {
            const res = await fetch('/api/nfts/buy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nftId }),
            });

            const data = await res.json();
            if (res.ok) {
                alert('Purchase successful!');
                router.refresh();
            } else {
                alert(data.message || 'Purchase failed');
            }
        } catch (e) {
            console.error(e);
            alert('Error processing purchase');
        } finally {
            setBuying(false);
        }
    };

    return (
        <button
            onClick={handleBuy}
            disabled={buying}
            className="w-full bg-primary hover:bg-primary/80 disabled:opacity-50 text-white rounded-xl py-3 text-lg font-bold transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
        >
            {buying ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                </>
            ) : (
                `Buy for ${price} ETH`
            )}
        </button>
    );
}
