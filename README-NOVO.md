# Sistema de Gestão Empresarial

Um sistema completo de gestão empresarial desenvolvido com HTML, CSS, JavaScript e Firebase, projetado para gerenciar produtos, clientes, fornecedores, compras, custos e precificação.

## 🚀 Funcionalidades

### 🔐 Autenticação
- Login seguro com usuário fixo (juan/9070)
- Sessão persistente
- Interface de login moderna e responsiva

### 📊 Dashboard
- Visão geral do negócio
- Métricas em tempo real
- Estatísticas de produtos, clientes, fornecedores e compras
- Atividade recente
- Ações rápidas

### 📦 Gestão de Produtos
- Cadastro completo de produtos
- Controle de estoque
- Estoque mínimo com alertas
- Categorias organizadas
- Busca e filtragem
- Edição e exclusão

### 👥 Gestão de Clientes
- Cadastro completo de clientes
- Informações de contato
- Endereço e localização
- Busca avançada
- Interface em cards

### 🏭 Gestão de Fornecedores
- Cadastro de fornecedores
- Informações comerciais
- Categorias de fornecedores
- CNPJ e contato
- Interface organizada

### 💰 Registro de Compras
- Registro detalhado de compras
- Atualização automática de estoque
- Cálculo automático de totais
- Histórico completo
- Integração com produtos e fornecedores

### 📈 Análise de Custos
- Cálculo automático de custos médios
- Análise por produto
- Gráficos visuais
- Tendências de preços
- Custo total do estoque

### 💵 Precificação Inteligente
- Cálculo automático de preços sugeridos
- Configuração de margens
- Análise de preços atuais
- Status de precificação
- Atualização em lote

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase Realtime Database
- **Estilo**: CSS Grid, Flexbox, Animações CSS
- **Responsividade**: Mobile-first design
- **Autenticação**: Local storage + Firebase

## 📁 Estrutura de Arquivos

```
test/
├── login.html          # Página de login
├── main.html           # Menu principal
├── dashboard.html      # Dashboard
├── products.html       # Gestão de produtos
├── clients.html        # Gestão de clientes
├── suppliers.html      # Gestão de fornecedores
├── purchases.html      # Registro de compras
├── costs.html          # Análise de custos
├── pricing.html        # Precificação
├── style.css           # Estilos compartilhados
├── script.js           # Lógica principal
└── README-NOVO.md     # Documentação
```

## 🚀 Como Usar

### 1. Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative o Realtime Database
3. Copie as credenciais do seu projeto
4. Substitua as credenciais placeholder no início de cada arquivo JavaScript:

```javascript
const firebaseConfig = {
    apiKey: "SUA_API_KEY_AQUI",
    authDomain: "SEU_PROJETO.firebaseapp.com",
    databaseURL: "https://SEU_PROJETO-default-rtdb.firebaseio.com",
    projectId: "SEU_PROJETO",
    storageBucket: "SEU_PROJETO.appspot.com",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SEU_APP_ID"
};
```

### 2. Acesso ao Sistema

1. Abra o arquivo `login.html` no navegador
2. Faça login com:
   - **Usuário**: `juan`
   - **Senha**: `9070`
3. Você será redirecionado para o menu principal

### 3. Navegação

- **login.html**: Página de acesso inicial
- **main.html**: Menu principal com acesso a todos os módulos
- **dashboard.html**: Visão geral e estatísticas
- **products.html**: Gestão de produtos e estoque
- **clients.html**: Gestão de clientes
- **suppliers.html**: Gestão de fornecedores
- **purchases.html**: Registro de compras
- **costs.html**: Análise de custos
- **pricing.html**: Precificação inteligente

## 🎨 Características de Design

### Interface Moderna
- Design limpo e profissional
- Gradientes e sombras suaves
- Animações e transições fluidas
- Ícones intuitivos

### Responsividade
- Layout adaptável para todos os dispositivos
- Menu otimizado para mobile
- Tabelas responsivas
- Cards flexíveis

### Experiência do Usuário
- Feedback visual imediato
- Notificações de sucesso
- Estados de carregamento
- Validação de formulários

## 📊 Fluxo de Trabalho

1. **Cadastro Inicial**: 
   - Cadastre fornecedores
   - Cadastre produtos
   - Cadastre clientes

2. **Operações Diárias**:
   - Registre compras
   - Atualize estoque
   - Monitore custos

3. **Análise e Decisão**:
   - Visualize dashboard
   - Analise custos
   - Ajuste preços
   - Monitore métricas

## 🔧 Funcionalidades Técnicas

### Segurança
- Validação de dados
- Sanitização de inputs
- Autenticação local
- Sessão segura

### Performance
- Carregamento assíncrono
- Cache local
- Otimização de imagens
- Animações CSS

### Integração
- Firebase Realtime Database
- Sincronização automática
- Backup em nuvem
- Acesso multi-dispositivo

## 🌱 Melhorias Futuras

- [ ] Relatórios avançados
- [ ] Exportação de dados (PDF/Excel)
- [ ] Notificações por email
- [ ] Integração com APIs de pagamento
- [ ] Multi-usuários com permissões
- [ ] Aplicativo mobile (PWA)
- [ ] Análise preditiva
- [ ] Integração com sistemas de contabilidade

## 📝 Notas de Desenvolvimento

### Padrões de Código
- JavaScript ES6+
- CSS3 com variáveis
- HTML5 semântico
- Nomenclatura consistente

### Boas Práticas
- Componentização
- Reutilização de código
- Comentários descritivos
- Tratamento de erros

## 🤝 Contribuição

Sinta-se à vontade para contribuir com melhorias, correções de bugs ou novas funcionalidades.

## 📄 Licença

Este projeto é open source e pode ser utilizado livremente.

## 📞 Suporte

Para dúvidas ou suporte, verifique a documentação ou entre em contato.

---

**Desenvolvido com ❤️ para simplificar a gestão do seu negócio**
