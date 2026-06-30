# Linear Gestão Pro V9.6

Sistema local/PWA para gestão da Linear Móveis Planejados.

## Como abrir

1. Extraia o ZIP.
2. Abra o arquivo `index.html` no navegador.
3. Para instalar no celular/PC, use a opção do navegador **Instalar app** ou **Adicionar à tela inicial**.
4. Para salvar os dados que estão no navegador local, clique em **Exportar backup** e salve o arquivo JSON.

## Novidades V9.6

- Alertas do dashboard mais limpos: mostra principalmente **nome do cliente** e **qual parcela/conta**.
- Financeiro reorganizado por cliente.
- Cada cliente aparece como um card clicável.
- Ao clicar no cliente, abre uma ficha com:
  - dados do cliente;
  - valor já recebido;
  - valor a receber;
  - parcelas vencidas;
  - parcelas pendentes;
  - orçamentos vinculados;
  - contratos vinculados;
  - botões para PDF do orçamento/contrato;
  - botão para marcar parcela como recebida.
- Mantidos módulos de orçamento, contrato, assinatura, produtos, contas fixas, compras/despesas, impostos estimados e backup.

## Observação importante

Os dados ficam salvos no navegador pelo `localStorage`. Use **Exportar backup** com frequência. Para sincronização real entre dispositivos, configure o Supabase usando o `schema.sql`.

## Atualização V9.6

- Substituição das caixas genéricas por Mão de Obra e Próximos Vencimentos.
- Cadastro de mão de obra: para quem pagar, cliente/projeto, valor, vencimento e status.
- Dashboard mostra vencimentos com dias restantes.
- Salvamento automático no navegador/localStorage.
- Backup local interno antes de zerar o sistema.
- Exportar e restaurar backup JSON.

Observação: para acesso em outro computador/celular, use Exportar/Importar backup ou configure Supabase. O backup local fica salvo na máquina/navegador onde o sistema foi usado.

## Deploy no GitHub Pages

1. Crie o repositório no GitHub em `https://github.com/Augusto23brandini/site-de-or-amento-da-linear`.
2. No terminal, execute:

```bash
git init
git branch -M main
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/Augusto23brandini/site-de-or-amento-da-linear.git
git push -u origin main
```

3. No GitHub, abra `Settings > Pages` e selecione:
   - Branch: `main`
   - Folder: `/ (root)`
4. Salve e aguarde a publicação. O site ficará disponível em:

```text
https://augusto23brandini.github.io/site-de-or-amento-da-linear/
```

## Fluxo padrão para atualizações

Sempre que fizer alterações no VS Code:

```bash
git add .
git commit -m "Descrição da alteração"
git push
```
