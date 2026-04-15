import http from '../constants/httpServices';


function authConfig(token, extraConfig = {}) {
    return {
        ...extraConfig,
        headers: {
            ...(extraConfig.headers || {}),
            Authorization: `Bearer ${token}`,
        },
    };
}


export function login(user) {
    return http.post('auth/jwt/create/', user);
}

export function register(user) {
    return http.post('auth/users/', user);
}

export function getArticles() {
    return http.get(`articles/`);
}

export function getArticle(id) {
    return http.get(`articles/${id}/`);
}

export function createArticle(articleData, token) {
    return http.post('articles/', articleData, authConfig(token));
}

export function getTypes() {
    return http.get('types/');
}

export function createType(typePayload, token) {
    return http.post('types/', typePayload, authConfig(token));
}

export function getCurrentUser(token) {
    return http.get('auth/users/me/', authConfig(token));
}

export function uploadEditorImage(imageFile, token) {
    const payload = new FormData();
    payload.append('image', imageFile);

    return http.post('articles/upload-image/', payload, authConfig(token));
}

export function getArticleComments(id) {
    return http.get(`articles/${id}/comments/`);
}

export function postArticleComment(comment) {
    return http.post(`create_comment/`, comment);
}
