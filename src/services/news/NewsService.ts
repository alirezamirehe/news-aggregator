import { Article, SearchFilters, PaginatedResponse, NewsServiceContext, Author } from '@/types/news';

export interface NewsService {
    search(filters: SearchFilters, context: NewsServiceContext): Promise<PaginatedResponse<Article>>;
    getAuthors(source: string): Promise<Author[]>;
}

export const createEmptyResponse = (pageSize: number): PaginatedResponse<Article> => ({
    data: [],
    total: 0,
    page: 1,
    pageSize,
    totalPages: 0
});

export const createEmptyAuthorsResponse = (): Author[] => [];

export const handleServiceError = (error: unknown, serviceName: string, pageSize: number): PaginatedResponse<Article> => {
    console.error(`${serviceName} Error:`, error);
    return createEmptyResponse(pageSize);
};