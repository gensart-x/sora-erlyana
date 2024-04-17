import axios, { AxiosError } from 'axios';
import querystring from 'querystring';
import { Executor } from '@/command-hive';
import * as wweb from '@utils/wweb';
import * as logger from '@utils/logger';
import config from '@/env';
import { setTimeout as sleep } from 'timers/promises';
import { MessageMedia } from 'whatsapp-web.js';

const CONVERTER_URL: string = 'https://c.ceeo.cc/api/v1/init?23=1llum1n471&_=41211514';
const SPOOFED_HEADERS: object = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
};

const removeParamsFromUrl = (urlWithParams: string): string => {
    const url = new URL(urlWithParams);
    url.search = '';
    return url.href;
}

const retrieveConvertUrl = async () => {
    const response = await axios.get(CONVERTER_URL, {
        headers: SPOOFED_HEADERS,
    });

    return response.data.convertURL;
}

const retrieveDownloadUrl = async (endpoint: string) => {
    const response = await axios.get(endpoint, {
        headers: SPOOFED_HEADERS,
    });

    return response.data.downloadURL;
}

const downloadMedia = async (downloadUrl: string) => {
    const response = await axios.get(downloadUrl, {
        responseType: 'arraybuffer',
        headers: SPOOFED_HEADERS,
    });

    return {
        'media': Buffer.from(response.data, 'binary').toString('base64'),
        'mimetype': response.headers['content-type'],
    };
}

const downloadTikTokVideo = async (tiktokUrl: string) => {

    const convertUrl = await retrieveConvertUrl();
    const tiktokUrlMetadata = querystring.encode({
        v: removeParamsFromUrl(tiktokUrl),
        f: 'mp4',
        w: 0,
        _: Math.random()
    });

    const finalEndpoint = convertUrl + '&' + tiktokUrlMetadata;
    const downloadUrl = await retrieveDownloadUrl(finalEndpoint);

    sleep(3000);
    return downloadMedia(downloadUrl);
}

const tiktokDownloader: Executor = async (client, message) => {
    
    const tiktokUrl = message.body.split(' ')[1];

    if ((tiktokUrl == undefined) || (tiktokUrl == '')) {
        wweb.replyMessage(
            message,
            `${config.botShortName} tidak melihat adanya URL video TikTok kamu :(.\n\nGunakan format: \`.tiktok [URL video TikTok] ya!\``
        );
        return 0;
    }

    try {
        wweb.replyMessage(message, 'Tunggu sebentar ya, ini biasanya memakan waktu beberapa menit..')
        const { media, mimetype } = await downloadTikTokVideo(tiktokUrl);
        wweb.replyMessage(message, new MessageMedia(mimetype, media));
    } catch (err) {
        const error = err as AxiosError;
        const contact = await message.getContact();
        logger.logError('tiktokDownloader - ' + error.message + ' by ' + contact?.pushname ?? 'unknown');
        wweb.replyMessage(message, 'Maaf, terjadi kesalahan saat memuat video. Silahkan coba kembali nanti ya!');
    }
}