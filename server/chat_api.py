from flask import Flask, request, jsonify
from flask_cors import CORS
import os, json, datetime

app = Flask(__name__)
CORS(app)

MEM_PATH = os.path.join(os.path.dirname(__file__), 'memory.json')

def load_mem():
    if not os.path.exists(MEM_PATH):
        return { 'projects': [], 'transactions': [], 'notes': [], 'last_seen': None }
    try:
        with open(MEM_PATH, 'r') as f:
            return json.load(f)
    except Exception:
        return { 'projects': [], 'transactions': [], 'notes': [], 'last_seen': None }


def save_mem(mem):
    try:
        with open(MEM_PATH, 'w') as f:
            json.dump(mem, f)
    except Exception:
        pass


def is_business_related(text: str) -> bool:
    t = (text or '').lower()
    keywords = ['business', 'project', 'sales', 'revenue', 'expense', 'profit', 'wallet', 'transaction', 'customer', 'marketing', 'inventory', 'cash flow', 'accounting']
    return any(k in t for k in keywords)


def categorize_and_aggregate(txs, address='0xYourAddress'):
    weekly, monthly = {}, {}
    def wei_to_eth(v):
        try:
            return int(v) / 1e18
        except Exception:
            try:
                return int(v, 10) / 1e18
            except Exception:
                return 0
    for tx in txs:
        try:
            ts = int(tx.get('timeStamp', tx.get('timestamp', int(datetime.datetime.now().timestamp()))))
        except Exception:
            ts = int(datetime.datetime.now().timestamp())
        d = datetime.datetime.fromtimestamp(ts)
        week_start = d - datetime.timedelta(days=d.weekday())
        week_key = week_start.date().isoformat()
        month_key = f"{d.year}-{str(d.month).zfill(2)}"
        amount = wei_to_eth(tx.get('value', '0'))
        to_addr = (tx.get('to') or '').lower()
        from_addr = (tx.get('from') or '').lower()
        me = (address or '0xYourAddress').lower()
        income = to_addr == me
        spending = from_addr == me
        cat = 'income' if income else ('spending' if spending else None)
        if not cat: continue
        weekly.setdefault(week_key, {'income':0,'spending':0})
        monthly.setdefault(month_key, {'income':0,'spending':0})
        weekly[week_key][cat] += amount
        monthly[month_key][cat] += amount
    return { 'weekly': weekly, 'monthly': monthly }


def compute_kpis(agg):
    weeks = sorted(agg['weekly'].keys())
    months = sorted(agg['monthly'].keys())
    last_week = weeks[-1] if weeks else None
    last_month = months[-1] if months else None
    weekly_income = agg['weekly'][last_week]['income'] if last_week else 0
    weekly_spending = agg['weekly'][last_week]['spending'] if last_week else 0
    monthly_net = (agg['monthly'][last_month]['income'] - agg['monthly'][last_month]['spending']) if last_month else 0
    return { 'weeklyIncome': weekly_income, 'weeklySpending': weekly_spending, 'monthlyNet': monthly_net }


def what_if_scenarios(agg):
    k = compute_kpis(agg)
    net = k['monthlyNet']
    income = k['weeklyIncome']*4
    spend = k['weeklySpending']*4
    scenarios = []
    scenarios.append({ 'title': 'Increase pricing by 5%', 'impact': round(income*0.05, 2), 'summary': 'Raises revenue assuming demand holds; review price elasticity.', 'action': 'Pilot price increase on top SKUs for 2 weeks.' })
    scenarios.append({ 'title': 'Cut low-ROI marketing 10%', 'impact': round(spend*0.10, 2), 'summary': 'Reduces spend; reallocate to high-ROI channels.', 'action': 'Pause poor campaigns, double down on top performers.' })
    scenarios.append({ 'title': 'Accelerate collections', 'impact': round(net*0.08, 2), 'summary': 'Improves cash flow; lowers working capital needs.', 'action': 'Send reminders; offer 2%/10 Net 30 early payment terms.' })
    return scenarios


def time_based_greeting():
    h = datetime.datetime.now().hour
    if h < 12: return "Good morning! What business goals should we drive today?"
    if h < 17: return "Good afternoon! Let’s review sales, costs, or projects."
    return "Good evening! Ready to plan next moves and improve margins?"


def process_message(message: str, mem: dict) -> str:
    if not is_business_related(message):
        return "I’m focused on your business. Ask about sales, expenses, transactions, projects, or strategy."
    m = (message or '').lower()
    txs = mem.get('transactions', [])
    projects = mem.get('projects', [])
    if any(k in m for k in ['sale','revenue','income','transaction','wallet']):
        agg = categorize_and_aggregate(txs)
        kpis = compute_kpis(agg)
        return (f"Here’s your latest summary: Weekly income ${kpis['weeklyIncome']:,.2f}, weekly spending ${kpis['weeklySpending']:,.2f}, monthly net ${kpis['monthlyNet']:,.2f}. "
                f"I can also simulate scenarios. Say ‘what-if’ to explore options.")
    if any(k in m for k in ['expense','spending','cost']):
        agg = categorize_and_aggregate(txs)
        kpis = compute_kpis(agg)
        return (f"Current weekly spending is ${kpis['weeklySpending']:,.2f}. Consider cutting 10% low-ROI costs or negotiating vendor discounts. "
                f"Want a list of actionable savings ideas?")
    if any(k in m for k in ['profit','margin','net']):
        agg = categorize_and_aggregate(txs)
        kpis = compute_kpis(agg)
        return f"Monthly net sits at ${kpis['monthlyNet']:,.2f}. We can grow margins via pricing, mix shift, and efficiency."
    if any(k in m for k in ['project','client','deliverable','deadline']):
        if not projects:
            return "I don’t have saved projects yet. Share details and I’ll track deliverables, owners, and dates."
        pnames = ', '.join([p.get('name','Unnamed') for p in projects])
        return f"Active projects: {pnames}. Ask ‘plan {projects[0].get('name','the project')}’ to get milestones and risks."
    if 'what-if' in m or 'scenario' in m:
        agg = categorize_and_aggregate(txs)
        sims = what_if_scenarios(agg)
        lines = [f"- {s['title']}: impact ≈ ${s['impact']:,.2f}. {s['summary']} Next: {s['action']}" for s in sims]
        return "Scenario options:\n" + "\n".join(lines)
    if any(k in m for k in ['tip','advice','help','strategy','plan']):
        return "Top priorities: stabilize cash flow, grow high-margin revenue, and reduce waste. I can draft a 30/60/90-day plan on request."
    return "Tell me about your sales, expenses, transactions, or a project you want me to manage."


@app.route('/api/chat', methods=['POST'])
def chat():
    mem = load_mem()
    data = request.get_json(silent=True) or {}
    message = (data.get('message') or '').strip()
    if not message:
        mem['last_seen'] = datetime.datetime.utcnow().isoformat(); save_mem(mem)
        return jsonify({ 'reply': time_based_greeting() })
    reply = process_message(message, mem)
    return jsonify({ 'reply': reply })


@app.route('/api/memory/project', methods=['POST'])
def add_project():
    mem = load_mem()
    data = request.get_json(silent=True) or {}
    proj = {
        'name': data.get('name'),
        'client': data.get('client'),
        'description': data.get('description'),
        'status': data.get('status','active'),
        'due': data.get('due'),
        'created': datetime.datetime.utcnow().isoformat()
    }
    mem.setdefault('projects', []).append(proj)
    save_mem(mem)
    return jsonify({ 'ok': True, 'project': proj })


@app.route('/api/memory/projects', methods=['GET'])
def list_projects():
    mem = load_mem()
    return jsonify({ 'projects': mem.get('projects', []) })


@app.route('/api/transactions', methods=['POST'])
def save_transactions():
    mem = load_mem()
    data = request.get_json(silent=True) or {}
    txs = data.get('transactions') or []
    address = data.get('address') or '0xYourAddress'
    mem['transactions'] = txs
    mem['wallet_address'] = address
    save_mem(mem)
    agg = categorize_and_aggregate(txs, address)
    kpis = compute_kpis(agg)
    return jsonify({ 'ok': True, 'count': len(txs), 'kpis': kpis })


@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    mem = load_mem()
    txs = mem.get('transactions', [])
    agg = categorize_and_aggregate(txs, mem.get('wallet_address','0xYourAddress'))
    kpis = compute_kpis(agg)
    return jsonify({ 'transactions': txs, 'kpis': kpis })


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8012)