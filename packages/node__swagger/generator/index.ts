import { format } from 'prettier'
import { pascalCase } from 'pascal-case'
import { SwaggerBuildConfig, SwaggerOutput, SwaggerAstConfig, SwaggerApi, SwaggerDefinition } from '../_types'
import { TS_TYPE_NAME_SPACE, unshiftDeDupDefinition, varName } from '../internal'
import { spliceHeaderCode, spliceType, spliceTypeField, spliceFunction, spliceArgument } from './utils'

export interface SwaggerGenerateConfig {
  build: SwaggerBuildConfig
  ast: SwaggerAstConfig
  output: SwaggerOutput
}

export const generate = (config: SwaggerGenerateConfig) => {
  const { build, ast, output } = config

  // #region 从配置中读取描述信息和导入信息, 写入文件头, 初始化 code
  const headerCode = spliceHeaderCode(config)

  let apiFileCode = `
  ${headerCode}
  import http from '${build.import?.http || 'axios'}'
  import { AxiosRequestConfig } from 'axios'
  import * as ${TS_TYPE_NAME_SPACE} from '${build.import?.type || output.type.import}'

  `
  if (build.baseURL) {
    apiFileCode += `const baseURL = ${build.baseURL}\n`
  }
  let typeFileCode = `
  ${headerCode}
  /** @响应infer数据取值 */
  export type Response<T> = ${build.responseType || 'T'}
  `
  // #endregion

  // 先处理 function 请求函数的。请求函数会动态增加 definitions
  // 处理函数参数, 函数参数分为 地址栏参数, post body 参数, get params 参数 统一进行聚类处理
  // axios 参数转换 path. body. config. 发起请求前转换数据，响应后转换数据，数据转换基于 axios 默认的数据类型转化之后
  for (const api of ast.apis) {
    // #region 参数映射组装
    const apiArgumentsMap = handleArguments(api, ast.definitions)
    const apiConfigArgumentsMap = {
      baseURL: build.baseURL ? 'baseURL' : '',
      url: 'url',
      method: `method: '${api.method.toLocaleUpperCase()}'`,
      params: apiArgumentsMap.params ? 'params' : '',
      data: apiArgumentsMap.body ? 'data' : '',
      config: '...config'
    }
    // #endregion

    // #region 参数组合成代码, 添加一项 Api

    const apiFunctionArguments = Object.values(apiArgumentsMap).filter(Boolean)
    const apiConfigArguments = Object.values(apiConfigArgumentsMap).filter(Boolean)

    apiFileCode += spliceFunction(api, apiFunctionArguments, apiConfigArguments)
    // #endregion
  }

  // codec types 生成特定规范和格式的 interface 类型
  for (const definition of ast.definitions) {
    const contents = definition.value.map((field) => {
      if (build.paramsPartial) field.required = false
      return spliceTypeField(field)
    })
    typeFileCode += spliceType(definition, contents)
  }

  apiFileCode = format(apiFileCode, { printWidth: 800, parser: 'typescript' })
  typeFileCode = format(typeFileCode, { printWidth: 800, parser: 'typescript' })

  return { apiFileCode, typeFileCode }
}

function handleArguments(api: SwaggerApi, definitions: SwaggerDefinition[]) {
  const apiArgumentsMap = {
    // body   参数: axios({ data: { xxx } })
    body: '',
    // params 参数: /xxx/{name}/eee
    params: '',
    // query  参数: /xxx/rrr?name=xxx
    query: '',
    // config 参数: axios({ ...config })
    config: 'config?: AxiosRequestConfig'
  }
  if (api.request.path.length > 0) {
    const { name } = unshiftDeDupDefinition(definitions, {
      name: varName(pascalCase(`${api.path}/path`)),
      description: api.description,
      value: api.request.path
    })
    apiArgumentsMap.query = spliceArgument('query', name, definitions)
  }
  if (api.request.query.length > 0) {
    const { name } = unshiftDeDupDefinition(definitions, {
      name: varName(pascalCase(`${api.path}/params`)),
      description: api.description,
      value: api.request.query
    })
    apiArgumentsMap.params = spliceArgument('params', name, definitions)
  }
  if (api.request.body) {
    apiArgumentsMap.body = spliceArgument('data', api.request.body, definitions)
  }

  return apiArgumentsMap
}
