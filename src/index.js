import axios from "axios";
import Notiflix from "notiflix";
import { picturesRequest } from './dataRequest';

const input = document.querySelector('#search-form')
const inputBtn = document.querySelector('[type=submit]')

inputBtn.addEventListener('submit', onRanderPicturesBtn)
input.addEventListener('input', onKeyWordInput)
let keyWordInput = ""

function onKeyWordInput (evt) {
evt.preventDefault()
keyWordInput = evt.currentTarget.elements[0].value
console.log(keyWordInput)
getRequest(keyWordInput)

}

function onRanderPicturesBtn (evt) {

console.log(1)
// console.log(keyWordInput)
// const dataPicturesRequest = await picturesRequest(keyWordInput)
// console.log(dataPicturesRequest)
 
}



function getRequest(keyValue) {
    return axios.get(`https://pixabay.com/api/?key=29781267-a8728f24297a8bee7a02bc916&q=${keyWordInput}&image_type=photo&orientation=horizontal&safesearch=true`)
    .then(response => {
      if (!response.ok) {
      throw new Error(response.status)}
      return response.blob()})
      .catch(function (error) {
      console.log(error);
      })
  }




