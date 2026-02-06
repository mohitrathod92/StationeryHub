import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface ImageGalleryModalProps {
    images: string[];
    initialIndex?: number;
    productName: string;
    isOpen: boolean;
    onClose: () => void;
}

const ImageGalleryModal = ({ images, initialIndex = 0, productName, isOpen, onClose }: ImageGalleryModalProps) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex]);

    useEffect(() => {
        setImageLoaded(false);
    }, [currentIndex]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') handlePrevious();
            if (e.key === 'ArrowRight') handleNext();
        };

        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, currentIndex]);

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black animate-in fade-in duration-300"
            onClick={onClose}
        >
            {/* Top Bar with Close Button */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-5 bg-gradient-to-b from-black via-black/80 to-transparent">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">
                        {productName}
                    </h2>
                    {images.length > 1 && (
                        <div className="px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full">
                            <span className="text-sm text-white/90 font-medium">
                                {currentIndex + 1} / {images.length}
                            </span>
                        </div>
                    )}
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 h-12 w-12 rounded-full transition-all hover:scale-110"
                    onClick={onClose}
                >
                    <X className="h-6 w-6" />
                </Button>
            </div>

            {/* Main Image - Full Screen */}
            <div
                className="absolute inset-0 flex items-center justify-center p-20"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative w-full h-full flex items-center justify-center">
                    {/* Loading Spinner */}
                    {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                        </div>
                    )}

                    {/* Main Image */}
                    <img
                        src={images[currentIndex]}
                        alt={`${productName} - Image ${currentIndex + 1}`}
                        className={`max-w-full max-h-full object-contain transition-all duration-500 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                            }`}
                        onLoad={() => setImageLoaded(true)}
                    />
                </div>
            </div>

            {/* Navigation Arrows - Only show if multiple images */}
            {images.length > 1 && (
                <>
                    {/* Previous Button */}
                    <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 h-16 w-16 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border-2 border-white/30 text-white shadow-2xl transition-all hover:scale-110 active:scale-95"
                        onClick={(e) => {
                            e.stopPropagation();
                            handlePrevious();
                        }}
                    >
                        <ChevronLeft className="h-8 w-8" />
                    </Button>

                    {/* Next Button */}
                    <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 h-16 w-16 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border-2 border-white/30 text-white shadow-2xl transition-all hover:scale-110 active:scale-95"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleNext();
                        }}
                    >
                        <ChevronRight className="h-8 w-8" />
                    </Button>
                </>
            )}

            {/* Bottom Instructions */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                <p className="text-white/40 text-sm text-center drop-shadow-lg">
                    {images.length > 1 && (
                        <>
                            <kbd className="px-2.5 py-1.5 bg-white/10 rounded-md text-white/70 font-mono text-xs mr-1">←</kbd>
                            <kbd className="px-2.5 py-1.5 bg-white/10 rounded-md text-white/70 font-mono text-xs mr-3">→</kbd>
                        </>
                    )}
                    <kbd className="px-2.5 py-1.5 bg-white/10 rounded-md text-white/70 font-mono text-xs">ESC</kbd>
                    <span className="ml-2">to close</span>
                </p>
            </div>
        </div>
    );
};

export default ImageGalleryModal;
