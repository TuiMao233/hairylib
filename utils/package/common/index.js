"use strict";
/*
 * @Author: Mr.Mao
 * @Date: 2021-06-28 16:47:04
 * @LastEditTime: 2021-07-18 09:37:53
 * @Description:
 * @LastEditors: Mr.Mao
 * @autograph: 任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickByParams = exports.setHtmlStrTagAttr = exports.awaitPromise = exports.hexToRgba = exports.blendColor = exports.generateArray = exports.paramsAnaly = exports.filterInteger = exports.filterPrice = exports.formatUnix = exports.analyUnit = exports.removeStrCode = exports.checkedTypeof = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const lodash_1 = require("lodash");
/**
 * 获取数据类型
 * @param target 检测对象
 * @returns 返回字符串
 */
const checkedTypeof = (target) => {
    return Object.prototype.toString.call(target).slice(8, -1);
};
exports.checkedTypeof = checkedTypeof;
/**
 * 剔除字符串代码字段
 * @param str 字符串
 * @returns 剔除字符串
 */
const removeStrCode = (str) => {
    return str.replace(/<[\/\!]*[^<>]*>/ig, "");
};
exports.removeStrCode = removeStrCode;
/**
 * 如果有单位，如百分比，px单位等，直接返回，如果是纯粹的数值，则加上px单位
 * @param unit 单元
 * @returns string
 */
const analyUnit = (unit) => {
    return typeof unit === 'string' && /[^0-9]/g.test(unit) ? unit : unit + 'px';
};
exports.analyUnit = analyUnit;
/**
 * 时间戳格式化(秒)
 * @param timestamp 格式化时间戳(秒)
 * @param format 格式化时间格式
 * @returns 格式时间字符串
 */
const formatUnix = (timestamp, format = 'YYYY-MM-DD HH:mm:ss') => {
    return dayjs_1.default.unix(timestamp).format(format);
};
exports.formatUnix = formatUnix;
/**
 * 过滤为价格(两位小数点)
 * @param value 传入字符
 */
const filterPrice = (value) => {
    return value
        .replace(/^[^\d+]/, '')
        .replace(/[^\d{1,}.\d{1,}|\d{1,}]/g, '')
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
        .replace(/\.{2,}/g, '.')
        .replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
};
exports.filterPrice = filterPrice;
/**
 * 过滤为正整数
 * @param value 传入字符
 */
const filterInteger = (value) => {
    return value.replace(/^(0+)|[^\d]+/g, '');
};
exports.filterInteger = filterInteger;
/**
 * 地址参数计算
 * @param url 传入url
 * @param params 请求参数
 * @returns 拼接url
 */
const paramsAnaly = (url, params) => {
    const queryStr = Object.keys(params).map((key) => `${key}=${params[key]}`);
    if (queryStr.length > 0) {
        url += '?' + queryStr.join('&');
    }
    return url;
};
exports.paramsAnaly = paramsAnaly;
/**
 * 生成递进的数组
 * @param start 开始数值
 * @param end 结束数值
 * @returns 递进的数组
 */
const generateArray = (start, end) => {
    start = Number(start);
    end = Number(end);
    end = end > start ? end : start;
    return [...Array(end + 1).keys()].slice(start);
};
exports.generateArray = generateArray;
/**
 * 颜色混合器
 * @param colorOne 颜色值
 * @param colorTwo 颜色值
 * @param ratio 根据 colorTwo 混合比例, 0~1 区间, 1 则是完全的 colorTwo
 * @returns 混合颜色
 */
const blendColor = (colorOne, colorTwo, ratio) => {
    ratio = Math.max(Math.min(Number(ratio), 1), 0);
    const r1 = parseInt(colorOne.substring(1, 3), 16);
    const g1 = parseInt(colorOne.substring(3, 5), 16);
    const b1 = parseInt(colorOne.substring(5, 7), 16);
    const r2 = parseInt(colorTwo.substring(1, 3), 16);
    const g2 = parseInt(colorTwo.substring(3, 5), 16);
    const b2 = parseInt(colorTwo.substring(5, 7), 16);
    let r = Math.round(r1 * (1 - ratio) + r2 * ratio);
    let g = Math.round(g1 * (1 - ratio) + g2 * ratio);
    let b = Math.round(b1 * (1 - ratio) + b2 * ratio);
    r = ('0' + (r || 0).toString(16)).slice(-2);
    g = ('0' + (g || 0).toString(16)).slice(-2);
    b = ('0' + (b || 0).toString(16)).slice(-2);
    return '#' + r + g + b;
};
exports.blendColor = blendColor;
/**
 * 将 hex 颜色转成 rgb
 * @param hex
 * @param opacity
 * @returns rgba String
 */
const hexToRgba = (hex, opacity) => {
    const RGBA = 'rgba(' +
        parseInt('0x' + hex.slice(1, 3)) +
        ',' +
        parseInt('0x' + hex.slice(3, 5)) +
        ',' +
        parseInt('0x' + hex.slice(5, 7)) +
        ',' +
        opacity +
        ')';
    return {
        red: parseInt('0x' + hex.slice(1, 3)),
        green: parseInt('0x' + hex.slice(3, 5)),
        blue: parseInt('0x' + hex.slice(5, 7)),
        rgba: RGBA
    };
};
exports.hexToRgba = hexToRgba;
/**
 * 自定义 Promise 等待
 * @param code 等待时间
 */
const awaitPromise = (code = 1000) => {
    return new Promise((resolve) => setTimeout(resolve, code));
};
exports.awaitPromise = awaitPromise;
/**
 * 替换 html string 中任意 tag 内任意 attr 值
 * @param option
 * @returns html string
 */
const setHtmlStrTagAttr = (option) => {
    if ([option.html, option.tag, option.attr, option.value].findIndex(v => typeof v !== 'string') !== -1) {
        throw new Error("option params error");
    }
    const reg = new RegExp('<' + option.tag + '[^>]*(' + option.attr + '=[\'\"](.*?)[\'\"])?[^>]*>', 'gi');
    const subReg = new RegExp(`${option.attr}=[\'\"](.*?)[\'\"]`, 'gis');
    const setHtmlStr = option.html.replace(reg, function (match) {
        if (match.indexOf(option.attr) > 0) {
            //包含option.attr属性,替换option.attr
            return match.replace(subReg, `${option.attr}="${option.value}"`);
        }
        else {
            //不包含option.attr属性,添加option.attr
            const surplus = match.substr(option.tag.length + 2, match.length);
            return `${match.substr(0, option.tag.length + 1)} ${option.attr}="${option.value}"${surplus ? ` ${surplus}` : ''}`;
        }
    });
    if (!option.value) {
        return setHtmlStr.replace(subReg, '');
    }
    else {
        return setHtmlStr;
    }
};
exports.setHtmlStrTagAttr = setHtmlStrTagAttr;
/**
 * 根据过滤返回对应数据
 * @param params
 * @param filters
 * @returns params
 */
const pickByParams = (params, filters) => {
    const pickValue = lodash_1.pickBy(params, (value) => {
        return !filters.some(v => value === v);
    });
    if (Array.isArray(params)) {
        return Object.values(pickValue);
    }
    else {
        return pickValue;
    }
};
exports.pickByParams = pickByParams;
//# sourceMappingURL=index.js.map