/*
 * @Author: Mr.Mao
 * @Date: 2021-07-18 09:41:37
 * @LastEditTime: 2021-07-18 09:45:08
 * @Description:
 * @LastEditors: Mr.Mao
 * @autograph: 任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */
import { pickBy, values } from 'lodash'
import { pickByParams } from '..'

describe('pickByParams', () => {
  it('pickBy ojbect attempt', () => {
    const value = pickBy({ a: 1, b: '2', c: 3 }, (value, key) => {
      return typeof value === 'number'
    })
    expect(value).toEqual({ a: 1, c: 3 })
  })

  it('pickBy array attempt', () => {
    const value = pickBy([1, '2', 3], (value, key) => {
      return typeof value === 'number'
    })
    expect(values(value)).toEqual([1, 3])
  })

  it('pickBy ojbect params', () => {
    const value = pickByParams({ a: 1, b: undefined, c: null, d: '' }, ['', undefined, null])
    expect(value).toEqual({ a: 1 })
  })

  it('pickBy array params', () => {
    const value = pickByParams([1, undefined, null, ''], ['', undefined, null])
    expect(value).toEqual([1])
  })
})