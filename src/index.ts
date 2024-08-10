// Copyright (c) 2021-2024, SIL International.
// Licensed under MIT license: https://opensource.org/licenses/MIT

// This file is a direct translation of https://github.com/sillsdev/khmer-character-specification/blob/master/python/scripts/khnormal
enum Cats {
  Other = 0, Base = 1, Robat = 2, Coeng = 3, ZFCoeng = 4,
  Shift = 5, Z = 6, VPre = 7, VB = 8, VA = 9,
  VPost = 10, MS = 11, MF = 12
}

const categories: Cats[] = [
  ...Array(35).fill(Cats.Base),     // 1780-17A2
  ...Array(2).fill(Cats.Other),      // 17A3-17A4
  ...Array(15).fill(Cats.Base),      // 17A5-17B3
  ...Array(2).fill(Cats.Other),      // 17B4-17B5
  Cats.VPost,                         // 17B6
  ...Array(4).fill(Cats.VA),         // 17B7-17BA
  ...Array(3).fill(Cats.VB),         // 17BB-17BD
  ...Array(8).fill(Cats.VPre),       // 17BE-17C5
  Cats.MS,                            // 17C6
  ...Array(2).fill(Cats.MF),         // 17C7-17C8
  ...Array(2).fill(Cats.Shift),      // 17C9-17CA
  Cats.MS,                            // 17CB
  Cats.Robat,                         // 17CC
  ...Array(5).fill(Cats.MS),         // 17CD-17D1
  Cats.Coeng,                         // 17D2
  Cats.MS,                            // 17D3
  ...Array(9).fill(Cats.Other),      // 17D4-17DC
  Cats.MS                             // 17DD
];

let khres: { [key: string]: string } = {   // useful regular sub expressions used later
  "B": "[\\u1780-\\u17A2\\u17A5-\\u17B3\\u25CC]",
  "NonRo": "[\\u1780-\\u1799\\u179B-\\u17A2\\u17A5-\\u17B3]",
  "NonBA": "[\\u1780-\\u1793\\u1795-\\u17A2\\u17A5-\\u17B3]",
  "S1": "[\\u1780-\\u1783\\u1785-\\u1788\\u178A-\\u178D\\u178F-\\u1792" +
    "\\u1795-\\u1797\\u179E-\\u17A0\\u17A2]",
  "S2": "[\\u1784\\u1780\\u178E\\u1793\\u1794\\u1798-\\u179D\\u17A1\\u17A3-\\u17B3]",
  "VAA": "(?:[\\u17B7-\\u17BA\\u17BE\\u17BF\\u17DD]|\\u17B6\\u17C6)",
  "VA": "(?:[\\u17C1-\\u17C5]?{VAA})",
  "VAS": "(?:{VA}|[\\u17C1-\\u17C3]?\\u17D0)",
  "VB": "(?:[\\u17C1-\\u17C3][\\u17BB-\\u17BD])",
  // contains series 1 and no BA
  "STRONG": "{S1}\\u17CC?(?:\\u17D2{NonBA}(?:\\u17D2{NonBA})?)?|" +
    "{NonBA}\\u17CC?(?:\\u17D2{S1}(?:\\u17D2{NonBA})?|\\u17D2{NonBA}\\u17D2{S1})",
  // contains BA or only series 2
  "NSTRONG": "(?:{S2}\\u17CC?(?:\\u17D2{S2}(?:\\u17D2{S2})?)?|\\u1794\\u17CC?{COENG}?|" +
    "{B}\\u17CC?(?:\\u17D2{NonRo}\\u17D2\\u1794|\\u17D2\\u1794(?:\\u17D2{B}))?)",
  "COENG": "(?:(?:\\u17D2{NonRo})?\\u17D2{B})",
  // final right spacing coeng
  "COENGR": "(?:(?:[\\u17C9\\u17CA]\\u200C?)?(?:{VB}?{VAS}|{VB}))",
  // final all coengs
  "COENGF": "(?:(?:[\\u17C9\\u17CA]\\u200C?)?[\\u17C2-\\u17C3]?{VB}?{VA}?" +
    "[\\u17B6\\u17BF\\u17C0\\u17C4\\u17C5])",
  "COENGS": "(?:\\u17C9\\u200C?{VAS})",
  "FCOENG": "(?:\\u17D2\\u200D{NonRo})",
  "SHIFT": "(?:(?<={STRONG}{FCOENG}?)\\u17CA\\u200C(?={VA})|" +
    "(?<={NSTRONG}{FCOENG}?)\\u17C9\\u200C(?={VAS})|[\\u17C9\\u17CA])",
  "V": "(?:\\u17C1[\\u17BC\\u17BD]?[\\u17B7\\u17B9\\u17BA]?|" +
    "[\\u17C2\\u17C3]?[\\u17BC\\u17BD]?[\\u17B7-\\u17BA]\\u17B6|" +
    "[\\u17C2\\u17C3]?[\\u17BB-\\u17BD]?\\u17B6|\\u17BE[\\u17BC\\u17BD]?\\u17B6?|" +
    "[\\u17C1-\\u17C5]?[\\u17BB](?![\\u17D0\\u17DD])|" +
    "[\\u17BF\\u17C0]|[\\u17C2-\\u17C5]?[\\u17BC\\u17BD]?[\\u17B7-\\u17BA]?)",
  "MS": "(?:(?:[\\u17C6\\u17CB\\u17CD-\\u17CF\\u17D1\\u17D3]|" +
    "(?<![\\u17BB[\\u17B6\\u17C4\\u17C5]?)[\\u17D0\\u17DD])" +
    "[\\u17C6\\u17CB\\u17CD-\\u17D1\\u17D3\\u17DD]?)"
};

// expand 2 times: CEONGS -> VAS -> VA -> VAA
for (let i = 0; i < 3; i++) {
  khres = Object.fromEntries(Object.entries(khres).map(([k, v]) => [k, v.replace(/{(.*?)}/g, (_, key) => khres[key])]));
}

/** Returns the Khmer character category for a single char string */
function charcat(c: string): Cats {
  const o = c.charCodeAt(0);
  if (0x1780 <= o && o <= 0x17DD) {
    return categories[o - 0x1780];
  } else if (o === 0x200C) {
    return Cats.Z;
  } else if (o === 0x200D) {
    return Cats.ZFCoeng;
  }
  return Cats.Other;
}

/** Returns khmer normalised string, without fixing or marking errors */
export function khnormal(txt: string, lang: string = "km"): string {
  // Mark final coengs in Middle Khmer
  if (lang === "xhm") {
    txt = txt.replace(/([\u17B7-\u17C5]\u17D2)/g, "$1\u200D");
  }
  // Categorise every character in the string
  const charcats: Cats[] = Array.from(txt).map(c => charcat(c));

  // Recategorise base or ZWJ -> coeng after coeng char
  for (let i = 1; i < charcats.length; i++) {
    if ((txt[i - 1] === '\u17D2' || txt[i - 1] === '\u200D') &&
        (charcats[i] === Cats.Base || charcats[i] === Cats.ZFCoeng)) {
      charcats[i] = Cats.Coeng;
    }
  }

  // Find subranges of base+non other and sort components in the subrange
  let i = 0;
  const res: string[] = [];
  while (i < charcats.length) {
    const c = charcats[i];
    if (c !== Cats.Base) {
      res.push(txt[i]);
      i += 1;
      continue;
    }
    // Scan for end of syllable
    let j = i + 1;
    while (j < charcats.length && charcats[j] > Cats.Base) {
      j += 1;
    }
    // Sort syllable based on character categories
    // Sort the char indices by category then position in string
    const newindices = Array.from({ length: j - i }, (_, index) => index + i).sort((a, b) => {
      return charcats[a] - charcats[b] || a - b;
    });
    let replaces = newindices.map(n => txt[n]).join("");

    replaces = replaces.replace(/([\u200C\u200D]\u17D2?|\u17D2\u200D)[\u17D2\u200C\u200D]+/g, "$1"); // remove multiple invisible chars
    // map compound vowel sequences to compounds with -u before to be converted
    replaces = replaces.replace(/\u17C1([\u17BB-\u17BD]?)\u17B8/g, "\u17BE$1");
    replaces = replaces.replace(/\u17C1([\u17BB-\u17BD]?)\u17B6/g, "\u17C4$1");

    replaces = replaces.replace(/(\u17BE)(\u17BB)/g, "$2$1");
    // Replace -u + upper vowel with consonant shifter
    replaces = replaces.replace(new RegExp(`({STRONG}{FCOENG}?[\\u17C1-\\u17C5]?)\\u17BB(?={VAA}|\\u17D0)`.replace(/{(.*?)}/g, (_, key) => khres[key])), "$1\u17CA");
    replaces = replaces.replace(new RegExp(`({NSTRONG}{FCOENG}?[\\u17C1-\\u17C5]?)\\u17BB(?={VAA}|\\u17D0)`.replace(/{(.*?)}/g, (_, key) => khres[key])), "$1\u17C9");
    replaces = replaces.replace(/(\u17D2\u179A)(\u17D2[\u1780-\u17B3])/g, "$2$1"); // coeng ro second
    replaces = replaces.replace(/(\u17D2)\u178A/g, "$1\u178F");  // coeng da->ta
    res.push(replaces);
    i = j;
  }
  return res.join("");
}

/**
 * Tests normalized text for conformance to Khmer encoding structure
 *
 * @returns `null` if no errors found, otherwise returns a string with errors
 *          highlighted with '!'
 */
export function khtest(txt: string): string | null {
  const syl = new RegExp(`({B}\\u17CC?{COENG}?(?:\\u17D2\\u200D(?={COENGR})|{FCOENG}(?={COENGF})|` +
    `(?<={NSTRONG})\\u17D2\\u200D{S1}(?={COENGS}))?{SHIFT}?{V}{MS}?[\\u17C7\\u17C8]?|` +
    `[\\u17A3\\u17A4\\u17B4\\u17B5]|[^\\u1780-\\u17D2])`.replace(/{(.*?)}/g, (_, key) => khres[key]), 'd');
  const res: string[] = [];
  let passed = true;
  while (txt.length) {
    const m = syl.exec(txt);          // match a syllable
    if (m) {
      res.push(m[1]);  // add matched syllable to output
      txt = txt.substring((<any>m).indices[1][1]);    // update start to after this syllable
      continue;                // go round for the next syllable
    }
    passed = false;                          // will return a failed string
    const m2 = syl.exec("\u25CC" + txt);             // Try inserting 25CC and matching that
    if (m2 && (<any>m2).indices[1][1] > 1) {
      res.push(m2[1]);     // yes then insert 25CC in output
      txt = txt.substring((<any>m2).indices[1][1] - 1);
    } else {
      res.push("!" + txt[0] + "!");   // output failure character
      txt = txt.substring(1);
    }
  }
  if (!passed) {                  // if the output is different, return it
    return res.join("");
  }
  return null;                     // return null as sentinel for pass
}

