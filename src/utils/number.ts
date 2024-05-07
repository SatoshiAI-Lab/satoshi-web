export const utilNum = {
  transferToNumber(inputNumber: number | string) {
    if (isNaN(Number(inputNumber))) {
      return `${inputNumber}` as string
    }
    inputNumber = '' + inputNumber
    inputNumber = parseFloat(inputNumber)
    let eformat = inputNumber.toExponential() // 转换为标准的科学计数法形式（字符串）
    let tmpArray = eformat.match(/\d(?:\.(\d*))?e([+-]\d+)/) // 分离出小数值和指数值
    let number = inputNumber.toFixed(
      Math.max(0, (tmpArray?.[1] || '').length - Number(tmpArray?.[2] || 0))
    )
    return number as string
  },
}
