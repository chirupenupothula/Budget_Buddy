let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

const form = document.getElementById('transaction-form');
const list = document.getElementById('transaction-list');
const balanceEl = document.getElementById('balance');
const chartEl = document.getElementById('chart');

form.addEventListener('submit', e => {
  e.preventDefault();
  const desc = document.getElementById('desc').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const type = document.getElementById('type').value;
  const category = document.getElementById('category').value;

  const transaction = {
    id: Date.now(),
    desc,
    amount: type === 'expense' ? -amount : amount,
    category
  };

  transactions.push(transaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  form.reset();
  updateUI();
});

function updateUI() {
  list.innerHTML = '';
  let total = 0;
  let categoryTotals = {};

  transactions.forEach(t => {
    total += t.amount;
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Math.abs(t.amount);

    const li = document.createElement('li');
    li.textContent = `${t.desc} - ₹${Math.abs(t.amount)} (${t.category})`;
    list.appendChild(li);
  });

  balanceEl.textContent = total.toFixed(2);

  renderChart(categoryTotals);
}

let chart;
function renderChart(data) {
  const labels = Object.keys(data);
  const values = Object.values(data);

  if (chart) chart.destroy();
  chart = new Chart(chartEl, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        label: 'Spending',
        data: values,
        backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#9ccc65', '#ab47bc'],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}

updateUI();
