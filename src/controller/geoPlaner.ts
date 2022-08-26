import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { StatusCodes } from "http-status-codes";
import { decode } from "iconv-lite";
import ApiError from "src/utility/apiError";
import ApiResponse from "src/utility/apiResponse";
import IController from "../interface/IController";

export default class geoPlanerController {
  static csvToXml: IController = async (req, res) => {
    const fileNameReg = /coordinate*/;
    const dirPath: string = "D:\\공공데이터\\주소기반산업지원서비스_주소\\제공하는 주소\\기초번호";
    const xmlPath: string = "D:\\공공데이터\\주소기반산업지원서비스_주소\\제공하는 주소\\기초번호\\xml";
    try {
      const dir = readdirSync(dirPath);
      const fileList = dir.filter(fileName => {
        return fileNameReg.test(fileName);
      });

      const xmlTitle = '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>';
      const gpxTitle =
        '<gpx version="1.1" creator="http://www.geoplaner.com" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.topografix.com/GPX/1/1" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">';
      const rteTitle = "<rte>\n<name>seoul</name>";
      const gpxEnd = "</gpx>";
      const rteEnd = "</rte>";

      fileList.map(fileName => {
        const file = readFileSync(dirPath + "\\" + fileName);

        const lineArr = file.toString().split("\n");
        // last Line null check
        if (lineArr[lineArr.length - 1].length === 0) {
          lineArr.pop();
        }

        const divisionLineArr: any[] = [];
        for (let i = 0; i <= lineArr.length / 1000000; i++) {
          const start = i * 1000000;
          const end = (i + 1) * 1000000;
          divisionLineArr.push(lineArr.slice(start, end));
        }

        console.log("divisionLineArr length : ", divisionLineArr.length);
        divisionLineArr.map((lineArr: Array<string>, divisionIndex) => {
          let xml = "";
          xml = xmlTitle + "\n";
          xml += gpxTitle + "\n";
          xml += rteTitle + "\n";

          lineArr.map((line, index) => {
            try {
              console.log(
                `[${divisionIndex}] ${index}/${lineArr.length} ${((index / lineArr.length) * 100).toFixed(1)}%`
              );
              const strArr = line.toString().split(" ");
              const rtept = `<rtept lat="${strArr[2]}" lon="${strArr[1]}">`;
              const name = `<name>${strArr[0]}</name>`;
              const rteptEnd = "</rtept>";
              xml += rtept + "\n";
              xml += name + "\n";
              xml += rteptEnd + "\n";
            } catch (error) {
              console.log(line, " error");
            }
          });

          xml += rteEnd + "\n";
          xml += gpxEnd;
          console.log("create xml file");
          mkdirSync(xmlPath, { recursive: true });
          writeFileSync(xmlPath + "\\" + `test${divisionIndex}.xml`, xml);
          console.log("create xml file done");
        });
      });
      ApiResponse.result(res, StatusCodes.OK);
    } catch (error: any) {
      ApiError.regist(error);
      ApiResponse.error(res, error);
    }
  };
}
