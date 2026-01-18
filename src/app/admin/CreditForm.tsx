'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function CreditForm({ userId }: { userId: string }) {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCredit = async () => {
        if (!amount || isNaN(parseFloat(amount))) return;
        setLoading(true);
        try {
            const res = await fetch('/api/admin/credit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, amount }),
            });
            if (res.ok) {
                setAmount('');
                router.refresh();
                // Simple feedback - could be a toast in a real app
                alert('Account credited successfully');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to credit account');
            }
        } catch (e) {
            console.error(e);
            alert('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-2 items-center justify-end">
            <div className="relative">
                <input
                    type="number"
                    step="0.01"
                    className="bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-sm w-28 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all font-mono"
                    placeholder="0.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-primary/50 font-bold">ETH</span>
            </div>
            <button
                onClick={handleCredit}
                disabled={loading || !amount}
                className="bg-primary hover:bg-primary/80 text-white rounded-xl py-2 px-4 text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 whitespace-nowrap"
            >
                {loading ? '...' : 'Add Balance'}
            </button>
        </div>
    );
}

