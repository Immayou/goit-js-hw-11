export const picturesRequest = async (keyValue) => {
    const response = await axios.get(`https://pixabay.com/api/?key=29781267-a8728f24297a8bee7a02bc916&q=${keyValue}&image_type=photo&orientation=horizontal&safesearch=true`);
    const parsedResponse = await response;
    return parsedResponse;
} 

