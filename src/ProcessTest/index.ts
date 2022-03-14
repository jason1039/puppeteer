import { chrome } from './browser';
import { Report } from './CreateReport';
import fs from 'fs';
export async function Example(): Promise<void> {
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
    let data = await chrome.browser.PressureTest(exampleScript, exampleConfig, 50);
    let report_temp = new Report.Excel(data);
    let t = await report_temp.GetExcelBuffer();
    fs.writeFileSync("./test.xlsx", t);
    // let browser: chrome.browser = new chrome.browser(exampleScript, exampleConfig);
    // await browser.Start();
}
// Example();