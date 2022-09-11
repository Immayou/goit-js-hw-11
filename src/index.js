import axios from "axios";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import PicturesDataApiServise, { dataRequest } from './dataRequest';
import PicturesDataApiServise from './dataRequest';

const galleryList = document.querySelector('.gallery')
const formSubmit = document.querySelector('#search-form')
const loadMoreBtn = document.querySelector('.load-more')
const scrollBtn = document.querySelector('.scroll-btn')

const PicturesDataApiServiseObj = new PicturesDataApiServise()

formSubmit.addEventListener('submit', onRanderDataRequestBtn)
loadMoreBtn.addEventListener('click', onLoadMore)

let gallery = new SimpleLightbox('.gallery_link')

async function onRanderDataRequestBtn (evt) {
  evt.preventDefault()
  clearHTML()
  loadMoreBtn.classList.add('visually_hidden')
  PicturesDataApiServiseObj.query = evt.currentTarget.elements.searchQuery.value
  PicturesDataApiServiseObj.resetPage()
  try {
    if (PicturesDataApiServiseObj.query.length === 0) {
      askQueryToEnterMessage()
      return
    }
    const getDataRequest = await PicturesDataApiServiseObj.request()
    const totalHitsQuantity = await getDataRequest.totalHits
    const picturesArray = await getDataRequest.hits
    if (picturesArray.length === 0) {
      throw new Error 
      }
    getSuccesMessage(totalHitsQuantity)
    randerMarkupPicture(picturesArray)
    loadMoreBtn.classList.remove('visually_hidden')
    scrollBtn.classList.remove('visually_hidden')
    gallery.on('show.simplelightbox')
  } catch (error) {
    getDataFailureRequest()
    loadMoreBtn.classList.add('visually_hidden')
  }
}

function randerMarkupPicture (pictures) {
  const template = pictures.map(
  ({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => 
  {return `<div class="photo-card">
  <a class="gallery_link" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
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
gallery.refresh()
}

function getDataFailureRequest () {
  Notiflix.Notify.failure(
    `Sorry, there are no images matching your ${PicturesDataApiServise.query}. Please try again.`
  )
}

function getSuccesMessage (totalHits) {
  Notiflix.Notify.success(
    `Hooray! We found ${totalHits} images.`
  )
}

function askQueryToEnterMessage () {
  Notiflix.Notify.info(
    `Enter your query, please!`
  )
}

function getNoMorePicturesToShowMessage () {
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results."
  )
}

function clearHTML () {
  galleryList.innerHTML = ''
}

async function onLoadMore () {
  const getDataRequest = await PicturesDataApiServiseObj.request()
  const picturesArray = await getDataRequest.hits
  randerMarkupPicture(picturesArray)
  if (picturesArray.length === 0) {
  loadMoreBtn.classList.add('visually_hidden')
  getNoMorePicturesToShowMessage ()
  }
}

scrollBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

  window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
})
})