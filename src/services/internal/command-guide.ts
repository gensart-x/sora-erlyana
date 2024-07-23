import { Executor } from '@/command-hive'
import * as wweb from '@utils/wweb'
import config from '@/env'

const commandGuide: Executor = async (client, message) => {

    const commandListMessage: Array<string> = [
        '> This bot currently using Indonesian language, more languages are planned! Want to help? Email me!🥰\n',
        `Hai, aku ${config.botName},`,
        '==== LIST PERINTAH ====\n',
        'ℹ *Informasi*',
        `.botinfo - Informasi tentang ${config.botName}\n`,
        '🦜 *Quotes*',
        '.quotes - Quotes Formal',
        '.indoquotes - Quotes Slang Indonesia\n',
        '🍪 Info - Info Penting',
        '.resep [nama resep/bahan] - Resep Masak dari Cookpad\n',
        '🎲 *Random*',
        '.ppcouple - Gambar PP couple random\n',
        '🤖 *Fitur AI*',
        '.tanya [pertanyaan/perintah] - Tanya apapun ke Sora sebagai AI -\n',
        '🌐 *Translate*',
        '.indotoeng [text indo] - Translate Indonesia ke Inggris',
        '.engtoindo [text inggris] - Translate Inggris ke Indonesia\n',
        '📷 *Teks/Gambar jadi Stiker*',
        '.s (kirim bersama dengan gambarnya)',
        '.st [teks] (kirim bersama dengan gambarnya)',
        '.attp [teks]\n',
        '🖼 *Fitur Gambar*',
        '.hd (kirim bersama gambarnya) - Jernihkan Gambar\n',
        '📧 *Akun Email Random Gratis*',
        '.buatemail - Generate alamat email random',
        '.cekemail [email] - Cek pesan dari alamat email yang digunakan',
        '.bacaemail [email] [id email] - Baca pesan dari alamat email yang digunakan, dengan ID dari perintah `.cekemail`\n',
        '💚 Support Creator',
        `Kamu bisa membantu creator ${config.botShortName} dengan menfollow GitHub nya, Instagram, atau melakukan star pada repository di github.com/gensart-x/sora-erlyana.`,
        'Atau kamu juga bisa melakukan donasi lho! Ketik `.donasi` untuk informasi lebih lanjut\n',
        `😎 Kamu juga bisa request fitur yang belum ada lho, atau punya saran tertentu, bisa langsung kirim ke ${config.botShortName} dengan format :`,
        '`.request [request fitur/saran perbaikan]`',
        `Request akan ${config.botShortName} informasikan ke creator.\n`,
    ];

    // Merge the array of strings to be as a message
    const commandMessage = commandListMessage.join('\n');

    // Send the message
    wweb.sendMessage(client, message.from, commandMessage);
}

export default commandGuide;