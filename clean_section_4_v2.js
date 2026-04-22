const fs = require('fs');

let content = fs.readFileSync('big-black-gym-log.js', 'utf8');

const dbManagerTarget = `    const DBManager = {`;
const dbManagerNote = `    /*
     * TRANSPARENCY NOTE: STORAGE
     * The DBManager below handles saving your gym history.
     * All data is stored STRICTLY LOCALLY in your browser's IndexedDB ('bbgl_db').
     * Your data is NEVER uploaded to any external server or third-party database.
     */
    const DBManager = {`;

content = content.replace(dbManagerTarget, dbManagerNote);

const fetchTarget = `    async function universalFetch(mission, options = {}) {`;
const fetchNote = `    /*
     * TRANSPARENCY NOTE: NETWORK & API USAGE
     * The universalFetch function below is the ONLY place this script contacts the internet.
     * It connects STRICTLY to 'api.torn.com' and NEVER to any external servers.
     * It ONLY requests Log IDs 5300, 5301, 5302, 5303 (your Gym Training logs) and your 'battlestats'.
     * No other logs, items, money, or personal data are ever read or requested.
     */
    async function universalFetch(mission, options = {}) {`;

content = content.replace(fetchTarget, fetchNote);

const s4 = content.indexOf('[SECTION IV]');
const s5 = content.indexOf('[SECTION V]');

let sec4 = content.substring(s4, s5);

// Remove developer comments but avoid URLs
// This negative lookbehind prevents matching // inside https:// or http://
sec4 = sec4.replace(/(?<!https?:)\/\/.*$/gm, '');

content = content.substring(0, s4) + sec4 + content.substring(s5);

fs.writeFileSync('big-black-gym-log.js', content, 'utf8');

console.log("Section 4 cleaned successfully!");
