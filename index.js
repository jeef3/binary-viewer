#!/usr/env node

const fs = require('fs');

const file = process.argv.slice(2)[0];

const checkBit = function checkBit(pause) {
  return pause < -800 ? 1 : 0;
}

const rawString = fs.readFileSync(file, 'utf8');
const rawCommands = rawString
  .split('\n')
  .slice(0, -1)
  .map(c => ({
    note: c.split(',')[0],
    data: c.split(',').slice(2),
  }));

const commands = rawCommands
  .map(c => {
    let count = 0;
    let byteArr = [];

    return Object.assign({}, c, {
      data: c.data
        .reduce((p, b) => {
          // Trim the pulses
          if (b > 0) return p;

          // Check the bits
          p.push(checkBit(b));
          return p;
        }, [])
    });
  });

console.log(`
  <html>
  <head>
    <title>Results</title>

    <style>
      body, table, tr, td { margin: 0; padding: 0; }
      .cell {
        width: 10px;
        padding: 3px;
        height: 10px;

        white-space: nowrap;

        border-bottom: solid 1px #333;
        border-right: solid 1px #666;
      }
      .b0 { background: #999; }
      .b1 { background: #6c7; }

      .cell:nth-child(8n + 1) { border-right: solid 2px #333; }
    </style>
  </head>
  <body>
  <table cellpadding="0" cellspacing="0">
    <tr>
      <td class="cell"></td>
      ${commands[0].data.map((c, i) => (
        (i % 8 === 0) ? `<td class="cell" colspan="8">${i / 8}</td>` : ''
      )).join('')}
    </tr>
    ${commands.map(c => (
      `<tr>
        <td class="cell">${c.note}</td>
        ${c.data.map(b => `<td class="cell b${b}">&nbsp;</td>`).join('')}
      </tr>`
    )).join('')}
  </table>
  </body>
  </html>
`);
