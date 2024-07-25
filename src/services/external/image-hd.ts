import { Executor } from '@/command-hive';
import * as imageUtil from '@utils/image';
import * as wweb from '@utils/wweb';
import * as logger from '@utils/logger';
import config from '@/env';
import axios from 'axios';
import { Contact, MessageMedia } from 'whatsapp-web.js';

type Image = {
    success: boolean,
    imageLink: string,
    message?: string
}

const API_URL = 'https://api.ngodingaja.my.id/api/hd';
const SPOOFED_USER_AGENT =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const enhanceImage = async (base64Image: string): Promise<Image> => {
    try {
        const imageUrl = await imageUtil.uploadImageToUrl(base64Image);
        const url = API_URL + '?url=' + imageUrl;

        const response = await axios.get(url, {
            headers: {
                'User-Agent': SPOOFED_USER_AGENT
            }
        });

        if (response.status == 200) {
            return {
                success: true,
                imageLink: response.data.hasil,
            }
        } else {
            return {
                success: false,
                imageLink: '',
                message: 'Failed'
            }
        }
    } catch (error) {
        const e = error as axios.AxiosError;
        return {
            success: false,
            imageLink: '',
            message: e.message
        }
    }
}

const imageHd: Executor = async (client, message) => {
    try {
        const contact: Contact = await message.getContact();
        let media: MessageMedia | undefined;

        // Check if the user is referring a quoted message to be executed
        // If so, retrieve the media if possible, otherwise retrieve from the primary message
        if (message.hasQuotedMsg) {
            const quotedMessage = await message.getQuotedMessage();
            media = quotedMessage.hasMedia ? await quotedMessage.downloadMedia() : undefined;
        } else {
            media = message.hasMedia ? await message.downloadMedia() : undefined;
        }

        // If this execution does not have any media, inform the user, and cancel it.
        if (media == undefined) {
            wweb.replyMessage(
                message,
                `${config.botShortName} perlu gambarnya untuk di HD kan, ${contact.pushname ?? ''}`
            );
            return 0;
        }

        const image: Image = await enhanceImage(media.data);

        if (image.success) {
            wweb.replyMessage(message, await MessageMedia.fromUrl(image.imageLink), {
                sendMediaAsDocument: true
            })
        } else {
            throw new Error(image.message ?? 'Gagal memproses gambar, dari API');
        }
    } catch (error) {
        const contact = await message.getContact();
        const err = error as axios.AxiosError;
        logger.logError('imageHd - ' + err.message + ' by ' + (contact?.pushname ?? 'No Name'));

        wweb.replyMessage(message, `${config.botShortName} gagal memproses gambar yang ${contact?.pushname} tujukan, mohon coba lagi dengan mengirim gambar baru.`)
    }
}

export default imageHd;