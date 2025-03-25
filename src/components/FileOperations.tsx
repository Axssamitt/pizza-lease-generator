
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Upload, 
  FileText, 
  FilePlus2 
} from "lucide-react";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { 
  downloadContractsJson, 
  uploadContractsJson, 
  exportAsStandaloneHtml 
} from '@/utils/storageUtils';
import { useToast } from '@/hooks/use-toast';

interface FileOperationsProps {
  onContractsUpdated: () => void;
}

const FileOperations: React.FC<FileOperationsProps> = ({ onContractsUpdated }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    try {
      await uploadContractsJson(files[0]);
      onContractsUpdated();
      toast({
        title: "Contratos importados",
        description: "Os contratos foram importados com sucesso.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erro na importação",
        description: "Falha ao importar contratos. Verifique o formato do arquivo.",
        variant: "destructive",
      });
    } finally {
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownloadJson = () => {
    downloadContractsJson();
    toast({
      title: "Contratos exportados",
      description: "O arquivo JSON com os contratos foi gerado para download.",
      variant: "default",
    });
  };

  const handleExportHtml = () => {
    exportAsStandaloneHtml();
    toast({
      title: "HTML exportado",
      description: "Página HTML completa gerada para uso offline.",
      variant: "default",
    });
  };

  const handleNewFile = () => {
    if (window.confirm("Isso criará um novo arquivo e removerá todos os contratos atuais da memória. Deseja continuar?")) {
      // Clear contracts in memory by initializing with empty array
      window.PRELOADED_CONTRACTS = [];
      onContractsUpdated();
      toast({
        title: "Novo arquivo criado",
        description: "Um novo arquivo de contratos foi iniciado.",
        variant: "default",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Operações de Arquivo</CardTitle>
        <CardDescription>
          Gerencie seus arquivos de contratos para uso local ou online
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleDownloadJson}
            >
              <Download className="mr-2 h-4 w-4" />
              Baixar JSON
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Importar JSON
              <input 
                type="file" 
                ref={fileInputRef}
                accept=".json" 
                className="hidden" 
                onChange={handleFileUpload}
              />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleExportHtml}
            >
              <FileText className="mr-2 h-4 w-4" />
              Exportar HTML
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleNewFile}
            >
              <FilePlus2 className="mr-2 h-4 w-4" />
              Novo Arquivo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileOperations;
