# khmer-normalizer

This module normalizes Khmer text according to the proposed normal encoding structure at https://www.unicode.org/L2/L2022/22290-khmer-encoding.pdf.

It does not attempt to identify faulty text, merely to ensure that two strings that would have rendered the same are output as the same string.

A live online version is available at https://convert.ភាសាខ្មែរ.com/ (see https://ភាសាខ្មែរ.com for related tools).

## Example

ខែ្មរ is corrected to ខ្មែរ:

* Input: ខ `U+1781` ែ `U+17C2` ្ `U+17D2` ម `U+1798` រ `U+179A`
* Output: ខ `U+1781` ្ `U+17D2` ម `U+1798` ែ `U+17C2` រ `U+179A`

## Installation

```
npm install khmer-normalizer
```

## API Usage

```ts

import { khnormal } from 'khmer-normalizer';

// Normal use -- Modern Khmer
const cleanKhmer = khnormal(inputKhmer);

// Specifying the Modern Khmer language tag is optional
const cleanKhmer = khnormal(inputKhmer, 'km');

// For Middle Khmer, use the language tag 'xhm'
const cleanMiddleKhmerText = khnormal(inputMiddleKhmerText, 'xhm');

```

## Command line usage

```
khnormal [options] [inputFile...]

If no input files are specified, reads from stdin, utf-8

# Options

--outfile, -o   Write concatenated output to file; if not specified, writes to stdout, utf-8
--fail, -f      Highlight places where khnormal was unable to regularize text
--lang, -l      Specify processing language, km (Modern Khmer, default) or xhm (Middle Khmer)
--help, -h      Print this help
```