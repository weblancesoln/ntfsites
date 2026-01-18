'use client';

import { useEffect, useState, useCallback } from 'react';
import { NFTCard } from '@/components/NFTCard';
import { Wallet, CheckCircle2, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';

interface UserData {
    id: string;
    username: string;
    fullName: string;
    email: string;
    address: string | null;
    walletType: string | null;
    balance: number;
    nftsOwned: { id: string; title: string; price: number | null; imageUrl: string }[];
    receivedTransactions: { id: string; type: string; amount: number; createdAt: string }[];
}

export default function Dashboard() {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [isEditingWallet, setIsEditingWallet] = useState(false);
    const [walletForm, setWalletForm] = useState({
        address: '',
        walletType: 'MetaMask'
    });

    const fetchUser = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/auth/me');
            const data = await res.json();
            if (data.user) {
                // Now fetch the full user details using their ID or address if they have one
                const detailsRes = await fetch(`/api/users/${data.user.id}`);
                const detailsData = await detailsRes.json();
                if (detailsData.success) {
                    setUser(detailsData.user);
                    setWalletForm({
                        address: detailsData.user.address || '',
                        walletType: detailsData.user.walletType || 'MetaMask'
                    });
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const handleWalletUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const res = await fetch('/api/users/wallet', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(walletForm)
            });
            const data = await res.json();
            if (data.success) {
                setUser({ ...user!, ...data.user });
                setIsEditingWallet(false);
            } else {
                alert(data.error || 'Failed to update wallet');
            }
        } catch (e) {
            console.error(e);
            alert('An error occurred');
        } finally {
            setUpdating(false);
        }
    };

    const handleFaucet = async () => {
        if (!user?.address) return;
        try {
            const res = await fetch('/api/faucet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: user.address }),
            });
            if (res.ok) {
                alert('Funds added!');
                fetchUser();
            } else {
                alert('Failed to add funds');
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );

    if (!user) return (
        <div className="container py-20 text-center">
            <h1 className="text-3xl font-bold mb-4">No Session Found</h1>
            <p className="mb-6 text-muted-foreground">Please log in to view your dashboard.</p>
            <Link href="/login" className="btn btn-primary">Login</Link>
        </div>
    );

    return (
        <div className="container py-12">
            <div className="flex flex-col lg:flex-row items-start justify-between mb-12 gap-8">
                <div className="flex-1">
                    <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, {user.fullName}</p>
                </div>

                <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-6">
                    <div className="glass-card p-6 min-w-[280px] rounded-2xl border border-white/10">
                        <p className="text-sm text-muted-foreground mb-1">Total Balance</p>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-3xl font-bold">{user?.balance?.toFixed(4) || '0.000'} ETH</span>
                            {user.address && (
                                <button onClick={handleFaucet} className="p-2 bg-primary/10 hover:bg-primary/20 rounded-lg text-primary transition-colors text-xs font-bold">
                                    + ADD FUNDS
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="glass-card p-6 min-w-[320px] rounded-2xl border border-white/10 relative overflow-hidden">
                        {!user.address || isEditingWallet ? (
                            <form onSubmit={handleWalletUpdate} className="space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium text-primary flex items-center gap-2">
                                        <Wallet className="w-4 h-4" /> Manual Wallet Link
                                    </p>
                                    {user.address && (
                                        <button
                                            type="button"
                                            onClick={() => setIsEditingWallet(false)}
                                            className="text-xs text-muted-foreground hover:text-white"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <select
                                        className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
                                        value={walletForm.walletType}
                                        onChange={(e) => setWalletForm({ ...walletForm, walletType: e.target.value })}
                                    >
                                        <option value="MetaMask">MetaMask</option>
                                        <option value="TrustWallet">TrustWallet</option>
                                        <option value="Coinbase">Coinbase</option>
                                        <option value="Phantom">Phantom</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <button
                                        type="submit"
                                        disabled={updating}
                                        className="bg-primary hover:bg-primary/80 disabled:opacity-50 text-white rounded-lg py-2 text-sm font-bold transition-all flex items-center justify-center gap-2"
                                    >
                                        {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Link Wallet'}
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter Wallet Address (0x...)"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50"
                                    value={walletForm.address}
                                    onChange={(e) => setWalletForm({ ...walletForm, address: e.target.value })}
                                    required
                                />
                            </form>
                        ) : (
                            <div className="h-full flex flex-col justify-between">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Linked Wallet ({user.walletType})</p>
                                        <p className="font-mono text-xs text-white/80 break-all max-w-[200px]">{user.address}</p>
                                    </div>
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                </div>
                                <button
                                    onClick={() => setIsEditingWallet(true)}
                                    className="mt-4 text-xs text-primary hover:text-primary/80 font-medium text-left"
                                >
                                    Change Wallet Details
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">My NFTs</h2>
                    <Link href="/create" className="btn btn-primary text-sm">Create New</Link>
                </div>

                {user?.nftsOwned?.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-[hsl(var(--border))] rounded-xl">
                        <p className="text-[hsl(var(--text-muted))]">You don&apos;t own any NFTs yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {user?.nftsOwned?.map((nft) => (
                            <NFTCard
                                key={nft.id}
                                id={nft.id}
                                title={nft.title}
                                price={nft.price}
                                imageUrl={nft.imageUrl}
                                ownerAddress={user.address || 'Manual'}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
                <div className="card overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-[hsl(var(--surface-hover))]">
                            <tr>
                                <th className="p-4 font-normal text-sm text-[hsl(var(--text-secondary))]">Type</th>
                                <th className="p-4 font-normal text-sm text-[hsl(var(--text-secondary))]">Amount</th>
                                <th className="p-4 font-normal text-sm text-[hsl(var(--text-secondary))]">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user?.receivedTransactions?.map((tx) => (
                                <tr key={tx.id} className="border-t border-[hsl(var(--border))]">
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${tx.type === 'DEPOSIT' || tx.type === 'SALE' ? 'bg-[hsl(var(--success))]/20 text-[hsl(var(--success))]' : 'bg-[hsl(var(--secondary))]/20 text-[hsl(var(--secondary))]'
                                            }`}>
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td className="p-4 font-mono">{tx.amount} ETH</td>
                                    <td className="p-4 text-sm text-[hsl(var(--text-secondary))]">
                                        {new Date(tx.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {(!user?.receivedTransactions || user.receivedTransactions.length === 0) && (
                                <tr><td colSpan={3} className="p-4 text-center text-[hsl(var(--text-muted))]">No transactions</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

