
// Contract data structure
const defaultContractData = {
  // Cliente
  clientName: "",
  clientDoc: "", // CPF ou CNPJ
  clientRg: "",
  clientAddress: "",
  
  // Evento
  eventDate: "",
  eventAddress: "",
  eventStartTime: "20:30",
  eventEndTime: "23:30", // 3 horas após o início (por padrão)
  
  // Quantidades
  adultCount: 25,
  childCount: 0,
  extraWaiters: 0,
  
  // Preços
  adultPrice: 55,
  childPrice: 27.5,
  extraWaiterPrice: 120,
  
  // Pagamento
  totalValue: 0,
  downPayment: 0
};

// Global variables
let currentContractData = { ...defaultContractData };
let contractsInMemory = [];

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  document.getElementById('current-year').textContent = new Date().getFullYear();
  
  // Initialize stored contracts
  initializeContracts();
  
  // Form handling
  const contractForm = document.getElementById('contractForm');
  contractForm.addEventListener('submit', handleFormSubmit);
  
  // Input change events for real-time updates
  attachInputChangeEvents();
  
  // Tab handling
  setupTabs();
  
  // History modal
  setupHistoryModal();
  
  // Print buttons
  setupPrintButtons();
  
  // Save contract button
  document.getElementById('saveContract').addEventListener('click', saveCurrentContract);
  
  // Import/Export handlers
  setupImportExport();
});

// Initialize contracts from localStorage
function initializeContracts() {
  try {
    const storedContracts = localStorage.getItem('contracts');
    if (storedContracts) {
      contractsInMemory = JSON.parse(storedContracts);
      console.log('Contracts loaded from localStorage:', contractsInMemory.length);
    }
  } catch (error) {
    console.error('Error loading contracts from localStorage:', error);
    contractsInMemory = [];
  }
}

// Handle form submission
function handleFormSubmit(event) {
  event.preventDefault();
  updateContractData();
  generateContract();
  generateReceipt();
}

// Update contract data from form inputs
function updateContractData() {
  currentContractData = {
    clientName: document.getElementById('clientName').value,
    clientDoc: document.getElementById('clientDoc').value,
    clientRg: document.getElementById('clientRg').value,
    clientAddress: document.getElementById('clientAddress').value,
    eventDate: document.getElementById('eventDate').value,
    eventAddress: document.getElementById('eventAddress').value,
    eventStartTime: document.getElementById('eventStartTime').value,
    adultCount: parseInt(document.getElementById('adultCount').value) || 0,
    childCount: parseInt(document.getElementById('childCount').value) || 0,
    extraWaiters: parseInt(document.getElementById('extraWaiters').value) || 0,
    adultPrice: parseFloat(document.getElementById('adultPrice').value) || 0,
    childPrice: parseFloat(document.getElementById('childPrice').value) || 0,
    extraWaiterPrice: parseFloat(document.getElementById('extraWaiterPrice').value) || 0
  };
  
  // Calculate derived values
  const { eventEndTime, totalValue, downPayment } = calculateValues(currentContractData);
  currentContractData.eventEndTime = eventEndTime;
  currentContractData.totalValue = totalValue;
  currentContractData.downPayment = downPayment;
}

// Calculate derived values
function calculateValues(data) {
  const totalValue = 
    (data.adultCount * data.adultPrice) + 
    (data.childCount * data.childPrice) + 
    (data.extraWaiters * data.extraWaiterPrice);
  
  const downPayment = Math.round(totalValue * 0.4);
  
  // Calculate event end time (3 hours after start time)
  const [startHour, startMinute] = data.eventStartTime.split(':').map(Number);
  const endDate = new Date();
  endDate.setHours(startHour, startMinute, 0);
  endDate.setHours(endDate.getHours() + 3);
  const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
  
  return {
    eventEndTime: endTime,
    totalValue,
    downPayment
  };
}

// Format currency in Brazilian Real
function formatCurrency(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

// Format CPF/CNPJ
function formatDocument(doc) {
  const cleanDoc = doc.replace(/\D/g, '');
  
  // Format as CNPJ if length is 14
  if (cleanDoc.length === 14) {
    return cleanDoc
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  
  // Format as CPF
  return cleanDoc
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .substring(0, 14);
}

// Calculate base waiters
function calculateBaseWaiters(adultCount, childCount) {
  const totalGuests = adultCount + childCount;
  return Math.max(1, Math.ceil(totalGuests / 30));
}

// Generate contract HTML
function generateContract() {
  const data = currentContractData;
  const remainingPayment = data.totalValue - data.downPayment;
  const baseWaiters = calculateBaseWaiters(data.adultCount, data.childCount);
  const totalWaiters = baseWaiters + data.extraWaiters;
  
  const waitersText = data.extraWaiters > 0 
    ? `${baseWaiters} garçons${data.extraWaiters > 0 ? ` + ${data.extraWaiters} garçons adicionais` : ''}`
    : `${baseWaiters} garçons`;

  const extraWaitersText = data.extraWaiters > 0
    ? `, mais ${data.extraWaiters} garçons adicionais no valor de ${formatCurrency(data.extraWaiterPrice)} cada (total de ${formatCurrency(data.extraWaiters * data.extraWaiterPrice)})`
    : '';

  const currentDate = new Date().toLocaleDateString('pt-BR');
  const formattedEventDate = formatDateBr(data.eventDate);
  const formattedDoc = formatDocument(data.clientDoc);

  const contractHtml = `
    <h2 class="contract-title">JULIO'S PIZZA HOUSE</h2>
    
    <p><strong>CONTRATANTE:</strong> <strong>${data.clientName.toUpperCase()}</strong>, CPF/CNPJ: n°<strong>${formattedDoc}</strong>, RG: nº <strong>${data.clientRg}</strong> residente em Rua: <strong>${data.clientAddress.toUpperCase()}</strong>.</p>
    
    <p><strong>CONTRATADA:</strong> JULIO'S PIZZA HOUSE, com sede em Londrina, na Rua Alzira Postali Gewrher, nº 119, bairro Jardim Catuai, Cep 86086-230, no Estado Paraná, inscrita no CPF sob o nº 034.988.389-03, neste ato representada pelo Responsável Sr. Júlio Cesar Fermino.</p>
    
    <p>As partes acima identificadas têm, entre si, justo e acertado o presente Contrato de Prestação de Serviços de Rodizio de pizza para festa, que se regerá pelas cláusulas seguintes e pelas condições de preço, forma e termo de pagamento descritas no presente.</p>
    
    <h3>DO OBJETO DO CONTRATO</h3>
    
    <p><strong>Cláusula 1ª.</strong> É objeto do presente contrato a prestação pela CONTRATADA à CONTRATANTE do serviço de rodizio de pizza, em evento que se realizará na data de <strong>${formattedEventDate}</strong>, no endereço / local: <strong>${data.eventAddress.toUpperCase()}</strong>.</p>
    
    <h3>O EVENTO</h3>
    
    <p><strong>Cláusula 2ª.</strong> O evento, para cuja realização são contratados os serviços de Rodizio de Pizza, é a festa de confraternização da CONTRATANTE, e contará com a presença de aproximadamente <strong>${data.adultCount} adultos</strong>${data.childCount > 0 ? ` e <strong>${data.childCount} crianças</strong>` : ''} a serem confirmada uma semana antes do evento.</p>
    <p>Parágrafo único. O evento realizar-se-á no horário e local indicado no caput da cláusula 1ª, devendo o serviço de rodizio de pizza a ser prestado das <strong>${data.eventStartTime}</strong> até às <strong>${data.eventEndTime}</strong> horas.</p>
    
    <h3>OBRIGAÇÕES DA CONTRATANTE</h3>
    
    <p><strong>Cláusula 3ª.</strong> A CONTRATANTE deverá fornecer à CONTRATADA todas as informações necessárias à realização adequada do serviço de rodizio de pizza, devendo especificar os detalhes do evento, necessários ao perfeito fornecimento do serviço, e a forma como este deverá ser prestado.</p>
    
    <p><strong>Cláusula 4ª.</strong> A CONTRATANTE deverá efetuar o pagamento na forma e condições estabelecidas na cláusula 9ª.</p>
    
    <h3>OBRIGAÇÕES DA CONTRATADA</h3>
    
    <p><strong>Cláusula 5ª.</strong> É dever da CONTRATADA oferecer um serviço de rodizio pizza de acordo com as especificações da CONTRATANTE, devendo o serviço iniciar-se às <strong>${data.eventStartTime}</strong> e terminar às <strong>${data.eventEndTime}</strong> horas.</p>
    <p>Parágrafo único. A CONTRATADA está obrigada a fornecer aos convidados do CONTRATANTE produtos de alta qualidade, que deverão ser preparados e servidos dentro de rigorosas normas de higiene e limpeza.</p>
    <p>Obs: O excedente de horário será cobrado 300,00 (trezentos reais) a cada meia hora do horário ultrapassado.</p>
    
    <p><strong>Cláusula 6ª.</strong> A CONTRATADA se compromete a fornecer o cardápio escolhido pela CONTRATANTE, cujas especificações, inclusive de quantidade a ser servida, encontram-se em documento anexo ao presente contrato.</p>
    
    <p><strong>Cláusula 7ª.</strong> A CONTRATADA fornecerá pelo menos 1 pizzaiolos e ${waitersText} para servir os convidados nas mesas.</p>
    
    <p><strong>Cláusula 8ª.</strong> A CONTRATADA obriga-se a manter todos os seus empregados devidamente uniformizados durante a prestação dos serviços ora contratados, garantindo que todos eles possuem os requisitos de urbanidade, moralidade e educação.</p>
    
    <h3>DO PREÇO E DAS CONDIÇÕES DE PAGAMENTO</h3>
    
    <p><strong>Cláusula 9.</strong> O serviço contratado no presente instrumento será remunerado dependendo do numero de pessoas confirmadas uma semana antes do evento. A contratada garante que a quantidade de comida seja suficiente para atender o num de pessoas presentes, estando preparada para atender até 10% a mais do numero de pessoas confirmadas, cobrando o valor de ${formatCurrency(data.adultPrice)} por adulto${data.childCount > 0 ? ` e ${formatCurrency(data.childPrice)} por crianças` : ''}${extraWaitersText} no total de <strong>${formatCurrency(data.totalValue)}</strong> assim como combinado pelo telefone. O serviço deve ser pago em dinheiro, com uma entrada de <strong>${formatCurrency(data.downPayment)}</strong> (depositados em conta, caixa econômica Ag: 1479 conta: 00028090-5 conta corrente) ANTECIPADO, a diferença no ato da festa no valor de <strong>${formatCurrency(remainingPayment)}</strong>.</p>
    
    <p><strong>Cláusula 10.</strong> O presente contrato poderá ser rescindido unilateralmente por qualquer uma das partes, desde que haja comunicação formal por escrito justificando o motivo. Deverá acontecer, além disso, até 10 dias corridos, antes da data prevista para o evento, com devolução da entrada. Caso o cliente queira ou precise cancelar ou mudar a data da reserva, após ter pago a entrada, a contratada descontará o valor pago na futura contratação do serviço se acontecer nos primeiros 30 dias corridos após o dia antecipadamente reservado.</p>
    
    <p>LONDRINA, ${currentDate}.</p>
    
    <div class="signatures">
      <div class="signature">
        <p>__________________________</p>
        <p>CONTRATANTE</p>
      </div>
      
      <div class="signature">
        <p>__________________________</p>
        <p>CONTRATADA</p>
      </div>
    </div>
  `;
  
  document.getElementById('contractPreview').innerHTML = contractHtml;
}

// Generate receipt HTML
function generateReceipt() {
  const data = currentContractData;
  const remainingPayment = data.totalValue - data.downPayment;
  const currentDate = new Date().toLocaleDateString('pt-BR');
  const formattedEventDate = formatDateBr(data.eventDate);
  const formattedDoc = formatDocument(data.clientDoc);
  
  const receiptHtml = `
    <div class="receipt">
      <h2>RECIBO - JULIO'S PIZZA HOUSE</h2>
      
      <div class="receipt-details">
        <p><strong>Valor:</strong> ${formatCurrency(data.totalValue)}</p>
        <p><strong>Sinal:</strong> ${formatCurrency(data.downPayment)}</p>
        <p><strong>Restante:</strong> ${formatCurrency(remainingPayment)}</p>
        <p><strong>Data do Evento:</strong> ${formattedEventDate}</p>
        <p><strong>Horário:</strong> ${data.eventStartTime} às ${data.eventEndTime}</p>
        <p><strong>Local:</strong> ${data.eventAddress}</p>
      </div>
      
      <div class="receipt-client">
        <p><strong>Recebi de:</strong> ${data.clientName}</p>
        <p><strong>CPF/CNPJ:</strong> ${formattedDoc}</p>
        <p><strong>RG:</strong> ${data.clientRg}</p>
        <p><strong>Endereço:</strong> ${data.clientAddress}</p>
      </div>
      
      <div class="receipt-description">
        <p><strong>Referente a:</strong> Sinal para prestação de serviços de rodízio de pizza para evento</p>
        <p><strong>Convidados:</strong> ${data.adultCount} adultos${data.childCount > 0 ? ` e ${data.childCount} crianças` : ''}</p>
      </div>
      
      <div class="signatures">
        <p>Londrina, ${currentDate}</p>
        <div class="signature">
          <p>__________________________</p>
          <p>Júlio Cesar Fermino</p>
          <p>CPF: 034.988.389-03</p>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('receiptPreview').innerHTML = receiptHtml;
}

// Format date to Brazilian format
function formatDateBr(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR');
}

// Attach input change events for realtime updates
function attachInputChangeEvents() {
  // Realtime CPF/CNPJ formatting
  const docInput = document.getElementById('clientDoc');
  docInput.addEventListener('input', function() {
    const doc = this.value.replace(/\D/g, '');
    this.value = formatDocument(doc);
  });
  
  // Realtime calculations for start time to update end time
  document.getElementById('eventStartTime').addEventListener('change', function() {
    updateContractData();
    generateContract();
    generateReceipt();
  });
  
  // Realtime calculations for other inputs
  const calculationInputs = [
    'adultCount', 'childCount', 'extraWaiters',
    'adultPrice', 'childPrice', 'extraWaiterPrice'
  ];
  
  calculationInputs.forEach(inputId => {
    document.getElementById(inputId).addEventListener('change', function() {
      updateContractData();
      generateContract();
      generateReceipt();
    });
  });
}

// Setup tabs
function setupTabs() {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Hide all tab content
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      
      // Show the relevant tab content
      const tabContentId = `${tab.getAttribute('data-tab')}-tab`;
      document.getElementById(tabContentId).classList.add('active');
    });
  });
}

// Setup History Modal
function setupHistoryModal() {
  const modal = document.getElementById('historyModal');
  const viewHistoryBtn = document.getElementById('viewHistory');
  const closeBtn = document.querySelector('.close');
  
  viewHistoryBtn.addEventListener('click', () => {
    loadContractsTable();
    modal.style.display = 'block';
  });
  
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
}

// Load contracts to table
function loadContractsTable() {
  const tbody = document.getElementById('contractsTableBody');
  
  if (contractsInMemory.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-message">Nenhum contrato encontrado.</td></tr>';
    return;
  }
  
  tbody.innerHTML = '';
  
  contractsInMemory.forEach((contract, index) => {
    const row = document.createElement('tr');
    
    // Format date
    const date = new Date(contract.createdAt);
    const formattedDate = date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Guests text
    const guestsText = contract.childCount > 0 
      ? `${contract.adultCount} adultos, ${contract.childCount} crianças`
      : `${contract.adultCount} adultos`;
    
    // Create table cells
    row.innerHTML = `
      <td>${formattedDate}</td>
      <td>${contract.clientName}</td>
      <td>${formatDateBr(contract.eventDate)}</td>
      <td>${formatCurrency(contract.totalValue)}</td>
      <td>${guestsText}</td>
      <td>
        <button class="view-btn" data-index="${index}">Ver</button>
        <button class="delete-btn" data-index="${index}">Excluir</button>
      </td>
    `;
    
    tbody.appendChild(row);
  });
  
  // Add event listeners to view and delete buttons
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const index = parseInt(this.getAttribute('data-index'));
      loadContractData(index);
      document.getElementById('historyModal').style.display = 'none';
    });
  });
  
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const index = parseInt(this.getAttribute('data-index'));
      deleteContract(index);
    });
  });
}

// Load contract data into form
function loadContractData(index) {
  const contract = contractsInMemory[index];
  
  // Set form values
  document.getElementById('clientName').value = contract.clientName;
  document.getElementById('clientDoc').value = contract.clientDoc;
  document.getElementById('clientRg').value = contract.clientRg;
  document.getElementById('clientAddress').value = contract.clientAddress;
  document.getElementById('eventDate').value = contract.eventDate;
  document.getElementById('eventAddress').value = contract.eventAddress;
  document.getElementById('eventStartTime').value = contract.eventStartTime;
  document.getElementById('adultCount').value = contract.adultCount;
  document.getElementById('childCount').value = contract.childCount;
  document.getElementById('extraWaiters').value = contract.extraWaiters;
  document.getElementById('adultPrice').value = contract.adultPrice;
  document.getElementById('childPrice').value = contract.childPrice;
  document.getElementById('extraWaiterPrice').value = contract.extraWaiterPrice;
  
  // Update contract data and generate contract and receipt
  updateContractData();
  generateContract();
  generateReceipt();
}

// Delete contract
function deleteContract(index) {
  if (confirm('Tem certeza que deseja excluir este contrato?')) {
    contractsInMemory.splice(index, 1);
    saveContractsToStorage();
    loadContractsTable();
  }
}

// Setup print buttons
function setupPrintButtons() {
  document.getElementById('printContract').addEventListener('click', () => {
    const contractTab = document.getElementById('contract-tab');
    contractTab.classList.add('active');
    document.getElementById('receipt-tab').classList.remove('active');
    window.print();
  });
  
  document.getElementById('printReceipt').addEventListener('click', () => {
    const receiptTab = document.getElementById('receipt-tab');
    receiptTab.classList.add('active');
    document.getElementById('contract-tab').classList.remove('active');
    window.print();
  });
}

// Save current contract
function saveCurrentContract() {
  updateContractData();
  
  if (!currentContractData.clientName || !currentContractData.eventDate) {
    alert('Por favor, preencha pelo menos o nome do cliente e a data do evento.');
    return;
  }
  
  const contractToSave = {
    ...currentContractData,
    id: generateId(),
    createdAt: new Date().toISOString()
  };
  
  contractsInMemory.unshift(contractToSave);
  saveContractsToStorage();
  
  alert('Contrato salvo com sucesso!');
}

// Save contracts to local storage
function saveContractsToStorage() {
  try {
    localStorage.setItem('contracts', JSON.stringify(contractsInMemory));
    console.log('Contracts saved to localStorage successfully');
  } catch (error) {
    console.error('Error saving contracts to localStorage:', error);
  }
}

// Generate simple ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Setup import/export functionality
function setupImportExport() {
  document.getElementById('exportContracts').addEventListener('click', exportContracts);
  document.getElementById('importContractsBtn').addEventListener('click', () => {
    document.getElementById('importContracts').click();
  });
  
  document.getElementById('importContracts').addEventListener('change', importContracts);
}

// Export contracts
function exportContracts() {
  try {
    const contractsJson = JSON.stringify(contractsInMemory, null, 2);
    const blob = new Blob([contractsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contratos_pizzas.json';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
    console.log('Contracts JSON downloaded successfully');
  } catch (error) {
    console.error('Error downloading contracts JSON:', error);
    alert('Erro ao exportar contratos. Por favor, tente novamente.');
  }
}

// Import contracts
function importContracts(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  
  reader.onload = function(e) {
    try {
      const importedContracts = JSON.parse(e.target.result);
      
      if (Array.isArray(importedContracts)) {
        if (confirm(`Deseja importar ${importedContracts.length} contratos? Isso substituirá os contratos existentes.`)) {
          contractsInMemory = importedContracts;
          saveContractsToStorage();
          loadContractsTable();
          alert('Contratos importados com sucesso!');
        }
      } else {
        throw new Error('Formato inválido');
      }
    } catch (error) {
      console.error('Error importing contracts:', error);
      alert('Arquivo inválido. Por favor, selecione um arquivo JSON válido.');
    }
  };
  
  reader.onerror = function() {
    alert('Erro ao ler o arquivo.');
  };
  
  reader.readAsText(file);
  
  // Reset file input
  event.target.value = '';
}
