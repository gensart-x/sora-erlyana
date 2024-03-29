import axios from 'axios'
import * as wweb from '@utils/wweb'
import { Executor } from '@/command-hive'
import config from '@/env'

type HarmfulCategory = {
    /**
     * Harmful category
     */
    category: string,
    /**
     * Harmful probability, whether it `NEGLIGIBLE` or none, or the other level
     */
    probability: string
}

type HarmfulMessages = {
    [key: string]: string
}

type GeminiResponse = {
    text?: string,
    isMayHarmful: boolean,
    harmfulText?: string
}

const harmfulCategories: HarmfulMessages = {
    'HARM_CATEGORY_SEXUALLY_EXPLICIT': 'Pertanyaan anda kemungkinan mengandung unsur seksual secara eksplisit',
    'HARM_CATEGORY_HATE_SPEECH': 'Pertanyaan anda kemungkinan mengandung unsur ujaran kebencian',
    'HARM_CATEGORY_HARASSMENT': 'Pertanyaan anda kemungkinan mengandung unsur kekerasan',
    'HARM_CATEGORY_DANGEROUS_CONTENT': 'Pertanyaan anda kemungkinan mengandung konten berbahaya',
}

/**
 * Generate a text-only answer from Gemini API  
 * With harmful rating processing included
 * @param {string} text The question, command, or whatever
 * @return {Promise<GeminiResponse>}
 */
const geminiText = async (text: string): Promise<GeminiResponse> => {

    // Preparing the result object
    const result: GeminiResponse = {
        isMayHarmful: false
    }

    // Reform the data format for Gemini API to receive
    let geminiUrl: string = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    const requestDataFormat: object = {
        "contents": [
            {
                "parts": [
                    {
                        "text": text
                    }
                ]
            }
        ]
    };

    // Add API key to the URL
    // todo : Google API key
    geminiUrl = geminiUrl + '?key=' + 'here';

    // Hit the API
    const response = await axios.post(geminiUrl, requestDataFormat);

    // Process the generated answer, if exist
    if ('candidates' in response.data) {
        const generatedAnswer: string = response.data.candidates[0]?.content?.parts[0]?.text;
        result.text = generatedAnswer ?? 'Maaf, tidak ada jawaban yang tersedia. Silahkan coba lagi';
    }

    // Process the safety ratings of the generated answer
    const harmRatings: HarmfulCategory[] = response.data.promptFeedback.safetyRatings;
    for (const harmCategory of harmRatings) {
        if (harmCategory.probability != 'NEGLIGIBLE') {
            result.isMayHarmful = true;
            result.harmfulText = harmfulCategories[harmCategory.category];
            break;
        }
    }

    return result;
}

const geminiTextOnly: Executor = async (client, message) => {
    try {
        // Delete command from text
        let text: string = message.body;
        text = text.split(' ').slice(1).join(' ');

        if (text.length === 0) {
            const warningMessage: string[] = [
                `Dengan perintah ini, anda dapat menanyakan sesuatu ke ${config.botShortName}`,
                'Format: `.gemini [pertanyaan]`',
                'Contoh: `.gemini Apa saja planet di tata surya kita?`'
            ]
            wweb.replyMessage(message, warningMessage.join('\n'));
            return 0;
        }

        const answer: GeminiResponse = await geminiText(text);

        if (answer.text) {
            wweb.replyMessage(message, answer.text ?? 'Maaf, tidak ada jawaban yang tersedia. Silahkan coba lagi');
        }

        if (answer.isMayHarmful) {
            wweb.sendMessage(client, message.from, answer.harmfulText ?? 'Pertanyaan anda tidak valid');
            return 0;
        } else {
            wweb.replyMessage(message, 'Maaf, tidak ada jawaban yang tersedia. Silahkan coba lagi');
        }
    } catch (error) {
        wweb.replyMessage(message, 'Maaf, terjadi kesalahan saat menjawab pertanyaan anda. Silahkan coba lagi');
    }
}

export {
    geminiTextOnly
}