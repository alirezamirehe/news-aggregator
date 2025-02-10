import { Article, SearchFilters, PaginatedResponse, NewsServiceContext, Author } from '@/types/news';
import { NewsService } from './NewsService';
import { API_ENDPOINTS } from '@/config/constants';
import { handleServiceError } from './NewsService';

export class NYTimesService implements NewsService {
    constructor(private readonly apiKey: string) {}

    async search(filters: SearchFilters, context: NewsServiceContext): Promise<PaginatedResponse<Article>> {
        try {
            const isTopStories = filters.categories.length > 0;
            const { endpoint, params } = this.buildRequestParams(filters);

            const response = await fetch(`${API_ENDPOINTS.NYTIMES}${endpoint}?${params}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.fault?.faultstring || 'Failed to fetch from NY Times');
            }

            const { articles, total } = isTopStories
                ? this.handleTopStoriesResponse(data)
                : this.handleArticleSearchResponse(data);

            return {
                data: articles.map((article: any) => this.mapArticle(article, context, isTopStories)),
                total,
                page: filters.page,
                pageSize: filters.pageSize,
                totalPages: Math.ceil(total / filters.pageSize)
            };
        } catch (error) {
            return handleServiceError(error, 'NYTimes', filters.pageSize);
        }
    }

    private buildRequestParams(filters: SearchFilters): { endpoint: string; params: URLSearchParams } {
        const params = new URLSearchParams({
            'api-key': this.apiKey
        });

        if (filters.categories.length > 0) {
            const section = filters.categories[0].toLowerCase();
            return {
                endpoint: `/topstories/v2/${section}.json`,
                params
            };
        }

        // Article Search API
        params.append('page', filters.page.toString());

        // Handles query and author
        const queryParts = [];
        if (filters.query) queryParts.push(filters.query);
        if (filters.author) queryParts.push(`byline:"${filters.author.trim()}"`);

        if (queryParts.length > 0) {
            params.set('q', queryParts.join(' '));
        }

        return {
            endpoint: '/search/v2/articlesearch.json',
            params
        };
    }

    async getAuthors(): Promise<Author[]> {
        try {
            const response = await fetch(
                `${API_ENDPOINTS.NYTIMES}/search/v2/articlesearch.json?api-key=${this.apiKey}`,
                {
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );

            const data = await response.json();

            const authors = new Set<string>();
            data.response.docs?.forEach((doc: any) => {
                doc.byline?.person?.forEach((person: any) => {
                    const fullName = `${person.firstname} ${person.lastname}`.trim();
                    if (fullName) {
                        authors.add(fullName);
                    }
                });
            });

            return Array.from(authors).map(name => ({
                id: name,
                name,
                source: 'nytimes'
            }));
        } catch (error) {
            console.error('Error fetching NYTimes authors:', error);
            return [];
        }
    }

    private handleTopStoriesResponse(data: any) {
        if (!data.results || !Array.isArray(data.results)) {
            throw new Error('Invalid response format from NY Times Top Stories API');
        }

        return {
            articles: data.results,
            total: data.results.length
        };
    }

    private handleArticleSearchResponse(data: any) {
        if (!data.response?.docs) {
            throw new Error('Invalid response format from NY Times Article Search API');
        }

        return {
            articles: data.response.docs,
            total: data.response.meta.hits
        };
    }

    private mapArticle(article: any, context: NewsServiceContext, isTopStories: boolean): Article {
        const multimedia = isTopStories
            ? article.multimedia?.[0]
            : article.multimedia?.find((m: any) => m.type === 'image');

        return {
            savedAt: context.currentDateTime,
            id: `nytimes-${article.uri || article._id || Date.now()}`,
            title: isTopStories ? article.title : article.headline?.main || 'Untitled',
            description: article.abstract || '',
            content: article.lead_paragraph || article.snippet || '',
            author: article.byline?.original || 'The New York Times',
            publishedAt: article.published_date || article.pub_date || context.currentDateTime,
            source: {
                id: 'nytimes',
                name: 'The New York Times'
            },
            url: article.url || article.web_url,
            imageUrl: multimedia
                ? isTopStories
                    ? multimedia.url
                    : `https://static01.nyt.com/${multimedia.url}`
                : '',
            category: (article.section_name || article.section || 'general').toLowerCase()
        };
    }
}