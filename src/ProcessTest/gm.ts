// import _GM from 'gm';
// import fs from 'fs';
// import Tesseract from 'tesseract.js';
// import { createWorker } from 'tesseract.js';

// const GM = _GM.subClass({ imageMagick: true });
// export default class gm {
//     public static async Verification(buffer: Buffer): Promise<string> {
//         return new Promise((reslove, reject) => {
//             this.ResetPic(buffer).then(this.ReadText).then(reslove).catch(reject);
//         });
//     }
//     private static async ResetPic(buffer: Buffer): Promise<Buffer> {
//         return new Promise((reslove, reject) => {
//             //.despeckle()
//             GM(buffer).setFormat('png').noise(0)
//                 .toBuffer((err: Error | null, buffer: Buffer) => {
//                     if (err) reject(err);
//                     reslove(buffer)
//                 });
//         });
//     }
//     private static async ReadText(buffer: Buffer): Promise<string> {
//         let worker = createWorker({
//             // logger: m => console.log(m)
//         });
//         await worker.load();
//         await worker.loadLanguage('eng');
//         await worker.initialize('eng');
//         await worker.setParameters({
//             tessedit_char_whitelist: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
//             tessedit_pageseg_mode: Tesseract.PSM.SINGLE_LINE
//         });
//         let { data } = await worker.recognize(buffer);
//         fs.writeFileSync("./test01.png", buffer);
//         console.log(data.text);
//         return data.text;
//     }
//     public static async VerificationLearning(): Promise<void> {
//         let worker = createWorker({});
//         await worker.load();
//         await worker.loadLanguage('eng');
//         await worker.initialize('eng');
//         await worker.setParameters({
//             tessedit_char_whitelist: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
//             tessedit_pageseg_mode: Tesseract.PSM.SINGLE_LINE,
//             tessjs_create_box: "1"
//         });
//         let { data } = await worker.recognize("https://afrc.mnd.gov.tw/EFR/Verification/Verification.aspx");
//         console.log(data.box, data.text);
//         // return new Promise((reslove, reject) => {
//         // Tesseract.recognize(
//         //     "https://afrc.mnd.gov.tw/EFR/Verification/Verification.aspx",
//         //     'eng',
//         // ).then(reslove).catch(reject);
//         // });
//     }
//     public static async VerificationLearningTest(buffer: Buffer): Promise<void> {
//         let worker = createWorker({});
//         await worker.load();
//         await worker.loadLanguage('eng');
//         await worker.initialize('eng');
//         await worker.setParameters({
//             tessedit_char_whitelist: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
//             tessedit_pageseg_mode: Tesseract.PSM.SINGLE_LINE,
//             tessjs_create_box: "1",
//         });
//         let { data } = await worker.recognize(buffer);
//         console.log(data.box, data.text, data.words);
//         // return new Promise((reslove, reject) => {
//         // Tesseract.recognize(
//         //     "https://afrc.mnd.gov.tw/EFR/Verification/Verification.aspx",
//         //     'eng',
//         // ).then(reslove).catch(reject);
//         // });
//     }
// }