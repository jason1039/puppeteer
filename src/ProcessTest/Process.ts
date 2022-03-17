import { chrome } from "./browser";

const request = require('native-request');

export namespace ProcessTest {
    export class Req {
        public static async Request(info: RequestInfo): Promise<ResponseInfo> {
            return new Promise((reslove, reject) => {
                let options: { url: string, method: string, Cookies?: string, headers?: json } = {
                    url: info.url,
                    method: info.method
                }
                if (info.Cookies) options.Cookies = info.Cookies;
                if (info.header) options.headers = info.header;
                request.request(options, (err: TypeError, data: any, status: number, header: any) => {
                    if (err) reject(err);
                    reslove({ Header: ProcessTest.Req.HeaderToObject(header), data: data });
                });
            });
        }
        public static async Get(info: RequestInfo): Promise<ResponseInfo> {
            return new Promise((reslove, reject) => {
                request.request({
                    url: info.url,
                    method: "get",
                    header: info.header,
                    Cookies: info.Cookies
                }, function (err: any, data: any, status: any, header: any) {
                    if (err) reject(err);
                    reslove({ Header: ProcessTest.Req.HeaderToObject(header), data: data });
                });
            });
        }
        private static HeaderToObject(header: json): ResponseHeader {
            let Header: ResponseHeader = {};
            switch (header["cache-control"]) {
                case "private":
                    Header["cache-control"] = "private";
                    break;
                case "public":
                    header["cache-control"] = "public";
                    break;
                default:
                    break;
            }
            switch (header["content-type"]) {
                case "text/html; charset=utf-8":
                    Header["content-type"] = "text/html; charset=utf-8";
                    break;
                case "application/x-javascript":
                    Header["content-type"] = "application/x-javascript";
                    break;
                case "text/css":
                    Header["content-type"] = "text/css";
                    break;
                case "application/javascript":
                    Header["content-type"] = "application/javascript";
                    break;
                case "image/Png; charset=utf-8":
                    Header["content-type"] = "image/Png; charset=utf-8";
                    break;
                case "application/font-woff2":
                    Header["content-type"] = "application/font-woff2";
                    break;
                case "image/png":
                    Header["content-type"] = "image/png";
                    break;
                default:
                    console.log(header["content-type"]);
                    break;
            }
            if (header["content-length"]) Header["content-length"] = parseInt(header["content-length"].toString());
            if (header.date) Header.Date = header.date.toString();
            if (header["connection"]) Header.connection = header["connection"];
            if (header["content-length"]) Header["content-length"] = parseInt(header["content-length"].toString());
            if (header["set-cookie"]) Header["set-cookie"] = header["set-cookie"].toString();
            if (header["strict-transport-security"]) Header["strict-transport-security"] = header["strict-transport-security"].toString();
            switch (header["tontent-type"]) {
                case "text/html; charset=utf-8":
                    Header["tontent-type"] = "text/html; charset=utf-8";
                    break;
            }
            switch (header["vary"]) {
                case "Accept-Encoding":
                    Header.vary = "Accept-Encoding";
                    break;
            }
            switch (header["x-frame-options"]) {
                case "SAMEORIGIN":
                    Header["x-frame-options"] = "SAMEORIGIN";
                    break;
            }
            return Header;
        }
    }
    interface RequestInfo {
        url: string;
        Cookies?: string;
        header?: json;
        method: string;
    }
    interface ResponseInfo {
        Header: RequestHeader;
        data: json
    }
    interface ResponseHeader extends Header {
        "cache-control"?: "private";
        "content-length"?: number;
        "tontent-type"?: "text/html; charset=utf-8";
        Date?: string;
        "set-cookie"?: string;
        "strict-transport-security"?: string;
        vary?: "Accept-Encoding";
        "x-frame-options"?: "SAMEORIGIN"
    }
    export interface RequestHeader extends Header {
        Accept?: string;
        "Accept-Encoding"?: string;
        "Accept-Language"?: string;
        DNT?: number;
        Host?: string;
        "sec-ch-ua"?: string;
        "sec-ch-ua-mobile"?: "?0",
        "sec-ch-ua-platform"?: "Windows"
        "Sec-Fetch-Dest"?: "document"
        "Sec-Fetch-Mode"?: "navigate"
        "Sec-Fetch-Site"?: "none"
        "Sec-Fetch-User"?: "?1"
        "Upgrade-Insecure-Requests"?: number
        "User-Agent"?: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36"
    }
    interface Header {
        "cache-control"?: string | number | json | undefined;
        "content-type"?: string | number | json | undefined;
        "set-cookie"?: string | number | json | undefined;
        "strict-transport-security"?: string | number | json | undefined;
        "x-frame-options"?: string | number | json | undefined;
        Date?: string | number | json | undefined;
        connection?: string | number | json | undefined;
        "content-length"?: string | number | json | undefined;
    }
    interface json {
        [key: string | number]: string | number | json | undefined;
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

    // for await (let item of t.RequestScripts) {
    //     let temp = await ProcessTest.Req.Request(item);
    //     // console.log(temp.Header);
    // }
    // console.log(t.RequestScripts);

    // let data = await ProcessTest.Req.Get({
    //     url: "https://afrc.mnd.gov.tw/EFR/Default.aspx",
    //     Cookies: {
    //         "_ga": "GA1.3.1707588249.1641177784",
    //         "_ga_4HY8YFTZ2L": "GS1.1.1644401500.2.1.1644403065.60",
    //         "ASP.NET_SessionId": "1qimm5i0qwpdeywbflctoeu3",
    //         "TS01f2532b": "017d3ada8f93986bcd37bfa8634b22eafc5c7c5ce79b178e27217260aa4cbc567c03c53fa55d586bf943494abe3e0ea52aa3ffb8a7492fe93c956f866ecc211d6cfff08c84"
    //     },
    //     header: {
    //         Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    //         "Accept-Encoding": "gzip, deflate, br",
    //         "Accept-Language": "zh-TW,zh;q=0.9,ja;q=0.8,en-US;q=0.7,en;q=0.6",
    //         "cache-control": "max-age=0",
    //         connection: "keep-alive",
    //         DNT: 1,
    //         Host: "afrc.mnd.gov.tw",
    //         "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"',
    //         "sec-ch-ua-mobile": "?0",
    //         "sec-ch-ua-platform": "Windows",
    //         "Sec-Fetch-Dest": "document",
    //         "Sec-Fetch-Mode": "navigate",
    //         "Sec-Fetch-Site": "none",
    //         "Sec-Fetch-User": "?1",
    //         "Upgrade-Insecure-Requests": 1,
    //         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36"
    //     }
    // });
    // console.log(data.Header);
}