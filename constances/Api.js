export const HOST = 'https://i.instagram.com/api/v1/';
export const API = {
  LOGIN: 'accounts/login/',
  USER_INFO: (id) => `users/${id}/info`,
  FOLLOWERS: (id) => `friendships/${id}/followers`,
  FOLLLOWING: (id) => `friendships/${id}/following`,
  UNFOLLOW: (id) => `friendships/destroy/${id}/`,
  FOLLOW: (id) => `friendships/create/${id}/`,
  GET_MEDIA: (id, nextId) => `feed/user/${id}/?max_id=${nextId}`,
  GET_MEDIA_LIKER: (pk) => `media/${pk}/likers/`,
  MEDIA_DELETE: (pk) => `media/${pk}/delete/`,
  ACCOUNTS_SEARCH: (username) => `users/search/?is_typehead=true&q=${username}`,
};
