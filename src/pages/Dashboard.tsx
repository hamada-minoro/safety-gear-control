
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock data for charts
const monthlyDeliveries = [
  { month: "Jan", quantity: 10 },
  { month: "Fev", quantity: 15 },
  { month: "Mar", quantity: 8 },
  { month: "Abr", quantity: 12 },
  { month: "Mai", quantity: 18 },
];

const topEPIs = [
  { name: "Capacete", quantity: 25, value: 25 },
  { name: "Luvas", quantity: 42, value: 42 },
  { name: "Óculos", quantity: 18, value: 18 },
  { name: "Protetor Auricular", quantity: 15, value: 15 },
  { name: "Máscara", quantity: 20, value: 20 },
];

const expiringEPIs = [
  { name: "Capacete 1", days: 15 },
  { name: "Luvas 3", days: 10 },
  { name: "Óculos 2", days: 7 },
  { name: "Protetor 5", days: 5 },
  { name: "Máscara 7", days: 3 },
];

const epiByMonth = [
  {
    month: "Jan",
    capacete: 5,
    luvas: 8,
    oculos: 4,
  },
  {
    month: "Fev",
    capacete: 7,
    luvas: 10,
    oculos: 6,
  },
  {
    month: "Mar",
    capacete: 3,
    luvas: 6,
    oculos: 2,
  },
  {
    month: "Abr",
    capacete: 6,
    luvas: 12,
    oculos: 8,
  },
  {
    month: "Mai",
    capacete: 8,
    luvas: 14,
    oculos: 7,
  },
];

const COLORS = [
  "#449E35", // barcelos green
  "#9DC45F", // barcelos light green
  "#2D5425", // barcelos dark green
  "#6B8E23", // olive drab
  "#556B2F", // dark olive green
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Visualize os dados e estatísticas de EPIs da sua empresa.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-barcelos/10">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total de EPIs</CardTitle>
                <CardDescription>Equipamentos ativos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">120</div>
                <p className="text-sm text-muted-foreground mt-2">
                  +10% comparado ao mês anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Entregas Recentes</CardTitle>
                <CardDescription>Últimos 30 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">18</div>
                <p className="text-sm text-muted-foreground mt-2">
                  25 colaboradores atendidos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">EPIs Próximos da Validade</CardTitle>
                <CardDescription>Expiram em 30 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-amber-500">8</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Recomendação: Agende reposição
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>EPIs Mais Utilizados</CardTitle>
                <CardDescription>
                  Distribuição por tipo de equipamento
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={topEPIs}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({
                          cx,
                          cy,
                          midAngle,
                          innerRadius,
                          outerRadius,
                          percent,
                          name,
                        }) => {
                          const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                          const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                          const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

                          return (
                            <text
                              x={x}
                              y={y}
                              fill="#fff"
                              textAnchor={x > cx ? "start" : "end"}
                              dominantBaseline="central"
                              fontSize={12}
                            >
                              {`${name} (${(percent * 100).toFixed(0)}%)`}
                            </text>
                          );
                        }}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {topEPIs.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Entregas por Mês</CardTitle>
                <CardDescription>
                  Quantidade de EPIs entregues mensalmente
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyDeliveries}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="quantity"
                        fill="#449E35"
                        name="Qtd. Entregue"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>EPIs por Tipo e Mês</CardTitle>
              <CardDescription>
                Distribuição mensal por categoria de EPI
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={epiByMonth}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="capacete" fill="#449E35" name="Capacete" />
                    <Bar dataKey="luvas" fill="#9DC45F" name="Luvas" />
                    <Bar dataKey="oculos" fill="#2D5425" name="Óculos" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>EPIs em Estoque Baixo</CardTitle>
                <CardDescription>
                  EPIs próximos ao limite mínimo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Capacete de Segurança", current: 8, min: 5 },
                    { name: "Luvas de Proteção", current: 12, min: 10 },
                    { name: "Protetor Auricular", current: 6, min: 5 },
                  ].map((item) => {
                    const percentage = (item.current / (item.min * 2)) * 100;
                    const remainingPercent = 100 - percentage;
                    
                    return (
                      <div key={item.name} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.name}</span>
                          <span className="text-sm font-medium">
                            {item.current} / Mínimo {item.min}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              percentage <= 30
                                ? "bg-red-500"
                                : percentage <= 70
                                ? "bg-amber-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>EPIs a Expirar em Breve</CardTitle>
                <CardDescription>
                  Equipamentos próximos da data de validade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expiringEPIs.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <span className="font-medium">{item.name}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.days <= 5
                            ? "bg-red-100 text-red-800"
                            : item.days <= 10
                            ? "bg-amber-100 text-amber-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {item.days} dias
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
