import { Executor } from '@/command-hive';
import axios, { AxiosError } from 'axios';
import * as wweb from '@utils/wweb';
import config from '@/env';
import * as logger from '@utils/logger';
import url from 'querystring'

type Mail = {
    id: number,
    from: string,
    subject: string,
    date: string
}

const ONESEC_ENDPOINT: string = 'https://www.1secmail.com/api/v1/';

const getlistMails: Executor = async (client, message) => {
    // ! API is down, cannot use it.
    wweb.sendMessage(client, message.from, 'API/Layanan ini sedang down, silahkan coba lagi nanti.');
    return 0;

    try {
        const response = await axios.get(ONESEC_ENDPOINT + '?action=genRandomMailbox&count=5');

        if (response.status == 200) {
            const mailList: string[] = response.data;

            if (mailList.length == 0) {
                wweb.replyMessage(message, 'Tidak ada email yang tersedia saat ini. Silahkan coba lagi nanti');
                return 0;
            }

            let mailListMessage: string[] = [
                'Anda dapat menggunakan alamat email dibawah ini sebagai alamat email sementara, atau alamat email anonymous.\n'
            ];

            mailList.forEach(generatedMail => {
                mailListMessage.push(`>> ${generatedMail}`)
            })

            mailListMessage.push('\nJika anda sudah menggunakan email ke salah satu email diatas dan ingin melihat pesan dari email itu, anda dapat menggunakan perintah ```.mailbox {email yang digunakan}```')

            wweb.replyMessage(message, mailListMessage.join('\n'))
        } else {
            wweb.replyMessage(message, `Maaf, ${config.botShortName} mengalami kesalahan saat memuat alamat email, silahkan coba lagi nanti 🙏`)
        }
    } catch (error) {
        const err = error as AxiosError;
        logger.logError(err.message)

        wweb.replyMessage(message, `Maaf, ${config.botShortName} mengalami kesalahan saat memuat alamat email, silahkan coba lagi nanti 🙏`)
    }
}

const getMailMessages: Executor = async (client, message) => {
    // ! API is down, cannot use it.
    wweb.sendMessage(client, message.from, 'API/Layanan ini sedang down, silahkan coba lagi nanti.');
    return 0;

    // try {

    //     const email = message.body.split(' ').at(1)?.split('@');

    //     if (email?.length != 2) {
    //         wweb.replyMessage(message, 'Format email tidak sesuai.')
    //         return 0
    //     }

    //     const endpoint = ONESEC_ENDPOINT + '?' + url.encode({
    //         action: 'getMessages',
    //         login: email[0],
    //         domain: email[1]
    //     })

    //     const response = await axios.get(endpoint);

    //     if (response.status == 200) {
    //         const mailBox: Mail[] = response.data;
    //         if (mailBox.length == 0) {
    //             wweb.replyMessage(message, 'Tidak ada pesan email masuk ke alamat email yang anda masukkan. Jika email baru saja dikirim, tunggu sekitar 5 menit untuk mengecek kembali.')
    //             return 0;
    //         }

    //         let mailBoxMessage: string[] = [
    //             `Berikut adalah daftar email yang masuk ke alamat email: ${email.join('@')}\n`
    //         ];

    //         mailBox.forEach(mail => {
    //             mailBoxMessage.push(
    //                 `ID: ${mail.id}\n` +
    //                 `Dari: ${mail.from}\n` +
    //                 `Subjek Email: *${mail.subject}*\n`
    //             )
    //         })

    //         mailBoxMessage.push('\nAnda dapat menggunakan perintah ```.bacaemail {id dari mail}``` menggunakan ID dari salah satu mail diatas')

    //         wweb.replyMessage(message, mailBoxMessage.join('\n'))
    //     } else {
    //         wweb.replyMessage(message, `Maaf, ${config.botShortName} mengalami kesalahan saat memuat alamat email, silahkan coba lagi nanti 🙏`)
    //     }
    // } catch (error) {
    //     const err = error as AxiosError
    //     logger.logError(err.message)

    //     wweb.replyMessage(message, `Maaf, ${config.botShortName} mengalami kesalahan saat memuat alamat email, silahkan coba lagi nanti 🙏`)
    // }
}

const readMail: Executor = async (client, message) => {
    // ! API is down, cannot use it.
    wweb.sendMessage(client, message.from, 'API/Layanan ini sedang down, silahkan coba lagi nanti.');
    return 0;

    // try {
    //     const email = message.body.split(' ').at(1)
    //     const id = message.body.split(' ').at(2)

    //     if (email?.split('@').length != 2) {
    //         wweb.replyMessage(message, 'Format email tidak sesuai')
    //         return 0
    //     }

    //     if ((typeof id != 'string') || id == '') {
    //         wweb.replyMessage(message, 'Harap sertakan ID pesan email juga.\nIkuti format berikut: `.bacaemail [alamat emailnya] [id dari pesan email]`')
    //         return 0
    //     }

    //     const response = await axios.get(ONESEC_ENDPOINT + '?' + url.encode({
    //         action: 'readMessage',
    //         login: email.split('@').at(0),
    //         domain: email.split('@').at(1),
    //         id
    //     }))

    //     if (response.status == 200) {
    //         const mailData = response.data

    //         if (mailData == 'Message not found') {
    //             wweb.replyMessage(message, 'Tidak ada pesan email yang cocok dengan ID yang anda masukkan')
    //             return 0
    //         }

    //         const mailMessage =
    //             `Dikirim dari : ${mailData.from}\n` +
    //             `Judul : *${mailData.subject}*\n\n` +
    //             `${mailData.textBody}`

    //         wweb.replyMessage(message, mailMessage)
    //     } else {
    //         wweb.replyMessage(message, `${config.botShortName} mengalami kesalahan saat memuat email, silahkan coba lagi nanti🙏`)
    //     }
    // } catch (error) {
    //     const err = error as AxiosError
    //     logger.logError(err.message)

    //     wweb.replyMessage(message, `${config.botShortName} mengalami kesalahan saat memuat email, silahkan coba lagi nanti🙏`)
    // }
}

export {
    getlistMails, getMailMessages, readMail
}