import { MET, translate } from 'bing-translate-api';

type TranslateResult = {
    success: boolean,
    originalText: string,
    text: string,
    error?: string
}

/**
 * Translates the text from the source language to the target language.  
 * The `isoFrom` and `isoTo` is using the code from `lang.json`  
 * inside `bing-translate-api` package  
 *   
 * `microsoft` is more stable and powerful than `bing`
 *
 * @param {string} text The text to be translated
 * @param {string | null} isoFrom The ISO code of the source language, default to `auto-detect`
 * @param {string} isoTo The ISO code of the target language
 * @return {Promise<TranslateResult>} The result of the translation
 */
const microsoft = async (text: string, isoFrom: string | null, isoTo: string): Promise<TranslateResult> => {
    let result: TranslateResult = {
        success: false,
        originalText: text,
        text: '',
    }

    try {
        if (isTextMoreThanLimit(text)) {
            result.error = 'Karakter terlalu panjang, maksimal 1000 karakter';
            return result;
        }

        // Translation to target language
        const translation = await MET.translate(text, isoFrom, isoTo);

        if (translation) {
            result.success = true;
            result.text = translation?.at(0)?.translations?.at(0)?.text ?? 'Translate gagal';
        } else {
            result.error = 'Translate gagal';
        }
    } catch (error) {
        result.error = 'Translate gagal dilakukan';
    }

    return result;
}

/**
 * Translates the text from the source language to the target language.  
 * The `isoFrom` and `isoTo` is using the code from `lang.json`  
 * inside `bing-translate-api` package  
 *   
 * `microsoft` is more stable and powerful than `bing`, use `bing` for backup.
 *
 * @param {string} text - The text to be translated
 * @param {string | null} isoFrom - The ISO code of the source language, default to `auto-detect`
 * @param {string} isoTo - The ISO code of the target language
 * @return {Promise<TranslateResult>} The result of the translation
 */
const bing = async (text: string, isoFrom: string | null, isoTo: string): Promise<TranslateResult> => {
    let result: TranslateResult = {
        success: false,
        originalText: text,
        text: ''
    }

    try {
        if (isTextMoreThanLimit(text)) {
            result.error = 'Karakter terlalu panjang, maksimal 1000 karakter';
            return result;
        }

        const translation = await translate(text, isoFrom, isoTo);

        if (translation) {
            result.success = true;
            result.text = translation.translation;
        } else {
            result.error = 'Translate gagal';
        }
    } catch (error) {
        result.error = 'Translate gagal dilakukan';
    }

    return result;
}

/**
 * Check whether the text is more than 1000 characters or not, returning boolean
 * @param {string} text The text to be checked
 * @return {boolean} Whether the text is more than 1000 characters or not
 */
const isTextMoreThanLimit = (text: string): boolean => {
    return text.length > 1000;
}

export {
    TranslateResult,
    microsoft,
    bing
}