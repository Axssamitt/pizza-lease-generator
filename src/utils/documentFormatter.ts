
/**
 * Formats a string as CPF (xxx.xxx.xxx-xx) or CNPJ (xx.xxx.xxx/xxxx-xx)
 * @param value - The input string to format
 * @returns Formatted CPF or CNPJ string
 */
export const formatDocument = (value: string): string => {
  // Remove non-digit characters
  const digits = value.replace(/\D/g, '');
  
  // Format as CNPJ if length is greater than 11
  if (digits.length > 11) {
    // Format as CNPJ: xx.xxx.xxx/xxxx-xx
    return digits
      .slice(0, 14)
      .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
      .replace(/(-\d{1})$/, '-0$1')
      .replace(/(-\d{0})$/, '-00');
  }
  
  // Format as CPF: xxx.xxx.xxx-xx
  return digits
    .slice(0, 11)
    .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    .replace(/(-\d{1})$/, '-0$1')
    .replace(/(-\d{0})$/, '-00');
};
