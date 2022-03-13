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
var chrome;
(function (chrome) {
    class browser {
        constructor(Script, Config) {
            this.Page = [];
            this.ValueParamters = [];
            this.Script = Script;
            this.Config = Config;
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
                this.Page.push(page);
                return page;
            });
        }
        Event(Operation, Page) {
            var _a, _b, _c, _d;
            return __awaiter(this, void 0, void 0, function* () {
                let StartWaitTime = Operation.StartWaitTime || 0;
                let EndWaitTime = Operation.EndWaitTime || 0;
                yield Page.waitForTimeout(StartWaitTime);
                yield Page.waitForSelector(Operation.ElementSelector);
                switch (Operation.Event) {
                    case "Click":
                        yield Page.click(Operation.ElementSelector);
                        break;
                    case "Focus":
                        yield Page.focus(Operation.ElementSelector);
                        break;
                    case "Input":
                        yield Page.focus(Operation.ElementSelector);
                        let value_Input = Operation.Value ? Operation.Value.toString() || "" : Operation.ValueParamter ? this.ValueParamters.filter(i => { var _a; return i.ValueKey == ((_a = Operation.ValueParamter) === null || _a === void 0 ? void 0 : _a.ValueKey); }).length ? ((_a = this.ValueParamters.filter(i => { var _a; return i.ValueKey == ((_a = Operation.ValueParamter) === null || _a === void 0 ? void 0 : _a.ValueKey); })[0].Value) === null || _a === void 0 ? void 0 : _a.toString()) || "" : new TypeError("ValueParamter is null.") : new TypeError("Can't find Value or ValueParamter.");
                        if (value_Input instanceof TypeError)
                            throw value_Input;
                        yield Page.keyboard.type(value_Input);
                        break;
                    case "Select":
                        yield Page.select(Operation.ElementSelector, ((_b = Operation.Value) === null || _b === void 0 ? void 0 : _b.toString()) || "");
                        break;
                    case "ScreenShot":
                        yield Page.waitForTimeout(EndWaitTime);
                        return yield this.ScreenShot(Operation.ScreenShotConfig || { width: this.Config.ViewWidth, height: this.Config.ViewHeight }, Page, (yield Page.$(Operation.ElementSelector)));
                    case "GetValue":
                        let element = yield Page.$(Operation.ElementSelector);
                        let value = yield ((_c = (yield (element === null || element === void 0 ? void 0 : element.getProperty("value")))) === null || _c === void 0 ? void 0 : _c.jsonValue());
                        this.AddValueParamter(((_d = Operation.ValueParamter) === null || _d === void 0 ? void 0 : _d.ValueKey) || "", value);
                        break;
                    case "ClearInput":
                        let element_ClearInput = yield Page.$(Operation.ElementSelector);
                        let value_ClearInput = yield Page.evaluate(el => el.textContent, element_ClearInput);
                        yield Page.focus(Operation.ElementSelector);
                        for (let i = 0; i < value_ClearInput.length; i++) {
                            yield Page.keyboard.press('Backspace');
                        }
                        break;
                    default:
                        throw new TypeError(`Can't find event:${Operation.Event}`);
                }
                yield Page.waitForTimeout(EndWaitTime);
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
        Start() {
            var e_1, _a;
            var _b;
            return __awaiter(this, void 0, void 0, function* () {
                yield this.launch();
                let Page = yield this.CreatePage();
                yield Page.goto(this.HrefToString(this.Script.StartHref));
                try {
                    for (var _c = __asyncValues(this.Script.Operations), _d; _d = yield _c.next(), !_d.done;) {
                        let item = _d.value;
                        yield this.Event(item, Page);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) yield _a.call(_c);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                if (this.Script.ScreenShot)
                    yield this.ScreenShot(this.Script.ScreenShot, Page);
                yield Page.close();
                yield ((_b = this._Browser) === null || _b === void 0 ? void 0 : _b.close());
            });
        }
    }
    chrome.browser = browser;
})(chrome = exports.chrome || (exports.chrome = {}));
