import express from 'express';
import multer from 'multer';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Upload product image
router.post('/product-image', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Construct the URL for the uploaded image
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}`;

        res.status(200).json({
            success: true,
            data: {
                url: imageUrl,
                filename: req.file.filename
            },
            message: 'Image uploaded successfully'
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to upload image'
        });
    }
});

// Error handler for multer errors
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size too large. Maximum size is 5MB.'
            });
        }
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    next();
});

export default router;
