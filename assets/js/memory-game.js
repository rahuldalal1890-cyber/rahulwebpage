document.addEventListener("DOMContentLoaded", () => {

    const board = document.getElementById("board");
    const movesSpan = document.getElementById("moves");
    const matchesSpan = document.getElementById("matches");
    const pairsTotalSpan = document.getElementById("pairsTotal");

    const btnStart = document.getElementById("startGame");
    const btnRestart = document.getElementById("restartGame");
    const difficultySelect = document.getElementById("difficulty");

    let moves = 0;
    let matches = 0;
    let totalPairs = 0;

    let firstCard = null;
    let lockBoard = false;

    const icons = ["🍎","🍌","🍇","🍒","🍑","🥝","🍉","🍍","🥥","🍓","🍈","🍋"];

    function shuffle(arr) {
        return arr.sort(() => Math.random() - 0.5);
    }

    function startGame() {
        board.innerHTML = "";
        moves = 0;
        matches = 0;
        lockBoard = false;
        firstCard = null;

        movesSpan.textContent = 0;
        matchesSpan.textContent = 0;

        let size = difficultySelect.value === "easy" ? 6 : 12;
        totalPairs = size;
        pairsTotalSpan.textContent = totalPairs;

        board.className = "memory-board " + (size === 6 ? "easy" : "hard");

        let selectedIcons = shuffle(icons).slice(0, size);
        let cardSet = shuffle([...selectedIcons, ...selectedIcons]);

        cardSet.forEach(icon => {
            const card = document.createElement("div");
            card.classList.add("memory-card");

            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">${icon}</div>
                    <div class="card-back">?</div>
                </div>
            `;

            card.addEventListener("click", () => flipCard(card));
            board.appendChild(card);
        });
    }

    function flipCard(card) {
        if (lockBoard) return;
        if (card === firstCard) return;

        card.classList.add("flipped");

        if (!firstCard) {
            firstCard = card;
            return;
        }

        moves++;
        movesSpan.textContent = moves;

        let secondIcon = card.querySelector(".card-front").textContent;
        let firstIconText = firstCard.querySelector(".card-front").textContent;

        if (firstIconText === secondIcon) {
            card.classList.add("matched");
            firstCard.classList.add("matched");
            firstCard = null;

            matches++;
            matchesSpan.textContent = matches;

            checkWin(); // 🔥 Check if all pairs matched
            return;
        }

        lockBoard = true;
        setTimeout(() => {
            card.classList.remove("flipped");
            firstCard.classList.remove("flipped");
            firstCard = null;
            lockBoard = false;
        }, 700);
    }

    btnStart.addEventListener("click", startGame);
    btnRestart.addEventListener("click", startGame);

    // ⭐ WIN CHECK INSIDE DOMContentLoaded
    function checkWin() {
        const total = document.querySelectorAll(".memory-card").length;
        const matched = document.querySelectorAll(".memory-card.matched").length;

        if (matched === total) {
            document.getElementById("winPopup").style.display = "flex";
        }
    }

    // ⭐ Play Again Button — MUST BE INSIDE SAME BLOCK
    document.getElementById("playAgainBtn").addEventListener("click", () => {
        document.getElementById("winPopup").style.display = "none"; 
        startGame(); // restart WITHOUT reloading
    });

});
