
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

type ProcessType = "delivery" | "return";

type Process = {
  id: string;
  type: ProcessType;
  employeeId: string;
  employeeName: string;
  scheduledDate: string;
  status: "scheduled" | "completed" | "cancelled";
  items: ProcessItem[];
};

type ProcessItem = {
  epiId: string;
  epiName: string;
  quantity: number;
};

// Mock data for employees and EPIs
const mockEmployees = [
  { id: "1", name: "João Silva" },
  { id: "2", name: "Maria Oliveira" },
];

const mockEPIs = [
  { id: "1", name: "Capacete de Segurança", available: 25 },
  { id: "2", name: "Luvas de Proteção", available: 50 },
  { id: "3", name: "Óculos de Segurança", available: 30 },
];

const Processes = () => {
  const [processes, setProcesses] = useState<Process[]>([
    {
      id: "1",
      type: "delivery",
      employeeId: "1",
      employeeName: "João Silva",
      scheduledDate: "2025-05-25",
      status: "scheduled",
      items: [
        { epiId: "1", epiName: "Capacete de Segurança", quantity: 1 },
        { epiId: "2", epiName: "Luvas de Proteção", quantity: 2 },
      ],
    },
  ]);

  const [open, setOpen] = useState(false);
  const [processType, setProcessType] = useState<ProcessType>("delivery");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [selectedItems, setSelectedItems] = useState<ProcessItem[]>([]);
  const [currentEpiId, setCurrentEpiId] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState(1);

  const addItem = () => {
    if (!currentEpiId) {
      toast({
        variant: "destructive",
        title: "EPI não selecionado",
        description: "Por favor, selecione um EPI.",
      });
      return;
    }

    const epi = mockEPIs.find((e) => e.id === currentEpiId);
    
    if (!epi) return;
    
    // Check if item already exists
    const existingItemIndex = selectedItems.findIndex((item) => item.epiId === currentEpiId);
    
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex].quantity += currentQuantity;
      setSelectedItems(updatedItems);
    } else {
      // Add new item
      setSelectedItems([
        ...selectedItems,
        {
          epiId: currentEpiId,
          epiName: epi.name,
          quantity: currentQuantity,
        },
      ]);
    }
    
    // Reset selection
    setCurrentEpiId("");
    setCurrentQuantity(1);
  };

  const removeItem = (epiId: string) => {
    setSelectedItems(selectedItems.filter((item) => item.epiId !== epiId));
  };

  const handleCreateProcess = () => {
    if (!selectedEmployee) {
      toast({
        variant: "destructive",
        title: "Colaborador não selecionado",
        description: "Por favor, selecione um colaborador.",
      });
      return;
    }

    if (!scheduledDate) {
      toast({
        variant: "destructive",
        title: "Data não selecionada",
        description: "Por favor, selecione uma data para o processo.",
      });
      return;
    }

    if (selectedItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Nenhum EPI selecionado",
        description: "Por favor, adicione pelo menos um EPI ao processo.",
      });
      return;
    }

    const employee = mockEmployees.find((e) => e.id === selectedEmployee);
    
    if (!employee) return;
    
    const newProcess: Process = {
      id: Math.random().toString(36).substring(2, 9),
      type: processType,
      employeeId: selectedEmployee,
      employeeName: employee.name,
      scheduledDate,
      status: "scheduled",
      items: selectedItems,
    };
    
    setProcesses([...processes, newProcess]);
    
    // Reset form
    setSelectedEmployee("");
    setScheduledDate("");
    setSelectedItems([]);
    setOpen(false);
    
    toast({
      title: "Processo criado",
      description: `O processo de ${processType === "delivery" ? "entrega" : "devolução"} foi agendado com sucesso.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Processos</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-barcelos hover:bg-barcelos-dark">
              Agendar Processo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Agendar Processo</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para agendar um novo processo de entrega ou devolução de EPI.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="processType" className="text-right">
                  Tipo de Processo
                </Label>
                <Select
                  value={processType}
                  onValueChange={(value) => setProcessType(value as ProcessType)}
                >
                  <SelectTrigger id="processType" className="col-span-3">
                    <SelectValue placeholder="Selecione o tipo de processo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delivery">Entrega de EPI</SelectItem>
                    <SelectItem value="return">Devolução de EPI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employee" className="text-right">
                  Colaborador
                </Label>
                <Select
                  value={selectedEmployee}
                  onValueChange={setSelectedEmployee}
                >
                  <SelectTrigger id="employee" className="col-span-3">
                    <SelectValue placeholder="Selecione o colaborador" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmployees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="scheduledDate" className="text-right">
                  Data Agendada
                </Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Adicionar EPIs</Label>
                <div className="col-span-3 space-y-4">
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Label htmlFor="epi">EPI</Label>
                      <Select
                        value={currentEpiId}
                        onValueChange={setCurrentEpiId}
                      >
                        <SelectTrigger id="epi">
                          <SelectValue placeholder="Selecione o EPI" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockEPIs.map((epi) => (
                            <SelectItem key={epi.id} value={epi.id}>
                              {epi.name} (Disponível: {epi.available})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-24">
                      <Label htmlFor="quantity">Quantidade</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={currentQuantity}
                        onChange={(e) => setCurrentQuantity(Number(e.target.value))}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addItem}
                      className="mb-0.5"
                    >
                      Adicionar
                    </Button>
                  </div>

                  {selectedItems.length > 0 && (
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>EPI</TableHead>
                            <TableHead>Quantidade</TableHead>
                            <TableHead className="w-[100px]">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedItems.map((item) => (
                            <TableRow key={item.epiId}>
                              <TableCell>{item.epiName}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeItem(item.epiId)}
                                  className="text-destructive hover:text-destructive/90"
                                >
                                  Remover
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreateProcess}
                className="bg-barcelos hover:bg-barcelos-dark"
              >
                Agendar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Processos Agendados</CardTitle>
          <CardDescription>
            Gerencie os processos de entrega e devolução de EPI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Colaborador</TableHead>
                <TableHead>Data Agendada</TableHead>
                <TableHead>EPIs</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processes.map((process) => (
                <TableRow key={process.id}>
                  <TableCell>
                    {process.type === "delivery" ? "Entrega" : "Devolução"}
                  </TableCell>
                  <TableCell>{process.employeeName}</TableCell>
                  <TableCell>
                    {new Date(process.scheduledDate).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    {process.items.map((item) => (
                      <div key={item.epiId}>
                        {item.epiName} ({item.quantity})
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        process.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : process.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {process.status === "completed"
                        ? "Concluído"
                        : process.status === "cancelled"
                        ? "Cancelado"
                        : "Agendado"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Route to active processes
                          window.location.href = "/active-processes";
                        }}
                      >
                        Ver Detalhes
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Processes;
