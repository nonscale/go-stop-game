document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const playerHandDiv = document.getElementById('player-hand');
    const aiHandDiv = document.getElementById('ai-hand');
    const floorDiv = document.getElementById('floor');
    const playerScoreSpan = document.getElementById('player-score');
    const aiScoreSpan = document.getElementById('ai-score');
    const weeklyWinningsSpan = document.getElementById('weekly-winnings');
    const playerMoneySpan = document.getElementById('player-money');
    const aiMoneySpan = document.getElementById('ai-money');

    // Popup Elements
    const popupOverlay = document.getElementById('popup-overlay');
    const popupTitle = document.getElementById('popup-title');
    const popupMessage = document.getElementById('popup-message');
    const popupYesBtn = document.getElementById('popup-yes-btn');
    const popupNoBtn = document.getElementById('popup-no-btn');
    const popupChoicesDiv = document.getElementById('popup-choices');

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
    CARDS.push({ id: 41, month: 11, type: TYPES.GWANG, name: '11월 (광)', image: 'Hanafuda_November_Hikari_Alt.svg.png' });
    CARDS.push({ id: 42, month: 11, type: TYPES.PI, name: '11월 (피)', image: 'Hanafuda_November_Tanzaku_Alt.svg.png' });
    CARDS.push({ id: 43, month: 11, type: TYPES.PI, name: '11월 (피)', image: 'Hanafuda_November_Tane_Alt.svg.png' });
    CARDS.push({ id: 44, month: 11, type: TYPES.PI, name: '11월 (쌍피)', isDoublePi: true, image: 'Hanafuda_November_Kasu_Alt.svg.png' });
    CARDS.push({ id: 45, month: 12, type: TYPES.GWANG, name: '12월 (비광)', isBiGwang: true, image: 'Hanafuda_December_Hikari_Alt.svg.png' });
    CARDS.push({ id: 46, month: 12, type: TYPES.YEOL, name: '12월 (끗)', isDoublePi: true, image: 'Hanafuda_December_Kasu_1_Alt.svg.png' });
    CARDS.push({ id: 47, month: 12, type: TYPES.TTI, name: '12월 (띠)', image: 'Hanafuda_December_Kasu_2_Alt.svg.png' });
    CARDS.push({ id: 48, month: 12, type: TYPES.PI, name: '12월 (피)', image: 'Hanafuda_December_Kasu_3_Alt.svg.png' });

    // --- Game State ---
    let deck, floor, playerHand, aiHand, playerCaptured, aiCaptured, currentPlayer;
    let playerMoney, aiMoney;
    let ppukStacks = [], playerShake = false, aiShake = false, canShake = false, playerGoCount = 0, aiGoCount = 0, hasBeenOfferedShake = false;
    let popupCallback = null;
    let isGoStopTurn = false;

    

    function loadGameData() {
        playerMoney = parseInt(localStorage.getItem('goStopPlayerMoney_v2') || '10000');
        aiMoney = parseInt(localStorage.getItem('goStopAiMoney_v2') || '10000');
        const weeklyWinnings = getWeeklyWinnings();
        weeklyWinningsSpan.textContent = `${weeklyWinnings.amount} 원`;
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
        if (card && card.isBomb) {
            div.classList.add('bomb');
            div.title = '폭탄으로 사용 가능한 카드입니다.';
        }
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
        playerHand.sort((a, b) => a.month - b.month);
        playerHand.forEach(card => playerHandDiv.appendChild(createCardDiv(card)));
        aiHand.forEach(() => { aiHandDiv.appendChild(createCardDiv(null)); });
        floor.forEach(card => floorDiv.appendChild(createCardDiv(card)));
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
        playerScoreSpan.textContent = calculateScore(playerCaptured, playerGoCount).score;
        aiScoreSpan.textContent = calculateScore(aiCaptured, aiGoCount).score;
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

    async function startGame(startingPlayer = 'player') {
        deck = [...CARDS].sort(() => Math.random() - 0.5);
        playerHand = []; aiHand = []; floor = []; playerCaptured = []; aiCaptured = [];
        ppukStacks = []; 
        playerShake = false; aiShake = false; 
        playerGoCount = 0; aiGoCount = 0;
        bombableMonth = null; canShake = false; isGoStopTurn = false; hasBeenOfferedShake = false;
        for (let i = 0; i < 10; i++) { playerHand.push(deck.pop()); aiHand.push(deck.pop()); }
        for (let i = 0; i < 8; i++) { floor.push(deck.pop()); }
        currentPlayer = startingPlayer;
        render();

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

    async function endRound(winner, scoreDetails) {
        let message;
        if (winner === 'draw') {
            message = "이번 판은 무승부입니다!";
        } else {
            const { score, goBonus, gwangBak, piBak, shakeBonus } = scoreDetails;
            let finalWinnings = score;
            message = `${winner === 'player' ? '김여사' : '복지장관'}님이 ${score}점으로 승리!`;

            if (goBonus > 1) { finalWinnings *= goBonus; message += `\n- 고 보너스 x${goBonus}`; }
            if (gwangBak) { finalWinnings *= 2; message += `\n- 광박 x2`; }
            if (piBak) { finalWinnings *= 2; message += `\n- 피박 x2`; }
            if (shakeBonus) { finalWinnings *= 2; message += `\n- 흔들기 x2`; }

            finalWinnings *= 100;

            if (winner === 'player') {
                playerMoney += finalWinnings;
                aiMoney -= finalWinnings;
                updateWeeklyWinnings(finalWinnings);
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
            message += `\n\n총 획득 금액: ${finalWinnings}원`;
        }

        await showPopup("라운드 종료", message, [{ text: '다음 판', value: 'next'}]);

        // Check for bankruptcy and reset if needed
        if (playerMoney <= 0 || aiMoney <= 0) {
            const bankruptPlayer = playerMoney <= 0 ? '김여사' : '복지장관';
            await showPopup("게임 종료", `${bankruptPlayer}님이 파산했습니다! 새 게임을 시작합니다.`, [{ text: '새 게임', value: 'new'}]);
            localStorage.removeItem('goStopPlayerMoney');
            localStorage.removeItem('goStopAiMoney');
            localStorage.removeItem('goStopWinnings');
            loadGameData();
        }
        
        await startGame(winner === 'draw' ? 'player' : winner);
    }

    function chooseBestCard(cards) {
        return cards.sort((a, b) => TYPE_VALUES[b.type] - TYPE_VALUES[a.type])[0];
    }

    async function playTurn(player, cardId) {
        try {
            if (currentPlayer !== player) return;

            const hand = player === 'player' ? playerHand : aiHand;
            const playedCard = hand.find(c => c.id === cardId);
            if (!playedCard) return;

            hand.splice(hand.findIndex(c => c.id === cardId), 1);
            let turnCaptures = [];
            let justPlayedOnFloor = null;

            const ppukIndex = ppukStacks.indexOf(playedCard.month);
            if (ppukIndex > -1) {
                await showNotificationPopup("뻑!", `${playedCard.month}월 뻑을 해결했습니다!`);
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
                let chosenCard;
                if (player === 'player') {
                    chosenCard = await showChoicePopup(playedCard, matches);
                } else { // AI chooses the best card
                    chosenCard = chooseBestCard(matches);
                }
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
        const mainCaptured = player === 'player' ? playerCaptured : aiCaptured;
        let capturedInTurn = turnCaptures.length > 0;

        const drawnCard = deck.pop();
        if (!drawnCard) {
            await endRound('draw', {});
            return;
        }

        const isTadak = playedMonth !== null && playedMonth === drawnCard.month && floor.some(c => c.month === drawnCard.month);

        if (justPlayedOnFloor && drawnCard.month === justPlayedOnFloor.month) {
            await showNotificationPopup('쪽!', '쪽! 축하합니다!');
            await stealPi(player);
            const idx = floor.findIndex(c => c.id === justPlayedOnFloor.id);
            if (idx > -1) {
                const card = floor.splice(idx, 1)[0];
                turnCaptures.push(card);
                capturedInTurn = true;
            }
        }

        const matches = floor.filter(c => c.month === drawnCard.month);
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
            if (player === 'player') {
                await showNotificationPopup("자동 선택", `바닥에 같은 월의 카드가 여러 장 있어, 가장 좋은 패(${bestCard.name})를 자동으로 획득합니다.`);
            }
        }

        if (turnCaptures.length > 0) {
            mainCaptured.push(...turnCaptures);
        }

        if (isTadak) {
            await showNotificationPopup("따닥!", "따닥! 상대방의 피를 한 장 가져옵니다.");
            await stealPi(player);
        }

        if (floor.length === 0 && capturedInTurn) {
             await showNotificationPopup("싹쓸이!", "바닥을 모두 쓸었습니다! 상대방의 피를 한 장 가져옵니다.");
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
            await showNotificationPopup("뻑!", `뻑! - ${ppukMonths.join(', ')}월 카드가 바닥에 3장이 되었습니다!`);
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
        const { score } = calculateScore(playerCaptured, playerGoCount);
        isGoStopTurn = true;

        const choice = await showPopup('고 또는 스톱', `현재 점수는 ${score}점 입니다. '고' 하시겠습니까?`,
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
            const scoreDetails = calculateScore(playerCaptured, playerGoCount, true, 'player', aiCaptured);
            await endRound('player', scoreDetails);
        }
    }

    async function aiTurn() {
        try {
            if (currentPlayer !== 'ai') return;

            const specialMove = getAISpecialMove();
            if (specialMove.action === 'shake') {
                aiShake = true;
                await showNotificationPopup("흔들기!", "복지장관이 흔들었습니다! 이번 판은 점수 2배!");
            }

            const cardToPlay = getAIBestMove();
            if (cardToPlay) {
                await playTurn('ai', cardToPlay.id);
            } else {
                if (aiHand.length > 0) {
                    await playTurn('ai', aiHand[0].id);
                } else {
                    await endRound('draw', {});
                }
            }
        } catch (e) {
            console.error("Error during aiTurn:", e);
            await showNotificationPopup("오류 발생", "AI 턴 진행 중 오류가 발생했습니다: " + e.message);
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

    function getAIBestMove() {
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

    async function updateScores(player) {
        const goCount = player === 'player' ? playerGoCount : aiGoCount;
        const captured = player === 'player' ? playerCaptured : aiCaptured;
        const { score } = calculateScore(captured, goCount);

        if (player === 'player') {
            if (score >= 7 && !isGoStopTurn && playerHand.length > 0) {
                await handleGoStopPopup();
                return true; // Go/Stop decision was handled
            }
        } else { // AI's turn
            if (score >= 7 && !isGoStopTurn) {
                if (score >= 7 || aiHand.length === 0) { // Stops at 7+ or last card
                    const scoreDetails = calculateScore(aiCaptured, aiGoCount, true, 'ai', playerCaptured);
                    await endRound('ai', scoreDetails);
                } else { // AI decides to Go
                    aiGoCount++;
                    await showNotificationPopup("고!", '복지장관이 고!를 외쳤습니다.');
                    switchTurn('ai');
                }
                return true; // Go/Stop decision was made
            }
        }
        
        // If the deck is empty and no one could make a move, end the round
        if (deck.length === 0 && playerHand.length === 0 && aiHand.length === 0) {
            const playerScore = calculateScore(playerCaptured, playerGoCount, true, 'player', aiCaptured);
            const aiScore = calculateScore(aiCaptured, aiGoCount, true, 'ai', playerCaptured);
            if (playerScore.score > aiScore.score) {
                await endRound('player', playerScore);
            } else if (aiScore.score > playerScore.score) {
                await endRound('ai', aiScore);
            } else {
                await endRound('draw', {});
            }
            return true;
        }

        return false; // No Go/Stop decision
    }

    function calculateScore(captured, goCount = 0, isFinal = false, winnerPlayer = null, opponentCaptured = null) {
        if (!captured) {
            console.error("calculateScore error: 'captured' parameter is null.");
            return { score: 0 };
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
        if (ttis.filter(c => [2, 6, 10].includes(c.id)).length === 3) score += 3;
        if (ttis.filter(c => [22, 34, 38].includes(c.id)).length === 3) score += 3;
        if (ttis.filter(c => [14, 18, 26].includes(c.id)).length === 3) score += 3;
        const godoriCards = yeols.filter(c => [5, 13, 30].includes(c.id));
        if (godoriCards.length === 3) score += 5;
        const nonGodoriYeols = yeols.filter(c => !godoriCards.includes(c));
        if (nonGodoriYeols.length + godoriCards.length >= 5) score += nonGodoriYeols.length + godoriCards.length - 4;
        const piCount = pis.reduce((acc, card) => acc + (card.isDoublePi ? 2 : 1), 0);
        if (piCount >= 10) score += piCount - 9;

        if (!isFinal) return { score };

        let goBonus = 1;
        if (goCount === 1) score += 1;
        if (goCount === 2) score += 2;
        if (goCount >= 3) goBonus = 2 ** (goCount - 2);

        if (!opponentCaptured) {
            console.error("calculateScore error: 'opponentCaptured' is null for final calculation.");
            return { score, goBonus, gwangBak: false, piBak: false, shakeBonus: false };
        }

        const loserCaptured = opponentCaptured;
        const loserPiCount = loserCaptured.reduce((acc, card) => acc + (card.isDoublePi ? 2 : 1), 0);
        const loserGwangCount = loserCaptured.filter(c => c.type === TYPES.GWANG).length;

        const piBak = score > 0 && piCount >= 10 && loserPiCount < 5;
        const gwangBak = score > 0 && gwangs.length >= 3 && loserGwangCount === 0;
        const shakeBonus = (winnerPlayer === 'player' && playerShake) || (winnerPlayer === 'ai' && aiShake);

        return { score, goBonus, gwangBak, piBak, shakeBonus };
    }

    function getWeeklyWinnings() {
        const data = JSON.parse(localStorage.getItem('goStopWinnings'));
        if (!data) return { amount: 0, weekStartDate: new Date().getTime() };
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        if (new Date().getTime() - data.weekStartDate > oneWeek) {
            localStorage.removeItem('goStopWinnings');
            return { amount: 0, weekStartDate: new Date().getTime() };
        }
        return data;
    }

    function updateWeeklyWinnings(amount) {
        const data = getWeeklyWinnings();
        data.amount += amount;
        localStorage.setItem('goStopWinnings', JSON.stringify(data));
        weeklyWinningsSpan.textContent = `${data.amount} 원`;
    }

    async function stealPi(player) {
        const victimHand = player === 'player' ? aiCaptured : playerCaptured;
        const stealerHand = player === 'player' ? playerCaptured : aiCaptured;
        const piIndex = victimHand.findIndex(c => c.type === TYPES.PI && !c.isDoublePi);
        if (piIndex > -1) {
            const stolenPi = victimHand.splice(piIndex, 1)[0];
            stealerHand.push(stolenPi);
            await showNotificationPopup("피 뺏기", `상대방의 피를 한 장 가져옵니다!`);
        }
    }

    playerHandDiv.addEventListener('click', e => {
        if (currentPlayer !== 'player' || !e.target.closest('.card')) return;
        // Prevent clicks while a popup is open
        if (!popupOverlay.classList.contains('hidden')) return;
        const cardDiv = e.target.closest('.card');
        playTurn('player', parseInt(cardDiv.dataset.cardId));
    });

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
    loadGameData();
    startGame();
});