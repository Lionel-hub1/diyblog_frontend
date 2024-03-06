import http from '../constants/httpServices';


export function getArticles() {
    return http.get(`articles/`);
}

export function getArticle(id) {
    return http.get(`articles/${id}/`);
}

export function getArticleComments(id) {
    return http.get(`articles/${id}/comments/`);
}

export function postArticleComment(comment) {
    return http.post(`create_comment/`, comment);
}
