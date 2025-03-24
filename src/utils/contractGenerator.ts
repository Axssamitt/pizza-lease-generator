
export interface ContractData {
  // Cliente
  clientName: string;
  clientCpf: string;
  clientRg: string;
  clientAddress: string;
  
  // Evento
  eventDate: string;
  eventAddress: string;
  eventStartTime: string;
  eventEndTime: string;
  
  // Quantidades
  adultCount: number;
  childCount: number;
  extraWaiters: number;
  
  // Preços
  adultPrice: number;
  childPrice: number;
  extraWaiterPrice: number;
  
  // Pagamento
  totalValue: number;
  downPayment: number;
  
  // Data assinatura
  signatureDate: string;
}

export const defaultContractData: ContractData = {
  clientName: "",
  clientCpf: "",
  clientRg: "",
  clientAddress: "",
  eventDate: "",
  eventAddress: "",
  eventStartTime: "20:30",
  eventEndTime: "23:30",
  adultCount: 30,
  childCount: 0,
  extraWaiters: 0,
  adultPrice: 55,
  childPrice: 27,
  extraWaiterPrice: 120,
  totalValue: 0,
  downPayment: 0,
  signatureDate: new Date().toLocaleDateString('pt-BR')
};

// Função para formatar valores em moeda brasileira
export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

// Função para calcular valores
export const calculateValues = (data: ContractData): ContractData => {
  const totalValue = 
    (data.adultCount * data.adultPrice) + 
    (data.childCount * data.childPrice) + 
    (data.extraWaiters * data.extraWaiterPrice);
  
  const downPayment = Math.round(totalValue * 0.4);
  
  return {
    ...data,
    totalValue,
    downPayment
  };
};

// Função para calcular a quantidade base de garçons (1 para cada 30 pessoas)
export const calculateBaseWaiters = (adultCount: number, childCount: number): number => {
  const totalGuests = adultCount + childCount;
  return Math.max(1, Math.ceil(totalGuests / 30));
};

// Função para gerar o texto do contrato
export const generateContractText = (data: ContractData): string => {
  const remainingPayment = data.totalValue - data.downPayment;
  const baseWaiters = calculateBaseWaiters(data.adultCount, data.childCount);
  const totalWaiters = baseWaiters + data.extraWaiters;
  
  const waitersText = data.extraWaiters > 0 
    ? `${baseWaiters} garçons${data.extraWaiters > 0 ? ` + ${data.extraWaiters} garçons adicionais` : ''}`
    : `${baseWaiters} garçons`;

  return `
JULIO'S PIZZA HOUSE

CONTRATANTE: ${data.clientName}, CPF/CNPJ: n°${data.clientCpf}, RG: nº ${data.clientRg} residente em Rua: ${data.clientAddress}.

CONTRATADA: JULIO'S PIZZA HOUSE, com sede em Londrina, na Rua Alzira Postali Gewrher, nº 119, bairro Jardim Catuai, Cep 86086-230, no Estado Paraná, inscrita no CPF sob o nº 034.988.389-03, neste ato representada pelo Responsável Sr. Júlio Cesar Fermino.

As partes acima identificadas têm, entre si, justo e acertado o presente Contrato de Prestação de Serviços de Rodizio de pizza para festa, que se regerá pelas cláusulas seguintes e pelas condições de preço, forma e termo de pagamento descritas no presente. 

DO OBJETO DO CONTRATO 

Cláusula 1ª. É objeto do presente contrato a prestação pela CONTRATADA à CONTRATANTE do serviço de rodizio de pizza, em evento que se realizará na data de ${data.eventDate}, no endereço / local: ${data.eventAddress}.

O EVENTO 

Cláusula 2ª. O evento, para cuja realização são contratados os serviços de Rodizio de Pizza, é a festa de confraternização da CONTRATANTE, e contará com a presença de aproximadamente ${data.adultCount} adultos${data.childCount > 0 ? ` e ${data.childCount} crianças` : ''} a serem confirmada uma semana antes do evento.
Parágrafo único. O evento realizar-se-á no horário e local indicado no caput da cláusula 1ª, devendo o serviço de rodizio de pizza a ser prestado das ${data.eventStartTime} até às ${data.eventEndTime} horas.

OBRIGAÇÕES DA CONTRATANTE 

Cláusula 3ª. A CONTRATANTE deverá fornecer à CONTRATADA todas as informações necessárias à realização adequada do serviço de rodizio de pizza, devendo especificar os detalhes do evento, necessários ao perfeito fornecimento do serviço, e a forma como este deverá ser prestado. 

Cláusula 4ª. A CONTRATANTE deverá efetuar o pagamento na forma e condições estabelecidas na cláusula 9ª. 

OBRIGAÇÕES DA CONTRATADA 

Cláusula 5ª. É dever da CONTRATADA oferecer um serviço de rodizio pizza de acordo com as especificações da CONTRATANTE, devendo o serviço iniciar-se às ${data.eventStartTime} e terminar às ${data.eventEndTime} horas.
Parágrafo único. A CONTRATADA está obrigada a fornecer aos convidados do CONTRATANTE produtos de alta qualidade, que deverão ser preparados e servidos dentro de rigorosas normas de higiene e limpeza. 
Obs: O excedente de horário será cobrado 300,00 (trezentos reais) a cada meia hora do horário ultrapassado.

Cláusula 6ª. A CONTRATADA se compromete a fornecer o cardápio escolhido pela CONTRATANTE, cujas especificações, inclusive de quantidade a ser servida, encontram-se em documento anexo ao presente contrato. 

Cláusula 7ª. A CONTRATADA fornecerá pelo menos 1 pizzaiolos e ${waitersText} para servir os convidados nas mesas.

Cláusula 8ª. A CONTRATADA obriga-se a manter todos os seus empregados devidamente uniformizados durante a prestação dos serviços ora contratados, garantindo que todos eles possuem os requisitos de urbanidade, moralidade e educação. 

DO PREÇO E DAS CONDIÇÕES DE PAGAMENTO 
Cláusula 9. O serviço contratado no presente instrumento será remunerado dependendo do numero de pessoas confirmadas uma semana antes do evento. A contratada garante que a quantidade de comida seja suficiente para atender o num de pessoas presentes, estando preparada para atender até 10% a mais do numero de pessoas confirmadas, cobrando o valor de R$ ${data.adultPrice.toFixed(2)} por adulto e R$ ${data.childPrice.toFixed(2)} por crianças no total de ${formatCurrency(data.totalValue)} assim como combinado pelo telefone. O serviço deve ser pago em dinheiro, com uma entrada de ${formatCurrency(data.downPayment)} (depositados em conta, caixa econômica Ag: 1479 conta: 00028090-5 conta corrente) ANTECIPADO, a diferença no ato da festa no valor de ${formatCurrency(remainingPayment)}.

Cláusula 10. O presente contrato poderá ser rescindido unilateralmente por qualquer uma das partes, desde que haja comunicação formal por escrito justificando o motivo. Deverá acontecer, além disso, até 10 dias corridos, antes da data prevista para o evento, com devolução da entrada. Caso o cliente queira ou precise cancelar ou mudar a data da reserva, após ter pago a entrada, a contratada descontará o valor pago na futura contratação do serviço se acontecer nos primeiros 30 dias corridos após o dia antecipadamente reservado. 

LONDRINA, ${data.signatureDate}.
  `;
};

// Função para formatar CPF
export const formatCpf = (cpf: string): string => {
  return cpf
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .substring(0, 14);
};
