// REPLACE with your actual Supabase credentials
const SB_URL = 'sb_publishable_rcJDQP06IO3Ya1h9tWhK1g_eyQ41oAB';
const SB_KEY = 'sb_secret_UhGIzthNtCTREhIWDjq5fg_uxpHgEnV';
const supabase = exports.supabase.createClient(SB_URL, SB_KEY);

let selectedNumbers = [];
let timeLeft = 60;
let currentBet = 10;

// Initialize Board
const board = document.getElementById('board');
for (let i = 1; i <= 80; i++) {
    const btn = document.createElement('div');
    btn.className = 'number-btn';
    btn.innerText = i;
    btn.onclick = () => {
        if (selectedNumbers.includes(i)) {
            selectedNumbers = selectedNumbers.filter(n => n !== i);
            btn.classList.remove('selected');
        } else if (selectedNumbers.length < 10) {
            selectedNumbers.push(i);
            btn.classList.add('selected');
        }
        document.getElementById('count-display').innerText = `${selectedNumbers.length}/10`;
    };
    board.appendChild(btn);
}

function updateBet(val) {
    if (currentBet + val >= 10 && currentBet + val <= 1000) {
        currentBet += val;
        document.getElementById('bet-display').innerText = currentBet;
    }
}

// Timer and Draw Logic
setInterval(() => {
    timeLeft--;
    const bar = document.getElementById('timer-bar');
    const text = document.getElementById('timer-text');
    bar.style.width = `${(timeLeft / 60) * 100}%`;
    text.innerText = `${timeLeft}s`;

    if (timeLeft <= 0) {
        runDraw();
        timeLeft = 60;
    }
}, 1000);

async function runDraw() {
    // Reset board UI
    document.querySelectorAll('.number-btn').forEach(b => b.classList.remove('winner'));
    
    // Generate 20 random winners
    const winners = [];
    while(winners.length < 20) {
        let r = Math.floor(Math.random() * 80) + 1;
        if(!winners.includes(r)) winners.push(r);
    }

    // Save to Supabase
    await supabase.from('keno_draws').insert([{ winning_numbers: winners }]);

    // Animate Winners
    winners.forEach((num, index) => {
        setTimeout(() => {
            board.children[num-1].classList.add('winner');
        }, index * 200);
    });
}
