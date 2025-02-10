import { Box, Typography, Alert } from '@mui/material';
import { ArticleList } from '@/components/articles/ArticleList';
import { useSavedArticles } from '@/hooks/useSavedArticles';
import { Suspense } from 'react';

export const SavedArticlesPage = () => {
    const { savedArticles, removeArticle, isLoading } = useSavedArticles(); // Add isLoading if not already in the hook

    const renderContent = () => {
        if (isLoading) {
            return null; // ArticleList handles loading state
        }

        if (!savedArticles.length) {
            return (
                <Alert
                    severity="info"
                    sx={{
                        mt: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    No saved articles yet. Save some articles to see them here!
                </Alert>
            );
        }

        return (
            <ArticleList
                articles={savedArticles}
                savedArticles={new Set(savedArticles.map(article => article.id))}
                onSaveArticle={() => {}}
                onRemoveArticle={removeArticle}
                pagination={{
                    currentPage: 1,
                    totalPages: 1,
                    onPageChange: () => {}
                }}
                isLoading={isLoading}
                error={null}
            />
        );
    };

    return (
        <Box sx={{ py: 3 }}>
            <Typography
                variant="h5"
                gutterBottom
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}
            >
                Saved Articles
                <Typography
                    component="span"
                    variant="body1"
                    color="text.secondary"
                    sx={{ ml: 1 }}
                >
                    ({savedArticles.length})
                </Typography>
            </Typography>

            <Suspense fallback={null}>
                {renderContent()}
            </Suspense>
        </Box>
    );
};