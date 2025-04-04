
import { ContractData } from './contractGenerator';

// Interface for stored contract with a unique ID and timestamp
export interface StoredContract extends ContractData {
  id: string;
  createdAt: string;
}

// In-memory contracts container that will be used for the current session
let contractsInMemory: StoredContract[] = [];

// Initialize contracts from localStorage
export const initializeContracts = () => {
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
  
  return contractsInMemory;
};

// Save contract to memory and localStorage
export const saveContract = (contract: ContractData): StoredContract => {
  // Create a new contract with ID and timestamp
  const newContract: StoredContract = {
    ...contract,
    id: generateId(),
    createdAt: new Date().toISOString()
  };
  
  // Add to beginning of array (newest first)
  contractsInMemory.unshift(newContract);
  
  // Save to localStorage
  saveContractsToStorage();
  
  return newContract;
};

// Download contracts as a JSON file
export const downloadContractsJson = () => {
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
  }
};

// Save contracts to localStorage
const saveContractsToStorage = () => {
  try {
    localStorage.setItem('contracts', JSON.stringify(contractsInMemory));
    console.log('Contracts saved to localStorage successfully');
  } catch (error) {
    console.error('Error saving contracts to localStorage:', error);
  }
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
  
  // Save updated contracts to localStorage
  saveContractsToStorage();
  return true;
};

// Get a contract by ID
export const getContractById = (id: string): StoredContract | null => {
  const contract = contractsInMemory.find(c => c.id === id);
  return contract || null;
};

// Upload contracts from a JSON file
export const uploadContractsJson = (file: File): Promise<StoredContract[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        contractsInMemory = JSON.parse(json);
        saveContractsToStorage(); // Save the imported contracts to localStorage
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
