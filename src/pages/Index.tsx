
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ContractForm from "@/components/ContractForm";
import ContractPreview from "@/components/ContractPreview";
import Receipt from "@/components/Receipt";
import { defaultContractData, ContractData, calculateValues } from "@/utils/contractGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { History, Save, Download } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Index = () => {
  const [contractData, setContractData] = useState<ContractData>(defaultContractData);
  
  const handleContractDataChange = (data: ContractData) => {
    const calculatedData = calculateValues(data);
    setContractData(calculatedData);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto mb-6"
      >
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">
          Julio's Pizza House
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Gerador de Contratos para Eventos de Pizza
        </p>
        
        <div className="mt-4">
          <Button variant="outline" asChild>
            <Link to="/history">
              <History className="mr-2 h-4 w-4" />
              Histórico de Contratos
            </Link>
          </Button>
        </div>
        
        <Alert className="mt-4 bg-muted/50 border-0">
          <AlertDescription className="text-xs text-muted-foreground">
            Novo! Exporte seus contratos como arquivo HTML para uso local ou no Google Drive.
            Acesse o <Link to="/history" className="font-medium underline">Histórico</Link> para gerenciar seus arquivos.
          </AlertDescription>
        </Alert>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        <ContractForm onContractDataChange={handleContractDataChange} />
        
        <Tabs defaultValue="contract" className="space-y-4">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="contract">Contrato</TabsTrigger>
            <TabsTrigger value="receipt">Recibo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="contract" className="space-y-4">
            <ContractPreview contractData={contractData} />
          </TabsContent>
          
          <TabsContent value="receipt" className="space-y-4">
            <Receipt contractData={contractData} />
          </TabsContent>
        </Tabs>
      </div>
      
      <footer className="mt-16 text-center text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Julio's Pizza House. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Index;
