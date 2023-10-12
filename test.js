import CryptoJS from "crypto-js";
const key = "12345";
const balance = 10.23;
const stringBal = balance.toString();
const enc = CryptoJS.AES.encrypt(stringBal, key);
const dec = CryptoJS.AES.decrypt(enc, key);
console.log(parseFloat(dec.toString(CryptoJS.enc.Utf8)));