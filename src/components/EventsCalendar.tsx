
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, parseISO, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ContractData } from "@/utils/contractGenerator";
import { getContracts } from "@/utils/storageUtils";

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
  guestCount: number;
}

interface EventsCalendarProps {
  contractData: ContractData;
}

const EventsCalendar: React.FC<EventsCalendarProps> = ({ contractData }) => {
  const [date, setDate] = useState<Date | undefined>(
    contractData.eventDate ? parseISO(contractData.eventDate) : new Date()
  );
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState<Event[]>([]);

  // Carregar eventos da memória
  useEffect(() => {
    const storedContracts = getContracts();
    
    const mappedEvents = storedContracts.map((contract) => ({
      id: contract.id,
      title: contract.clientName,
      date: parseISO(contract.eventDate),
      time: contract.eventStartTime,
      location: contract.eventAddress,
      guestCount: contract.adultCount + (contract.childCount || 0)
    }));
    
    setEvents(mappedEvents);
  }, []);

  // Filtrar eventos para a data selecionada
  useEffect(() => {
    if (date) {
      const filteredEvents = events.filter((event) => 
        isSameDay(event.date, date)
      );
      setSelectedDateEvents(filteredEvents);
    } else {
      setSelectedDateEvents([]);
    }
  }, [date, events]);

  // Marcar dias com eventos no calendário
  const eventDays = events.map((event) => event.date);
  
  return (
    <motion.div
      className="w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="glass overflow-hidden border border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-center">Agenda de Eventos</CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              locale={ptBR}
              className="rounded-md border"
              modifiers={{
                booked: eventDays,
              }}
              modifiersStyles={{
                booked: {
                  fontWeight: "bold",
                  backgroundColor: "hsl(var(--primary) / 0.1)",
                  color: "hsl(var(--primary))",
                  borderRadius: "0.25rem",
                }
              }}
            />
          </div>
          <div className="w-full md:w-1/2">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {date ? format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Eventos do Dia"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDateEvents.length > 0 ? (
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-4">
                      {selectedDateEvents.map((event) => (
                        <div 
                          key={event.id}
                          className="p-3 border rounded-md hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">{event.title}</h3>
                            <Badge variant="outline">{event.time}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p>Local: {event.location}</p>
                            <p>Convidados: {event.guestCount}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    {date 
                      ? "Nenhum evento nesta data."
                      : "Selecione uma data para ver os eventos."}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EventsCalendar;
