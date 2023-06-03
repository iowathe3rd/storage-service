import { Injectable } from '@nestjs/common';
import { CreateBrowser } from '../libs/puppeteer';

@Injectable()
export class PuppeteerService {
	async getScreenShot(url: string) {
		const browser = await CreateBrowser.getBrowser();
		const page = await browser.newPage();
		console.log(url);
		await page.goto(url);
		await page.setViewport({ width: 1080, height: 1024 });
		return await page.screenshot({
			type: "webp",
			omitBackground: true,
			quality: 50,
		})
	}
}