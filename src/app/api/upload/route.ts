import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { v2 as cloudinary } from 'cloudinary';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

// Configure Cloudinary if credentials are available
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}

export async function POST(request: NextRequest) {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
        return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    try {
        // Priority 1: Try Vercel Blob (Production)
        if (process.env.BLOB_READ_WRITE_TOKEN) {
            try {
                const blob = await put(file.name, file, {
                    access: 'public',
                });
                return NextResponse.json({
                    success: true,
                    url: blob.url
                });
            } catch (blobError) {
                console.error('Vercel Blob upload failed, trying Cloudinary:', blobError);
                // Fall through to Cloudinary
            }
        }

        // Priority 2: Try Cloudinary (if configured)
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
            try {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                
                // Convert file to base64 for Cloudinary
                const base64 = buffer.toString('base64');
                const dataURI = `data:${file.type};base64,${base64}`;

                const result = await cloudinary.uploader.upload(dataURI, {
                    folder: 'nft-marketplace',
                    resource_type: 'auto',
                });

                return NextResponse.json({
                    success: true,
                    url: result.secure_url
                });
            } catch (cloudinaryError) {
                console.error('Cloudinary upload failed, trying local storage:', cloudinaryError);
                // Fall through to local storage
            }
        }

        // Priority 3: Fallback to local storage for local development
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
        const uploadDir = path.join(process.cwd(), 'public/uploads');

        await mkdir(uploadDir, { recursive: true });
        await writeFile(path.join(uploadDir, filename), buffer);

        return NextResponse.json({
            success: true,
            url: `/uploads/${filename}`
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ 
            success: false, 
            message: error instanceof Error ? error.message : 'Upload failed' 
        }, { status: 500 });
    }
}
