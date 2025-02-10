import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Article } from '@/types/news';

interface SavedArticlesState {
    articles: Article[];
    currentDateTime: string;
    username: string;
}

// Load saved articles from localStorage
const loadSavedArticles = (): SavedArticlesState => {
    try {
        const savedState = localStorage.getItem('savedArticles');
        if (savedState) {
            return JSON.parse(savedState);
        }
    } catch (error) {
        console.error('Failed to load saved articles:', error);
    }

    return {
        articles: [],
        currentDateTime: new Date().toISOString(),
        username: 'alirezamirehe'
    };
};

const savedArticlesSlice = createSlice({
    name: 'savedArticles',
    initialState: loadSavedArticles(),
    reducers: {
        saveArticle: (state, action: PayloadAction<Article>) => {
            if (!state.articles.some(article => article.id === action.payload.id)) {
                state.articles.push(action.payload);
            }
        },
        removeArticle: (state, action: PayloadAction<string>) => {
            state.articles = state.articles.filter(article => article.id !== action.payload);
        },
        updateDateTime: (state, action: PayloadAction<string>) => {
            state.currentDateTime = action.payload;
        }
    }
});

export const { saveArticle, removeArticle, updateDateTime } = savedArticlesSlice.actions;
export default savedArticlesSlice.reducer;