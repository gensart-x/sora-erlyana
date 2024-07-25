import { Executor } from '@/command-hive';
import * as wweb from '@utils/wweb';
import config from '@/env';

const botInfo: Executor = async (client, message) => {
    const informationArray = [
        `⚡ Informasi tentang ${config.botName} ⚡`,
        `Nama: ${config.botName}`,
        `Nama Panggilan: ${config.botShortName}`,
        `Owner: ${config.ownerName}\n`,

        'Tahun Rilis: ' + 2024,
        'Versi Saat Ini: ' + '1.3 - Aralyana Asana',
        'Teknologi Digunakan :',
        '- NodeJS v20',
        '- TypeScript',
        '- whatsapp-web.js (wwebjs.dev)\n',
        'Gunakan `.request [isi feedbackmu]` untuk berikan feedback kepada ' + config.botShortName + ' 😊'
    ];
    wweb.sendMessage(client, message.from, informationArray.join('\n'));
}

export {
    botInfo
}