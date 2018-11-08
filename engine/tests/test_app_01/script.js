import RPGiniaApp from "/src/RPGiniaApp.js";
import testClass from "/src/testClass.js";

const cnv = document.querySelector("canvas");
const ctx = cnv.getContext("2d");

const app = new RPGiniaApp("RPGinia test app 01", cnv, ctx);
let test = new testClass();
// const testClass = new testClass();