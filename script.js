class OrtakSystem {
  constructor() {
    this.transactions = JSON.parse(localStorage.getItem('ortak_transactions')) || [];
    this.wages = JSON.parse(localStorage.getItem('ortak_wages')) || [];
    this.treatments = JSON.parse(localStorage.getItem('ortak_treatments')) || [];
    this.init();
  }
  init() {
    document.addEventListener('DOMContentLoaded', () => { this.renderApp(); });
  }
  save() {
    localStorage.setItem('ortak_transactions', JSON.stringify(this.transactions));
    localStorage.setItem('ortak_wages', JSON.stringify(this.wages));
    localStorage.setItem('ortak_treatments', JSON.stringify(this.treatments));
    this.renderApp();
  }
  addTransaction(type, category, amount, description) {
    this.transactions.push({
      id: 'TX-' + Date.now(), date: new Date().toLocaleDateString('ar-EG'), type, category, amount: parseFloat(amount), description
    });
    this.save();
  }
  addWage(workerName, dailyRate, daysWorked) {
    const rate = parseFloat(dailyRate); const days = parseFloat(daysWorked);
    this.wages.push({
      id: 'WG-' + Date.now(), date: new Date().toLocaleDateString('ar-EG'), workerName, dailyRate: rate, daysWorked: days, total: rate * days
    });
    this.save();
  }
  addTreatment(cropType, treatmentName, quantity, purpose) {
    this.treatments.push({
      id: 'TR-' + Date.now(), date: new Date().toLocaleDateString('ar-EG'), cropType, treatmentName, quantity, purpose
    });
    this.save();
  }
  calculateTotals() {
    const income = this.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = this.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const wagesTotal = this.wages.reduce((sum, w) => sum + w.total, 0);
    return { income, expense: expense + wagesTotal, balance: income - (expense + wagesTotal) };
  }
  renderApp() {
    const root = document.getElementById('root'); if (!root) return;
    const totals = this.calculateTotals();
    root.innerHTML = `
      <div style="padding: 15px; max-width: 800px; margin: 0 auto; direction: rtl; text-align: right; font-family: sans-serif;">
        <header style="background: linear-gradient(135deg, #1b5e20, #4caf50); color: white; padding: 20px; text-align: center; border-radius: 12px; margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 24px;">🌾 نظام ORTAK الزراعي المتكامل</h1>
          <p style="margin: 5px 0 0 0; font-size: 14px;">المحاسبة، الأجور، والتسميد والعلاجات الزراعية</p>
        </header>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
          <div style="background: #e8f5e9; border-right: 5px solid #2e7d32; padding: 15px; border-radius: 8px;">
            <h3 style="margin: 0; color: #2e7d32;">💰 الإيرادات</h3>
            <p style="font-size: 20px; font-weight: bold; margin: 5px 0 0 0;">\${totals.income.toFixed(2)} ر.س</p>
          </div>
          <div style="background: #ffebee; border-right: 5px solid #c62828; padding: 15px; border-radius: 8px;">
            <h3 style="margin: 0; color: #c62828;">📉 المصاريف</h3>
            <p style="font-size: 20px; font-weight: bold; margin: 5px 0 0 0;">\${totals.expense.toFixed(2)} ر.س</p>
          </div>
        </div>
        <div style="background: #fff; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 25px; border: 1px solid #e0e0e0;">
          <h3 style="margin: 0; color: #555;">⚖️ صافي الأرباح (الرصيد الحالي)</h3>
          <p style="font-size: 24px; font-weight: bold; margin: 5px 0 0 0; color: \${totals.balance >= 0 ? '#1b5e20' : '#b71c1c'};">\${totals.balance.toFixed(2)} ر.س</p>
        </div>
        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; margin-bottom: 20px;">
          <h3 style="color: #1b5e20; margin-top:0;">📊 تسجيل العمليات المالية</h3>
          <form id="txForm" style="display: flex; flex-direction: column; gap: 10px;">
            <select id="txType" style="padding: 10px;"><option value="income">إيرادات مبيعات</option><option value="expense">مصروفات عامة</option></select>
            <input type="text" id="txCategory" placeholder="الفئة (طماطم، خيار، سماد)" required style="padding: 10px;">
            <input type="number" id="txAmount" placeholder="المبلغ" required style="padding: 10px;">
            <input type="text" id="txDesc" placeholder="تفاصيل" style="padding: 10px;">
            <button type="submit" style="background: #2e7d32; color: white; padding: 12px; border: none; font-weight: bold;">حفظ المعاملة</button>
          </form>
        </div>
        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; margin-bottom: 20px;">
          <h3 style="color: #0d47a1; margin-top:0;">👷 أجور العمال اليومية</h3>
          <form id="wgForm" style="display: flex; flex-direction: column; gap: 10px;">
            <input type="text" id="workerName" placeholder="اسم العامل" required style="padding: 10px;">
            <input type="number" id="dailyRate" placeholder="الأجرة اليومية" required style="padding: 10px;">
            <input type="number" id="daysWorked" placeholder="عدد الأيام" required style="padding: 10px;">
            <button type="submit" style="background: #1565c0; color: white; padding: 12px; border: none; font-weight: bold;">تسجيل العامل</button>
          </form>
        </div>
        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; margin-bottom: 20px;">
          <h3 style="color: #e65100; margin-top:0;">🧪 سجل التسميد والعلاجات</h3>
          <form id="trForm" style="display: flex; flex-direction: column; gap: 10px;">
            <input type="text" id="cropType" placeholder="المحصول المستهدف" required style="padding: 10px;">
            <input type="text" id="treatmentName" placeholder="اسم المادة أو المبيد" required style="padding: 10px;">
            <input type="text" id="treatmentQty" placeholder="الكمية" required style="padding: 10px;">
            <input type="text" id="treatmentPurpose" placeholder="السبب" style="padding: 10px;">
            <button type="submit" style="background: #ef6c00; color: white; padding: 12px; border: none; font-weight: bold;">توثيق العلاج</button>
          </form>
        </div>
        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0;">
          <h3>📜 السجل العام الشامل</h3>
          <div style="max-height: 250px; overflow-y: auto;">
            \${this.transactions.map(t => `<p>📅 \${t.date} - [\${t.type === 'income'?'إيراد':'مصروف'}] \${t.category}: \${t.amount} ر.س</p>`).join('')}
            \${this.wages.map(w => `<p>📅 \${w.date} - [عامل] \${w.workerName} (\${w.daysWorked} يوم): -\${w.total} ر.س</p>`).join('')}
            \${this.treatments.map(t => `<p style="background:#fff8e1;">📅 \${t.date} - [علاج 🧪] \${t.cropType}: \${t.treatmentName} (\${t.quantity})</p>`).join('')}
          </div>
        </div>
      </div>
    `;
    this.bindEvents();
  }
  bindEvents() {
    document.getElementById('txForm')?.addEventListener('submit', (e) => { e.preventDefault(); this.addTransaction(document.getElementById('txType').value, document.getElementById('txCategory').value, document.getElementById('txAmount').value, document.getElementById('txDesc').value); });
    document.getElementById('wgForm')?.addEventListener('submit', (e) => { e.preventDefault(); this.addWage(document.getElementById('workerName').value, document.getElementById('dailyRate').value, document.getElementById('daysWorked').value); });
    document.getElementById('trForm')?.addEventListener('submit', (e) => { e.preventDefault(); this.addTreatment(document.getElementById('cropType').value, document.getElementById('treatmentName').value, document.getElementById('treatmentQty').value, document.getElementById('treatmentPurpose').value); });
  }
}
const ortakApp = new OrtakSystem();
