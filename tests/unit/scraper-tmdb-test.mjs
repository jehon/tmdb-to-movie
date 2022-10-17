
import ScraperTMDB from '../../lib/scraper-tmdb.js';
import { t } from '../test-helpers.js';

describe(t(import.meta), () => {
    describe('français', () => {
        const api = new ScraperTMDB(ScraperTMDB.fr);
        it('should find movie', async () => {
            const list = await api.search('Ghost', 1990);
            expect(list.length).toBeGreaterThan(5);
        });

        it('should get details', async () => {
            const infosMetadata = await api.getInfosMetadata(251);
            expect(infosMetadata.title).toBe('Ghost');
            expect(infosMetadata.tagline).toBe('On y croit tous.');
        });
    });

    describe('english', () => {
        const api = new ScraperTMDB(ScraperTMDB.en);
        it('should find movie', async () => {
            const list = await api.search('Ghost', 1990);
            expect(list.length).toBeGreaterThan(5);
        });

        it('should get details', async () => {
            const infosMetadata = await api.getInfosMetadata(251);
            expect(infosMetadata.title).toBe('Ghost');
            expect(infosMetadata.tagline).toBe('Before Sam was murdered, he told Molly he\'d love and protect her forever.');
        });
    });
});