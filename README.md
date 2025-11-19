# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/78e4e7db-060f-49a8-9e78-b25dc7943821

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/78e4e7db-060f-49a8-9e78-b25dc7943821) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/78e4e7db-060f-49a8-9e78-b25dc7943821) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Progressive Web App (PWA)

Este projeto está configurado como um Progressive Web App, permitindo instalação em dispositivos móveis e desktop.

### Funcionalidades PWA

- **Instalação**: O app pode ser instalado na tela inicial do dispositivo
- **Offline**: Funciona mesmo sem conexão à internet (cache de assets estáticos)
- **Atualizações automáticas**: Service Worker atualiza automaticamente quando há novas versões
- **Experiência nativa**: Interface otimizada para mobile e desktop

### Como instalar no celular

**Android (Chrome/Edge)**
1. Acesse o site pelo navegador
2. Toque no menu (⋮) e selecione "Instalar app" ou "Adicionar à tela inicial"
3. Confirme a instalação

**iOS (Safari)**
1. Acesse o site pelo Safari
2. Toque no botão de compartilhar (quadrado com seta)
3. Role para baixo e toque em "Adicionar à Tela de Início"
4. Confirme tocando em "Adicionar"

### Build e Deploy

O PWA é automaticamente ativado durante o build de produção:

```sh
npm run build
```

O Service Worker e manifest são gerados automaticamente pelo `vite-plugin-pwa`.

### Desativação do PWA

Para desativar o PWA (caso necessário), remova ou comente o plugin `VitePWA` no arquivo `vite.config.ts`.

**Importante**: A implementação do PWA não altera nenhuma funcionalidade existente do projeto. Apenas adiciona capacidades de instalação e cache offline.
