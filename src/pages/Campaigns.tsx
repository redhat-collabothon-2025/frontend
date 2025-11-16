import { useEffect, useState } from 'react';
import { campaignsService, eventsService, employeesService, phishingService } from '@/services';
import type { Campaign, CampaignAnalytics, EmployeeDetail, Event, BulkPhishingRequest } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Calendar, Users, MousePointerClick, Play, Pause, RefreshCw, Plus, Eye, TrendingUp, Trash2, Activity, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [analytics, setAnalytics] = useState<CampaignAnalytics | null>(null);
  const [activeTab, setActiveTab] = useState<'campaigns' | 'events'>('campaigns');
  const [currentCampaignPage, setCurrentCampaignPage] = useState(1);
  const [totalCampaignCount, setTotalCampaignCount] = useState(0);
  const [hasCampaignNext, setHasCampaignNext] = useState(false);
  const [hasCampaignPrevious, setHasCampaignPrevious] = useState(false);
  const [currentEventPage, setCurrentEventPage] = useState(1);
  const [totalEventCount, setTotalEventCount] = useState(0);
  const [hasEventNext, setHasEventNext] = useState(false);
  const [hasEventPrevious, setHasEventPrevious] = useState(false);
  const [formData, setFormData] = useState({
    persona_name: '',
    scenario: '',
    target_count: 0,
    click_count: 0,
    sent_at: new Date().toISOString().split('T')[0],
    status: 'draft' as const,
  });

  const fetchCampaigns = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await campaignsService.list(page);
      setCampaigns(response.results || []);
      setTotalCampaignCount(response.count || 0);
      setHasCampaignNext(!!response.next);
      setHasCampaignPrevious(!!response.previous);
      setCurrentCampaignPage(page);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async (page: number = 1) => {
    setEventsLoading(true);
    try {
      const response = await eventsService.list(page);
      setEvents(response.results || []);
      setTotalEventCount(response.count || 0);
      setHasEventNext(!!response.next);
      setHasEventPrevious(!!response.previous);
      setCurrentEventPage(page);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setEventsLoading(false);
    }
  };

  const handleLaunch = async (campaign: Campaign) => {
    setActionLoading(campaign.id);
    try {
      await campaignsService.launch(campaign.id, campaign);
      await fetchCampaigns(currentCampaignPage);
      toast.success('Campaign launched successfully!');
    } catch (error) {
      console.error('Error launching campaign:', error);
      toast.error('Failed to launch campaign');
    } finally {
      setActionLoading(null);
    }
  };

  const handlePause = async (campaign: Campaign) => {
    setActionLoading(campaign.id);
    try {
      await campaignsService.pause(campaign.id, campaign);
      await fetchCampaigns(currentCampaignPage);
      toast.success('Campaign paused successfully!');
    } catch (error) {
      console.error('Error pausing campaign:', error);
      toast.error('Failed to pause campaign');
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
      await fetchCampaigns(currentCampaignPage);
      // send email
      const targetEmployees: EmployeeDetail[] = []
      let response = await employeesService.get("a8c96bbe-529e-44ea-8606-3f105ef49637");
      targetEmployees.push(response);
      response = await employeesService.get("97b74ac4-8d63-4f32-a33d-89aebbe3b574");
      targetEmployees.push(response);
      response = await employeesService.get("a44cbec4-afcb-407d-a38a-9d73cf3e1bc6");
      targetEmployees.push(response);
      //
      const request: BulkPhishingRequest = {
        user_ids: targetEmployees.map(e => e.id),
        template_type: 'linkedin',
      };
    
      try {
        const response = await phishingService.bulkSend(request);
        console.log(`Sent: ${response.sent_count}, Failed: ${response.failed_count}`);
      } catch (error) {
        console.error('Error sending bulk phishing:', error);
      }
      //
      toast.success('Campaign created successfully!');
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Failed to create campaign');
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
    toast('Are you sure you want to delete this campaign?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            await campaignsService.delete(campaignId);
            await fetchCampaigns(currentCampaignPage);
            if (detailOpen) setDetailOpen(false);
            toast.success('Campaign deleted successfully!');
          } catch (error) {
            console.error('Error deleting campaign:', error);
            toast.error('Failed to delete campaign');
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    });
  };

  useEffect(() => {
    fetchCampaigns();
    fetchEvents();
  }, []);

  const handleCampaignNextPage = () => {
    if (hasCampaignNext) {
      fetchCampaigns(currentCampaignPage + 1);
    }
  };

  const handleCampaignPreviousPage = () => {
    if (hasCampaignPrevious) {
      fetchCampaigns(currentCampaignPage - 1);
    }
  };

  const handleEventNextPage = () => {
    if (hasEventNext) {
      fetchEvents(currentEventPage + 1);
    }
  };

  const handleEventPreviousPage = () => {
    if (hasEventPrevious) {
      fetchEvents(currentEventPage - 1);
    }
  };

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

  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case 'phishing_click':
        return { variant: 'destructive' as const, label: 'Phishing Click' };
      case 'bulk_export':
        return { variant: 'warning' as const, label: 'Bulk Export' };
      case 'usb_connect':
        return { variant: 'default' as const, label: 'USB Connect' };
      default:
        return { variant: 'secondary' as const, label: type };
    }
  };

  if (loading && eventsLoading) {
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
            Campaigns & Events
          </h1>
          <p className="text-muted-foreground mt-2">Phishing simulation campaigns and security events</p>
        </div>
      </div>

      <Tabs defaultValue="campaigns" className="w-full" onValueChange={(value) => setActiveTab(value as 'campaigns' | 'events')}>
        <div className="flex items-center justify-between mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            {activeTab === 'campaigns' && (
              <Button
                onClick={() => setCreateOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Create Campaign</span>
              </Button>
            )}
            <Button
              onClick={() => activeTab === 'campaigns' ? fetchCampaigns() : fetchEvents()}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>

        <TabsContent value="campaigns" className="space-y-4">

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

          {/* Pagination Controls */}
          {totalCampaignCount > 0 && (
            <div className="flex items-center justify-between border-t border-border pt-4 mt-6">
              <div className="text-sm text-muted-foreground">
                Page {currentCampaignPage} • Showing {campaigns.length} of {totalCampaignCount} campaigns
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCampaignPreviousPage}
                  disabled={!hasCampaignPrevious}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  onClick={handleCampaignNextPage}
                  disabled={!hasCampaignNext}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

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
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <div className="space-y-4">
            {events.map((event) => {
              const eventType = getEventTypeBadge(event.event_type);

              return (
                <Card key={event.id} className="border-border bg-card hover:shadow-xl hover:border-white transition-all group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
                          <Activity className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-white group-hover:text-gray-300 transition-colors">
                            {eventType.label}
                          </h3>
                          <Badge variant={eventType.variant} className="shadow-sm">
                            {event.event_type}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm mb-3">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <div className="p-1.5 rounded-md bg-accent">
                              <User className="h-3.5 w-3.5" />
                            </div>
                            <span>User ID: {event.user.slice(0, 8)}...</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <div className="p-1.5 rounded-md bg-accent">
                              <Clock className="h-3.5 w-3.5" />
                            </div>
                            <span>{new Date(event.created_at).toLocaleString()}</span>
                          </div>
                        </div>
                        {Object.keys(event.event_data).length > 0 && (
                          <Card className="bg-accent border-border mt-3">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm text-muted-foreground">Event Data</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <pre className="text-xs text-white overflow-x-auto">
                                {JSON.stringify(event.event_data, null, 2)}
                              </pre>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalEventCount > 0 && (
            <div className="flex items-center justify-between border-t border-border pt-4 mt-6">
              <div className="text-sm text-muted-foreground">
                Page {currentEventPage} • Showing {events.length} of {totalEventCount} events
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleEventPreviousPage}
                  disabled={!hasEventPrevious}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  onClick={handleEventNextPage}
                  disabled={!hasEventNext}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {events.length === 0 && (
            <Card className="border-border bg-card">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No events found</p>
                <p className="text-sm text-muted-foreground/60 mt-1">Events will appear here when they occur</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

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


