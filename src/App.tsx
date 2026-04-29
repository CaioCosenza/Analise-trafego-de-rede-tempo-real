/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  ShieldCheck, 
  ShieldQuestion, 
  Network, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Cpu, 
  Lock,
  Search,
  RefreshCcw,
  Zap
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { NetworkPacket, TrafficStats, SecurityInsight } from './types';
import { analyzeTraffic } from './services/geminiService';

/** Utility for tailwind classes */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Mock Data Generators ---
const generatePacket = (): NetworkPacket => {
  const protocols: ("TCP" | "UDP" | "HTTP" | "HTTPS" | "FTP" | "DNS" | "ICMP")[] = ["TCP", "UDP", "HTTP", "HTTPS", "DNS", "ICMP"];
  const statuses: ("safe" | "suspicious" | "malicious")[] = ["safe", "safe", "safe", "safe", "suspicious", "safe"];
  const protocol = protocols[Math.floor(Math.random() * protocols.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toLocaleTimeString(),
    source: `192.168.1.${Math.floor(Math.random() * 255)}`,
    destination: `10.0.0.${Math.floor(Math.random() * 255)}`,
    sourcePort: Math.floor(Math.random() * 65535),
    destinationPort: protocol === "HTTP" ? 80 : protocol === "HTTPS" ? 443 : Math.floor(Math.random() * 65535),
    protocol,
    size: Math.floor(Math.random() * 1500) + 64,
    status,
    info: status === "safe" ? "Tráfego normal detectado" : "Padrão de conexão incomum para este host"
  };
};

export default function App() {
  const [packets, setPackets] = useState<NetworkPacket[]>([]);
  const [stats, setStats] = useState<TrafficStats[]>([]);
  const [insights, setInsights] = useState<SecurityInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(true);

  // Filter States
  const [filterIp, setFilterIp] = useState('');
  const [filterPort, setFilterPort] = useState('');
  const [filterProtocol, setFilterProtocol] = useState('ALL');

  const filteredPackets = useMemo(() => {
    return packets.filter(p => {
      const matchIp = !filterIp || p.source.includes(filterIp) || p.destination.includes(filterIp);
      const matchPort = !filterPort || p.sourcePort.toString() === filterPort || p.destinationPort.toString() === filterPort;
      const matchProto = filterProtocol === 'ALL' || p.protocol === filterProtocol;
      return matchIp && matchPort && matchProto;
    });
  }, [packets, filterIp, filterPort, filterProtocol]);

  // Initialize stats history
  useEffect(() => {
    const initialStats = Array.from({ length: 20 }).map((_, i) => ({
      timestamp: new Date(Date.now() - (20 - i) * 2000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      upload: Math.random() * 50 + 10,
      download: Math.random() * 150 + 20,
      latency: Math.random() * 40 + 10
    }));
    setStats(initialStats);
    
    // Initial packets
    setPackets(Array.from({ length: 15 }).map(generatePacket));
  }, []);

  // Simulation Loop
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      // Update stats
      setStats(prev => {
        const newStat = {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          upload: Math.random() * 50 + 10 + (Math.random() > 0.9 ? 50 : 0),
          download: Math.random() * 150 + 20 + (Math.random() > 0.9 ? 100 : 0),
          latency: Math.random() * 40 + 10
        };
        const next = [...prev.slice(1), newStat];
        return next;
      });

      // Add new packets
      if (Math.random() > 0.3) {
        setPackets(prev => [generatePacket(), ...prev.slice(0, 49)]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const handleAnalyzeWithAI = async () => {
    setIsAnalyzing(true);
    const newInsights = await analyzeTraffic(packets);
    setInsights(newInsights);
    setIsAnalyzing(false);
  };

  const currentDownload = stats[stats.length - 1]?.download.toFixed(1) || "0.0";
  const currentUpload = stats[stats.length - 1]?.upload.toFixed(1) || "0.0";
  const currentLatency = stats[stats.length - 1]?.latency.toFixed(0) || "0";

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#D1D1D1] font-sans selection:bg-white/20 overflow-x-hidden relative">
      {/* Background Graphic Accent */}
      <div className="fixed top-0 right-0 w-1/3 h-full border-l border-white/5 pointer-events-none z-0" />

      {/* Header */}
      <header className="border-b border-white/10 sticky top-0 z-50 bg-[#0A0A0B]/80 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-10 h-24 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#888] mb-1">
              SURVEILLANCE PHASE: ACTIVE
            </span>
            <h1 className="text-2xl font-light tracking-tighter text-white">
              NETWATCH.<span className="italic font-serif">SURVEILLANCE</span>
            </h1>
          </div>

          <div className="flex items-center gap-12">
            <div className="hidden md:block text-right">
              <span className="block text-[10px] uppercase tracking-widest text-[#555] mb-1">System Epoch</span>
              <span className="font-mono text-xs opacity-70">1715942400.024</span>
            </div>
            
            <button 
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={cn(
                "group flex items-center gap-3 px-6 py-2 border rounded-full transition-all text-[10px] font-bold uppercase tracking-[0.2em]",
                isMonitoring 
                  ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10" 
                  : "border-white/10 text-white bg-white/5 hover:bg-white/10"
              )}
            >
              <div className={cn("w-1.5 h-1.5 rounded-full", isMonitoring ? "bg-emerald-500 animate-pulse" : "bg-slate-500")} />
              {isMonitoring ? "Monitoring Live" : "System Suspended"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-10 relative z-10">
        {/* Hero Section: Editorial Impact */}
        <div className="grid grid-cols-12 gap-12 mb-16">
          <section className="col-span-12 lg:col-span-7">
            <div className="mb-12">
              <label className="text-[10px] uppercase tracking-[0.4em] text-[#666] mb-6 block">Aggregate Throughput</label>
              <div className="flex items-baseline gap-6">
                <motion.h2 
                  key={currentDownload}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[120px] leading-[0.8] font-serif italic text-white tracking-tighter"
                >
                  {(parseFloat(currentDownload) / 10).toFixed(2)}
                </motion.h2>
                <span className="text-3xl font-light tracking-widest opacity-30">GB/S</span>
              </div>
              <p className="mt-10 text-sm max-w-lg leading-relaxed opacity-60">
                Current network ingress is operating at <span className="text-white underline underline-offset-8 decoration-white/20 decoration-1">82% of baseline throughput</span>. 
                Last packet fragment analysis suggests stable transit in the primary backbone segments.
              </p>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-white/5">
              <StatCard 
                label="Downlink" 
                value={`${currentDownload} Mbps`} 
                trend="+5.2%"
              />
              <StatCard 
                label="Uplink" 
                value={`${currentUpload} Mbps`} 
                trend="-2.1%"
              />
              <StatCard 
                label="Latency" 
                value={`${currentLatency} MS`} 
                trend="Stable"
              />
            </div>
          </section>

          {/* AI Security Sidebar */}
          <section className="col-span-12 lg:col-span-5 bg-white/[0.02] border border-white/5 p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 -mr-8 -mt-8 grayscale group-hover:grayscale-0 transition-all duration-700">
              <ShieldQuestion className="w-48 h-48 text-white" />
            </div>

            <div className="relative z-10 mb-10">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#888] border-b border-white/10 pb-4 mb-6">Security Intelligence</h3>
              <p className="text-xs leading-relaxed opacity-50 mb-8 italic font-serif">
                Advanced node surveillance utilizing the Gemini logic core to intercept and decrypt anomalous patterns.
              </p>
              
              <button 
                onClick={handleAnalyzeWithAI}
                disabled={isAnalyzing}
                className="w-full py-4 border border-white/10 hover:border-white/30 text-white bg-transparent disabled:opacity-30 rounded-none font-bold text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all"
              >
                {isAnalyzing ? <RefreshCcw className="w-3 h-3 animate-spin" /> : <Activity className="w-3 h-3" />}
                {isAnalyzing ? "Decrypting..." : "Analyze Stream"}
              </button>
            </div>

            <div className="space-y-6 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar relative z-10">
              {insights.length === 0 && !isAnalyzing && (
                <div className="py-12 border-y border-white/5 text-center">
                  <span className="text-[10px] uppercase tracking-widest text-[#444] font-mono italic">
                    Waiting for log analysis signal...
                  </span>
                </div>
              )}

              {insights.map((insight, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={idx}
                  className="pb-6 border-b border-white/5"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className={cn(
                      "w-1 h-1 rounded-full",
                      insight.severity === 'high' ? 'bg-red-500' : 
                      insight.severity === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                    )} />
                    <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">{insight.title}</h4>
                  </div>
                  <p className="text-[11px] opacity-50 leading-relaxed mb-3">{insight.description}</p>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-white/30">
                    <Zap className="w-3 h-3" />
                    <span>REC: {insight.recommendation}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Throughput Chart Section */}
        <section className="mb-16">
          <div className="flex items-baseline justify-between border-b border-white/10 pb-4 mb-8">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#888]">Visual Flow Matrix</h3>
            <div className="flex gap-8">
              <span className="text-[9px] uppercase tracking-widest text-emerald-500 font-bold">Ingress</span>
              <span className="text-[9px] uppercase tracking-widest text-[#444]">Egress</span>
            </div>
          </div>
          
          <div className="h-[300px] w-full grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats}>
                <defs>
                  <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fff" stopOpacity={0.1}/>
                    <stop offset="100%" stopColor="#fff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0 0" vertical={false} stroke="#1A1A1B" />
                <XAxis 
                  dataKey="timestamp" 
                  hide={true}
                />
                <YAxis 
                  stroke="#333" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#444' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0' }}
                  itemStyle={{ fontSize: '10px', textTransform: 'uppercase', fontStyle: 'italic', fontFamily: 'serif' }}
                />
                <Area 
                  type="stepAfter" 
                  dataKey="download" 
                  stroke="#fff" 
                  strokeWidth={1}
                  fill="url(#colorFlow)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Live Packet Logs Section */}
        <section className="grid grid-cols-12 gap-12">
          <div className="col-span-12 lg:col-span-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-white/10 pb-6 gap-4">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#888]">Real-Time Surveillance Logs</h3>
              
              {/* Filter Controls */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative">
                  <Search className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                  <input 
                    type="text" 
                    placeholder="IP ADDR..."
                    value={filterIp}
                    onChange={(e) => setFilterIp(e.target.value)}
                    className="bg-white/5 border border-white/10 px-9 py-2 text-[9px] font-mono focus:border-white/30 outline-none w-32 uppercase tracking-widest"
                  />
                </div>
                <input 
                  type="text" 
                  placeholder="PORT..."
                  value={filterPort}
                  onChange={(e) => setFilterPort(e.target.value)}
                  className="bg-white/5 border border-white/10 px-3 py-2 text-[9px] font-mono focus:border-white/30 outline-none w-20 uppercase tracking-widest"
                />
                <select 
                  value={filterProtocol}
                  onChange={(e) => setFilterProtocol(e.target.value)}
                  className="bg-white/5 border border-white/10 px-3 py-2 text-[9px] font-mono focus:border-white/30 outline-none uppercase tracking-widest"
                >
                  <option value="ALL">ALL PROTO</option>
                  <option value="TCP">TCP</option>
                  <option value="UDP">UDP</option>
                  <option value="ICMP">ICMP</option>
                  <option value="HTTP">HTTP</option>
                  <option value="HTTPS">HTTPS</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[9px] uppercase tracking-widest text-[#555] border-b border-white/5 italic">
                    <th className="pb-4 font-normal">EPOCH</th>
                    <th className="pb-4 font-normal">SRC_ADDR:PORT</th>
                    <th className="pb-4 font-normal">DST_ADDR:PORT</th>
                    <th className="pb-4 font-normal">PROTO</th>
                    <th className="pb-4 font-normal">SIZE</th>
                    <th className="pb-4 font-normal">VETTING</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence mode="popLayout">
                    {filteredPackets.map((packet) => (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="group hover:bg-white/[0.02] transition-colors"
                        key={packet.id}
                      >
                        <td className="py-4 text-[10px] font-mono text-[#555] group-hover:text-white transition-colors">{packet.timestamp}</td>
                        <td className="py-4 text-[11px] font-mono text-[#AAA]">
                          {packet.source}<span className="text-white/20 select-none mx-1">:</span><span className="text-white/40">{packet.sourcePort}</span>
                        </td>
                        <td className="py-4 text-[11px] font-mono text-[#AAA]">
                          {packet.destination}<span className="text-white/20 select-none mx-1">:</span><span className="text-white/40">{packet.destinationPort}</span>
                        </td>
                        <td className="py-4 text-[10px] font-mono font-bold text-white/40">{packet.protocol}</td>
                        <td className="py-4 text-[10px] font-mono text-[#555] italic">{packet.size}b</td>
                        <td className="py-4">
                          <span className={cn(
                            "text-[9px] uppercase tracking-widest font-bold",
                            packet.status === 'safe' ? 'text-white/10' :
                            packet.status === 'suspicious' ? 'text-amber-500' : 'text-red-500'
                          )}>
                            {packet.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
              {filteredPackets.length === 0 && (
                <div className="py-20 text-center border-b border-white/5 bg-white/[0.01]">
                   <span className="text-[10px] uppercase tracking-widest text-[#444] font-mono italic">
                    No packets matched current filter criteria
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Secondary Info Column */}
          <section className="col-span-12 lg:col-span-4 flex flex-col gap-12 pt-14">
            <div className="relative">
              <div className="absolute -left-8 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
              <label className="text-[10px] uppercase tracking-[0.2em] text-[#555] mb-6 block italic font-serif">Node Distribution</label>
              <div className="flex h-1 w-full bg-white/5 overflow-hidden">
                <div className="bg-white w-[60%]" />
                <div className="bg-white/40 w-[25%]" />
                <div className="bg-white/10 w-[15%]" />
              </div>
              <div className="flex justify-between mt-4">
                <div className="space-y-1">
                  <span className="block text-[10px] text-white">HTTPS</span>
                  <span className="block text-[8px] uppercase tracking-widest text-[#555]">60.2% Total</span>
                </div>
                <div className="space-y-1 text-right">
                  <span className="block text-[10px] text-white">UDP</span>
                  <span className="block text-[8px] uppercase tracking-widest text-[#555]">24.8% Total</span>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5">
              <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#555] mb-6">Regional Backbone Tags</h4>
              <div className="flex flex-wrap gap-4 text-[9px] font-mono text-[#AAA]">
                <span className="px-2 py-1 border border-white/10 italic">NA-NORTH-1</span>
                <span className="px-2 py-1 border border-white/10">EU-WEST-4</span>
                <span className="px-2 py-1 border border-white/10">ASIA-S-2</span>
                <span className="px-2 py-1 border border-white/10 italic">BR-EAST-1</span>
              </div>
            </div>
          </section>
        </section>
      </main>

      {/* Vertical Decorative Accent */}
      <aside className="fixed right-10 bottom-24 flex items-center gap-6 rotate-90 origin-right pointer-events-none opacity-20">
        <span className="text-[10px] uppercase tracking-[0.8em] text-white whitespace-nowrap">SURVEILLANCE PROTOCOL 2.0.4</span>
        <div className="w-16 h-[1px] bg-white" />
      </aside>

      <footer className="border-t border-white/5 py-12 mt-12 bg-white/[0.01]">
        <div className="max-w-[1600px] mx-auto px-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#444]">Terminal Localhost</span>
            <p className="text-[10px] font-mono text-[#333] italic">Monitoring Active: 24h 04m 11s</p>
          </div>
          <div className="flex gap-12 opacity-30">
            <a href="#" className="text-[10px] uppercase tracking-[0.2em] hover:text-white transition-colors">Documentation</a>
            <a href="#" className="text-[10px] uppercase tracking-[0.2em] hover:text-white transition-colors">Surveillance Ops</a>
          </div>
        </div>
      </footer>

      {/* Global CSS for custom scrollbar */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </div>
  );
}

// --- Sub-components ---

function StatCard({ label, value, trend }: { label: string, value: string, trend: string }) {
  return (
    <div className="relative group">
      <div className="absolute -left-4 top-0 h-full w-[1px] bg-white/5 group-hover:bg-white/20 transition-colors" />
      <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4 italic">{label}</h3>
      <div className="flex items-baseline gap-3">
        <p className="text-2xl font-light tracking-tighter text-white">{value}</p>
        <span className={cn(
          "text-[9px] font-mono uppercase",
          trend.startsWith('+') ? 'text-emerald-500' : 
          trend.startsWith('-') ? 'text-red-500' : 'text-slate-500'
        )}>
          {trend}
        </span>
      </div>
    </div>
  );
}
