
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
import { toast } from "@/hooks/use-toast";

type EPI = {
  id: string;
  name: string;
  lifespan: string;
  quantity: number;
  minQuantity: number;
  purchaseDate: string;
  ca: string;
  expirationDate: string;
};

const EPIPage = () => {
  const [epis, setEpis] = useState<EPI[]>([
    {
      id: "1",
      name: "Capacete de Segurança",
      lifespan: "12 meses",
      quantity: 25,
      minQuantity: 5,
      purchaseDate: "2025-01-15",
      ca: "12345",
      expirationDate: "2026-01-15",
    },
    {
      id: "2",
      name: "Luvas de Proteção",
      lifespan: "6 meses",
      quantity: 50,
      minQuantity: 10,
      purchaseDate: "2025-02-20",
      ca: "67890",
      expirationDate: "2025-08-20",
    },
  ]);

  const [newEPI, setNewEPI] = useState<Omit<EPI, "id" | "expirationDate">>({
    name: "",
    lifespan: "",
    quantity: 0,
    minQuantity: 0,
    purchaseDate: "",
    ca: "",
  });

  const [open, setOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const handleAddEPI = () => {
    const id = Math.random().toString(36).substring(2, 9);
    
    // Simulate expiration date being fetched from API
    const purchaseDate = new Date(newEPI.purchaseDate);
    const expirationDate = new Date(purchaseDate);
    expirationDate.setMonth(expirationDate.getMonth() + 12); // Add 12 months as default
    
    setEpis([
      ...epis,
      {
        id,
        ...newEPI,
        expirationDate: expirationDate.toISOString().split("T")[0],
      },
    ]);
    
    setNewEPI({
      name: "",
      lifespan: "",
      quantity: 0,
      minQuantity: 0,
      purchaseDate: "",
      ca: "",
    });
    
    setOpen(false);
    
    toast({
      title: "EPI adicionado",
      description: `O EPI ${newEPI.name} foi adicionado com sucesso.`,
    });
  };

  const validateCA = () => {
    if (!newEPI.ca) {
      toast({
        variant: "destructive",
        title: "CA não informado",
        description: "Por favor, informe o número do CA.",
      });
      return;
    }
    
    setIsValidating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsValidating(false);
      
      toast({
        title: "CA validado",
        description: "O CA informado é válido até 12 meses após a data de compra.",
      });
    }, 1500);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR").format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">EPIs</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-barcelos hover:bg-barcelos-dark">
              Adicionar EPI
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Adicionar EPI</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para adicionar um novo EPI.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={newEPI.name}
                  onChange={(e) => setNewEPI({ ...newEPI, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lifespan" className="text-right">
                  Vida Útil
                </Label>
                <Input
                  id="lifespan"
                  value={newEPI.lifespan}
                  onChange={(e) =>
                    setNewEPI({ ...newEPI, lifespan: e.target.value })
                  }
                  placeholder="Ex: 12 meses"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Quantidade
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newEPI.quantity}
                  onChange={(e) =>
                    setNewEPI({ ...newEPI, quantity: Number(e.target.value) })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="minQuantity" className="text-right">
                  Quantidade Mínima
                </Label>
                <Input
                  id="minQuantity"
                  type="number"
                  value={newEPI.minQuantity}
                  onChange={(e) =>
                    setNewEPI({ ...newEPI, minQuantity: Number(e.target.value) })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="purchaseDate" className="text-right">
                  Data da Compra
                </Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={newEPI.purchaseDate}
                  onChange={(e) =>
                    setNewEPI({ ...newEPI, purchaseDate: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ca" className="text-right">
                  CA
                </Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    id="ca"
                    value={newEPI.ca}
                    onChange={(e) => setNewEPI({ ...newEPI, ca: e.target.value })}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={validateCA}
                    disabled={isValidating}
                  >
                    {isValidating ? "Validando..." : "Validar"}
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleAddEPI}
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
          <CardTitle>EPIs Cadastrados</CardTitle>
          <CardDescription>
            Gerencie os EPIs disponíveis para entrega aos colaboradores.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CA</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Mín. Qtd.</TableHead>
                <TableHead>Data da Compra</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {epis.map((epi) => (
                <TableRow key={epi.id}>
                  <TableCell className="font-medium">{epi.name}</TableCell>
                  <TableCell>{epi.ca}</TableCell>
                  <TableCell>
                    <span className={epi.quantity <= epi.minQuantity ? "text-red-600 font-medium" : ""}>
                      {epi.quantity}
                    </span>
                  </TableCell>
                  <TableCell>{epi.minQuantity}</TableCell>
                  <TableCell>{formatDate(epi.purchaseDate)}</TableCell>
                  <TableCell>{formatDate(epi.expirationDate)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Editar
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

export default EPIPage;
