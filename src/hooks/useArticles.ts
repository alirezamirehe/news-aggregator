import { useQuery } from '@tanstack/react-query';
import type { Article, SearchFilters, PaginatedResponse, NewsServiceContext } from '@/types/news';
import type { NewsService } from '@/services/news/NewsService';

export const useArticles = (
    newsService: NewsService,
    filters: SearchFilters,
    context: NewsServiceContext
) => {
    return useQuery<PaginatedResponse<Article>, Error>({
        queryKey: ['articles', filters, filters.sources],
        queryFn: () => newsService.search(filters, context),
        staleTime: 60000,
        placeholderData: (previousData) => previousData,
        enabled: Boolean(newsService && filters),
        retry: 1,
    });
};