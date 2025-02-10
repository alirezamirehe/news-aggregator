import { AnyAction } from '@reduxjs/toolkit';

interface SavedArticlesAction extends AnyAction {
    type: string;
    payload?: unknown;
}

export const isSavedArticlesAction = (
    action: AnyAction
): action is SavedArticlesAction => {
    return Boolean(
        action &&
        typeof action === 'object' &&
        'type' in action &&
        typeof action.type === 'string' &&
        action.type.startsWith('savedArticles/')
    );
};