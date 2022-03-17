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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chrome = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const GetVpnAddress_1 = require("./GetVpnAddress");
var chrome;
(function (chrome) {
    class browser {
        constructor(Script, Config) {
            this.Pages = [];
            this.ValueParamters = [];
            this._ReactionTime = 0;
            this._RequestScripts = [];
            this.StartTime = new Date().toISOString();
            this._EndTime = new Date().toISOString();
            this.Script = Script;
            this.Config = Config;
        }
        get ReactionTime() {
            return this._ReactionTime;
        }
        get EndTime() {
            return this._EndTime;
        }
        get RequestScripts() {
            return this._RequestScripts;
        }
        launch() {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                let config = this.Config;
                if (this.Proxy)
                    (_a = config.args) === null || _a === void 0 ? void 0 : _a.push(`--proxy-server=${(_b = this.Config.ProxyInfo) === null || _b === void 0 ? void 0 : _b.VpnServer}`);
                this._Browser = yield puppeteer_1.default.launch(config);
                return this._Browser;
            });
        }
        CreatePage() {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._Browser)
                    throw new TypeError("Please launch browser!");
                let page = (yield ((_a = this._Browser) === null || _a === void 0 ? void 0 : _a.newPage())) || (yield (yield puppeteer_1.default.launch()).newPage());
                yield page.deleteCookie();
                if (this.Config.ProxyInfo)
                    yield page.authenticate(this.Config.ProxyInfo);
                page.on("response", (event) => {
                    // console.log(event);
                });
                page.on("request", (event) => __awaiter(this, void 0, void 0, function* () {
                    let scr = {
                        url: event.url(),
                        method: event.method(),
                        headers: event.headers()
                    };
                    if (event.postData())
                        scr.body = event.postData();
                    let cks = [];
                    if (yield page.client().send('Network.getAllCookies')) {
                        let temp = yield page.client().send('Network.getAllCookies');
                        temp.cookies.forEach(i => {
                            cks.push(`${i.name}=${i.value}`);
                        });
                    }
                    if (cks.length)
                        scr.Cookies = cks.join('; ');
                    this._RequestScripts.push(scr);
                    // if (!/.*.js$|.*.css$|.*.png$/.test(event.url())) {
                    //     console.log(event.url());
                    // }
                    // console.log("------------------------------------------------");
                    // console.log(event.url());
                    // console.log(event.method());
                    // let temp = event.postData()?.split('&');
                    // if (temp) {
                    //     temp.forEach(i => {
                    //         console.log(i.split("=")[0]);
                    //         console.log('-');
                    //         console.log(i.split("=")[1]);
                    //     });
                    // }
                    // console.log(event.postData()?.split('&'));
                    // console.log(event.method());
                    // console.log(event.postData());
                    // console.log(event.headers());
                    // console.log(event.headers().c);
                    // console.log(event._response);
                    // console.log(event.url());
                    // console.log(event.headers().Cookies);
                    // console.log(event.headers().cookie);
                    // console.log(event.headers().NET_SessionId);
                    // console.log(event.headers().https);
                    // console.log(event.)
                    // console.log("-------------------------------------------------------------");
                }));
                this.Pages.push(page);
                return page;
            });
        }
        Event(Operation) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return __awaiter(this, void 0, void 0, function* () {
                let StartWaitTime = Operation.StartWaitTime || 0;
                let EndWaitTime = Operation.EndWaitTime || 0;
                yield ((_a = this.Pages[this.Pages.length - 1]) === null || _a === void 0 ? void 0 : _a.waitForTimeout(StartWaitTime));
                this._ReactionTime -= Date.now();
                yield ((_b = this.Pages[this.Pages.length - 1]) === null || _b === void 0 ? void 0 : _b.waitForSelector(Operation.ElementSelector));
                this._ReactionTime += Date.now();
                switch (Operation.Event) {
                    case "Click":
                        yield this.Pages[this.Pages.length - 1].click(Operation.ElementSelector);
                        break;
                    case "Focus":
                        yield this.Pages[this.Pages.length - 1].focus(Operation.ElementSelector);
                        break;
                    case "Input":
                        yield this.Pages[this.Pages.length - 1].focus(Operation.ElementSelector);
                        let value_Input = Operation.Value ? Operation.Value.toString() || "" : Operation.ValueParamter ? this.ValueParamters.filter(i => { var _a; return i.ValueKey == ((_a = Operation.ValueParamter) === null || _a === void 0 ? void 0 : _a.ValueKey); }).length ? ((_c = this.ValueParamters.filter(i => { var _a; return i.ValueKey == ((_a = Operation.ValueParamter) === null || _a === void 0 ? void 0 : _a.ValueKey); })[0].Value) === null || _c === void 0 ? void 0 : _c.toString()) || "" : new TypeError("ValueParamter is null.") : new TypeError("Can't find Value or ValueParamter.");
                        if (value_Input instanceof TypeError)
                            throw value_Input;
                        yield this.Pages[this.Pages.length - 1].keyboard.type(value_Input);
                        break;
                    case "Select":
                        yield this.Pages[this.Pages.length - 1].select(Operation.ElementSelector, ((_d = Operation.Value) === null || _d === void 0 ? void 0 : _d.toString()) || "");
                        break;
                    case "ScreenShot":
                        yield this.Pages[this.Pages.length - 1].waitForTimeout(EndWaitTime);
                        return yield this.ScreenShot(Operation.ScreenShotConfig || { width: this.Config.ViewWidth, height: this.Config.ViewHeight }, this.Pages[this.Pages.length - 1], (yield this.Pages[this.Pages.length - 1].$(Operation.ElementSelector)));
                    case "GetValue":
                        let element = yield this.Pages[this.Pages.length - 1].$(Operation.ElementSelector);
                        let value = yield ((_e = (yield (element === null || element === void 0 ? void 0 : element.getProperty("value")))) === null || _e === void 0 ? void 0 : _e.jsonValue());
                        this.AddValueParamter(((_f = Operation.ValueParamter) === null || _f === void 0 ? void 0 : _f.ValueKey) || "", value);
                        break;
                    case "ClearInput":
                        let element_ClearInput = yield this.Pages[this.Pages.length - 1].$(Operation.ElementSelector);
                        let value_ClearInput = yield this.Pages[this.Pages.length - 1].evaluate(el => el.textContent, element_ClearInput);
                        yield this.Pages[this.Pages.length - 1].focus(Operation.ElementSelector);
                        for (let i = 0; i < value_ClearInput.length; i++) {
                            yield this.Pages[this.Pages.length - 1].keyboard.press('Backspace');
                        }
                        break;
                    case "NewPage":
                        yield this.CreatePage();
                        break;
                    case "ClosePage":
                        yield this.Pages[this.Pages.length - 1].close();
                        break;
                    case "Goto":
                        if (!Operation.GotoUrl)
                            throw new TypeError("Can't find GotoUrl.");
                        this._ReactionTime -= Date.now();
                        yield this.Pages[this.Pages.length - 1].goto(Operation.GotoUrl);
                        this._ReactionTime += Date.now();
                        break;
                    case "UpdateValueParamter":
                        if (!Operation.UpdateValueParamter)
                            throw new TypeError("Hasn't UpdateValueParamter.");
                        if (!Operation.ValueParamter)
                            throw new TypeError("Hasn't ValueParamter.");
                        if (!this.ValueParamters.filter(i => { var _a; return i.ValueKey == ((_a = Operation.ValueParamter) === null || _a === void 0 ? void 0 : _a.ValueKey); }).length)
                            throw new TypeError("Can't find ValueParamter.");
                        let Value_UpdateValueParamter = ((_g = this.ValueParamters.filter(i => { var _a; return i.ValueKey == ((_a = Operation.ValueParamter) === null || _a === void 0 ? void 0 : _a.ValueKey); })[0].Value) === null || _g === void 0 ? void 0 : _g.toString()) || "";
                        this.SetParamter(Operation.ValueParamter.ValueKey, Operation.UpdateValueParamter(Value_UpdateValueParamter));
                        break;
                    default:
                        throw new TypeError(`Can't find event:${Operation.Event}`);
                }
                yield ((_h = this.Pages[this.Pages.length - 1]) === null || _h === void 0 ? void 0 : _h.waitForTimeout(EndWaitTime));
                return;
            });
        }
        ScreenShot(ScreenShot, Page, Element) {
            return __awaiter(this, void 0, void 0, function* () {
                yield Page.setViewport(ScreenShot);
                if (ScreenShot.encoding == 'binary') {
                    let t = { height: ScreenShot.height, width: ScreenShot.width, encoding: 'binary' };
                    if (ScreenShot.clip)
                        t.clip = ScreenShot.clip;
                    if (ScreenShot.fullPage)
                        t.fullPage = ScreenShot.fullPage;
                    if (ScreenShot.omitBackground)
                        t.omitBackground = ScreenShot.omitBackground;
                    if (ScreenShot.path)
                        t.path = ScreenShot.path;
                    if (ScreenShot.quality)
                        t.quality = ScreenShot.quality;
                    if (ScreenShot.type)
                        t.type = ScreenShot.type;
                    return yield this.BinaryScreenShot(t, Page, Element);
                }
                else {
                    let t = {
                        height: ScreenShot.height,
                        width: ScreenShot.width,
                        encoding: 'base64'
                    };
                    if (ScreenShot.clip)
                        t.clip = ScreenShot.clip;
                    if (ScreenShot.fullPage)
                        t.fullPage = ScreenShot.fullPage;
                    if (ScreenShot.omitBackground)
                        t.omitBackground = ScreenShot.omitBackground;
                    if (ScreenShot.path)
                        t.path = ScreenShot.path;
                    if (ScreenShot.quality)
                        t.quality = ScreenShot.quality;
                    if (ScreenShot.type)
                        t.type = ScreenShot.type;
                    return yield this.Base64ScreenShot(t, Page, Element);
                }
            });
        }
        Base64ScreenShot(ScreenShot, Page, Element) {
            return __awaiter(this, void 0, void 0, function* () {
                yield Page.setViewport(ScreenShot);
                let result = (Element ? yield (Element === null || Element === void 0 ? void 0 : Element.screenshot(ScreenShot)) : yield Page.screenshot(ScreenShot));
                return result;
            });
        }
        BinaryScreenShot(ScreenShot, Page, Element) {
            return __awaiter(this, void 0, void 0, function* () {
                yield Page.setViewport(ScreenShot);
                let result = (Element ? yield (Element === null || Element === void 0 ? void 0 : Element.screenshot(ScreenShot)) : yield Page.screenshot(ScreenShot));
                return result;
            });
        }
        delay(ms) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise(reslove => setTimeout(reslove, ms));
            });
        }
        HrefToString(Href) {
            return `${this.Script.StartHref.SchemeName}://${this.Script.StartHref.Host}${this.Script.StartHref.Port ? `:${this.Script.StartHref.Port}` : ``}${this.Script.StartHref.Path ? this.Script.StartHref.Path : ""}`;
        }
        AddValueParamter(ValueKey, Value) {
            if (this.ValueParamters.some(i => i.ValueKey == ValueKey))
                throw new Error("ValueKey repeat.");
            this.ValueParamters.push({ ValueKey: ValueKey, Value: Value });
        }
        GetParamter(ValueKey) {
            var _a;
            if (!this.ValueParamters.filter(i => i.ValueKey == ValueKey).length)
                throw new TypeError("Can't find this value.");
            return ((_a = this.ValueParamters.filter(i => i.ValueKey)[0].Value) === null || _a === void 0 ? void 0 : _a.toString()) || "";
        }
        SetParamter(ValueKey, Value) {
            if (!this.ValueParamters.filter(i => i.ValueKey == ValueKey).length)
                throw new TypeError("Can't find this value.");
            this.ValueParamters.filter(i => i.ValueKey)[0].Value = Value;
        }
        static PressureTest(Script, Config, TotalCount) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((reslove, reject) => __awaiter(this, void 0, void 0, function* () {
                    let vpns = yield this.GetVpnAddress();
                    let data = [];
                    for (let i = 0; i < Math.floor(TotalCount); i++) {
                        let vpn = vpns[i % vpns.length];
                        Config.ProxyInfo = {
                            VpnServer: vpn.IPAddress,
                            username: "vpn",
                            password: "vpn"
                        };
                        let s = {
                            StartHref: Script.StartHref,
                            Operations: []
                        };
                        if (Script.ScreenShot)
                            s.ScreenShot = Script.ScreenShot;
                        Script.Operations.forEach(i => {
                            s.Operations.push(i);
                        });
                        let c = Object.assign({}, Config);
                        let temp = new browser(s, c);
                        data.push(temp.Start());
                    }
                    Promise.all(data).then((d) => {
                        let result = [];
                        d.forEach(i => {
                            result.push({
                                StartTime: i.StartTime,
                                ReactionTime: i.ReactionTime,
                                EndTime: i.EndTime
                            });
                        });
                        reslove(result);
                    });
                }));
            });
        }
        static CreatePressureTestConfig(Script, Config, TotalCount) {
            return __awaiter(this, void 0, void 0, function* () {
                let result = [];
                let vpns = yield this.GetVpnAddress();
                for (let i = 0; i < Math.floor(TotalCount); i++) {
                    let vpn = vpns[vpns.length % i];
                    Config.ProxyInfo = {
                        VpnServer: vpn.IPAddress,
                        username: "vpn",
                        password: "vpn"
                    };
                    result.push({
                        Script: Script,
                        Config: Config
                    });
                }
                return result;
            });
        }
        static GetVpnAddress() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield GetVpnAddress_1.Vpn.GetVpnAddress.GetJson();
            });
        }
        Start() {
            var e_1, _a;
            var _b;
            return __awaiter(this, void 0, void 0, function* () {
                yield this.launch();
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
                    this.Script.Operations.push({ ElementSelector: "body", Event: "ScreenShot", ScreenShotConfig: this.Script.ScreenShot });
                this.Script.Operations.push({
                    ElementSelector: "body",
                    Event: "ClosePage",
                });
                try {
                    for (var _c = __asyncValues(this.Script.Operations), _d; _d = yield _c.next(), !_d.done;) {
                        let item = _d.value;
                        yield this.Event(item);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) yield _a.call(_c);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                yield ((_b = this._Browser) === null || _b === void 0 ? void 0 : _b.close());
                this._EndTime = new Date().toISOString();
                return { StartTime: this.StartTime, ReactionTime: this.ReactionTime, EndTime: this.EndTime };
            });
        }
        GetRequestScript() {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.Start();
            });
        }
    }
    chrome.browser = browser;
})(chrome = exports.chrome || (exports.chrome = {}));
