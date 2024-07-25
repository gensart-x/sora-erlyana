import * as translate from '@utils/translation'
import { Executor } from '@/command-hive'
import * as wweb from '@utils/wweb'

const translateEnglishToIndo: Executor = async (_, message) => {
    let text: string = message.body;

    // Delete command from text
    text = text.split(' ').slice(1).join(' ');

    const translation = await translate.microsoft(text, 'en', 'id');

    if(translation.success) {
        wweb.replyMessage(message, translation.text);
    } else {
        wweb.replyMessage(message, translation.error ?? 'Gagal melakukan translate, silahkan coba lagi.');
    }
}

const translateIndoToEnglish: Executor = async (_, message) => {
    let text: string = message.body;

    // Delete command from text
    text = text.split(' ').slice(1).join(' ');

    const translation = await translate.microsoft(text, 'id', 'en');

    if(translation.success) {
        wweb.replyMessage(message, translation.text);
    } else {
        wweb.replyMessage(message, translation.error ?? 'Gagal melakukan translate, silahkan coba lagi.');
    }
}

export {
    translateEnglishToIndo,
    translateIndoToEnglish
}