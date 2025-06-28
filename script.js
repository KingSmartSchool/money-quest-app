let startingCapital = 0;
let activeIncome = 0;
let passiveIncome = 0;
let targetAmount = 0;
let endDate = null;
let activeIncomeRecords = [];
let incomeChart = null;

// ─── 初始化，載入 localStorage 和畫面 ─────────────────
function loadData() {
  startingCapital = Number(localStorage.getItem("initialFund")) || 0;
  activeIncome     = Number(localStorage.getItem("activeIncome")) || 0;
  passiveIncome    = Number(localStorage.getItem("passiveIncome")) || 0;
  targetAmount     = Number(localStorage.getItem("goalAmount"))   || 0;
  endDate          = localStorage.getItem("goalDeadline")         || null;
  activeIncomeRecords = JSON.parse(localStorage.getItem("incomeRecords")) || [];

  // 如果有先前設定，再顯示出來
  document.getElementById("initial-amount").textContent     = `NT$${startingCapital.toLocaleString()}`;
  document.getElementById("active-total").textContent       = `NT$${activeIncome.toLocaleString()}`;
  document.getElementById("passive-total").textContent      = `NT$${passiveIncome.toLocaleString()}`;
  document.getElementById("earned-total").textContent       = `NT$${(startingCapital+activeIncome+passiveIncome).toLocaleString()}`;

  if (targetAmount && endDate) {
    document.getElementById("goal-amount").textContent = `NT$${targetAmount.toLocaleString()}`;
    const daysLeft = Math.ceil((new Date(endDate) - new Date())/(1000*60*60*24));
    document.getElementById("days-left").textContent = `${daysLeft} 天`;
  }

  updateDisplay();
  updateActiveIncomeChart();
}

// ─── 更新畫面所有數值與進度條 ─────────────────────
function updateDisplay() {
  const total = startingCapital + activeIncome + passiveIncome;
  document.getElementById("startingCapitalDisplay")?.remove?.(); // just in case old
  document.getElementById("active-total").textContent  = `NT$${activeIncome.toLocaleString()}`;
  document.getElementById("passive-total").textContent = `NT$${passiveIncome.toLocaleString()}`;
  document.getElementById("earned-total").textContent = `NT$${total.toLocaleString()}`;

  if (targetAmount > 0) {
    const pct = Math.min(100, (total/targetAmount)*100).toFixed(1);
    document.getElementById("progress-bar").style.width = `${pct}%`;
    document.getElementById("progress-percent").textContent = `${pct}%`;
  }
}

// ─── 設定起始資金 ─────────────────────────────
function setInitial() {
  const v = Number(document.getElementById("initial-fund").value) || 0;
  if (v>=0) {
    startingCapital = v;
    localStorage.setItem("initialFund", v);
    document.getElementById("initial-amount").textContent = `NT$${v.toLocaleString()}`;
    updateDisplay();
    updateActiveIncomeChart();
    document.getElementById("initial-fund").value = "";
  } else alert("請輸入有效起始資金");
}

// ─── 設定目標挑戰 ─────────────────────────────
function setGoal() {
  const amt = Number(document.getElementById("goal-amount-input").value) || 0;
  const dt  = document.getElementById("goal-deadline-input").value;
  if (amt>0 && dt) {
    targetAmount = amt;
    endDate = dt;
    localStorage.setItem("goalAmount", amt);
    localStorage.setItem("goalDeadline", dt);

    document.getElementById("goal-amount").textContent = `NT$${amt.toLocaleString()}`;
    const daysLeft = Math.ceil((new Date(dt) - new Date())/(1000*60*60*24));
    document.getElementById("days-left").textContent = `${daysLeft} 天`;

    updateDisplay();
  } else alert("請輸入目標金額與日期");
}

// ─── 新增收入函式（被主動和被動共用） ─────────────────
function addIncome(){
  // 主動
  const a = Number(document.getElementById("active-income").value) || 0;
  // 被動
  const p = Number(document.getElementById("passive-income").value) || 0;

  if (a>0) {
    activeIncome += a;
    activeIncomeRecords.push({ date: new Date().toISOString().split("T")[0], amount: a });
    localStorage.setItem("activeIncome", activeIncome);
    localStorage.setItem("incomeRecords", JSON.stringify(activeIncomeRecords));
  }
  if (p>0) {
    passiveIncome += p;
    localStorage.setItem("passiveIncome", passiveIncome);
  }
  updateDisplay();
  updateActiveIncomeChart();
  document.getElementById("active-income").value = "";
  document.getElementById("passive-income").value = "";
}

// ─── 畫主動收入成長圖 ─────────────────────────
function updateActiveIncomeChart(){
  const ctx = document.getElementById("activeIncomeChart").getContext("2d");
  const labels = activeIncomeRecords.map(r=>r.date);
  let cum=0;
  const data = activeIncomeRecords.map(r=>(cum+=r.amount));

  if (incomeChart){
    incomeChart.data.labels = labels;
    incomeChart.data.datasets[0].data = data;
    incomeChart.update();
  } else {
    incomeChart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "主動收入累積",
          data,
          borderColor: "green",
          backgroundColor: "rgba(0,128,0,0.2)",
          fill: true,
          tension: 0.3
        }]
      },
      options: { responsive: true }
    });
  }
}

// ─── 啟動 ─────────────────────────────
window.onload = loadData;
