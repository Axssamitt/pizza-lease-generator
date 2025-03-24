
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, ArrowRightIcon, ArrowLeftIcon, UserRoundIcon, MapPinIcon, ClockIcon, UsersIcon, DollarSignIcon, EditIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";

import { 
  ContractData, 
  defaultContractData, 
  calculateValues, 
  formatCurrency,
  formatCpf,
  calculateBaseWaiters
} from "@/utils/contractGenerator";

interface ContractFormProps {
  onContractDataChange: (data: ContractData) => void;
}

const formSteps = [
  { name: "client", title: "Dados do Cliente", icon: <UserRoundIcon className="h-5 w-5" /> },
  { name: "event", title: "Detalhes do Evento", icon: <MapPinIcon className="h-5 w-5" /> },
  { name: "guests", title: "Convidados", icon: <UsersIcon className="h-5 w-5" /> },
  { name: "payment", title: "Pagamento", icon: <DollarSignIcon className="h-5 w-5" /> },
];

export function ContractForm({ onContractDataChange }: ContractFormProps) {
  const [contractData, setContractData] = useState<ContractData>(defaultContractData);
  const [currentStep, setCurrentStep] = useState(0);
  const [eventDate, setEventDate] = useState<Date | undefined>();
  const [priceDialogOpen, setPriceDialogOpen] = useState(false);
  
  // Estados temporários para edição de preços
  const [tempAdultPrice, setTempAdultPrice] = useState(contractData.adultPrice);
  const [tempChildPrice, setTempChildPrice] = useState(contractData.childPrice);
  const [tempExtraWaiterPrice, setTempExtraWaiterPrice] = useState(contractData.extraWaiterPrice);

  useEffect(() => {
    const updatedData = calculateValues(contractData);
    onContractDataChange(updatedData);
    setContractData(updatedData);
  }, [
    contractData.adultCount, 
    contractData.childCount, 
    contractData.extraWaiters,
    contractData.adultPrice,
    contractData.childPrice,
    contractData.extraWaiterPrice,
    onContractDataChange
  ]);

  useEffect(() => {
    if (eventDate) {
      setContractData(prev => ({
        ...prev,
        eventDate: format(eventDate, 'dd/MM/yyyy', { locale: ptBR })
      }));
    }
  }, [eventDate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "clientCpf") {
      setContractData(prev => ({
        ...prev,
        [name]: formatCpf(value)
      }));
      return;
    }
    
    if (name === "adultCount" || name === "childCount" || name === "extraWaiters") {
      setContractData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
      return;
    }
    
    setContractData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePriceDialogOpen = () => {
    setTempAdultPrice(contractData.adultPrice);
    setTempChildPrice(contractData.childPrice);
    setTempExtraWaiterPrice(contractData.extraWaiterPrice);
    setPriceDialogOpen(true);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    
    if (name === "adultPrice") {
      setTempAdultPrice(numValue);
    } else if (name === "childPrice") {
      setTempChildPrice(numValue);
    } else if (name === "extraWaiterPrice") {
      setTempExtraWaiterPrice(numValue);
    }
  };

  const savePrices = () => {
    setContractData(prev => ({
      ...prev,
      adultPrice: tempAdultPrice,
      childPrice: tempChildPrice,
      extraWaiterPrice: tempExtraWaiterPrice
    }));
    setPriceDialogOpen(false);
  };

  const nextStep = () => {
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const baseWaiters = calculateBaseWaiters(contractData.adultCount, contractData.childCount);

  return (
    <motion.div 
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="glass overflow-hidden border border-border/50 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-center">Gerador de Contrato</CardTitle>
          <div className="flex justify-between mt-4">
            {formSteps.map((step, index) => (
              <div 
                key={step.name}
                className={cn(
                  "flex flex-col items-center text-xs font-medium transition-all cursor-pointer",
                  index === currentStep ? "text-primary" : "text-muted-foreground"
                )}
                onClick={() => setCurrentStep(index)}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-all",
                  index === currentStep 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-secondary-foreground"
                )}>
                  {step.icon}
                </div>
                <span className="text-center w-full hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>
          <Separator className="mt-4" />
        </CardHeader>

        <CardContent className="pt-4">
          {currentStep === 0 && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-2">
                <Label htmlFor="clientName">Nome Completo</Label>
                <Input 
                  id="clientName" 
                  name="clientName"
                  placeholder="Nome completo do cliente" 
                  value={contractData.clientName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientCpf">CPF</Label>
                  <Input 
                    id="clientCpf" 
                    name="clientCpf"
                    placeholder="000.000.000-00" 
                    value={contractData.clientCpf}
                    onChange={handleInputChange}
                    maxLength={14}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientRg">RG</Label>
                  <Input 
                    id="clientRg" 
                    name="clientRg" 
                    placeholder="0000000" 
                    value={contractData.clientRg}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientAddress">Endereço</Label>
                <Input 
                  id="clientAddress" 
                  name="clientAddress" 
                  placeholder="Endereço completo" 
                  value={contractData.clientAddress}
                  onChange={handleInputChange}
                />
              </div>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-2">
                <Label htmlFor="eventAddress">Local do Evento</Label>
                <Input 
                  id="eventAddress" 
                  name="eventAddress" 
                  placeholder="Endereço do evento" 
                  value={contractData.eventAddress}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="eventDate">Data do Evento</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !eventDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {eventDate ? format(eventDate, "PPP", { locale: ptBR }) : <span>Selecionar data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={eventDate}
                      onSelect={setEventDate}
                      initialFocus
                      locale={ptBR}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventStartTime">Hora Início</Label>
                  <Input 
                    id="eventStartTime" 
                    name="eventStartTime" 
                    type="time"
                    value={contractData.eventStartTime}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventEndTime">Hora Término</Label>
                  <Input 
                    id="eventEndTime" 
                    name="eventEndTime" 
                    type="time"
                    value={contractData.eventEndTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium">Quantidades e Preços</h3>
                <Dialog open={priceDialogOpen} onOpenChange={setPriceDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={handlePriceDialogOpen}
                    >
                      <EditIcon className="h-4 w-4" />
                      <span>Editar Preços</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Editar Preços Unitários</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="adultPrice">Preço por Adulto (R$)</Label>
                        <Input
                          id="adultPrice"
                          name="adultPrice"
                          type="number"
                          step="0.01"
                          min="0"
                          value={tempAdultPrice}
                          onChange={handlePriceChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="childPrice">Preço por Criança (R$)</Label>
                        <Input
                          id="childPrice"
                          name="childPrice"
                          type="number"
                          step="0.01"
                          min="0"
                          value={tempChildPrice}
                          onChange={handlePriceChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="extraWaiterPrice">Preço por Garçom Extra (R$)</Label>
                        <Input
                          id="extraWaiterPrice"
                          name="extraWaiterPrice"
                          type="number"
                          step="0.01"
                          min="0"
                          value={tempExtraWaiterPrice}
                          onChange={handlePriceChange}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <DialogClose asChild>
                        <Button variant="secondary">Cancelar</Button>
                      </DialogClose>
                      <Button onClick={savePrices}>Salvar Preços</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adultCount">Quantidade de Adultos</Label>
                <div className="flex items-center">
                  <Input 
                    id="adultCount" 
                    name="adultCount" 
                    type="number" 
                    min="0"
                    value={contractData.adultCount}
                    onChange={handleInputChange}
                  />
                  <div className="ml-2 text-xs text-muted-foreground whitespace-nowrap">
                    {formatCurrency(contractData.adultPrice)} cada
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="childCount">Quantidade de Crianças</Label>
                <div className="flex items-center">
                  <Input 
                    id="childCount" 
                    name="childCount" 
                    type="number" 
                    min="0"
                    value={contractData.childCount}
                    onChange={handleInputChange}
                  />
                  <div className="ml-2 text-xs text-muted-foreground whitespace-nowrap">
                    {formatCurrency(contractData.childPrice)} cada
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="extraWaiters">Garçons Extras</Label>
                <div className="flex items-center">
                  <Input 
                    id="extraWaiters" 
                    name="extraWaiters" 
                    type="number" 
                    min="0"
                    value={contractData.extraWaiters}
                    onChange={handleInputChange}
                  />
                  <div className="ml-2 text-xs text-muted-foreground whitespace-nowrap">
                    {formatCurrency(contractData.extraWaiterPrice)} cada
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  O evento inclui {baseWaiters} garçom(ns) (1 a cada 30 pessoas).
                  Adicione mais se necessário.
                </p>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4">
                <div className="flex justify-between p-4 bg-secondary/50 rounded-lg">
                  <span className="font-medium">Adultos ({contractData.adultCount}x)</span>
                  <span>{formatCurrency(contractData.adultCount * contractData.adultPrice)}</span>
                </div>
                
                {contractData.childCount > 0 && (
                  <div className="flex justify-between p-4 bg-secondary/50 rounded-lg">
                    <span className="font-medium">Crianças ({contractData.childCount}x)</span>
                    <span>{formatCurrency(contractData.childCount * contractData.childPrice)}</span>
                  </div>
                )}
                
                {contractData.extraWaiters > 0 && (
                  <div className="flex justify-between p-4 bg-secondary/50 rounded-lg">
                    <span className="font-medium">Garçons extras ({contractData.extraWaiters}x)</span>
                    <span>{formatCurrency(contractData.extraWaiters * contractData.extraWaiterPrice)}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between p-4 bg-secondary/50 rounded-lg">
                  <span className="font-medium">Valor Total</span>
                  <span className="font-semibold">{formatCurrency(contractData.totalValue)}</span>
                </div>
                
                <div className="flex justify-between p-4 bg-secondary/50 rounded-lg">
                  <span className="font-medium">Entrada (40%)</span>
                  <span>{formatCurrency(contractData.downPayment)}</span>
                </div>
                
                <div className="flex justify-between p-4 bg-secondary/50 rounded-lg">
                  <span className="font-medium">Restante</span>
                  <span>{formatCurrency(contractData.totalValue - contractData.downPayment)}</span>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  <p>Entrada a ser depositada em:</p>
                  <p>Caixa Econômica Federal</p>
                  <p>Agência: 1479</p>
                  <p>Conta Corrente: 00028090-5</p>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t bg-muted/20 p-4">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className={cn(
              "transition-opacity",
              currentStep === 0 ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Anterior
          </Button>
          
          <Button
            onClick={nextStep}
            disabled={currentStep === formSteps.length - 1}
            className={cn(
              "transition-opacity",
              currentStep === formSteps.length - 1 ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
          >
            Próximo
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default ContractForm;
