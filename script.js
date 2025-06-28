let initialFund = 0;
let activeIncome = 0;
let passiveIncome = 0;

// 新增收入
function addIncome() {
  const activeInput = document.getElementById("active-income");
  const passiveInput = document.getElementById("passive-income");

  const activeAmount = Number(activeInput.value) || 0;
  const passiveAmount = Number(passiveInput.value) || 0;

  activeIncome += activeAmount;
  passiveIncome += passiveAmount;

  localStorage.setItem("active", activeIncome);
  localStorage.setItem("passive", passiveIncome);

  updateIncomeUI();
  updateProgress(3000000); // 你目標金額，之後可改為讀取 JSON
  activeInput.value = "";
  passiveInput.value = "";
}

// 顯示當前金額
function updateIncomeUI() {
  const earned = activeIncome + passiveIncome;
  document.getElementById("active-total").textContent = `NT$${activeIncome.toLocaleString()}`;
  document.getElementById("passive-total").textContent = `NT$${passiveIncome.toLocaleString()}`;
  document.getElementById("earned-total").textContent = `NT$${earned.toLocaleString()}`;
}

// 更新進度條
function updateProgress(goalAmount) {
  const earned = activeIncome + passiveIncome;
  const percent = Math.min(100, (earned / goalAmount) * 100).toFixed(1);
  document.getElementById("progress-bar").style.width = `${percent}%`;
  document.getElementById("progress-percent").textContent = `${percent}%`;
}
