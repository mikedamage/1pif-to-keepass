# 1PIF to KeePass

by Mike Green

This is a Node module that converts a 1Password `*.1pif` archive to an XML file importable by KeePass 2 and KeePassX 2 alpha.

## Installation

__Via NPM:__
```bash
npm install 1pif-to-keepass
```

__Via Git:__
```bash
git clone https://github.com/mikedamage/1pif-to-keepass.git
cd 1pif-to-keepass
npm install
npm link
```

## Usage

1PIF to KeePass is both a library and a CLI script.

### Library

```js
var OPC = require('1pif-to-keepass');

# If you don't specify an output option, it will default to STDOUT.
var converter = new OPC('data.1pif', { output: 'file.xml' });

# OPC is an EventEmitter, so it will notify you about various stages of the conversion
# process:

converter.on('data', function(data) {
  console.log('Parsed entry: %O', data);
});

converter.on('end', function() {
  console.log('Conversion is all finished!');
});

converter.start();
```

### CLI

You can convert files using the included `1p2kp` script.

```
1PIF to KeePass 2 Converter

Usage: 1p2kp INPUT [-o OUTPUT]

Options:
  -o, --output   Output file ('-' for stdout)  [default: "-"]
  -h, --help     Show help  [boolean]
  -v, --version  Display version information  [boolean]

Examples:
  1p2kp input.1pif -o output.xml
  1p2kp input.1pif -o - # STDOUT

(C) 2015, Mike Green
```
