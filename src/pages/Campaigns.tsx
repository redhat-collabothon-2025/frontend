import { useEffect, useState } from 'react';
import { campaignsService } from '@/services';
import type { Campaign, CampaignAnalytics } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Target, Calendar, Users, MousePointerClick, Play, Pause, RefreshCw, Plus, Eye, TrendingUp, Trash2 } from 'lucide-react';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [analytics, setAnalytics] = useState<CampaignAnalytics | null>(null);
  const [formData, setFormData] = useState({
    persona_name: '',
    scenario: '',
    target_count: 0,
    click_count: 0,
    sent_at: new Date().toISOString().split('T')[0],
    status: 'draft' as const,
  });

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await campaignsService.list();
      setCampaigns(response.results || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunch = async (campaign: Campaign) => {
    setActionLoading(campaign.id);
    try {
      await campaignsService.launch(campaign.id, campaign);
      await fetchCampaigns();
      alert('Campaign launched successfully!');
    } catch (error) {
      console.error('Error launching campaign:', error);
      alert('Failed to launch campaign');
    } finally {
      setActionLoading(null);
    }
  };

  const handlePause = async (campaign: Campaign) => {
    setActionLoading(campaign.id);
    try {
      await campaignsService.pause(campaign.id, campaign);
      await fetchCampaigns();
      alert('Campaign paused successfully!');
    } catch (error) {
      console.error('Error pausing campaign:', error);
      alert('Failed to pause campaign');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreate = async () => {
    try {
      await campaignsService.create(formData);
      setCreateOpen(false);
      setFormData({
        persona_name: '',
        scenario: '',
        target_count: 0,
        click_count: 0,
        sent_at: new Date().toISOString().split('T')[0],
        status: 'draft',
      });
      await fetchCampaigns();
      alert('Campaign created successfully!');
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign');
    }
  };

  const handleViewDetails = async (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    try {
      const analyticsData = await campaignsService.getAnalytics(campaign.id);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
    setDetailOpen(true);
  };

  const handleDelete = async (campaignId: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      await campaignsService.delete(campaignId);
      await fetchCampaigns();
      if (detailOpen) setDetailOpen(false);
      alert('Campaign deleted successfully!');
    } catch (error) {
      console.error('Error deleting campaign:', error);
      alert('Failed to delete campaign');
    }
  };

  useEffect(() => {
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
        <div className="flex gap-2">
          <Button
            onClick={() => setCreateOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create Campaign</span>
          </Button>
          <Button
            onClick={fetchCampaigns}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
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
                <div className="mt-4 pt-4 border-t border-border space-y-3">
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
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleViewDetails(campaign)}
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-2"
                    >
                      <Eye className="h-3 w-3" />
                      Details
                    </Button>
                    {campaign.status !== 'active' && (
                      <Button
                        onClick={() => handleLaunch(campaign)}
                        disabled={actionLoading === campaign.id}
                        size="sm"
                        className="flex-1 gap-2"
                      >
                        <Play className="h-3 w-3" />
                        Launch
                      </Button>
                    )}
                    {campaign.status === 'active' && (
                      <Button
                        onClick={() => handlePause(campaign)}
                        disabled={actionLoading === campaign.id}
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-2"
                      >
                        <Pause className="h-3 w-3" />
                        Pause
                      </Button>
                    )}
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

      {/* Create Campaign Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>Create a new phishing simulation campaign</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="persona_name">Persona Name</Label>
              <Input
                id="persona_name"
                value={formData.persona_name}
                onChange={(e) => setFormData({ ...formData, persona_name: e.target.value })}
                placeholder="Enter persona name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="scenario">Scenario</Label>
              <Input
                id="scenario"
                value={formData.scenario}
                onChange={(e) => setFormData({ ...formData, scenario: e.target.value })}
                placeholder="Enter scenario description"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="target_count">Target Count</Label>
                <Input
                  id="target_count"
                  type="number"
                  value={formData.target_count}
                  onChange={(e) => setFormData({ ...formData, target_count: parseInt(e.target.value) || 0 })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="sent_at">Send Date</Label>
                <Input
                  id="sent_at"
                  type="date"
                  value={formData.sent_at}
                  onChange={(e) => setFormData({ ...formData, sent_at: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="mt-1"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </Select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleCreate} className="flex-1">
                Create Campaign
              </Button>
              <Button onClick={() => setCreateOpen(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Campaign Details Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedCampaign?.persona_name}</DialogTitle>
            <DialogDescription>{selectedCampaign?.scenario}</DialogDescription>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">
                    <Badge variant={getStatusBadgeVariant(selectedCampaign.status)}>
                      {selectedCampaign.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label>Sent Date</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(selectedCampaign.sent_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {analytics && (
                <Card className="bg-accent border-border">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Click Rate</p>
                        <p className="text-2xl font-bold text-white">{analytics.click_rate.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Completion Rate</p>
                        <p className="text-2xl font-bold text-white">{analytics.completion_rate.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Targets</p>
                        <p className="text-2xl font-bold text-white">{analytics.target_count}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Clicks</p>
                        <p className="text-2xl font-bold text-white">{analytics.click_count}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-2">
                <Button onClick={() => setDetailOpen(false)} variant="outline" className="flex-1">
                  Close
                </Button>
                <Button
                  onClick={() => selectedCampaign && handleDelete(selectedCampaign.id)}
                  variant="destructive"
                  className="flex-1 gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}


