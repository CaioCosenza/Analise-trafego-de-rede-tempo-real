/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NetworkPacket {
  id: string;
  timestamp: string;
  source: string;
  destination: string;
  sourcePort: number;
  destinationPort: number;
  protocol: "TCP" | "UDP" | "HTTP" | "HTTPS" | "FTP" | "DNS" | "ICMP";
  size: number; // in bytes
  status: "safe" | "suspicious" | "malicious";
  info: string;
}

export interface TrafficStats {
  timestamp: string;
  upload: number;
  download: number;
  latency: number;
}

export interface SecurityInsight {
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  recommendation: string;
}
