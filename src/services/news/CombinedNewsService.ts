import { Article, SearchFilters, PaginatedResponse, NewsServiceContext, Author } from '@/types/news';
import { NewsService, createEmptyResponse, createEmptyAuthorsResponse } from './NewsService';
import { API_KEYS } from '@/config/constants';
import { NewsAPIService } from './NewsAPIService';
import { GuardianService } from './GuardianService';
import { NYTimesService } from './NYTimesService';

export class CombinedNewsService implements NewsService {
    private readonly services: Map<string, NewsService>;
    private readonly defaultSource = 'newsapi';

    constructor() {
        this.services = new Map<string, NewsService>([
            ['newsapi', new NewsAPIService(API_KEYS.NEWSAPI)],
            ['guardian', new GuardianService(API_KEYS.GUARDIAN)],
            ['nytimes', new NYTimesService(API_KEYS.NYTIMES)]
        ]);
    }

    async search(filters: SearchFilters, context: NewsServiceContext): Promise<PaginatedResponse<Article>> {
        if (filters.sources?.length > 0) {
            return this.searchSingleService(filters, context);
        }

        return this.searchSingleService({
            ...filters,
            sources: [this.defaultSource]
        }, context);
    }

    async getAuthors(source: string): Promise<Author[]> {
        const service = this.services.get(source);

        if (!service) {
            console.error(`News service '${source}' not found for getting authors`);
            return createEmptyAuthorsResponse();
        }

        try {
            return await service.getAuthors(source);
        } catch (error) {
            console.error(`Error fetching authors from ${source}:`, error);
            return createEmptyAuthorsResponse();
        }
    }

    private async searchSingleService(filters: SearchFilters, context: NewsServiceContext): Promise<PaginatedResponse<Article>> {
        const sourceId = filters.sources[0];
        const service = this.services.get(sourceId);

        if (!service) {
            console.error(`News service '${sourceId}' not found, falling back to default source`);
            const defaultService = this.services.get(this.defaultSource);
            if (!defaultService) {
                throw new Error('Default news service not found');
            }
            return defaultService.search({
                ...filters,
                sources: [this.defaultSource]
            }, context);
        }

        try {
            return await service.search(filters, context);
        } catch (error) {
            console.error(`Error fetching from ${sourceId}:`, error);
            return createEmptyResponse(filters.pageSize);
        }
    }
}