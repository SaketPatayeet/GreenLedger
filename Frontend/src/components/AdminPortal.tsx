
import React, { useEffect, useState } from 'react';
import { contract } from "../lib/blockchain";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  BarChart3, 
  Download, 
  Filter,
  Settings,
  Users,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Shield,
  Database,
  FileText,
  Award,
  Search,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';


interface AdminPortalProps {
  onBack: () => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ onBack }) => {
  const [filterDate, setFilterDate] = useState('');
  const [filterStore, setFilterStore] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

useEffect(() => {
  async function fetchLogs() {
    try {
      const c = await contract(); // FIXED: await contract()
      if (!c?.methods?.getAllLogIds || !c?.methods?.getLog) {
        console.error("Contract methods not available:", Object.keys(c?.methods || {}));
        return;
      }

      const ids = await c.methods.getAllLogIds().call();
      const fetchedLogs: string[] = [];

      for (let id of ids) {
  try {
    const log = await c.methods.getLog(id).call();

    console.log("✅ Log retrieved:", log);

    const values = Object.values(log); // Convert to real array
    if (values.length === 0 || values.every(v => !v)) continue;

    fetchedLogs.push(values.join(','));
  } catch (err) {
    console.warn(`Couldn't fetch log for ID ${id}:`, err);
  }
}
      console.log("✅ All logs fetched:", fetchedLogs);

      setLogs(fetchedLogs);
    } catch (err) {
      console.error("Failed to fetch log IDs:", err);
    }
  }

  fetchLogs();
}, []);


  const handleDownloadReport = (type: string) => {
    toast({
      title: "Report Generated",
      description: `${type} report has been generated and downloaded successfully.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">GreenLedger Admin</h1>
                  <p className="text-sm text-slate-300">System Management Dashboard</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                Admin Level: Master
              </Badge>
              <div className="text-right">
                <div className="text-sm text-slate-300">Active Stores</div>
                <div className="text-lg font-bold text-blue-400">450</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300 mb-1">Total Waste Reduction</p>
                  <p className="text-2xl font-bold text-emerald-400">87.3%</p>
                  <p className="text-xs text-emerald-300 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" /> +5.2% from last month
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300 mb-1">Active Stores</p>
                  <p className="text-2xl font-bold text-blue-400">450</p>
                  <p className="text-xs text-blue-300 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" /> +12 new this week
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300 mb-1">Cost Savings</p>
                  <p className="text-2xl font-bold text-green-400">$2.8M</p>
                  <p className="text-xs text-green-300 flex items-center mt-1">
                    <DollarSign className="w-3 h-3 mr-1" /> +$340K this quarter
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300 mb-1">AI Compliance</p>
                  <p className="text-2xl font-bold text-purple-400">94.2%</p>
                  <p className="text-xs text-purple-300 flex items-center mt-1">
                    <Shield className="w-3 h-3 mr-1" /> +2.1% accuracy
                  </p>
                </div>
                <Database className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="analytics" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-white/5 backdrop-blur-xl border border-white/10">
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">
              Products
            </TabsTrigger>
            <TabsTrigger value="stores" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">
              Stores
            </TabsTrigger>
            <TabsTrigger value="blockchain" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">
              Blockchain
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Waste Trends Chart */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                    Waste Reduction Trends
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Monthly waste reduction performance across all stores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-b from-blue-500/10 to-transparent rounded-lg flex items-end justify-center">
                    <div className="text-slate-400 text-center">
                      <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Interactive Chart Placeholder</p>
                      <p className="text-sm">Real charts will be integrated with Recharts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Compliance Overview */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-purple-400" />
                    AI vs Store Decisions
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Compliance tracking and decision analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Followed AI Recommendations</span>
                      <span className="text-emerald-400 font-bold">94.2%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Store-Initiated Actions</span>
                      <span className="text-blue-400 font-bold">5.8%</span>
                    </div>
                    <Progress value={6} className="h-2" />
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <h4 className="text-white font-medium mb-3">Top Deviation Reasons</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Supplier requirements</span>
                        <span className="text-orange-400">45%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Local regulations</span>
                        <span className="text-orange-400">28%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Customer demand</span>
                        <span className="text-orange-400">27%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Store Performance Table */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 mt-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-400" />
                  Store Performance Overview
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Real-time performance metrics for all connected stores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: "ST-001", name: "GreenMart Downtown", score: 97, waste: "↓ 23%", compliance: 98, status: "excellent" },
                    { id: "ST-002", name: "EcoStore Plaza", score: 94, waste: "↓ 19%", compliance: 95, status: "excellent" },
                    { id: "ST-003", name: "FreshLife Market", score: 83, waste: "↓ 15%", compliance: 87, status: "good" },
                    { id: "ST-004", name: "NaturalChoice", score: 78, waste: "↓ 12%", compliance: 82, status: "average" },
                    { id: "ST-005", name: "QuickMart Express", score: 65, waste: "↓ 8%", compliance: 71, status: "needs-improvement" },
                  ].map((store, index) => (
                    <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-slate-400 font-mono text-sm">{store.id}</div>
                          <div>
                            <div className="text-white font-medium">{store.name}</div>
                            <div className="text-sm text-slate-300">Waste Reduction: {store.waste}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <div className="text-sm text-slate-300">Sustainability</div>
                            <div className="text-lg font-bold text-white">{store.score}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-slate-300">AI Compliance</div>
                            <div className="text-lg font-bold text-white">{store.compliance}%</div>
                          </div>
                          <Badge className={
                            store.status === 'excellent' ? 'bg-emerald-500/20 text-emerald-300' :
                            store.status === 'good' ? 'bg-blue-500/20 text-blue-300' :
                            store.status === 'average' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-red-500/20 text-red-300'
                          }>
                            {store.status.replace('-', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="space-y-6">
              {/* Product Management Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">Product Management</h2>
                  <p className="text-slate-300">Manage inventory and expiration tracking</p>
                </div>
                <div className="flex space-x-3">
                  <Button className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                  <Button className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30">
                    <Download className="w-4 h-4 mr-2" />
                    Import CSV
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardContent className="p-4">
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <Input 
                        placeholder="Search products..."
                        className="bg-white/10 border-white/20 text-white placeholder-slate-400"
                      />
                    </div>
                    <Select>
                      <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="dairy">Dairy</SelectItem>
                        <SelectItem value="produce">Produce</SelectItem>
                        <SelectItem value="bakery">Bakery</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Expiry Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Products</SelectItem>
                        <SelectItem value="expiring">Expiring Soon</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Expiring Products */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-orange-400" />
                    Products Expiring Soon
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Products requiring immediate attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Organic Milk 2L", store: "GreenMart Downtown", expires: "2 days", quantity: 24, category: "Dairy" },
                      { name: "Fresh Salmon Fillets", store: "EcoStore Plaza", expires: "1 day", quantity: 8, category: "Seafood" },
                      { name: "Artisan Bread Loaves", store: "FreshLife Market", expires: "3 days", quantity: 15, category: "Bakery" },
                      { name: "Baby Spinach 200g", store: "NaturalChoice", expires: "2 days", quantity: 32, category: "Produce" },
                    ].map((product, index) => (
                      <div key={index} className="p-4 rounded-lg bg-white/5 border border-orange-500/20 hover:border-orange-500/40 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                              <Package className="w-6 h-6 text-orange-400" />
                            </div>
                            <div>
                              <div className="text-white font-medium">{product.name}</div>
                              <div className="text-sm text-slate-300">{product.store} • {product.category}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <div className="text-sm text-slate-300">Quantity</div>
                              <div className="text-white font-bold">{product.quantity}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-slate-300">Expires In</div>
                              <div className="text-orange-400 font-bold">{product.expires}</div>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300">
                                Apply Discount
                              </Button>
                              <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Stores Tab */}
          <TabsContent value="stores">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-400" />
                  Store Management
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Manage connected stores and user access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16">
                  <Users className="w-16 h-16 mx-auto text-slate-600 mb-4" />
                  <p className="text-slate-400">Store management interface will be implemented here</p>
                  <p className="text-sm text-slate-500">User roles, permissions, and store onboarding</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blockchain Tab */}
                    <TabsContent value="blockchain">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-purple-400" />
                  Blockchain Audit Trail
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Immutable transaction logs and verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <h2 className="text-lg font-bold text-white mb-4">Blockchain Logs</h2>
                  <ul className="space-y-2">
                    {logs.length === 0 ? (
                      <li className="text-slate-400">No logs found.</li>
                    ) : (
                      logs.map((log, idx) => {
                        const [product, quantity, category, aiRecommendation, reason, action] = log.split(',');
                        return (
                          <li key={idx} className="p-4 rounded-lg bg-white/10 border border-white/20 text-white">
                            <div><strong>Product:</strong> {product}</div>
                            <div><strong>Quantity:</strong> {quantity}</div>
                            <div><strong>Category:</strong> {category}</div>
                            <div><strong>AI Recommendation:</strong> {aiRecommendation}</div>
                            <div><strong>Reason:</strong> {reason}</div>
                            <div><strong>Action Taken:</strong> {action}</div>
                          </li>
                        );
                      })
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Analytics & Reports</h2>
                <p className="text-slate-300">Generate comprehensive reports and export data</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { 
                    title: "Waste Reduction Summary", 
                    description: "Comprehensive waste reduction metrics across all stores",
                    icon: TrendingDown,
                    color: "emerald"
                  },
                  { 
                    title: "Store Performance Report", 
                    description: "Individual store performance and compliance tracking",
                    icon: Users,
                    color: "blue"
                  },
                  { 
                    title: "AI Compliance Analysis", 
                    description: "AI recommendation follow-through and deviation analysis",
                    icon: Shield,
                    color: "purple"
                  },
                  { 
                    title: "Financial Impact Report", 
                    description: "Cost savings and ROI from waste reduction initiatives",
                    icon: DollarSign,
                    color: "green"
                  },
                  { 
                    title: "Product Lifecycle Report", 
                    description: "Product expiration patterns and inventory optimization",
                    icon: Package,
                    color: "orange"
                  },
                  { 
                    title: "Sustainability Metrics", 
                    description: "Environmental impact and sustainability scores",
                    icon: Award,
                    color: "teal"
                  },
                ].map((report, index) => (
                  <Card key={index} className="bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/20 transition-colors group">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`w-12 h-12 rounded-lg bg-${report.color}-500/20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <report.icon className={`w-6 h-6 text-${report.color}-400`} />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{report.title}</h3>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300 mb-4">{report.description}</p>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleDownloadReport(report.title)}
                          className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          PDF
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleDownloadReport(report.title)}
                          className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          CSV
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPortal;
