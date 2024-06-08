import querystring from 'querystring';
import axios from 'axios';
import config from '@/env';

const uploadImageToUrl = async (base64Image: string, expirationInSeconds: number = 60) => {
    const queries = querystring.encode({
        // API Key
        key: config.imgBBKey,

        // Image auto-deletion after x seconds uploaded
        expiration: 60,
    })

    const url: string = 'https://api.imgbb.com/1/upload?' + queries
    const response = await axios.post(url, {
        image: base64Image
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    const imageUrl: string = response.data.data.url;
    return imageUrl.replaceAll('\\', '');
}

export {
    uploadImageToUrl
}