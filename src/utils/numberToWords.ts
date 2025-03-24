
// Function to convert numbers to words in Portuguese
export function numberToWords(numero: number): string {
  const unidades = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  const dezADezenove = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  const dezenas = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const centenas = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

  // Function to convert chunks of three digits
  function converterGrupo(n: number): string {
    let resultado = '';
    
    // Handle hundreds
    if (Math.floor(n / 100) > 0) {
      if (n === 100) {
        return 'cem';
      }
      resultado += centenas[Math.floor(n / 100)] + ' e ';
      n %= 100;
    }
    
    // Handle tens and units
    if (n >= 10 && n <= 19) {
      resultado += dezADezenove[n - 10];
    } else {
      if (Math.floor(n / 10) > 0) {
        resultado += dezenas[Math.floor(n / 10)];
        if (n % 10 > 0) {
          resultado += ' e ' + unidades[n % 10];
        }
      } else if (n > 0) {
        resultado += unidades[n];
      }
    }
    
    return resultado;
  }

  if (numero === 0) {
    return 'zero';
  }

  // Format the number to handle decimal places
  const [integerPart, decimalPart] = numero.toFixed(2).split('.');
  const intValue = parseInt(integerPart);
  const decValue = parseInt(decimalPart);

  let resultado = '';
  
  // Handle millions
  if (Math.floor(intValue / 1000000) > 0) {
    const milhoes = Math.floor(intValue / 1000000);
    resultado += converterGrupo(milhoes) + ' ' + (milhoes === 1 ? 'milhão' : 'milhões');
    if (intValue % 1000000 > 0) {
      resultado += ' e ';
    }
  }
  
  // Handle thousands
  if (Math.floor((intValue % 1000000) / 1000) > 0) {
    const milhares = Math.floor((intValue % 1000000) / 1000);
    resultado += converterGrupo(milhares) + ' mil';
    if (intValue % 1000 > 0) {
      resultado += ' e ';
    }
  }
  
  // Handle hundreds, tens and units
  if (intValue % 1000 > 0) {
    resultado += converterGrupo(intValue % 1000);
  }
  
  // Complete the result with "reais"
  resultado += ' ' + (intValue === 1 ? 'real' : 'reais');
  
  // Handle decimal part (cents)
  if (decValue > 0) {
    resultado += ' e ' + converterGrupo(decValue) + ' ' + (decValue === 1 ? 'centavo' : 'centavos');
  }
  
  return resultado;
}
