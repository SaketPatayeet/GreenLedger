import React, { useState, useEffect } from 'react';
import { contract, web3 } from "../lib/blockchain";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle, AlertTriangle, TrendingUp, Leaf, Plus, Brain, ShoppingCart, History, Award } from 'lucide-react';

interface ClientPortalProps {
  onBack: () => void;
}

const GEMINI_API_KEY = ""; // Replace with your actual API key

const ClientPortal: React.FC<ClientPortalProps> = ({ onBack }) => {
  const [form, setForm] = useState({
    product: '',
    quantity: '',
    category: '',
    aiRecommendation: '',
    reason: '',
    action: ''
  });
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [contractInstance, setContractInstance] = useState<any>(null);

  useEffect(() => {
    async function initContract() {
      try {
        const c = await contract();
        setContractInstance(c);
      } catch (err) {
        console.error("Contract init error:", err);
      }
    }
    initContract();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const accounts = await web3.eth.getAccounts();
      const logId = `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const timestamp = new Date().toISOString();
      const store = "ST-001";

      await contractInstance.methods.addLog(
        logId,
        form.product,
        form.aiRecommendation,
        form.action + ' | ' + form.reason,
        form.quantity,
        store,
        timestamp
      ).send({ from: accounts[0], gas: 500000 });

      toast({ title: "Waste Event Logged", description: "Log stored on blockchain." });
      setForm({ product: '', quantity: '', category: '', aiRecommendation: '', reason: '', action: '' });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to store log.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAIRequest = async () => {
    const prompt = `Suggest the best action for the following waste event:\nProduct: ${form.product}\nQuantity: ${form.quantity}\nCategory: ${form.category}\nReason: ${form.reason}`;

    setLoading(true);
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ]
        }
      );
      const aiMessage = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
      setForm(prev => ({ ...prev, aiRecommendation: aiMessage }));
      toast({ title: "AI Suggestion Generated", description: "AI recommendation ready to use." });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to generate AI recommendation.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900">
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/10">
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
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
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">Store ID: ST-001</Badge>
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
          <TabsList className="grid w-full grid-cols-5 bg-white/5 backdrop-blur-xl border border-white/10">
            <TabsTrigger value="log-waste" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300">
              Log Waste
            </TabsTrigger>
            <TabsTrigger value="ai-generator" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300">
              AI Generator
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

          <TabsContent value="log-waste">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Log Waste to Blockchain</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input placeholder="Product" value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} />
                  <Input type="number" placeholder="Quantity" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
                  <Input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                  <Input placeholder="AI Recommendation" value={form.aiRecommendation} onChange={e => setForm({ ...form, aiRecommendation: e.target.value })} />
                  <Input placeholder="Reason" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} />
                  <Input placeholder="Action" value={form.action} onChange={e => setForm({ ...form, action: e.target.value })} />
                  <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-500">
                    {loading ? 'Logging...' : 'Log Waste'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-generator">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white">AI Recommendation Generator</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <Input placeholder="Product" value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} />
                  <Input type="number" placeholder="Quantity" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
                  <Input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                  <Input placeholder="Reason" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} />
                  <Button type="button" onClick={handleAIRequest} className="w-full bg-gradient-to-r from-blue-500 to-teal-500">
                    {loading ? 'Generating...' : 'Generate AI Suggestion'}
                  </Button>
                </form>
                {form.aiRecommendation && (
                  <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <h3 className="text-white font-semibold mb-2">AI Recommendation</h3>
                    <p className="text-white whitespace-pre-line">{form.aiRecommendation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
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
