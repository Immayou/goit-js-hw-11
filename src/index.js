import axios from "axios";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import PicturesDataApiServise, { dataRequest } from './dataRequest';
import PicturesDataApiServise from './dataRequest';

const galleryList = document.querySelector('.gallery')
const formSubmit = document.querySelector('#search-form')
const loadMoreBtn = document.querySelector('.load-more')
const scrollDownBtn = document.querySelector('.scroll-down-btn')
const scrollUpBtn = document.querySelector('.scroll-up-btn')

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
      showAskingToEnterQueryMessage()
      return
    }
    const getDataRequest = await PicturesDataApiServiseObj.request()
    const totalHitsQuantity = await getDataRequest.totalHits
    const picturesArray = await getDataRequest.hits
    if (picturesArray.length === 0) {
      throw new Error 
      }
    showSuccessMessage(totalHitsQuantity)
    randerMarkupPicture(picturesArray)
    loadMoreBtn.classList.remove('visually_hidden')
    scrollDownBtn.classList.remove('visually_hidden')
    scrollUpBtn.classList.remove('visually_hidden')
    gallery.on('show.simplelightbox')
    if(picturesArray.includes(picturesArray[totalHitsQuantity-1])) {
      loadMoreBtn.classList.add('visually_hidden')
      scrollDownBtn.classList.add('visually_hidden')
      scrollUpBtn.classList.add('visually_hidden')
      showFinishedGalleryMessage()
    }
    // if (galleryList.scrollHeight - galleryList.scrollTop === galleryList.clientHeight) {
    //   loadMoreBtn.classList.add('visually_hidden')
    //   scrollDownBtn.classList.add('visually_hidden')
    //   scrollUpBtn.classList.add('visually_hidden')
    //   showFinishedGalleryMessage()
    // }
  } catch (error) {
    showDataFailureRequestMessage()
    loadMoreBtn.classList.add('visually_hidden')
    scrollDownBtn.classList.add('visually_hidden')
    scrollUpBtn.classList.add('visually_hidden')
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

function showDataFailureRequestMessage () {
  Notiflix.Notify.failure(
    `Sorry, there are no images matching your ${PicturesDataApiServise.query}. Please try again.`
  )
}

function showSuccessMessage (totalHits) {
  Notiflix.Notify.success(
    `Hooray! We found ${totalHits} images.`
  )
}

function showAskingToEnterQueryMessage () {
  Notiflix.Notify.info(
    "Enter your query, please!"
  )
}

function showFinishedGalleryMessage () {
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results."
  )
}

function clearHTML () {
  galleryList.innerHTML = ''
}

async function onLoadMore () {
  const getDataRequest = await PicturesDataApiServiseObj.request()
  const totalHitsQuantity = await getDataRequest.totalHits
  const picturesArray = await getDataRequest.hits
  randerMarkupPicture(picturesArray)
}

scrollDownBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

  window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
})
})

scrollUpBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

  window.scrollBy({
  top: -(cardHeight * 2),
  behavior: "smooth",
})
})


