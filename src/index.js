const puppeteer = require("puppeteer");
const input = require("./input");
const output = require("./output");

async function _processWebsite(website) {
  console.log("Processing website: ", website.url);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(website.url);

  const content = (await page.content()).replace(/é/g, "e"); // We only need to remove "é".
  const found = content.match(/\b(accessibilite)\b/gmi);

  output.publish({
    "base-url": website.url,
    "current-url": website.url,
    "item": {
      "id": "1",
      "title": "The page mentions the 'Accessibilité' word."
    },
    "result": found && found.length > 0 ? "OK" : "KO",
    "status": "success",
    "metadata": {},
    "topic": "",
    "organization": ""
  });

  await browser.close();
}

async function run() {
  input
    .fetchWebsites()
    .forEach(_processWebsite);
}

run();