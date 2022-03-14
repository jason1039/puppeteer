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
exports.Vpn = void 0;
const CsvToJson_1 = require("./CsvToJson");
const request = require('native-request');
var Vpn;
(function (Vpn) {
    class GetVpnAddress {
        static GetJson() {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((reslove, reject) => {
                    request.request({
                        url: "http://www.vpngate.net/api/iphone/",
                        method: 'GET',
                    }, function (err, data, status, headers) {
                        if (err)
                            reject(new TypeError(err));
                        let result = [];
                        let d = CsvToJson_1.Csv.csv2Json.Convert(data);
                        d.forEach(i => {
                            if (i["*vpn_servers"].split(',')[0].length > 1) {
                                let [DDNSServerName, IPAddress, Fraction, Ping, Throughput, CountryRealName, CountryName, NumberOfVPNSessions, temp1, TotalUser, CumulativeTransfer, temp2, OperatorName, temp3, temp4] = i["*vpn_servers"].split(',');
                                let item = { DDNSServerName: `${DDNSServerName}.opengw.net`, IPAddress: IPAddress, Fraction: Fraction, Ping: Ping, Throughput: Throughput, CountryRealName: CountryRealName, CountryName: CountryName, NumberOfVPNSessions: NumberOfVPNSessions, temp1: temp1, TotalUser: TotalUser, CumulativeTransfer: CumulativeTransfer, temp2: temp2, OperatorName: OperatorName, temp3: temp3, temp4: temp4, };
                                result.push(item);
                            }
                        });
                        reslove(result);
                    });
                });
            });
        }
    }
    Vpn.GetVpnAddress = GetVpnAddress;
})(Vpn = exports.Vpn || (exports.Vpn = {}));
