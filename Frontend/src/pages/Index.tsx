
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Leaf, 
  TrendingDown, 
  Shield, 
  BarChart3, 
  Users, 
  Settings,
  ChevronRight,
  Sparkles,
  Target,
  Award,
  Database,
  Brain,
  Recycle
} from 'lucide-react';
import ClientPortal from '@/components/ClientPortal';
import AdminPortal from '@/components/AdminPortal';

const Index = () => {
  const [activePortal, setActivePortal] = useState<'landing' | 'client' | 'admin'>('landing');

  if (activePortal === 'client') {
    return <ClientPortal onBack={() => setActivePortal('landing')} />;
  }

  if (activePortal === 'admin') {
    return <AdminPortal onBack={() => setActivePortal('landing')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-teal-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25">
              <Leaf className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
            Green<span className="text-emerald-400">Ledger</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            AI-Powered Sustainability Dashboard • Blockchain-Backed Waste Tracking • Smart Analytics
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
              <Sparkles className="w-4 h-4 mr-1" />
              AI Recommendations
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              <Shield className="w-4 h-4 mr-1" />
              Blockchain Secured
            </Badge>
            <Badge variant="secondary" className="bg-teal-500/20 text-teal-300 border-teal-500/30">
              <BarChart3 className="w-4 h-4 mr-1" />
              Real-time Analytics
            </Badge>
          </div>
        </div>

        {/* Portal Selection */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {/* Client Portal Card */}
          <Card className="group bg-white/5 backdrop-blur-xl border-white/10 hover:border-emerald-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/25 hover:scale-105">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl text-white group-hover:text-emerald-300 transition-colors">
                Client Portal
              </CardTitle>
              <CardDescription className="text-slate-300 text-lg">
                Store waste logging and AI recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center text-slate-300 group-hover:text-white transition-colors">
                  <Target className="w-5 h-5 mr-3 text-emerald-400" />
                  Log waste events with smart categorization
                </div>
                <div className="flex items-center text-slate-300 group-hover:text-white transition-colors">
                  <Brain className="w-5 h-5 mr-3 text-emerald-400" />
                  Get AI-powered sustainability suggestions
                </div>
                <div className="flex items-center text-slate-300 group-hover:text-white transition-colors">
                  <Award className="w-5 h-5 mr-3 text-emerald-400" />
                  Track performance on leaderboards
                </div>
                <div className="flex items-center text-slate-300 group-hover:text-white transition-colors">
                  <Recycle className="w-5 h-5 mr-3 text-emerald-400" />
                  Browse sustainable product alternatives
                </div>
              </div>
              <Button 
                onClick={() => setActivePortal('client')}
                className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-emerald-500/25"
              >
                Access Client Portal
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* Admin Portal Card */}
          <Card className="group bg-white/5 backdrop-blur-xl border-white/10 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/25 hover:scale-105">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Settings className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl text-white group-hover:text-blue-300 transition-colors">
                Admin Portal
              </CardTitle>
              <CardDescription className="text-slate-300 text-lg">
                Advanced analytics and system management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center text-slate-300 group-hover:text-white transition-colors">
                  <BarChart3 className="w-5 h-5 mr-3 text-blue-400" />
                  Comprehensive waste analytics dashboard
                </div>
                <div className="flex items-center text-slate-300 group-hover:text-white transition-colors">
                  <Database className="w-5 h-5 mr-3 text-blue-400" />
                  Product inventory and expiration management
                </div>
                <div className="flex items-center text-slate-300 group-hover:text-white transition-colors">
                  <TrendingDown className="w-5 h-5 mr-3 text-blue-400" />
                  AI vs store decision compliance tracking
                </div>
                <div className="flex items-center text-slate-300 group-hover:text-white transition-colors">
                  <Shield className="w-5 h-5 mr-3 text-blue-400" />
                  Blockchain audit trails and reporting
                </div>
              </div>
              <Button 
                onClick={() => setActivePortal('admin')}
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/25"
              >
                Access Admin Portal
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-center hover:scale-105 transition-transform duration-300">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-emerald-400 mb-2">87%</div>
              <div className="text-sm text-slate-300">Waste Reduction</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-center hover:scale-105 transition-transform duration-300">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-400 mb-2">1.2M</div>
              <div className="text-sm text-slate-300">Items Tracked</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-center hover:scale-105 transition-transform duration-300">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-teal-400 mb-2">450+</div>
              <div className="text-sm text-slate-300">Active Stores</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-center hover:scale-105 transition-transform duration-300">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-400 mb-2">$2.8M</div>
              <div className="text-sm text-slate-300">Cost Savings</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
