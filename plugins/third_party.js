import Vue from "vue";
import "~/node_modules/ag-grid/dist/styles/ag-grid.css";
import "~/node_modules/ag-grid/dist/styles/ag-theme-material.css";
import "ag-grid-enterprise/main";
import { LicenseManager } from "ag-grid-enterprise/main";
import IEcharts from "vue-echarts-v3/src/full.js";
import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
import VModal from "vue-js-modal/dist/ssr.index";
import "~/node_modules/vue-js-modal/dist/styles.css";

LicenseManager.setLicenseKey(
  "Stratech_SA_(Pty)_Ltd_MultiApp_1Devs19_June_2019__MTU2MDg5ODgwMDAwMA==5440291e4cf377d6228543fd5db11745"
);

Vue.component("chart", IEcharts);

UIkit.use(Icons);

Vue.use(VModal, { dialog: true });
