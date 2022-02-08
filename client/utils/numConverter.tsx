export const formatNumber = (num: number, decimalNumber: number): number => {
  //少数第一位で四捨五入
  const returnValue =
    Math.floor(num * Math.pow(10, decimalNumber)) / Math.pow(10, decimalNumber);
  return returnValue;
};
