
import { ContractData } from './contractGenerator';

// Interface for stored contract with a unique ID and timestamp
export interface StoredContract extends ContractData {
  id: string;
  createdAt: string;
}

// In-memory contracts container that will be used for the current session
let contractsInMemory: StoredContract[] = [];

// Initialize contracts from a local file or empty array
export const initializeContracts = (contractsJson?: string) => {
  if (contractsJson) {
    try {
      contractsInMemory = JSON.parse(contractsJson);
      console.log('Contracts loaded from JSON:', contractsInMemory.length);
    } catch (error) {
      console.error('Error parsing contracts from JSON:', error);
      contractsInMemory = [];
    }
  }
  return contractsInMemory;
};

// Save contract to memory and return a downloadable JSON
export const saveContract = (contract: ContractData): StoredContract => {
  // Create a new contract with ID and timestamp
  const newContract: StoredContract = {
    ...contract,
    id: generateId(),
    createdAt: new Date().toISOString()
  };
  
  // Add to beginning of array (newest first)
  contractsInMemory.unshift(newContract);
  
  // Trigger a download of the updated contracts JSON
  downloadContractsJson();
  
  return newContract;
};

// Get all contracts from memory
export const getContracts = (): StoredContract[] => {
  return contractsInMemory;
};

// Generate a simple unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Delete a contract by ID
export const deleteContract = (id: string): boolean => {
  const previousLength = contractsInMemory.length;
  contractsInMemory = contractsInMemory.filter(contract => contract.id !== id);
  
  if (contractsInMemory.length === previousLength) {
    return false; // No contract was deleted
  }
  
  // Trigger a download of the updated contracts JSON
  downloadContractsJson();
  return true;
};

// Get a contract by ID
export const getContractById = (id: string): StoredContract | null => {
  const contract = contractsInMemory.find(c => c.id === id);
  return contract || null;
};

// Download the contracts as a JSON file
export const downloadContractsJson = () => {
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
};

// Upload contracts from a JSON file
export const uploadContractsJson = (file: File): Promise<StoredContract[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        contractsInMemory = JSON.parse(json);
        resolve(contractsInMemory);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsText(file);
  });
};

// Export contracts data to create a self-contained HTML file
export const exportAsStandaloneHtml = () => {
  // Fetch the current HTML content
  fetch(window.location.href)
    .then(response => response.text())
    .then(html => {
      // Inject the contracts data into the HTML
      const contractsDataScript = `<script>
        window.PRELOADED_CONTRACTS = ${JSON.stringify(contractsInMemory)};
      </script>`;
      
      // Insert the script before the closing body tag
      const modifiedHtml = html.replace('</body>', `${contractsDataScript}\n</body>`);
      
      // Create a download link
      const blob = new Blob([modifiedHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'contratos_pizzas.html';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    })
    .catch(error => {
      console.error('Error exporting standalone HTML:', error);
    });
};
