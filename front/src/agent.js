import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = 'http://localhost:3000/api';

const encode = encodeURIComponent;
const responseBody = res => res.body;

let token = null;
const tokenPlugin = req => {
  if (token) {
    req.set('authorization', `Token ${token}`);
  }
}

const requests = {
  del: url =>
    superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  get: url =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  put: (url, body) =>
    superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
  post: (url, body) =>
    superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody)
};

const Auth = {
  current: () =>
    requests.get('/user'),
  login: (email, password) =>
    requests.post('/users/login', { user: { email, password } }),
  register: (username, email, password) =>
    requests.post('/users', { user: { username, email, password } }),
  save: user =>
    requests.put('/user', { user })
};

const Tags = {
  getAll: () => requests.get('/tags')
};

const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;
const omitSlug = car => Object.assign({}, car, { slug: undefined })
const Cars = {
  all: page =>
    requests.get(`/cars?${limit(10, page)}`),
  byAuthor: (author, page) =>
    requests.get(`/cars?author=${encode(author)}&${limit(5, page)}`),
  byTag: (tag, page) =>
    requests.get(`/cars?tag=${encode(tag)}&${limit(10, page)}`),
  del: slug =>
    requests.del(`/cars/${slug}`),
  favorite: slug =>
    requests.post(`/cars/${slug}/favorite`),
  favoritedBy: (author, page) =>
    requests.get(`/cars?favorited=${encode(author)}&${limit(5, page)}`),
  feed: () =>
    requests.get('/cars/feed?limit=10&offset=0'),
  get: slug =>
    requests.get(`/cars/${slug}`),
  unfavorite: slug =>
    requests.del(`/cars/${slug}/favorite`),
  update: car =>
    requests.put(`/cars/${car.slug}`, { car: omitSlug(car) }),
  create: car =>
    requests.post('/cars', { car })
};

const Comments = {
  create: (slug, comment) =>
    requests.post(`/cars/${slug}/comments`, { comment }),
  delete: (slug, commentId) =>
    requests.del(`/cars/${slug}/comments/${commentId}`),
  forCar: slug =>
    requests.get(`/cars/${slug}/comments`)
};

const Profile = {
  follow: username =>
    requests.post(`/profiles/${username}/follow`),
  get: username =>
    requests.get(`/profiles/${username}`),
  unfollow: username =>
    requests.del(`/profiles/${username}/follow`)
};

export default {
  Cars,
  Auth,
  Comments,
  Profile,
  Tags,
  setToken: _token => { token = _token; }
};
