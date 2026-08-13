import { Metadata } from 'next';
import GalleryClient from './GalleryClient';
import galleryData from './galleryData.json';

export const metadata: Metadata = {
    title: 'Gallery | Sharkedutech',
    description: 'Explore our gallery of hospitality education and industry interactions across India.',
};

export default function GalleryPage() {
    return <GalleryClient galleryData={galleryData} />;
}
