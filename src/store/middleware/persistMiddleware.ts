import { AnyAction, Middleware } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { isSavedArticlesAction } from '../types/actions';

interface PersistState {
    readonly currentDateTime: string;
    readonly username: string;
}

const PERSIST_STATE: PersistState = {
    currentDateTime: new Date().toISOString(),
    username: 'alirezamirehe'
} as const;

export const persistMiddleware: Middleware =
    (store) =>
        (next) =>
            (action: unknown) => {
                const result = next(action as AnyAction);

                if (isSavedArticlesAction(action as AnyAction)) {
                    try {
                        const state = store.getState() as RootState;
                        const persistData = {
                            articles: state.savedArticles.articles,
                            currentDateTime: PERSIST_STATE.currentDateTime,
                            username: PERSIST_STATE.username
                        };

                        localStorage.setItem('savedArticles', JSON.stringify(persistData));
                    } catch (error) {
                        console.error('Failed to persist state:', error);
                    }
                }

                return result;
            };