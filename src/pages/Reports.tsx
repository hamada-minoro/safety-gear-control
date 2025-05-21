
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { FileText, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type ProcessType = "delivery" | "return";
type Report = {
  id: string;
  type: ProcessType;
  employeeId: string;
  employeeName: string;
  completedDate: string;
  fileName: string;
  items: {
    epiId: string;
    epiName: string;
    quantity: number;
  }[];
};

const Reports = () => {
  const [reports, setReports] = useState<Report[]>([
    {
      id: "1",
      type: "delivery",
      employeeId: "1",
      employeeName: "João Silva",
      completedDate: "2025-05-20",
      fileName: "entrega_epi_123456.pdf",
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
      completedDate: "2025-05-21",
      fileName: "entrega_epi_789012.pdf",
      items: [
        { epiId: "3", epiName: "Óculos de Segurança", quantity: 1 },
      ],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | ProcessType>("all");
  const [dateFilter, setDateFilter] = useState<"all" | "recent" | "custom">("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("all");

  // List of employee IDs and names for filter
  const employees = [
    { id: "1", name: "João Silva" },
    { id: "2", name: "Maria Oliveira" },
  ];

  const filteredReports = reports.filter((report) => {
    // Filter by type
    if (filterType !== "all" && report.type !== filterType) {
      return false;
    }
    
    // Filter by date
    if (dateFilter === "recent") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      if (new Date(report.completedDate) < thirtyDaysAgo) {
        return false;
      }
    } else if (dateFilter === "custom") {
      if (startDate && new Date(report.completedDate) < new Date(startDate)) {
        return false;
      }
      if (endDate && new Date(report.completedDate) > new Date(endDate)) {
        return false;
      }
    }
    
    // Filter by employee
    if (employeeFilter !== "all" && report.employeeId !== employeeFilter) {
      return false;
    }
    
    // Filter by search term
    if (
      searchTerm &&
      !report.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !report.items.some((item) =>
        item.epiName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ) {
      return false;
    }
    
    return true;
  });

  const downloadReport = (reportId: string) => {
    const report = reports.find((r) => r.id === reportId);
    
    if (!report) return;
    
    toast({
      title: "Baixando relatório",
      description: `O relatório ${report.fileName} está sendo baixado.`,
    });
    
    // Simulate download by opening in new tab (in a real app, this would download the file)
    setTimeout(() => {
      // In a real implementation, this would be a URL to the actual PDF
      // For demo purposes, show a toast indicating success
      toast({
        title: "Download concluído",
        description: `O relatório ${report.fileName} foi baixado com sucesso.`,
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-card">
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Use os filtros abaixo para encontrar relatórios específicos.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Busca</label>
              <Input
                placeholder="Nome do colaborador ou EPI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Tipo</label>
              <Select
                value={filterType}
                onValueChange={(value) =>
                  setFilterType(value as "all" | ProcessType)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="delivery">Entrega</SelectItem>
                  <SelectItem value="return">Devolução</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Período
              </label>
              <Select
                value={dateFilter}
                onValueChange={(value) =>
                  setDateFilter(value as "all" | "recent" | "custom")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="recent">Últimos 30 dias</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Colaborador
              </label>
              <Select
                value={employeeFilter}
                onValueChange={setEmployeeFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o colaborador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {dateFilter === "custom" && (
            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Data Inicial
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Data Final
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Relatórios Disponíveis</CardTitle>
          <CardDescription>
            Lista de comprovantes de entrega e devolução de EPIs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Colaborador</TableHead>
                <TableHead>Data de Conclusão</TableHead>
                <TableHead>EPIs</TableHead>
                <TableHead>Arquivo</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          report.type === "delivery"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {report.type === "delivery" ? "Entrega" : "Devolução"}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {report.employeeName}
                    </TableCell>
                    <TableCell>
                      {new Date(report.completedDate).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      {report.items.map((item) => (
                        <div key={item.epiId}>
                          {item.epiName} ({item.quantity})
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-muted-foreground">
                        <FileText className="h-4 w-4 mr-1" />
                        {report.fileName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadReport(report.id)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Baixar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Nenhum relatório encontrado com os filtros atuais.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
