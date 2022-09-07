import axios from "axios"

const input = document.querySelector('#search-form')
const inputBtn = document.querySelector('[type=submit]')

// inputBtn.addEventListener('submit', onRanderPicturesBtn)
input.addEventListener('keyup', onKeyWordInput)

function onKeyWordInput (evt) {
const keyWordInput = evt.currentTarget.elements[0].value
console.log(keyWordInput)

async function getUser() {
    try {
      const response = await axios.get(`https://pixabay.com/api/?key=29781267-a8728f24297a8bee7a02bc916&q=${keyWordInput}&image_type=photo`);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }


}

async function getUser() {
    try {
      const response = await axios.get('https://pixabay.com/api/?key=29781267-a8728f24297a8bee7a02bc916&q=yellow+flowers&image_type=photo');
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }

