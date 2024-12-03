import axios from "axios";

const apiClient = axios.create({
    baseURL: 'http://localhost:8080',
});

export default apiClient;

//get service 
export const getAllUrls = () => {
    return apiClient.get('/getAllUrl')
};

export const postUrl = (inUrl) => {
    return apiClient.post('/createUrl', inUrl)
}