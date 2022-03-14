import { Csv } from "./CsvToJson";

const request = require('native-request');

export namespace Vpn {
    export class GetVpnAddress {
        public static async GetJson(): Promise<VpnData[]> {
            return new Promise((reslove, reject) => {
                request.request({
                    url: "http://www.vpngate.net/api/iphone/",
                    method: 'GET',
                }, function (err: string, data: string, status: number, headers: any) {
                    if (err) reject(new TypeError(err));
                    let result: VpnData[] = [];
                    let d: Array<any> = Csv.csv2Json.Convert(data);
                    d.forEach(i => {
                        if (i["*vpn_servers"].split(',')[0].length > 1) {
                            let [DDNSServerName, IPAddress, Fraction, Ping, Throughput, CountryRealName, CountryName, NumberOfVPNSessions, temp1, TotalUser, CumulativeTransfer, temp2, OperatorName, temp3, temp4] = i["*vpn_servers"].split(',');
                            let item: VpnData = { DDNSServerName: `${DDNSServerName}.opengw.net`, IPAddress: IPAddress, Fraction: Fraction, Ping: Ping, Throughput: Throughput, CountryRealName: CountryRealName, CountryName: CountryName, NumberOfVPNSessions: NumberOfVPNSessions, temp1: temp1, TotalUser: TotalUser, CumulativeTransfer: CumulativeTransfer, temp2: temp2, OperatorName: OperatorName, temp3: temp3, temp4: temp4, }
                            result.push(item);
                        }
                    });
                    reslove(result);
                });
            })
        }
    }
    export interface VpnData {
        DDNSServerName: string;
        IPAddress: string;
        Fraction: number;
        Ping: number;
        Throughput: number;
        CountryRealName: string;
        CountryName: string;
        NumberOfVPNSessions: number;
        temp1: number;
        TotalUser: number;
        CumulativeTransfer: number;
        temp2: string;
        OperatorName: string;
        temp3: string;
        temp4: string;
    }
}