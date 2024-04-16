import { MessageMedia } from 'whatsapp-web.js'
import { Executor } from '@/command-hive'
import * as wweb from '@utils/wweb'
import config from '@/env'

const imageToSticker: Executor = async (client, message) => {
    const contact = await message.getContact();
    let media: MessageMedia | undefined;

    // If the message contains quoted message
    // Retrieve the media from quoted message instead of primary message
    if (message.hasQuotedMsg) {
        const quotedMessage = await message.getQuotedMessage();
        media = quotedMessage.hasMedia ? await quotedMessage.downloadMedia() : undefined;
    } else {
        media = message.hasMedia ? await message.downloadMedia() : undefined;
    }

    // If the message does not contain any media, inform the user, and cancel it.
    if (media == undefined) {
        wweb.replyMessage(
            message,
            `${config.botShortName} perlu gambar untuk dijadikan stikernya, ${contact.pushname ?? ''}`
        );
        wweb.replyMessage(
            message,
            `Jika yang ${contact.pushname ?? ''} adalah video/GIF dan tidak bisa, ${config.botShortName} saat ini belum mendukung untuk video/GIF jadi stiker, maaf ya 😢. Creator ${config.botShortName} lagi cari cara biar bisa solve !`
        );
        return 0;
    }

    wweb.replyMessage(message, media, wweb.mediaStickerMetadata(contact.pushname));
}

export default imageToSticker