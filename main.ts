#!/usr/bin/env node

import *  as readline from 'node:readline/promises';
import process from 'node:process';

import yargs from 'yargs';

import ScraperTMDB from './lib/scraper-tmdb.js';
import InfosFile from './lib/infos-file.js';
import FormatMKV from './lib/format-mkv.js';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const options = await yargs(process.argv.slice(2))
    .options({
        'verbose': {
            alias: ['v'],
            type: 'boolean',
            default: false
        },
        'file': {
            // Also posible at end : $0 ... <file>
            alias: ['f'],
            type: 'string',
            default: ''
        },
        'en': {
            type: 'boolean',
            default: false
        }
    })
    .command('$0 <file>', 'The initial movie')
    .recommendCommands()
    .strict()
    .help()
    .alias('help', 'h')
    .argv;

// console.log(options);

const f = options.file;
process.stdout.write(`File is ${f}\n`);

const scraper = new ScraperTMDB(options.en ? ScraperTMDB.en : ScraperTMDB.fr);
const infosFile = InfosFile.fromPath(f);

process.stdout.write(`Looking for ${infosFile.title}...`);
const results = await scraper.search(infosFile.title, infosFile.year);
process.stdout.write('done\n');

for (let i = 0; i < results.length; i++) {
    const item = results[i];
    process.stdout.write(`${(i + '').padEnd(3)}: ${item.title.padEnd(40)} ${item.title != item.original_title ? `(${item.original_title})` : ''} ${item.url}\n`);
}

const index = await rl.question('Selection? ');
rl.close();
const selected = results[index];
process.stdout.write(`Selected #${index} ${selected.title}...`);

process.stdout.write(`Looking for #${selected.id}...`);
const infosMetadata = await scraper.getInfosMetadata(selected.id);
process.stdout.write('done\n');

process.stdout.write('\n');

process.stdout.write('Downloading images');
const formatted = new FormatMKV(infosFile);
scraper.downloadCover(formatted);
scraper.downloadBackdrop(formatted);
process.stdout.write('done\n');

process.stdout.write('\n');
