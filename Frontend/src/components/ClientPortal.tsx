
import React, { useState } from 'react';
import { contract, web3 } from "../lib/blockchain";
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
  Plus, 
  Brain, 
  CheckCircle, 
  TrendingUp, 
  Leaf,
  Package,
  Award,
  History,
  ShoppingCart,
  AlertTriangle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';



interface ClientPortalProps {
  onBack: () => void;
}

const ClientPortal: React.FC<ClientPortalProps> = ({ onBack }) => {
 const [wasteForm, setWasteForm] = useState({
    product: '',
    quantity: '',
    category: '',
    reason: ''
  });

  const handleWasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Waste Event Logged",
      description: "AI recommendation generated successfully!",
    });
    setWasteForm({ product: '', quantity: '', category: '', reason: '' });
  };


    const WasteLogger: React.FC = () => {
      const [form, setForm] = useState({
        product: '',
        quantity: '',
        category: '',
        aiRecommendation: '',
        reason: '',
        action: ''
      });
      const [logs, setLogs] = useState<any[]>([]);
      const [contractInstance, setContractInstance] = useState(null);

      React.useEffect(() => {
  async function initContract() {
    try {
      const c = await contract();
      if (!c.methods?.getAllLogIds || !c.methods?.getLog || !c.methods?.addLog) {
        console.error("🚨 Contract methods not found:", Object.keys(c.methods));
        return;
      }
      console.log("✅ Contract methods:", Object.keys(c.methods));
      setContractInstance(c);
    } catch (err) {
      console.error("Contract init error:", err);
    }
  }
  initContract();
}, []);


React.useEffect(() => {
  async function fetchLogs() {
    if (
      !contractInstance ||
      typeof contractInstance.methods?.getAllLogIds !== 'function' ||
      typeof contractInstance.methods?.getLog !== 'function'
    ) {
      console.error('🚨 Contract methods not found in fetchLogs');
      return;
    }

    try {
      const ids = await contractInstance.methods.getAllLogIds().call();
      const fetchedLogs = await Promise.all(ids.map(async (id) => {
        const log = await contractInstance.methods.getLog(id).call();
        const [product, aiRecommendation, action_with_reason, quantity, store, timestamp] = log;
        const [action, reason] = action_with_reason.split(' | ');
        return { product, quantity, category: '', aiRecommendation, reason, action };
      }));
      setLogs(fetchedLogs);
    } catch (err) {
      console.error('Fetch logs error:', err);
    }
  }

  if (contractInstance && contractInstance.methods) {
    fetchLogs();
  }
}, [contractInstance]);






      // Submit log to blockchain
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!contractInstance || !contractInstance.methods || !contractInstance.methods.addLog) {
    toast({ title: "Error", description: "Smart contract not loaded or addLog method missing." });
    return;
  }

  const fields = [form.product, form.quantity, form.category, form.aiRecommendation, form.reason, form.action];
  if (fields.some(f => !f || f === '')) {
    toast({ title: "Error", description: "All fields are required." });
    return;
  }

  try {
    const accounts = await web3.eth.getAccounts();
    const logId = `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const timestamp = new Date().toISOString();
    const store = "ST-001";

    // 🔍 Debug values being sent
    console.log("📦 Sending to contract:", {
      logId,
      product: form.product,
      aiRecommendation: form.aiRecommendation,
      action_with_reason: form.action + ' | ' + form.reason,
      quantity: form.quantity,
      store,
      timestamp
    });

    // 🛠 Smart contract call
    await contractInstance.methods.addLog(
      logId,
      form.product,
      form.aiRecommendation,
      form.action + ' | ' + form.reason,
      form.quantity,
      store,
      timestamp
    ).send({ from: accounts[0], gas: 500000 })
      .on("error", function (error) {
        console.error("🔥 Smart contract error:", error);
      });

    // Optional: fetch added log
    if (contractInstance.methods.getLog) {
      try {
        const log = await contractInstance.methods.getLog(logId).call();
        console.log("✅ Log retrieved:", log);
      } catch (err) {
        console.warn("⚠️ Log fetch failed:", err);
      }
    }

    // Clear form
    setForm({
      product: '',
      quantity: '',
      category: '',
      aiRecommendation: '',
      reason: '',
      action: ''
    });

    toast({ title: "Waste Event Logged", description: "Log added to blockchain!" });
  } catch (err) {
    console.error('Add log error:', err);
    toast({ title: "Error", description: "Failed to add log to blockchain." });
  }
};


      return (
        <div>
          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <div>
              <Label htmlFor="product" className="text-white">Product Name</Label>
              <Input
                id="product"
                name="product"
                value={form.product}
                onChange={e => setForm({ ...form, product: e.target.value })}
                placeholder="e.g., Milk cartons"
                className="bg-white/10 border-white/20 text-white placeholder-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="quantity" className="text-white">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={e => setForm({ ...form, quantity: e.target.value })}
                placeholder="e.g., 5"
                className="bg-white/10 border-white/20 text-white placeholder-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="category" className="text-white">Category</Label>
              <Select value={form.category} onValueChange={value => setForm({ ...form, category: value })}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white" id="category" name="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dairy">Dairy Products</SelectItem>
                  <SelectItem value="produce">Fresh Produce</SelectItem>
                  <SelectItem value="bakery">Bakery Items</SelectItem>
                  <SelectItem value="meat">Meat & Seafood</SelectItem>
                  <SelectItem value="packaged">Packaged Goods</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="aiRecommendation" className="text-white">AI Recommendation</Label>
              <Input
                id="aiRecommendation"
                name="aiRecommendation"
                value={form.aiRecommendation}
                onChange={e => setForm({ ...form, aiRecommendation: e.target.value })}
                placeholder="e.g., Donate to food bank"
                className="bg-white/10 border-white/20 text-white placeholder-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="reason" className="text-white">Reason for Waste</Label>
              <Select value={form.reason} onValueChange={value => setForm({ ...form, reason: value })}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white" id="reason" name="reason">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="damaged">Damaged</SelectItem>
                  <SelectItem value="overstock">Overstock</SelectItem>
                  <SelectItem value="cosmetic">Cosmetic defects</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="action" className="text-white">Action Taken</Label>
              <Select value={form.action} onValueChange={value => setForm({ ...form, action: value })}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white" id="action" name="action">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="donated">Donated to food bank</SelectItem>
                  <SelectItem value="discounted">Applied discount</SelectItem>
                  <SelectItem value="composted">Composted</SelectItem>
                  <SelectItem value="returned">Returned to supplier</SelectItem>
                  <SelectItem value="disposed">Disposed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
              Log Waste
            </Button>
          </form>
          <div>
            <h3 className="text-white font-bold mb-4">Logged Waste Events</h3>
            <ul className="space-y-3">
              {logs.map((log, idx) => (
                <li key={idx} className="p-4 rounded-lg bg-white/10 border border-white/20 text-white">
                  <div><strong>Product:</strong> {log.product}</div>
                  <div><strong>Quantity:</strong> {log.quantity}</div>
                  <div><strong>Category:</strong> {log.category}</div>
                  <div><strong>AI Recommendation:</strong> {log.aiRecommendation}</div>
                  <div><strong>Reason:</strong> {log.reason}</div>
                  <div><strong>Action Taken:</strong> {log.action}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900">
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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">GreenLedger Client</h1>
                  <p className="text-sm text-slate-300">Sustainable Store Management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                Store ID: ST-001
              </Badge>
              <div className="text-right">
                <div className="text-sm text-slate-300">Sustainability Score</div>
                <div className="text-lg font-bold text-emerald-400">87%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="log-waste" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/5 backdrop-blur-xl border border-white/10">
            <TabsTrigger value="waste-logger" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300">
              Waste Logger
            </TabsTrigger>
            <TabsTrigger value="log-waste" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300">
              AI-Recommendations
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300">
              History
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300">
              Sustainable Products
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300">
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="waste-logger">
  <Card className="bg-white/5 backdrop-blur-xl border-white/10">
    <CardHeader>
      <CardTitle className="text-white flex items-center">
        <Plus className="w-5 h-5 mr-2 text-emerald-400" />
        Waste Logger
      </CardTitle>
      <CardDescription className="text-slate-300">
        Log waste events and view all records
      </CardDescription>
    </CardHeader>
    <CardContent>
      <WasteLogger />
    </CardContent>
  </Card>
</TabsContent>

          {/* AI Recommendations Tab */}
          <TabsContent value="AI-Recommendations">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Waste Logging Form */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Plus className="w-5 h-5 mr-2 text-emerald-400" />
                    Log New Waste Event
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Record waste events to receive AI-powered recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleWasteSubmit} className="space-y-4">
                    <div>
                      <Label className="text-white">Product Name</Label>
                      <Input 
                        value={wasteForm.product}
                        onChange={(e) => setWasteForm({...wasteForm, product: e.target.value})}
                        placeholder="e.g., Milk cartons"
                        className="bg-white/10 border-white/20 text-white placeholder-slate-400"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Quantity</Label>
                      <Input 
                        type="number"
                        value={wasteForm.quantity}
                        onChange={(e) => setWasteForm({...wasteForm, quantity: e.target.value})}
                        placeholder="e.g., 5"
                        className="bg-white/10 border-white/20 text-white placeholder-slate-400"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Category</Label>
                      <Select value={wasteForm.category} onValueChange={(value) => setWasteForm({...wasteForm, category: value})}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dairy">Dairy Products</SelectItem>
                          <SelectItem value="produce">Fresh Produce</SelectItem>
                          <SelectItem value="bakery">Bakery Items</SelectItem>
                          <SelectItem value="meat">Meat & Seafood</SelectItem>
                          <SelectItem value="packaged">Packaged Goods</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-white">Reason for Waste</Label>
                      <Select value={wasteForm.reason} onValueChange={(value) => setWasteForm({...wasteForm, reason: value})}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="expired">Expired</SelectItem>
                          <SelectItem value="damaged">Damaged</SelectItem>
                          <SelectItem value="overstock">Overstock</SelectItem>
                          <SelectItem value="cosmetic">Cosmetic defects</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                    >
                      Generate AI Recommendation
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* AI Recommendations */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-blue-400" />
                    AI Recommendations
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Smart suggestions based on your waste data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-emerald-300 font-medium">Recommended Action</span>
                        <Badge className="bg-emerald-500/20 text-emerald-300">AI Suggestion</Badge>
                      </div>
                      <p className="text-white">Donate to local food bank within 24 hours</p>
                      <p className="text-sm text-slate-300 mt-1">Confidence: 92%</p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-300 font-medium">Alternative Option</span>
                        <Badge className="bg-blue-500/20 text-blue-300">Secondary</Badge>
                      </div>
                      <p className="text-white">Apply 50% discount and sell immediately</p>
                      <p className="text-sm text-slate-300 mt-1">Confidence: 78%</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <Label className="text-white">What action did you take?</Label>
                    <Select>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white mt-2">
                        <SelectValue placeholder="Select your action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="donated">Donated to food bank</SelectItem>
                        <SelectItem value="discounted">Applied discount</SelectItem>
                        <SelectItem value="composted">Composted</SelectItem>
                        <SelectItem value="returned">Returned to supplier</SelectItem>
                        <SelectItem value="disposed">Disposed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="w-full mt-3 bg-white/10 hover:bg-white/20 border border-white/20">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Confirm Action
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <History className="w-5 h-5 mr-2 text-emerald-400" />
                  Waste Log History
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Track your sustainability performance over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Sample history entries */}
                  {[
                    { date: "2024-01-08", product: "Milk cartons", quantity: 5, action: "Donated", aiMatch: true },
                    { date: "2024-01-07", product: "Bread loaves", quantity: 8, action: "Discounted", aiMatch: true },
                    { date: "2024-01-06", product: "Apples", quantity: 12, action: "Disposed", aiMatch: false },
                  ].map((entry, index) => (
                    <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">{entry.product}</div>
                          <div className="text-sm text-slate-300">Quantity: {entry.quantity} • {entry.date}</div>
                          <div className="text-sm text-slate-300">Action taken: {entry.action}</div>
                        </div>
                        <div className="text-right">
                          {entry.aiMatch ? (
                            <Badge className="bg-emerald-500/20 text-emerald-300">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              AI Match
                            </Badge>
                          ) : (
                            <Badge className="bg-orange-500/20 text-orange-300">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Deviation
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sustainable Products Tab */}
          <TabsContent value="products">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2 text-emerald-400" />
                  Sustainable Product Catalog
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Discover eco-friendly alternatives and longer-lasting products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: "Organic Milk - Extended Shelf Life", category: "Dairy", sustainability: 95, price: "$4.99" },
                    { name: "Compostable Food Containers", category: "Packaging", sustainability: 98, price: "$12.99" },
                    { name: "Local Farm Fresh Produce", category: "Produce", sustainability: 92, price: "$2.49/lb" },
                  ].map((product, index) => (
                    <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors">
                      <div className="mb-3">
                        <h3 className="text-white font-medium">{product.name}</h3>
                        <p className="text-sm text-slate-300">{product.category}</p>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">Sustainability Score</span>
                          <span className="text-emerald-400">{product.sustainability}%</span>
                        </div>
                        <Progress value={product.sustainability} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-white">{product.price}</span>
                        <Button size="sm" className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Award className="w-5 h-5 mr-2 text-emerald-400" />
                  Sustainability Leaderboard
                </CardTitle>
                <CardDescription className="text-slate-300">
                  See how your store ranks in waste reduction performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { rank: 1, name: "GreenMart Downtown", score: 97, trend: "+5%" },
                    { rank: 2, name: "EcoStore Plaza", score: 94, trend: "+2%" },
                    { rank: 3, name: "Your Store (ST-001)", score: 87, trend: "+8%", isUser: true },
                    { rank: 4, name: "FreshLife Market", score: 83, trend: "-1%" },
                    { rank: 5, name: "NaturalChoice", score: 78, trend: "+3%" },
                  ].map((store, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border transition-colors ${
                        store.isUser 
                          ? 'bg-emerald-500/10 border-emerald-500/30' 
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            store.rank === 1 ? 'bg-yellow-500 text-yellow-900' :
                            store.rank === 2 ? 'bg-gray-400 text-gray-900' :
                            store.rank === 3 ? 'bg-orange-500 text-orange-900' :
                            'bg-white/20 text-white'
                          }`}>
                            #{store.rank}
                          </div>
                          <div>
                            <div className={`font-medium ${store.isUser ? 'text-emerald-300' : 'text-white'}`}>
                              {store.name}
                            </div>
                            <div className="text-sm text-slate-300">Sustainability Score: {store.score}%</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm flex items-center ${
                            store.trend.startsWith('+') ? 'text-emerald-400' : 'text-orange-400'
                          }`}>
                            <TrendingUp className="w-4 h-4 mr-1" />
                            {store.trend}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientPortal;
