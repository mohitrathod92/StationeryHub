import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/services/api';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    disabled?: boolean;
}

export default function ImageUpload({ value, onChange, disabled = false }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadImage = async (file: File) => {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Invalid file type. Only JPG, PNG, WebP, and GIF are allowed.');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size too large. Maximum size is 5MB.');
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await api.post('/upload/product-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                onChange(response.data.data.url);
                toast.success('Image uploaded successfully!');
            } else {
                toast.error(response.data.message || 'Upload failed');
            }
        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.message || 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleDrag = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (disabled || uploading) return;

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            uploadImage(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            uploadImage(e.target.files[0]);
        }
    };

    const handleRemove = () => {
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-3">
            {/* Upload Zone */}
            {!value && (
                <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-all
            ${dragActive
                            ? 'border-primary bg-primary/5 scale-[1.02]'
                            : 'border-border hover:border-primary/50 hover:bg-muted/30'
                        }
            ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
                    onClick={!disabled && !uploading ? handleBrowseClick : undefined}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        onChange={handleFileChange}
                        disabled={disabled || uploading}
                        className="hidden"
                    />

                    <div className="flex flex-col items-center gap-3">
                        {uploading ? (
                            <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                                <Upload className="w-8 h-8 text-primary" />
                            </div>
                        )}

                        <div>
                            <p className="text-base font-semibold text-foreground mb-1">
                                {uploading ? 'Uploading...' : dragActive ? 'Drop image here' : 'Upload Product Image'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {!uploading && 'Click to browse or drag & drop'}
                            </p>
                        </div>

                        {!uploading && (
                            <p className="text-xs text-muted-foreground">
                                JPG, PNG, WebP, GIF (max 5MB)
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Image Preview */}
            {value && !uploading && (
                <div className="relative border border-border rounded-lg overflow-hidden bg-muted">
                    <div className="aspect-video w-full flex items-center justify-center p-4">
                        <img
                            src={value}
                            alt="Product preview"
                            className="max-h-full max-w-full object-contain rounded"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                        {/* Fallback icon if image fails to load */}
                        <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ display: 'none' }}
                        >
                            <ImageIcon className="w-16 h-16 text-muted-foreground" />
                        </div>
                    </div>

                    {/* Remove Button */}
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={handleRemove}
                        disabled={disabled}
                    >
                        <X className="w-4 h-4" />
                    </Button>

                    {/* Change Image Button */}
                    <div className="p-3 border-t border-border bg-background/50">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={handleBrowseClick}
                            disabled={disabled}
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Change Image
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                            onChange={handleFileChange}
                            disabled={disabled}
                            className="hidden"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
