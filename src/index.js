import axios from "axios";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import PicturesDataApiServise from './dataRequest';

const galleryList = document.querySelector('.gallery')
const formSubmit = document.querySelector('#search-form')
const loadMoreBtn = document.querySelector('.load-more')
const scrollDownBtn = document.querySelector('.scroll-down-btn')
const scrollUpBtn = document.querySelector('.scroll-up-btn')

let contentHeight = galleryList.offsetHeight; //висота галереї
let yOffset = window.pageYOffset;   //кількість пікселів, на які прокручено документ
let windowHeight = window.innerHeight; // висота області перегляду вікна браузера
let y = yOffset + windowHeight; // висота прокрутки плюс висота видимості

const picturesDataApiServiseObj = new PicturesDataApiServise()

formSubmit.addEventListener('submit', onRanderDataRequestBtn)
loadMoreBtn.addEventListener('click', onLoadMore)

let gallery = new SimpleLightbox('.gallery_link')

async function onRanderDataRequestBtn (evt) {
  evt.preventDefault()
  clearHTML()
  loadMoreBtn.classList.add('visually_hidden')
  picturesDataApiServiseObj.query = evt.currentTarget.elements.searchQuery.value
  picturesDataApiServiseObj.resetPage()
  
  try {
    if (picturesDataApiServiseObj.query.length === 0) {
      showAskingToEnterQueryMessage()
      hideAllBtns()
      return
    }
    const getDataRequest = await picturesDataApiServiseObj.request()
    const allPictures = await getDataRequest.totalHits
    const picturesArray = await getDataRequest.hits
    if (picturesArray.length === 0) {
      throw new Error 
      }
    showSuccessMessage(allPictures)
    randerMarkupPicture(picturesArray)
    showAllBtns()
    // finishedPicturesScroll()
    gallery.on('show.simplelightbox')
  } catch (error) {
    showDataFailureRequestMessage()
    hideAllBtns()
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
      <b>Likes:</b>
      <span class="info-item-value">${likes}</span>
    </p>
    <p class="info-item">
      <b>Views:</b>
      <span class="info-item-value">${views}</span>
    </p>
    <p class="info-item">
      <b>Comments:</b>
      <span class="info-item-value">${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads:</b>
      <span class="info-item-value">${downloads}</span>
    </p>
  </div>
</div>`}).join('')
galleryList.insertAdjacentHTML('beforeend', template)
gallery.refresh()
}

async function onLoadMore () {
  const getDataRequest = await picturesDataApiServiseObj.request()
  const picturesArray = await getDataRequest.hits
  randerMarkupPicture(picturesArray)
}

// async function checkNextDataRequest () {
//   try {
//   const nextDataRequest = await PicturesDataApiServiseObj.nextRequest()
//   const picturesNextDataRequest = await nextDataRequest.hits
//   if (picturesNextDataRequest.length < 1) {
//      throw new Error;
// }
//   } catch (error) {
//     window.addEventListener("scroll", onFinishedPicturesScroll)
//   }
// }

function showDataFailureRequestMessage () {
  Notiflix.Notify.failure(
    `Sorry, there are no images matching your ${PicturesDataApiServise.query}. Please try again.`)
}

function showSuccessMessage (totalHits) {
  Notiflix.Notify.success(
    `Hooray! We found ${totalHits} images.`)
}

function showAskingToEnterQueryMessage () {
  Notiflix.Notify.info(
    "Enter your query, please!")
}

function showFinishedGalleryMessage () {
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results.")
}

function clearHTML () {
  galleryList.innerHTML = ''
}

function showAllBtns () {
  loadMoreBtn.classList.remove('visually_hidden')
  scrollDownBtn.classList.remove('visually_hidden')
  scrollUpBtn.classList.remove('visually_hidden')
}

function hideAllBtns () {
  loadMoreBtn.classList.add('visually_hidden')
  scrollDownBtn.classList.add('visually_hidden')
  scrollUpBtn.classList.add('visually_hidden')
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
 
function finishedPicturesScroll () {
  // let contentHeight = galleryList.offsetHeight; //висота галереї
  // let yOffset = window.pageYOffset;   //кількість пікселів, на які прокручено документ
  // let windowHeight = window.innerHeight; // висота області перегляду вікна браузера
  // let y = yOffset + windowHeight; // висота прокрутки плюс висота видимості
f
  if(y >= contentHeight) {
  showFinishedGalleryMessage () 
  hideAllBtns()
  }
  }
