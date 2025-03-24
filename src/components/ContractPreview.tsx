
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { PrinterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContractData, generateContractText } from "@/utils/contractGenerator";

interface ContractPreviewProps {
  contractData: ContractData;
}

const ContractPreview: React.FC<ContractPreviewProps> = ({ contractData }) => {
  const contractRef = useRef<HTMLDivElement>(null);
  const contractText = generateContractText(contractData);

  const handlePrint = () => {
    if (contractRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Contrato - Julio's Pizza House</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  padding: 20px;
                  max-width: 800px;
                  margin: 0 auto;
                }
                h1 {
                  text-align: center;
                  margin-bottom: 20px;
                }
                p {
                  margin-bottom: 10px;
                  text-align: justify;
                }
                @media print {
                  body {
                    padding: 0;
                  }
                  button {
                    display: none;
                  }
                }
              </style>
            </head>
            <body>
              <div>
                ${contractRef.current.innerHTML}
              </div>
              <div style="text-align: center; margin-top: 30px;">
                <button onclick="window.print()">Imprimir</button>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  return (
    <motion.div
      className="w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="glass overflow-hidden border border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-center">Visualização do Contrato</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] w-full rounded-md border p-4">
            <div 
              ref={contractRef}
              className="whitespace-pre-line text-sm font-mono leading-relaxed" 
              dangerouslySetInnerHTML={{ __html: contractText.replace(/\n/g, '<br>') }}
            />
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex justify-center border-t bg-muted/20 p-4">
          <Button onClick={handlePrint} className="min-w-[200px]">
            <PrinterIcon className="mr-2 h-4 w-4" />
            Imprimir / Salvar PDF
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ContractPreview;
