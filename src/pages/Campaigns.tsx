import { useEffect, useState } from 'react';
import api from '@/lib/api';
import type { Campaign } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Calendar, Users, MousePointerClick } from 'lucide-react';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await api.get('/api/campaigns/');
        setCampaigns(response.data.results || response.data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'secondary';
      case 'paused':
        return 'warning';
      case 'draft':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Campaigns
          </h1>
          <p className="text-muted-foreground mt-2">Phishing simulation campaigns</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {campaigns.map((campaign) => {
          const clickRate = campaign.target_count > 0 
            ? ((campaign.click_count / campaign.target_count) * 100).toFixed(1)
            : '0.0';

          return (
            <Card key={campaign.id} className="border-border bg-card hover:shadow-xl hover:border-white transition-all group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 text-white group-hover:text-gray-300 transition-colors">
                      <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-all">
                        <Target className="h-5 w-5 text-white" />
                      </div>
                      {campaign.persona_name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">{campaign.scenario}</p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(campaign.status)} className="shadow-sm">
                    {campaign.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                    <div className="p-2 rounded-lg bg-white/10">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Targets</p>
                      <p className="text-xl font-bold text-white">{campaign.target_count}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                    <div className="p-2 rounded-lg bg-white/10">
                      <MousePointerClick className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Clicks</p>
                      <p className="text-xl font-bold text-white">{campaign.click_count}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(campaign.sent_at).toLocaleDateString()}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Click Rate: </span>
                      <span className="font-bold text-white">
                        {clickRate}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {campaigns.length === 0 && (
        <Card className="border-border bg-card">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No campaigns found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


