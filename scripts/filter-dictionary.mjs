/**
 * Generate dictionary.txt from an-array-of-english-words,
 * then filter obscure 3-letter words to a curated whitelist.
 *
 * 3-letter words: whitelist only — keep common, recognizable English words
 * 4+ letter words: keep all
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const dictPath = resolve(__dirname, '..', 'public', 'dictionary.txt');

// Step 1: Generate fresh dictionary from npm package
const allWords = require('an-array-of-english-words');
const validWords = allWords.filter((w) => {
  if (w.length < 3 || w.length > 8) return false;
  return /^[a-z]+$/.test(w);
});

console.log(`Generated ${validWords.length.toLocaleString()} words from npm package (3-8 chars, a-z only)`);

// ── Common 3-letter words whitelist ─────────────────────────────────
// Only words that a typical English speaker would recognize.
const THREE_LETTER_WHITELIST = new Set([
  // A
  'ace','act','add','ado','ads','age','ago','aid','ail','aim','air','ale',
  'all','alp','and','ant','any','ape','apt','arc','are','ark','arm','art',
  'ash','ask','asp','ate','awe','awl','axe','aye',
  // B
  'bad','bag','ban','bar','bat','bay','bed','bee','beg','bet','bib','bid',
  'big','bin','bit','boa','bob','bod','bog','bow','box','boy','bra','bud',
  'bug','bum','bun','bur','bus','but','buy',
  // C
  'cab','cam','can','cap','car','cat','cob','cod','cog','cop','cor','cos',
  'cot','cow','cox','coy','cry','cub','cud','cue','cup','cur','cut',
  // D
  'dab','dad','dam','dap','day','den','dew','did','dig','dim','din','dip',
  'doc','doe','dog','don','dot','dry','dub','dud','due','dug','dun','duo',
  'dye',
  // E
  'ear','eat','eel','egg','ego','elk','elm','emu','end','era','err','eve',
  'ewe','eye',
  // F
  'fad','fan','far','fat','fax','fed','fee','fen','few','fib','fig','fin',
  'fir','fit','fix','fly','fob','foe','fog','fop','for','fox','fry','fun',
  'fur',
  // G
  'gab','gag','gal','gap','gas','gay','gel','gem','get','gig','gin','gnu',
  'gob','god','got','gum','gun','gut','guy','gym',
  // H
  'had','hag','ham','has','hat','hay','hem','hen','her','hew','hex','hey',
  'hid','him','hip','his','hit','hob','hod','hog','hop','hot','how','hub',
  'hue','hug','hum','hut',
  // I
  'ice','icy','ill','imp','ink','inn','ion','ire','irk','its','ivy',
  // J
  'jab','jag','jam','jar','jaw','jay','jet','jib','jig','job','jog','jot',
  'joy','jug','jut',
  // K
  'keg','ken','key','kid','kin','kit',
  // L
  'lab','lad','lag','lam','lap','law','lax','lay','lea','led','leg','let',
  'lid','lie','lip','lit','log','lop','lot','low','lug',
  // M
  'mac','mad','man','map','mar','mat','maw','max','may','men','met','mid',
  'mix','mob','mod','mom','mop','mow','mud','mug','mum',
  // N
  'nab','nag','nap','nay','net','new','nil','nip','nit','nob','nod','nor',
  'not','now','nub','nun','nut',
  // O
  'oak','oaf','oar','oat','odd','ode','off','oft','ohm','oil','old','one',
  'opt','orb','ore','our','out','ova','owe','owl','own',
  // P
  'pad','pal','pan','pap','par','pat','paw','pay','pea','peg','pen','pep',
  'per','pet','pew','pie','pig','pin','pit','ply','pod','pop','pot','pow',
  'pro','pry','pub','pug','pun','pup','pus','put',
  // Q
  // (none common enough at 3 letters)
  // R
  'rag','ram','ran','rap','rat','raw','ray','red','ref','rep','rev','rib',
  'rid','rig','rim','rip','rob','rod','roe','rot','row','rub','rug','rum',
  'run','rut','rye',
  // S
  'sac','sad','sag','sap','sat','saw','say','sea','set','sew','she','shy',
  'sin','sip','sir','sis','sit','six','ski','sky','sly','sob','sod','son',
  'sop','sot','sow','soy','spa','spy','sty','sub','sue','sum','sun','sup',
  // T
  'tab','tad','tag','tan','tap','tar','tat','tax','tea','ten','the','thy',
  'tic','tie','tin','tip','toe','ton','too','top','tot','tow','toy','try',
  'tub','tug','tun','two',
  // U
  'ugh','ump','urn','use',
  // V
  'van','vat','vet','via','vie','vim','vow',
  // W
  'wad','wag','wan','war','was','wax','way','web','wed','wet','who','why',
  'wig','win','wit','woe','wok','won','woo','wow',
  // X
  // (none common)
  // Y
  'yak','yam','yap','yaw','yea','yes','yet','yew','yin','you','yow',
  // Z
  'zap','zen','zig','zip','zit','zoo',
]);

// Step 2: Filter
const filtered = validWords.filter((word) => {
  if (word.length === 3) {
    return THREE_LETTER_WHITELIST.has(word);
  }
  return true; // keep all 4+ letter words
});

writeFileSync(dictPath, filtered.join('\n') + '\n', 'utf-8');

const threesBefore = validWords.filter((w) => w.length === 3).length;
const threesAfter = filtered.filter((w) => w.length === 3).length;

console.log(`\nFiltered dictionary written to public/dictionary.txt`);
console.log(`  Total: ${filtered.length.toLocaleString()} words (was ${validWords.length.toLocaleString()})`);
console.log(`  3-letter: ${threesAfter} kept (was ${threesBefore}, removed ${threesBefore - threesAfter})`);
console.log(`  4+ letter: unchanged`);
