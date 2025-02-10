import { Box, Skeleton } from '@mui/material';

interface ArticleSkeletonProps {
    count?: number;
}

export const ArticleSkeleton = ({ count = 12 }: ArticleSkeletonProps) => {
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 3,
                p: 2
            }}
        >
            {Array.from({ length: count }).map((_, index) => (
                <Box
                    key={index}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                    }}
                >
                    <Skeleton variant="rectangular" height={200} />
                    <Skeleton variant="text" height={32} width="80%" />
                    <Skeleton variant="text" height={20} width="60%" />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Skeleton variant="text" width={100} />
                        <Skeleton variant="circular" width={40} height={40} />
                    </Box>
                </Box>
            ))}
        </Box>
    );
};