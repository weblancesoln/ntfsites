'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export function WithdrawMessageForm() {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/settings/withdraw-error')
            .then(res => res.json())
            .then(data => {
                setMessage(data.message ?? '');
            })
            .catch(() => setMessage(''))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/settings/withdraw-error', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            });
            if (res.ok) {
                router.refresh();
                alert('Withdraw error message updated successfully');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to update message');
            }
        } catch (e) {
            console.error(e);
            alert('An unexpected error occurred');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-muted-foreground">Withdraw Error Message</label>
            <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Error message shown when users click Withdraw"
                rows={4}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors text-sm"
            />
            <button
                onClick={handleSave}
                disabled={saving}
                className="bg-primary hover:bg-primary/80 disabled:opacity-50 text-white rounded-xl py-2 px-6 text-sm font-bold transition-all flex items-center gap-2"
            >
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Message'}
            </button>
        </div>
    );
}
