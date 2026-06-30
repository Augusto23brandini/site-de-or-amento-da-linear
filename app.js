const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const todayISO = () => new Date().toISOString().slice(0, 10);
const currentMonth = () => new Date().toISOString().slice(0, 7);
const uid = () => 'id_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const money = v => BRL.format(Number(v || 0));
const num = v => Number(String(v ?? '').replace(',', '.')) || 0;
const escapeHtml = (s = '') => String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

const DEFAULT = {
  meta: { version: '9.6.0', updatedAt: new Date().toISOString() },
  company: {
    logo: 'assets/logo-linear.jpeg',
    name: 'LINEAR MOVEIS PLANEJADOS LTDA',
    cnpj: '25.967.859/0001-03',
    phone: '(16) 99774-6888',
    whatsapp: '5516997746888',
    address: 'AVENIDA ALBERTO SANTOS DUMONT, 209, JARDIM DUMONT, ARARAQUARA, SP, 14807-219'
  },
  fiscal: { regime: 'simples', activity: 'industria', rbt12: 0, customRate: 0, useCustom: false, entryPercent: 35, deliveryDays: 30, quoteValidityDays: 7 },
  pdf: {
    intro: 'Para a nossa empresa, é um prazer apresentar essa proposta após as conversas que tivemos sobre o que é importante para alcançarmos o bem-estar e a qualidade de vida no seu dia a dia através dos nossos móveis planejados.\n\nEsse orçamento foi pensado para ser o melhor investimento para você, mantendo móveis duráveis que vão trazer sofisticação aos seus ambientes.',
    contract: '1. Nesse orçamento já estão considerados os valores de mão de obra, materiais e frete.\n2. A validade deste orçamento é de 7 dias após a emissão. Após esse período será necessário atualizar valores devido à variação de preços de insumos.\n3. Para iniciarmos o trabalho é necessário o pagamento de sinal de 35% do valor total.\n4. Em caso de desistência após o início da produção, o valor do sinal poderá não ser restituído.\n5. Os móveis têm garantia de 1 ano. A garantia perde a validade por mau uso, como batidas, riscos, excesso de peso dentro ou sobre os móveis, entre outros.\n6. O prazo de entrega é de até 30 dias úteis após aprovação do orçamento e pagamento do sinal.',
    footer: 'LINEAR MOVEIS PLANEJADOS LTDA',
    serviceContract: '1. A CONTRATADA executará os serviços de móveis planejados conforme orçamento aprovado e especificações combinadas com o cliente.\n2. O início da produção ocorrerá após aprovação do orçamento, assinatura deste contrato e pagamento do sinal de entrada.\n3. Alterações solicitadas após a aprovação poderão gerar atualização de valores e prazos.\n4. O prazo de entrega é de até 30 dias úteis após aprovação, assinatura e pagamento do sinal, salvo situações de força maior ou dependência de terceiros.\n5. Os móveis possuem garantia de 1 ano contra defeitos de fabricação. A garantia não cobre mau uso, batidas, riscos, excesso de peso, umidade, alterações feitas por terceiros ou instalação fora das condições combinadas.\n6. Em caso de desistência após início da produção, o sinal poderá não ser restituído, pois materiais e mão de obra já poderão ter sido comprometidos.\n7. As partes declaram estar de acordo com os dados, valores, prazos, condições de pagamento e itens descritos neste documento.'
  },
  supabase: { url: '', anonKey: '', userEmail: '' },
  finance: {
    categories: ['Compra de MDF', 'Ferragens', 'Mão de obra', 'Instalação', 'Frete', 'Combustível', 'Água', 'Luz/Energia', 'Aluguel', 'Internet/Telefone', 'Impostos', 'Manutenção', 'Marketing', 'Material de escritório', 'Outros'],
    templates: [
      { id: uid(), name: 'Água', category: 'Água', amount: 0, day: 10, active: true },
      { id: uid(), name: 'Luz/Energia', category: 'Luz/Energia', amount: 0, day: 15, active: true },
      { id: uid(), name: 'Aluguel', category: 'Aluguel', amount: 0, day: 5, active: true },
      { id: uid(), name: 'Internet/Telefone', category: 'Internet/Telefone', amount: 0, day: 20, active: true }
    ]
  },
  clients: [{ id: uid(), name: 'Cliente exemplo', phone: '', email: '', address: '', city: 'Araraquara/SP', document: '' }],
  products: [
    { id: uid(), name: 'Cozinha planejada - metro linear', category: 'Móveis planejados', unit: 'm', cost: 1250, price: 2450, active: true },
    { id: uid(), name: 'Guarda-roupa planejado - metro linear', category: 'Móveis planejados', unit: 'm', cost: 1050, price: 2200, active: true },
    { id: uid(), name: 'Painel de TV planejado', category: 'Sala', unit: 'un', cost: 750, price: 1650, active: true },
    { id: uid(), name: 'MDF chapa 18mm', category: 'Material', unit: 'chapa', cost: 280, price: 0, active: true },
    { id: uid(), name: 'Dobradiça com amortecimento', category: 'Ferragens', unit: 'un', cost: 18, price: 38, active: true },
    { id: uid(), name: 'Corrediça telescópica', category: 'Ferragens', unit: 'par', cost: 42, price: 85, active: true },
    { id: uid(), name: 'Instalação / mão de obra', category: 'Serviço', unit: 'serviço', cost: 0, price: 550, active: true },
    { id: uid(), name: 'Frete / deslocamento', category: 'Serviço', unit: 'serviço', cost: 0, price: 180, active: true }
  ],
  quotes: [],
  transactions: [],
  projects: [],
  contracts: [],
  labor: [],
  localBackups: []
};

let state = load();
let deferredPrompt = null;

function mergeDefaults(base, saved) {
  const result = structuredClone(base);
  Object.assign(result, saved || {});
  result.company = { ...base.company, ...(saved?.company || {}) };
  result.fiscal = { ...base.fiscal, ...(saved?.fiscal || {}) };
  result.pdf = { ...base.pdf, ...(saved?.pdf || {}) };
  result.supabase = { ...base.supabase, ...(saved?.supabase || {}) };
  result.finance = { ...base.finance, ...(saved?.finance || {}) };
  if (!Array.isArray(result.finance.categories)) result.finance.categories = base.finance.categories;
  if (!Array.isArray(result.finance.templates)) result.finance.templates = base.finance.templates;
  result.clients = Array.isArray(saved?.clients) && saved.clients.length ? saved.clients.map(c => ({ address: '', ...c })) : base.clients;
  result.products = Array.isArray(saved?.products) && saved.products.length ? saved.products : base.products;
  result.quotes = Array.isArray(saved?.quotes) ? saved.quotes : [];
  result.transactions = Array.isArray(saved?.transactions) ? saved.transactions.map(t => ({ dueDate: t.dueDate || t.date || todayISO(), status: t.status || 'pendente', ...t })) : [];
  result.projects = Array.isArray(saved?.projects) ? saved.projects : [];
  result.contracts = Array.isArray(saved?.contracts) ? saved.contracts : [];
  result.labor = Array.isArray(saved?.labor) ? saved.labor.map(l => ({ dueDate: l.dueDate || todayISO(), status: l.status || 'pendente', ...l })) : [];
  result.localBackups = Array.isArray(saved?.localBackups) ? saved.localBackups : [];
  result.meta = { ...base.meta, ...(saved?.meta || {}), version: '9.6.0' };
  return result;
}
function load() { try { return mergeDefaults(DEFAULT, JSON.parse(localStorage.getItem('linear_gestao_pro') || '{}')); } catch (e) { return structuredClone(DEFAULT); } }
function save() { state.meta.updatedAt = new Date().toISOString(); localStorage.setItem('linear_gestao_pro', JSON.stringify(state)); render(); }
function saveSilent() { state.meta.updatedAt = new Date().toISOString(); localStorage.setItem('linear_gestao_pro', JSON.stringify(state)); }
function createLocalBackup(reason = 'manual') {
  const backup = { id: uid(), reason, createdAt: new Date().toISOString(), data: structuredClone(state) };
  delete backup.data.localBackups;
  state.localBackups = Array.isArray(state.localBackups) ? state.localBackups : [];
  state.localBackups.unshift(backup);
  state.localBackups = state.localBackups.slice(0, 20);
  saveSilent();
  return backup;
}
function exportBackupData(data, name) { const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); URL.revokeObjectURL(a.href); }
function daysUntil(date) { const d = new Date(String(date || todayISO()) + 'T00:00:00'); const now = new Date(todayISO() + 'T00:00:00'); return Math.round((d - now) / 86400000); }
function dueLabel(date) { const n = daysUntil(date); if (n < 0) return `vencido há ${Math.abs(n)} dia(s)`; if (n === 0) return 'vence hoje'; if (n === 1) return 'vence amanhã'; return `vence em ${n} dia(s)`; }
function dueClass(date) { const n = daysUntil(date); return n < 0 ? 'bad' : n <= 3 ? 'bad' : n <= 7 ? 'warn' : 'ok'; }

function field(name, label, type = 'text', value = '', extra = '') { return `<div class="field"><label>${label}</label><input name="${name}" type="${type}" value="${escapeHtml(value)}" ${extra}></div>`; }
function textarea(name, label, value = '', extra = '') { return `<div class="field"><label>${label}</label><textarea name="${name}" ${extra}>${escapeHtml(value)}</textarea></div>`; }
function select(name, label, opts, value) { return `<div class="field"><label>${label}</label><select name="${name}">${opts.map(o => `<option value="${escapeHtml(o[0])}" ${String(o[0]) === String(value) ? 'selected' : ''}>${escapeHtml(o[1])}</option>`).join('')}</select></div>`; }
function catOptions(value) { return state.finance.categories.map(c => `<option value="${escapeHtml(c)}" ${c === value ? 'selected' : ''}>${escapeHtml(c)}</option>`).join(''); }
function statusBadge(status) { const cls = status === 'pago' || status === 'aprovado' || status === 'concluido' ? 'ok' : status === 'vencido' || status === 'recusado' ? 'bad' : 'warn'; return `<span class="badge ${cls}">${escapeHtml(status || '')}</span>`; }

function getQuoteByTransaction(t) {
  if (!t) return null;
  if (t.quoteId) return state.quotes.find(q => q.id === t.quoteId) || null;
  if (t.source) return state.quotes.find(q => q.id === t.source) || null;
  return null;
}
function getTransactionClient(t) {
  if (t?.clientId) return state.clients.find(c => c.id === t.clientId) || null;
  const q = getQuoteByTransaction(t);
  if (q?.clientId) return state.clients.find(c => c.id === q.clientId) || null;
  return null;
}
function parcelLabel(t) {
  if (!t) return '';
  if (t.parcelLabel) return t.parcelLabel;
  if (t.category && /parcela|sinal|saldo/i.test(t.category)) return t.category;
  const m = String(t.description || '').match(/(Entrada|Sinal|Saldo restante|Parcela\s+\d+\/\d+)/i);
  return m ? m[1] : (t.type === 'entrada' ? 'Recebimento' : 'Conta');
}
function transactionClientName(t) {
  const c = getTransactionClient(t);
  return c?.name || t.clientName || 'Sem cliente';
}
function alertLine(t) {
  const who = transactionClientName(t);
  const parc = parcelLabel(t);
  return `${escapeHtml(who)} — ${escapeHtml(parc)} — ${money(t.amount)} — venc. ${escapeHtml(t.dueDate || t.date)}`;
}
function clientFinanceSummary() {
  const map = new Map();
  const ensure = (clientId, fallbackName = 'Sem cliente') => {
    const id = clientId || 'sem_cliente';
    if (!map.has(id)) {
      const c = state.clients.find(x => x.id === clientId) || { id, name: fallbackName, phone: '', email: '', address: '', city: '', document: '' };
      map.set(id, { client: c, quotes: [], transactions: [], sold: 0, received: 0, pending: 0, overdue: 0, paidCount: 0, pendingCount: 0 });
    }
    return map.get(id);
  };
  state.quotes.filter(q => q.status === 'aprovado' || q.status === 'concluido').forEach(q => {
    const c = state.clients.find(x => x.id === q.clientId);
    const row = ensure(q.clientId, c?.name || q.clientName || 'Sem cliente');
    row.quotes.push(q);
    row.sold += calcQuote(q).total;
  });
  state.transactions.filter(t => t.type === 'entrada').forEach(t => {
    const q = getQuoteByTransaction(t);
    const clientId = t.clientId || q?.clientId || null;
    const row = ensure(clientId, t.clientName || q?.clientName || 'Sem cliente');
    row.transactions.push(t);
    if (t.status === 'pago') { row.received += num(t.amount); row.paidCount++; }
    else if (t.status !== 'cancelado') { row.pending += num(t.amount); row.pendingCount++; if ((t.dueDate || t.date) < todayISO()) row.overdue += num(t.amount); }
  });
  return [...map.values()].sort((a,b)=>b.pending-a.pending || String(a.client.name).localeCompare(String(b.client.name)));
}

function modal(title, body, onSubmit) {
  const tpl = document.getElementById('modalTpl').content.cloneNode(true);
  const back = tpl.querySelector('.modal-backdrop');
  back.querySelector('h2').textContent = title;
  back.querySelector('.modal-body').innerHTML = body;
  back.querySelector('.close-modal').onclick = () => back.remove();
  back.addEventListener('click', e => { if (e.target === back) back.remove(); });
  document.body.appendChild(back);
  const first = back.querySelector('input,select,textarea'); if (first) first.focus();
  if (onSubmit) {
    const form = back.querySelector('form');
    if (form) form.onsubmit = e => { e.preventDefault(); onSubmit(Object.fromEntries(new FormData(form).entries()), back); };
  }
  return back;
}

function taxRate() {
  if (state.fiscal.useCustom) return num(state.fiscal.customRate) / 100;
  const r = num(state.fiscal.rbt12);
  const anexoI = [[180000, 4, 0], [360000, 7.3, 5940], [720000, 9.5, 13860], [1800000, 10.7, 22500], [3600000, 14.3, 87300], [4800000, 19, 378000]];
  const anexoII = [[180000, 4.5, 0], [360000, 7.8, 5940], [720000, 10, 13860], [1800000, 11.2, 22500], [3600000, 14.7, 85500], [4800000, 30, 720000]];
  const anexoIII = [[180000, 6, 0], [360000, 11.2, 9360], [720000, 13.5, 17640], [1800000, 16, 35640], [3600000, 21, 125640], [4800000, 33, 648000]];
  const table = state.fiscal.activity === 'comercio' ? anexoI : state.fiscal.activity === 'servico' ? anexoIII : anexoII;
  const row = table.find(x => r <= x[0]) || table[table.length - 1];
  const base = Math.max(r, 1);
  return Math.max(0, ((base * (row[1] / 100)) - row[2]) / base);
}
function calcQuote(q) {
  const subtotal = (q.items || []).reduce((s, i) => s + num(i.qty) * num(i.price), 0);
  const discount = q.discountType === 'percent' ? subtotal * num(q.discount) / 100 : num(q.discount);
  const total = Math.max(0, subtotal - discount);
  const entry = total * num(q.entryPercent ?? state.fiscal.entryPercent) / 100;
  const tax = total * taxRate();
  const cost = (q.items || []).reduce((s, i) => s + num(i.qty) * num(i.cost || 0), 0);
  return { subtotal, discount, total, entry, tax, cost, gross: total - cost, net: total - cost - tax };
}
function totals() {
  const m = currentMonth();
  const txMonth = state.transactions.filter(t => String(t.date || t.dueDate).startsWith(m));
  const income = txMonth.filter(t => t.type === 'entrada' && t.status === 'pago').reduce((s, t) => s + num(t.amount), 0);
  const incomeExpectedMonth = txMonth.filter(t => t.type === 'entrada').reduce((s, t) => s + num(t.amount), 0);
  const expense = txMonth.filter(t => t.type === 'saida' && t.status === 'pago').reduce((s, t) => s + num(t.amount), 0);
  const expenseExpectedMonth = txMonth.filter(t => t.type === 'saida').reduce((s, t) => s + num(t.amount), 0);
  const payable = state.transactions.filter(t => t.type === 'saida' && t.status !== 'pago' && t.status !== 'cancelado').reduce((s, t) => s + num(t.amount), 0);
  const receivable = state.transactions.filter(t => t.type === 'entrada' && t.status !== 'pago' && t.status !== 'cancelado').reduce((s, t) => s + num(t.amount), 0);
  const quoteIds = new Set(state.quotes.filter(q => q.status === 'aprovado' || q.status === 'concluido').map(q => q.id));
  const serviceReceived = state.transactions.filter(t => t.type === 'entrada' && t.status === 'pago' && quoteIds.has(t.source)).reduce((s, t) => s + num(t.amount), 0);
  const approvedServicesTotal = state.quotes.filter(q => q.status === 'aprovado' || q.status === 'concluido').reduce((s, q) => s + calcQuote(q).total, 0);
  const serviceToReceive = Math.max(0, approvedServicesTotal - serviceReceived);
  const receivedAll = state.transactions.filter(t => t.type === 'entrada' && t.status === 'pago').reduce((s, t) => s + num(t.amount), 0);
  const toReceiveAll = state.transactions.filter(t => t.type === 'entrada' && t.status !== 'pago' && t.status !== 'cancelado').reduce((s, t) => s + num(t.amount), 0);
  const today = todayISO();
  const overdue = state.transactions.filter(t => t.status !== 'pago' && t.status !== 'cancelado' && (t.dueDate || t.date) < today);
  const dueSoon = state.transactions.filter(t => t.status !== 'pago' && t.status !== 'cancelado' && (t.dueDate || t.date) >= today).sort((a, b) => String(a.dueDate || a.date).localeCompare(String(b.dueDate || b.date))).slice(0, 8);
  const tax = state.quotes.filter(q => q.status === 'aprovado').reduce((s, q) => s + calcQuote(q).tax, 0);
  const laborPending = (state.labor || []).filter(l => l.status !== 'pago' && l.status !== 'cancelado').reduce((s, l) => s + num(l.amount), 0);
  const laborPaid = (state.labor || []).filter(l => l.status === 'pago').reduce((s, l) => s + num(l.amount), 0);
  const laborNext = [...(state.labor || [])].filter(l => l.status !== 'pago' && l.status !== 'cancelado').sort((a,b)=>String(a.dueDate).localeCompare(String(b.dueDate))).slice(0, 5);
  return { income, incomeExpectedMonth, expense, expenseExpectedMonth, payable, receivable, serviceReceived, serviceToReceive, receivedAll, toReceiveAll, approvedServicesTotal, overdue, dueSoon, tax, profit: income - expense - tax, open: state.quotes.filter(q => q.status === 'aberto').length, laborPending, laborPaid, laborNext };
}

function render() { renderNav(); renderDashboard(); renderClients(); renderQuotes(); renderContracts(); renderFinance(); renderProducts(); renderProjects(); renderReports(); renderConfig(); }
function renderNav() { document.querySelectorAll('.nav button').forEach(btn => btn.onclick = () => showPage(btn.dataset.page)); }
function showPage(id) {
  document.querySelectorAll('.nav button').forEach(b => b.classList.toggle('active', b.dataset.page === id));
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === id));
  const titles = { dashboard: ['Dashboard', 'Visão geral financeira e contas para não esquecer de pagar.'], orcamentos: ['Orçamentos', 'Propostas, cliente completo, PDF e aprovação.'], contratos: ['Contratos', 'Documentos gerados após aprovação para assinatura do cliente e da Linear.'], financeiro: ['Financeiro', 'Entradas, saídas, compras, água, luz, aluguel e contas recorrentes.'], produtos: ['Produtos/Custos', 'Produtos ligados aos itens do orçamento.'], clientes: ['Clientes', 'Nome, celular, endereço e email do cliente.'], projetos: ['Projetos', 'Obras aprovadas, custos reais, lucro e status.'], relatorios: ['Relatórios', 'Resumo gerencial para decisão.'], config: ['Configurações', 'Empresa, contrato, impostos e sincronização.'] };
  document.getElementById('pageTitle').textContent = titles[id][0];
  document.getElementById('pageSubtitle').textContent = titles[id][1];
}

function renderDashboard() {
  const t = totals();
  document.getElementById('dashboard').innerHTML = `
    <div class="grid cols-4">
      <div class="card metric ok"><span>Já recebido dos serviços</span><strong>${money(t.serviceReceived)}</strong><small>Valores pagos de orçamentos aprovados/concluídos</small></div>
      <div class="card metric warn"><span>A receber dos serviços</span><strong>${money(t.serviceToReceive)}</strong><small>Saldo que os clientes ainda precisam pagar</small></div>
      <div class="card metric bad"><span>Contas a pagar</span><strong>${money(t.payable)}</strong><small>Despesas pendentes</small></div>
      <div class="card metric ${t.profit >= 0 ? 'ok' : 'bad'}"><span>Lucro recebido estimado</span><strong>${money(t.profit)}</strong><small>Recebido no mês - pago no mês - imposto previsto</small></div>
    </div>
    <div class="grid cols-4" style="margin-top:16px">
      <div class="card metric ok"><span>Entradas recebidas no mês</span><strong>${money(t.income)}</strong><small>Somente status pago/recebido</small></div>
      <div class="card metric warn"><span>Entradas previstas no mês</span><strong>${money(t.incomeExpectedMonth)}</strong><small>Recebido + pendente</small></div>
      <div class="card metric bad"><span>Saídas pagas no mês</span><strong>${money(t.expense)}</strong><small>Somente status pago</small></div>
      <div class="card metric warn"><span>Saídas previstas no mês</span><strong>${money(t.expenseExpectedMonth)}</strong><small>Pago + pendente</small></div>
    </div>
    <div class="grid cols-2" style="margin-top:16px">
      <div class="card"><h2>Alertas para não esquecer</h2>${t.overdue.length ? `<div class="notice bad-notice"><b>${t.overdue.length} vencimento(s)</b><br>${t.overdue.map(alertLine).join('<br>')}</div>` : '<p>Nenhuma conta vencida.</p>'}<h3>Próximas parcelas/contas</h3>${t.dueSoon.length ? t.dueSoon.map(x => `<p>${statusBadge(x.status)} <b>${escapeHtml(transactionClientName(x))}</b> — ${escapeHtml(parcelLabel(x))} — <span class="${dueClass(x.dueDate || x.date)}-text">${escapeHtml(dueLabel(x.dueDate || x.date))}</span></p>`).join('') : '<p>Sem contas pendentes cadastradas.</p>'}</div>
      <div class="card"><h2>Resumo operacional</h2><p>Orçamentos em aberto: <b>${t.open}</b></p><p>Orçamentos aprovados: <b>${state.quotes.filter(q => q.status === 'aprovado').length}</b></p><p>Total vendido/aprovado: <b>${money(t.approvedServicesTotal)}</b></p><p>A receber geral: <b>${money(t.toReceiveAll)}</b></p><p>Já recebido geral: <b>${money(t.receivedAll)}</b></p><p>Mão de obra pendente: <b>${money(t.laborPending)}</b></p><p>Imposto previsto: <b>${money(t.tax)}</b></p><p>Alíquota efetiva estimada: <b>${(taxRate() * 100).toFixed(2)}%</b></p></div>
    </div>`;
}

function renderClients() {
  document.getElementById('clientes').innerHTML = `<div class="section-head"><h2>Clientes</h2><button class="primary" onclick="editClient()">Novo cliente</button></div><div class="table-wrap"><table><thead><tr><th>Nome</th><th>Celular</th><th>Email</th><th>Endereço</th><th>Cidade</th><th>Ações</th></tr></thead><tbody>${state.clients.map(c => `<tr><td><b>${escapeHtml(c.name)}</b><br><span class="small">${escapeHtml(c.document || '')}</span></td><td>${escapeHtml(c.phone || '')}</td><td>${escapeHtml(c.email || '')}</td><td>${escapeHtml(c.address || '')}</td><td>${escapeHtml(c.city || '')}</td><td class="actions"><button class="icon" onclick="editClient('${c.id}')">Editar</button><button class="icon" onclick="del('clients','${c.id}')">Excluir</button></td></tr>`).join('')}</tbody></table></div>`;
}
function editClient(id) {
  const c = state.clients.find(x => x.id === id) || { id: uid(), name: '', phone: '', email: '', address: '', city: '', document: '' };
  modal(id ? 'Editar cliente' : 'Novo cliente', `<form><div class="form-grid">${field('name', 'Nome do cliente', 'text', c.name, 'required')}${field('phone', 'Celular / WhatsApp', 'text', c.phone)}${field('email', 'Email', 'email', c.email)}${field('document', 'CPF/CNPJ', 'text', c.document)}${field('city', 'Cidade', 'text', c.city)}${textarea('address', 'Endereço completo', c.address)}</div><button class="primary">Salvar cliente</button></form>`, (d, m) => { Object.assign(c, d); if (!id) state.clients.push(c); m.remove(); save(); });
}

function renderProducts() {
  document.getElementById('produtos').innerHTML = `<div class="section-head"><h2>Produtos e custos</h2><button class="primary" onclick="editProduct()">Novo produto</button></div><div class="table-wrap"><table><thead><tr><th>Produto</th><th>Categoria</th><th>Un.</th><th>Custo</th><th>Venda padrão</th><th>Status</th><th>Ações</th></tr></thead><tbody>${state.products.map(p => `<tr><td><b>${escapeHtml(p.name)}</b></td><td>${escapeHtml(p.category)}</td><td>${escapeHtml(p.unit)}</td><td>${money(p.cost)}</td><td>${p.price ? money(p.price) : '<span class="small">sem preço venda</span>'}</td><td>${statusBadge(p.active ? 'ativo' : 'inativo')}</td><td class="actions"><button class="icon" onclick="editProduct('${p.id}')">Editar</button><button class="icon" onclick="del('products','${p.id}')">Excluir</button></td></tr>`).join('')}</tbody></table></div>`;
}
function editProduct(id) {
  const p = state.products.find(x => x.id === id) || { id: uid(), name: '', category: 'Móveis planejados', unit: 'un', cost: 0, price: 0, active: true };
  modal(id ? 'Editar produto' : 'Novo produto', `<form><div class="form-grid">${field('name', 'Nome', 'text', p.name, 'required')}${field('category', 'Categoria', 'text', p.category)}${field('unit', 'Unidade', 'text', p.unit)}${field('cost', 'Custo interno', 'number', p.cost, 'step="0.01"')}${field('price', 'Preço padrão venda', 'number', p.price, 'step="0.01"')}${select('active', 'Status', [['true', 'Ativo'], ['false', 'Inativo']], String(p.active))}</div><button class="primary">Salvar produto</button></form>`, (d, m) => { Object.assign(p, { name: d.name, category: d.category, unit: d.unit, cost: num(d.cost), price: num(d.price), active: d.active === 'true' }); if (!id) state.products.push(p); m.remove(); save(); });
}

function renderQuotes() {
  document.getElementById('orcamentos').innerHTML = `<div class="section-head"><h2>Orçamentos</h2><button class="primary" onclick="editQuote()">Novo orçamento</button></div><div class="table-wrap"><table><thead><tr><th>Nº / Cliente</th><th>Data</th><th>Status</th><th>Total</th><th>Entrada</th><th>Imposto est.</th><th>Ações</th></tr></thead><tbody>${state.quotes.map(q => { const c = state.clients.find(x => x.id === q.clientId); const ca = calcQuote(q); return `<tr><td><b>${escapeHtml(q.number)}</b><br>${escapeHtml(c?.name || q.clientName || 'Cliente não informado')}<br><span class="small">${escapeHtml(c?.phone || '')}</span></td><td>${escapeHtml(q.date)}</td><td>${statusBadge(q.status)}</td><td>${money(ca.total)}</td><td>${money(ca.entry)}</td><td>${money(ca.tax)}</td><td class="actions"><button class="icon" onclick="editQuote('${q.id}')">Editar</button><button class="icon" onclick="printQuote('${q.id}')">Gerar PDF</button><button class="icon" onclick="sendWhats('${q.id}')">WhatsApp</button><button class="icon" onclick="approveQuote('${q.id}')">Aprovar</button><button class="icon" onclick="ensureContract('${q.id}'); printContractByQuote('${q.id}')">Contrato</button><button class="icon" onclick="del('quotes','${q.id}')">Excluir</button></td></tr>`; }).join('')}</tbody></table></div>`;
}
function quoteForm(q) {
  const selectedClient = state.clients.find(c => c.id === q.clientId) || state.clients[0] || { name: '', phone: '', email: '', address: '', city: '', document: '' };
  return `<form id="quoteForm"><div class="form-grid">${field('number', 'Número', 'text', q.number || ('ORC-' + String(state.quotes.length + 1).padStart(4, '0')))}<div class="field"><label>Cliente cadastrado</label><select name="clientId" id="quoteClientId"><option value="__new">+ Novo cliente</option>${state.clients.map(c => `<option value="${c.id}" ${c.id === q.clientId ? 'selected' : ''}>${escapeHtml(c.name)}</option>`).join('')}</select></div>${field('date', 'Data', 'date', q.date || todayISO())}${select('status', 'Status', [['aberto', 'Aberto'], ['aprovado', 'Aprovado'], ['recusado', 'Recusado'], ['concluido', 'Concluído']], q.status || 'aberto')}${field('clientName', 'Nome do cliente', 'text', selectedClient.name, 'required')}${field('clientPhone', 'Celular / WhatsApp', 'text', selectedClient.phone)}${field('clientEmail', 'Email', 'email', selectedClient.email)}${field('clientDocument', 'CPF/CNPJ', 'text', selectedClient.document)}${field('clientCity', 'Cidade', 'text', selectedClient.city)}${textarea('clientAddress', 'Endereço completo', selectedClient.address)}${field('discount', 'Desconto', 'number', q.discount || 0, 'step="0.01"')}${select('discountType', 'Tipo desconto', [['money', 'R$'], ['percent', '%']], q.discountType || 'money')}${field('entryPercent', 'Entrada %', 'number', q.entryPercent ?? state.fiscal.entryPercent, 'step="0.01"')}${field('installments', 'Parcelas', 'number', q.installments || 1)}</div><h3>Itens ligados aos produtos</h3><div class="notice">Escolha um produto cadastrado. O sistema puxa custo e preço padrão, mas você pode ajustar quantidade, preço e custo dentro deste orçamento.</div><div id="quoteItems"></div><button type="button" class="secondary" id="addItemBtn">Adicionar item</button><hr><button class="primary">Salvar orçamento</button></form>`;
}
function editQuote(id) {
  const q = state.quotes.find(x => x.id === id) || { id: uid(), items: [], discount: 0, discountType: 'money', entryPercent: state.fiscal.entryPercent, installments: 1, status: 'aberto', date: todayISO() };
  const back = modal(id ? 'Editar orçamento' : 'Novo orçamento', quoteForm(q), (d, m) => {
    let clientId = d.clientId;
    let client = state.clients.find(c => c.id === clientId);
    if (!client || clientId === '__new') { client = { id: uid(), name: '', phone: '', email: '', address: '', city: '', document: '' }; state.clients.push(client); }
    Object.assign(client, { name: d.clientName, phone: d.clientPhone, email: d.clientEmail, document: d.clientDocument, city: d.clientCity, address: d.clientAddress });
    q.clientId = client.id; q.clientName = client.name; q.number = d.number; q.date = d.date; q.status = d.status; q.discount = num(d.discount); q.discountType = d.discountType; q.entryPercent = num(d.entryPercent); q.installments = num(d.installments) || 1;
    q.items = [...m.querySelectorAll('.item-row')].map(row => { const pid = row.querySelector('[name=productId]').value; const p = state.products.find(x => x.id === pid) || {}; return { productId: pid, name: p.name || 'Item manual', qty: num(row.querySelector('[name=qty]').value), price: num(row.querySelector('[name=price]').value), cost: num(row.querySelector('[name=cost]').value) }; }).filter(i => i.qty > 0);
    if (!id) state.quotes.push(q); m.remove(); save();
  });
  initQuoteItems(back, q);
  initQuoteClientFields(back);
}
function initQuoteClientFields(back) {
  const sel = back.querySelector('#quoteClientId');
  sel.onchange = () => {
    if (sel.value === '__new') { ['clientName', 'clientPhone', 'clientEmail', 'clientDocument', 'clientCity', 'clientAddress'].forEach(n => back.querySelector(`[name=${n}]`).value = ''); return; }
    const c = state.clients.find(x => x.id === sel.value); if (!c) return;
    back.querySelector('[name=clientName]').value = c.name || '';
    back.querySelector('[name=clientPhone]').value = c.phone || '';
    back.querySelector('[name=clientEmail]').value = c.email || '';
    back.querySelector('[name=clientDocument]').value = c.document || '';
    back.querySelector('[name=clientCity]').value = c.city || '';
    back.querySelector('[name=clientAddress]').value = c.address || '';
  };
}
function initQuoteItems(back, q) {
  const box = back.querySelector('#quoteItems');
  const add = (item = {}) => {
    const products = state.products.filter(p => p.active);
    const selected = item.productId || products[0]?.id || '';
    const p = state.products.find(x => x.id === selected) || {};
    const div = document.createElement('div'); div.className = 'item-row form-grid item-card';
    div.innerHTML = `<div class="field"><label>Produto</label><select name="productId">${products.map(pp => `<option value="${pp.id}" ${pp.id === selected ? 'selected' : ''}>${escapeHtml(pp.name)}</option>`).join('')}</select></div>${field('qty', 'Qtd', 'number', item.qty || 1, 'step="0.01"')}${field('price', 'Preço venda', 'number', item.price ?? p.price ?? 0, 'step="0.01"')}${field('cost', 'Custo interno', 'number', item.cost ?? p.cost ?? 0, 'step="0.01"')}<button type="button" class="danger remove-item">Remover item</button>`;
    div.querySelector('[name=productId]').onchange = e => { const pp = state.products.find(x => x.id === e.target.value) || {}; div.querySelector('[name=price]').value = pp.price || 0; div.querySelector('[name=cost]').value = pp.cost || 0; };
    div.querySelector('.remove-item').onclick = () => div.remove();
    box.appendChild(div);
  };
  (q.items?.length ? q.items : [{}]).forEach(add);
  back.querySelector('#addItemBtn').onclick = () => add({});
}
function addDaysISO(dateISO, days) {
  const d = new Date(dateISO + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
function ensureQuoteReceivables(q) {
  const ca = calcQuote(q);
  const c = state.clients.find(x => x.id === q.clientId) || {};
  const existing = state.transactions.filter(t => t.source === q.id && t.type === 'entrada');
  if (existing.length) return;
  const entry = Math.min(ca.total, ca.entry);
  if (entry > 0) {
    state.transactions.push({ id: uid(), date: todayISO(), dueDate: todayISO(), type: 'entrada', category: 'Sinal de orçamento', description: `Entrada ${q.number} - ${c.name || ''}`, amount: entry, status: 'pendente', source: q.id, quoteId: q.id, clientId: q.clientId, clientName: c.name || '', parcelLabel: 'Entrada/Sinal' });
  }
  const remaining = Math.max(0, ca.total - entry);
  const parcels = Math.max(1, Math.floor(num(q.installments) || 1));
  if (remaining > 0) {
    const each = remaining / parcels;
    for (let i = 1; i <= parcels; i++) {
      state.transactions.push({ id: uid(), date: todayISO(), dueDate: addDaysISO(todayISO(), 30 * i), type: 'entrada', category: parcels === 1 ? 'Saldo de orçamento' : `Parcela ${i}/${parcels}`, description: `${parcels === 1 ? 'Saldo restante' : `Parcela ${i}/${parcels}`} ${q.number} - ${c.name || ''}`, amount: each, status: 'pendente', source: q.id, quoteId: q.id, clientId: q.clientId, clientName: c.name || '', parcelLabel: parcels === 1 ? 'Saldo restante' : `Parcela ${i}/${parcels}` });
    }
  }
}
function approveQuote(id) {
  const q = state.quotes.find(x => x.id === id); if (!q) return;
  const ca = calcQuote(q); const c = state.clients.find(x => x.id === q.clientId) || {};
  q.status = 'aprovado';
  ensureQuoteReceivables(q);
  if (!state.projects.some(p => p.quoteId === q.id)) {
    state.projects.push({ id: uid(), name: `Projeto ${q.number} - ${c.name || ''}`, clientId: q.clientId, quoteId: q.id, status: 'planejamento', costReal: ca.cost, start: todayISO(), deadline: '' });
  }
  ensureContract(id, false);
  save(); alert('Orçamento aprovado. Foram criadas as contas a receber, um projeto e um contrato para assinatura.');
}


function contractNumber() { return 'LIN-' + new Date().getFullYear() + '-' + String((state.contracts?.length || 0) + 1).padStart(4, '0'); }
function ensureContract(quoteId, doSave = true) {
  state.contracts = state.contracts || [];
  let ct = state.contracts.find(c => c.quoteId === quoteId);
  if (ct) return ct;
  const q = state.quotes.find(x => x.id === quoteId); if (!q) return null;
  ct = { id: uid(), number: contractNumber(), quoteId, date: todayISO(), status: 'pendente_assinatura', clientSignature: '', companySignature: '', notes: '' };
  state.contracts.push(ct);
  if (doSave) save();
  return ct;
}
function renderContracts() {
  const rows = (state.contracts || []).map(ct => {
    const q = state.quotes.find(x => x.id === ct.quoteId) || {};
    const c = state.clients.find(x => x.id === q.clientId) || {};
    const ca = q.id ? calcQuote(q) : { total: 0 };
    return `<tr><td><b>${escapeHtml(ct.number)}</b><br><span class="small">Orçamento: ${escapeHtml(q.number || '')}</span></td><td>${escapeHtml(ct.date)}</td><td>${escapeHtml(c.name || q.clientName || '')}<br><span class="small">${escapeHtml(c.phone || '')}</span></td><td>${money(ca.total)}</td><td>${statusBadge(ct.status)}</td><td class="actions"><button class="icon" onclick="editContract('${ct.id}')">Editar</button><button class="icon" onclick="signatureModal('${ct.id}','client')">Assinar cliente</button><button class="icon" onclick="signatureModal('${ct.id}','company')">Assinar Linear</button><button class="icon" onclick="printContract('${ct.id}')">PDF contrato</button><button class="icon" onclick="del('contracts','${ct.id}')">Excluir</button></td></tr>`;
  }).join('');
  document.getElementById('contratos').innerHTML = `<div class="section-head"><h2>Contratos de prestação de serviços</h2><div class="toolbar"><button class="secondary" onclick="generateContractsForApproved()">Gerar dos aprovados</button></div></div><div class="notice">Quando um orçamento é aprovado, o sistema gera um contrato para assinatura do cliente e da LINEAR MOVEIS PLANEJADOS LTDA.</div><div class="table-wrap" style="margin-top:16px"><table><thead><tr><th>Nº contrato</th><th>Data</th><th>Cliente</th><th>Valor</th><th>Status</th><th>Ações</th></tr></thead><tbody>${rows || '<tr><td colspan="6">Nenhum contrato gerado ainda. Aprove um orçamento ou clique em gerar dos aprovados.</td></tr>'}</tbody></table></div>`;
}
function generateContractsForApproved() { state.quotes.filter(q => q.status === 'aprovado' || q.status === 'concluido').forEach(q => ensureContract(q.id, false)); save(); alert('Contratos gerados para os orçamentos aprovados.'); }
function editContract(id) {
  const ct = state.contracts.find(x => x.id === id); if (!ct) return;
  modal('Editar contrato', `<form><div class="form-grid">${field('number','Número do contrato','text',ct.number)}${field('date','Data','date',ct.date)}${select('status','Status',[['pendente_assinatura','Pendente assinatura'],['assinado','Assinado'],['cancelado','Cancelado']],ct.status)}${textarea('notes','Observações internas',ct.notes || '')}</div><button class="primary">Salvar contrato</button></form>`, (d,m)=>{ ct.number=d.number; ct.date=d.date; ct.status=d.status; ct.notes=d.notes; m.remove(); save(); });
}
function signatureModal(id, who) {
  const ct = state.contracts.find(x => x.id === id); if (!ct) return;
  const label = who === 'client' ? 'Assinatura do cliente' : 'Assinatura da Linear';
  const back = modal(label, `<div class="notice">Assine no quadro abaixo usando o mouse ou o dedo no celular.</div><canvas id="signaturePad" width="760" height="220" class="signature-pad"></canvas><div class="toolbar"><button type="button" class="secondary" id="clearSig">Limpar</button><button type="button" class="primary" id="saveSig">Salvar assinatura</button></div>`, null);
  const canvas = back.querySelector('#signaturePad'); const ctx = canvas.getContext('2d'); let drawing = false;
  ctx.fillStyle = '#fff'; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.strokeStyle = '#111'; ctx.lineWidth = 2; ctx.lineCap = 'round';
  const existing = who === 'client' ? ct.clientSignature : ct.companySignature;
  if (existing) { const img = new Image(); img.onload = ()=>ctx.drawImage(img,0,0,canvas.width,canvas.height); img.src = existing; }
  function pos(e){ const r=canvas.getBoundingClientRect(); const t=e.touches?.[0] || e; return {x:(t.clientX-r.left)*(canvas.width/r.width), y:(t.clientY-r.top)*(canvas.height/r.height)}; }
  function start(e){ e.preventDefault(); drawing=true; const p=pos(e); ctx.beginPath(); ctx.moveTo(p.x,p.y); }
  function move(e){ if(!drawing) return; e.preventDefault(); const p=pos(e); ctx.lineTo(p.x,p.y); ctx.stroke(); }
  function end(){ drawing=false; }
  canvas.addEventListener('mousedown', start); canvas.addEventListener('mousemove', move); window.addEventListener('mouseup', end);
  canvas.addEventListener('touchstart', start, {passive:false}); canvas.addEventListener('touchmove', move, {passive:false}); canvas.addEventListener('touchend', end);
  back.querySelector('#clearSig').onclick=()=>{ ctx.fillStyle='#fff'; ctx.fillRect(0,0,canvas.width,canvas.height); };
  back.querySelector('#saveSig').onclick=()=>{ if(who==='client') ct.clientSignature=canvas.toDataURL('image/png'); else ct.companySignature=canvas.toDataURL('image/png'); if(ct.clientSignature && ct.companySignature) ct.status='assinado'; back.remove(); save(); };
}
function contractPrintHtml(ct) {
  const q = state.quotes.find(x => x.id === ct.quoteId) || {}; const c = state.clients.find(x => x.id === q.clientId) || {}; const ca = q.id ? calcQuote(q) : { subtotal:0, discount:0, total:0, entry:0, tax:0 };
  const delivery = state.fiscal.deliveryDays || 30; const entryPct = q.entryPercent ?? state.fiscal.entryPercent;
  return `<div class="print-page"><div class="print-header"><img class="print-logo" src="${escapeHtml(state.company.logo || 'assets/logo-linear.jpeg')}" alt="Logo Linear"><div class="print-company"><h1>Contrato de Prestação de Serviços</h1><p><b>Contrato ${escapeHtml(ct.number)}</b><br><b>${escapeHtml(state.company.name)}</b><br>CNPJ: ${escapeHtml(state.company.cnpj)}<br>${escapeHtml(state.company.address)}<br>${escapeHtml(state.company.phone)}</p></div></div><div class="print-line"></div><h2>1. Partes</h2><p><b>CONTRATADA:</b> ${escapeHtml(state.company.name)}, CNPJ ${escapeHtml(state.company.cnpj)}, com endereço em ${escapeHtml(state.company.address)}.</p><p><b>CONTRATANTE:</b> ${escapeHtml(c.name || '')}, CPF/CNPJ ${escapeHtml(c.document || '')}, telefone ${escapeHtml(c.phone || '')}, email ${escapeHtml(c.email || '')}, endereço ${escapeHtml(c.address || '')} ${escapeHtml(c.city || '')}.</p><h2>2. Objeto do contrato</h2><p>Prestação de serviços para fabricação, fornecimento e/ou instalação de móveis planejados conforme orçamento ${escapeHtml(q.number || '')} aprovado em ${escapeHtml(q.date || '')}.</p><h2>3. Itens contratados</h2><table><thead><tr><th>Item</th><th>Qtd</th><th>Valor unit.</th><th>Total</th></tr></thead><tbody>${(q.items || []).map(i => `<tr><td>${escapeHtml(i.name)}</td><td>${i.qty}</td><td>${money(i.price)}</td><td>${money(num(i.qty)*num(i.price))}</td></tr>`).join('')}</tbody></table><p><b>Subtotal:</b> ${money(ca.subtotal)}<br><b>Desconto:</b> ${money(ca.discount)}<br><b>Valor total contratado:</b> ${money(ca.total)}<br><b>Entrada (${entryPct}%):</b> ${money(ca.entry)}<br><b>Parcelas:</b> ${escapeHtml(q.installments || 1)}<br><b>Prazo estimado:</b> até ${delivery} dias úteis após assinatura, aprovação e pagamento do sinal.</p><h2>4. Condições contratuais</h2><p>${escapeHtml(state.pdf.serviceContract || '').replace(/\n/g,'<br>')}</p>${ct.notes ? `<h2>5. Observações</h2><p>${escapeHtml(ct.notes).replace(/\n/g,'<br>')}</p>` : ''}<div class="signatures-grid"><div class="signature-box"><p><b>CONTRATANTE</b><br>${escapeHtml(c.name || '')}<br>CPF/CNPJ: ${escapeHtml(c.document || '')}</p>${ct.clientSignature ? `<img src="${ct.clientSignature}" class="signature-img">` : '<div class="signature-line"></div>'}<p>Assinatura do cliente</p></div><div class="signature-box"><p><b>CONTRATADA</b><br>${escapeHtml(state.company.name)}<br>CNPJ: ${escapeHtml(state.company.cnpj)}</p>${ct.companySignature ? `<img src="${ct.companySignature}" class="signature-img">` : '<div class="signature-line"></div>'}<p>Assinatura da Linear</p></div></div><p class="small">Araraquara/SP, ${new Date(ct.date || todayISO()).toLocaleDateString('pt-BR', {timeZone:'UTC'})}.</p></div>`;
}
function printContract(id) { const ct = state.contracts.find(x => x.id === id); if(!ct) return; const area=document.createElement('div'); area.className='print-area'; area.innerHTML=contractPrintHtml(ct); document.body.appendChild(area); window.print(); setTimeout(()=>area.remove(),800); }
function printContractByQuote(quoteId) { const ct = ensureContract(quoteId); if (ct) printContract(ct.id); }

function renderFinance() {
  const list = [...state.transactions].sort((a, b) => String(a.dueDate || a.date).localeCompare(String(b.dueDate || b.date)));
  const t = totals();
  const clientRows = clientFinanceSummary();
  const totalClients = clientRows.length;
  document.getElementById('financeiro').innerHTML = `<div class="section-head"><h2>Financeiro por cliente</h2><div class="toolbar"><button class="secondary" onclick="generateMonthlyBills()">Gerar contas do mês</button><button class="secondary" onclick="editTemplate()">Conta fixa</button><button class="primary" onclick="editTransaction()">Novo lançamento</button></div></div>
  <div class="grid cols-4"><div class="card metric ok"><span>Já recebido dos serviços</span><strong>${money(t.serviceReceived)}</strong></div><div class="card metric warn"><span>A receber dos serviços</span><strong>${money(t.serviceToReceive)}</strong></div><div class="card metric ok"><span>Clientes com serviço</span><strong>${totalClients}</strong></div><div class="card metric bad"><span>Contas a pagar</span><strong>${money(t.payable)}</strong></div></div>
  <div class="notice" style="margin-top:16px">Agora o financeiro aparece agrupado por cliente. Clique no card do cliente para ver orçamento, contrato, parcelas, recebido, pendente e histórico completo.</div>
  <div class="section-head"><h2>Recebimentos por cliente</h2></div>
  <div class="client-finance-grid">${clientRows.map(row => {
    const c = row.client;
    const next = row.transactions.filter(x => x.status !== 'pago' && x.status !== 'cancelado').sort((a,b)=>String(a.dueDate||a.date).localeCompare(String(b.dueDate||b.date)))[0];
    return `<button class="client-finance-card" onclick="openClientFinance('${escapeHtml(c.id)}')"><span class="client-name">${escapeHtml(c.name || 'Sem cliente')}</span><span class="small">${escapeHtml(c.phone || c.email || '')}</span><div class="client-values"><b class="ok-text">Recebido: ${money(row.received)}</b><b class="warn-text">A receber: ${money(row.pending)}</b></div>${row.overdue ? `<span class="badge bad">Vencido: ${money(row.overdue)}</span>` : `<span class="badge ok">Em dia</span>`}${next ? `<span class="small">Próxima: ${escapeHtml(parcelLabel(next))} • ${escapeHtml(next.dueDate || next.date)}</span>` : `<span class="small">Sem parcela pendente</span>`}</button>`;
  }).join('') || '<div class="card"><p>Nenhum cliente com orçamento aprovado ou recebimento cadastrado.</p></div>'}</div>
  <div class="section-head"><h2>Operação diária</h2><div class="toolbar"><button class="primary" onclick="editLabor()">Nova mão de obra</button></div></div>
  <div class="grid cols-3"><div class="card"><h3>👷 Mão de obra a pagar</h3><p><b>Total pendente:</b> ${money(t.laborPending)}</p><p><b>Total já pago:</b> ${money(t.laborPaid)}</p>${t.laborNext.length ? t.laborNext.map(l => `<div class="mini-row"><b>${escapeHtml(l.worker)}</b><span>${money(l.amount)}</span><small>${escapeHtml(l.clientName || '')} • <span class="${dueClass(l.dueDate)}-text">${escapeHtml(dueLabel(l.dueDate))}</span></small><button class="icon" onclick="markLaborPaid('${l.id}')">Pagar</button></div>`).join('') : '<p>Sem mão de obra pendente.</p>'}</div><div class="card"><h3>⏰ Próximos vencimentos</h3>${[...t.overdue, ...t.dueSoon].slice(0,8).map(x => `<p><span class="badge ${dueClass(x.dueDate || x.date)}">${escapeHtml(dueLabel(x.dueDate || x.date))}</span><br><b>${escapeHtml(x.description || x.category)}</b><br><span class="small">${money(x.amount)} • ${escapeHtml(x.dueDate || x.date)}</span></p>`).join('') || '<p>Sem vencimentos pendentes.</p>'}</div><div class="card"><h3>Resumo geral</h3><p>Já recebido geral: <b>${money(t.receivedAll)}</b></p><p>A receber geral: <b>${money(t.toReceiveAll)}</b></p><p>Contas a pagar: <b>${money(t.payable)}</b></p><p>Mão de obra pendente: <b>${money(t.laborPending)}</b></p></div></div>
  <div class="section-head"><h2>Mão de obra</h2><button class="primary" onclick="editLabor()">Adicionar mão de obra</button></div><div class="table-wrap"><table><thead><tr><th>Vencimento</th><th>Para quem</th><th>Cliente/Projeto</th><th>Descrição</th><th>Valor</th><th>Status</th><th>Ações</th></tr></thead><tbody>${(state.labor || []).map(l => `<tr><td><b>${escapeHtml(l.dueDate)}</b><br><span class="small ${dueClass(l.dueDate)}-text">${escapeHtml(dueLabel(l.dueDate))}</span></td><td>${escapeHtml(l.worker)}</td><td>${escapeHtml(l.clientName || '')}<br><span class="small">${escapeHtml(l.project || '')}</span></td><td>${escapeHtml(l.description || '')}</td><td>${money(l.amount)}</td><td>${statusBadge(l.status || 'pendente')}</td><td class="actions"><button class="icon" onclick="markLaborPaid('${l.id}')">Pagar</button><button class="icon" onclick="editLabor('${l.id}')">Editar</button><button class="icon" onclick="del('labor','${l.id}')">Excluir</button></td></tr>`).join('') || '<tr><td colspan="7">Nenhuma mão de obra cadastrada.</td></tr>'}</tbody></table></div>
  <div class="section-head"><h2>Contas fixas/editáveis</h2></div><div class="table-wrap"><table><thead><tr><th>Nome</th><th>Categoria</th><th>Valor padrão</th><th>Dia venc.</th><th>Status</th><th>Ações</th></tr></thead><tbody>${state.finance.templates.map(t => `<tr><td><b>${escapeHtml(t.name)}</b></td><td>${escapeHtml(t.category)}</td><td>${money(t.amount)}</td><td>${t.day}</td><td>${statusBadge(t.active ? 'ativo' : 'inativo')}</td><td class="actions"><button class="icon" onclick="editTemplate('${t.id}')">Editar</button><button class="icon" onclick="delTemplate('${t.id}')">Excluir</button></td></tr>`).join('')}</tbody></table></div>
  <details class="card" style="margin-top:16px"><summary><b>Ver todos os lançamentos brutos</b></summary><div class="table-wrap" style="margin-top:12px"><table><thead><tr><th>Vencimento</th><th>Data</th><th>Tipo</th><th>Categoria</th><th>Descrição</th><th>Valor</th><th>Status</th><th>Ações</th></tr></thead><tbody>${list.map(t => `<tr><td><b>${escapeHtml(t.dueDate || t.date)}</b></td><td>${escapeHtml(t.date || '')}</td><td>${statusBadge(t.type)}</td><td>${escapeHtml(t.category)}</td><td>${escapeHtml(t.description)}</td><td>${money(t.amount)}</td><td>${statusBadge(t.status || 'pendente')}</td><td class="actions"><button class="icon" onclick="markPaid('${t.id}')">Pagar/Receber</button><button class="icon" onclick="editTransaction('${t.id}')">Editar</button><button class="icon" onclick="del('transactions','${t.id}')">Excluir</button></td></tr>`).join('')}</tbody></table></div></details>`;
}
function openClientFinance(clientId) {
  const rows = clientFinanceSummary();
  const row = rows.find(r => r.client.id === clientId) || rows.find(r => r.client.id === 'sem_cliente');
  if (!row) return;
  const c = row.client;
  const quotes = state.quotes.filter(q => q.clientId === clientId);
  const contracts = state.contracts.filter(ct => quotes.some(q => q.id === ct.quoteId));
  const transactions = row.transactions.sort((a,b)=>String(a.dueDate||a.date).localeCompare(String(b.dueDate||b.date)));
  modal(`Financeiro - ${c.name || 'Sem cliente'}`, `<div class="grid cols-3"><div class="card metric ok"><span>Já recebido</span><strong>${money(row.received)}</strong></div><div class="card metric warn"><span>A receber</span><strong>${money(row.pending)}</strong></div><div class="card metric bad"><span>Vencido</span><strong>${money(row.overdue)}</strong></div></div>
  <div class="card" style="margin-top:14px"><h3>Dados do cliente</h3><p><b>Nome:</b> ${escapeHtml(c.name || '')}<br><b>Celular:</b> ${escapeHtml(c.phone || '')}<br><b>Email:</b> ${escapeHtml(c.email || '')}<br><b>CPF/CNPJ:</b> ${escapeHtml(c.document || '')}<br><b>Endereço:</b> ${escapeHtml(c.address || '')} ${escapeHtml(c.city || '')}</p><button class="secondary" onclick="document.querySelector('.modal-backdrop').remove(); editClient('${escapeHtml(c.id)}')">Editar cliente</button></div>
  <div class="section-head"><h2>Parcelas e recebimentos</h2></div><div class="table-wrap"><table><thead><tr><th>Vencimento</th><th>Parcela</th><th>Orçamento</th><th>Valor</th><th>Status</th><th>Ação</th></tr></thead><tbody>${transactions.map(t => { const q=getQuoteByTransaction(t); return `<tr><td><b>${escapeHtml(t.dueDate || t.date)}</b></td><td>${escapeHtml(parcelLabel(t))}</td><td>${escapeHtml(q?.number || '')}</td><td>${money(t.amount)}</td><td>${statusBadge(t.status || 'pendente')}</td><td class="actions"><button class="icon" onclick="markPaid('${t.id}')">Marcar recebido</button><button class="icon" onclick="editTransaction('${t.id}')">Editar</button></td></tr>`; }).join('') || '<tr><td colspan="6">Nenhum recebimento lançado.</td></tr>'}</tbody></table></div>
  <div class="section-head"><h2>Orçamentos e contratos</h2></div><div class="table-wrap"><table><thead><tr><th>Orçamento</th><th>Status</th><th>Total</th><th>Contrato</th><th>Ações</th></tr></thead><tbody>${quotes.map(q => { const ct=contracts.find(x=>x.quoteId===q.id); return `<tr><td><b>${escapeHtml(q.number)}</b><br>${escapeHtml(q.date || '')}</td><td>${statusBadge(q.status)}</td><td>${money(calcQuote(q).total)}</td><td>${ct ? `${escapeHtml(ct.number)}<br>${statusBadge(ct.status)}` : 'Sem contrato'}</td><td class="actions"><button class="icon" onclick="printQuote('${q.id}')">PDF orçamento</button>${ct ? `<button class="icon" onclick="printContract('${ct.id}')">PDF contrato</button>` : ''}</td></tr>`; }).join('') || '<tr><td colspan="5">Nenhum orçamento para este cliente.</td></tr>'}</tbody></table></div>`, null);
}
function editTransaction(id) {
  const t = state.transactions.find(x => x.id === id) || { id: uid(), date: todayISO(), dueDate: todayISO(), type: 'saida', category: 'Compra de MDF', description: '', amount: 0, status: 'pendente' };
  modal(id ? 'Editar lançamento' : 'Novo lançamento', `<form><div class="form-grid">${field('dueDate', 'Vencimento', 'date', t.dueDate || t.date)}${field('date', 'Data do lançamento', 'date', t.date || todayISO())}${select('type', 'Tipo', [['entrada', 'Entrada/recebimento'], ['saida', 'Saída/pagamento']], t.type)}<div class="field"><label>Categoria</label><select name="category">${catOptions(t.category)}</select></div>${field('amount', 'Valor', 'number', t.amount, 'step="0.01"')}${select('status', 'Status', [['pendente', 'Pendente'], ['pago', 'Pago/recebido'], ['cancelado', 'Cancelado']], t.status || 'pendente')}${field('description', 'Descrição', 'text', t.description)}</div><button class="primary">Salvar lançamento</button></form>`, (d, m) => { Object.assign(t, { dueDate: d.dueDate, date: d.date, type: d.type, category: d.category, amount: num(d.amount), status: d.status, description: d.description }); if (!id) state.transactions.push(t); m.remove(); save(); });
}
function markPaid(id) { const t = state.transactions.find(x => x.id === id); if (!t) return; t.status = 'pago'; t.date = todayISO(); save(); }
function editLabor(id) {
  const l = (state.labor || []).find(x => x.id === id) || { id: uid(), worker: '', clientName: '', project: '', description: '', amount: 0, dueDate: todayISO(), status: 'pendente' };
  modal(id ? 'Editar mão de obra' : 'Nova mão de obra', `<form><div class="form-grid">${field('worker', 'Para quem vamos pagar', 'text', l.worker, 'required')}${field('clientName', 'Cliente relacionado', 'text', l.clientName)}${field('project', 'Projeto/serviço', 'text', l.project)}${field('dueDate', 'Data de vencimento', 'date', l.dueDate)}${field('amount', 'Valor a pagar', 'number', l.amount, 'step="0.01"')}${select('status', 'Status', [['pendente','Pendente'],['pago','Pago'],['cancelado','Cancelado']], l.status || 'pendente')}${field('description', 'Descrição', 'text', l.description)}</div><button class="primary">Salvar mão de obra</button></form>`, (d, m) => { Object.assign(l, { worker: d.worker, clientName: d.clientName, project: d.project, dueDate: d.dueDate, amount: num(d.amount), status: d.status, description: d.description }); if (!id) { state.labor = state.labor || []; state.labor.push(l); } m.remove(); save(); });
}
function markLaborPaid(id) { const l = (state.labor || []).find(x => x.id === id); if (!l) return; l.status = 'pago'; l.paidAt = todayISO(); save(); }
function editTemplate(id) {
  const t = state.finance.templates.find(x => x.id === id) || { id: uid(), name: '', category: 'Outros', amount: 0, day: 10, active: true };
  modal(id ? 'Editar conta fixa' : 'Nova conta fixa', `<form><div class="form-grid">${field('name', 'Nome da conta', 'text', t.name || '', 'required')}<div class="field"><label>Categoria</label><select name="category">${catOptions(t.category)}</select></div>${field('amount', 'Valor padrão', 'number', t.amount || 0, 'step="0.01"')}${field('day', 'Dia de vencimento', 'number', t.day || 10, 'min="1" max="31"')}${select('active', 'Status', [['true', 'Ativo'], ['false', 'Inativo']], String(t.active))}</div><button class="primary">Salvar conta fixa</button></form>`, (d, m) => { Object.assign(t, { name: d.name, category: d.category, amount: num(d.amount), day: Math.min(31, Math.max(1, parseInt(d.day || 1))), active: d.active === 'true' }); if (!id) state.finance.templates.push(t); m.remove(); save(); });
}
function delTemplate(id) { if (confirm('Excluir conta fixa?')) { state.finance.templates = state.finance.templates.filter(x => x.id !== id); save(); } }
function generateMonthlyBills() {
  const ym = currentMonth();
  let count = 0;
  state.finance.templates.filter(t => t.active).forEach(t => {
    const due = `${ym}-${String(t.day).padStart(2, '0')}`;
    const exists = state.transactions.some(x => x.templateId === t.id && String(x.dueDate || '').startsWith(ym));
    if (!exists) { state.transactions.push({ id: uid(), templateId: t.id, date: todayISO(), dueDate: due, type: 'saida', category: t.category, description: t.name, amount: num(t.amount), status: 'pendente' }); count++; }
  });
  save(); alert(`${count} conta(s) fixa(s) gerada(s) para este mês.`);
}

function renderProjects() { document.getElementById('projetos').innerHTML = `<div class="section-head"><h2>Projetos/Obras</h2><button class="primary" onclick="editProject()">Novo projeto</button></div><div class="table-wrap"><table><thead><tr><th>Projeto</th><th>Cliente</th><th>Status</th><th>Valor venda</th><th>Custo real</th><th>Lucro real</th><th>Ações</th></tr></thead><tbody>${state.projects.map(p => { const q = state.quotes.find(x => x.id === p.quoteId); const c = state.clients.find(x => x.id === p.clientId); const total = q ? calcQuote(q).total : 0; return `<tr><td><b>${escapeHtml(p.name)}</b></td><td>${escapeHtml(c?.name || '')}</td><td>${statusBadge(p.status)}</td><td>${money(total)}</td><td>${money(p.costReal)}</td><td>${money(total - num(p.costReal))}</td><td class="actions"><button class="icon" onclick="editProject('${p.id}')">Editar</button><button class="icon" onclick="del('projects','${p.id}')">Excluir</button></td></tr>`; }).join('')}</tbody></table></div>`; }
function editProject(id) { const p = state.projects.find(x => x.id === id) || { id: uid(), name: '', clientId: state.clients[0]?.id || '', quoteId: '', status: 'planejamento', costReal: 0, start: todayISO(), deadline: '' }; modal(id ? 'Editar projeto' : 'Novo projeto', `<form><div class="form-grid">${field('name', 'Nome', 'text', p.name, 'required')}<div class="field"><label>Cliente</label><select name="clientId">${state.clients.map(c => `<option value="${c.id}" ${c.id === p.clientId ? 'selected' : ''}>${escapeHtml(c.name)}</option>`).join('')}</select></div><div class="field"><label>Orçamento vinculado</label><select name="quoteId"><option value="">Sem vínculo</option>${state.quotes.map(q => `<option value="${q.id}" ${q.id === p.quoteId ? 'selected' : ''}>${escapeHtml(q.number)}</option>`).join('')}</select></div>${select('status', 'Status', [['planejamento', 'Planejamento'], ['producao', 'Produção'], ['instalacao', 'Instalação'], ['concluido', 'Concluído']], p.status)}${field('costReal', 'Custo real', 'number', p.costReal, 'step="0.01"')}${field('start', 'Início', 'date', p.start)}${field('deadline', 'Prazo', 'date', p.deadline)}</div><button class="primary">Salvar projeto</button></form>`, (d, m) => { Object.assign(p, { ...d, costReal: num(d.costReal) }); if (!id) state.projects.push(p); m.remove(); save(); }); }

function renderReports() {
  const cats = {}; state.transactions.forEach(t => { const key = `${t.type} - ${t.category}`; cats[key] = (cats[key] || 0) + num(t.amount); });
  document.getElementById('relatorios').innerHTML = `<div class="grid cols-2"><div class="card"><h2>Impostos</h2><p>Alíquota efetiva configurada/estimada: <b>${(taxRate() * 100).toFixed(2)}%</b></p><p>Imposto estimado sobre orçamentos aprovados: <b>${money(totals().tax)}</b></p><p>A receber dos serviços: <b>${money(totals().serviceToReceive)}</b></p><p>Já recebido dos serviços: <b>${money(totals().serviceReceived)}</b></p><div class="notice">Previsão gerencial. O DAS oficial deve ser confirmado com o contador.</div></div><div class="card"><h2>Resumo por categoria</h2>${Object.entries(cats).map(([k, v]) => `<p>${escapeHtml(k)}: <b>${money(v)}</b></p>`).join('') || '<p>Sem lançamentos.</p>'}</div></div>`;
}
function renderConfig() {
  document.getElementById('config').innerHTML = `<form id="configForm" class="grid cols-2"><div class="card"><h2>Dados da empresa</h2>${field('name', 'Razão social', 'text', state.company.name)}${field('cnpj', 'CNPJ', 'text', state.company.cnpj)}${field('phone', 'Telefone', 'text', state.company.phone)}${field('whatsapp', 'WhatsApp com DDI', 'text', state.company.whatsapp)}${textarea('address', 'Endereço', state.company.address)}</div><div class="card"><h2>Fiscal / Impostos</h2>${select('activity', 'Atividade principal', [['comercio', 'Comércio - Simples Anexo I'], ['industria', 'Indústria - Simples Anexo II'], ['servico', 'Serviços - Simples Anexo III']], state.fiscal.activity)}${field('rbt12', 'Receita bruta últimos 12 meses', 'number', state.fiscal.rbt12, 'step="0.01"')}${select('useCustom', 'Usar alíquota manual?', [['false', 'Não, calcular por RBT12'], ['true', 'Sim, usar alíquota abaixo']], String(state.fiscal.useCustom))}${field('customRate', 'Alíquota manual %', 'number', state.fiscal.customRate, 'step="0.01"')}${field('entryPercent', 'Entrada padrão %', 'number', state.fiscal.entryPercent, 'step="0.01"')}${field('deliveryDays', 'Prazo entrega dias úteis', 'number', state.fiscal.deliveryDays)}${field('quoteValidityDays', 'Validade orçamento dias', 'number', state.fiscal.quoteValidityDays)}</div><div class="card"><h2>Texto do PDF</h2>${textarea('intro', 'Relatório inicial', state.pdf.intro)}${textarea('contract', 'Condições de contrato do orçamento', state.pdf.contract)}${textarea('serviceContract', 'Contrato de prestação de serviços pós-aprovação', state.pdf.serviceContract)}${field('footer', 'Assinatura/Rodapé', 'text', state.pdf.footer)}</div><div class="card"><h2>Supabase seguro</h2><p class="small">Crie um projeto Supabase, rode o schema.sql e cole a URL e Anon Key aqui.</p>${field('url', 'Supabase URL', 'url', state.supabase.url)}${field('anonKey', 'Supabase Anon Key', 'text', state.supabase.anonKey)}${field('userEmail', 'Email do usuário/empresa', 'email', state.supabase.userEmail)}<div class="notice">Mais seguro que GitHub/Gist: autenticação, banco real, controle de acesso e backup.</div></div><div class="card"><h2>Backup local e reset</h2><p>O sistema salva automaticamente nesta máquina. Antes de zerar, ele cria um backup interno e também permite baixar o arquivo JSON.</p><button type="button" class="secondary" onclick="createLocalBackup('manual'); alert('Backup local criado nesta máquina.')">Criar backup local</button> <button type="button" class="secondary" onclick="exportBackup()">Baixar backup JSON</button> <button type="button" class="danger" onclick="resetSystemSafe()">Zerar sistema com backup</button><h3>Backups internos</h3>${(state.localBackups || []).slice(0,5).map(b => `<p><b>${new Date(b.createdAt).toLocaleString('pt-BR')}</b><br><span class="small">${escapeHtml(b.reason)}</span> <button type="button" class="icon" onclick="restoreLocalBackup('${b.id}')">Restaurar</button> <button type="button" class="icon" onclick="downloadLocalBackup('${b.id}')">Baixar</button></p>`).join('') || '<p>Nenhum backup interno criado ainda.</p>'}</div><button class="primary">Salvar configurações</button></form>`;
  document.getElementById('configForm').onsubmit = e => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target).entries()); state.company = { ...state.company, name: d.name, cnpj: d.cnpj, phone: d.phone, whatsapp: d.whatsapp, address: d.address }; state.fiscal = { ...state.fiscal, activity: d.activity, rbt12: num(d.rbt12), useCustom: d.useCustom === 'true', customRate: num(d.customRate), entryPercent: num(d.entryPercent), deliveryDays: num(d.deliveryDays), quoteValidityDays: num(d.quoteValidityDays) }; state.pdf = { intro: d.intro, contract: d.contract, serviceContract: d.serviceContract, footer: d.footer }; state.supabase = { url: d.url, anonKey: d.anonKey, userEmail: d.userEmail }; save(); alert('Configurações salvas.'); };
}

function quotePrintHtml(q) {
  const c = state.clients.find(x => x.id === q.clientId) || {}; const ca = calcQuote(q);
  return `<div class="print-page"><div class="print-header"><img class="print-logo" src="${escapeHtml(state.company.logo || 'assets/logo-linear.jpeg')}" alt="Logo Linear"><div class="print-company"><h1>Orçamento ${escapeHtml(q.number)}</h1><p><b>${escapeHtml(state.company.name)}</b><br>${escapeHtml(state.company.cnpj)}<br>${escapeHtml(state.company.address)}<br>${escapeHtml(state.company.phone)}</p></div></div><div class="print-line"></div><h2>Cliente</h2><p><b>${escapeHtml(c.name || '')}</b><br>Celular: ${escapeHtml(c.phone || '')}<br>Email: ${escapeHtml(c.email || '')}<br>Endereço: ${escapeHtml(c.address || '')}<br>Cidade: ${escapeHtml(c.city || '')}</p><h2>Relatório inicial</h2><p>${escapeHtml(state.pdf.intro).replace(/\n/g, '<br>')}</p><h2>Itens</h2><table><thead><tr><th>Item</th><th>Qtd</th><th>Valor</th><th>Total</th></tr></thead><tbody>${(q.items || []).map(i => `<tr><td>${escapeHtml(i.name)}</td><td>${i.qty}</td><td>${money(i.price)}</td><td>${money(num(i.qty) * num(i.price))}</td></tr>`).join('')}</tbody></table><p><b>Subtotal:</b> ${money(ca.subtotal)}<br><b>Desconto:</b> ${money(ca.discount)}<br><b>Total:</b> ${money(ca.total)}<br><b>Entrada (${q.entryPercent ?? state.fiscal.entryPercent}%):</b> ${money(ca.entry)}<br><b>Imposto estimado interno:</b> ${money(ca.tax)}</p><h2>Condições de contrato</h2><p>${escapeHtml(state.pdf.contract).replace(/\n/g, '<br>')}</p><div class="signature"><b>${escapeHtml(state.pdf.footer || state.company.name)}</b></div></div>`;
}
function printQuote(id) { const q = state.quotes.find(x => x.id === id); if (!q) return; const area = document.createElement('div'); area.className = 'print-area'; area.innerHTML = quotePrintHtml(q); document.body.appendChild(area); window.print(); setTimeout(() => area.remove(), 800); }
function sendWhats(id) { const q = state.quotes.find(x => x.id === id); if (!q) return; const c = state.clients.find(x => x.id === q.clientId) || {}; const ca = calcQuote(q); const msg = `Olá, segue orçamento ${q.number} da Linear Móveis Planejados.\nCliente: ${c.name || ''}\nTotal: ${money(ca.total)}\nEntrada: ${money(ca.entry)}\n\nO PDF foi gerado pelo sistema para envio/anexo.`; printQuote(id); window.open(`https://wa.me/${state.company.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank'); }
function del(col, id) { if (confirm('Excluir este registro?')) { state[col] = state[col].filter(x => x.id !== id); save(); } }

async function syncSupabase() { if (!state.supabase.url || !state.supabase.anonKey || !state.supabase.userEmail) { alert('Configure URL, Anon Key e email em Configurações.'); return; } try { const client = supabase.createClient(state.supabase.url, state.supabase.anonKey); const payload = { email: state.supabase.userEmail, data: state, updated_at: new Date().toISOString() }; const { error } = await client.from('linear_backups').upsert(payload, { onConflict: 'email' }); if (error) throw error; document.getElementById('syncStatus').textContent = 'Sincronizado: ' + new Date().toLocaleString('pt-BR'); alert('Backup sincronizado no Supabase.'); } catch (e) { alert('Erro Supabase: ' + e.message); } }
async function pullSupabase() { const client = supabase.createClient(state.supabase.url, state.supabase.anonKey); const { data, error } = await client.from('linear_backups').select('data').eq('email', state.supabase.userEmail).single(); if (error) throw error; state = mergeDefaults(DEFAULT, data.data); save(); }
function exportBackup() { createLocalBackup('exportacao-json'); exportBackupData(state, 'backup-linear-gestao-' + todayISO() + '.json'); }
function resetSystemSafe() {
  if (!confirm('Zerar o sistema atual? Antes disso será criado um backup nesta máquina.')) return;
  const backup = createLocalBackup('backup-antes-de-zerar');
  const keep = state.localBackups || [backup];
  state = mergeDefaults(DEFAULT, {});
  state.localBackups = keep;
  save();
  alert('Sistema zerado. Um backup ficou salvo nesta máquina em Configurações > Backup local e reset.');
}
function restoreLocalBackup(id) { const b = (state.localBackups || []).find(x => x.id === id); if (!b) return; if (!confirm('Restaurar este backup? Os dados atuais serão substituídos.')) return; const keep = state.localBackups || []; state = mergeDefaults(DEFAULT, b.data); state.localBackups = keep; save(); alert('Backup restaurado.'); }
function downloadLocalBackup(id) { const b = (state.localBackups || []).find(x => x.id === id); if (!b) return; exportBackupData(b.data, 'backup-linear-interno-' + String(b.createdAt).slice(0,10) + '.json'); }
function importBackup(file) { const r = new FileReader(); r.onload = () => { try { state = mergeDefaults(DEFAULT, JSON.parse(r.result)); save(); alert('Backup importado.'); } catch (e) { alert('Arquivo inválido.'); } }; r.readAsText(file); }

document.getElementById('exportBtn').onclick = exportBackup;
document.getElementById('importFile').onchange = e => e.target.files[0] && importBackup(e.target.files[0]);
document.getElementById('syncNowBtn').onclick = syncSupabase;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; document.getElementById('installBtn').classList.remove('hidden'); });
document.getElementById('installBtn').onclick = async () => { if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt = null; } };
if ('serviceWorker' in navigator) { navigator.serviceWorker.register('./sw.js').catch(() => {}); }
render(); showPage('dashboard');
