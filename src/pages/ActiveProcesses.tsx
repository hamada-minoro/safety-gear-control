
import React, { useState, useEffect } from "react";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Fingerprint } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type ProcessType = "delivery" | "return";

type Process = {
  id: string;
  type: ProcessType;
  employeeId: string;
  employeeName: string;
  scheduledDate: string;
  status: "scheduled" | "completed" | "cancelled";
  items: {
    epiId: string;
    epiName: string;
    quantity: number;
  }[];
};

const ActiveProcesses = () => {
  const isMobile = useIsMobile();
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
    {
      id: "2",
      type: "delivery",
      employeeId: "2",
      employeeName: "Maria Oliveira",
      scheduledDate: "2025-05-26",
      status: "scheduled",
      items: [
        { epiId: "3", epiName: "Óculos de Segurança", quantity: 1 },
      ],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | ProcessType>("all");
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [biometricDialogOpen, setBiometricDialogOpen] = useState(false);
  const [biometricVerified, setBiometricVerified] = useState(false);
  const [showLowStockNotification, setShowLowStockNotification] = useState(true);

  // Auto-dismiss the notification after 10 seconds
  useEffect(() => {
    if (showLowStockNotification) {
      const timer = setTimeout(() => {
        setShowLowStockNotification(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showLowStockNotification]);

  const filteredProcesses = processes.filter(
    (process) =>
      process.status === "scheduled" &&
      (filterType === "all" || process.type === filterType) &&
      (process.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        process.items.some((item) =>
          item.epiName.toLowerCase().includes(searchTerm.toLowerCase())
        ))
  );

  const handleProcessSelect = (process: Process) => {
    setSelectedProcess(process);
    setBiometricDialogOpen(true);
    setBiometricVerified(false);
  };

  const simulateBiometricVerification = () => {
    toast({
      title: "Verificando biometria",
      description: "Por favor, aguarde...",
    });

    // Simulate verification process
    setTimeout(() => {
      setBiometricVerified(true);
      toast({
        title: "Biometria verificada",
        description: "A identidade do colaborador foi confirmada.",
      });
    }, 2000);
  };

  const completeProcess = () => {
    if (selectedProcess) {
      // Update process status
      setProcesses(
        processes.map((p) =>
          p.id === selectedProcess.id ? { ...p, status: "completed" } : p
        )
      );

      // Close dialog
      setBiometricDialogOpen(false);

      // Show success message
      toast({
        title: "Processo concluído",
        description: `O processo de ${
          selectedProcess.type === "delivery" ? "entrega" : "devolução"
        } foi concluído com sucesso. O PDF foi gerado.`,
      });

      // Simulate PDF generation
      setTimeout(() => {
        window.open("/reports", "_self");
      }, 1000);
    }
  };

  // Mobile card view for processes
  const ProcessCard = ({ process }: { process: Process }) => (
    <div 
      className="bg-white border rounded-lg shadow-sm p-4 mb-4 cursor-pointer hover:shadow"
      onClick={() => handleProcessSelect(process)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{process.employeeName}</h3>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            process.type === "delivery"
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {process.type === "delivery" ? "Entrega" : "Devolução"}
        </span>
      </div>
      <div className="text-sm mb-2">
        <p className="text-muted-foreground">
          Data: {new Date(process.scheduledDate).toLocaleDateString("pt-BR")}
        </p>
      </div>
      <div className="space-y-1 mb-3">
        <p className="text-sm font-medium">EPIs:</p>
        {process.items.map((item) => (
          <p key={item.epiId} className="text-sm ml-2">
            • {item.epiName} ({item.quantity})
          </p>
        ))}
      </div>
      <Button 
        size="sm" 
        className="w-full bg-barcelos hover:bg-barcelos-dark"
        onClick={(e) => {
          e.stopPropagation();
          handleProcessSelect(process);
        }}
      >
        <Fingerprint className="mr-1 h-4 w-4" />
        Finalizar Processo
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      {showLowStockNotification && (
        <Alert variant="destructive" className="mb-4 bg-red-50 border-red-200">
          <AlertTitle className="flex items-center gap-2">
            Alerta de Estoque Baixo
          </AlertTitle>
          <AlertDescription>
            <p className="mb-2">Os seguintes EPIs estão com estoque abaixo do mínimo:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Capacete de Segurança: 3 unidades (mínimo: 5)</li>
              <li>Protetor Auricular: 4 unidades (mínimo: 5)</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Processos Ativos</h2>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-card">
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Use os filtros abaixo para encontrar processos específicos.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <Input
                placeholder="Buscar por colaborador ou EPI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                onClick={() => setFilterType("all")}
                className={`${filterType === "all" ? "bg-barcelos hover:bg-barcelos-dark" : ""} text-xs md:text-sm`}
                size="sm"
              >
                Todos
              </Button>
              <Button
                variant={filterType === "delivery" ? "default" : "outline"}
                onClick={() => setFilterType("delivery")}
                className={`${filterType === "delivery" ? "bg-barcelos hover:bg-barcelos-dark" : ""} text-xs md:text-sm`}
                size="sm"
              >
                Entregas
              </Button>
              <Button
                variant={filterType === "return" ? "default" : "outline"}
                onClick={() => setFilterType("return")}
                className={`${filterType === "return" ? "bg-barcelos hover:bg-barcelos-dark" : ""} text-xs md:text-sm`}
                size="sm"
              >
                Devoluções
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Processos Ativos</CardTitle>
          <CardDescription>
            {isMobile 
              ? "Toque em um processo para iniciar a verificação biométrica." 
              : "Clique em um processo para iniciar a verificação biométrica e concluí-lo."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isMobile ? (
            // Mobile view - Cards
            filteredProcesses.length > 0 ? (
              <div>
                {filteredProcesses.map((process) => (
                  <ProcessCard key={process.id} process={process} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                Nenhum processo ativo encontrado com os filtros atuais.
              </div>
            )
          ) : (
            // Desktop view - Table
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Colaborador</TableHead>
                    <TableHead>Data Agendada</TableHead>
                    <TableHead>EPIs</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProcesses.length > 0 ? (
                    filteredProcesses.map((process) => (
                      <TableRow
                        key={process.id}
                        className="hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleProcessSelect(process)}
                      >
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              process.type === "delivery"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {process.type === "delivery" ? "Entrega" : "Devolução"}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">
                          {process.employeeName}
                        </TableCell>
                        <TableCell>
                          {new Date(process.scheduledDate).toLocaleDateString(
                            "pt-BR"
                          )}
                        </TableCell>
                        <TableCell>
                          {process.items.map((item) => (
                            <div key={item.epiId}>
                              {item.epiName} ({item.quantity})
                            </div>
                          ))}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            className="bg-barcelos hover:bg-barcelos-dark"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProcessSelect(process);
                            }}
                          >
                            <Fingerprint className="mr-1 h-4 w-4" />
                            Finalizar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Nenhum processo ativo encontrado com os filtros atuais.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={biometricDialogOpen} onOpenChange={setBiometricDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-w-[95%] p-4 md:p-6">
          <DialogHeader>
            <DialogTitle>Verificação Biométrica</DialogTitle>
            <DialogDescription>
              {!biometricVerified
                ? "Solicite que o colaborador coloque o dedo no leitor biométrico."
                : "Identidade confirmada. Revise os detalhes antes de finalizar o processo."}
            </DialogDescription>
          </DialogHeader>

          {!biometricVerified ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="mb-4 rounded-full bg-muted p-8">
                <Fingerprint className="h-16 w-16 text-barcelos" />
              </div>
              <p className="text-center text-sm text-muted-foreground mb-6">
                Aguardando leitura biométrica...
              </p>
              <Button
                onClick={simulateBiometricVerification}
                className="bg-barcelos hover:bg-barcelos-dark"
              >
                Simular Verificação
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Detalhes do Processo</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">Tipo:</div>
                  <div>
                    {selectedProcess?.type === "delivery"
                      ? "Entrega"
                      : "Devolução"}
                  </div>
                  <div className="font-medium">Colaborador:</div>
                  <div>{selectedProcess?.employeeName}</div>
                  <div className="font-medium">Data Agendada:</div>
                  <div>
                    {selectedProcess
                      ? new Date(
                          selectedProcess.scheduledDate
                        ).toLocaleDateString("pt-BR")
                      : ""}
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">EPIs</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>EPI</TableHead>
                      <TableHead className="text-right">Quantidade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedProcess?.items.map((item) => (
                      <TableRow key={item.epiId}>
                        <TableCell>{item.epiName}</TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBiometricDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={completeProcess}
              disabled={!biometricVerified}
              className={biometricVerified ? "bg-barcelos hover:bg-barcelos-dark" : ""}
            >
              Finalizar Processo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActiveProcesses;
