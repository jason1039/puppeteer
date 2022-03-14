"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const browser_1 = require("./browser");
function Example() {
    return __awaiter(this, void 0, void 0, function* () {
        let StartHref = {
            SchemeName: "https",
            Host: "afrc.mnd.gov.tw",
            Path: "/EFR/Default.aspx"
        };
        let Operations = [
            { ElementSelector: "#ContentPlaceHolder2_cmdformlogin", Event: "Click", StartWaitTime: 4000 },
            { ElementSelector: "#ContentPlaceHolder2_txtUid", Event: "Input", Value: "A123456789", StartWaitTime: 4000 },
            { ElementSelector: "#ContentPlaceHolder2_txtbirth", Event: "Input", Value: "1110313", StartWaitTime: 4000 },
            { ElementSelector: "#ContentPlaceHolder2_cbocty", Event: "Select", Value: "63000", StartWaitTime: 4000 },
            { ElementSelector: "#ContentPlaceHolder2_txtbirth", Event: "GetValue", ValueParamter: { ValueKey: "ContentPlaceHolder2_txtbirth", type: "get" }, StartWaitTime: 4000 },
            { ElementSelector: "body", Event: "UpdateValueParamter", UpdateValueParamter: (Value) => `123_${Value}`, ValueParamter: { ValueKey: "ContentPlaceHolder2_txtbirth", type: "set" }, StartWaitTime: 4000 },
            { ElementSelector: "#ContentPlaceHolder2_txtVer", Event: "Input", ValueParamter: { ValueKey: "ContentPlaceHolder2_txtbirth", type: "set" }, StartWaitTime: 4000 },
            { ElementSelector: "#ContentPlaceHolder2_ImageButton1", Event: "ScreenShot", ScreenShotConfig: { width: 1903, height: 630, path: "./Example_ElementScreenShot.png", type: "png", encoding: "binary" }, StartWaitTime: 4000 },
        ];
        let ScreenShot = {
            width: 1903,
            height: 630,
            path: "./Example_PageScreenShot.png",
            type: "png",
            encoding: "binary"
        };
        let exampleScript = {
            StartHref: StartHref,
            Operations: Operations,
            ScreenShot: ScreenShot
        };
        let Proxy = {
            VpnServer: "219.104.228.13",
            username: "vpn",
            password: "vpn"
        };
        let exampleConfig = {
            ViewHeight: 630,
            ViewWidth: 1903,
            headless: false,
            ProxyInfo: Proxy,
        };
        yield browser_1.chrome.browser.PressureTest(exampleScript, exampleConfig, 3);
        // let browser: chrome.browser = new chrome.browser(exampleScript, exampleConfig);
        // await browser.Start();
    });
}
Example();
