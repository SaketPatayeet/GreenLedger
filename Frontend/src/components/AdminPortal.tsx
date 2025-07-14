// Integrated AdminPortal.tsx combining original dashboard features and AI-enhanced inventory prediction

import React, { useEffect, useState } from 'react';
import { contract } from "../lib/blockchain";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft, BarChart3, Download, DollarSign, Shield, Database,
  Users, TrendingUp, TrendingDown, Settings, Award, Package, AlertTriangle
} from 'lucide-react';

interface AdminPortalProps {
  onBack: () => void;
}

const GEMINI_API_KEY = "";

const AdminPortal: React.FC<AdminPortalProps> = ({ onBack }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const c = await contract();
        const ids = await c.methods.getAllLogIds().call();
        const fetchedLogs: string[] = [];
        for (let id of ids) {
          const log = await c.methods.getLog(id).call();
          const values = Object.values(log);
          if (values.length === 0 || values.every(v => !v)) continue;
          fetchedLogs.push(values.join(','));
        }
        setLogs(fetchedLogs);
      } catch (err) {
        console.error("Error fetching logs:", err);
      }
    }
    fetchLogs();
  }, []);

  const fetchInventoryPrediction = async () => {
    setPredicting(true);
    setPrediction(null);
    setInventoryData([]);
    try {
      const response = await fetch("http://localhost:4000/api/predict-inventory");
      const data = await response.json();
      if (data.prediction?.length > 0) {
        setInventoryData(data.prediction);
        const inventoryList = data.prediction.map((item, idx) => `${idx + 1}. ${item.category}: ${item.units} units`).join("\n");
        const prompt = `You are an inventory forecasting AI.\nHere is the current inventory:\n${inventoryList}\n\nPredict inventory needs for next month by category.`;
        const geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: prompt }] }]
            })
          }
        );
        const geminiData = await geminiResponse.json();
        const aiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "No prediction from AI.";
        setPrediction(aiText);
      } else {
        setPrediction("No inventory data available.");
      }
    } catch (error) {
      console.error(error);
      setPrediction("Error fetching prediction.");
    }
    setPredicting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/10">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex justify-center items-center">
              <Settings className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">GreenLedger Admin</h1>
              <p className="text-sm text-slate-300">System Management Dashboard</p>
            </div>
          </div>
          <Badge className="bg-blue-500/20 text-blue-300">Admin Level: Master</Badge>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="analytics" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/5 border border-white/10">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="prediction">AI Prediction</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <Card className="bg-white/5 border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="text-blue-400 w-5 h-5 mr-2" /> Waste Reduction Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-slate-400">
                  <BarChart3 className="w-16 h-16 opacity-30" />
                  <span className="ml-4">Interactive chart placeholder</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prediction">
            <Card className="bg-white/5 border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">AI Inventory Forecast</CardTitle>
                <CardDescription className="text-slate-300">Forecast next month's inventory</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={fetchInventoryPrediction} disabled={predicting} className="bg-green-500/20 text-green-300">
                  {predicting ? 'Predicting...' : 'Get Inventory Prediction'}
                </Button>
                {inventoryData.length > 0 && (
                  <div className="text-white space-y-1">
                    <h4 className="font-bold">Current Inventory:</h4>
                    <ul className="list-disc list-inside">
                      {inventoryData.map((item, idx) => (
                        <li key={idx}>{item.category}: {item.units} units</li>
                      ))}
                    </ul>
                  </div>
                )}
                {prediction && (
                  <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20 text-white whitespace-pre-wrap">
                    {prediction}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blockchain">
            <Card className="bg-white/5 border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Blockchain Logs</CardTitle>
                <CardDescription className="text-slate-300">Immutable audit trail</CardDescription>
              </CardHeader>
              <CardContent>
                {logs.length === 0 ? (
                  <p className="text-slate-400">No logs available.</p>
                ) : (
                  <ul className="space-y-3 text-white">
                    {logs.map((log, idx) => {
                      const [product, quantity, category, aiRecommendation, reason, action] = log.split(',');
                      return (
                        <li key={idx} className="p-3 bg-white/10 border border-white/20 rounded-lg">
                          <div><strong>Product:</strong> {product}</div>
                          <div><strong>Quantity:</strong> {quantity}</div>
                          <div><strong>Category:</strong> {category}</div>
                          <div><strong>AI Recommendation:</strong> {aiRecommendation}</div>
                          <div><strong>Reason:</strong> {reason}</div>
                          <div><strong>Action Taken:</strong> {action}</div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card className="bg-white/5 border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Report Center</CardTitle>
                <CardDescription className="text-slate-300">Export analytics and inventory data</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Button className="bg-white/10 text-white border border-white/20 flex-1">
                  <Download className="w-4 h-4 mr-2" /> PDF
                </Button>
                <Button className="bg-white/10 text-white border border-white/20 flex-1">
                  <Download className="w-4 h-4 mr-2" /> CSV
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPortal;
