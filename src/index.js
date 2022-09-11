import axios from "axios";
import Notiflix from "notiflix";
import PicturesDataApiServise, { dataRequest } from './dataRequest';
import PicturesDataApiServise from './dataRequest';

const input = document.querySelector('[name="searchQuery"]')
const galleryList = document.querySelector('.gallery')
const formSubmitBtn = document.querySelector('#search-form')
const loadMoreBtn = document.querySelector('.load-more')

const PicturesDataApiServiseObj = new PicturesDataApiServise()

formSubmitBtn.addEventListener('submit', onRanderDataRequestBtn)
loadMoreBtn.addEventListener('click', onLoadMore)

async function onRanderDataRequestBtn (evt) {
  evt.preventDefault()
  clearHTML()
  loadMoreBtn.classList.add('visually_hidden')
  PicturesDataApiServiseObj.query = evt.currentTarget.elements.searchQuery.value
  PicturesDataApiServiseObj.resetPage()
  try {
    if (PicturesDataApiServiseObj.query.length === 0) {
      throw new Error 
    }
    const getDataRequest = await PicturesDataApiServiseObj.request()
    const picturesArray = await getDataRequest.hits
    randerMarkupPicture(picturesArray)
    loadMoreBtn.classList.remove('visually_hidden')
    if (picturesArray.length === 0) {
      throw new Error 
    }
  } catch (error) {
    getDataFailureRequest()
  }
}

function randerMarkupPicture (pictures) {
  const template = pictures.map(
  ({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => 
  {return `<div class="photo-card">
  <img src="${webformatURL}" data-source="${largeImageURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`}).join('')
galleryList.insertAdjacentHTML('beforeend', template)
}


function getDataFailureRequest () {
  Notiflix.Notify.failure(
    `Sorry, there are no images matching your ${PicturesDataApiServise.query}. Please try again.`
  )
}

function clearHTML () {
  galleryList.innerHTML = ''
}


async function onLoadMore () {
  const getDataRequest = await PicturesDataApiServiseObj.request()
  const picturesArray = await getDataRequest.hits
  randerMarkupPicture(picturesArray)
}