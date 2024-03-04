import http from '../constants/httpServices';
import apiUrl from '../constants/apiUrl';

export function getArticles() {
    return http.get(`${apiUrl}/articles/`);
}

export function getArticle(id) {
    return http.get(`${apiUrl}/articles/${id}/`);
}

export function getArticleComments(id) {
    return http.get(`${apiUrl}/articles/${id}/comments/`);
}

export function postArticleComment(comment) {
    return http.post(`${apiUrl}/create_comment/`, comment);
}
