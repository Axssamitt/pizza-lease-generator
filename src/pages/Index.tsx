
import React, { useState } from "react";
import { motion } from "framer-motion";
import ContractForm from "@/components/ContractForm";
import ContractPreview from "@/components/ContractPreview";
import { defaultContractData, ContractData } from "@/utils/contractGenerator";

const Index = () => {
  const [contractData, setContractData] = useState<ContractData>(defaultContractData);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">
          Julio's Pizza House
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Gerador de Contratos para Eventos de Pizza
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
        <ContractForm onContractDataChange={setContractData} />
        <ContractPreview contractData={contractData} />
      </div>
      
      <footer className="mt-16 text-center text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Julio's Pizza House. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Index;
