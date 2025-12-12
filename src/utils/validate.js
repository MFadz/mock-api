export function isValidIC(ic) {
  const icPattern = /^\d{6}-\d{2}-\d{4}$/;
  return icPattern.test(ic);
}