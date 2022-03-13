import { chrome } from './browser';

async function Example(): Promise<void> {
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
        { ElementSelector: "#ContentPlaceHolder2_txtVer", Event: "Input", ValueParamter: { ValueKey: "ContentPlaceHolder2_txtbirth", type: "set" } },
        { ElementSelector: "#ContentPlaceHolder2_ImageButton1", Event: "ScreenShot", ScreenShotConfig: { width: 1903, height: 630, path: "./Example_ElementScreenShot.png", type: "png", encoding: "binary" } }
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
        ScreenShot: ScreenShot
    }
    let Proxy: chrome.ProxyInfo = {
        VpnServer: "219.104.228.13",
        username: "vpn",
        password: "vpn"
    }
    let exampleConfig: chrome.Config = {
        ViewHeight: 630,
        ViewWidth: 1903,
        headless: false,
        ProxyInfo: Proxy
    }
    let browser: chrome.browser = new chrome.browser(exampleScript, exampleConfig);
    await browser.Start();
}
Example();