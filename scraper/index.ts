import { Scraper } from './Scraper';
import { VectorStore } from './VectorStore';

const LAWS = {
    "961235": "Võlaõigusseadus (lühend - VÕS)",
    "12806823": "Tsiviilseadustiku üldosa seadus (lühend - TsÜS)"
} as const

export const runScraper = async () => {
    return new Scraper().chunkAndStoreLaws(LAWS);
}

export const searchStore = async (query: string) => {
    return new VectorStore().find(query, 5);
}