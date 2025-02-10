import { Article, SearchFilters, PaginatedResponse, NewsServiceContext, Author } from '@/types/news';
import { NewsService } from './NewsService';
import { API_ENDPOINTS } from '@/config/constants';
import { handleServiceError } from './NewsService';

interface GuardianArticle {
    id: string;
    webTitle: string;
    fields?: {
        trailText?: string;
        bodyText?: string;
        byline?: string;
        thumbnail?: string;
    };
    webPublicationDate: string;
    webUrl: string;
    sectionName: string;
}

export class GuardianService implements NewsService {
    constructor(private readonly apiKey: string) {}

    async search(filters: SearchFilters, context: NewsServiceContext): Promise<PaginatedResponse<Article>> {
        try {
            const params = this.buildSearchParams(filters);

            const response = await fetch(`${API_ENDPOINTS.GUARDIAN}/search?${params}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Guardian API Error:', data);
                throw new Error(data.response?.message || `Failed to fetch from Guardian (${response.status})`);
            }

            return {
                data: data.response.results.map((article: GuardianArticle) => this.mapArticle(article, context)),
                total: data.response.total,
                page: filters.page,
                pageSize: filters.pageSize,
                totalPages: Math.ceil(data.response.total / filters.pageSize)
            };
        } catch (error) {
            console.error('Guardian Service Error:', error);
            return handleServiceError(error, 'Guardian', filters.pageSize);
        }
    }

    private buildSearchParams(filters: SearchFilters): URLSearchParams {
        const params = new URLSearchParams({
            'api-key': this.apiKey,
            'page': filters.page.toString(),
            'page-size': filters.pageSize.toString(),
            'show-fields': 'all',
            'order-by': 'newest'
        });

        // Builds query parts
        const queryParts = [];

        // Handles regular search query
        if (filters.query) {
            queryParts.push(filters.query.trim());
        }

        // Handles author search using tag query instead of byline
        if (filters.author) {
            // Uses tag query for author search
            params.set('tag', `profile/${filters.author.toLowerCase().replace(/\s+/g, '-')}`);
        }

        // Combines query parts if there are any
        if (queryParts.length > 0) {
            params.set('q', queryParts.join(' '));
        }

        // Handle categories
        if (filters.categories?.length > 0) {
            params.set('section', filters.categories[0].toLowerCase());
        }

        return params;
    }

    async getAuthors(): Promise<Author[]> {
        try {
            const params = new URLSearchParams({
                'api-key': this.apiKey,
                'type': 'contributor',
                'show-references': 'contributor'
            });

            const response = await fetch(
                `${API_ENDPOINTS.GUARDIAN}/tags?${params}`,
                {
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.response?.message || 'Failed to fetch authors');
            }

            const data = await response.json();

            return data.response.results.map((author: Record<string, unknown>) => ({
                id: author.id as string,
                name: author.webTitle as string,
                source: 'guardian'
            }));
        } catch (error) {
            console.error('Error fetching Guardian authors:', error);
            return [];
        }
    }

    private mapArticle(article: GuardianArticle, context: NewsServiceContext): Article {
        return {
            savedAt: context.currentDateTime,
            id: `guardian-${article.id}`,
            title: article.webTitle,
            description: article.fields?.trailText || '',
            content: article.fields?.bodyText || '',
            author: article.fields?.byline || 'Unknown',
            publishedAt: article.webPublicationDate || context.currentDateTime,
            source: {
                id: 'guardian',
                name: 'The Guardian'
            },
            url: article.webUrl,
            imageUrl: article.fields?.thumbnail || '',
            category: article.sectionName?.toLowerCase() || 'general'
        };
    }
}