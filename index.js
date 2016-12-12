#!/usr/env node

const fs = require('fs');

const chalk = require('chalk');
const file = process.argv.slice(2)[0];

const rawString = fs.readFileSync(file, 'utf8');
const rawCommands = rawString
  .split('\n')
  .map(c => c.split(',').slice(2));

const checkBit = function checkBit(pause) {
  return pause < -800 ? 1 : 0;
}

const commandsBytes = rawCommands
  .map(c => {
    let count = 0;
    let byteArr = [];

    return c
      .reduce((p, b) => {
        // Trim the pulses
        if (b > 0) return p;

        // Check the bits
        p.push(checkBit(b));
        return p;
      }, []);
  });

console.log(`
  <html>
  <head>
    <title>Results</title>

    <style>
      body, table, tr, td { margin: 0; padding: 0; }
      .cell { padding: 3px; height: 10px; width: 10px; border-bottom: solid 1px #333; }
      .b0 { background: #999; }
      .b1 { background: #6c7; }
    </style>
  </head>
  <body>
  <table cellpadding="0" cellspacing="0">
    ${commandsBytes.map(c => (
      `<tr>${c.map(b => `<td class="cell b${b}">&nbsp;</td>`).join('')}</tr>`
    )).join('')}
  </table>
  </body>
  </html>
`);
