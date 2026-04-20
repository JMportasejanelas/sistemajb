# WebOS - Sistema Operacional Web

Um sistema operacional web completo com interface gráfica e integração com Firebase Realtime Database.

## 🚀 Funcionalidades

### Interface Gráfica
- **Desktop virtual** com ícones e wallpapers
- **Barra de tarefas** com menu iniciar e relógio
- **Sistema de janelas** arrastáveis e redimensionáveis
- **Temas** claro e escuro
- **Notificações** do sistema

### Aplicativos Inclusos
- **Terminal** com comandos Unix-like
- **Gerenciador de Arquivos** com navegação de diretórios
- **Editor de Texto** para criar e editar arquivos
- **Configurações** do sistema

### Sistema de Arquivos Virtual
- Estrutura de diretórios completa
- Criação/exclusão de arquivos e pastas
- Navegação entre diretórios
- Conteúdo dos arquivos salvo no Firebase

### Firebase Integration
- **Realtime Database** para sincronização
- **Autenticação** de usuários
- **Backup automático** dos dados
- **Configurações** personalizadas por usuário

## 🛠️ Tecnologias

- **HTML5** - Estrutura semântica
- **CSS3** - Interface moderna com Glassmorphism
- **JavaScript ES6+** - Lógica do sistema
- **Firebase** - Backend e banco de dados

## 📋 Comandos do Terminal

```bash
help          - Mostra comandos disponíveis
ls            - Lista arquivos e diretórios
cd [dir]      - Navega para diretório
mkdir [name]  - Cria diretório
touch [name]  - Cria arquivo
cat [file]    - Mostra conteúdo do arquivo
whoami        - Mostra usuário atual
clear         - Limpa terminal
date          - Mostra data e hora
```

## 🔧 Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative o **Realtime Database** e **Authentication**
3. Copie as configurações do projeto
4. Substitua as credenciais no arquivo `script.js`:

```javascript
const firebaseConfig = {
    apiKey: "sua-api-key",
    authDomain: "seu-projeto.firebaseapp.com",
    databaseURL: "https://seu-projeto-default-rtdb.firebaseio.com",
    projectId: "seu-projeto",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};
```

## 🌐 Como Usar

1. Abra o arquivo `index.html` em um navegador moderno
2. Clique nos ícones da área de trabalho ou use o menu iniciar
3. Faça login para salvar seus dados na nuvem
4. Use as aplicações como em um sistema operacional real

## 📁 Estrutura de Arquivos

```
/
├── home/
│   ├── documents/
│   ├── downloads/
│   └── desktop/
├── system/
│   ├── config.json
│   └── logs/
└── tmp/
```

## 🎨 Interface

- **Design moderno** com efeitos de blur e transparência
- **Animações suaves** para transições
- **Responsivo** a diferentes tamanhos de tela
- **Acessível** com navegação por teclado

## 🔒 Segurança

- Autenticação segura com Firebase Auth
- Dados criptografados em trânsito
- Regras de acesso configuráveis no Firebase

## 🚀 Futuras Melhorias

- [ ] Mais aplicativos (calculadora, navegador, etc.)
- [ ] Suporte a múltiplos usuários simultâneos
- [ ] Sistema de permissões de arquivos
- [ ] Editor de código com syntax highlighting
- [ ] Integração com APIs externas
- [ ] Temas personalizáveis
- [ ] Suporte a drag & drop de arquivos

## 📝 Notas

- O sistema funciona completamente no navegador
- Os dados são sincronizados em tempo real
- Não requer instalação ou configuração complexa
- Compatível com navegadores modernos (Chrome, Firefox, Safari, Edge)

## 🤣 Easter Eggs

- Tente comandos inesperados no terminal
- Arraste as janelas para posições criativas
- Mude o tema rapidamente várias vezes
- Crie arquivos com nomes divertidos
