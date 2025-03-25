
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
  const receiptNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
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
                .receipt-container {
                  border: 2px solid #333;
                  border-radius: 30px;
                  padding: 20px;
                  position: relative;
                }
                .receipt-header {
                  display: flex;
                  align-items: center;
                  margin-bottom: 20px;
                }
                .receipt-title {
                  font-size: 32px;
                  font-weight: bold;
                  margin-right: 10px;
                }
                .receipt-number, .receipt-value {
                  background-color: #aaa;
                  padding: 8px 15px;
                  color: #000;
                  font-weight: bold;
                  margin-left: 10px;
                }
                .receipt-row {
                  display: flex;
                  margin-bottom: 15px;
                }
                .receipt-label {
                  width: 150px;
                  font-weight: normal;
                }
                .receipt-content {
                  flex: 1;
                  border-bottom: 1px solid #333;
                  font-weight: bold;
                  text-transform: uppercase;
                }
                .receipt-footer {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  margin-top: 40px;
                }
                .receipt-date {
                  align-self: flex-end;
                  margin-bottom: 20px;
                }
                .receipt-signature {
                  margin-top: 10px;
                  text-align: center;
                }
                .receipt-signature img {
                  width: 150px;
                  margin-bottom: 10px;
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
              <div class="receipt-container">
                <div class="receipt-header">
                  <div class="receipt-title">RECIBO</div>
                  <div>Nº</div>
                  <div class="receipt-number">${receiptNumber}</div>
                  <div>VALOR</div>
                  <div class="receipt-value">
                    ${formatCurrency(contractData.downPayment)}
                  </div>
                </div>
                
                <div class="receipt-row">
                  <div class="receipt-label">Recebi(emos) de</div>
                  <div class="receipt-content">
                    ${contractData.clientName}
                  </div>
                </div>
                
                <div class="receipt-row">
                  <div class="receipt-label">a quantia de</div>
                  <div class="receipt-content">
                    ${numberToWords(contractData.downPayment).toUpperCase()}
                  </div>
                </div>
                
                <div class="receipt-row">
                  <div class="receipt-label">Correspondente a</div>
                  <div class="receipt-content">
                    ENTRADA DO EVENTO A SE REALIZAR NA DATA DE ${contractData.eventDate}
                  </div>
                </div>
                
                <div class="receipt-row">
                  <div class="receipt-content"></div>
                </div>
                
                <div>
                  e para clareza firmo(amos) o presente
                </div>
                
                <div class="receipt-date">
                  LONDRINA, ${currentDate}
                </div>
                
                <div class="receipt-footer">
                  <div style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">JULIO'S PIZZA HOUSE</div>
                  <img 
                    src="/lovable-uploads/340c9b38-0cac-4c58-a897-54ee0dd2412b.png" 
                    alt="Assinatura" 
                    style="width: 150px; height: auto; object-fit: contain; opacity: 0.6;"
                  />
                </div>
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

  const amountInWords = numberToWords(contractData.downPayment).toUpperCase();
  
  return (
    <Card className="shadow-md border border-border/40">
      <CardHeader>
        <CardTitle className="text-center">Recibo de Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={receiptRef} className="receipt">
          <div className="border-2 border-black rounded-[30px] p-5 relative">
            <div className="flex items-center mb-6">
              <div className="text-3xl font-bold mr-2">RECIBO</div>
              <div className="ml-2">Nº</div>
              <div className="bg-gray-400 text-black px-4 py-1 mx-2 font-bold">{receiptNumber}</div>
              <div className="ml-2">VALOR</div>
              <div className="bg-gray-400 text-black px-4 py-1 mx-2 font-bold">
                {formatCurrency(contractData.downPayment)}
              </div>
            </div>
            
            <div className="mb-4 flex">
              <div className="w-[150px]">Recebi(emos) de</div>
              <div className="flex-1 border-b border-black font-bold uppercase">
                {contractData.clientName}
              </div>
            </div>
            
            <div className="mb-4 flex">
              <div className="w-[150px]">a quantia de</div>
              <div className="flex-1 border-b border-black font-bold uppercase">
                {amountInWords}
              </div>
            </div>
            
            <div className="mb-4 flex">
              <div className="w-[150px]">Correspondente a</div>
              <div className="flex-1 border-b border-black font-bold uppercase">
                ENTRADA DO EVENTO A SE REALIZAR NA DATA DE {contractData.eventDate}
              </div>
            </div>
            
            <div className="mb-4 border-b border-black"></div>
            
            <div className="mb-8">
              e para clareza firmo(amos) o presente
            </div>
            
            <div className="flex justify-end mb-4">
              <div>LONDRINA, {currentDate}</div>
            </div>
            
            <div className="flex flex-col items-center mt-8 mb-2">
              <div className="text-2xl font-bold mb-4">JULIO'S PIZZA HOUSE</div>
              <img 
                src="/lovable-uploads/340c9b38-0cac-4c58-a897-54ee0dd2412b.png" 
                alt="Assinatura" 
                className="w-[150px] h-auto object-contain opacity-60 mb-2"
              />
            </div>
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
