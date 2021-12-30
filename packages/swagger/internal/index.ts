/*
 * @Author: Mr'Mao https://github.com/TuiMao233
 * @Date: 2021-12-29 11:03:27
 * @LastEditors: Mr'Mao
 * @LastEditTime: 2021-12-30 09:50:56
 */

import { PlainObject } from '@hairy/core'

/** swagger 类型 typescript 映射 */
export const TYPE_MAPPING: PlainObject = {
  integer: 'number',
  TypesLong: 'number',
  TypesString: 'string',
  object: 'Record<string, any>'
}

/** api 导入 ts 类型集合的 命名空间名字 */
export const TS_TYPE_NAME_SPACE = 'SwaggerType'