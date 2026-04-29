/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { NetworkPacket } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeTraffic(packets: NetworkPacket[]) {
  const prompt = `Analise os seguintes logs de tráfego de rede e identifique potenciais riscos de segurança ou anomalias. 
  Retorne um resumo estruturado em JSON com insights acionáveis.
  
  Logs:
  ${JSON.stringify(packets.slice(0, 20), null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  severity: { type: Type.STRING, enum: ["low", "medium", "high"] },
                  recommendation: { type: Type.STRING }
                },
                required: ["title", "description", "severity", "recommendation"]
              }
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result.insights || [];
  } catch (error) {
    console.error("Erro na análise Gemini:", error);
    return [];
  }
}
