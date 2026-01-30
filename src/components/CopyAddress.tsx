'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyAddressProps {
    address: string;
}

export function CopyAddress({ address }: CopyAddressProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const truncated = `${address.slice(0, 6)}...${address.slice(-4)}`;

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/10 transition-colors group text-left"
            title="Click to copy address"
        >
            <code className="text-xs text-white/60 bg-black/20 px-2 py-1 rounded group-hover:text-white transition-colors">
                {truncated}
            </code>
            {copied ? (
                <Check className="w-3 h-3 text-green-500" />
            ) : (
                <Copy className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
        </button>
    );
}
