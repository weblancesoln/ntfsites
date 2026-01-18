'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Upload, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function CreateNFT() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [authLoading, setAuthLoading] = useState(true);

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    // File Handler
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !file) return;

        setIsSubmitting(true);
        try {
            // 1. Upload Image
            const uploadData = new FormData();
            uploadData.append('file', file);

            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: uploadData,
            });
            const { url } = await uploadRes.json();

            if (!url) throw new Error('Upload failed');

            // 2. Create NFT
            const createRes = await fetch('/api/nfts/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    imageUrl: url
                }),
            });

            if (createRes.ok) {
                router.push('/');
                router.refresh();
            } else {
                const errorData = await createRes.json();
                throw new Error(errorData.message || 'Creation failed');
            }
        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Something went wrong!');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading) {
        return (
            <div className="container py-20 flex justify-center items-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container py-20 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Login to Create</h1>
                <p className="text-muted-foreground mb-8 max-w-md">
                    You need to be logged in to mint and sell NFTs on our marketplace.
                </p>
                <Link href="/login" className="btn btn-primary px-8">
                    Log In Now
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-12 max-w-2xl">
            <h1 className="text-4xl font-bold mb-2">Create New NFT</h1>
            <p className="text-muted-foreground mb-8">Mint your masterpiece to the blockchain</p>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Image Upload */}
                <div className="glass-card p-4 rounded-2xl border border-white/10 relative overflow-hidden group">
                    <div className={`border-2 border-dashed border-white/10 rounded-xl transition-all duration-300 ${preview ? 'p-2' : 'p-12'} flex flex-col items-center justify-center text-center hover:border-primary/50 relative min-h-[300px]`}>
                        {preview ? (
                            <img src={preview} alt="Preview" className="max-h-[400px] w-full object-contain rounded-lg" />
                        ) : (
                            <>
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                                    <Upload className="w-8 h-8 text-primary" />
                                </div>
                                <p className="font-bold text-lg mb-2">Drag and drop or click</p>
                                <p className="text-sm text-muted-foreground">Supports PNG, JPG, GIF up to 10MB</p>
                            </>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Title</label>
                        <input
                            type="text"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                            placeholder="e.g. Cosmic Monkey #42"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors min-h-[120px]"
                            placeholder="Tell the story behind your masterpiece..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Price (ETH)</label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.001"
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                                placeholder="0.05"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary font-bold">ETH</div>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/80 disabled:opacity-50 text-white rounded-xl py-4 text-lg font-bold transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Minting Masterpiece...
                        </>
                    ) : (
                        'Create Digital Asset'
                    )}
                </button>
            </form>
        </div>
    );
}
