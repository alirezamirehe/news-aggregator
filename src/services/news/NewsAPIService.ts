import { Article, SearchFilters, PaginatedResponse, NewsServiceContext, Author } from '@/types/news';
import { NewsService } from './NewsService';
import { API_ENDPOINTS } from '@/config/constants';
import { handleServiceError } from './NewsService';

export class NewsAPIService implements NewsService {
    constructor(private readonly apiKey: string) {}

    async search(filters: SearchFilters, context: NewsServiceContext): Promise<PaginatedResponse<Article>> {
        try {
            // Always use top-headlines for empty search, or when category is selected
            const endpoint = (!filters.query && !filters.author) || filters.categories?.length > 0
                ? '/top-headlines'
                : '/everything';

            const params = this.buildSearchParams(filters);

            const response = await fetch(`${API_ENDPOINTS.NEWSAPI}${endpoint}?${params}`, {
                headers: {
                    'X-Api-Key': this.apiKey,
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch from NewsAPI');
            }

            return {
                data: data.articles.map((article: any) => this.mapArticle(article, context)),
                total: data.totalResults,
                page: filters.page,
                pageSize: filters.pageSize,
                totalPages: Math.ceil(data.totalResults / filters.pageSize)
            };
        } catch (error) {
            return handleServiceError(error, 'NewsAPI', filters.pageSize);
        }
    }

    private buildSearchParams(filters: SearchFilters): URLSearchParams {
        const params = new URLSearchParams({
            apiKey: this.apiKey,
            page: filters.page.toString(),
            pageSize: filters.pageSize.toString(),
            language: 'en'
        });

        // Handles query and author
        const queryParts = [];
        if (filters.query) queryParts.push(filters.query);
        if (filters.author) queryParts.push(`author:"${filters.author.trim()}"`);

        if (queryParts.length > 0) {
            params.set('q', queryParts.join(' '));
        }

        // Adds category parameter for top-headlines
        if (filters.categories?.length > 0 && filters.categories[0] !== '') {
            params.set('category', filters.categories[0].toLowerCase());
        }

        return params;
    }


    async getAuthors(): Promise<Author[]> {
        try {
            const response = await fetch(
                `${API_ENDPOINTS.NEWSAPI}/top-headlines?pageSize=100&language=en`,
                {
                    headers: {
                        'X-Api-Key': this.apiKey,
                        'Accept': 'application/json'
                    }
                }
            );

            const data = await response.json();

            // Extracts unique authors
            const authors = new Set<string>();
            data.articles?.forEach((article: any) => {
                if (article.author) {
                    authors.add(article.author);
                }
            });

            return Array.from(authors).map(name => ({
                id: name,
                name,
                source: 'newsapi'
            }));
        } catch (error) {
            console.error('Error fetching NewsAPI authors:', error);
            return [];
        }
    }

    private mapArticle(article: any, context: NewsServiceContext): Article {
        return {
            savedAt: context.currentDateTime,
            id: `newsapi-${article.url}`,
            title: article.title || 'Untitled',
            description: article.description || '',
            content: article.content || '',
            author: article.author || 'Unknown',
            publishedAt: article.publishedAt || context.currentDateTime,
            source: {
                id: 'newsapi',
                name: article.source?.name || 'NewsAPI'
            },
            url: article.url,
            imageUrl: article.urlToImage || null,
            category: article.category || 'general'
        };
    }
}