import { CombinedNewsService } from './CombinedNewsService';

export class NewsServiceFactory {
    private static instance: CombinedNewsService;

    static getService(): CombinedNewsService {
        if (!this.instance) {
            this.instance = new CombinedNewsService();
        }
        return this.instance;
    }
}