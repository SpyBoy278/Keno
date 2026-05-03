// CONFIG - REPLACE WITH YOUR KEYS
const SB_URL = 'sb_publishable_rcJDQP06IO3Ya1h9tWhK1g_eyQ41oAB';
const SB_KEY = 'sb_secret_UhGIzthNtCTREhIWDjq5fg_uxpHgEnV';
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

let selectedNumbers = [];
let currentBet = 10;
let balance = 1000;
let timeLeft = 60;
let isDrawing = false;

// Initialize Board
const board = document.getElementById('board');
for (let i = 1; i <= 80; i++) {
    const btn = document.createElement('div');
    btn.className = 'num-btn';
    btn.innerText = i;
    btn.onclick = () => {
        if (isDrawing) return;
        if (selectedNumbers.includes(i)) {
            selectedNumbers = selectedNumbers.filter(n => n !== i);
            btn.classList.remove('selected');
        } else if (selectedNumbers.length < 10) {
            selectedNumbers.push(i);
            btn.classList.add('selected');
        }
    };
    board.appendChild(btn);
}

function changeBet(amount) {
    if (currentBet + amount >= 10 && currentBet + amount <= 1000) {
        currentBet += amount;
        document.getElementById('bet-amount').innerText = currentBet;
    }
}

// Timer Logic
setInterval(() => {
    if (isDrawing) return;
    timeLeft--;
    document.getElementById('timer-bar').style.width = (timeLeft/60)*100 + '%';
    document.getElementById('timer-text').innerText = `Next Draw: ${timeLeft}s`;
    if (timeLeft <= 0) startDraw();
}, 1000);

async function startDraw() {
    isDrawing = true;
    timeLeft = 60;
    const liveArea = document.getElementById('live-draw');
    liveArea.innerHTML = '';
    document.querySelectorAll('.num-btn').forEach(b => b.classList.remove('winner'));

    let winners = [];
    while(winners.length < 20) {
        let r = Math.floor(Math.random() * 80) + 1;
        if(!winners.includes(r)) winners.push(r);
    }

    for (let num of winners) {
        await new Promise(r => setTimeout(r, 400));
        const ball = document.createElement('div');
        ball.className = 'draw-ball';
        ball.innerText = num;
        liveArea.appendChild(ball);
        board.children[num-1].classList.add('winner');
    }

    calculateWin(winners);
    isDrawing = false;
    selectedNumbers = [];
    document.querySelectorAll('.num-btn').forEach(b => b.classList.remove('selected'));
}

function calculateWin(winners) {
    const matches = selectedNumbers.filter(n => winners.includes(n)).length;
    const picked = selectedNumbers.length;
    const paytable = {
        1: {1: 3.8}, 2: {2: 14}, 3: {3: 45, 2: 2}, 
        4: {4: 150, 3: 5}, 5: {5: 500, 4: 20},
        10: {10: 10000, 9: 1000, 8: 100, 7: 20, 6: 5, 5: 2}
    };

    let multiplier = (paytable[picked] && paytable[picked][matches]) ? paytable[picked][matches] : 0;
    let win = currentBet * multiplier;
    balance += win;
    
    document.getElementById('balance').innerText = balance.toFixed(2);
    document.getElementById('last-win').innerText = win.toFixed(2);

    const hist = document.getElementById('history-list');
    hist.innerHTML = `<div class="history-item"><span>Matched ${matches}/${picked}</span><span>+${win} ETB</span></div>` + hist.innerHTML;
    }
