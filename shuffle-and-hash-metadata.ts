import openSeaMetadata from './mapped-opensea-metadata.json';
import fs from 'fs';
import crypto from 'crypto';
import { OpenSeaMetadata } from './types';

// Core team reserved
// Ubbe - 0
// Beld - 34
// Soh - 71
// Knox - 144

// Reserved 1/1s for auctions
// 331
// 332

const reservedIds = [332, 331, 144, 71, 34, 0];

// Fisher–Yates Shuffle - https://bost.ocks.org/mike/shuffle/
export const shuffle = (array: any[]) => {
  let m = array.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
};

let metadata = openSeaMetadata;

let reservedMetadata: OpenSeaMetadata[] = [];

reservedIds.forEach((id) => {
  const metadataObj = metadata.splice(id, 1);
  reservedMetadata = reservedMetadata.concat(metadataObj);
});

for (let i = 0; i < 333; i++) {
  metadata = shuffle(metadata);
}

const finalMetadata: OpenSeaMetadata[] = reservedMetadata.concat(metadata);

console.log('Number of Cyber Raiders', finalMetadata.length);

const data = JSON.stringify(finalMetadata);
fs.writeFileSync('./finalMetadata.json', data);

const provenanceString = ''.concat(
  ...finalMetadata.map((item) => item.imageHash || ''),
);

const hash = crypto.createHash('sha256');

const provenanceHash = hash.update(provenanceString).digest('hex');

console.log('provenanceHash', provenanceHash);

fs.writeFileSync('./provenanceString.txt', provenanceString);
fs.writeFileSync('./provenanceHash.txt', provenanceHash);
