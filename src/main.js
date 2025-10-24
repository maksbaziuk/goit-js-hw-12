import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const searchForm = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more-btn');
let currentQuery = '';
let currentPage = 1;
let totalHits = 0;
const perPage = 15;

searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  const newQuery = event.target.elements['search-text'].value.trim();

  if (!newQuery) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query!',
      position: 'topRight',
    });
    return;
  }
  currentQuery = newQuery;
  currentPage = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();
  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    createGallery(data.hits);
    checkCollectionEnd();
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: `Something went wrong: ${error.message}`,
      position: 'topRight',
    });
  } finally {
    hideLoader();
    searchForm.reset();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage++;
  showLoader();
  hideLoadMoreButton();
  try {
    const data = await getImagesByQuery(currentQuery, currentPage);

    createGallery(data.hits);
    smoothScroll();
    checkCollectionEnd();
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: `Something went wrong: ${error.message}`,
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});

function checkCollectionEnd() {
  const maxPage = Math.ceil(totalHits / perPage);

  if (currentPage >= maxPage) {
    hideLoadMoreButton();
    if (totalHits > 0) {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } else {
    showLoadMoreButton();
  }
}
function smoothScroll() {
  const card = document.querySelector('.gallery-item');
  if (!card) {
    return;
  }
  const cardHeight = card.getBoundingClientRect().height;

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
