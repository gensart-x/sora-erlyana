import fs from 'fs'
import path from 'path'
import axios, { AxiosResponse, AxiosError } from 'axios'
import { Executor } from '@/command-hive'
import * as wweb from '@utils/wweb'
import * as logger from '@utils/logger'
import { MessageMedia } from 'whatsapp-web.js'

type Image = {
    image: string,
    mimetype: string
}
type CouplePhotos = {
    /**
     * Profile picture for the male
     */
    male: string,
    /**
     * Profile picture for the female
     */
    female: string
}

const PP_COUPLE_DIRECTORY = 'assets';
const PP_COUPLE_FILE = 'couple-profile.json';

const getCoupleProfilePictures = () => {
    const couples: Array<CouplePhotos> = JSON.parse(fs.readFileSync(path.join(PP_COUPLE_DIRECTORY, PP_COUPLE_FILE), 'utf-8'));

    // Pick a random couple photos from the list
    return couples[Math.floor(Math.random() * couples.length)];
}

/**
 * Get image base64 string from url
 * @todo adding this utility to `@utils` as global utility
 * @param url the url of the image
 * @return {Promise<Image>}
 */
const getImageBase64 = async (url: string): Promise<Image> => {
    const response: AxiosResponse = await axios.get(url, {
        responseType: 'arraybuffer'
    });

    return {
        image: Buffer.from(response.data, 'binary').toString('base64'),
        mimetype: response.headers['content-type'] ?? false
    }
}

const getPpCouple: Executor = async (_, message) => {
    try {

        const couple: CouplePhotos = getCoupleProfilePictures();

        const male: Image = await getImageBase64(couple.male);
        const female: Image = await getImageBase64(couple.female);

        wweb.replyMessage(message, new MessageMedia(male.mimetype, male.image), {
            caption: 'Buat laki-laki'
        });
        wweb.replyMessage(message, new MessageMedia(female.mimetype, female.image), {
            caption: 'Buat perempuan'
        });
    } catch (err) {
        const error: AxiosError = err as AxiosError;
        const contact = await message.getContact();
        logger.logError('ppCouple - ' + error.message + ' by ' + (contact?.pushname ?? 'unknown'));
        wweb.replyMessage(message, 'Maaf, terjadi kesalahan saat memuat PP couple. Silahkan coba kembali nanti ya.');
    }
}

export {
    getPpCouple
}