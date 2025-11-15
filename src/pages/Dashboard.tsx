import { useEffect, useState } from 'react';
import { risksService } from '@/services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { RiskOverview, RiskDistribution, RiskTrending } from '@/types';
import { Users, AlertTriangle, TrendingUp, Shield, RefreshCw } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const [overview, setOverview] = useState<RiskOverview | null>(null);
  const [distribution, setDistribution] = useState<RiskDistribution[]>([]);
  const [trending, setTrending] = useState<RiskTrending[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const [overviewData, distributionData, trendingData] = await Promise.all([
        risksService.getOverview(),
        risksService.getDistribution(),
        risksService.getTrending(),
      ]);
      setOverview(overviewData);
      setDistribution(distributionData);
      setTrending(trendingData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white animate-fade-in">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">Security risk overview and insights</p>
        </div>
        <Button
          onClick={fetchData}
          disabled={refreshing}
          className="gap-2 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card hover:shadow-2xl hover:border-white hover:scale-105 transition-all duration-300 cursor-pointer group animate-slide-in-up">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
            <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-all duration-300">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
              {overview?.total_employees || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active users in system</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card hover:shadow-2xl hover:border-white hover:scale-105 transition-all duration-300 cursor-pointer group animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Average Risk Score</CardTitle>
            <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-all duration-300">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
              {overview?.average_risk_score?.toFixed(1) || '0.0'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Out of 100</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card hover:shadow-2xl hover:border-white hover:scale-105 transition-all duration-300 cursor-pointer group animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Critical Risk</CardTitle>
            <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-all duration-300">
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
              {overview?.critical_count || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Employees at critical risk</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card hover:shadow-2xl hover:border-white hover:scale-105 transition-all duration-300 cursor-pointer group animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Recent Incidents</CardTitle>
            <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-all duration-300">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
              {overview?.recent_incidents || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Risk Distribution Doughnut Chart */}
        <Card className="border-border bg-card hover:shadow-xl transition-all duration-300 animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-base sm:text-lg">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
              Risk Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              {distribution.length === 0 ? (
                <div className="text-muted-foreground">No data available</div>
              ) : (
                <Doughnut
                  data={{
                    labels: distribution.map(d => d.risk_level),
                    datasets: [{
                      data: distribution.map(d => d.count),
                      backgroundColor: distribution.map(d => {
                        if (d.risk_level === 'CRITICAL') return 'rgba(239, 68, 68, 0.8)';  // Red
                        if (d.risk_level === 'MEDIUM') return 'rgba(251, 191, 36, 0.8)';   // Yellow
                        return 'rgba(34, 197, 94, 0.8)';  // Green for LOW
                      }),
                      borderColor: distribution.map(d => {
                        if (d.risk_level === 'CRITICAL') return 'rgba(239, 68, 68, 1)';
                        if (d.risk_level === 'MEDIUM') return 'rgba(251, 191, 36, 1)';
                        return 'rgba(34, 197, 94, 1)';
                      }),
                      borderWidth: 2,
                      hoverOffset: 20,
                      hoverBorderWidth: 3,
                    }]
                  }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: '#ffffff',
                        font: { size: 14, weight: 'bold' },
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle',
                      }
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      titleColor: '#ffffff',
                      bodyColor: '#ffffff',
                      padding: 12,
                      borderColor: '#ffffff',
                      borderWidth: 1,
                      displayColors: true,
                      callbacks: {
                        label: (context) => {
                          const label = context.label || '';
                          const value = context.parsed || 0;
                          const total = distribution.reduce((sum, d) => sum + d.count, 0);
                          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
                          return `${label}: ${value} (${percentage}%)`;
                        }
                      }
                    }
                  },
                  animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 2000,
                  }
                }}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Risk Summary Bar Chart */}
        <Card className="border-border bg-card hover:shadow-xl transition-all duration-300 animate-slide-in-up" style={{ animationDelay: '0.5s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-base sm:text-lg">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
              Risk Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Bar
                data={{
                  labels: ['Critical', 'Medium', 'Low'],
                  datasets: [{
                    label: 'Employee Count',
                    data: [
                      overview?.critical_count || 0,
                      overview?.medium_count || 0,
                      overview?.low_count || 0
                    ],
                    backgroundColor: [
                      'rgba(239, 68, 68, 0.8)',
                      'rgba(251, 191, 36, 0.8)',
                      'rgba(34, 197, 94, 0.8)',
                    ],
                    borderColor: [
                      'rgba(239, 68, 68, 1)',
                      'rgba(251, 191, 36, 1)',
                      'rgba(34, 197, 94, 1)',
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                    hoverBackgroundColor: [
                      'rgba(239, 68, 68, 1)',
                      'rgba(251, 191, 36, 1)',
                      'rgba(34, 197, 94, 1)',
                    ],
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      titleColor: '#ffffff',
                      bodyColor: '#ffffff',
                      padding: 12,
                      borderColor: '#ffffff',
                      borderWidth: 1,
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        color: '#ffffff',
                        font: { size: 12 },
                        stepSize: 1,
                      },
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                      }
                    },
                    x: {
                      ticks: {
                        color: '#ffffff',
                        font: { size: 12, weight: 'bold' },
                      },
                      grid: {
                        display: false,
                      }
                    }
                  },
                  animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart',
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {trending.length > 0 && (
        <Card className="border-border bg-card hover:shadow-xl transition-all duration-300 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-base sm:text-lg">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
              Risk Trends Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <Line
                data={{
                  labels: trending.map(t => new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
                  datasets: [
                    {
                      label: 'Average Risk Score',
                      data: trending.map(t => t.average_risk_score),
                      borderColor: 'rgba(147, 51, 234, 1)',
                      backgroundColor: 'rgba(147, 51, 234, 0.1)',
                      borderWidth: 3,
                      fill: true,
                      tension: 0.4,
                      pointRadius: 6,
                      pointHoverRadius: 8,
                      pointBackgroundColor: 'rgba(147, 51, 234, 1)',
                      pointBorderColor: '#ffffff',
                      pointBorderWidth: 2,
                      pointHoverBackgroundColor: '#ffffff',
                      pointHoverBorderColor: 'rgba(147, 51, 234, 1)',
                      yAxisID: 'y',
                    },
                    {
                      label: 'Critical',
                      data: trending.map(t => t.critical_count),
                      borderColor: 'rgba(239, 68, 68, 1)',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      borderWidth: 3,
                      fill: true,
                      tension: 0.4,
                      pointRadius: 5,
                      pointHoverRadius: 7,
                      pointBackgroundColor: 'rgba(239, 68, 68, 1)',
                      pointBorderColor: '#ffffff',
                      pointBorderWidth: 2,
                      yAxisID: 'y1',
                    },
                    {
                      label: 'Medium',
                      data: trending.map(t => t.medium_count),
                      borderColor: 'rgba(251, 191, 36, 1)',
                      backgroundColor: 'rgba(251, 191, 36, 0.1)',
                      borderWidth: 3,
                      fill: true,
                      tension: 0.4,
                      pointRadius: 5,
                      pointHoverRadius: 7,
                      pointBackgroundColor: 'rgba(251, 191, 36, 1)',
                      pointBorderColor: '#ffffff',
                      pointBorderWidth: 2,
                      yAxisID: 'y1',
                    },
                    {
                      label: 'Low',
                      data: trending.map(t => t.low_count),
                      borderColor: 'rgba(34, 197, 94, 1)',
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      borderWidth: 3,
                      fill: true,
                      tension: 0.4,
                      pointRadius: 5,
                      pointHoverRadius: 7,
                      pointBackgroundColor: 'rgba(34, 197, 94, 1)',
                      pointBorderColor: '#ffffff',
                      pointBorderWidth: 2,
                      yAxisID: 'y1',
                    },
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  interaction: {
                    mode: 'index',
                    intersect: false,
                  },
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        color: '#ffffff',
                        font: { size: 12, weight: 'bold' },
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle',
                      }
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      titleColor: '#ffffff',
                      bodyColor: '#ffffff',
                      padding: 12,
                      borderColor: '#ffffff',
                      borderWidth: 1,
                      displayColors: true,
                    }
                  },
                  scales: {
                    y: {
                      type: 'linear',
                      display: true,
                      position: 'left',
                      beginAtZero: true,
                      ticks: {
                        color: 'rgba(147, 51, 234, 1)',
                        font: { size: 11, weight: 'bold' },
                      },
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                      },
                      title: {
                        display: true,
                        text: 'Avg Risk Score',
                        color: 'rgba(147, 51, 234, 1)',
                        font: { size: 12, weight: 'bold' }
                      }
                    },
                    y1: {
                      type: 'linear',
                      display: true,
                      position: 'right',
                      beginAtZero: true,
                      ticks: {
                        color: '#ffffff',
                        font: { size: 11, weight: 'bold' },
                        stepSize: 1,
                      },
                      grid: {
                        drawOnChartArea: false,
                      },
                      title: {
                        display: true,
                        text: 'Employee Count',
                        color: '#ffffff',
                        font: { size: 12, weight: 'bold' }
                      }
                    },
                    x: {
                      ticks: {
                        color: '#ffffff',
                        font: { size: 11 },
                      },
                      grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                      }
                    }
                  },
                  animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart',
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

