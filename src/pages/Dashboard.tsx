
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { evolutionsStore, EVOLUTION_CATEGORIES } from "@/lib/evolutionStore";
import { residentsStore } from "@/lib/residentStore";
import { HeartPulse, Droplet, Brain, Users, FileText, Download } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const Dashboard = () => {
  const [residentCount, setResidentCount] = useState(0);
  const [evolutionCount, setEvolutionCount] = useState(0);
  const [recentEvolutions, setRecentEvolutions] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [selectedResident, setSelectedResident] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("30");
  const [residents, setResidents] = useState<any[]>([]);
  const [bloodPressureData, setBloodPressureData] = useState<any[]>([]);
  const [hydrationData, setHydrationData] = useState<any[]>([]);

  // Cores para os gráficos
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  useEffect(() => {
    // Carregar dados do dashboard
    loadDashboardData();
    loadResidents();
  }, []);

  useEffect(() => {
    // Atualizar dados quando o residente ou período mudar
    loadBloodPressureData();
    loadHydrationData();
  }, [selectedResident, selectedPeriod]);

  const loadDashboardData = () => {
    setResidentCount(residentsStore.getResidents().length);
    setEvolutionCount(evolutionsStore.getEvolutions().length);
    
    // Evoluções recentes (últimos 7 dias)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentEvols = evolutionsStore.getEvolutions().filter(evolution => {
      const evolutionDate = new Date(evolution.date);
      return evolutionDate >= sevenDaysAgo;
    });
    
    setRecentEvolutions(recentEvols.length);
    
    // Em um app real, viria do store de usuários
    setActiveUsers(1);
  };

  const loadResidents = () => {
    const residents = residentsStore.getResidents().map(r => ({
      id: r.id,
      name: r.name
    }));
    setResidents(residents);
  };

  const loadBloodPressureData = () => {
    let evolutions = evolutionsStore.getEvolutions();
    
    // Filtrar por residente se necessário
    if (selectedResident !== "all") {
      evolutions = evolutions.filter(e => e.residentId === selectedResident);
    }
    
    // Filtrar por período
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(selectedPeriod));
    
    evolutions = evolutions.filter(e => {
      const evolutionDate = new Date(e.date);
      return evolutionDate >= cutoffDate;
    });

    // Processar dados de pressão arterial
    const data = evolutions.map(evolution => {
      const bpValue = evolution.data.bloodPressure || "";
      let systolic = 0;
      let diastolic = 0;

      if (bpValue) {
        const parts = bpValue.split('/');
        if (parts.length === 2) {
          systolic = parseInt(parts[0]);
          diastolic = parseInt(parts[1]);
        }
      }

      return {
        date: new Date(evolution.date).toLocaleDateString('pt-BR'),
        systolic: systolic || 0,
        diastolic: diastolic || 0,
        residentName: residentsStore.getResidentById(evolution.residentId)?.name || "Desconhecido"
      };
    }).filter(item => item.systolic > 0 && item.diastolic > 0);

    // Ordenar por data
    data.sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateA.getTime() - dateB.getTime();
    });

    setBloodPressureData(data);
  };

  const loadHydrationData = () => {
    let evolutions = evolutionsStore.getEvolutions();
    
    // Filtrar por residente se necessário
    if (selectedResident !== "all") {
      evolutions = evolutions.filter(e => e.residentId === selectedResident);
    }
    
    // Filtrar por período
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(selectedPeriod));
    
    evolutions = evolutions.filter(e => {
      const evolutionDate = new Date(e.date);
      return evolutionDate >= cutoffDate;
    });

    // Processar dados de hidratação
    const hydrationCounts: Record<string, number> = {
      "Bem hidratado": 0,
      "Precisa de mais água": 0,
      "Desidratado": 0
    };

    evolutions.forEach(evolution => {
      const hydration = evolution.data.hydration;
      if (hydration && hydrationCounts[hydration] !== undefined) {
        hydrationCounts[hydration]++;
      }
    });

    const data = Object.entries(hydrationCounts).map(([name, value]) => ({ name, value }));
    setHydrationData(data);
  };

  const calculateAverageBloodPressure = () => {
    if (bloodPressureData.length === 0) return { systolic: 0, diastolic: 0 };
    
    const sum = bloodPressureData.reduce((acc, item) => {
      return {
        systolic: acc.systolic + item.systolic,
        diastolic: acc.diastolic + item.diastolic
      };
    }, { systolic: 0, diastolic: 0 });
    
    return {
      systolic: Math.round(sum.systolic / bloodPressureData.length),
      diastolic: Math.round(sum.diastolic / bloodPressureData.length)
    };
  };

  const getHydrationIndex = () => {
    const total = hydrationData.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return 0;
    
    // Cálculo do índice: (bem hidratados * 100) / total
    const wellHydrated = hydrationData.find(item => item.name === "Bem hidratado")?.value || 0;
    return Math.round((wellHydrated / total) * 100);
  };

  const handleExportPDF = () => {
    // Em um app real, implementaria a exportação para PDF
    alert("Funcionalidade de exportação para PDF será implementada em breve!");
  };

  const averageBP = calculateAverageBloodPressure();
  const hydrationIndex = getHydrationIndex();

  const renderStatCard = (title: string, value: React.ReactNode, icon: React.ReactNode, description: string, color: string) => (
    <Card className={`${color}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-custom-blue">Dashboard</h2>
      
      <div className="flex flex-wrap gap-4 pb-4">
        <div className="flex-1">
          <Select
            value={selectedResident}
            onValueChange={setSelectedResident}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um residente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os residentes</SelectItem>
              {residents.map((resident) => (
                <SelectItem key={resident.id} value={resident.id}>
                  {resident.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select
            value={selectedPeriod}
            onValueChange={setSelectedPeriod}
          >
            <SelectTrigger>
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
              <SelectItem value="365">Último ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={handleExportPDF}
          >
            <FileText className="h-4 w-4" />
            <Download className="h-4 w-4" />
            Exportar Relatório
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderStatCard(
          "Residentes",
          residentCount,
          <Users className="h-5 w-5 text-custom-blue" />,
          "Total de residentes cadastrados",
          "border-l-4 border-custom-blue"
        )}
        {renderStatCard(
          "Evoluções",
          evolutionCount,
          <FileText className="h-5 w-5 text-custom-brown" />,
          "Total de registros de evolução",
          "border-l-4 border-custom-brown"
        )}
        {renderStatCard(
          "Pressão Arterial",
          bloodPressureData.length > 0 ? `${averageBP.systolic}/${averageBP.diastolic} mmHg` : "N/A",
          <HeartPulse className="h-5 w-5 text-red-500 animate-pulse" />,
          "Média da pressão arterial",
          "border-l-4 border-red-500"
        )}
        {renderStatCard(
          "Hidratação",
          `${hydrationIndex}%`,
          <Droplet className="h-5 w-5 text-blue-500" />,
          "Índice de boa hidratação",
          "border-l-4 border-blue-500"
        )}
      </div>

      <Tabs defaultValue="bloodPressure" className="mt-8">
        <TabsList>
          <TabsTrigger value="bloodPressure">Pressão Arterial</TabsTrigger>
          <TabsTrigger value="hydration">Hidratação</TabsTrigger>
          <TabsTrigger value="mood">Estado Emocional</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bloodPressure" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HeartPulse className="mr-2 h-5 w-5 text-red-500" />
                Histórico de Pressão Arterial
              </CardTitle>
              <CardDescription>
                Acompanhamento da pressão arterial ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-0">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[600px]">
                  {bloodPressureData.length > 0 ? (
                    <LineChart
                      width={800}
                      height={300}
                      data={bloodPressureData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="systolic" 
                        stroke="#FF4560" 
                        name="Sistólica" 
                        strokeWidth={2} 
                        dot={{ r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="diastolic" 
                        stroke="#008FFB" 
                        name="Diastólica" 
                        strokeWidth={2} 
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      Nenhum dado de pressão arterial disponível para o período selecionado
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="hydration" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Droplet className="mr-2 h-5 w-5 text-blue-500" />
                Níveis de Hidratação
              </CardTitle>
              <CardDescription>
                Distribuição dos níveis de hidratação registrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                <div className="min-w-[600px] flex items-center justify-center">
                  {hydrationData.length > 0 && hydrationData.some(item => item.value > 0) ? (
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <PieChart width={300} height={300}>
                        <Pie
                          data={hydrationData}
                          cx={150}
                          cy={150}
                          innerRadius={60}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={(entry) => entry.name}
                        >
                          {hydrationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                      
                      <div className="space-y-2">
                        {hydrationData.map((entry, index) => (
                          <div key={index} className="flex items-center">
                            <div 
                              className="w-4 h-4 mr-2" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span>{entry.name}: {entry.value} registros</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      Nenhum dado de hidratação disponível para o período selecionado
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="mood" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5 text-purple-500" />
                Estado Emocional
              </CardTitle>
              <CardDescription>
                Acompanhamento do estado emocional ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
              Dados de estado emocional serão exibidos aqui
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
