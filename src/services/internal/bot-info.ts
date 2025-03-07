import { Executor } from '@/command-hive';
import * as wweb from '@utils/wweb';
import config from '@/env';

const botInfo: Executor = async (client, message) => {

    // Number representing seconds since January 1, 1970
    let totalSeconds = process.uptime();

    // Calculate hours, minutes, and seconds
    const hours = Math.floor(totalSeconds / 3600); // 1 hour = 3600 seconds
    totalSeconds %= 3600;

    const minutes = Math.floor(totalSeconds / 60); // 1 minute = 60 seconds
    const seconds = Math.round(totalSeconds % 60);

    // Format the result as "h:m:s"
    const formattedTime = `${hours}jam ${minutes}menit ${seconds}detik`;

    const informationArray = [
        `⚡ Informasi tentang ${config.botName} ⚡`,
        `Nama: ${config.botName}`,
        `Nama Panggilan: ${config.botShortName}`,
        `Owner: ${config.ownerName}\n`,

        'Tahun Rilis: ' + 2024,
        'Aktif Selama: ' + formattedTime,
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