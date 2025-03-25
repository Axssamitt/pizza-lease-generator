
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, ArrowLeft, FileText } from "lucide-react";
import { StoredContract, getContracts, deleteContract } from "@/utils/storageUtils";
import { formatCurrency } from "@/utils/contractGenerator";
import { useToast } from "@/hooks/use-toast";
import FileOperations from "@/components/FileOperations";

const History = () => {
  const [contracts, setContracts] = useState<StoredContract[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    loadContracts();
  }, []);
  
  const loadContracts = () => {
    const loadedContracts = getContracts();
    setContracts(loadedContracts);
  };
  
  const handleDeleteContract = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este contrato?")) {
      const success = deleteContract(id);
      if (success) {
        toast({
          title: "Contrato excluído",
          description: "O contrato foi excluído com sucesso.",
          variant: "default",
        });
        loadContracts();
      }
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">
            Histórico de Contratos
          </h1>
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Contratos Salvos</CardTitle>
                <CardDescription>
                  Lista de todos os contratos gerados e salvos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {contracts.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <FileText className="mx-auto h-12 w-12 mb-4 opacity-20" />
                    <p>Nenhum contrato encontrado.</p>
                    <Button variant="outline" className="mt-4" asChild>
                      <Link to="/">Criar um novo contrato</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Data do Evento</TableHead>
                          <TableHead>Valor Total</TableHead>
                          <TableHead>Convidados</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contracts.map((contract) => (
                          <TableRow key={contract.id}>
                            <TableCell className="font-mono text-xs">
                              {formatDate(contract.createdAt)}
                            </TableCell>
                            <TableCell className="font-medium">
                              {contract.clientName}
                            </TableCell>
                            <TableCell>{contract.eventDate}</TableCell>
                            <TableCell>{formatCurrency(contract.totalValue)}</TableCell>
                            <TableCell>
                              {contract.adultCount} adultos
                              {contract.childCount > 0 && `, ${contract.childCount} crianças`}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="icon" asChild>
                                  <Link to={`/contract/${contract.id}`}>
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">Ver</span>
                                  </Link>
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  onClick={() => handleDeleteContract(contract.id)}
                                  className="text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Excluir</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <FileOperations onContractsUpdated={loadContracts} />
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Instruções</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <h3 className="font-semibold">Uso Local</h3>
                    <p className="text-muted-foreground">
                      Para uso em computador pessoal, exporte como HTML e abra o arquivo no navegador.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Google Drive</h3>
                    <p className="text-muted-foreground">
                      Faça upload do arquivo HTML para o Google Drive e abra com o navegador integrado.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Backup de Dados</h3>
                    <p className="text-muted-foreground">
                      Baixe regularmente o arquivo JSON para guardar seus contratos com segurança.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default History;
