import { configureStore } from '@reduxjs/toolkit';
import savedArticlesReducer from './slices/savedArticlesSlice';
import { persistMiddleware } from './middleware/persistMiddleware';

export const store = configureStore({
    reducer: {
        savedArticles: savedArticlesReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(persistMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;