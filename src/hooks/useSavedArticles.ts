import { useCallback, useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    saveArticle as saveArticleAction,
    removeArticle as removeArticleAction,
    updateDateTime
} from '@/store/slices/savedArticlesSlice';
import type { Article } from '@/types/news';

export const useSavedArticles = () => {
    const dispatch = useAppDispatch();
    const savedArticles = useAppSelector(state => state.savedArticles.articles);
    const [isLoading, setIsLoading] = useState(true);

    // Initial load
    useEffect(() => {
        setIsLoading(true);
        dispatch(updateDateTime(new Date().toISOString()));
        setIsLoading(false);
    }, [dispatch]);

    const saveArticle = useCallback((article: Article) => {
        const articleWithTimestamp = {
            ...article,
            savedAt: new Date().toISOString()
        };
        dispatch(saveArticleAction(articleWithTimestamp));
    }, [dispatch]);

    const removeArticle = useCallback((articleId: string) => {
        dispatch(removeArticleAction(articleId));
    }, [dispatch]);

    const isArticleSaved = useCallback((articleId: string) => {
        return savedArticles.some(article => article.id === articleId);
    }, [savedArticles]);

    const getSortedSavedArticles = useCallback(() => {
        return [...savedArticles].sort((a, b) => {
            const dateA = a.savedAt ? new Date(a.savedAt).getTime() : 0;
            const dateB = b.savedAt ? new Date(b.savedAt).getTime() : 0;
            return dateB - dateA;
        });
    }, [savedArticles]);

    return {
        savedArticles: getSortedSavedArticles(),
        saveArticle,
        removeArticle,
        isArticleSaved,
        totalSaved: savedArticles.length,
        isLoading
    };
};