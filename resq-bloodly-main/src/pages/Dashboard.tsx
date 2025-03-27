
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { getAllBloodRequests, getDonorsForBloodType, updateBloodRequestStatus } from '@/services/backendService';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { BLOOD_COMPATIBILITY, BloodRequest } from '@/types/blood';
import { useScrollTrigger, useMagneticEffect } from '@/utils/animation';
import { AlertCircle, CheckCircle, Clock, Droplet, User } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  const magneticButtonRef = useMagneticEffect(25);
  const fadeUpAnimation = useScrollTrigger({ animation: 'fade-up', threshold: 0.1 });
  const fadeLeftAnimation = useScrollTrigger({ animation: 'fade-left', threshold: 0.1, delay: 100 });
  const fadeRightAnimation = useScrollTrigger({ animation: 'fade-right', threshold: 0.1, delay: 200 });
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      toast({
        title: "Authentication Required",
        description: "Please log in to access the dashboard.",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, navigate, toast]);
  
  // Load blood requests
  useEffect(() => {
    if (user) {
      let requests: BloodRequest[] = [];
      
      if (user.role === 'requester' || user.role === 'hospital') {
        // Get requests created by this user
        requests = getAllBloodRequests().filter(req => req.requesterUserId === user.id);
      } else if (user.role === 'donor' && user.bloodType) {
        // Get compatible requests for this donor
        const compatibleTypes = BLOOD_COMPATIBILITY[user.bloodType].canDonateTo;
        requests = getAllBloodRequests().filter(req => 
          compatibleTypes.includes(req.bloodType) && 
          req.status === 'pending'
        );
      } else if (user.role === 'admin') {
        // Admins can see all requests
        requests = getAllBloodRequests();
      }
      
      setBloodRequests(requests);
    }
  }, [user]);
  
  const handleFulfillRequest = async (requestId: string) => {
    if (!user) return;
    
    try {
      await updateBloodRequestStatus(requestId, 'matched', user.id);
      
      toast({
        title: "Success!",
        description: "You have been matched as a donor for this request.",
      });
      
      // Update local state
      setBloodRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'matched', matchedDonors: [...(req.matchedDonors || []), user.id] } 
          : req
      ));
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process your request",
        variant: "destructive",
      });
    }
  };
  
  const getStatusBadge = (status: BloodRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Pending</Badge>;
      case 'matched':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Matched</Badge>;
      case 'fulfilled':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Fulfilled</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getUrgencyBadge = (urgency: BloodRequest['urgency']) => {
    switch (urgency) {
      case 'critical':
        return <Badge className="bg-red-500 hover:bg-red-600">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-500 hover:bg-orange-600">High Priority</Badge>;
      case 'normal':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Normal</Badge>;
      case 'routine':
        return <Badge className="bg-green-500 hover:bg-green-600">Routine</Badge>;
      default:
        return <Badge>{urgency}</Badge>;
    }
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  if (!isAuthenticated || !user) {
    return null; // Don't render anything if not authenticated
  }
  
  return (
    <div className="min-h-screen bg-background dark:bg-dark-gradient relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10">
        <Navbar />
        
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div ref={fadeUpAnimation.ref} className={fadeUpAnimation.className} style={fadeUpAnimation.style}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
                  <p className="text-gray-600 dark:text-gray-300">Welcome back, {user.name}!</p>
                </div>
                
                <div className="mt-4 md:mt-0">
                  {user.role === 'requester' && (
                    <Button 
                      ref={magneticButtonRef}
                      onClick={() => navigate('/find-blood')} 
                      className="bg-blood-600 hover:bg-blood-700 text-white"
                    >
                      Request Blood
                    </Button>
                  )}
                  
                  {user.role === 'donor' && (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blood-500 to-blood-700 p-4 rounded-lg text-white font-medium shadow-lg">
                          <Droplet className="h-5 w-5" />
                          <span className="text-lg">{user.bloodType}</span>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl">
                        <div className="space-y-2">
                          <h4 className="font-semibold">Your Blood Type: {user.bloodType}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">You can donate to:</p>
                          <div className="flex flex-wrap gap-2">
                            {user.bloodType && BLOOD_COMPATIBILITY[user.bloodType].canDonateTo.map(type => (
                              <Badge key={type} variant="outline" className="bg-blood-50 text-blood-700 dark:bg-blood-900/20 dark:text-blood-400">
                                {type}
                              </Badge>
                            ))}
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">You can receive from:</p>
                          <div className="flex flex-wrap gap-2">
                            {user.bloodType && BLOOD_COMPATIBILITY[user.bloodType].canReceiveFrom.map(type => (
                              <Badge key={type} variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  )}
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full h-auto mb-8">
                <TabsTrigger value="overview" className="py-3">Overview</TabsTrigger>
                {user.role === 'requester' && <TabsTrigger value="my-requests" className="py-3">My Requests</TabsTrigger>}
                {user.role === 'donor' && <TabsTrigger value="my-donations" className="py-3">My Donations</TabsTrigger>}
                {user.role === 'donor' && <TabsTrigger value="available-requests" className="py-3">Available Requests</TabsTrigger>}
                <TabsTrigger value="profile" className="py-3">Profile</TabsTrigger>
              </TabsList>
              
              <div className="mt-6">
                <TabsContent value="overview">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div ref={fadeLeftAnimation.ref} className={fadeLeftAnimation.className} style={fadeLeftAnimation.style}>
                      <Card className="transform transition hover:scale-105 hover:shadow-lg duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">
                            {user.role === 'donor' 
                              ? 'Available Requests' 
                              : user.role === 'requester' 
                                ? 'My Requests' 
                                : 'Total Requests'}
                          </CardTitle>
                          <CardDescription>
                            {user.role === 'donor' 
                              ? 'Requests matching your blood type' 
                              : user.role === 'requester' 
                                ? 'Your blood requests' 
                                : 'All blood requests'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-center">
                            <span className="text-4xl font-bold text-blood-600">{bloodRequests.length}</span>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Button variant="ghost" className="w-full" onClick={() => 
                            setActiveTab(user.role === 'donor' 
                              ? 'available-requests' 
                              : user.role === 'requester' 
                                ? 'my-requests' 
                                : 'overview')
                          }>
                            View All
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                    
                    <div className={fadeUpAnimation.className} style={{...fadeUpAnimation.style, transitionDelay: '150ms'}}>
                      <Card className="transform transition hover:scale-105 hover:shadow-lg duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">
                            {user.role === 'donor' 
                              ? 'Donations Made' 
                              : user.role === 'requester' 
                                ? 'Matched Donors' 
                                : 'Total Donors'}
                          </CardTitle>
                          <CardDescription>
                            {user.role === 'donor' 
                              ? 'Your blood donations' 
                              : user.role === 'requester' 
                                ? 'Donors matched to your requests' 
                                : 'Registered donors'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-center">
                            <span className="text-4xl font-bold text-blood-600">{
                              user.role === 'donor' 
                                ? bloodRequests.filter(req => req.matchedDonors?.includes(user.id)).length
                                : user.role === 'requester'
                                  ? bloodRequests.filter(req => req.matchedDonors && req.matchedDonors.length > 0).length
                                  : 0 // In a real app, we'd get this from the backend
                            }</span>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Button variant="ghost" className="w-full" onClick={() => 
                            setActiveTab(user.role === 'donor' 
                              ? 'my-donations' 
                              : 'my-requests')
                          }>
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                    
                    <div ref={fadeRightAnimation.ref} className={fadeRightAnimation.className} style={fadeRightAnimation.style}>
                      <Card className="transform transition hover:scale-105 hover:shadow-lg duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Account Status</CardTitle>
                          <CardDescription>Your profile information</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-center">
                            <span className="text-4xl font-bold text-green-600">Active</span>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Button variant="ghost" className="w-full" onClick={() => setActiveTab('profile')}>
                            View Profile
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>
                  
                  {/* Recent Activity */}
                  <div className={`mt-8 ${fadeUpAnimation.className}`} style={{...fadeUpAnimation.style, transitionDelay: '300ms'}}>
                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Your latest blood donation activities</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {bloodRequests.length > 0 ? (
                          <div className="space-y-4">
                            {bloodRequests.slice(0, 3).map((request) => (
                              <div key={request.id} className="flex items-start p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                <div className="flex-shrink-0 mr-3">
                                  {request.status === 'pending' ? (
                                    <Clock className="h-6 w-6 text-yellow-500" />
                                  ) : request.status === 'matched' ? (
                                    <User className="h-6 w-6 text-blue-500" />
                                  ) : request.status === 'fulfilled' ? (
                                    <CheckCircle className="h-6 w-6 text-green-500" />
                                  ) : (
                                    <AlertCircle className="h-6 w-6 text-red-500" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                      Blood Request: {request.patientName}
                                    </h4>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {formatDate(request.updatedAt)}
                                    </span>
                                  </div>
                                  <div className="mt-1 flex flex-wrap gap-2">
                                    <Badge variant="outline" className="bg-blood-50 text-blood-700 dark:bg-blood-900/20 dark:text-blood-400">
                                      {request.bloodType}
                                    </Badge>
                                    {getStatusBadge(request.status)}
                                    {getUrgencyBadge(request.urgency)}
                                  </div>
                                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                    {request.units} unit(s) at {request.hospitalName || request.location.address}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400">No recent activity found</p>
                            {user.role === 'requester' && (
                              <Button 
                                className="mt-4 bg-blood-600 hover:bg-blood-700 text-white" 
                                onClick={() => navigate('/find-blood')}
                              >
                                Create Blood Request
                              </Button>
                            )}
                          </div>
                        )}
                      </CardContent>
                      {bloodRequests.length > 3 && (
                        <CardFooter>
                          <Button variant="ghost" className="w-full" onClick={() => 
                            setActiveTab(user.role === 'donor' 
                              ? 'available-requests' 
                              : 'my-requests')
                          }>
                            View All
                          </Button>
                        </CardFooter>
                      )}
                    </Card>
                  </div>
                </TabsContent>
                
                {/* My Requests Tab (for requesters) */}
                {user.role === 'requester' && (
                  <TabsContent value="my-requests">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Blood Requests</h2>
                        <Button 
                          onClick={() => navigate('/find-blood')}
                          className="bg-blood-600 hover:bg-blood-700 text-white"
                        >
                          New Request
                        </Button>
                      </div>
                      
                      {bloodRequests.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                          {bloodRequests.map((request) => (
                            <Card key={request.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
                              <div className="flex flex-col md:flex-row">
                                <div className="md:w-2/3 p-6">
                                  <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                      Patient: {request.patientName}
                                    </h3>
                                    <div className="flex gap-2">
                                      {getStatusBadge(request.status)}
                                      {getUrgencyBadge(request.urgency)}
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">Blood Type</p>
                                      <p className="text-lg font-medium text-gray-900 dark:text-white">{request.bloodType}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">Units Needed</p>
                                      <p className="text-lg font-medium text-gray-900 dark:text-white">{request.units}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                                      <p className="text-lg font-medium text-gray-900 dark:text-white">
                                        {request.hospitalName || request.location.address}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                                      <p className="text-lg font-medium text-gray-900 dark:text-white">
                                        {formatDate(request.createdAt)}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  {request.reason && (
                                    <div className="mt-4">
                                      <p className="text-sm text-gray-500 dark:text-gray-400">Reason</p>
                                      <p className="text-gray-700 dark:text-gray-300">{request.reason}</p>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="md:w-1/3 bg-gray-50 dark:bg-gray-700/30 p-6 flex flex-col">
                                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Matched Donors</h4>
                                  
                                  {request.matchedDonors && request.matchedDonors.length > 0 ? (
                                    <div className="space-y-3 mb-auto">
                                      {request.matchedDonors.map((donorId) => (
                                        <div key={donorId} className="flex items-center bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                                          <div className="w-10 h-10 rounded-full bg-blood-100 dark:bg-blood-900/40 flex items-center justify-center mr-3">
                                            <User className="h-5 w-5 text-blood-600 dark:text-blood-400" />
                                          </div>
                                          <div>
                                            <p className="font-medium text-gray-900 dark:text-white">Donor #{donorId.split('-')[1]}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Matched on {formatDate(request.updatedAt)}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-center py-8 mb-auto">
                                      <p className="text-gray-500 dark:text-gray-400">No donors matched yet</p>
                                    </div>
                                  )}
                                  
                                  <div className="mt-6">
                                    {request.status === 'pending' && (
                                      <Button variant="outline" className="w-full" onClick={() => {
                                        // In a real app, we would update the status on the server
                                        toast({
                                          title: "Feature Coming Soon",
                                          description: "You'll be able to cancel requests in the future.",
                                        });
                                      }}>
                                        Cancel Request
                                      </Button>
                                    )}
                                    
                                    {request.status === 'matched' && (
                                      <Button 
                                        variant="outline" 
                                        className="w-full"
                                        onClick={() => {
                                          // In a real app, we would update the status on the server
                                          toast({
                                            title: "Feature Coming Soon",
                                            description: "You'll be able to mark requests as fulfilled in the future.",
                                          });
                                        }}
                                      >
                                        Mark as Fulfilled
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No Blood Requests</h3>
                          <p className="text-gray-500 dark:text-gray-400 mb-6">You haven't created any blood requests yet.</p>
                          <Button 
                            onClick={() => navigate('/find-blood')}
                            className="bg-blood-600 hover:bg-blood-700 text-white"
                          >
                            Create Blood Request
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                )}
                
                {/* My Donations Tab (for donors) */}
                {user.role === 'donor' && (
                  <TabsContent value="my-donations">
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Donations</h2>
                      
                      {bloodRequests.some(req => req.matchedDonors?.includes(user.id)) ? (
                        <div className="grid grid-cols-1 gap-6">
                          {bloodRequests
                            .filter(req => req.matchedDonors?.includes(user.id))
                            .map((request) => (
                              <Card key={request.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                <CardHeader>
                                  <div className="flex items-center justify-between">
                                    <CardTitle>Donation for {request.patientName}</CardTitle>
                                    {getStatusBadge(request.status)}
                                  </div>
                                  <CardDescription>
                                    Matched on {formatDate(request.updatedAt)}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">Blood Type</p>
                                      <p className="text-lg font-medium text-gray-900 dark:text-white">{request.bloodType}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">Units</p>
                                      <p className="text-lg font-medium text-gray-900 dark:text-white">{request.units}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                                      <p className="text-lg font-medium text-gray-900 dark:text-white">
                                        {request.hospitalName || request.location.address}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">Urgency</p>
                                      <div>{getUrgencyBadge(request.urgency)}</div>
                                    </div>
                                  </div>
                                  
                                  {request.reason && (
                                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Reason</p>
                                      <p className="text-gray-700 dark:text-gray-300">{request.reason}</p>
                                    </div>
                                  )}
                                </CardContent>
                                <CardFooter className="border-t border-gray-100 dark:border-gray-700 pt-4">
                                  <div className="w-full flex justify-between items-center">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      Contact: {request.requesterContact}
                                    </p>
                                    <Button variant="outline" onClick={() => {
                                      // In a real app, we would show contact details or a chat interface
                                      toast({
                                        title: "Feature Coming Soon",
                                        description: "You'll be able to contact requesters in the future.",
                                      });
                                    }}>
                                      Contact Requester
                                    </Button>
                                  </div>
                                </CardFooter>
                              </Card>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No Donations Yet</h3>
                          <p className="text-gray-500 dark:text-gray-400 mb-6">You haven't made any blood donations yet.</p>
                          <Button 
                            onClick={() => setActiveTab('available-requests')}
                            className="bg-blood-600 hover:bg-blood-700 text-white"
                          >
                            Find Blood Requests
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                )}
                
                {/* Available Requests Tab (for donors) */}
                {user.role === 'donor' && (
                  <TabsContent value="available-requests">
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Available Blood Requests</h2>
                      
                      {bloodRequests.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                          {bloodRequests.map((request) => (
                            <Card key={request.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
                              <div className="flex flex-col md:flex-row">
                                <div className="md:w-2/3 p-6">
                                  <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                      Patient: {request.patientName}
                                    </h3>
                                    <div className="flex gap-2">
                                      {getStatusBadge(request.status)}
                                      {getUrgencyBadge(request.urgency)}
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">Blood Type Needed</p>
                                      <p className="text-lg font-medium text-gray-900 dark:text-white">{request.bloodType}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">Units Needed</p>
                                      <p className="text-lg font-medium text-gray-900 dark:text-white">{request.units}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                                      <p className="text-lg font-medium text-gray-900 dark:text-white">
                                        {request.hospitalName || request.location.address}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">Requested On</p>
                                      <p className="text-lg font-medium text-gray-900 dark:text-white">
                                        {formatDate(request.createdAt)}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  {request.reason && (
                                    <div className="mt-4">
                                      <p className="text-sm text-gray-500 dark:text-gray-400">Reason</p>
                                      <p className="text-gray-700 dark:text-gray-300">{request.reason}</p>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="md:w-1/3 bg-gray-50 dark:bg-gray-700/30 p-6 flex flex-col">
                                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Blood Compatibility</h4>
                                  
                                  <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge variant="outline" className="bg-blood-50 text-blood-700 dark:bg-blood-900/20 dark:text-blood-400">
                                        Your Type: {user.bloodType}
                                      </Badge>
                                      <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                        Needed: {request.bloodType}
                                      </Badge>
                                    </div>
                                    
                                    {user.bloodType && BLOOD_COMPATIBILITY[user.bloodType].canDonateTo.includes(request.bloodType) ? (
                                      <p className="text-green-600 dark:text-green-400 font-medium text-sm">
                                        ✓ You are compatible with this blood type
                                      </p>
                                    ) : (
                                      <p className="text-red-600 dark:text-red-400 font-medium text-sm">
                                        ✗ You are not compatible with this blood type
                                      </p>
                                    )}
                                  </div>
                                  
                                  <div className="mt-auto">
                                    <Button 
                                      className="w-full bg-blood-600 hover:bg-blood-700 text-white"
                                      disabled={!user.bloodType || !BLOOD_COMPATIBILITY[user.bloodType].canDonateTo.includes(request.bloodType) || request.status !== 'pending'}
                                      onClick={() => handleFulfillRequest(request.id)}
                                    >
                                      {!user.bloodType || !BLOOD_COMPATIBILITY[user.bloodType].canDonateTo.includes(request.bloodType) 
                                        ? 'Incompatible Blood Type' 
                                        : request.status !== 'pending'
                                          ? 'Already Matched'
                                          : 'Volunteer as Donor'}
                                    </Button>
                                    
                                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                                      Contact: {request.requesterContact}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No Available Requests</h3>
                          <p className="text-gray-500 dark:text-gray-400">
                            There are currently no blood requests matching your blood type.
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                )}
                
                {/* Profile Tab */}
                <TabsContent value="profile">
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h2>
                    
                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Your account details</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                            <p className="text-lg font-medium text-gray-900 dark:text-white">{user.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                            <p className="text-lg font-medium text-gray-900 dark:text-white">{user.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                            <p className="text-lg font-medium text-gray-900 dark:text-white">{user.phoneNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                            <p className="text-lg font-medium text-gray-900 dark:text-white">{user.location}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Account Type</p>
                            <p className="text-lg font-medium text-gray-900 dark:text-white capitalize">{user.role}</p>
                          </div>
                          {user.bloodType && (
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Blood Type</p>
                              <p className="text-lg font-medium text-gray-900 dark:text-white">{user.bloodType}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="border-t border-gray-100 dark:border-gray-700 pt-4">
                        <Button className="mr-2" variant="outline">Edit Profile</Button>
                        <Button variant="outline">Change Password</Button>
                      </CardFooter>
                    </Card>
                    
                    {user.role === 'donor' && (
                      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <CardHeader>
                          <CardTitle>Donation Preferences</CardTitle>
                          <CardDescription>Set your availability and preferences</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 dark:text-gray-300">
                            This feature will allow you to set your donation schedule and preferences.
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button onClick={() => {
                            toast({
                              title: "Feature Coming Soon",
                              description: "Donation preferences will be available in a future update.",
                            });
                          }}>
                            Set Preferences
                          </Button>
                        </CardFooter>
                      </Card>
                    )}
                    
                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle>Privacy Settings</CardTitle>
                        <CardDescription>Manage your account privacy</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 dark:text-gray-300">
                          Privacy settings will allow you to control who can see your information.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button onClick={() => {
                          toast({
                            title: "Feature Coming Soon",
                            description: "Privacy settings will be available in a future update.",
                          });
                        }}>
                          Privacy Settings
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
