export interface Article {
    savedAt: string;
    id: string;
    title: string;
    description: string;
    content: string;
    author: string;
    publishedAt: string;
    source: {
        id: string;
        name: string;
    };
    url: string;
    imageUrl: string | null;
    category: string;
}

export interface SearchFilters {
    query: string;
    categories: string[];
    sources: string[];
    author?: string | null;
    page: number;
    pageSize: number;
    dateFrom?: string;
    dateTo?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface NewsServiceContext {
    currentDateTime: string;
    username: string;
}

export interface Author {
    id: string;
    name: string;
    source: string;
}