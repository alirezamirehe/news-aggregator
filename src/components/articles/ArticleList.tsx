import { Alert, Box, Pagination, Typography, Fade, Grid } from '@mui/material';
import { ArticleCard } from './ArticleCard';
import { ArticleSkeleton } from './ArticleSkeleton';
import type { Article } from '@/types/news';

interface ArticleListProps {
    articles: Article[];
    savedArticles: Set<string>;
    onSaveArticle: (article: Article) => void;
    onRemoveArticle: (articleId: string) => void;
    pagination: {
        currentPage: number;
        totalPages: number;
        onPageChange: (page: number) => void;
    };
    isLoading: boolean;
    error: Error | null;
}

export const ArticleList = ({
                                articles,
                                savedArticles,
                                onSaveArticle,
                                onRemoveArticle,
                                pagination,
                                isLoading,
                                error
                            }: ArticleListProps) => {
    return (
        <Box>

            {error && (
                <Fade in>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        Error loading articles: {error.message}
                    </Alert>
                </Fade>
            )}

            <Grid container spacing={3}>
                {isLoading ? (
                    // Shows skeletons while loading
                    Array.from(new Array(12)).map((_, index) => (
                        <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
                            <Fade in timeout={100 * (index + 1)}>
                                <Box>
                                    <ArticleSkeleton />
                                </Box>
                            </Fade>
                        </Grid>
                    ))
                ) : articles.length > 0 ? (
                    // Shows articles when available
                    articles.map((article, index) => (
                        <Grid item xs={12} sm={6} md={4} key={article.id}>
                            <Fade in timeout={100 * (index + 1)}>
                                <Box>
                                    <ArticleCard
                                        article={article}
                                        isSaved={savedArticles.has(article.id)}
                                        onSave={() => onSaveArticle(article)}
                                        onRemove={() => onRemoveArticle(article.id)}
                                    />
                                </Box>
                            </Fade>
                        </Grid>
                    ))
                ) : (
                    // Shows no results message
                    <Grid item xs={12}>
                        <Fade in>
                            <Typography variant="h6" textAlign="center" color="text.secondary">
                                No articles found
                            </Typography>
                        </Fade>
                    </Grid>
                )}
            </Grid>

            {!isLoading && articles.length > 0 && (
                <Fade in>
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                        <Pagination
                            count={pagination.totalPages}
                            page={pagination.currentPage}
                            onChange={(_, page) => pagination.onPageChange(page)}
                            color="primary"
                            size="large"
                            disabled={isLoading}
                        />
                    </Box>
                </Fade>
            )}
        </Box>
    );
};