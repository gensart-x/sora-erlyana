import { Executor } from '@/command-hive';
import axios, { AxiosError } from 'axios';
import querystring from 'querystring';
import * as wweb from '@utils/wweb';
import * as logger from '@utils/logger';
import { MessageMedia } from 'whatsapp-web.js';

type ColoredText = {
    success: boolean,
    image: string,
    mimetype: string,
    message?: string
}

const API_URL = 'https://api.ngodingaja.my.id/api/attp';
const SPOOFED_USER_AGENT =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const getColoredText = async (text: string): Promise<ColoredText> => {

    const url = API_URL + '?' + querystring.encode({
        text: text.replaceAll('\n', '%0A')
    });

    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': SPOOFED_USER_AGENT,
            }
        })

        const imageBase64: string = Buffer.from(response.data, 'binary').toString('base64');
        const imageMimeType: string = response.headers['content-type'] ?? '';

        return {
            success: true,
            image: imageBase64,
            mimetype: imageMimeType
        };
    } catch (error) {
        const e = error as AxiosError;
        return {
            success: false,
            image: '',
            mimetype: '',
            message: e.message ?? 'Failed to fetch the image'
        }
    }
}

const coloredText: Executor = async (client, message) => {
    try {
        // ! API is down, cannot use it.
        wweb.sendMessage(client, message.from, 'API/Layanan ini sedang down, silahkan coba lagi nanti.');
        return 0;

        // const contact = await message.getContact();
        // const text = message.body.split(' ').slice(1).join(' ');

        // const image: ColoredText = await getColoredText(text);

        // if (image.success) {
        //     wweb.replyMessage(
        //         message,
        //         new MessageMedia(image.mimetype, image.image),
        //         wweb.mediaStickerMetadata(contact?.pushname ?? 'Tanpa Nama')
        //     )
        // } else {
        //     throw new Error('Image is failed - ' + image.message);
        // }
    } catch (error) {
        const contact = await message.getContact();
        const err = error as AxiosError;
        logger.logError('ColoredText - ' + err.message + ' by ' + (contact?.pushname ?? 'Unknown'));

        wweb.replyMessage(message, 'Gagal memproses gambar, silahkan coba lagi');
    }
}

export default coloredText;