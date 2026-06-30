# 🛡️ Guia de Backup e Recuperação

## 📋 Visão Geral

Este projeto possui um **sistema de backup automático** que garante que seus dados estejam sempre protegidos e acessíveis de qualquer lugar.

---

## 🚀 Começando

### 1. Instalação inicial
```bash
# Clone o repositório
git clone https://github.com/Augusto23brandini/site-de-or-amento-da-linear
cd site-de-or-amento-da-linear

# Instale as dependências
npm install
```

### 2. Primeiro backup manual
```bash
npm run backup
```

---

## 🔄 Tipos de Backup

### Backup Automático (GitHub Actions)
- ⏰ Executado **diariamente às 2 da manhã (UTC)**
- 📤 Enviado automaticamente para o GitHub
- 🌍 Acessível de qualquer lugar
- ⚙️ Sem configuração necessária

### Backup Manual
```bash
npm run backup
```

### Backup em Tempo Real (Desenvolvimento)
```bash
npm run backup:watch
```
Monitora mudanças e faz backup automático enquanto você desenvolve.

---

## 📁 Estrutura de Backups

```
backups/
├── backup_20240630/
│   ├── index.html
│   ├── css/
│   ├── js/
│   ├── data/
│   ├── config.json
│   └── metadata.json
├── backup_20240629/
│   └── ... (mesmo padrão)
└── README.md
```

Cada backup contém:
- 📊 **metadata.json** - Data, quantidade de arquivos e tamanho
- 📝 **Todos os arquivos** do projeto em um ponto específico no tempo

---

## 🔍 Visualizando Backups

### No GitHub (Online)
1. Vá para: `https://github.com/Augusto23brandini/site-de-or-amento-da-linear`
2. Navegue até a pasta `backups/`
3. Escolha o backup desejado
4. Veja os arquivos em tempo real

### Localmente
```bash
# Listar todos os backups
ls -la backups/

# Ver metadata de um backup específico
cat backups/backup_20240630/metadata.json

# Comparar dois backups
diff -r backups/backup_20240630 backups/backup_20240629
```

---

## ⚙️ Configuração Personalizada

Edite `backup-config.json` para customizar:

```json
{
  "backup": {
    "enabled": true,                    // Habilitar/desabilitar backups
    "frequency": "daily",               // Frequência (daily, weekly, etc)
    "directory": "./backups",           // Onde armazenar
    "timestamp_format": "YYYYMMDD_HHmmss",
    "items_to_backup": [               // O que fazer backup
      "index.html",
      "css/",
      "js/",
      "data/",
      "config.json"
    ],
    "max_backups": 10                  // Manter os últimos 10
  }
}
```

---

## 🔧 Recuperando Dados

### Opção 1: Recuperar arquivo específico
```bash
# Copiar um arquivo do backup
cp backups/backup_20240630/js/app.js ./js/app.js
```

### Opção 2: Recuperar tudo do backup
```bash
# Restaurar pasta inteira
cp -r backups/backup_20240630/* ./
```

### Opção 3: Via GitHub
1. Vá ao repositório no GitHub
2. Navegue até `backups/backup_YYYYMMDD/`
3. Clique no arquivo para visualizar/baixar

---

## 🌍 Acessando de Qualquer Lugar

### Cenário 1: Outro computador
```bash
# 1. Clone o repo
git clone https://github.com/Augusto23brandini/site-de-or-amento-da-linear

# 2. Backups estão em:
cd site-de-or-amento-da-linear/backups/

# 3. Recupere o que precisar
```

### Cenário 2: Smartphone/Tablet
- Use a app GitHub mobile
- Navegue até `backups/`
- Visualize ou baixe arquivos

### Cenário 3: Sem acesso ao git
- Acesse diretamente: `github.com/Augusto23brandini/site-de-or-amento-da-linear/tree/main/backups`
- Clique nos arquivos para visualizar/baixar

---

## 🔐 Segurança

- ✅ Todos os backups estão no GitHub (cloud seguro)
- ✅ Versionamento automático (git history)
- ✅ Backups antigos são mantidos por 10 dias (configurável)
- ✅ Você pode ver histórico completo em "Commits"

---

## 📊 Monitoramento

### Ver status dos backups
```bash
# Verificar último backup
ls -lt backups/ | head -2

# Ver tamanho total
du -sh backups/
```

### Verificar histórico no GitHub
1. Vá para o repositório
2. Clique em "Commits"
3. Procure por mensagens com "Backup automático"

---

## ❓ Troubleshooting

### Backup não está criando
```bash
# Verifique permissões
chmod +x scripts/backup.js

# Rode manualmente
npm run backup

# Verifique logs
ls -la backups/
```

### GitHub Actions não executou
1. Vá para "Actions" no repositório
2. Verifique o workflow "📦 Backup Diário"
3. Se houver erro, clique no workflow para detalhes

### Preciso alterar a hora do backup
Edite `.github/workflows/daily-backup.yml`:
```yaml
- cron: '0 2 * * *'  # Altere os números (hora minuto)
```

---

## 📞 Suporte

Se tiver dúvidas:
1. Verifique este guia
2. Veja o arquivo `backup-config.json`
3. Consulte o README.md em `backups/`

---

**Seu dados estão seguros! 🛡️✅**
