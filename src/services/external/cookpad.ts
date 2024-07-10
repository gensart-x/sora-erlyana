import axios, { AxiosError } from 'axios';
import { Executor } from '@/command-hive';
import config from '@/env';
import * as wweb from '@utils/wweb';
import url from 'querystring';

type Recipe = {
    name: string,
    backlink: string,
    author: string,
    duration: string,
}
type CookpadResponse = {
    success: boolean,
    data: Array<Recipe> | null
}

const COOKPAD_URL = 'https://api.kyoanna.insomnia247.nl/v1/cookpad?cari=';

const getRecipes = async (recipeName: string): Promise<CookpadResponse> => {
    try {
        const response = await axios.get(COOKPAD_URL + url.escape(recipeName));

        if (response.status == 200) {
            return {
                success: true,
                data: response.data
            }
        } else {
            return {
                success: false,
                data: null
            }

        }
    } catch (e) {
        const error = e as AxiosError;
        return {
            success: false,
            data: null
        }
    }
}

const cookpadRecipe: Executor = async (client, message) => {
    const searchQuery = message.body.split(' ').slice(1).join(' ');
    const recipes = await getRecipes(searchQuery);
    let recipeMessage: Array<string> = [];

    if (recipes.success) {
        recipes.data?.forEach((recipe: Recipe) => {
            recipeMessage.unshift(
                `Nama resep : *${recipe.name ?? '-'}*\n` +
                `Durasi pembuatan : *${recipe.duration ?? '-'}*\n` +
                `Pembuat resep : *${recipe.author ?? '-'}*\n` +
                `Link resep : ${recipe.backlink ?? '-'}\n`
            )
        })
        recipeMessage.unshift(`Berikut hasil pencarian ${config.botShortName} tentang "${searchQuery}" di Cookpad.\n\n`);
    } else {
        wweb.replyMessage(message, `${config.botShortName} tidak menemukan resep itu di Cookpad, coba deh pakai keyword yang lain 😁`, {
            linkPreview: false
        });
        return 0;
    }

    const compiledRecipeMessage: string = recipeMessage.join('\n-------\n');

    wweb.replyMessage(message, compiledRecipeMessage);
    return 0;
}

export {
    cookpadRecipe
}