let activeIncome = 0;
let passiveIncome = 0;
let startingCapital = 0;
let targetAmount = 0;
let endDate = null;
let activeIncomeRecords = [];

function updateDisplay() {
  const totalAssets = startingCapital + activeIncome + passiveIncome;
  document.getElementById('startingCapitalDisplay').textContent = `NT$${startingCapital.toLocaleString()}`;
  document.getElementById('activeIncomeDisplay').textContent = `NT$${activeIncome.toLocaleString()}`;
  document.getElementById('passiveIncomeDisplay').textContent = `NT$${passiveIncome.toLocaleString()}`;
  document.getElementById('totalAssetsDisplay').textContent = `NT$${totalAssets.toLocaleString()}`;

  // 更新目標進度
  if (targetAmount > 0) {
    const progress = Math.min((totalAssets / targetAmount) * 100, 100);
    document.getElementById('progressBar').style.width = `${progress}%`;
    document.getElementById('progressPercentage').textContent = `${progress.toFixed(1)}%`;
  }
}

// 設定起始資金
document.getElementById('setStartingCapital').addEventListener('click', function () {
  const input = document.getElementById('startingCapitalInput');
  const value = parseInt(input.value);
  if (!isNaN(value) && value >= 0) {
    startingCapital = value;
    updateDisplay();
    input.value = '';
  }
});

// 設定目標金額與日期
document.getElementById('setGoal').addEventListener('click', function () {
  const goalInput = document.getElementById('goalAmountInput');
  const dateInput = document.getElementById('goalDateInput');
  const goalValue = parseInt(goalInput.value);

  if (!isNaN(goalValue) && goalValue > 0 && dateInput.value) {
    targetAmount = goalValue;
    endDate = new Date(dateInput.value);
    const today = new Date();
    const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    document.getElementById('goalAmountDisplay').textContent = `NT$${targetAmount.toLocaleString()}`;
    document.getElementById('daysLeftDisplay').textContent = `${daysLeft} 天`;
    updateDisplay();
  }
});

// 儲存主動收入紀錄（時間與金額）
let activeIncomeRecords = [];

// 新增主動收入按鈕功能
document.getElementById('addActiveIncome').addEventListener('click', function () {
  const input = document.getElementById('activeIncomeInput');
  const value = parseInt(input.value);

  if (!isNaN(value) && value > 0) {
    activeIncome += value;

    // ➕ 紀錄主動收入時間與金額
    const today = new Date().toISOString().split('T')[0];
    activeIncomeRecords.push({
      date: today,
      amount: value
    });

    updateDisplay();             // 更新畫面上的數值
    updateActiveIncomeChart();   // 更新折線圖
    input.value = '';            // 清空輸入欄
  }
});


// 新增被動收入
document.getElementById('addPassiveIncome').addEventListener('click', function () {
  const input = document.getElementById('passiveIncomeInput');
  const value = parseInt(input.value);

  if (!isNaN(value) && value > 0) {
    passiveIncome += value;
    updateDisplay();
    input.value = '';
  }
});

let incomeChart = null;

function updateActiveIncomeChart() {
  const ctx = document.getElementById('activeIncomeChart').getContext('2d');

  const dates = activeIncomeRecords.map(r => r.date);
  const amounts = activeIncomeRecords.map((r, index) =>
    activeIncomeRecords.slice(0, index + 1).reduce((sum, record) => sum + record.amount, 0)
  );

  if (incomeChart) {
    incomeChart.data.labels = dates;
    incomeChart.data.datasets[0].data = amounts;
    incomeChart.update();
  } else {
    incomeChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: '主動收入累積金額',
          data: amounts,
          borderColor: 'green',
          backgroundColor: 'lightgreen',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: '金額（NT$）'
            }
          },
          x: {
            title: {
              display: true,
              text: '日期'
            }
          }
        }
      }
    });
  }
}
