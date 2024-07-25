import { MessageMedia } from 'whatsapp-web.js';
import { Executor } from '@/command-hive';
import axios, { AxiosError } from 'axios';
import * as wweb from '@utils/wweb';
import * as logger from '@utils/logger';
import * as cheerio from 'cheerio';
import config from '@/env';

const IG_DOWNLOADER_URL = 'https://v3.igdownloader.app/api/ajaxSearch';
const SPOOFED_USER_AGENT = 'Mozilla (Firefox Inc.)';

type InstagramDom = {
    status: string,
    v?: string,
    data: string
}

type InstagramMedia = string | undefined;

const retrieveInstagramDom = async (instagramUrl: string) => {
    const response = await axios.post(IG_DOWNLOADER_URL, {
        q: instagramUrl,
    }, {
        withCredentials: true,
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'User-Agent': SPOOFED_USER_AGENT
        }
    });

    return response.data;
}

const processInstagramDom = (instagramDom: InstagramDom) => {
    if (instagramDom.v === undefined) return undefined;

    const $ = cheerio.load(instagramDom.data);
    const instagramMediaUrl: InstagramMedia = $('.download-items__btn').find('a.abutton').attr('href');

    return instagramMediaUrl;
}

const downloadMedia = async (instagramMediaUrl: string) => {
    const response = await axios.get(instagramMediaUrl, {
        responseType: 'arraybuffer',
        headers: {
            'User-Agent': SPOOFED_USER_AGENT
        }
    });

    return {
        media: Buffer.from(response.data, 'binary').toString('base64'),
        mime_type: response.headers['content-type']
    };
}

const instagramDownloader: Executor = async (client, message) => {
    const instagramUrl = message.body.split(' ')[1];

    if (instagramUrl == undefined) {
        wweb.replyMessage(message, `${config.botShortName} tidak melihat adanya URL video IG kamu :(.\n\nGunakan format: \`.ig [URL video IG]\` ya!`);
        return 0;
    }

    try {
        const instagramDom: InstagramDom = await retrieveInstagramDom(instagramUrl);
        const instagramMediaUrl: InstagramMedia = processInstagramDom(instagramDom);

        if (instagramMediaUrl === undefined) {
            wweb.replyMessage(message, `${config.botShortName} tidak dapat memproses link IG kamu, coba salin ulang lagi dari Instagram nya ya !`);
            return 0;
        }

        wweb.replyMessage(message, `Tunggu sebentar ya, ${config.botShortName} sedang memproses link IG kamu...`);
        // const instagramMedia = await downloadMedia(instagramMediaUrl);
        
        downloadMedia(instagramMediaUrl).then(instagramMedia => {
            wweb.replyMessage(message, new MessageMedia(instagramMedia.mime_type, instagramMedia.media));
        });
    } catch (error) {

        const err = error as AxiosError;
        const contact = await message.getContact();
        logger.logError('instagramDownloader - ' + (err.cause ?? err.message) + ' by ' + (contact?.pushname ?? 'unknown'));
        wweb.replyMessage(message, `Maaf, ${config.botShortName} mengalami kegagalan saat memprosesnya. Silahkan coba kembali nanti ya! 🙏`);
    }
}