import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

function fmtEth(weiHex){
  try{ const wei = BigInt(weiHex); const eth = Number(wei) / 1e18; return (Math.round(eth*1000)/1000).toString(); }catch(e){ return '0'; }
}
function fmtCurrency(n){ return '$' + (n<0 ? '-' : '') + Math.abs(n).toLocaleString(undefined,{minimumFractionDigits:2, maximumFractionDigits:2}); }

function weiToEth(valueStr){ try{ return Number(BigInt(valueStr)) / 1e18; }catch(e){ return 0; } }

function mockTransactions(address){
  const now = Date.now(); const day = 24*3600*1000;
  const makeTx = (ts, from, to, valueEth) => ({ timeStamp: Math.floor(ts/1000).toString(), from, to, value: (BigInt(Math.round(valueEth*1e18))).toString() });
  const me = address || '0xYourAddress';
  const other = '0xOther';
  const txs = [];
  for(let i=1;i<=60;i++){
    const ts = now - i*day;
    const incoming = i%3===0; const amount = incoming ? (0.02 + (i%5)*0.005) : (0.015 + (i%4)*0.004);
    txs.push(makeTx(ts, incoming? other : me, incoming? me : other, amount));
  }
  return txs;
}

function categorizeAndAggregate(txs, address){
  const weekly = {}; // { weekStartISO: { income, spending } }
  const monthly = {}; // { monthKey: { income, spending } }
  let totalIncome = 0, totalSpending = 0;
  txs.forEach(tx => {
    const ts = Number(tx.timeStamp)*1000; const d = new Date(ts);
    const weekStart = new Date(d); const day = weekStart.getDay(); weekStart.setDate(weekStart.getDate()-day); weekStart.setHours(0,0,0,0);
    const weekKey = weekStart.toISOString().slice(0,10);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    const amount = weiToEth(tx.value);
    const income = tx.to && tx.to.toLowerCase() === address.toLowerCase();
    const spending = tx.from && tx.from.toLowerCase() === address.toLowerCase();
    const cat = income ? 'income' : (spending ? 'spending' : null);
    if(!cat) return;
    weekly[weekKey] = weekly[weekKey] || { income:0, spending:0 };
    monthly[monthKey] = monthly[monthKey] || { income:0, spending:0 };
    weekly[weekKey][cat] += amount;
    monthly[monthKey][cat] += amount;
    if(cat==='income') totalIncome += amount; else totalSpending += amount;
  });
  return { weekly, monthly, totals: { income: totalIncome, spending: totalSpending } };
}

function computeKpis(agg){
  const weeks = Object.keys(agg.weekly).sort();
  const months = Object.keys(agg.monthly).sort();
  const lastWeek = weeks[weeks.length-1];
  const lastMonth = months[months.length-1];
  const weeklyIncome = lastWeek ? agg.weekly[lastWeek].income : 0;
  const weeklySpending = lastWeek ? agg.weekly[lastWeek].spending : 0;
  const monthlyNet = lastMonth ? (agg.monthly[lastMonth].income - agg.monthly[lastMonth].spending) : 0;
  return { weeklyIncome, weeklySpending, monthlyNet };
}

function useTheme(){
  const [dark, setDark] = useState(false);
  useEffect(()=>{
    try{ const s = JSON.parse(localStorage.getItem('userSettings')||'{}'); setDark(s.theme==='dark'); }catch(e){}
  },[]);
  return dark;
}

export default function WalletPage(){
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [balanceEth, setBalanceEth] = useState(null);
  const [txs, setTxs] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const dark = useTheme();

  useEffect(()=>{ setApiKey(localStorage.getItem('ETHERSCAN_API_KEY')||''); },[]);

  async function connect(){
    if(!window.ethereum){ alert('No Ethereum provider found (install MetaMask)'); return; }
    try{
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const addr = accounts[0];
      const ch = await window.ethereum.request({ method: 'eth_chainId' });
      const bal = await window.ethereum.request({ method: 'eth_getBalance', params: [addr, 'latest'] });
      setAddress(addr); setChainId(ch); setBalanceEth(fmtEth(bal));
      await loadTransactions(addr);
    }catch(e){ console.error(e); alert('Connection failed'); }
  }

  async function fetchEtherscan(addr){
    const key = localStorage.getItem('ETHERSCAN_API_KEY')||'';
    const base = 'https://api.etherscan.io/api';
    const url = `${base}?module=account&action=txlist&address=${addr}&startblock=0&endblock=99999999&sort=desc${key?`&apikey=${key}`:''}`;
    const res = await fetch(url);
    const data = await res.json();
    if(data && data.status === '1') return data.result;
    throw new Error('Etherscan fetch failed');
  }

  async function loadTransactions(addr){
    if(!addr){ setTxs(mockTransactions()); return; }
    try{ const r = await fetchEtherscan(addr); setTxs(r); }
    catch(e){ console.warn('Using mock transactions', e); setTxs(mockTransactions(addr)); }
  }

  const agg = categorizeAndAggregate(txs, address||'0xYourAddress');
  const kpis = computeKpis(agg);

  const grid = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const tick = dark ? '#cbd5e1' : '#374151';

  const wkeys = Object.keys(agg.weekly).sort();
  const wIncome = wkeys.map(k=>agg.weekly[k].income);
  const wSpend = wkeys.map(k=>agg.weekly[k].spending);
  const weeklyData = { labels: wkeys.map(k=>k.slice(5)), datasets:[ { label:'Income', data:wIncome, borderColor:'#10b981', backgroundColor:'rgba(16,185,129,0.12)', borderWidth:2, pointRadius:2, fill:true }, { label:'Spending', data:wSpend, borderColor:'#ef4444', backgroundColor:'rgba(239,68,68,0.12)', borderWidth:2, pointRadius:2, fill:false, borderDash:[6,4] } ] };
  const weeklyOpts = { responsive:true, interaction:{ mode:'index', intersect:false }, plugins:{ legend:{ labels:{ color: tick } }, tooltip:{ callbacks:{ label: (ctx)=> `${ctx.dataset.label}: ${fmtCurrency(ctx.parsed.y)}` } }, title:{ display:true, text:'Weekly (Income vs Spending)', color: tick, font:{ weight: 'bold' } } }, scales:{ x:{ ticks:{ color: tick }, grid:{ color: grid } }, y:{ ticks:{ color: tick, callback:(v)=>fmtCurrency(v) }, grid:{ color: grid } } } };

  const mkeys = Object.keys(agg.monthly).sort();
  const mIncome = mkeys.map(k=>agg.monthly[k].income);
  const mSpend = mkeys.map(k=>agg.monthly[k].spending);
  const mNet = mkeys.map((k,i)=>mIncome[i]-mSpend[i]);
  const monthlyData = { labels: mkeys, datasets: [ { label:'Income', data:mIncome, backgroundColor:'rgba(16,185,129,0.6)' }, { label:'Spending', data:mSpend, backgroundColor:'rgba(239,68,68,0.6)' }, { label:'Net', data:mNet, type:'line', borderColor:'#2563eb', backgroundColor:'rgba(37,99,235,0.12)', borderWidth:3, pointRadius:2, fill:true } ] };
  const monthlyOpts = { responsive:true, interaction:{ mode:'index', intersect:false }, plugins:{ legend:{ labels:{ color: tick } }, tooltip:{ callbacks:{ label: (ctx)=> `${ctx.dataset.label}: ${fmtCurrency(ctx.parsed.y)}` } }, title:{ display:true, text:'Monthly Net and Totals', color: tick, font:{ weight: 'bold' } } }, scales:{ x:{ ticks:{ color: tick }, grid:{ color: grid } }, y:{ ticks:{ color: tick, callback:(v)=>fmtCurrency(v) }, grid:{ color: grid } } } };

  const breakdownData = { labels:['Income','Spending'], datasets:[ { data:[agg.totals.income, agg.totals.spending], backgroundColor:['#10b981','#ef4444'] } ] };
  const breakdownOpts = { plugins:{ legend:{ labels:{ color: tick } }, title:{ display:true, text:'Income vs Spending Share', color: tick, font:{ weight: 'bold' } } } };

  return (
    <Layout>
      <div className="app" style={{ maxWidth: 900, margin: '0 auto', padding: '1rem' }}>
        <div className="header" style={{ position: 'sticky', top: 0, background: 'var(--bg)', borderBottom: '1px solid var(--border)', zIndex: 20 }}>
          <div className="header-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0' }}>
            <div className="title" style={{ fontWeight: 700, fontSize: '1.25rem' }}>Wallet Tracker</div>
            <div className="row" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <input value={apiKey} onChange={(e)=>{ setApiKey(e.target.value); localStorage.setItem('ETHERSCAN_API_KEY', e.target.value); }} className="input" placeholder="Etherscan API Key (optional)" style={{ width: 280, border:'1px solid var(--border)', borderRadius:12, padding:'0.5rem 0.75rem' }} />
              <button onClick={()=>localStorage.setItem('ETHERSCAN_API_KEY', apiKey)} className="btn" style={{ padding:'0.5rem 0.75rem', borderRadius:10, border:'1px solid transparent', background:'var(--brand)', color:'#fff', fontWeight:600 }}>Save Key</button>
            </div>
          </div>
        </div>

        <div className="grid" style={{ display:'grid', gridTemplateColumns:'1fr', gap:'1rem' }}>
          <div className="card" style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:'1rem' }}>
            <div className="label" style={{ color:'var(--muted)', fontSize:'.85rem' }}>Connection</div>
            <div id="connStatus" className="muted">{address ? 'Connected' : 'Not connected'}</div>
            <div className="row" style={{ marginTop: '.75rem', display:'flex', gap:'.75rem', alignItems:'center' }}>
              <button onClick={connect} className="btn" style={{ padding:'0.5rem 0.75rem', borderRadius:10, border:'1px solid transparent', background:'var(--brand)', color:'#fff', fontWeight:600 }}>Connect Wallet</button>
              <div style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \'Liberation Mono\', \'Courier New\', monospace' }}>{address||''}</div>
            </div>
            <div className="row" style={{ marginTop: '.75rem', display:'flex', gap:'1rem' }}>
              <div>Chain: <span>{chainId||'—'}</span></div>
              <div>Balance: <span>{balanceEth||'—'}</span> ETH</div>
            </div>
          </div>

          <div className="card" style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:'1rem' }}>
            <div className="label" style={{ color:'var(--muted)', fontSize:'.85rem' }}>KPIs</div>
            <div className="kpis" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'.75rem', marginTop:'.5rem' }}>
              <div className="kpi" style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:'.75rem' }}>
                <div className="muted">Weekly Income</div>
                <div className="value" style={{ fontSize:'1.2rem', fontWeight:700 }}>{fmtCurrency(kpis.weeklyIncome)}</div>
              </div>
              <div className="kpi" style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:'.75rem' }}>
                <div className="muted">Weekly Spending</div>
                <div className="value" style={{ fontSize:'1.2rem', fontWeight:700 }}>{fmtCurrency(kpis.weeklySpending)}</div>
              </div>
              <div className="kpi" style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:'.75rem' }}>
                <div className="muted">Monthly Net</div>
                <div className="value" style={{ fontSize:'1.2rem', fontWeight:700 }}>{fmtCurrency(kpis.monthlyNet)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginTop:'1rem' }}>
          <div className="chart-wrap" style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:'1rem' }}>
            <div className="label" style={{ marginBottom: '.5rem', color:'var(--muted)' }}>Weekly Breakdown (Income vs Spending)</div>
            <Line data={weeklyData} options={weeklyOpts} height={160} />
          </div>
          <div className="chart-wrap" style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:'1rem' }}>
            <div className="label" style={{ marginBottom: '.5rem', color:'var(--muted)' }}>Monthly Net and Totals</div>
            <Bar data={monthlyData} options={monthlyOpts} height={160} />
          </div>
        </div>

        <div className="chart-wrap" style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:'1rem', marginTop:'1rem' }}>
          <div className="label" style={{ marginBottom: '.5rem', color:'var(--muted)' }}>Income vs Spending Share</div>
          <Doughnut data={breakdownData} options={breakdownOpts} height={160} />
        </div>
      </div>
    </Layout>
  );
}