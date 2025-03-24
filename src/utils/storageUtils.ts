
import { ContractData } from './contractGenerator';

// Interface for stored contract with a unique ID and timestamp
export interface StoredContract extends ContractData {
  id: string;
  createdAt: string;
}

// Save contract to local storage
export const saveContract = (contract: ContractData): StoredContract => {
  // Get existing contracts
  const contracts = getContracts();
  
  // Create a new contract with ID and timestamp
  const newContract: StoredContract = {
    ...contract,
    id: generateId(),
    createdAt: new Date().toISOString()
  };
  
  // Add to beginning of array (newest first)
  contracts.unshift(newContract);
  
  // Save to localStorage
  localStorage.setItem('contracts', JSON.stringify(contracts));
  
  return newContract;
};

// Get all contracts from local storage
export const getContracts = (): StoredContract[] => {
  const contractsJson = localStorage.getItem('contracts');
  if (!contractsJson) return [];
  
  try {
    return JSON.parse(contractsJson);
  } catch (error) {
    console.error('Error parsing contracts from localStorage:', error);
    return [];
  }
};

// Generate a simple unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Delete a contract by ID
export const deleteContract = (id: string): boolean => {
  const contracts = getContracts();
  const filteredContracts = contracts.filter(contract => contract.id !== id);
  
  if (filteredContracts.length === contracts.length) {
    return false; // No contract was deleted
  }
  
  localStorage.setItem('contracts', JSON.stringify(filteredContracts));
  return true;
};

// Get a contract by ID
export const getContractById = (id: string): StoredContract | null => {
  const contracts = getContracts();
  const contract = contracts.find(c => c.id === id);
  return contract || null;
};
