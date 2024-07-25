import { Contact, MessageMedia } from 'whatsapp-web.js'
import axios, { AxiosError } from 'axios'
import querystring from 'querystring'
import config from '@/env'
import * as wweb from '@utils/wweb'
import { Executor } from '@/command-hive'
import * as logger from '@utils/logger'

type Meme = {
    image: string,
    mimetype: string
}

const uploadImageToUrl = async (base64Image: string) => {
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

/**
 * Encodes some special characters, for memegen.link API support
 * @param {string} text string to be encoded
 * @return {string} encoded string
 */
const encodeSpecialCharacters = (text: string) => {
    const encodingTerms: object = {
        '_': '__',
        ' ': '_',
        '-': '--',
        '?': '~q',
        '&': '~a',
        '%': '~p',
        '#': '~h',
        '/': '~s',
        '\\': '~b',
        '<': '~l',
        '>': '~g',
        '"': '\'\''
    };

    for (const [key, value] of Object.entries(encodingTerms)) {
        text = text.replaceAll(key, value);
    }

    return text
}

const addTextToImage = async (urlImage: string, bottomText: string, topText: string | null = null): Promise<Meme> => {

    // Extract the image extension from the image URL
    const imageExtension = urlImage.split('.').at(-1);

    // Change special characters for memegen.link API support
    bottomText = encodeSpecialCharacters(bottomText);
    if (topText) {
        topText = encodeSpecialCharacters(topText);
    } else {
        topText = '_';
    }

    const urlArray: Array<string> = [
        'https://api.memegen.link/images/custom',
        topText,
        bottomText + `.${imageExtension}`
    ];

    const queries: string = querystring.encode({
        background: urlImage,
        font: 'impact'
    })


    const url: string = urlArray.join('/') + '?' + queries;
    const response = await axios.get(url, {
        'responseType': 'arraybuffer'
    });
    const base64Image = Buffer.from(response.data, 'binary').toString('base64')

    return {
        image: base64Image,
        mimetype: response.headers['content-type']
    }
}

const imageToStickerText: Executor = async (client, message) => {
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
            wweb.replyMessage(message, `${config.botShortName} perlu gambar untuk dijadikan stikernya, ${contact.pushname ?? ''}`)
            wweb.replyMessage(
                message,
                `Jika yang ${contact.pushname ?? ''} adalah video/GIF dan tidak bisa, ${config.botShortName} saat ini belum mendukung untuk video/GIF jadi stiker, maaf ya 😢. Creator ${config.botShortName} lagi cari cara biar bisa solve !`
            );
            return 0;
        }

        // Extract and separate the texts
        const messageText: string = message.body;
        let text: string | string[] = messageText.split(' ').slice(1);
        let topText: string | null, bottomText: string;

        if (text.length === 0) {
            const warningMessage = [
                'Teks perlu diisi dengan format :',
                'Format: `.st [teks atas]|[teks bawah]`',
                'Contoh: `.st aku suka|makan sate`',
                'Contoh hanya teks bawah saja : `.st saya makan sate`\n',
                'Hanya mau gambar jadi stiker saja ? pakai `.s` aja bisa kok.'
            ];
            wweb.replyMessage(message, warningMessage.join('\n'));
            return 0;
        }

        // Separate top and bottom texts
        text = text.join(' ')
        if (text.includes('|')) {
            text = text.split('|');
            topText = text[0];
            bottomText = text[1];
        } else {
            topText = null;
            bottomText = text;
        }

        if (media != undefined) {
            const imageUrl: string = await uploadImageToUrl(media.data)
            const meme: Meme = await addTextToImage(imageUrl, bottomText, topText)

            wweb.replyMessage(message, new MessageMedia(meme.mimetype, meme.image), wweb.mediaStickerMetadata(contact.pushname))
        } else {
            wweb.replyMessage(message, `${config.botShortName} perlu gambar untuk dijadikan stikernya, ${contact.pushname ?? ''}`)
        }
    } catch (error) {
        const contact = await message.getContact();
        const err = error as AxiosError;
        logger.logError('imageToStickerText - ' + err.message + ' by ' + (contact?.pushname ?? 'unknown'));

        wweb.replyMessage(message, `${config.botShortName} gagal memproses gambar yang anda tujukan, mohon coba lagi dengan mengirim gambar baru.`)
    }
}

export {
    imageToStickerText
}