import express from "express";
import geoPlanerController from "src/controller/geoplaner";
import proj4Controller from "src/controller/proj4Controller";

import indexController from "../controller/index";

const router = express.Router();

router.get("/", indexController.indexPage);
router.get("/proj4/JSON", proj4Controller.proj4JSON);
router.get("/proj4/verticalLine", proj4Controller.proj4VerticalLine);
router.get("/proj4Test", proj4Controller.proj4TestController);

router.get("/geoPlaner/csvToxml", geoPlanerController.csvToXml);
export = router;
