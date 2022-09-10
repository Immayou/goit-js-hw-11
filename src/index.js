import axios from "axios";
import Notiflix from "notiflix";
import { dataRequest } from './dataRequest';

const input = document.querySelector('[name="searchQuery"]')
const galleryList = document.querySelector('.gallery')
const formSubmitBtn = document.querySelector('#search-form')

formSubmitBtn.addEventListener('submit', onRanderDataRequestBtn)

let page = 1

async function onRanderDataRequestBtn (evt) {
  evt.preventDefault()
  clearHTML()
  let keyWordInput = evt.currentTarget.elements.searchQuery.value
  try {
    if (keyWordInput === '') {
      throw new Error
    }
    const getDataRequest = await dataRequest(keyWordInput)
    const picturesArray = await getDataRequest.hits
    if (picturesArray.length === 0) {
      throw new Error 
    }
    randerMarkupPicture(picturesArray)
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
    `Sorry, there are no images matching your ${keyWordInput}. Please try again.`
  )
}

function clearHTML () {
  galleryList.innerHTML = ''
}