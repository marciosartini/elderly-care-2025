
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { evolutionsStore, EVOLUTION_CATEGORIES } from "@/lib/evolutionStore";
import { residentsStore } from "@/lib/residentStore";

const Dashboard = () => {
  const [residentCount, setResidentCount] = useState(0);
  const [evolutionCount, setEvolutionCount] = useState(0);
  const [recentEvolutions, setRecentEvolutions] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    // Load dashboard data
    setResidentCount(residentsStore.getResidents().length);
    setEvolutionCount(evolutionsStore.getEvolutions().length);
    
    // Recent evolutions (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentEvols = evolutionsStore.getEvolutions().filter(evolution => {
      const evolutionDate = new Date(evolution.date);
      return evolutionDate >= sevenDaysAgo;
    });
    
    setRecentEvolutions(recentEvols.length);
    
    // Would get from users store in a real app
    setActiveUsers(1);
  }, []);

  const getEvolutionStats = () => {
    const evolutions = evolutionsStore.getEvolutions();
    const stats: Record<string, Record<string, number>> = {};
    
    EVOLUTION_CATEGORIES.forEach(category => {
      if (category.fieldType === 'option') {
        stats[category.id] = {};
        
        category.options?.forEach(option => {
          stats[category.id][option.value] = 0;
        });
        
        evolutions.forEach(evolution => {
          const value = evolution.data[category.id];
          
          if (Array.isArray(value)) {
            value.forEach(v => {
              if (stats[category.id][v] !== undefined) {
                stats[category.id][v]++;
              }
            });
          } else if (value && stats[category.id][value] !== undefined) {
            stats[category.id][value]++;
          }
        });
      }
    });
    
    return stats;
  };

  const stats = getEvolutionStats();

  const renderStatCard = (title: string, value: React.ReactNode, description: string, color: string) => (
    <Card className={`${color}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  const renderSummaryCard = (categoryId: string, categoryTitle: string) => {
    const categoryStats = stats[categoryId];
    if (!categoryStats) return null;
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{categoryTitle}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {Object.entries(categoryStats)
              .sort(([, a], [, b]) => b - a)
              .map(([label, count]) => (
                <div key={label} className="flex items-center justify-between">
                  <span>{label}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-custom-blue">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderStatCard(
          "Residentes",
          residentCount,
          "Total de residentes cadastrados",
          "border-l-4 border-custom-blue"
        )}
        {renderStatCard(
          "Evoluções",
          evolutionCount,
          "Total de registros de evolução",
          "border-l-4 border-custom-brown"
        )}
        {renderStatCard(
          "Recentes",
          recentEvolutions,
          "Evoluções nos últimos 7 dias",
          "border-l-4 border-custom-green"
        )}
        {renderStatCard(
          "Usuários Ativos",
          activeUsers,
          "Usuários com acesso ao sistema",
          "border-l-4 border-custom-gray"
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-custom-blue mt-8">Resumo de Evoluções</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderSummaryCard("feeding", "Alimentação")}
        {renderSummaryCard("hydration", "Hidratação")}
        {renderSummaryCard("mood", "Humor")}
        {renderSummaryCard("physicalActivity", "Atividade Física")}
        {renderSummaryCard("mobility", "Mobilidade")}
        {renderSummaryCard("sleep", "Sono")}
      </div>
    </div>
  );
};

export default Dashboard;
