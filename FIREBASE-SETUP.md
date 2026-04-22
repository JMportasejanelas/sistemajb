# Configuração do Firebase para o Sistema

## Problema: Sistema não está salvando dados no GitHub Pages

O problema mais comum é que as **regras de segurança do Firebase Realtime Database** estão configuradas para negar acesso por padrão.

## Solução: Configurar as Regras do Firebase

### 1. Acesse o Firebase Console
- Vá para: https://console.firebase.google.com/
- Selecione seu projeto: `sistemajb-909c1`

### 2. Configure as Regras do Realtime Database
- No menu esquerdo, clique em **Realtime Database**
- Clique na aba **Regras** (Rules)
- **Substitua todo o conteúdo** com as regras abaixo:

```json
{
  "rules": {
    ".read": "true",
    ".write": "true",
    ".validate": "newData.hasChildren() || newData === null"
  }
}
```

### 3. Publique as Regras
- Clique em **Publicar** (Publish)
- Confirme a publicação

## Regras Detalhadas (Opcional)

Se quiser mais segurança, use estas regras:

```json
{
  "rules": {
    "products": {
      ".read": "true",
      ".write": "true",
      ".validate": "newData.hasChildren(['name', 'code', 'category', 'stock', 'minStock', 'price'])"
    },
    "clients": {
      ".read": "true", 
      ".write": "true",
      ".validate": "newData.hasChildren(['name', 'cpf', 'email', 'phone'])"
    },
    "suppliers": {
      ".read": "true",
      ".write": "true", 
      ".validate": "newData.hasChildren(['name', 'cnpj', 'email', 'phone'])"
    },
    "purchases": {
      ".read": "true",
      ".write": "true",
      ".validate": "newData.hasChildren(['date', 'supplier', 'product', 'quantity', 'unitPrice', 'total'])"
    },
    "test": {
      ".read": "true",
      ".write": "true"
    }
  }
}
```

## Verificação

Depois de configurar as regras:

1. **Abra o sistema** no GitHub Pages
2. **Abra o console do navegador** (F12)
3. **Tente cadastrar um produto**
4. **Verifique os logs** no console:
   - Deve aparecer: "Conectado ao Firebase: true"
   - Deve aparecer: "Teste de escrita no Firebase bem-sucedido"
   - Deve aparecer: "Produto salvo: [dados do produto]"

## Se ainda não funcionar

### 1. Verifique o domínio autorizado
- No Firebase Console > Project Settings > General
- Em "Seus aplicativos" > Seu app da web
- Verifique se o domínio do GitHub Pages está autorizado
- Adicione: `*.github.io` e seu domínio específico

### 2. Limpe o cache
- Limpe o cache do navegador
- Recarregue a página com Ctrl+F5

### 3. Verifique o console
- Abra F12 e olhe a aba Console
- Procure por erros vermelhos
- Erros comuns:
  - "PERMISSION_DENIED" -> Regras do Firebase
  - "App not authorized" -> Domínio não autorizado
  - "Network error" -> Problema de conexão

## Teste Local

Para testar localmente antes de fazer deploy:

1. Use um servidor local (como Live Server no VS Code)
2. Abra `main.html` localmente
3. Teste o cadastro
4. Verifique os logs no console

## Contato

Se após tudo isso ainda não funcionar:
1. Tire print dos erros no console
2. Verifique as regras aplicadas no Firebase
3. Confirme que o projeto está correto

---

**Importante**: As regras `.read: "true"` e `.write: "true"` permitem acesso público ao banco de dados. Para produção, considere implementar autenticação Firebase para maior segurança.
