let currentBet = 10;
let selectedNumbers = [];
let timeLeft = 60;
const supabaseUrl = window.env?.SUPABASE_URL || 'sb_publishable_rcJDQP06IO3Ya1h9tWhK1g_eyQ41oAB';
const supabaseKey = window.env?.SUPABASE_KEY || 'sb_secret_UhGIzthNtCTREhIWDjq5fg_uxpHgEnV';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Keno server running on port ${port}`);
});

const express = require('express');
const app = express();
app.use(express.static('.')); // This serves your index.html
// Initialize Board
const board = document.getElementById('board');
for (let i = 1; i <= 80; i++) {
    const btn = document.createElement('div');
    btn.className = 'number-btn';
    btn.innerText = i;
    btn.onclick = () => toggleNumber(i, btn);
    board.appendChild(btn);
}

function toggleNumber(num, element) {
    if (selectedNumbers.includes(num)) {
        selectedNumbers = selectedNumbers.filter(n => n !== num);
        element.classList.remove('selected');
    } else if (selectedNumbers.length < 10) {
        selectedNumbers.push(num);
        element.classList.add('selected');
    }
    document.getElementById('count-display').innerText = `${selectedNumbers.length}/10`;
}

function updateBet(amount) {
    if (currentBet + amount >= 5 && currentBet + amount <= 1000) {
        currentBet += amount;
        document.getElementById('bet-display').innerText = `${currentBet} ETB`;
    }
}

// Timer Logic
function startTimer() {
    const timerInterval = setInterval(() => {
        timeLeft--;
        const percentage = (timeLeft / 60) * 100;
        document.getElementById('timer-bar').style.width = percentage + "%";
        document.getElementById('timer-text').innerText = timeLeft + "s";

        if (timeLeft <= 0) {
            triggerDraw();
            timeLeft = 60; // Reset
        }
    }, 1000);
}

function triggerDraw() {
    // Reset colors from previous draw
    document.querySelectorAll('.number-btn').forEach(btn => {
        btn.classList.remove('winner', 'hit');
    });

    const winners = [];
    const pool = Array.from({length: 80}, (_, i) => i + 1);

    while (winners.length < 20) {
        const idx = Math.floor(Math.random() * pool.length);
        winners.push(pool.splice(idx, 1)[0]);
    }

    winners.forEach((num, i) => {
        setTimeout(() => {
            const btn = board.children[num - 1];
            if (selectedNumbers.includes(num)) {
                btn.classList.add('hit');
            } else {
                btn.classList.add('winner');
            }
            if (i === 19) updateHistoryUI(winners);
        }, i * 300);
    });
}

function updateHistoryUI(winners) {
    const list = document.getElementById('history-list');
    const item = document.createElement('li');
    item.className = 'history-item';
    item.innerText = `Draw: ${winners.slice(0, 8).join(', ')}...`;
    list.prepend(item);
}

startTimer();
