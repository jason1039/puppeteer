import puppeteer from 'puppeteer';
import { Vpn } from './GetVpnAddress';
import { AxiosRequestConfig, Method } from 'axios';

export namespace chrome {
    export class browser {
        private _Browser?: puppeteer.Browser;
        private Pages: Array<puppeteer.Page> = [];
        private Proxy?: ProxyInfo;
        private Script: Script;
        private Config: Config;
        private ValueParamters: ValueParamter[] = [];
        private _ReactionTime: number = 0;
        private _RequestScripts: RequestScript[] = [];
        public readonly StartTime: string = new Date().toISOString();
        private _EndTime: string = new Date().toISOString();
        get ReactionTime(): number {
            return this._ReactionTime;
        }
        get EndTime(): string {
            return this._EndTime;
        }
        get RequestScripts(): RequestScript[] {
            return this._RequestScripts;
        }
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

            page.on("request", async (event: puppeteer.HTTPRequest) => {
                let method: Method = "GET";
                switch (event.method().toUpperCase()) {
                    case "GET":
                        method = "GET";
                        break;
                    case "POST":
                        method = "POST";
                        break;
                }
                let scr: RequestScript = {
                    url: event.url(),
                    method: method,
                    headers: event.headers()
                }
                if (event.postData()) scr.data = event.postData();
                let cks: string[] = [];
                if (await page.client().send('Network.getAllCookies')) {
                    let temp = await page.client().send('Network.getAllCookies');
                    temp.cookies.forEach(i => {
                        cks.push(`${i.name}=${i.value}`);
                    });
                }
                if (cks.length) scr.Cookies = cks.join('; ');
                this._RequestScripts.push(scr);
            });
            this.Pages.push(page);
            return page;
        }
        private async Event(Operation: Operation): Promise<any> {
            let StartWaitTime: number = Operation.StartWaitTime || 0;
            let EndWaitTime: number = Operation.EndWaitTime || 0;
            await this.Pages[this.Pages.length - 1]?.waitForTimeout(StartWaitTime);
            this._ReactionTime -= Date.now();
            await this.Pages[this.Pages.length - 1]?.waitForSelector(Operation.ElementSelector);
            this._ReactionTime += Date.now();
            switch (Operation.Event) {
                case "Click":
                    await this.Pages[this.Pages.length - 1].click(Operation.ElementSelector);
                    break;
                case "Focus":
                    await this.Pages[this.Pages.length - 1].focus(Operation.ElementSelector);
                    break;
                case "Input":
                    await this.Pages[this.Pages.length - 1].focus(Operation.ElementSelector);
                    let value_Input: string | TypeError = Operation.Value ? Operation.Value.toString() || "" : Operation.ValueParamter ? this.ValueParamters.filter(i => i.ValueKey == Operation.ValueParamter?.ValueKey).length ? this.ValueParamters.filter(i => i.ValueKey == Operation.ValueParamter?.ValueKey)[0].Value?.toString() || "" : new TypeError("ValueParamter is null.") : new TypeError("Can't find Value or ValueParamter.");
                    if (value_Input instanceof TypeError) throw value_Input;
                    await this.Pages[this.Pages.length - 1].keyboard.type(value_Input);
                    break;
                case "Select":
                    await this.Pages[this.Pages.length - 1].select(Operation.ElementSelector, Operation.Value?.toString() || "");
                    break;
                case "ScreenShot":
                    await this.Pages[this.Pages.length - 1].waitForTimeout(EndWaitTime);
                    return await this.ScreenShot(Operation.ScreenShotConfig || { width: this.Config.ViewWidth, height: this.Config.ViewHeight }, this.Pages[this.Pages.length - 1], (await this.Pages[this.Pages.length - 1].$(Operation.ElementSelector)));
                case "GetValue":
                    let element = await this.Pages[this.Pages.length - 1].$(Operation.ElementSelector);
                    let value = await (await element?.getProperty("value"))?.jsonValue() as string;
                    this.AddValueParamter(Operation.ValueParamter?.ValueKey || "", value);
                    break;
                case "ClearInput":
                    let element_ClearInput = await this.Pages[this.Pages.length - 1].$(Operation.ElementSelector);
                    let value_ClearInput = await this.Pages[this.Pages.length - 1].evaluate(el => el.textContent, element_ClearInput);
                    await this.Pages[this.Pages.length - 1].focus(Operation.ElementSelector);
                    for (let i = 0; i < value_ClearInput.length; i++) {
                        await this.Pages[this.Pages.length - 1].keyboard.press('Backspace');
                    }
                    break;
                case "NewPage":
                    await this.CreatePage();
                    break;
                case "ClosePage":
                    await this.Pages[this.Pages.length - 1].close();
                    break;
                case "Goto":
                    if (!Operation.GotoUrl) throw new TypeError("Can't find GotoUrl.");
                    this._ReactionTime -= Date.now();
                    await this.Pages[this.Pages.length - 1].goto(Operation.GotoUrl);
                    this._ReactionTime += Date.now();
                    break;
                case "UpdateValueParamter":
                    if (!Operation.UpdateValueParamter) throw new TypeError("Hasn't UpdateValueParamter.");
                    if (!Operation.ValueParamter) throw new TypeError("Hasn't ValueParamter.");
                    if (!this.ValueParamters.filter(i => i.ValueKey == Operation.ValueParamter?.ValueKey).length) throw new TypeError("Can't find ValueParamter.");
                    let Value_UpdateValueParamter: string = this.ValueParamters.filter(i => i.ValueKey == Operation.ValueParamter?.ValueKey)[0].Value?.toString() || "";
                    this.SetParamter(Operation.ValueParamter.ValueKey, Operation.UpdateValueParamter(Value_UpdateValueParamter));
                    break;
                default:
                    throw new TypeError(`Can't find event:${Operation.Event}`);
            }
            await this.Pages[this.Pages.length - 1]?.waitForTimeout(EndWaitTime);
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
        private GetParamter(ValueKey: string): string {
            if (!this.ValueParamters.filter(i => i.ValueKey == ValueKey).length) throw new TypeError("Can't find this value.");
            return this.ValueParamters.filter(i => i.ValueKey)[0].Value?.toString() || "";
        }
        private SetParamter(ValueKey: string, Value: string): void {
            if (!this.ValueParamters.filter(i => i.ValueKey == ValueKey).length) throw new TypeError("Can't find this value.");
            this.ValueParamters.filter(i => i.ValueKey)[0].Value = Value;
        }
        public static async PressureTest(Script: Script, Config: Config, TotalCount: number): Promise<Array<{ StartTime: string, ReactionTime: number, EndTime: string }>> {
            return new Promise(async (reslove, reject) => {
                let vpns: Vpn.VpnData[] = await this.GetVpnAddress();
                let data: Promise<{ StartTime: string, ReactionTime: number, EndTime: string }>[] = [];
                for (let i = 0; i < Math.floor(TotalCount); i++) {
                    let vpn: Vpn.VpnData = vpns[i % vpns.length];
                    Config.ProxyInfo = {
                        VpnServer: vpn.IPAddress,
                        username: "vpn",
                        password: "vpn"
                    }
                    let s: Script = {
                        StartHref: Script.StartHref,
                        Operations: []
                    }
                    if (Script.ScreenShot) s.ScreenShot = Script.ScreenShot;
                    Script.Operations.forEach(i => {
                        s.Operations.push(i);
                    });
                    let c: Config = { ...Config };
                    let temp = new browser(s, c);
                    data.push(temp.Start());
                }
                Promise.all(data).then((d) => {
                    let result: Array<{ StartTime: string, ReactionTime: number, EndTime: string }> = [];
                    d.forEach(i => {
                        result.push({
                            StartTime: i.StartTime,
                            ReactionTime: i.ReactionTime,
                            EndTime: i.EndTime
                        })
                    });
                    reslove(result);
                });
            });
        }
        public static async CreatePressureTestConfig(Script: Script, Config: Config, TotalCount: number): Promise<{ Script: Script, Config: Config }[]> {
            let result: { Script: Script, Config: Config }[] = [];
            let vpns: Vpn.VpnData[] = await this.GetVpnAddress();
            for (let i = 0; i < Math.floor(TotalCount); i++) {
                let vpn: Vpn.VpnData = vpns[vpns.length % i];
                Config.ProxyInfo = {
                    VpnServer: vpn.IPAddress,
                    username: "vpn",
                    password: "vpn"
                }
                result.push({
                    Script: Script,
                    Config: Config
                })
            }
            return result;
        }
        public static async GetVpnAddress(): Promise<Vpn.VpnData[]> {
            return await Vpn.GetVpnAddress.GetJson();
        }
        public async Start(): Promise<{ StartTime: string, ReactionTime: number, EndTime: string }> {
            await this.launch();
            this.Script.Operations.unshift({
                ElementSelector: "body",
                Event: "Goto",
                GotoUrl: this.HrefToString(this.Script.StartHref)
            });
            this.Script.Operations.unshift({
                ElementSelector: "body",
                Event: "NewPage",
            });
            if (this.Script.ScreenShot)
                this.Script.Operations.push({ ElementSelector: "body", Event: "ScreenShot", ScreenShotConfig: this.Script.ScreenShot })
            this.Script.Operations.push({
                ElementSelector: "body",
                Event: "ClosePage",
            });
            for await (let item of this.Script.Operations) {
                await this.Event(item);
            }
            await this._Browser?.close();
            this._EndTime = new Date().toISOString();
            return { StartTime: this.StartTime, ReactionTime: this.ReactionTime, EndTime: this.EndTime };
        }
        public async GetRequestScript() {
            await this.Start();
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
        Event: "Input" | "Click" | "Focus" | "Select" | "ScreenShot" | "GetValue" | "ClearInput" | "NewPage" | "ClosePage" | "Goto" | "UpdateValueParamter";
        Value?: number | string | boolean;
        Frequency?: number;
        StartWaitTime?: number;
        EndWaitTime?: number;
        ScreenShotConfig?: ScreenShot | Base64ScreenShot | BinaryScreenShot;
        Verification?: Verification;
        ValueParamter?: ValueParamterOperation;
        GotoUrl?: string;
        UpdateValueParamter?: Function;
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
    export interface RequestScript extends AxiosRequestConfig {
        url: string;
        Cookies?: string;
    }
    interface json {
        [key: string | number]: any;
    }
}