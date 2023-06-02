import puppeteer from "puppeteer";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

export const extractArticleContent = async (url) => {
  try {
    const browser = await puppeteer.launch({ headless: "new" }); // Add the headless option
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const content = await page.content();

    const dom = new JSDOM(content, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      throw new Error("No suitable content found");
    }

    await browser.close();
    return article.textContent;
  } catch (error) {
    console.error("Error while extracting article content", error);
    throw error;
  }
};
