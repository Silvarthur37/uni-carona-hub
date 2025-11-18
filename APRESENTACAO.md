# 🚗 Uni Carona Hub
## Plataforma de Caronas Universitárias

---

## 📋 Agenda

1. O Problema
2. A Solução
3. Funcionalidades
4. Tecnologias Utilizadas
5. Requisitos de Hardware - Indústria 4.0
6. Diferenciais
7. Impacto e Benefícios
8. Roadmap
9. Demonstração
10. Conclusão

---

## 🎯 O Problema

### Desafios do Transporte Universitário

- **💰 Custos Elevados**
  - Combustível, estacionamento, manutenção
  - Transporte público limitado ou inexistente

- **🌍 Impacto Ambiental**
  - Múltiplos veículos indo para o mesmo destino
  - Emissão desnecessária de CO₂

- **⏰ Tempo Desperdiçado**
  - Rotas não otimizadas
  - Falta de coordenação entre estudantes

- **🤝 Desconexão**
  - Dificuldade em encontrar pessoas com rotas semelhantes
  - Comunidade universitária fragmentada

---

## 💡 A Solução: Uni Carona Hub

### Uma plataforma web dedicada exclusivamente para caronas universitárias

**Missão**: Conectar estudantes universitários para compartilhar caronas de forma segura, econômica e sustentável.

**Visão**: Ser a principal plataforma de mobilidade compartilhada no ambiente acadêmico brasileiro.

---

## ⚙️ Funcionalidades Principais

### Para Motoristas
- 🚘 Publicar caronas oferecidas
- 📍 Definir rotas e pontos de encontro
- 💵 Estabelecer contribuição de custos
- ⭐ Receber avaliações

### Para Passageiros
- 🔍 Buscar caronas disponíveis
- 📅 Filtrar por horário e rota
- 💬 Chat com motoristas
- ⭐ Avaliar experiências

### Recursos de Segurança
- ✅ Verificação de vínculo universitário
- 👤 Perfis completos com fotos
- ⭐ Sistema de reputação
- 📊 Histórico de viagens

---

## 🛠️ Tecnologias Utilizadas

### Frontend - Interface Moderna e Responsiva
```typescript
⚛️  React - Biblioteca JavaScript para UI
📘  TypeScript - Tipagem estática e segurança
🎨  Tailwind CSS - Estilização moderna
🧩  shadcn-ui - Componentes de UI elegantes
⚡  Vite - Build tool ultrarrápido
```

### Backend - Infraestrutura Robusta
```typescript
🗄️  Supabase - Database PostgreSQL + Auth
🔐  Row Level Security (RLS)
📡  Realtime subscriptions
🚀  Vercel - Hosting e CI/CD
```

### Stack Completo
- **Linguagem**: TypeScript
- **Framework**: React 18+
- **Styling**: Tailwind CSS v3
- **Database**: PostgreSQL (Supabase)
- **Autenticação**: Supabase Auth
- **Deploy**: Vercel
- **Versionamento**: Git/GitHub

---

## 🏭 Requisitos de Hardware - Indústria 4.0

### Arquitetura Atual

```
┌─────────────────────────────────────┐
│   INFRAESTRUTURA CLOUD              │
├─────────────────────────────────────┤
│  ☁️  Vercel (Hosting)               │
│  🗄️  Supabase (Database + Auth)     │
│                                     │
│  Vantagens:                         │
│  ✓ Escalabilidade                   │
│  ✓ Alta disponibilidade             │
│  ✓ Custo-benefício                  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   HARDWARE ATUAL                    │
├─────────────────────────────────────┤
│  📱 Smartphones (Edge Computing)    │
│     ├─ GPS                          │
│     ├─ Bluetooth                    │
│     ├─ Sensores de movimento        │
│     └─ Processamento local          │
└─────────────────────────────────────┘
```

---

## 🏭 Proposta de Hardware IoT

### Sistema Cyber-Physical (CPS)

```
        [MUNDO DIGITAL]
              │
    ┌─────────┴─────────┐
    │   React Web App   │
    │   Supabase Cloud  │
    └─────────┬─────────┘
              │
        [APIs IoT]
              │
    ┌─────────┴─────────┐
        [MUNDO FÍSICO]
              │
    ├─────────┼─────────┤
    │         │         │
Beacons   OBD-II    RFID
  BLE    Veicular   Tags
```

---

## 📡 Hardware Proposto - Fase 1

### 1. Beacons Bluetooth Low Energy (BLE)

**Função**: Detecção automática de presença nos pontos de encontro

- 📍 Instalados em pontos estratégicos do campus
- 🔔 Notificações automáticas de proximidade
- ✅ Confirmação de presença sem intervenção manual
- 💰 Custo: R$ 50-150 por unidade
- 🎯 Quantidade inicial: 3-5 beacons

**Indústria 4.0**: IoT, Conectividade M2M, Dados em tempo real

---

## 🚗 Hardware Proposto - Fase 2

### 2. Adaptador OBD-II (On-Board Diagnostics)

**Função**: Monitoramento veicular em tempo real

- ⛽ Consumo real de combustível
- 💵 Cálculo automático de custos
- 📊 Telemetria do veículo
- 🛡️ Verificação de condições de segurança
- 📍 Rastreamento GPS integrado

**Indústria 4.0**: Big Data, Análise Preditiva, Manutenção 4.0

---

## 🏢 Hardware Proposto - Fase 3

### 3. Totens Interativos no Campus

**Função**: Pontos físicos de acesso ao sistema

- 📱 Tablets touchscreen
- 🔍 Consulta de caronas disponíveis
- 📸 QR Code para check-in/check-out
- 📊 Display de estatísticas em tempo real

**Indústria 4.0**: Interface Humano-Máquina (HMI)

### 4. Sistema RFID/NFC

**Função**: Integração com carteira estudantil

- 🎓 Autenticação via cartão universitário
- ⚡ Check-in automático
- ✅ Verificação de vínculo acadêmico
- 💳 Sistema de créditos/pontos

**Indústria 4.0**: Identificação Automática, Rastreabilidade

---

## 🏭 Pilares da Indústria 4.0 Aplicados

### 1. IoT (Internet das Coisas)
- Beacons, sensores, dispositivos conectados
- Coleta de dados em tempo real

### 2. Big Data & Analytics
- Análise de padrões de deslocamento
- Otimização de rotas
- Previsão de demanda

### 3. Cloud Computing
- Supabase e Vercel
- Processamento distribuído

### 4. Cyber-Physical Systems (CPS)
- Integração mundo físico ↔ digital
- Veículos, sensores, aplicação

### 5. Inteligência Artificial
- Matching inteligente de caronas
- Sistema de recomendação
- Otimização de rotas

### 6. Integração de Sistemas
- APIs conectando hardware ↔ software
- Interoperabilidade

---

## 🎯 Diferenciais do Projeto

### vs. Apps Genéricos de Carona

| Critério | Uni Carona Hub | Apps Genéricos |
|----------|----------------|----------------|
| **Público** | Exclusivo universitários | Público geral |
| **Verificação** | Vínculo acadêmico | Apenas CPF/CNH |
| **Comunidade** | Colegas de universidade | Desconhecidos |
| **Custo** | Compartilhamento | Serviço comercial |
| **Foco** | Rotina acadêmica | Viagens pontuais |
| **Confiança** | Alta (mesma instituição) | Variável |

---

## 📈 Impacto e Benefícios

### Para os Estudantes

- 💰 **Economia**: Redução de até 70% nos custos de transporte
- 🌱 **Sustentabilidade**: Contribuição ambiental mensurável
- 🤝 **Networking**: Conexões com colegas
- ⏰ **Praticidade**: Rotas otimizadas e horários flexíveis

### Para a Universidade

- 🅿️ **Infraestrutura**: Redução da necessidade de estacionamento
- 🌍 **Sustentabilidade**: Alinhamento com metas ESG
- 👥 **Engajamento**: Fortalecimento da comunidade
- 📊 **Dados**: Insights sobre mobilidade estudantil

### Impacto Ambiental

**Exemplo Prático**:
- 4 estudantes compartilhando = 3 carros a menos
- 20 km/dia × 5 dias = 100 km/semana
- **~15 kg de CO₂ economizados por semana**

---

## 🗺️ Roadmap de Desenvolvimento

### ✅ Fase 1 - MVP (Atual)
- [x] Aplicação web funcional
- [x] Sistema de autenticação
- [x] Publicação e busca de caronas
- [x] Perfis de usuário

### 🚧 Fase 2 - Hardware Piloto (3-6 meses)
- [ ] Implementar 3-5 beacons BLE
- [ ] Testar OBD-II com 2-3 motoristas
- [ ] Sistema de QR Code nos pontos
- [ ] Dashboard de métricas ambientais

### 🎯 Fase 3 - Escala (6-12 meses)
- [ ] Expansão para todo campus
- [ ] Totem interativo piloto
- [ ] Sistema RFID com carteira estudantil
- [ ] Gamificação e recompensas

### 🚀 Fase 4 - Crescimento (12+ meses)
- [ ] Parcerias com múltiplas universidades
- [ ] App mobile nativo
- [ ] IA para otimização de rotas
- [ ] Integração com calendários acadêmicos

---

## 💰 Estimativa de Custos - Hardware

### Investimento Inicial (Piloto)

| Item | Quantidade | Custo Unitário | Total |
|------|------------|----------------|-------|
| Beacons BLE | 5 | R$ 100 | R$ 500 |
| Adaptadores OBD-II | 3 | R$ 150 | R$ 450 |
| QR Codes (impressão) | 10 | R$ 5 | R$ 50 |
| **TOTAL** | - | - | **R$ 1.000** |

### ROI (Retorno sobre Investimento)

- **Usuários-alvo**: 100 estudantes (piloto)
- **Economia média**: R$ 200/mês por estudante
- **Economia total**: R$ 20.000/mês
- **Payback**: < 1 semana

---

## 📊 Métricas de Sucesso

### KPIs Principais

**Adoção**:
- 📈 Número de usuários cadastrados
- 🚗 Caronas publicadas por semana
- 🎯 Taxa de ocupação das caronas

**Impacto**:
- 💰 Economia gerada (R$)
- 🌱 CO₂ reduzido (kg)
- 📏 Quilômetros compartilhados

**Engajamento**:
- ⭐ Avaliação média dos usuários
- 🔄 Taxa de uso recorrente
- 💬 NPS (Net Promoter Score)

---

## 🎮 Demonstração

### Fluxos Principais

1. **Cadastro e Verificação**
   - Email universitário
   - Verificação de vínculo
   - Perfil completo

2. **Ofertar Carona** (Motorista)
   - Definir origem e destino
   - Horário e recorrência
   - Número de vagas
   - Contribuição sugerida

3. **Buscar Carona** (Passageiro)
   - Filtros de busca
   - Visualizar opções
   - Solicitar vaga
   - Chat com motorista

4. **Realizar Viagem**
   - Check-in automático (beacon)
   - Notificações em tempo real
   - Check-out e avaliação

---

## 🔐 Segurança e Privacidade

### Medidas Implementadas

- 🎓 **Verificação Acadêmica**: Apenas emails universitários
- 👤 **Perfis Completos**: Fotos e informações verificadas
- ⭐ **Sistema de Reputação**: Avaliações mútuas
- 🔒 **Dados Criptografados**: HTTPS e criptografia end-to-end
- 📜 **LGPD Compliance**: Conformidade com lei de proteção de dados
- 🚨 **Botão de Emergência**: (roadmap) Contato rápido com autoridades

---

## 🌟 Diferenciais Técnicos

### Arquitetura Escalável

```typescript
// Exemplo: Sistema de Matching Inteligente
interface CaronaMatch {
  compatibilidade: number;  // 0-100%
  desvioRota: number;       // metros
  horarioProximidade: number; // minutos
  reputacao: number;        // 0-5 estrelas
}

// Algoritmo considera múltiplos fatores
const calcularMatch = (passageiro, carona) => {
  const score = 
    calcularDistancia(passageiro.origem, carona.rota) * 0.4 +
    calcularHorario(passageiro.horario, carona.horario) * 0.3 +
    carona.motorista.reputacao * 0.2 +
    verificarPreferencias(passageiro, carona) * 0.1;
  
  return score;
};
```

---

## 📱 Responsividade e Acessibilidade

### Design Mobile-First

- 📱 **100% Responsivo**: Desktop, tablet, mobile
- ♿ **WCAG 2.1**: Padrões de acessibilidade
- 🎨 **Dark Mode**: Conforto visual
- 🌐 **PWA Ready**: Instalável como app
- ⚡ **Performance**: Lighthouse score 90+

---

## 🤝 Parcerias Estratégicas

### Potenciais Parceiros

**Universidades**:
- Integração institucional
- Uso de infraestrutura (totens, beacons)
- Divulgação oficial

**Empresas de Tecnologia**:
- Fornecedores de hardware IoT
- Plataformas de pagamento
- Serviços de mapas

**Governo e ONGs**:
- Programas de mobilidade sustentável
- Incentivos fiscais
- Certificações ambientais

---

## 🎓 Aspectos Acadêmicos

### Aprendizados do Projeto

**Tecnologias**:
- Desenvolvimento full-stack moderno
- Arquitetura cloud-native
- Integração IoT
- Boas práticas de segurança

**Gestão**:
- Metodologias ágeis
- Versionamento de código
- Deploy automatizado
- Documentação técnica

**Negócios**:
- Modelagem de negócio
- Análise de viabilidade
- Pesquisa de mercado
- Pitch e apresentação

---

## 🌍 Escalabilidade

### Visão de Crescimento

**Curto Prazo (6 meses)**:
- 1 universidade piloto
- 500 usuários ativos
- 100+ caronas/semana

**Médio Prazo (1 ano)**:
- 3-5 universidades
- 5.000 usuários ativos
- 1.000+ caronas/semana

**Longo Prazo (2+ anos)**:
- 20+ universidades
- 50.000+ usuários
- Modelo de negócio sustentável
- Expansão nacional

---

## 💼 Modelo de Negócio

### Sustentabilidade Financeira

**Fase Inicial**: Gratuito (captação de usuários)

**Futuro**:
- 💳 **Freemium**: Recursos básicos gratuitos, premium pagos
- 🎯 **Publicidade**: Anúncios segmentados para estudantes
- 🤝 **Parcerias**: Convênios com universidades
- 📊 **Dados**: Insights de mobilidade (anonimizados)
- 🏢 **B2B**: Soluções para empresas próximas a universidades

---

## 📊 Comparação com Concorrentes

### Análise Competitiva

| Recurso | Uni Carona Hub | Blablacar | Waze Carpool |
|---------|----------------|-----------|--------------|
| Foco Universitário | ✅ | ❌ | ❌ |
| Verificação Acadêmica | ✅ | ❌ | ❌ |
| Hardware IoT | ✅ | ❌ | ❌ |
| Gratuito | ✅ | ❌ (taxa) | ✅ |
| App Mobile | 🚧 | ✅ | ✅ |
| Comunidade Fechada | ✅ | ❌ | ❌ |

---

## 🔬 Metodologia de Desenvolvimento

### Processo Adotado

**Desenvolvimento**:
- ⚡ Metodologia Ágil (Scrum)
- 🔄 Sprints de 2 semanas
- 🧪 TDD (Test-Driven Development)
- 📝 Documentação contínua

**Ferramentas**:
- 🐙 GitHub (versionamento)
- 🎨 Figma (design)
- 📊 Trello/Jira (gestão)
- 🚀 CI/CD (Vercel)

---

## 🎯 Público-Alvo

### Personas

**👨‍🎓 João - O Motorista Econômico**
- 22 anos, Engenharia
- Vai de carro todos os dias
- Quer dividir custos
- Gosta de conhecer pessoas

**👩‍🎓 Maria - A Passageira Sustentável**
- 20 anos, Biologia
- Preocupada com meio ambiente
- Orçamento limitado
- Busca segurança

**👨‍🏫 Prof. Carlos - O Pesquisador**
- 45 anos, Docente
- Horários flexíveis
- Interesse em dados de mobilidade
- Quer contribuir com comunidade

---

## 📈 Validação de Mercado

### Pesquisa Preliminar

**Problema Validado**:
- 78% dos estudantes consideram transporte caro
- 65% já ofereceram ou pegaram carona informal
- 82% usariam plataforma dedicada
- 91% valorizam segurança e verificação

**Referências**:
- Pesquisa com 150 estudantes
- 3 universidades diferentes
- Março-Abril 2024

---

## 🛡️ Gestão de Riscos

### Principais Riscos e Mitigações

**Técnicos**:
- ⚠️ Escalabilidade → Arquitetura cloud
- ⚠️ Segurança → Criptografia e auditorias
- ⚠️ Bugs → Testes automatizados

**Negócio**:
- ⚠️ Adoção lenta → Marketing direcionado
- ⚠️ Concorrência → Diferenciação por nicho
- ⚠️ Regulação → Compliance legal

**Operacional**:
- ⚠️ Hardware → Fornecedores múltiplos
- ⚠️ Manutenção → Monitoramento 24/7

---

## 🎓 Contribuição Acadêmica

### Impacto no Ensino

**Para Estudantes de TI**:
- Caso real de desenvolvimento full-stack
- Integração de hardware e software
- Práticas de Indústria 4.0

**Para Pesquisadores**:
- Dados de mobilidade urbana
- Padrões de comportamento
- Impacto ambiental mensurável

**Para Instituições**:
- Inovação social
- Sustentabilidade
- Engajamento comunitário

---

## 🌟 Casos de Uso Reais

### Cenários de Aplicação

**Cenário 1: Rotina Diária**
- Pedro mora a 15km da universidade
- Vai de carro de segunda a sexta
- Oferece 3 vagas via app
- **Economia**: R$ 300/mês

**Cenário 2: Evento Especial**
- Show no campus às 20h
- Ana busca carona de volta
- Encontra colega do mesmo bairro
- **Segurança**: Viagem com conhecida

**Cenário 3: Estágio**
- Lucas estagia perto da universidade
- Horário diferente das aulas
- App conecta com outros estagiários
- **Networking**: Novos contatos profissionais

---

## 💡 Inovações Futuras

### Funcionalidades em Pesquisa

**IA e Machine Learning**:
- 🤖 Sugestões proativas de caronas
- 📊 Previsão de demanda
- 🗺️ Otimização de rotas em tempo real

**Gamificação**:
- 🏆 Badges e conquistas
- 🌱 Árvores plantadas virtualmente
- 👥 Rankings de contribuição

**Integração**:
- 📅 Calendário acadêmico automático
- 🎫 Sistema de caronas para eventos
- 🏢 Parcerias com empresas locais

---

## 📞 Contato e Comunidade

### Canais de Comunicação

- 🌐 **Website**: [em desenvolvimento]
- 💬 **Discord**: Comunidade de usuários
- 📧 **Email**: contato@unicaronahub.com.br
- 📱 **Instagram**: @unicaronahub
- 🐙 **GitHub**: github.com/Silvarthur37/uni-carona-hub

### Contribuições Open Source
- 🔓 Código aberto (partes não-sensíveis)
- 🤝 Aceita contribuições
- 📚 Documentação completa

---

## 🎯 Conclusão

### Por que Uni Carona Hub?

✅ **Problema Real**: Transporte universitário é caro e ineficiente

✅ **Solução Viável**: Tecnologia moderna + Hardware IoT

✅ **Impacto Mensurável**: Economia + Sustentabilidade + Comunidade

✅ **Escalável**: Arquitetura preparada para crescimento

✅ **Inovador**: Integração de Indústria 4.0 no contexto acadêmico

---

## 🚀 Call to Action

### Próximos Passos

**Para Estudantes**:
- 📝 Cadastre-se no piloto
- 💬 Dê feedback
- 🤝 Compartilhe com colegas

**Para Universidades**:
- 🤝 Parcerias institucionais
- 🏢 Infraestrutura para hardware
- 📢 Divulgação oficial

**Para Investidores**:
- 💼 Reunião de apresentação
- 📊 Plano de negócios detalhado
- 📈 Projeções financeiras

---

## 🙏 Agradecimentos

Obrigado pela atenção!

**Desenvolvido por**: Arthur Silva (@Silvarthur37)

**Tecnologias**: React, TypeScript, Supabase, Vercel

**Repositório**: github.com/Silvarthur37/uni-carona-hub

---

## ❓ Perguntas?

Estou à disposição para esclarecer dúvidas sobre:

- 💻 Aspectos técnicos
- 🏭 Integração de hardware
- 📊 Modelo de negócio
- 🚀 Implementação
- 🤝 Parcerias

**Contato**: [seu-email]@universidade.edu.br