
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Fingerprint } from "lucide-react";

type Employee = {
  id: string;
  name: string;
  cpf: string;
  status: "active" | "inactive";
  hasBiometrics: boolean;
};

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      name: "João Silva",
      cpf: "123.456.789-00",
      status: "active",
      hasBiometrics: true,
    },
    {
      id: "2",
      name: "Maria Oliveira",
      cpf: "987.654.321-00",
      status: "active",
      hasBiometrics: false,
    },
  ]);

  const [newEmployee, setNewEmployee] = useState<Omit<Employee, "id" | "status" | "hasBiometrics">>({
    name: "",
    cpf: "",
  });

  const [open, setOpen] = useState(false);
  const [biometricDialogOpen, setBiometricDialogOpen] = useState(false);
  const [currentEmployeeId, setCurrentEmployeeId] = useState<string | null>(null);

  const handleAddEmployee = () => {
    const id = Math.random().toString(36).substring(2, 9);
    
    setEmployees([
      ...employees,
      {
        id,
        ...newEmployee,
        status: "active",
        hasBiometrics: false,
      },
    ]);
    
    setNewEmployee({
      name: "",
      cpf: "",
    });
    
    setOpen(false);
    
    toast({
      title: "Colaborador adicionado",
      description: `O colaborador ${newEmployee.name} foi adicionado com sucesso.`,
    });
  };

  const handleBiometricCapture = (employeeId: string) => {
    setCurrentEmployeeId(employeeId);
    setBiometricDialogOpen(true);
  };

  const simulateBiometricCapture = () => {
    // Simulate biometric capture with a timeout
    toast({
      title: "Capturando biometria",
      description: "Por favor, mantenha o dedo no leitor...",
    });

    setTimeout(() => {
      if (currentEmployeeId) {
        setEmployees(
          employees.map((emp) =>
            emp.id === currentEmployeeId
              ? { ...emp, hasBiometrics: true }
              : emp
          )
        );
        
        setBiometricDialogOpen(false);
        setCurrentEmployeeId(null);
        
        toast({
          title: "Biometria capturada",
          description: "Biometria capturada com sucesso!",
        });
      }
    }, 2000);
  };

  const toggleEmployeeStatus = (id: string) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === id
          ? {
              ...emp,
              status: emp.status === "active" ? "inactive" : "active",
            }
          : emp
      )
    );
    
    const employee = employees.find((emp) => emp.id === id);
    const newStatus = employee?.status === "active" ? "inativo" : "ativo";
    
    toast({
      title: "Status atualizado",
      description: `O colaborador agora está ${newStatus}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Colaboradores</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-barcelos hover:bg-barcelos-dark">
              Adicionar Colaborador
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Colaborador</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para adicionar um novo colaborador.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={newEmployee.name}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cpf" className="text-right">
                  CPF
                </Label>
                <Input
                  id="cpf"
                  value={newEmployee.cpf}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, cpf: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleAddEmployee}
                className="bg-barcelos hover:bg-barcelos-dark"
              >
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Colaboradores Cadastrados</CardTitle>
          <CardDescription>
            Gerencie os colaboradores e suas biometrias.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Biometria</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.cpf}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={employee.status === "active"}
                        onCheckedChange={() =>
                          toggleEmployeeStatus(employee.id)
                        }
                      />
                      <span
                        className={
                          employee.status === "active"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {employee.status === "active" ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {employee.hasBiometrics ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        <Fingerprint className="mr-1 h-3 w-3" />
                        Capturada
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        Não capturada
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBiometricCapture(employee.id)}
                        disabled={employee.hasBiometrics}
                      >
                        <Fingerprint className="mr-1 h-4 w-4" />
                        {employee.hasBiometrics
                          ? "Biometria OK"
                          : "Capturar Biometria"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={biometricDialogOpen}
        onOpenChange={setBiometricDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Captura de Biometria</DialogTitle>
            <DialogDescription>
              Coloque o dedo do colaborador no leitor biométrico para capturar a digital.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="mb-4 rounded-full bg-muted p-8">
              <Fingerprint className="h-16 w-16 text-barcelos" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Aguardando leitura biométrica...
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={simulateBiometricCapture}
              className="bg-barcelos hover:bg-barcelos-dark"
            >
              Simular Captura
            </Button>
            <Button
              variant="outline"
              onClick={() => setBiometricDialogOpen(false)}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Employees;
