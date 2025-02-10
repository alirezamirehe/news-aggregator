import { lazy, Suspense, useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useArticles } from '@/hooks/useArticles';
import type { Article, SearchFilters as SearchFiltersType } from '@/types/news';
import { NewsServiceFactory } from '@/services/news/NewsServiceFactory';
import { ErrorBoundary } from 'react-error-boundary';
import { Loading } from "@/components/common/Loading";
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { saveArticle, removeArticle, updateDateTime } from '@/store/slices/savedArticlesSlice';
import { ArticleSkeleton } from "@/components/articles/ArticleSkeleton";

const SearchFilters = lazy(() => import('@/components/search/SearchFilters').then(module => ({
    default: module.SearchFilters
})));

const ArticleList = lazy(() => import('@/components/articles/ArticleList').then(module => ({
    default: module.ArticleList
})));

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => {
    return (
        <Box sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
        }}>
            <Typography variant="h6" color="error">
                Something went wrong:
            </Typography>
            <Typography color="error">{error.message}</Typography>
            <Button onClick={resetErrorBoundary} variant="contained">
                Try again
            </Button>
        </Box>
    );
};

export const HomePage = () => {
    const dispatch = useAppDispatch();
    const savedArticles = useAppSelector(state => state.savedArticles.articles);
    const currentDateTime = useAppSelector(state => state.savedArticles.currentDateTime);
    const username = useAppSelector(state => state.savedArticles.username);

    const [filters, setFilters] = useState<SearchFiltersType>({
        query: '',
        categories: [''],
        sources: ['newsapi'],
        author: '',
        page: 1,
        pageSize: 12,
        dateFrom: undefined,
        dateTo: undefined
    });

    const queryContext = {
        currentDateTime,
        username
    };

    const newsService = NewsServiceFactory.getService();
    const {
        data,
        error,
        isLoading,
        isFetching
    } = useArticles(newsService, filters, queryContext);

    const isLoadingArticles = isLoading || isFetching;

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const formattedDate = now.toISOString().replace('T', ' ').slice(0, 19);
            dispatch(updateDateTime(formattedDate));
        }, 60000);

        return () => clearInterval(timer);
    }, [dispatch]);

    const handleSearch = (newFilters: SearchFiltersType) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
            query: newFilters.query.trim() || '',
            sources: newFilters.sources?.length ? newFilters.sources : ['newsapi'],
            author: newFilters.author || '',
            page: 1
        }));
    };

    const handlePageChange = (newPage: number) => {
        setFilters(prev => ({ ...prev, page: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSaveArticle = (article: Article) => {
        dispatch(saveArticle(article));
    };

    const handleRemoveArticle = (articleId: string) => {
        dispatch(removeArticle(articleId));
    };

    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => setFilters(filters)}
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 2, sm: 3 }
            }}>
                <Suspense fallback={<Loading />}>
                    <SearchFilters
                        onSearch={handleSearch}
                        initialFilters={filters}
                        isLoading={isLoadingArticles}
                    />

                    {isLoadingArticles ? (
                        <ArticleSkeleton count={filters.pageSize} />
                    ) : (
                        <ArticleList
                            articles={data?.data || []}
                            savedArticles={new Set(savedArticles.map(article => article.id))}
                            onSaveArticle={handleSaveArticle}
                            onRemoveArticle={handleRemoveArticle}
                            pagination={{
                                currentPage: filters.page,
                                totalPages: data?.totalPages || 1,
                                onPageChange: handlePageChange
                            }}
                            error={error instanceof Error ? error : null}
                            isLoading={false}
                        />
                    )}
                </Suspense>
            </Box>
        </ErrorBoundary>
    );
};