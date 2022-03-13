import puppeteer from 'puppeteer';

export namespace chrome {
    export class browser {
        private _Browser?: puppeteer.Browser;
        private Page: Array<puppeteer.Page | undefined> = [];
        private Proxy?: ProxyInfo;
        private Script: Script;
        private Config: Config;
        private ValueParamters: ValueParamter[] = [];
        constructor(Script: Script, Config: Config) {
            this.Script = Script;
            this.Config = Config;
        }
        private async launch(): Promise<puppeteer.Browser> {
            let config: puppeteer.BrowserLaunchArgumentOptions = this.Config;
            if (this.Proxy) config.args?.push(`--proxy-server=${this.Config.ProxyInfo?.VpnServer}`);
            this._Browser = await puppeteer.launch(config);
            return this._Browser;
        }
        private async CreatePage(): Promise<puppeteer.Page> {
            if (!this._Browser) throw new TypeError("Please launch browser!");
            let page: puppeteer.Page = await this._Browser?.newPage() || await (await puppeteer.launch()).newPage();
            await page.deleteCookie();
            if (this.Config.ProxyInfo) await page.authenticate(this.Config.ProxyInfo);
            this.Page.push(page);
            return page;
        }
        private async Event(Operation: Operation, Page: puppeteer.Page): Promise<any> {
            let StartWaitTime: number = Operation.StartWaitTime || 0;
            let EndWaitTime: number = Operation.EndWaitTime || 0;
            await Page.waitForTimeout(StartWaitTime);
            await Page.waitForSelector(Operation.ElementSelector);
            switch (Operation.Event) {
                case "Click":
                    await Page.click(Operation.ElementSelector);
                    break;
                case "Focus":
                    await Page.focus(Operation.ElementSelector);
                    break;
                case "Input":
                    await Page.focus(Operation.ElementSelector);
                    let value_Input: string | TypeError = Operation.Value ? Operation.Value.toString() || "" : Operation.ValueParamter ? this.ValueParamters.filter(i => i.ValueKey == Operation.ValueParamter?.ValueKey).length ? this.ValueParamters.filter(i => i.ValueKey == Operation.ValueParamter?.ValueKey)[0].Value?.toString() || "" : new TypeError("ValueParamter is null.") : new TypeError("Can't find Value or ValueParamter.");
                    if (value_Input instanceof TypeError) throw value_Input;
                    await Page.keyboard.type(value_Input);
                    break;
                case "Select":
                    await Page.select(Operation.ElementSelector, Operation.Value?.toString() || "");
                    break;
                case "ScreenShot":
                    await Page.waitForTimeout(EndWaitTime);
                    return await this.ScreenShot(Operation.ScreenShotConfig || { width: this.Config.ViewWidth, height: this.Config.ViewHeight }, Page, (await Page.$(Operation.ElementSelector)));
                case "GetValue":
                    let element = await Page.$(Operation.ElementSelector);
                    let value = await (await element?.getProperty("value"))?.jsonValue() as string;
                    this.AddValueParamter(Operation.ValueParamter?.ValueKey || "", value);
                    break;
                case "ClearInput":
                    let element_ClearInput = await Page.$(Operation.ElementSelector);
                    let value_ClearInput = await Page.evaluate(el => el.textContent, element_ClearInput);
                    await Page.focus(Operation.ElementSelector);
                    for (let i = 0; i < value_ClearInput.length; i++) {
                        await Page.keyboard.press('Backspace');
                    }
                    break;
                default:
                    throw new TypeError(`Can't find event:${Operation.Event}`);
            }
            await Page.waitForTimeout(EndWaitTime);
            return;
        }
        private async ScreenShot(ScreenShot: ScreenShot, Page: puppeteer.Page, Element?: puppeteer.ElementHandle<Element> | null): Promise<Buffer | string> {
            await Page.setViewport(ScreenShot);
            if (ScreenShot.encoding == 'binary') {
                let t: BinaryScreenShot = { height: ScreenShot.height, width: ScreenShot.width, encoding: 'binary' };
                if (ScreenShot.clip) t.clip = ScreenShot.clip;
                if (ScreenShot.fullPage) t.fullPage = ScreenShot.fullPage;
                if (ScreenShot.omitBackground) t.omitBackground = ScreenShot.omitBackground;
                if (ScreenShot.path) t.path = ScreenShot.path;
                if (ScreenShot.quality) t.quality = ScreenShot.quality;
                if (ScreenShot.type) t.type = ScreenShot.type;
                return await this.BinaryScreenShot(t, Page, Element);
            } else {
                let t: Base64ScreenShot = {
                    height: ScreenShot.height,
                    width: ScreenShot.width,
                    encoding: 'base64'
                };
                if (ScreenShot.clip) t.clip = ScreenShot.clip;
                if (ScreenShot.fullPage) t.fullPage = ScreenShot.fullPage;
                if (ScreenShot.omitBackground) t.omitBackground = ScreenShot.omitBackground;
                if (ScreenShot.path) t.path = ScreenShot.path;
                if (ScreenShot.quality) t.quality = ScreenShot.quality;
                if (ScreenShot.type) t.type = ScreenShot.type;
                return await this.Base64ScreenShot(t, Page, Element);
            }
        }
        private async Base64ScreenShot(ScreenShot: Base64ScreenShot, Page: puppeteer.Page, Element?: puppeteer.ElementHandle<Element> | null): Promise<string> {
            await Page.setViewport(ScreenShot);
            let result: string = (Element ? await Element?.screenshot(ScreenShot) : await Page.screenshot(ScreenShot)) as string;
            return result;
        }
        private async BinaryScreenShot(ScreenShot: BinaryScreenShot, Page: puppeteer.Page, Element?: puppeteer.ElementHandle<Element> | null): Promise<Buffer> {
            await Page.setViewport(ScreenShot);
            let result: Buffer = (Element ? await Element?.screenshot(ScreenShot) : await Page.screenshot(ScreenShot)) as Buffer;
            return result;
        }
        private async delay(ms: number): Promise<void> {
            return new Promise(reslove => setTimeout(reslove, ms));
        }
        private HrefToString(Href: Href): string {
            return `${this.Script.StartHref.SchemeName}://${this.Script.StartHref.Host}${this.Script.StartHref.Port ? `:${this.Script.StartHref.Port}` : ``}${this.Script.StartHref.Path ? this.Script.StartHref.Path : ""}`;
        }
        private AddValueParamter(ValueKey: string, Value: string | number): void {
            if (this.ValueParamters.some(i => i.ValueKey == ValueKey)) throw new Error("ValueKey repeat.");
            this.ValueParamters.push({ ValueKey: ValueKey, Value: Value });
        }
        public async Start(): Promise<void> {
            await this.launch();
            let Page = await this.CreatePage();
            await Page.goto(this.HrefToString(this.Script.StartHref));
            for await (let item of this.Script.Operations) {
                await this.Event(item, Page);
            }
            if (this.Script.ScreenShot) await this.ScreenShot(this.Script.ScreenShot, Page);
            await Page.close();
            await this._Browser?.close();
        }
    }
    export interface ProxyInfo {
        username: string;
        password: string;
        VpnServer: string;
    }
    export interface Script {
        StartHref: Href;
        Operations: Operation[];
        ScreenShot?: ScreenShot;
    }
    export interface Href {
        SchemeName: "http" | "https";
        Host: string;
        Port?: number;
        Path?: string;
    }
    export interface Operation {
        ElementSelector: string;
        Event: "Input" | "Click" | "Focus" | "Select" | "ScreenShot" | "GetValue" | "ClearInput";
        Value?: number | string | boolean;
        Frequency?: number;
        StartWaitTime?: number;
        EndWaitTime?: number;
        ScreenShotConfig?: ScreenShot | Base64ScreenShot | BinaryScreenShot;
        Verification?: Verification;
        ValueParamter?: ValueParamterOperation;
    }
    export interface ValueParamter {
        ValueKey: string;
        Value?: number | string;
    }
    export interface ValueParamterOperation extends ValueParamter {
        type: "get" | "set";
    }
    export interface Verification {
        ImgSelector: string;
        InputSelector: string;
    }
    export interface ScreenShot extends puppeteer.ScreenshotOptions {
        width: number;
        height: number;
    }
    export interface Base64ScreenShot extends ScreenShot {
        encoding: 'base64';
        width: number;
        height: number;
    }
    export interface BinaryScreenShot extends ScreenShot {
        encoding?: 'binary' | undefined;
        width: number;
        height: number;
    }
    export interface Config extends puppeteer.BrowserLaunchArgumentOptions {
        ViewWidth: number;
        ViewHeight: number;
        ProxyInfo?: ProxyInfo;
    }
}