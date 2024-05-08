const { readFile } = require('fs').promises;
const { resolve } = require('path');
const cheerio = require('cheerio');

const parseUML = (uml) => {
  const $ = cheerio.load(uml);
  const nodes = $('.node');

  const storageLayout = {};

  nodes.each((index, node) => {
      const textElements = $(node).find('text');

      console.log(`Node ${index}: Found ${textElements.length} text elements`);

      let slots = [];
      let variables = [];

      textElements.each((i, el) => {
          const text = $(el).text().trim();
          if (i > 1 && !text.startsWith('type: <inherited contract>.variable')) {
              if (!isNaN(text)) {
                  slots.push(parseInt(text));
              } else {
                  const variableInfo = text.split(':');
                  const type = variableInfo[0]?.trim();
                  const variable = variableInfo[1]?.trim().split(' ')[0]; // Extract the variable name
                  variables.push({ type, variable });
              }
          }
      });

      console.log(`Slots: ${slots.join(', ')}`);
      console.log(`Variables: ${variables.map(({ type, variable }) => `${type}: ${variable}`).join(', ')}`);

      variables.forEach(({ type, variable }, i) => {
          const slot = slots[i];
          const variableWithType = `${type}: ${variable}`;
          console.log(`Slot: ${slot}, Variable: "${variableWithType}"`);
          if (variable) {
              storageLayout[slot] = variableWithType;
          } else {
              console.error(`Error: Variable not found for slot ${slot}`);
          }
      });
  });

  return storageLayout;
};





async function main() {
    try {
        const snapshotPath = resolve(__dirname, `./KittyCore.svg`);
        const uml = await readFile(snapshotPath, 'utf-8');
        const storageLayout = parseUML(uml);
        console.log(storageLayout);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
