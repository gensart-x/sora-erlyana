import axios, { AxiosError } from 'axios';
import * as cheerio from 'cheerio';
import { Executor } from '@/command-hive';
import config from '@/env';
import * as wweb from '@utils/wweb';
import url from 'querystring';

type Recipe = {
    name?: string,
    backlink?: string,
    author?: string,
    duration?: string,
}
type RecipeDom = {
    status: number,
    data: string
};
type Recipes = {
    success: boolean,
    recipes?: Array<Recipe>
}

const COOKPAD_URL = 'https://cookpad.com/id/cari/';

const getRecipeDom = async (recipeName: string): Promise<RecipeDom> => {
    try {
        const response = await axios.get(COOKPAD_URL + url.escape(recipeName), {
            'headers': {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            }
        });

        return {
            status: 200,
            data: response.data
        }
    } catch (e) {
        const error = e as AxiosError;
        return {
            status: 400,
            data: error.message
        }
    }
}

const getRecipeList = (rawRecipeDom: string): Recipes => {
    const $ = cheerio.load(rawRecipeDom);

    const recipes: Array<Recipe> =
        $('[data-search-tracking-id-name-value="recipe_id"]')
            .children('li[itemprop="itemListElement"]').toArray().map(recipeDom => ({
                name: $(recipeDom).find('a.block-link__main').text().trim().replaceAll('\n', ''),
                backlink: COOKPAD_URL.replaceAll('/id/cari/', '') + $(recipeDom).find('a.block-link__main').attr('href'),
                author: $(recipeDom).find('span.text-cookpad-gray-600.text-cookpad-12').text().trim().replaceAll('\n', ''),
                duration: $(recipeDom).find('ul.clamp-1.text-cookpad-12').children('li').first().find('span.mise-icon-text').text().trim().replaceAll('\n', '') ?? '-'
            }));

    return {
        success: recipes.length > 0,
        recipes
    }
}

const getCookpadRecipe = async (query: string): Promise<Recipes> => {
    const dom: RecipeDom = await getRecipeDom(query);
    let recipes: Recipes;

    if (dom.status == 200) {
        recipes = getRecipeList(dom.data)
    } else {
        recipes = {
            success: false,
        }
    }

    return recipes;
}

const cookpadRecipe: Executor = async (client, message) => {
    const searchQuery = message.body.split(' ').slice(1).join(' ');
    const recipes: Recipes = await getCookpadRecipe(searchQuery);
    let recipeMessage: Array<string> = [];

    if (recipes.success) {
        recipes.recipes?.forEach(recipe => {
            recipeMessage.unshift(
                `Nama resep : *${recipe.name}*\n` +
                `Durasi pembuatan : *${recipe.duration}*\n` +
                `Pembuat resep : *${recipe.author}*\n` +
                `Link resep : *${recipe.backlink}*\n`
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