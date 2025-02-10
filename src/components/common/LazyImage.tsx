import { useState, useEffect } from 'react';
import { Box, Skeleton } from '@mui/material';

interface LazyImageProps {
    src: string | null;
    alt: string;
    height?: number | string;
    width?: number | string;
    className?: string;
}

export const LazyImage = ({
                              src,
                              alt,
                              height = 200,
                              width = '100%',
                              className
                          }: LazyImageProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!src) {
            setIsLoading(false);
            setError(true);
            return;
        }

        const img = new Image();
        img.src = src;

        img.onload = () => {
            setIsLoading(false);
            setError(false);
        };

        img.onerror = () => {
            setIsLoading(false);
            setError(true);
        };

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [src]);

    if (error || !src) {
        return (
            <Box
                sx={{
                    height,
                    width,
                    backgroundColor: 'grey.100',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'text.secondary',
                    fontSize: '0.875rem'
                }}
            >
                Image not available
            </Box>
        );
    }

    return (
        <Box sx={{ position: 'relative', height, width }}>
            {isLoading && (
                <Skeleton
                    variant="rectangular"
                    animation="wave"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1
                    }}
                />
            )}
            <img
                src={src}
                alt={alt}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: isLoading ? 0 : 1,
                    transition: 'opacity 0.3s ease-in-out'
                }}
                className={className}
                loading="lazy"
            />
        </Box>
    );
};