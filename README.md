# Netwatch Surveillance Protocol v2.0.4

![Netwatch surveillance Dashboard Mockup](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop)

> **Painel avançado para monitoramento de tráfego de rede e análise de segurança preditiva com Inteligência Artificial.**

Este projeto foi desenvolvido para profissionais de TI, administradores de rede e especialistas em cibersegurança que buscam uma visualização clara, em tempo real e analítica do fluxo de dados em sua infraestrutura.

---

## 🚀 Funcionalidades Principais

*   **Surveillance Live Stream:** Monitoramento em tempo real de pacotes de rede (TCP, UDP, HTTP, HTTPS, ICMP, DNS).
*   **Security Intelligence (Gemini AI):** Integração com o modelo **Gemini 3 Flash** para análise profunda de anomalias e sugestões imediatas de remediação.
*   **Visual Flow Matrix:** Gráficos dinâmicos de Ingress (Download), Egress (Upload) e Latência para análise de gargalos.
*   **Advanced Filtering:** Filtragem granular por IP de origem/destino, porta e protocolo.
*   **Vetting System:** Classificação automática de pacotes (Safe, Suspicious, Malicious) baseada em padrões de comportamento.
*   **Regional Backbone Tracking:** Identificação de nós regionais e distribuição de carga.

---

## 🛠️ Stack Tecnológica

*   **Frontend:** React 19 + TypeScript (Tipagem forte para segurança de dados).
*   **Estilização:** Tailwind CSS 4.0 (Design editorial, minimalista e futurista).
*   **Animações:** Motion (Framer Motion) para transições fluidas e estados de alerta.
*   **Visualização:** Recharts para telemetria de tráfego em tempo real.
*   **AI Core:** Google Gemini AI Pro para análise de logs e insights de segurança.
*   **Ícones:** Lucide React.

---

## 🛡️ IT & Cybersecurity Profile

Este projeto reflete meu conhecimento técnico e prático nas seguintes áreas:

### 🌐 Redes & Infraestrutura
- Compreensão profunda do modelo OSI e protocolos de rede.
- Análise de tráfego e identificação de padrões de carga (Backbone segments).
- Monitoramento de throughput e latência.

### 🔒 Cibersegurança
- Detecção de anomalias e análise de logs para prevenção de intrusões.
- Implementação de lógica de "Vetting" para filtragem de tráfego malicioso.
- Uso de IA para automação de respostas a incidentes de segurança.

### ⚙️ Suporte de TI & Admin
- Dashboard focado em operacionalidade (System Epoch tracking, Live uptime).
- Documentação técnica e processos de vigilância ativa (Surveillance Protocols).

---

## 🔧 Instalação e Execução

### Pré-requisitos
- Node.js v18+
- Uma chave de API do Gemini (Google AI Studio)

### Passos
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/netwatch-surveillance.git
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz e adicione:
   ```env
   VITE_GEMINI_API_KEY=sua_chave_aqui
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

---

## 🧠 Análise de IA em Ação

O sistema utiliza análise heurística combinada com o **Gemini AI** para interpretar fragmentos de logs que humanos poderiam ignorar. Ao clicar em **"Analyze Stream"**, o sistema envia os últimos pacotes para o núcleo de processamento, que retorna:
- **Título do Insight**
- **Nível de Severidade** (Low, Medium, High)
- **Recomendação Acionável** (REC)

---

## 📄 Licença

Este projeto está sob a licença Apache-2.0.

---

**Desenvolvido como parte do meu portfólio técnico em Suporte de TI e Cibersegurança.**
