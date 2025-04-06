import _ from 'lodash'

// eslint-disable-next-line no-unused-vars
type ReplaceFn = ({ path, key, value }: { path: string; key: string; value: Value }) => Value
type Value = Object | number | string | boolean | null | undefined | Function | Symbol | any[]

const recursion = ({
  input,
  replaceFn,
  seen,
  pathStartsWith,
  parentKey,
}: {
  input: Value
  replaceFn: ReplaceFn
  seen: WeakSet<any>
  pathStartsWith: string
  parentKey: string
}): Value => {
  if (['object', 'function', 'symbol'].includes(typeof input) && input !== null) {
    if (seen.has(input)) {
      return '!!!CIRCULAT!!!'
    } else {
      seen.add(input)
    }
  }

  const result = replaceFn({ path: pathStartsWith.replace(/\.$/, ''), key: parentKey, value: input })
  if (!result) {
    return result
  }

  if (_.isArray(result)) {
    return result.map((item, index) => {
      recursion({
        input: item,
        replaceFn,
        seen,
        pathStartsWith: `${pathStartsWith}${index}`,
        parentKey: index.toString(),
      })
    })
  }

  if (_.isObject(result)) {
    const object: any = {}
    for (const [key, value] of Object.entries(result)) {
      object[key] = recursion({
        input: value,
        replaceFn,
        seen,
        pathStartsWith: `${pathStartsWith}${key}`,
        parentKey: key,
      })
    }
    return object
  }
  return result
}

export const deepMap = <T = Value>(input: Value, replaceFn: ReplaceFn): T => {
  const seen = new WeakSet()
  const mappendObject = recursion({ input, replaceFn, seen, pathStartsWith: '', parentKey: '' })
  const clonedMappendObject = _.cloneDeep(mappendObject)
  return clonedMappendObject as T
}
