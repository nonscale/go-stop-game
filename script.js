const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const playerHandDiv = document.getElementById('player-hand');
    const aiHandDiv = document.getElementById('ai-hand');
    const floorDiv = document.getElementById('floor');
    const playerScoreSpan = document.getElementById('player-score');
    const aiScoreSpan = document.getElementById('ai-score');
    const playerMoneySpan = document.getElementById('player-money');
    const aiMoneySpan = document.getElementById('ai-money');

    playerHandDiv.addEventListener('click', (e) => {
        if (currentPlayer !== 'player' || isGoStopTurn) return;
        const cardDiv = e.target.closest('.card');
        if (cardDiv && cardDiv.dataset.cardId) {
            const cardId = parseInt(cardDiv.dataset.cardId, 10);
            playTurn('player', cardId);
        }
    });

    // Popup Elements
    const popupOverlay = document.getElementById('popup-overlay');
    const popupTitle = document.getElementById('popup-title');
    const popupMessage = document.getElementById('popup-message');
    const popupChoicesDiv = document.getElementById('popup-choices');
    const popupModal = document.getElementById('popup-modal');

    // --- Card Definitions ---
    const CARDS = [];
    const TYPES = { GWANG: 'gwang', YEOL: 'yeol', TTI: 'tti', PI: 'pi' };
    const TYPE_VALUES = { 'gwang': 4, 'yeol': 3, 'tti': 2, 'pi': 1 };

    CARDS.push({ id: 1, month: 1, type: TYPES.GWANG, name: '1월 (광)', image: 'Hanafuda_January_Hikari_Alt.svg.png' });
    CARDS.push({ id: 2, month: 1, type: TYPES.TTI, name: '1월 (홍단)', image: 'Hanafuda_January_Tanzaku_Alt.svg.png' });
    CARDS.push({ id: 3, month: 1, type: TYPES.PI, name: '1월 (피)', image: 'Hanafuda_January_Kasu_1_Alt.svg.png' });
    CARDS.push({ id: 4, month: 1, type: TYPES.PI, name: '1월 (피)', image: 'Hanafuda_January_Kasu_2_Alt.svg.png' });
    CARDS.push({ id: 5, month: 2, type: TYPES.YEOL, name: '2월 (고도리)', image: 'Hanafuda_February_Tane_Alt.svg.png' });
    CARDS.push({ id: 6, month: 2, type: TYPES.TTI, name: '2월 (홍단)', image: 'Hanafuda_February_Tanzaku_Alt.svg.png' });
    CARDS.push({ id: 7, month: 2, type: TYPES.PI, name: '2월 (피)', image: 'Hanafuda_February_Kasu_1_Alt.svg.png' });
    CARDS.push({ id: 8, month: 2, type: TYPES.PI, name: '2월 (피)', image: 'Hanafuda_February_Kasu_2_Alt.svg.png' });
    CARDS.push({ id: 9, month: 3, type: TYPES.GWANG, name: '3월 (광)', image: 'Hanafuda_March_Hikari_Alt.svg.png' });
    CARDS.push({ id: 10, month: 3, type: TYPES.TTI, name: '3월 (홍단)', image: 'Hanafuda_March_Tanzaku_Alt.svg.png' });
    CARDS.push({ id: 11, month: 3, type: TYPES.PI, name: '3월 (피)', image: 'Hanafuda_March_Kasu_1_Alt.svg.png' });
    CARDS.push({ id: 12, month: 3, type: TYPES.PI, name: '3월 (피)', image: 'Hanafuda_March_Kasu_2_Alt.svg.png' });
    CARDS.push({ id: 13, month: 4, type: TYPES.YEOL, name: '4월 (고도리)', image: 'Hanafuda_April_Tane_Alt.svg.png' });
    CARDS.push({ id: 14, month: 4, type: TYPES.TTI, name: '4월 (초단)', image: 'Hanafuda_April_Tanzaku_Alt.svg.png' });
    CARDS.push({ id: 15, month: 4, type: TYPES.PI, name: '4월 (피)', image: 'Hanafuda_April_Kasu_1_Alt.svg.png' });
    CARDS.push({ id: 16, month: 4, type: TYPES.PI, name: '4월 (피)', image: 'Hanafuda_April_Kasu_2_Alt.svg.png' });
    CARDS.push({ id: 17, month: 5, type: TYPES.YEOL, name: '5월 (끗)', image: 'Hanafuda_May_Tane_Alt.svg.png' });
    CARDS.push({ id: 18, month: 5, type: TYPES.TTI, name: '5월 (초단)', image: 'Hanafuda_May_Tanzaku_Alt.svg.png' });
    CARDS.push({ id: 19, month: 5, type: TYPES.PI, name: '5월 (피)', image: 'Hanafuda_May_Kasu_1_Alt.svg.png' });
    CARDS.push({ id: 20, month: 5, type: TYPES.PI, name: '5월 (피)', image: 'Hanafuda_May_Kasu_2_Alt.svg.png' });
    CARDS.push({ id: 21, month: 6, type: TYPES.YEOL, name: '6월 (끗)', image: 'Hanafuda_June_Tane_Alt.svg.png' });
    CARDS.push({ id: 22, month: 6, type: TYPES.TTI, name: '6월 (청단)', image: 'Hanafuda_June_Tanzaku_Alt.svg.png' });
    CARDS.push({ id: 23, month: 6, type: TYPES.PI, name: '6월 (피)', image: 'Hanafuda_June_Kasu_1_Alt.svg.png' });
    CARDS.push({ id: 24, month: 6, type: TYPES.PI, name: '6월 (피)', image: 'Hanafuda_June_Kasu_2_Alt.svg.png' });
    CARDS.push({ id: 25, month: 7, type: TYPES.YEOL, name: '7월 (끗)', image: 'Hanafuda_July_Tane_Alt.svg.png' });
    CARDS.push({ id: 26, month: 7, type: TYPES.TTI, name: '7월 (초단)', image: 'Hanafuda_July_Tanzaku_Alt.svg.png' });
    CARDS.push({ id: 27, month: 7, type: TYPES.PI, name: '7월 (피)', image: 'Hanafuda_July_Kasu_1_Alt.svg.png' });
    CARDS.push({ id: 28, month: 7, type: TYPES.PI, name: '7월 (피)', image: 'Hanafuda_July_Kasu_2_Alt.svg.png' });
    CARDS.push({ id: 29, month: 8, type: TYPES.GWANG, name: '8월 (광)', image: 'Hanafuda_August_Hikari_Alt.svg.png' });
    CARDS.push({ id: 30, month: 8, type: TYPES.YEOL, name: '8월 (고도리)', image: 'Hanafuda_August_Tane_Alt.svg.png' });
    CARDS.push({ id: 31, month: 8, type: TYPES.PI, name: '8월 (피)', image: 'Hanafuda_August_Kasu_1_Alt.svg.png' });
    CARDS.push({ id: 32, month: 8, type: TYPES.PI, name: '8월 (피)', image: 'Hanafuda_August_Kasu_2_Alt.svg.png' });
    CARDS.push({ id: 33, month: 9, type: TYPES.YEOL, name: '9월 (끗)', isDoublePi: true, image: 'Hanafuda_September_Tane_Alt.svg.png' });
    CARDS.push({ id: 34, month: 9, type: TYPES.TTI, name: '9월 (청단)', image: 'Hanafuda_September_Tanzaku_Alt.svg.png' });
    CARDS.push({ id: 35, month: 9, type: TYPES.PI, name: '9월 (피)', image: 'Hanafuda_September_Kasu_1_Alt.svg.PNG' });
    CARDS.push({ id: 36, month: 9, type: TYPES.PI, name: '9월 (피)', image: 'Hanafuda_September_Kasu_2_Alt.svg.png' });
    CARDS.push({ id: 37, month: 10, type: TYPES.YEOL, name: '10월 (끗)', image: 'Hanafuda_October_Tane_Alt.svg.png' });
    CARDS.push({ id: 38, month: 10, type: TYPES.TTI, name: '10월 (청단)', image: 'Hanafuda_October_Tanzaku_Alt.svg.png' });
    CARDS.push({ id: 39, month: 10, type: TYPES.PI, name: '10월 (피)', image: 'Hanafuda_October_Kasu_1_Alt.svg.png' });
    CARDS.push({ id: 40, month: 10, type: TYPES.PI, name: '10월 (피)', image: 'Hanafuda_October_Kasu_2_Alt.svg.png' });
    CARDS.push({ id: 41, month: 11, type: TYPES.GWANG, name: '11월 (오동광)', image: 'Hanafuda_November_Hikari_Alt.svg.png' });
    CARDS.push({ id: 42, month: 11, type: TYPES.TTI, name: '11월 (띠)', image: 'Hanafuda_November_Tanzaku_Alt.svg.png' });
    CARDS.push({ id: 43, month: 11, type: TYPES.PI, name: '11월 (피)', image: 'Hanafuda_November_Tane_Alt.svg.png' }); // NOTE: Data is PI, but image is for Tane(YEOL).
    CARDS.push({ id: 44, month: 11, type: TYPES.PI, name: '11월 (피)', image: 'Hanafuda_November_Kasu_Alt.svg.png' });
    CARDS.push({ id: 45, month: 12, type: TYPES.GWANG, name: '12월 (비광)', isBiGwang: true, image: 'Hanafuda_December_Hikari_Alt.svg.png' });
    CARDS.push({ id: 46, month: 12, type: TYPES.TTI, name: '12월 (띠)', image: 'Hanafuda_December_Kasu_1_Alt.svg.png' }); // NOTE: Data is TTI, but image is for Kasu(PI). Missing Tanzaku image.
    CARDS.push({ id: 47, month: 12, type: TYPES.YEOL, name: '12월 (끗)', isDoublePi: true, image: 'Hanafuda_December_Kasu_2_Alt.svg.png' }); // NOTE: Data is YEOL, but image is for Kasu(PI).
    CARDS.push({ id: 48, month: 12, type: TYPES.PI, name: '12월 (피)', image: 'Hanafuda_December_Kasu_3_Alt.svg.png' });

    // --- Game State ---
    let deck, floor, playerHand, aiHand, playerCaptured, aiCaptured, currentPlayer, aiStaging;
    let playerMoney, aiMoney;
    let ppukStacks = [], playerShake = false, aiShake = false, canShake = false, playerGoCount = 0, aiGoCount = 0, hasBeenOfferedShake = false;
    let isGoStopTurn = false;

    function loadGameData() {
        playerMoney = parseInt(localStorage.getItem('goStopPlayerMoney_v2') || '50000');
        aiMoney = parseInt(localStorage.getItem('goStopAiMoney_v2') || '50000');
        playerMoneySpan.textContent = playerMoney;
        aiMoneySpan.textContent = aiMoney;
    }

    function saveMoney() {
        localStorage.setItem('goStopPlayerMoney_v2', playerMoney);
        localStorage.setItem('goStopAiMoney_v2', aiMoney);
    }

    // --- UI Functions ---
    function createCardDiv(card, isCaptured = false) {
        const div = document.createElement('div');
        div.classList.add(isCaptured ? 'captured-card' : 'card');
        if (card) {
            div.dataset.cardId = card.id;
        }
        const img = document.createElement('img');
        img.src = card ? `images/${card.image}` : 'images/Hanafuda_card_back_Alt.svg.png';
        img.alt = card ? card.name : 'Card Back';
        div.appendChild(img);
        return div;
    }

    function render() {
        playerHandDiv.innerHTML = '';
        aiHandDiv.innerHTML = '';
        floorDiv.innerHTML = '';
        document.getElementById('ai-staging-area').innerHTML = ''; // Clear staging area

        playerHand.sort((a, b) => a.month - b.month);
        playerHand.forEach(card => playerHandDiv.appendChild(createCardDiv(card)));
        aiHand.forEach(() => { aiHandDiv.appendChild(createCardDiv(null)); });
        floor.forEach(card => floorDiv.appendChild(createCardDiv(card)));
        if (aiStaging) { // Render staging area
            aiStaging.forEach(card => document.getElementById('ai-staging-area').appendChild(createCardDiv(card)));
        }

        const renderCaptured = (playerPrefix, capturedCards) => {
            const gwangDiv = document.getElementById(`${playerPrefix}-gwang`);
            const yeolDiv = document.getElementById(`${playerPrefix}-yeol`);
            const ttiDiv = document.getElementById(`${playerPrefix}-tti`);
            const piDiv = document.getElementById(`${playerPrefix}-pi`);
            gwangDiv.innerHTML = '';
            yeolDiv.innerHTML = '';
            ttiDiv.innerHTML = '';
            piDiv.innerHTML = '';
            let gwangCount = 0, yeolCount = 0, ttiCount = 0, piCount = 0;
            let gwangIndex = 0, yeolIndex = 0, ttiIndex = 0, piIndex = 0;
            const overlap = 12;
            capturedCards.sort((a, b) => a.month - b.month).forEach(card => {
                const cardDiv = createCardDiv(card, true);
                if (card.type === TYPES.GWANG) {
                    cardDiv.style.left = `${gwangIndex++ * overlap}px`;
                    gwangDiv.appendChild(cardDiv);
                    gwangCount++;
                } else if (card.type === TYPES.YEOL) {
                    cardDiv.style.left = `${yeolIndex++ * overlap}px`;
                    yeolDiv.appendChild(cardDiv);
                    yeolCount++;
                } else if (card.type === TYPES.TTI) {
                    cardDiv.style.left = `${ttiIndex++ * overlap}px`;
                    ttiDiv.appendChild(cardDiv);
                    ttiCount++;
                } else if (card.type === TYPES.PI) {
                    cardDiv.style.left = `${piIndex++ * overlap}px`;
                    piDiv.appendChild(cardDiv);
                    piCount += card.isDoublePi ? 2 : 1;
                }
            });
            document.getElementById(`${playerPrefix}-gwang-count`).textContent = gwangCount;
            document.getElementById(`${playerPrefix}-yeol-count`).textContent = yeolCount;
            document.getElementById(`${playerPrefix}-tti-count`).textContent = ttiCount;
            document.getElementById(`${playerPrefix}-pi-count`).textContent = piCount;
        };
        renderCaptured('player', playerCaptured);
        renderCaptured('ai', aiCaptured);
        playerMoneySpan.textContent = playerMoney;
        aiMoneySpan.textContent = aiMoney;
        playerScoreSpan.textContent = calculateScore(playerCaptured).score;
        aiScoreSpan.textContent = calculateScore(aiCaptured).score;
        document.getElementById('deck-count').textContent = deck.length;
    }

    function hidePopup() {
        popupOverlay.classList.add('hidden');
    }

    function showPopup(title, message, buttons) {
        return new Promise(resolve => {
            popupTitle.textContent = title;
            popupMessage.textContent = message;
            popupChoicesDiv.innerHTML = '';
            popupChoicesDiv.style.display = 'none';

            const popupButtonsDiv = document.getElementById('popup-buttons');
            popupButtonsDiv.innerHTML = ''; // Clear old buttons

            buttons.forEach(buttonInfo => {
                const btn = document.createElement('button');
                if (buttonInfo.id) {
                    btn.id = buttonInfo.id;
                }
                btn.textContent = buttonInfo.text;
                btn.addEventListener('click', () => {
                    hidePopup();
                    resolve(buttonInfo.value);
                }, { once: true });
                popupButtonsDiv.appendChild(btn);
            });

            popupOverlay.classList.remove('hidden');
        });
    }

    async function showNotificationPopup(title, message) {
        await showPopup(title, message, [{ text: '확인', value: 'ok' }]);
    }

    function showChoicePopup(playedCard, choices) {
        return new Promise(resolve => {
            popupTitle.textContent = '카드 선택';
            popupMessage.textContent = '가져올 카드를 선택하세요.';
            popupChoicesDiv.innerHTML = '';

            choices.forEach(card => {
                const choiceCardDiv = createCardDiv(card);
                choiceCardDiv.addEventListener('click', () => {
                    hidePopup();
                    resolve(card); // Resolve with the chosen card object
                }, { once: true });
                popupChoicesDiv.appendChild(choiceCardDiv);
            });

            document.getElementById('popup-buttons').innerHTML = ''; // No buttons for this popup
            popupChoicesDiv.style.display = 'flex';
            popupOverlay.classList.remove('hidden');
        });
    }

    function shuffleDeck(array) {
        let currentIndex = array.length,  randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex > 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    async function startGame(startingPlayer = 'player') {
        deck = shuffleDeck([...CARDS]); // Using new shuffle algorithm
        playerHand = []; aiHand = []; floor = []; playerCaptured = []; aiCaptured = []; aiStaging = [];
        ppukStacks = []; 
        playerShake = false; aiShake = false; 
        playerGoCount = 0; aiGoCount = 0;
        canShake = false; isGoStopTurn = false; hasBeenOfferedShake = false;
        for (let i = 0; i < 10; i++) { playerHand.push(deck.pop()); aiHand.push(deck.pop()); }
        for (let i = 0; i < 8; i++) { floor.push(deck.pop()); }
        currentPlayer = startingPlayer;
        render();

        // Nagari (misdeal) check for 4 cards of the same month
        const checkForFourOfAMonth = (cardArray) => {
            const counts = cardArray.reduce((acc, card) => {
                acc[card.month] = (acc[card.month] || 0) + 1;
                return acc;
            }, {});
            return Object.values(counts).some(count => count >= 4);
        };

        const playerHas4 = checkForFourOfAMonth(playerHand);
        const aiHas4 = checkForFourOfAMonth(aiHand);
        const floorHas4 = checkForFourOfAMonth(floor);

        if (playerHas4 || aiHas4 || floorHas4) {
            let reason = "";
            if (playerHas4) reason = "플레이어의 패에 같은 월의 패가 4장 있습니다.";
            else if (aiHas4) reason = "AI의 패에 같은 월의 패가 4장 있습니다.";
            else if (floorHas4) reason = "바닥에 같은 월의 패가 4장 깔렸습니다.";
            
            await showNotificationPopup("재시작 (나가리)", `${reason} 판을 다시 시작합니다.`);
            startGame(startingPlayer);
            return;
        }

        if (currentPlayer === 'ai') {
            playerHandDiv.style.pointerEvents = 'none';
            setTimeout(aiTurn, 1000);
        } else {
            playerHandDiv.style.pointerEvents = 'auto';
            try {
                await handleSpecialActions();
            } catch (e) {
                console.error("Error during special actions at start:", e);
                await showNotificationPopup("오류 발생", "게임 시작 중 오류가 발생했습니다: " + e.message);
            }
        }
    }

    async function endRound(winner) {
        let message;
        if (winner === 'draw') {
            message = "이번 판은 무승부입니다!";
        } else {
            const winnerName = winner === 'player' ? '김여사' : '서울할머니';
            const winnerCaptured = winner === 'player' ? playerCaptured : aiCaptured;
            const loserCaptured = winner === 'player' ? aiCaptured : playerCaptured;
            const winnerGoCount = winner === 'player' ? playerGoCount : aiGoCount;
            const loserGoCount = winner === 'player' ? aiGoCount : playerGoCount;
            const winnerShake = winner === 'player' ? playerShake : aiShake;

            const winnerScoreInfo = calculateScore(winnerCaptured);
            const loserScoreInfo = calculateScore(loserCaptured);
            
            let scoreBeforeMultiplier = winnerScoreInfo.score;
            let messageLines = [];
            let multiplier = 1;

            // Add Go bonus points before calculating multipliers
            if (winnerGoCount === 1) scoreBeforeMultiplier += 1;
            if (winnerGoCount === 2) scoreBeforeMultiplier += 2;

            // Calculate all multipliers
            if (winnerGoCount >= 3) {
                const goMultiplier = (2 ** (winnerGoCount - 2));
                multiplier *= goMultiplier;
                messageLines.push(`- ${winnerGoCount}고! x${goMultiplier}`);
            }
            if (loserGoCount >= 1) {
                multiplier *= 2;
                messageLines.push(`- 고박! x2`);
            }
            if (winnerShake) {
                multiplier *= 2;
                messageLines.push(`- 흔들기! x2`);
            }
            const gwangBak = winnerScoreInfo.gwangCount >= 3 && loserScoreInfo.gwangCount === 0;
            if (gwangBak) {
                multiplier *= 2;
                messageLines.push(`- 광박! x2`);
            }
            const piBak = winnerScoreInfo.piCount >= 10 && loserScoreInfo.piCount < 5;
            if (piBak) {
                multiplier *= 2;
                messageLines.push(`- 피박! x2`);
            }

            // Final score calculation
            const finalScore = scoreBeforeMultiplier * multiplier;
            const finalWinnings = finalScore * 100;

            // Build detailed message
            message = `${winnerName}님이 ${finalScore}점으로 승리!`;
            let scoreDetail = `(기본: ${winnerScoreInfo.score}점`;
            if (winnerGoCount === 1) scoreDetail += `, 1고: +1점`;
            if (winnerGoCount === 2) scoreDetail += `, 2고: +2점`;
            scoreDetail += `)`;
            message += `
${scoreDetail}`;

            if (messageLines.length > 0) {
                message += "\n" + messageLines.join('\n');
            }

            if (winner === 'player') {
                playerMoney += finalWinnings;
                aiMoney -= finalWinnings;
            } else {
                if (playerMoney - finalWinnings <= 1) {
                    aiMoney += playerMoney - 1;
                    playerMoney = 1;
                } else {
                    aiMoney += finalWinnings;
                    playerMoney -= finalWinnings;
                }
            }
            
            saveMoney();
            render();
            message += `

총 획득 금액: ${finalWinnings}원`;
        }

        await showPopup("라운드 종료", message, [{ text: '다음 판', value: 'next'}]);

        // Check for bankruptcy and reset if needed
        if (playerMoney <= 0) {
            const message = "게임머니를 다 잃으셨군요..ㅠㅠ\n\n서울할머니 나빠!!\n\n실망하지 마세요 5만원을 다시 지원해 드리릴께요~~\\n\n화이팅!!";
            await showPopup("파산!", message, [{ text: '다시 시작', value: 'restart'}]);
            playerMoney = 50000;
            aiMoney = 50000;
            saveMoney();
            loadGameData(); // To update UI from new saved values
        } else if (aiMoney <= 0) {
            await showPopup("게임 종료", `서울할머니가 파산했습니다! 새 게임을 시작합니다.`, [{ text: '새 게임', value: 'new'}]);
            playerMoney = 50000;
            aiMoney = 50000;
            saveMoney();
            loadGameData();
        }
        
        await startGame(winner === 'draw' ? 'player' : winner);
    }

    function chooseBestCard(cards) {
        return cards.sort((a, b) => TYPE_VALUES[b.type] - TYPE_VALUES[a.type])[0];
    }

    function stealPi(player) {
        const opponent = player === 'player' ? 'ai' : 'player';
        const opponentCaptured = opponent === 'player' ? playerCaptured : aiCaptured;
        const playerCapturedPile = player === 'player' ? playerCaptured : aiCaptured;

        // Prefer to steal a single pi
        let stolenCardIndex = opponentCaptured.findIndex(c => c.type === TYPES.PI && !c.isDoublePi);
        
        // If no single pi, steal a double pi that is also a YEOL/끗
        if (stolenCardIndex === -1) {
            stolenCardIndex = opponentCaptured.findIndex(c => c.isDoublePi && c.type === TYPES.YEOL);
        }

        // If still no card, steal any double pi
        if (stolenCardIndex === -1) {
            stolenCardIndex = opponentCaptured.findIndex(c => c.isDoublePi);
        }
        
        // If still no card, check for any PI card (this is a fallback)
        if (stolenCardIndex === -1) {
            stolenCardIndex = opponentCaptured.findIndex(c => c.type === TYPES.PI);
        }

        if (stolenCardIndex > -1) {
            const stolenCard = opponentCaptured.splice(stolenCardIndex, 1)[0];
            playerCapturedPile.push(stolenCard);
            render();
        }
    }

    async function playTurn(player, cardId) {
        // This function is now ONLY for the human player.
        if (player === 'ai') {
            console.error("playTurn should not be called for AI anymore.");
            return;
        }
        try {
            if (currentPlayer !== player) return;

            const hand = playerHand; // Always player's hand
            const playedCard = hand.find(c => c.id === cardId);
            if (!playedCard) return;

            hand.splice(hand.findIndex(c => c.id === cardId), 1);
            let turnCaptures = [];
            let justPlayedOnFloor = null;

            const ppukIndex = ppukStacks.indexOf(playedCard.month);
            if (ppukIndex > -1) {
                const playerName = '김여사';
                await showNotificationPopup("뻑!", `${playerName}님이 ${playedCard.month}월 뻑을 해결했습니다!`);
                ppukStacks.splice(ppukIndex, 1);
                const ppukCards = floor.filter(c => c.month === playedCard.month);
                floor = floor.filter(c => c.month !== playedCard.month);
                turnCaptures.push(playedCard, ...ppukCards);
                await stealPi(player);
                await finishTurn(player, turnCaptures, null);
                return;
            }

            const matches = floor.filter(c => c.month === playedCard.month);
            if (matches.length === 0) {
                floor.push(playedCard);
                justPlayedOnFloor = playedCard;
                await finishTurn(player, [], justPlayedOnFloor);
            } else if (matches.length === 1) {
                const match = matches[0];
                floor.splice(floor.findIndex(c => c.id === match.id), 1);
                turnCaptures.push(playedCard, match);
                await finishTurn(player, turnCaptures, null, playedCard.month);
            } else { // More than one match
                let chosenCard = await showChoicePopup(playedCard, matches);
                floor.splice(floor.findIndex(c => c.id === chosenCard.id), 1);
                turnCaptures.push(playedCard, chosenCard);
                await finishTurn(player, turnCaptures, null, playedCard.month);
            }
        } catch (e) {
            console.error("Error during playTurn:", e);
            await showNotificationPopup("오류 발생", "플레이 중 오류가 발생했습니다: " + e.message);
        }
    }

    async function finishTurn(player, turnCaptures, justPlayedOnFloor, playedMonth = null) {
        // This function is now ONLY for the human player.
        if (player === 'ai') {
            console.error("finishTurn should not be called for AI anymore.");
            return;
        }
        const mainCaptured = playerCaptured;
        let capturedInTurn = turnCaptures.length > 0;

        if (deck.length === 0) {
            await endRound('draw');
            return;
        }

        const drawnCard = deck.pop();
        render(); // Update deck count immediately

        // Animate the flip
        const cardDiv = createCardDiv(drawnCard);
        cardDiv.style.position = 'absolute';
        const deckAreaRect = document.getElementById('deck-area').getBoundingClientRect();
        const gameBoardRect = document.getElementById('game-board').getBoundingClientRect();
        cardDiv.style.left = `${deckAreaRect.left - gameBoardRect.left}px`;
        cardDiv.style.top = `${deckAreaRect.top - gameBoardRect.top}px`;
        document.getElementById('game-board').appendChild(cardDiv);
        
        await sleep(100); // allow card to be added to DOM
        cardDiv.style.transition = 'transform 0.6s';
        cardDiv.style.transform = 'rotateY(180deg)';
        
        await sleep(300); // Mid-flip, switch image
        cardDiv.innerHTML = createCardDiv(drawnCard).innerHTML;
        await sleep(300); // Wait for flip to complete

        // Highlight the flipped card and its matches
        cardDiv.classList.add('highlight');
        const matches = floor.filter(c => c.month === drawnCard.month);
        matches.forEach(match => {
            const floorCardDiv = floorDiv.querySelector(`[data-card-id="${match.id}"]`);
            if(floorCardDiv) floorCardDiv.classList.add('highlight-green');
        });
        await sleep(2000); // Let player see the match

        document.getElementById('game-board').removeChild(cardDiv); // Remove animated card

        const isTadak = playedMonth !== null && playedMonth === drawnCard.month && floor.some(c => c.month === drawnCard.month);

        if (justPlayedOnFloor && drawnCard.month === justPlayedOnFloor.month) {
            const playerName = '김여사';
            await showNotificationPopup('쪽!', `${playerName}님, 쪽! 축하합니다!`);
            await stealPi(player);
            const idx = floor.findIndex(c => c.id === justPlayedOnFloor.id);
            if (idx > -1) {
                const card = floor.splice(idx, 1)[0];
                turnCaptures.push(card);
                capturedInTurn = true;
            }
        }

        if (matches.length === 0) {
            floor.push(drawnCard);
        } else if (matches.length === 1) {
            const match = matches[0];
            floor.splice(floor.findIndex(c => c.id === match.id), 1);
            turnCaptures.push(drawnCard, match);
            capturedInTurn = true;
        } else { // matches.length > 1
            const bestCard = chooseBestCard(matches);
            floor.splice(floor.findIndex(c => c.id === bestCard.id), 1);
            turnCaptures.push(drawnCard, bestCard);
            capturedInTurn = true;
            await showNotificationPopup("자동 선택", `바닥에 같은 월의 카드가 여러 장 있어, 가장 좋은 패(${bestCard.name})를 자동으로 획득합니다.`);
        }

        if (turnCaptures.length > 0) {
            mainCaptured.push(...turnCaptures);
        }

        if (isTadak) {
            const playerName = '김여사';
            await showNotificationPopup("따닥!", `${playerName}님의 따닥! 상대방의 피를 한 장 가져옵니다.`);
            await stealPi(player);
        }

        if (floor.length === 0 && capturedInTurn && deck.length > 0) {
             const playerName = '김여사';
             await showNotificationPopup("싹쓸이!", `${playerName}님이 바닥을 모두 쓸었습니다! 상대방의 피를 한 장 가져옵니다.`);
             await stealPi(player);
        }

        const counts = floor.reduce((acc, c) => { acc[c.month] = (acc[c.month] || 0) + 1; return acc; }, {});
        const ppukMonths = [];
        for (const m in counts) {
            if (counts[m] === 3 && !ppukStacks.includes(parseInt(m))) {
                ppukMonths.push(m);
                ppukStacks.push(parseInt(m));
            }
        }
        if (ppukMonths.length > 0) {
            const playerName = '김여사';
            await showNotificationPopup("뻑!", `${playerName}님의 턴에 뻑! - ${ppukMonths.join(', ')}월 카드가 바닥에 3장이 되었습니다!`);
        }

        render();
        const goStopTriggered = await updateScores(player);
        if (!goStopTriggered) {
            switchTurn(player);
        }
    }

    async function switchTurn(fromPlayer) {
        currentPlayer = fromPlayer === 'player' ? 'ai' : 'player';
        if (currentPlayer === 'ai') {
            playerHandDiv.style.pointerEvents = 'none';
            setTimeout(aiTurn, 1000);
        } else {
            playerHandDiv.style.pointerEvents = 'auto';
            try {
                await handleSpecialActions();
            } catch (e) {
                console.error("Error during special actions on player turn:", e);
                await showNotificationPopup("오류 발생", "게임 진행 중 오류가 발생했습니다: " + e.message);
            }
        }
    }

    async function handleSpecialActions() {
        if (isGoStopTurn) return;
        checkForSpecials();

        if (canShake && !playerShake && !hasBeenOfferedShake) {
            hasBeenOfferedShake = true; // Ask only once per round
            const choice = await showPopup('흔들기!', '패에 같은 월의 카드가 3장 있습니다. 흔드시겠습니까?',
                [
                    { text: '예', value: 'yes' },
                    { text: '아니오', value: 'no' }
                ]
            );
            if (choice === 'yes') {
                playerShake = true;
            }
        }
    }

    async function handleGoStopPopup() {
        isGoStopTurn = true;

        const choice = await showPopup('고 또는 스톱', `현재 점수는 ${calculateScore(playerCaptured).score}점 입니다. '고' 하시겠습니까?`, 
            [
                { text: '고', value: 'go' },
                { text: '스톱', value: 'stop' }
            ]
        );

        isGoStopTurn = false;
        if (choice === 'go') {
            playerGoCount++;
            await showNotificationPopup("고!", '김여사님이 고!를 외쳤습니다.');
            switchTurn('player');
        } else {
            await endRound('player');
        }
    }

    function checkForSpecials() {
        const hand = playerHand;
        const handCounts = hand.reduce((acc, c) => { acc[c.month] = (acc[c.month] || 0) + 1; return acc; }, {});
        canShake = false;
        for (const month in handCounts) {
            if (handCounts[month] >= 3) {
                canShake = true;
                break; // Found a shake, no need to check further
            }
        }
    }

    async function aiTurn() {
        try {
            if (currentPlayer !== 'ai') return;
            await sleep(500);

            const specialMove = getAISpecialMove();
            if (specialMove.action === 'shake') {
                aiShake = true;
                await showNotificationPopup("흔들기!", "서울할머니가 흔들었습니다! 이번 판은 점수 2배!");
            }

            const cardToPlay = getAIBestMove();
            if (cardToPlay) {
                await aiPlayTurn(cardToPlay);
            } else {
                await endRound('draw');
            }
        } catch (e) {
            console.error("Error during aiTurn:", e);
            await showNotificationPopup("오류 발생", "AI 턴 진행 중 오류가 발생했습니다: " + e.message);
        }
    }

    async function aiPlayTurn(playedCard) {
        aiStaging = []; // Ensure staging is clear at the start
        const ANIMATION_DELAY = 2000; // Adjusted for better pacing

        // --- PART 1: Play card from hand ---
        aiHand.splice(aiHand.findIndex(c => c.id === playedCard.id), 1);
        aiStaging.push(playedCard);
        render();
        await sleep(ANIMATION_DELAY);

        let handCardCaptures = [];
        const ppukIndex = ppukStacks.indexOf(playedCard.month);
        if (ppukIndex > -1) {
            await showNotificationPopup("뻑!", `서울할머니님이 ${playedCard.month}월 뻑을 해결했습니다!`);
            ppukStacks.splice(ppukIndex, 1);
            const ppukCards = floor.filter(c => c.month === playedCard.month);
            floor = floor.filter(c => c.month !== playedCard.month);
            handCardCaptures.push(...ppukCards, playedCard);
            await stealPi('ai');
        } else {
            const matches = floor.filter(c => c.month === playedCard.month);
            if (matches.length > 0) {
                let chosenCard = (matches.length > 1) ? chooseBestCard(matches) : matches[0];
                const floorCardDiv = floorDiv.querySelector(`[data-card-id="${chosenCard.id}"]`);
                if(floorCardDiv) floorCardDiv.classList.add('highlight-green');
                await sleep(ANIMATION_DELAY);

                floor.splice(floor.findIndex(c => c.id === chosenCard.id), 1);
                handCardCaptures.push(chosenCard, playedCard);
                if(floorCardDiv) floorCardDiv.classList.remove('highlight-green');
            } else {
                // No match from hand, card goes to floor
                floor.push(playedCard);
            }
        }
        
        aiStaging = handCardCaptures; // Only captured cards go to staging
        render();
        await sleep(ANIMATION_DELAY);

        // --- PART 2: Draw card from deck ---
        if (deck.length === 0) {
            aiCaptured.push(...handCardCaptures);
            aiStaging = [];
            render();
            await endRound('draw');
            return;
        }

        const drawnCard = deck.pop();
        render();

        const cardDiv = createCardDiv(null);
        cardDiv.style.position = 'absolute';
        const deckAreaRect = document.getElementById('deck-area').getBoundingClientRect();
        const gameBoardRect = document.getElementById('game-board').getBoundingClientRect();
        cardDiv.style.left = `${deckAreaRect.left - gameBoardRect.left}px`;
        cardDiv.style.top = `${deckAreaRect.top - gameBoardRect.top}px`;
        document.getElementById('game-board').appendChild(cardDiv);
        await sleep(100);
        cardDiv.style.transition = 'transform 0.6s';
        cardDiv.style.transform = 'rotateY(180deg)';
        await sleep(300);
        cardDiv.innerHTML = createCardDiv(drawnCard).innerHTML;
        await sleep(300);

        cardDiv.classList.add('highlight');
        const drawnCardMatches = floor.filter(c => c.month === drawnCard.month);
        drawnCardMatches.forEach(match => {
            const floorCardDiv = floorDiv.querySelector(`[data-card-id="${match.id}"]`);
            if(floorCardDiv) floorCardDiv.classList.add('highlight-green');
        });
        await sleep(ANIMATION_DELAY);
        document.getElementById('game-board').removeChild(cardDiv);

        // --- PART 3: Process captures and end turn ---
        let drawnCardCaptures = [];
        const playedMonth = playedCard.month;
        const isTadak = playedMonth !== null && playedMonth === drawnCard.month && floor.some(c => c.month === drawnCard.month);
        const justPlayedOnFloor = handCardCaptures.length === 0 && ppukIndex === -1;

        if (justPlayedOnFloor && drawnCard.month === playedCard.month) {
            await showNotificationPopup('쪽!', `서울할머니님, 쪽! 축하합니다!`);
            await stealPi('ai');
            const idx = floor.findIndex(c => c.id === playedCard.id);
            if (idx > -1) {
                drawnCardCaptures.push(floor.splice(idx, 1)[0], drawnCard);
            }
        } else if (drawnCardMatches.length > 0) {
            let chosenCard = (drawnCardMatches.length > 1) ? chooseBestCard(drawnCardMatches) : drawnCardMatches[0];
            floor.splice(floor.findIndex(c => c.id === chosenCard.id), 1);
            drawnCardCaptures.push(chosenCard, drawnCard);
        } else {
            floor.push(drawnCard); // No match, place on floor
        }

        const allCapturedThisTurn = [...handCardCaptures, ...drawnCardCaptures];
        aiCaptured.push(...allCapturedThisTurn);
        aiStaging = [];
        
        const capturedInTurn = allCapturedThisTurn.length > 0;

        if (isTadak) {
            await showNotificationPopup("따닥!", `서울할머니님의 따닥! 상대방의 피를 한 장 가져옵니다.`);
            await stealPi('ai');
        }

        if (floor.length === 0 && capturedInTurn && deck.length > 0) {
             await showNotificationPopup("싹쓸이!", `서울할머니님이 바닥을 모두 쓸었습니다! 상대방의 피를 한 장 가져옵니다.`);
             await stealPi('ai');
        }

        const counts = floor.reduce((acc, c) => { acc[c.month] = (acc[c.month] || 0) + 1; return acc; }, {});
        const ppukMonths = [];
        for (const m in counts) {
            if (counts[m] === 3 && !ppukStacks.includes(parseInt(m))) {
                ppukMonths.push(m);
                ppukStacks.push(parseInt(m));
            }
        }
        if (ppukMonths.length > 0) {
            await showNotificationPopup("뻑!", `서울할머니님의 턴에 뻑! - ${ppukMonths.join(', ')}월 카드가 바닥에 3장이 되었습니다!`);
        }

        render();
        const goStopTriggered = await updateScores('ai');
        if (!goStopTriggered) {
            switchTurn('ai');
        }
    }

    function getAISpecialMove() {
        const handCounts = aiHand.reduce((acc, c) => { acc[c.month] = (acc[c.month] || 0) + 1; return acc; }, {});
        
        if (!aiShake) {
            for (const month in handCounts) {
                if (handCounts[month] >= 3) {
                    return { action: 'shake' };
                }
            }
        }
        return { action: 'play' };
    }

    function calculateBestMove() {
        let bestMove = { card: null, score: -Infinity };

        for (const card of aiHand) {
            let currentScore = 0;
            const matches = floor.filter(c => c.month === card.month);

            if (matches.length > 0) {
                // This is a capture move
                const bestMatch = chooseBestCard(matches);
                currentScore += 10; // Base score for any capture
                currentScore += TYPE_VALUES[bestMatch.type] * 2;
                if (bestMatch.isDoublePi) currentScore += 5;

                // Bonus if it helps complete a Yaku
                const futureCaptures = [...aiCaptured, card, bestMatch];
                const scoreBefore = calculateScore(aiCaptured).score;
                const scoreAfter = calculateScore(futureCaptures).score;
                if (scoreAfter > scoreBefore) {
                    currentScore += (scoreAfter - scoreBefore) * 10;
                }

            } else {
                // This is a discard move
                currentScore -= TYPE_VALUES[card.type];
                if (card.isDoublePi) currentScore -= 5;

                // Penalty for giving player a good card. Check if player can take it.
                const playerHandHasMatch = playerHand.some(c => c.month === card.month);
                if(playerHandHasMatch) {
                    currentScore -= 10;
                }
            }

            if (currentScore > bestMove.score) {
                bestMove = { card: card, score: currentScore };
            }
        }

        return bestMove.card || (aiHand.length > 0 ? aiHand[Math.floor(Math.random() * aiHand.length)] : null);
    }

    function getWeeklyWinnings() {
        const today = new Date();
        const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
        let weeklyData = JSON.parse(localStorage.getItem('goStopWeeklyWinnings_v2'));

        // Check if a week has passed since the start date
        if (!weeklyData || (today.getTime() - new Date(weeklyData.startDate).getTime()) > oneWeekInMs) {
            weeklyData = {
                startDate: today.toISOString(),
                initialMoney: playerMoney
            };
            localStorage.setItem('goStopWeeklyWinnings_v2', JSON.stringify(weeklyData));
        }

        const winnings = playerMoney - weeklyData.initialMoney;
        return { amount: winnings };
    }

    function getAIBestMove() {
        // --- Desperation Mode ---
        if (aiMoney <= 20000) {
            return calculateBestMove();
        }

        // --- Dynamic Difficulty Logic ---
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
        const weeklyData = getWeeklyWinnings();
        const weeklyWinnings = weeklyData.amount;

        let difficulty = 'normal'; // normal, generous, greedy

        // Monday (1) to Wednesday (3)
        if (dayOfWeek >= 1 && dayOfWeek <= 3) {
            if (weeklyWinnings < 5000) {
                difficulty = 'generous'; // Player is behind, AI should be easier
            } else if (weeklyWinnings > 20000) {
                difficulty = 'greedy'; // Player is ahead, AI should be harder
            }
        }
        // Thursday (4) to Sunday (0)
        else {
            if (weeklyWinnings < 8000) {
                difficulty = 'generous';
            } else if (weeklyWinnings > 12000) {
                difficulty = 'greedy';
            }
        }

        // --- AI Move Selection ---
        // Make a random (bad) move based on difficulty
        const randomMoveChance = {
            'generous': 0.7, // 70% chance of random move
            'normal': 0.3,   // 30% chance of random move
            'greedy': 0,     // 0% chance of random move
        };

        if (Math.random() < randomMoveChance[difficulty]) {
            if (aiHand.length > 0) {
                return aiHand[Math.floor(Math.random() * aiHand.length)];
            }
        }

        // --- Original Best Move Logic ---
        return calculateBestMove();
    }

    async function updateScores(player) {
        const playerScoreInfo = calculateScore(playerCaptured);
        const aiScoreInfo = calculateScore(aiCaptured);

        if (player === 'player') {
            if (playerScoreInfo.score >= 7 && !isGoStopTurn && playerHand.length > 0) {
                await handleGoStopPopup();
                return true; // Go/Stop decision was handled
            }
        } else { // AI's turn
            if (aiScoreInfo.score >= 7 && !isGoStopTurn) {
                // AI stops if it can win
                await endRound('ai');
                return true; // Go/Stop decision was made
            }
        }
        
        // If the deck is empty and no one could make a move, end the round
        if (deck.length === 0 && playerHand.length === 0 && aiHand.length === 0) {
            const playerScore = calculateScore(playerCaptured).score;
            const aiScore = calculateScore(aiCaptured).score;
            if (playerScore > aiScore) {
                await endRound('player');
            } else if (aiScore > playerScore) {
                await endRound('ai');
            } else {
                await endRound('draw');
            }
            return true;
        }

        return false; // No Go/Stop decision
    }

    function calculateScore(captured) {
        if (!captured) {
            return { score: 0, piCount: 0, gwangCount: 0 };
        }

        let score = 0;
        const gwangs = captured.filter(c => c.type === TYPES.GWANG);
        const yeols = captured.filter(c => c.type === TYPES.YEOL);
        const ttis = captured.filter(c => c.type === TYPES.TTI);
        const pis = captured.filter(c => c.type === TYPES.PI || c.isDoublePi);
        if (gwangs.length >= 3) {
            if (gwangs.length === 5) score += 15;
            else if (gwangs.length === 4) score += 4;
            else score += gwangs.some(c => c.isBiGwang) ? 2 : 3;
        }
        if (ttis.length >= 5) score += ttis.length - 4;
        if (ttis.filter(c => [2, 6, 10].includes(c.id)).length === 3) score += 3; // Hong-dan
        if (ttis.filter(c => [22, 34, 38].includes(c.id)).length === 3) score += 3; // Cheong-dan
        if (ttis.filter(c => [14, 18, 26].includes(c.id)).length === 3) score += 3; // Cho-dan
        
        const godoriCards = yeols.filter(c => [5, 13, 30].includes(c.id));
        if (godoriCards.length === 3) score += 5;
        
        const nonGodoriYeols = yeols.filter(c => !godoriCards.includes(c));
        if (nonGodoriYeols.length + godoriCards.length >= 5) score += nonGodoriYeols.length + godoriCards.length - 4;
        
        const piCount = pis.reduce((acc, card) => acc + (card.isDoublePi ? 2 : 1), 0);
        if (piCount >= 10) score += piCount - 9;

        return { score, piCount, gwangCount: gwangs.length };
    }

    function checkForSpecials() {
        const hand = playerHand;
        const handCounts = hand.reduce((acc, c) => { acc[c.month] = (acc[c.month] || 0) + 1; return acc; }, {});
        canShake = false;
        for (const month in handCounts) {
            if (handCounts[month] >= 3) {
                canShake = true;
                break; // Found a shake, no need to check further
            }
        }
    }

    // --- Start Game ---
    (async () => {
        const welcomeShown = localStorage.getItem('goStopWelcomeShown');
        if (!welcomeShown) {
            popupModal.classList.add('welcome-popup');

            await showPopup(
                "보건복지부에서 온 편지",
                "안녕하세요 김여사님.\n\n열심히 산 당신께 5만원을 게임머니로 드렸습니다.\n저랑 게임해서 돈도 벌어서 손녀들에게 맛있는거 사주세요~",
                [{ text: '준비되면 누르세요', value: 'start' }]
            );

            popupModal.classList.remove('welcome-popup');
            localStorage.setItem('goStopWelcomeShown', 'true');
        }
        
        loadGameData();
        startGame();
    })();
});