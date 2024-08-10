#!/usr/bin/env node

import { parseArgs } from 'node:util';
import * as fs from 'node:fs';
import { khnormal, khtest } from './index.js';

const options = {
  outfile: {
    type: 'string',
    short: 'o'
  },
  // unicodes: {
  //   type: 'boolean',
  //   short: 'u'
  // },
  fail: {
    type: 'boolean',
    short: 'f',
  },
  lang: {
    type: 'string',
    short: 'l',
    default: 'km'
  },
  help: {
    type: 'boolean',
    short: 'h'
  }
} as const;

const { positionals: infiles, values: args } = parseArgs({ options, allowPositionals: true });

if(args.help || process.argv.length == 2) {
  process.stdout.write(
`
khnormal [options] [inputFile...]

If no input files are specified, reads from stdin, utf-8

# Options

--outfile, -o   Write concatenated output to file; if not specified, writes to stdout, utf-8
--fail, -f      Highlight places where khnormal was unable to regularize text
--lang, -l      Specify processing language, km (Modern Khmer, default) or xhm (Middle Khmer)
--help, -h      Print this help
`);
  process.exit(0);
}

/*if (args.unicodes) {
  const instr = infiles.map(x => String.fromCharCode(parseInt(x, 16))).join("");
  let res = khnormal(instr, args.lang);
  if (args.fail) {
    res = khtest(res!);
  }
  if (res !== null) {
    console.log(res.split("").map(x => ("0000" + x.charCodeAt(0).toString(16)).slice(-4)).join(" "));
  }
} else {*/

if (!args.outfile) {
  process.stdout.setEncoding('utf-8');
}
const outStream = args.outfile ? fs.createWriteStream(args.outfile, { encoding: "utf-8" }) : process.stdout;

if (!infiles.length || infiles[0] == '-') {
  let inputString = '';

  process.stdin.resume();
  process.stdin.setEncoding('utf-8');
  process.stdin.on('data', inputStdin => {
    inputString += inputStdin;
  });

  process.stdin.on('end', () => {
    processInputFile(inputString, args.lang);
  });
} else {
  infiles.forEach(inputString => processInputFile(fs.readFileSync(inputString, 'utf-8'), args.lang));
}
//}

function processInputFile(input: string, lang: string) {
  input.split("\n").forEach(l => {
    const res = khnormal(l, lang);
    if (args.fail) {
      const tested = khtest(res);
      if (tested !== null) {
        outStream.write(tested);
      }
    } else {
      outStream.write(res);
    }
  });
}



