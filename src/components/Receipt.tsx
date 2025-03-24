
import React, { useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PrinterIcon } from "lucide-react";
import { ContractData, formatCurrency } from "@/utils/contractGenerator";
import { numberToWords } from "@/utils/numberToWords";

interface ReceiptProps {
  contractData: ContractData;
}

const Receipt: React.FC<ReceiptProps> = ({ contractData }) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const currentDate = new Date().toLocaleDateString('pt-BR');
  
  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Recibo - Julio's Pizza House</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  padding: 20px;
                  max-width: 800px;
                  margin: 0 auto;
                }
                .receipt {
                  border: 1px solid #ccc;
                  padding: 20px;
                  border-radius: 5px;
                }
                h1, h2 {
                  text-align: center;
                }
                .content {
                  margin-top: 20px;
                  text-align: justify;
                }
                .footer {
                  margin-top: 40px;
                  text-align: center;
                }
                .signature {
                  margin-top: 60px;
                  text-align: center;
                  border-top: 1px solid #333;
                  padding-top: 10px;
                  width: 70%;
                  margin-left: auto;
                  margin-right: auto;
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
              ${receiptRef.current.innerHTML}
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

  const amountInWords = numberToWords(contractData.downPayment);
  
  return (
    <Card className="shadow-md border border-border/40">
      <CardHeader>
        <CardTitle className="text-center">Recibo de Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={receiptRef} className="receipt">
          <div className="text-center font-bold text-xl mb-6">
            RECIBO
          </div>
          
          <div className="text-center mb-4">
            Nº {Math.floor(Math.random() * 10000).toString().padStart(4, '0')}/{new Date().getFullYear()}
          </div>
          
          <div className="mb-6 text-center text-2xl font-bold">
            {formatCurrency(contractData.downPayment)}
          </div>
          
          <div className="content text-justify">
            <p>
              Recebi de <strong>{contractData.clientName.toUpperCase()}</strong>, 
              inscrito no CPF sob o nº <strong>{contractData.clientCpf}</strong>, 
              a importância de <strong>{formatCurrency(contractData.downPayment)}</strong> 
              (<em>{amountInWords}</em>), referente ao sinal de pagamento para o serviço 
              de rodízio de pizzas a ser realizado no evento do dia <strong>{contractData.eventDate}</strong>, 
              no endereço: <strong>{contractData.eventAddress}</strong>.
            </p>
          </div>
          
          <div className="footer">
            <p>Londrina, {currentDate}</p>
          </div>
          
          <div className="signature">
            Júlio Cesar Fermino<br />
            Julio's Pizza House<br />
            CPF: 034.988.389-03
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center border-t bg-muted/20 p-4">
        <Button onClick={handlePrint} className="min-w-[200px]">
          <PrinterIcon className="mr-2 h-4 w-4" />
          Imprimir / Salvar PDF
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Receipt;
