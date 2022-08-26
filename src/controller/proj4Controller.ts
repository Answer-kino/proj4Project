import IController from "../interface/IController";
import ApiResponse from "src/utility/apiResponse";
import ApiError from "src/utility/apiError";
import { StatusCodes } from "http-status-codes";
import iconv from "iconv-lite";
import proj4 from "proj4";
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { roadNameAddressHandler } from "src/model/proj4";

export default class proj4Controller {
  static proj4VerticalLine: IController = async (req, res) => {
    const fileNameReg = /entrc*/;
    const dirPath: string = "D:\\공공데이터\\주소기반산업지원서비스_주소\\제공하는 주소\\202207_위치정보요약DB_전체분";
    const verticalLinePath: string =
      "D:\\공공데이터\\주소기반산업지원서비스_주소\\제공하는 주소\\202207_위치정보요약DB_전체분\\verticalLine";
    const firstProjection =
      "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs"; // from
    const secondProjection = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"; // to

    try {
      const dir = readdirSync(dirPath);
      const fileList = dir.filter(fileName => {
        return fileNameReg.test(fileName);
      });

      fileList.map(fileName => {
        console.log(fileName, " start!");
        try {
          const file = readFileSync(dirPath + "\\" + fileName);

          // euckr decoding
          const decodingFile = iconv.decode(file, "euc-kr");

          const lineArr = decodingFile.toString().split("\r\n");
          // last Line null check
          if (lineArr[lineArr.length - 1].length === 0) {
            lineArr.pop();
          }
          let vlStr = "";
          lineArr.map((line, index) => {
            console.log(`${index}/${lineArr.length} ${((index / lineArr.length) * 100).toFixed(1)}%`);
            const strArr = line.toString().split("|");
            const utmkX: number = Number(strArr[16]);
            const utmkY: number = Number(strArr[17]);

            const WGS84 = proj4(firstProjection, secondProjection, [utmkX, utmkY]);
            const wgs84X = WGS84[1];
            const wgs84Y = WGS84[0];
            line += `|${wgs84X}|${wgs84Y}`;
            vlStr += `${line}\n`;
          });
          console.log(fileName, " write json file!");
          writeFileSync(verticalLinePath + "\\" + fileName.split(".")[0] + ".json", vlStr);
          console.log(fileName, " create file!");
        } catch (error) {}
      });
      ApiResponse.result(res, StatusCodes.OK);
    } catch (error: any) {
      ApiError.regist(error);
      ApiResponse.error(res, error);
    }
  };

  static proj4JSON: IController = async (req, res) => {
    const success: Array<object> = [];
    const fileNameReg = /entrc*/;
    const dirPath: string = "D:\\공공데이터\\주소기반산업지원서비스_주소\\제공하는 주소\\202207_위치정보요약DB_전체분";
    const jsonPath: string =
      "D:\\공공데이터\\주소기반산업지원서비스_주소\\제공하는 주소\\202207_위치정보요약DB_전체분\\json";
    const firstProjection =
      "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs"; // from
    const secondProjection = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"; // to
    try {
      const dir = readdirSync(dirPath);
      const fileList = dir.filter(fileName => {
        return fileNameReg.test(fileName);
      });

      fileList.map(fileName => {
        console.log(fileName, " start!");
        const result: Array<object> = [];
        try {
          const file = readFileSync(dirPath + "\\" + fileName);

          // euckr decoding
          const decodingFile = iconv.decode(file, "euc-kr");

          const lineArr = decodingFile.toString().split("\r\n");
          lineArr.pop();

          for (const lineNum in lineArr) {
            const str = lineArr[lineNum].toString().split("|");
            const strObj = roadNameAddressHandler(str);
            const WGS84 = proj4(firstProjection, secondProjection, [strObj!.utmX, strObj!.utmY]);
            strObj.wgs84X = WGS84[1];
            strObj.wgs84Y = WGS84[0];

            result.push(strObj);
            success.push({ fileName, original: lineArr.length, result: result.length });
          }
          console.log(fileName, " write json file!");
          writeFileSync(jsonPath + "\\" + fileName.split(".")[0] + ".json", `${JSON.stringify(result)}`);
          console.log(fileName, " create file!");
        } catch (error) {
          console.log(fileName, " error!");
          console.log(error);
        }
        console.log(fileName, " end!");
      });

      ApiResponse.result(res, StatusCodes.OK, success);
    } catch (error: any) {
      ApiError.regist(error);
      ApiResponse.error(res, error);
    }
  };

  static proj4TestController: IController = async (req, res) => {
    const utmX = 953193.346779;
    const utmY = 1954097.453223;

    const firstProjection =
      "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs"; // from
    const secondProjection = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"; // to

    const WGS84 = proj4(firstProjection, secondProjection, [utmX, utmY]);

    res.send(`${WGS84[1]}, ${WGS84[0]}`);
  };
}
