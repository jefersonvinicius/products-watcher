export function parsePrice(value: any) {
  if (typeof value === 'string') {
    const hasDecimalPart = value.includes('.');
    return parseInt(value.replace('.', '')) * (hasDecimalPart ? 1 : 100);
  }
  if (typeof value === 'number') {
    return value;
  }
  return null;
}
