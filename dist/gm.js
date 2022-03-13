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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gm_1 = __importDefault(require("gm"));
const fs_1 = __importDefault(require("fs"));
const tesseract_js_1 = require("tesseract.js");
const GM = gm_1.default.subClass({ imageMagick: true });
class gm {
    static Verification(buffer) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((reslove, reject) => {
                this.ResetPic(buffer).then(this.ReadText).then(reslove).catch(reject);
            });
        });
    }
    static ResetPic(buffer) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((reslove, reject) => {
                //.despeckle()
                GM(buffer).setFormat('png').noise(0)
                    .toBuffer((err, buffer) => {
                    if (err)
                        reject(err);
                    reslove(buffer);
                });
            });
        });
    }
    static ReadText(buffer) {
        return __awaiter(this, void 0, void 0, function* () {
            let worker = tesseract_js_1.createWorker({
            // logger: m => console.log(m)
            });
            yield worker.load();
            yield worker.loadLanguage('eng');
            yield worker.initialize('eng');
            yield worker.setParameters({
                tessedit_char_whitelist: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                tessedit_pageseg_mode: "7" /* SINGLE_LINE */
            });
            let { data } = yield worker.recognize(buffer);
            fs_1.default.writeFileSync("./test01.png", buffer);
            console.log(data.text);
            return data.text;
        });
    }
    static VerificationLearning() {
        return __awaiter(this, void 0, void 0, function* () {
            let worker = tesseract_js_1.createWorker({});
            yield worker.load();
            yield worker.loadLanguage('eng');
            yield worker.initialize('eng');
            yield worker.setParameters({
                tessedit_char_whitelist: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
                tessedit_pageseg_mode: "7" /* SINGLE_LINE */,
                tessjs_create_box: "1"
            });
            let { data } = yield worker.recognize("https://afrc.mnd.gov.tw/EFR/Verification/Verification.aspx");
            console.log(data.box, data.text);
            // return new Promise((reslove, reject) => {
            // Tesseract.recognize(
            //     "https://afrc.mnd.gov.tw/EFR/Verification/Verification.aspx",
            //     'eng',
            // ).then(reslove).catch(reject);
            // });
        });
    }
    static VerificationLearningTest(buffer) {
        return __awaiter(this, void 0, void 0, function* () {
            let worker = tesseract_js_1.createWorker({});
            yield worker.load();
            yield worker.loadLanguage('eng');
            yield worker.initialize('eng');
            yield worker.setParameters({
                tessedit_char_whitelist: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                tessedit_pageseg_mode: "7" /* SINGLE_LINE */,
                tessjs_create_box: "1",
            });
            let { data } = yield worker.recognize(buffer);
            console.log(data.box, data.text, data.words);
            // return new Promise((reslove, reject) => {
            // Tesseract.recognize(
            //     "https://afrc.mnd.gov.tw/EFR/Verification/Verification.aspx",
            //     'eng',
            // ).then(reslove).catch(reject);
            // });
        });
    }
}
exports.default = gm;
