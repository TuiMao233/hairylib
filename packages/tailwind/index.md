---
title: tailwind
category: 'Config'
---

# @hairy/tailwind

tailwind 的规则集，包含了 Web 端，小程序端等配置，小程序端可以作用于 uniapp
该配置由于打包后识别为 esm 模块，所以需要 esbuild-register 来读取 .ts 配置文件

## Install

`npm install @hairy/tailwind -D`

## Usage

~~~js
// 小程序端的默认配置
import { defineCloudMergeConfig } from '@hairy/tailwind'
const cloudConfig = defineCloudMergeConfig({
    // 这里的配置最终会进行深层合并
})
// web 端的默认配置
import { defineWebMergeConfig } from '@hairy/tailwind'
const webConfig = defineWebMergeConfig({
    // 这里的配置最终会进行深层合并
})
~~~

## Utils

~~~ts
// 用于生成间距信息的工具
import { spacing } from '@hairy/tailwind'
spacing(2000)
// 生成以下数据
{
  "0": "0rem",
  "1": "0.25rem",
  "2": "0.125rem",
  "3": "0.75rem",
  "4": "0.25rem",
  "5": "1.25rem",
  "6": "0.375rem",
  "8": "0.5rem",
  "10": "0.625rem",
  "12": "0.75rem",
  "14": "0.875rem",
  "16": "1rem",
  .......,
  "2000": 'xxxrem'
}
// 配置项
interface SpacingOptions {
  /** 步进值, step 设置为 false 则不进行步进; @default 1 */
  step?: number | boolean
  /** 步进极限值, 到达步进翻倍节点之后, 将以极限值步进 @default 50 */
  stepMax?: number
  /** 步进翻倍节点 @default [16, 48, 80, 256, 320, 384] */
  nodes?: number[]
  /**
   * 单位计算(默认以得出px > rem 单位)
   * @default (num: number) => num / 16
   */
  compute?: (number_: number) => number
  /** 单位 @default 'rem' */
  unit?: string
  /** 生成Key值的前缀 */
  prefix?: string
}
~~~

~~~typescript
// 用于将尺寸反转
import { negative } from '@hairy/tailwind'
negative({'1px': '1px'})
// {'-1px': '-1px'}
~~~

## Config

~~~js
// 默认统一的所有配置
import { defaultConfig } from '@hairy/taiwind'
// 百分比的所有尺寸, 例如 '1/2': '50%',
import { defaultPercentage } from '@hairy/taiwind'
~~~