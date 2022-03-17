import { chrome } from "./browser";

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Touchscreen } from "puppeteer";

export namespace ProcessTest {
    export class Req {
        private readonly infomations: AxiosRequestConfig[];
        private readonly TestCount: number;
        private RunningRequest: number = 0;
        constructor(info: AxiosRequestConfig[], TestCount: number) {
            this.infomations = info;
            this.TestCount = TestCount;
        }
        public async Start() {
            return new Promise(reslove => {
                let promiseAry: any[] = [];
                for (let i = 0; i < this.TestCount; i++) {
                    this.infomations.forEach(j => {
                        promiseAry.push(this.Request(j));
                    });
                }
                Promise.all(promiseAry).then(reslove);
            });
        }
        // Promise<AxiosResponse<any, any>>
        private async Request(info: AxiosRequestConfig): Promise<AxiosResponse<any, any>> {
            return new Promise(async (reslove, reject) => {
                while (this.RunningRequest > 20) await this.Delay(10);
                this.RunningRequest++;
                info.timeout = 150000;
                let data = await axios(info);
                this.RunningRequest--;
                if (data.status != 200) reject(data);
                reslove(data);
            });
        }
        private async Delay(ms: number): Promise<void> {
            return new Promise(reslove => {
                setTimeout(reslove, Math.floor(ms));
            });
        }

    }
}


test();
async function test() {
    let StartHref: chrome.Href = {
        SchemeName: "https",
        Host: "afrc.mnd.gov.tw",
        Path: "/EFR/Default.aspx"
    }
    let Operations: chrome.Operation[] = [
        { ElementSelector: "#ContentPlaceHolder2_cmdformlogin", Event: "Click" },
        { ElementSelector: "#ContentPlaceHolder2_txtUid", Event: "Input", Value: "A123456789" },
        { ElementSelector: "#ContentPlaceHolder2_txtbirth", Event: "Input", Value: "1110313" },
        { ElementSelector: "#ContentPlaceHolder2_cbocty", Event: "Select", Value: "63000" },
        { ElementSelector: "#ContentPlaceHolder2_txtbirth", Event: "GetValue", ValueParamter: { ValueKey: "ContentPlaceHolder2_txtbirth", type: "get" } },
        { ElementSelector: "body", Event: "UpdateValueParamter", UpdateValueParamter: (Value: string) => `123_${Value}`, ValueParamter: { ValueKey: "ContentPlaceHolder2_txtbirth", type: "set" } },
        { ElementSelector: "#ContentPlaceHolder2_txtVer", Event: "Input", ValueParamter: { ValueKey: "ContentPlaceHolder2_txtbirth", type: "set" } },
        // { ElementSelector: "#ContentPlaceHolder2_ImageButton1", Event: "ScreenShot", ScreenShotConfig: { width: 1903, height: 630, path: "./Example_ElementScreenShot.png", type: "png", encoding: "binary" } },

    ]
    let ScreenShot: chrome.ScreenShot = {
        width: 1903,
        height: 630,
        path: "./Example_PageScreenShot.png",
        type: "png",
        encoding: "binary"
    }
    let exampleScript: chrome.Script = {
        StartHref: StartHref,
        Operations: Operations,
        // ScreenShot: ScreenShot
    }
    let Proxy: chrome.ProxyInfo = {
        VpnServer: "219.104.228.13",
        username: "vpn",
        password: "vpn"
    }
    let exampleConfig: chrome.Config = {
        ViewHeight: 630,
        ViewWidth: 1903,
        headless: true,
        ProxyInfo: Proxy,
    }
    let t = await new chrome.browser(exampleScript, exampleConfig);
    await t.Start();
    let Test = new ProcessTest.Req(t.RequestScripts, 10);
    Test.Start();
}