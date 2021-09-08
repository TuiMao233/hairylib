import { isArray } from 'lodash'

/**
 * 替换 html string 中任意 tag 内任意 attr 值
 * @param html html string
 * @param option
 * @returns
 */
export const setInnerHTMLAttributes = (
  html: string,
  option: {
    tag: string | string[]
    attr: string | string[]
    value: string
  }
) => {
  if (typeof html !== 'string') {
    throw new TypeError('error: html is not string')
  }
  if (Array.isArray(option.attr)) {
    const string_: string = option.attr.reverse().reduce((old, item) => {
      return setInnerHTMLAttributes(old, { ...option, attr: item })
    }, html)
    return string_
  }
  const tags = Array.isArray(option.tag) ? option.tag : [option.tag]
  const transform = (html: string, tag: string) => {
    // 需找带指定属性的标签 > 一行代码
    const replaceReg = new RegExp(
      '<' + tag + '[^>]*(' + option.attr + '=[\'"](.*?)[\'"])?[^>]*>',
      'gi'
    )
    // 选择对应属性的字符  attr='***' | attr="***"
    const subReg = new RegExp(`${option.attr}=['"](.*?)['"]`, 'gis')
    return html.replace(replaceReg, (match) => {
      //包含option.attr属性,替换option.attr
      if (match.indexOf(option.attr as string) > 0) {
        // 如果值为空 则将整条属性替换为 ''
        return match.replace(subReg, option.value ? `${option.attr}="${option.value}"` : '')
      }
      //不包含option.attr属性,添加option.attr
      const prefix = match.slice(0, Math.max(0, tag.length + 1))
      let suffix = match.slice(tag.length + 2, match.length)
      suffix = suffix ? ` ${suffix}` : '>'
      return `${prefix} ${option.attr}="${option.value}"${suffix}`
    })
  }
  return tags.reduce((total, tag) => transform(total, tag), html)
}

/**
 * 移除所有标签的一个或多个属性
 * @param html html string
 * @param attr attr string
 * @returns html
 */
export const removeInnerHTMLAttribute = (html: string, attribute: string | string[]) => {
  return (isArray(attribute) ? attribute : [attribute]).reduce(
    (total, attribute) => total.replace(new RegExp(`${attribute}=['"](.*?)['"]`, 'gis'), ''),
    html
  )
}
