interface IRoadNameAddress {
  [key: string]: any;
  시군구코드: string;
  출입구일련번호: string;
  법정동코드: string;
  시도명: string;
  시군구명: string;
  읍면동명: string;
  도로명코드: string;
  도로명: string;
  지하여부: string;
  건물본번: number;
  건물부번: number;
  건물명: string;
  우편번호: string;
  건물용도분류: string;
  건물군여부: string;
  관할행정동: string;
  utmX: number;
  utmY: number;
  wgs84X: number;
  wgs84Y: number;
}
const roadNameAddress: IRoadNameAddress = {
  시군구코드: "",
  출입구일련번호: "",
  법정동코드: "",
  시도명: "",
  시군구명: "",
  읍면동명: "",
  도로명코드: "",
  도로명: "",
  지하여부: "",
  건물본번: NaN,
  건물부번: NaN,
  건물명: "",
  우편번호: "",
  건물용도분류: "",
  건물군여부: "",
  관할행정동: "",
  utmX: NaN,
  utmY: NaN,
  wgs84X: NaN,
  wgs84Y: NaN
};

export const roadNameAddressHandler = (str: Array<any>) => {
  const resultObj = { ...roadNameAddress };
  Object.entries(resultObj).forEach(([key, value], index) => {
    try {
      if (key === "utmX" || key === "utmY" || key === "건물본번" || key === "건물부번") {
        resultObj[key] = Number(str[index]);
      } else {
        resultObj[key] = str[index];
      }
    } catch (error: any) {
      console.log(error);
    }
  });

  return resultObj;
};
