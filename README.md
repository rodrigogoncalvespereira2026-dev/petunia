# 🌸 Petúnia - IA Companheira Multimodal

Uma aplicação móvel de IA companheira/assistente virtual com conversação por texto e voz, memória controlada pelo utilizador, ferramentas, pesquisa na Internet, análise de imagens/ficheiros e um avatar 3D expressivo.

## ✅ Projeto Completo (Fase 7)

Todas as 7 fases foram implementadas com sucesso.

## Stack Tecnológica

- **Frontend**: React Native + Expo
- **Linguagem**: TypeScript
- **Estado**: Zustand
- **Storage**: AsyncStorage + SecureStore
- **AI**: Interface abstrata (OpenAI, Anthropic, Google, Ollama)
- **Voz**: expo-speech (TTS), Web Speech API (STT)
- **Avatar**: React Native Animated (2D com expressões)

## Funcionalidades

### 💬 Chat
- Conversação com IA em Português de Portugal
- Respostas estruturadas com emoções
- Streaming de respostas
- Indicador de processamento

### 🎙️ Voz
- Speech-to-Text (Web Speech API)
- Text-to-Speech (expo-speech)
- Modo voz dedicado
- Botão de voz no chat

### 🧠 Memória
- Memória de curto prazo (contexto da conversa)
- Memória de longo prazo (guardada pelo utilizador)
- Comandos de voz: "Petúnia, guarda isto..."
- Gestão de memórias (ver, editar, apagar)

### 🛠️ Ferramentas
- Calculadora
- Conversor de unidades
- Temporizador
- Pesquisa na Internet

### 📁 Ficheiros e Visão
- Selecionar imagens da galeria
- Tirar fotos com a câmara
- Análise de imagens com IA

### 🧍 Avatar
- 9 expressões faciais animadas
- 5 estados de animação
- Pestanejar automático
- Movimento natural da cabeça
- Acessório de flor

### ⚙️ Definições
- Configuração de AI Provider
- API keys guardadas com segurança
- Configurações de voz
- Gestão de dados

## Estrutura do Projeto

```
petunia/
├── src/
│   ├── components/    # Componentes React
│   │   ├── avatar/    # Avatar 3D com expressões
│   │   ├── chat/      # Componentes de chat
│   │   ├── voice/     # Componentes de voz
│   │   ├── memory/    # Componentes de memória
│   │   ├── tools/     # Ferramentas
│   │   ├── files/     # Gestão de ficheiros
│   │   ├── settings/  # Definições
│   │   └── ui/        # Componentes genéricos
│   ├── services/      # Serviços externos
│   │   ├── ai/        # AI Provider
│   │   ├── voice/     # STT/TTS
│   │   ├── avatar/    # Serviço de avatar
│   │   ├── memory/    # Sistema de memória
│   │   ├── tools/     # Ferramentas
│   │   ├── files/     # Gestão de ficheiros
│   │   ├── vision/    # Análise de imagens
│   │   └── storage/   # Armazenamento local
│   ├── stores/        # Estado global (Zustand)
│   ├── hooks/         # Hooks personalizados
│   ├── types/         # Definições TypeScript
│   ├── utils/         # Utilitários (performance, segurança)
│   └── __tests__/     # Testes
├── assets/            # Recursos estáticos
├── App.tsx            # Entry point
└── .env.example       # Exemplo de configuração
```

## Setup

1. Instalar dependências:
```bash
npm install
```

2. Configurar variáveis de ambiente:
```bash
cp .env.example .env
```

3. Editar `.env` com a API key do provider escolhido.

4. Iniciar o projeto:
```bash
npm start
```

## AI Providers

A aplicação suporta múltiplos providers de IA:

- **OpenAI** (GPT-4o, GPT-4o-mini)
- **Anthropic** (Claude)
- **Google** (Gemini)
- **Ollama** (modelos locais)

Para usar, configure o provider nas definições da aplicação.

## Otimizações Implementadas

- **Lazy Loading**: Carregamento sob demanda dos ecrãs
- **Performance**: Debounce, throttle e medição de performance
- **Segurança**: API keys guardadas com SecureStore
- **TypeScript**: Type safety em todo o projeto

## Licença

MIT

---

Feito com 🌸 em Portugal
