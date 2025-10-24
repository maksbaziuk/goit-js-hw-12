import axios from 'axios';

export async function getImagesByQuery(query, page) {
  const API_KEY = '52793132-8c92efb256d235a72d9068fff';
  const BASE_URL = 'https://pixabay.com/api/';

  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: 15,
  };

  const response = await axios.get(BASE_URL, { params });
  return response.data;
}
