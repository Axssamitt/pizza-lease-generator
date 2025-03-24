
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ContractPreview from "@/components/ContractPreview";
import Receipt from "@/components/Receipt";
import { getContractById } from "@/utils/storageUtils";
import { ContractData } from "@/utils/contractGenerator";

const ContractDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [contract, setContract] = useState<ContractData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (id) {
      const contractData = getContractById(id);
      if (contractData) {
        setContract(contractData);
      }
      setLoading(false);
    }
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse">Carregando...</div>
      </div>
    );
  }
  
  if (!contract) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Contrato não encontrado</AlertTitle>
            <AlertDescription>
              O contrato que você está procurando não existe ou foi excluído.
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex justify-center">
            <Button onClick={() => navigate("/history")}>
              Voltar para o histórico
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Contrato: {contract.clientName}
          </h1>
          <Button variant="outline" asChild>
            <Link to="/history">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o histórico
            </Link>
          </Button>
        </div>
        
        <Tabs defaultValue="contract" className="space-y-4">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="contract">Contrato</TabsTrigger>
            <TabsTrigger value="receipt">Recibo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="contract" className="space-y-4">
            <ContractPreview contractData={contract} />
          </TabsContent>
          
          <TabsContent value="receipt" className="space-y-4">
            <Receipt contractData={contract} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default ContractDetail;
