
import { spawnSync } from 'child_process';
import fs from 'fs';

/**
 * run a command and send back the string
 *
 * @param {string} cmd to be run
 * @param {Array<string>} args to complete it
 * @returns {string} as stdout
 */
export function run(cmd, args) {
    const result = spawnSync(cmd, args);
    if (result.status > 0) {
        console.error(`Error running ${cmd} with "${args.join('"  "')}"`);
        console.error(result.stdout?.toString() ?? '');
        console.error(result.stderr?.toString() ?? '');
        console.error(result);
        process.exit(1);
    }
    return result.stdout?.toString() ?? '';
}

/**
 * Get some binary data
 *
 * @param {string} target filename
 * @param {string} url source
 */
export async function getBinary(target, url) {
    return fs.writeFileSync(target, Buffer.from(
        await fetch(url).then(response => response.arrayBuffer())
    ));
}
