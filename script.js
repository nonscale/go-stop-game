const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
document.addEventListener('DOMContentLoaded', () => {
    // Move deck to the floor area for better layout
    const deckArea = document.getElementById('deck-area');
    const floorArea = document.getElementById('floor-area');
    if (deckArea && floorArea) {
        floorArea.appendChild(deckArea);
    }
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
            const cardId = cardDiv.dataset.cardId; // Keep it as a string
            // Try to parse, if it's a number, it's a normal card. If not, it's a dummy.
            const cardIdNum = parseInt(cardId, 10);
            playTurn('player', isNaN(cardIdNum) ? cardId : cardIdNum);
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
    CARDS.push({ id: 41, month: 11, type: TYPES.GWANG, name: '11월 (비광)', isBiGwang: true, image: 'Hanafuda_November_Hikari_Alt.svg.png' });
    CARDS.push({ id: 42, month: 11, type: TYPES.TTI, name: '11월 (띠)', image: 'Hanafuda_November_Tanzaku_Alt.svg.png' });
    CARDS.push({ id: 43, month: 11, type: TYPES.YEOL, name: '11월 (끗)', image: 'Hanafuda_November_Tane_Alt.svg.png' });
    CARDS.push({ id: 44, month: 11, type: TYPES.PI, name: '11월 (쌍피)', isDoublePi: true, image: 'Hanafuda_November_Kasu_Alt.svg.png' });
    CARDS.push({ id: 45, month: 12, type: TYPES.GWANG, name: '12월 (광)', image: 'Hanafuda_December_Hikari_Alt.svg.png' });
    CARDS.push({ id: 46, month: 12, type: TYPES.PI, name: '12월 (피)', image: 'Hanafuda_December_Kasu_1_Alt.svg.png' });
    CARDS.push({ id: 47, month: 12, type: TYPES.PI, name: '12월 (쌍피)', isDoublePi: true, image: 'Hanafuda_December_Kasu_2_Alt.svg.png' });
    CARDS.push({ id: 48, month: 12, type: TYPES.PI, name: '12월 (피)', image: 'Hanafuda_December_Kasu_3_Alt.svg.png' });

    // 스크립트 로드 시 원본 덱을 한번 섞어 초기 정렬 상태를 완전히 제거합니다.
    shuffleDeck(CARDS);

    // --- Game State ---
    let deck, floor, playerHand, aiHand, playerCaptured, aiCaptured, currentPlayer;
    let playerMoney, aiMoney;
    let ppukStacks = [], playerShake = false, aiShake = false, canShake = false, playerGoCount = 0, aiGoCount = 0, hasBeenOfferedShake = false;
    let isGoStopTurn = false, canBomb = false, bombMonth = -1;

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
            if (card.highlight) {
                div.classList.add('highlight-player-move');
            }
            if (card.aiHighlight) {
                div.classList.add('highlight-ai-move');
            }
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

        // AI 손 패 렌더링 (흔든 패는 앞면, 나머지는 뒷면)
        aiHand.sort((a, b) => a.month - b.month).forEach(card => {
            // isShaken 속성이 있으면 앞면(shaken 클래스 포함), 없으면 뒷면
            const cardDiv = card.isShaken ? createCardDiv(card) : createCardDiv(null);
            if (card.isShaken) {
                cardDiv.classList.add('shaken');
            } else {
                cardDiv.classList.add('ai-card-back');
            }
            aiHandDiv.appendChild(cardDiv);
        });

                const ppeokMonths = [...ppukStacks];
        const normalFloorCards = floor.filter(card => !ppeokMonths.includes(card.month));
        
        // Render normal cards
        normalFloorCards.sort((a,b) => a.month - b.month).forEach(card => { // Sort normal cards too for consistency
            floorDiv.appendChild(createCardDiv(card));
        });

        // Render ppeok stacks
        ppeokMonths.forEach(month => {
            const ppeokCards = floor.filter(card => card.month === month);
            if (ppeokCards.length > 0) {
                const stackContainer = document.createElement('div');
                stackContainer.classList.add('ppeok-stack');
                
                ppeokCards.sort((a, b) => a.id - b.id);

                ppeokCards.forEach((card, index) => {
                    const cardDiv = createCardDiv(card);
                    cardDiv.classList.remove('card'); // Prevent hover/cursor effects
                    cardDiv.classList.add('ppeok-stack-card'); // Add a specific class for styling
                    cardDiv.classList.add('ppeok-card'); // Keep the red border
                    cardDiv.style.left = `${index * 25}px`;
                    stackContainer.appendChild(cardDiv);
                });
                floorDiv.appendChild(stackContainer);
            }
        });
        

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
        // 더 강력한 셔플을 위해 sort와 Math.random을 이용합니다.
        return array.sort(() => Math.random() - 0.5);
    }

    async function animateDeckFlip(drawnCard) {
        const deckArea = document.getElementById('deck-area');
        const gameBoard = document.getElementById('game-board');
        const rect = deckArea.getBoundingClientRect();
        const gameBoardRect = gameBoard.getBoundingClientRect();

        const tempCard = document.createElement('div');
        tempCard.classList.add('card');
        
        const tempImg = document.createElement('img');
        tempImg.src = 'images/Hanafuda_card_back_Alt.svg.png';
        tempCard.appendChild(tempImg);

        // Position it absolutely over the deck
        tempCard.style.position = 'absolute';
        tempCard.style.left = (rect.left - gameBoardRect.left) + 'px';
        tempCard.style.top = (rect.top - gameBoardRect.top) + 'px';
        tempCard.style.zIndex = '2000'; // Ensure it's on top
        
        gameBoard.appendChild(tempCard);

        return new Promise(resolve => {
            tempCard.classList.add('flipping');
            
            setTimeout(() => {
                tempImg.src = `images/${drawnCard.image}`;
            }, 350); // Halfway through 0.7s animation

            setTimeout(() => {
                gameBoard.removeChild(tempCard);
                resolve();
            }, 700); // End of animation
        });
    }

    async function startGame(startingPlayer = 'player') {
        // Reset card states before new round
        CARDS.forEach(card => {
            delete card.highlight;
            delete card.aiHighlight;
            delete card.isShaken;
        });

        // 덱을 여러 번 섞어 무작위성을 높입니다. (같은 월 패 뭉침 현상 개선)
        deck = [...CARDS]; // 매번 새로운 덱으로 시작
        for (let i = 0; i < 5; i++) { // 셔플 횟수를 5회로 늘려 무작위성 강화
            shuffleDeck(deck);
        }

        playerHand = []; aiHand = []; floor = []; playerCaptured = []; aiCaptured = [];
        ppukStacks = []; 
        playerShake = false; aiShake = false; 
        playerGoCount = 0; aiGoCount = 0;
        canShake = false; isGoStopTurn = false; hasBeenOfferedShake = false;
        for (let i = 0; i < 10; i++) { playerHand.push(deck.pop()); aiHand.push(deck.pop()); }
        for (let i = 0; i < 8; i++) { floor.push(deck.pop()); }
        currentPlayer = startingPlayer;
        render();

        // Check for initial Ppeok on the floor
        const initialFloorCounts = floor.reduce((acc, card) => {
            acc[card.month] = (acc[card.month] || 0) + 1;
            return acc;
        }, {});
        const initialPpukMonths = [];
        for (const month in initialFloorCounts) {
            if (initialFloorCounts[month] === 3) {
                console.log(`[DEBUG] Initial Ppeok detected for month: ${month}`);
                initialPpukMonths.push(month);
                ppukStacks.push(parseInt(month));
            }
        }
        if (initialPpukMonths.length > 0) {

        }

                // Nagari (misdeal) check for 4 cards of the same month in one hand
        const playerHandCounts = playerHand.reduce((acc, card) => { acc[card.month] = (acc[card.month] || 0) + 1; return acc; }, {});
        const aiHandCounts = aiHand.reduce((acc, card) => { acc[card.month] = (acc[card.month] || 0) + 1; return acc; }, {});
        const isMisdeal = Object.values(playerHandCounts).some(count => count === 4) || Object.values(aiHandCounts).some(count => count === 4);

        if (isMisdeal) {
            await showNotificationPopup("재시작 (나가리)", "같은 월의 패 4장이 한꺼번에 깔려 판을 다시 시작합니다.");
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
            
            const baseScore = winnerScoreInfo.score;
            let messageLines = [`${winnerName}님이 승리하셨습니다!`, '---'];
            let scoreLog = [`기본 점수: ${baseScore}점`];
            let multiplier = 1;
            let goBonus = 0;

            // Go Bonus Points (calculated separately)
            if (winnerGoCount === 1) goBonus = 1;
            if (winnerGoCount === 2) goBonus = 2;
            // Go Multiplier for 3+
            if (winnerGoCount >= 3) {
                let goMultiplier = (2 ** (winnerGoCount - 2));
                multiplier *= goMultiplier;
                scoreLog.push(`${winnerGoCount}고: x${goMultiplier}배`);
            }
            
            // Go-bak
            if (loserGoCount >= 1) {
                multiplier *= 2;
                scoreLog.push(`고박: x2배`);
            }

            // Shake bonus
            if (winnerShake) {
                multiplier *= 2;
                scoreLog.push(`흔들기/폭탄: x2배`);
            }

            // Gwang-bak
            const gwangBak = winnerScoreInfo.gwangCount >= 3 && loserScoreInfo.gwangCount === 0;
            if (gwangBak) {
                multiplier *= 2;
                scoreLog.push(`광박: x2배`);
            }

            // Pi-bak
            const piBak = winnerScoreInfo.piCount >= 10 && loserScoreInfo.piCount < 5;
            if (piBak) {
                multiplier *= 2;
                scoreLog.push(`피박: x2배`);
            }

            const multipliedScore = baseScore * multiplier;
            const finalScore = multipliedScore + goBonus;
            const finalWinnings = finalScore * 100;

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

            messageLines.push(...scoreLog);
            if (goBonus > 0) messageLines.push(`고 보너스: +${goBonus}점`);
            messageLines.push('---');
            if (multiplier > 1) {
                 messageLines.push(`점수 계산: (${baseScore}점 x ${multiplier}배) + ${goBonus}점`);
            }
            messageLines.push(`최종 점수: ${finalScore}점`);
            messageLines.push(`획득 금액: ${finalWinnings.toLocaleString()}원`);

            message = messageLines.join('\n');
        }

        await showPopup("라운드 종료", message, [{ text: '다음 판', value: 'next'}]);

        // Check for bankruptcy and reset if needed
        if (playerMoney <= 0 || aiMoney <= 0) {
            const bankruptPlayer = playerMoney <= 0 ? '김여사' : '서울할머니';
            await showPopup("게임 종료", `${bankruptPlayer}님이 파산했습니다!\n새 게임을 시작합니다.`, [{ text: '새 게임', value: 'new'}]);
            localStorage.clear(); // Clear all game data on bankruptcy
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
        if (player === 'ai') {
            console.error("playTurn should not be called for AI anymore.");
            return;
        }
        try {
            if (currentPlayer !== player) return;

            const hand = playerHand;
            const cardIndex = hand.findIndex(c => c.id === cardId);
            if (cardIndex === -1) return;

            const playedCard = hand[cardIndex];

            // Check if the played card is part of a bomb
            if (canBomb && playedCard.month === bombMonth) {
                await playBomb(bombMonth);
                return; // End the turn here as the bomb was played
            }

            // --- Highlight card in hand ---
            playedCard.highlight = true;
            render();
            await sleep(800);
            delete playedCard.highlight;

            // --- Animation Step 1: Play card from hand ---
            hand.splice(cardIndex, 1);
            floor.push(playedCard); // Add card to floor for visualization
            render(); // Show card removed from hand and added to floor
            await sleep(600);

            // Handle Dummy Card play
            if (playedCard.type === 'dummy') {
                floor.pop(); // Remove the dummy card from floor as it's not played
                await finishTurn(player, null, null, null, 0);
                return;
            }

            // --- Ppeok Logic (Needs to be handled early) ---
            const ppukIndex = ppukStacks.indexOf(playedCard.month);
            if (ppukIndex > -1) {
                const playerName = '김여사';
                await showNotificationPopup("뻑!", `${playerName}님이 ${playedCard.month}월 뻑을 해결했습니다!`);
                
                const ppukCards = floor.filter(c => c.month === playedCard.month);
                ppukCards.forEach(c => c.highlight = true);
                // playedCard is already on the floor, so it will be highlighted too
                render();
                await sleep(1500);

                ppukCards.forEach(c => delete c.highlight);

                const capturedPpeokCards = floor.filter(c => c.month === playedCard.month);
                floor = floor.filter(c => c.month !== playedCard.month);
                ppukStacks.splice(ppukIndex, 1);
                
                playerCaptured.push(...capturedPpeokCards);
                await stealPi(player);
                
                await finishTurn(player, null, null, null, 0);
                return;
            }

            // --- Normal Match Logic ---
            const matches = floor.filter(c => c.month === playedCard.month && c.id !== playedCard.id);
            
            if (matches.length === 0) {
                // No match, card stays on floor. Pass null for handCaptures.
                await finishTurn(player, null, playedCard, null, 0);
            } else {
                let match;
                if (matches.length > 1) {
                    match = await showChoicePopup(playedCard, matches);
                } else {
                    match = matches[0];
                }
                
                playedCard.highlight = true;
                match.highlight = true;
                render();
                await sleep(1500);
                delete playedCard.highlight;
                delete match.highlight;

                // *** MODIFICATION: Don't remove from floor. Pass captures to finishTurn.
                const handCaptures = [playedCard, match];
                await finishTurn(player, handCaptures, null, playedCard.month, matches.length);
            }
        } catch (e) {
            console.error("Error during playTurn:", e);
            await showNotificationPopup("오류 발생", "플레이 중 오류가 발생했습니다: " + e.message);
        }
    }

    async function finishTurn(player, handCaptures, justPlayedOnFloor, playedMonth = null, matchCountAtTurnStart = 0) {
        const mainCaptured = playerCaptured;
        let turnCaptures = handCaptures ? [...handCaptures] : [];
        let deckCaptures = [];
        let capturedInTurn = turnCaptures.length > 0;

        const drawnCard = deck.pop();
        if (!drawnCard) {
            if (turnCaptures.length > 0) {
                const capturedIds = turnCaptures.map(c => c.id);
                floor = floor.filter(c => !capturedIds.includes(c.id));
                mainCaptured.push(...turnCaptures);
            }
            render();
            await endRound('draw');
            return;
        }

        await animateDeckFlip(drawnCard);
        floor.push(drawnCard);
        render();
        await sleep(1300);

        const playerName = '김여사';
        let eventOccurred = false;
        let isNewPpeok = false;

        if (playedMonth && drawnCard.month === playedMonth) {
            if (matchCountAtTurnStart === 2) { // Tadak
                await showNotificationPopup("따닥!", `${playerName}님의 따닥! 상대방의 피를 한 장 가져옵니다.`);
                const remainingCardOnFloor = floor.find(c => c.month === playedMonth && ![...turnCaptures, drawnCard].map(card => card.id).includes(c.id));
                if(remainingCardOnFloor) deckCaptures.push(remainingCardOnFloor);
                deckCaptures.push(drawnCard);
                await stealPi(player);
                eventOccurred = true;
            } else if (matchCountAtTurnStart === 1) { // Ppeok (Ssat-da)
                isNewPpeok = true;
                eventOccurred = true;
            }
        }

        if (!eventOccurred) {
            const ppukIndex = ppukStacks.indexOf(drawnCard.month);
            if (ppukIndex > -1) { // Resolve existing Ppeok
                await showNotificationPopup("뻑!", `${playerName}님이 ${drawnCard.month}월 뻑을 뒤집어서 해결했습니다!`);
                const ppukCards = floor.filter(c => c.month === drawnCard.month);
                deckCaptures.push(...ppukCards);
                ppukStacks.splice(ppukIndex, 1);
                await stealPi(player);
            } else if (justPlayedOnFloor && drawnCard.month === justPlayedOnFloor.month) { // Jjok
                await showNotificationPopup('쪽!', `${playerName}님, 쪽! 축하합니다!`);
                deckCaptures.push(justPlayedOnFloor, drawnCard);
                await stealPi(player);
            } else { // Normal deck match
                const matches = floor.filter(c => c.month === drawnCard.month && c.id !== drawnCard.id && ![...turnCaptures, ...deckCaptures].map(card => card.id).includes(c.id));
                if (matches.length > 0) {
                    let match = (matches.length > 1) ? chooseBestCard(matches) : matches[0];
                    deckCaptures.push(drawnCard, match);
                }
            }
        }
        
        // --- Consolidated Capture and Cleanup Step ---
        if (isNewPpeok) {
            // For a new Ppeok, no cards are captured. They all stay on the floor.
            // The played card from hand is already on the floor.
            // The matched card from hand is still on the floor.
            // The drawn card is on the floor.
            // The generic ppeok checker below will handle stack creation.
            turnCaptures = []; // Empty the captures for this turn
        } 

        const allTurnCaptures = [...turnCaptures, ...deckCaptures];
        capturedInTurn = allTurnCaptures.length > 0;

        if (capturedInTurn) {
            const capturedIds = allTurnCaptures.map(c => c.id);
            allTurnCaptures.forEach(c => c.highlight = true);
            render();
            await sleep(1500);

            floor = floor.filter(c => !capturedIds.includes(c.id));
            mainCaptured.push(...allTurnCaptures);
        }

        // Handle special events after capture (Sseul-sseu-ri)
        if (floor.length === 0 && capturedInTurn && deck.length > 0) {
             await showNotificationPopup("싹쓸이!", `${playerName}님이 바닥을 모두 쓸었습니다! 상대방의 피를 한 장 가져옵니다.`);
             await stealPi(player);
        }

        // Check for new Ppeok
        const counts = floor.reduce((acc, c) => { acc[c.month] = (acc[c.month] || 0) + 1; return acc; }, {});
        for (const m in counts) {
            if (counts[m] === 3 && !ppukStacks.includes(parseInt(m))) {
                ppukStacks.push(parseInt(m));
            }
        }

        render(); // Final render
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
            // It's player's turn. Check if they have cards.
            if (playerHand.length === 0) {
                // Player has no cards, round ends. Calculate winner.
                const playerScore = calculateScore(playerCaptured).score;
                const aiScore = calculateScore(aiCaptured).score;
                if (playerScore >= 7 && playerScore > aiScore) {
                    await endRound('player');
                } else if (aiScore >= 7 && aiScore > playerScore) {
                    await endRound('ai');
                } else {
                    await endRound('draw');
                }
                return; // Stop further turn processing
            }

            playerHandDiv.style.pointerEvents = 'auto';
            try {
                await handleSpecialActions();
            } catch (e) {
                console.error("Error during special actions on player turn:", e);
                await showNotificationPopup("오류 발생", "게임 진행 중 오류가 발생했습니다: " + e.message);
            }
        }
    }

    async function playBomb(month) {
        // Find cards
        const bombCardsFromHand = playerHand.filter(c => c.month === month);

        // --- Animation Step 1: Move cards from hand to floor ---
        playerHand = playerHand.filter(c => c.month !== month);
        floor.push(...bombCardsFromHand);

        // --- Animation Step 2: Highlight all 4 cards on the floor ---
        const allBombCards = floor.filter(c => c.month === month);
        allBombCards.forEach(c => c.highlight = true);
        render();
        await sleep(1500);

        // Highlights are intentionally not cleaned up here. 
        // They remain visible during the deck flip and are re-highlighted in finishTurn.

        // Steal pi (happens as part of the bomb action)
        await stealPi('player');

        // A bomb is a type of shake, so set the shake bonus
        playerShake = true; 

        // Add two dummy cards to player's hand
        const dummyCard1 = { id: `dummy_${Date.now()}_1`, month: 0, type: 'dummy', name: '공패', image: 'Hanafuda_card_back_Alt.svg.png' };
        const dummyCard2 = { id: `dummy_${Date.now()}_2`, month: 0, type: 'dummy', name: '공패', image: 'Hanafuda_card_back_Alt.svg.png' };
        playerHand.push(dummyCard1, dummyCard2);

        // Defer capture to finishTurn, passing the bomb cards as handCaptures
        await finishTurn('player', allBombCards, null, month, 1); 
    }

    async function handleSpecialActions() {
        if (isGoStopTurn) return;
        checkForSpecials(); // This sets canBomb and bombMonth for playTurn to use

        // Offer to shake.
        if (canShake && !playerShake && !hasBeenOfferedShake) {
            hasBeenOfferedShake = true; // Ask only once per round
            const choice = await showPopup('흔들기!', '패에 같은 월의 카드가 3장 있습니다.\n흔드시겠습니까?',
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

        const playerScore = calculateScore(playerCaptured).score;
        const aiScore = calculateScore(aiCaptured).score;
        const message = `현재 점수: ${playerScore}점 (상대: ${aiScore}점)\n'고' 하시겠습니까?`;

        const choice = await showPopup('고 또는 스톱', message, 
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
        canBomb = false;
        bombMonth = -1;

        for (const month in handCounts) {
            if (handCounts[month] >= 3) {
                canShake = true;
                // Check for bomb condition: 3 cards in hand, 1 on floor
                const floorHasMatch = floor.some(c => c.month === parseInt(month));
                if (handCounts[month] === 3 && floorHasMatch) {
                    const floorCount = floor.filter(c => c.month === parseInt(month)).length;
                    if (floorCount === 1) {
                        canBomb = true;
                        bombMonth = parseInt(month);
                        break; // Found a bomb, which is the most specific special, so we can stop.
                    }
                }
            }
        }
    }

    function getAISpecialMove() {
        const handCounts = aiHand.reduce((acc, c) => { acc[c.month] = (acc[c.month] || 0) + 1; return acc; }, {});

        // Priority 1: Check for Bomb
        for (const monthStr in handCounts) {
            const month = parseInt(monthStr, 10);
            if (handCounts[month] === 3) {
                const floorCount = floor.filter(c => c.month === month).length;
                if (floorCount === 1) {
                    return { action: 'bomb', month: month };
                }
            }
        }

        // Priority 2: Check for Shake (if not already shaken)
        if (!aiShake) {
            for (const monthStr in handCounts) {
                const month = parseInt(monthStr, 10);
                if (handCounts[month] >= 3) {
                    return { action: 'shake', month: month };
                }
            }
        }

        return { action: 'play' }; // Default action
    }

    async function aiPlayBomb(month) {
        const player = 'ai';
        const mainCaptured = aiCaptured;

        // --- Animation Step 1: Move cards from hand to floor ---
        const bombCardsFromHand = aiHand.filter(c => c.month === month);
        aiHand = aiHand.filter(c => c.month !== month);
        floor.push(...bombCardsFromHand);

        // --- Animation Step 2: Highlight all 4 cards on the floor ---
        const allBombCards = floor.filter(c => c.month === month);
        allBombCards.forEach(c => c.aiHighlight = true);
        render();
        await sleep(1500); // Let user see all 4 cards on the floor

        // Defer capture. Highlights remain.

        // Other bomb effects
        await stealPi(player);
        aiShake = true;

        // --- PART 2: Draw card from deck ---
        const drawnCard = deck.pop();
        if (!drawnCard) {
            // If deck is empty, just capture the bomb cards and end.
            mainCaptured.push(...allBombCards);
            floor = floor.filter(c => c.month !== month);
            render();
            await endRound('draw');
            return;
        }

        await animateDeckFlip(drawnCard);
        floor.push(drawnCard);
        render();
        await sleep(1300);

        let deckCaptures = [];
        let eventOccurred = false;
        let isNewPpeok = false;
        const playedMonth = month;

        if (playedMonth && drawnCard.month === playedMonth) {
            isNewPpeok = true;
            eventOccurred = true;
        }

        if (!eventOccurred) {
            const drawnPpukIndex = ppukStacks.indexOf(drawnCard.month);
            if (drawnPpukIndex > -1) {
                await showNotificationPopup("뻑!", `서울할머니님이 ${drawnCard.month}월 뻑을 뒤집어서 해결했습니다!`);
                const ppukCards = floor.filter(c => c.month === drawnCard.month);
                deckCaptures.push(...ppukCards);
                ppukStacks.splice(drawnPpukIndex, 1);
                await stealPi(player);
            } else {
                // Make sure not to match with the bomb cards already on the floor
                const deckMatches = floor.filter(c => c.month === drawnCard.month && c.id !== drawnCard.id && !allBombCards.map(bc => bc.id).includes(c.id));
                if (deckMatches.length > 0) {
                    const match = chooseBestCard(deckMatches);
                    deckCaptures.push(drawnCard, match);
                }
            }
        }

        // --- Consolidated Capture Step ---
        let handCaptures = allBombCards; // The 4 bomb cards
        if (isNewPpeok) {
            // On Ppeok, no cards are captured from the deck flip.
            deckCaptures = [];
        }

        const allTurnCaptures = [...handCaptures, ...deckCaptures];
        if (allTurnCaptures.length > 0) {
            allTurnCaptures.forEach(c => c.aiHighlight = true);
            render();
            await sleep(1500);

            const capturedIds = allTurnCaptures.map(c => c.id);
            floor = floor.filter(c => !capturedIds.includes(c.id));
            mainCaptured.push(...allTurnCaptures);
        }

        // --- Post-Turn Events ---
        if (floor.length === 0 && allTurnCaptures.length > 0 && deck.length > 0) {
            await showNotificationPopup("싹쓸이!", `서울할머니님이 바닥을 모두 쓸었습니다! 상대방의 피를 한 장 가져옵니다.`);
            await stealPi(player);
        }

        const counts = floor.reduce((acc, c) => { acc[c.month] = (acc[c.month] || 0) + 1; return acc; }, {});
        for (const m in counts) {
            if (counts[m] === 3 && !ppukStacks.includes(parseInt(m))) {
                ppukStacks.push(parseInt(m));
            }
        }

        render();
        const goStopTriggered = await updateScores(player);
        if (!goStopTriggered) {
            switchTurn(player);
        }
    }

    async function aiPlayTurn(playedCard) {
        const player = 'ai';
        const mainCaptured = aiCaptured;
        let handCaptures = [];
        let deckCaptures = [];

        // --- PART 1: Play card from hand ---
        const aiHandIndex = aiHand.findIndex(c => c.id === playedCard.id);
        if (aiHandIndex > -1) aiHand.splice(aiHandIndex, 1);
        
        floor.push(playedCard);
        playedCard.aiHighlight = true;
        render();
        await sleep(1300);
        delete playedCard.aiHighlight;

        const matchCountAtTurnStart = floor.filter(c => c.month === playedCard.month && c.id !== playedCard.id).length;
        const matches = floor.filter(c => c.month === playedCard.month && c.id !== playedCard.id);

        // --- Ppeok-solving logic ---
        const ppukIndex = ppukStacks.indexOf(playedCard.month);
        if (ppukIndex > -1) {
            await showNotificationPopup("뻑!", `서울할머니님이 ${playedCard.month}월 뻑을 해결했습니다!`);
            const ppukCards = floor.filter(c => c.month === playedCard.month);
            handCaptures.push(...ppukCards);
            ppukStacks.splice(ppukIndex, 1);
            await stealPi(player);
        } else if (matches.length > 0) {
            const match = chooseBestCard(matches);
            handCaptures.push(playedCard, match);
        }

        // --- PART 2: Draw card from deck ---
        const drawnCard = deck.pop();
        if (!drawnCard) {
            if (handCaptures.length > 0) {
                const capturedIds = handCaptures.map(c => c.id);
                floor = floor.filter(c => !capturedIds.includes(c.id));
                mainCaptured.push(...handCaptures);
            }
            render();
            await endRound('draw');
            return;
        }

        await animateDeckFlip(drawnCard);
        floor.push(drawnCard);
        render();
        await sleep(1300);

        let eventOccurred = false;
        let isNewPpeok = false;
        const playedMonth = handCaptures.length > 0 ? handCaptures[0].month : null;

        if (playedMonth && drawnCard.month === playedMonth && ppukIndex === -1) {
            if (matchCountAtTurnStart === 2) { // Tadak
                await showNotificationPopup("따닥!", `서울할머니님의 따닥! 상대방의 피를 한 장 가져옵니다.`);
                const remainingCardOnFloor = floor.find(c => c.month === playedMonth && ![...handCaptures, drawnCard].map(card => card.id).includes(c.id));
                if (remainingCardOnFloor) deckCaptures.push(remainingCardOnFloor);
                deckCaptures.push(drawnCard);
                await stealPi(player);
                eventOccurred = true;
            } else if (matchCountAtTurnStart === 1) { // Ppeok (Ssat-da)
                isNewPpeok = true;
                eventOccurred = true;
            }
        }

        if (!eventOccurred) {
            const drawnPpukIndex = ppukStacks.indexOf(drawnCard.month);
            if (drawnPpukIndex > -1) { // Resolve existing Ppeok with drawn card
                await showNotificationPopup("뻑!", `서울할머니님이 ${drawnCard.month}월 뻑을 뒤집어서 해결했습니다!`);
                const ppukCards = floor.filter(c => c.month === drawnCard.month);
                deckCaptures.push(...ppukCards);
                ppukStacks.splice(drawnPpukIndex, 1);
                await stealPi(player);
            } else {
                const justPlayedOnFloor = floor.find(c => c.id === playedCard.id);
                if (justPlayedOnFloor && drawnCard.month === justPlayedOnFloor.month) { // Jjok
                    await showNotificationPopup('쪽!', `서울할머니님, 쪽! 축하합니다!`);
                    deckCaptures.push(justPlayedOnFloor, drawnCard);
                    await stealPi(player);
                } else { // Normal deck match
                    const deckMatches = floor.filter(c => c.month === drawnCard.month && c.id !== drawnCard.id && ![...handCaptures, ...deckCaptures].map(card => card.id).includes(c.id));
                    if (deckMatches.length > 0) {
                        const match = chooseBestCard(deckMatches);
                        deckCaptures.push(drawnCard, match);
                    }
                }
            }
        }

        // --- Consolidated Capture Step ---
        if (isNewPpeok) {
            handCaptures = []; // No capture on new ppeok
        }

        const allTurnCaptures = [...handCaptures, ...deckCaptures];
        const capturedInTurn = allTurnCaptures.length > 0;

        if (capturedInTurn) {
            allTurnCaptures.forEach(c => c.aiHighlight = true);
            render();
            await sleep(1500);

            const capturedIds = allTurnCaptures.map(c => c.id);
            floor = floor.filter(c => !capturedIds.includes(c.id));
            mainCaptured.push(...allTurnCaptures);
        }

        // --- Post-Turn Events ---
        if (floor.length === 0 && capturedInTurn && deck.length > 0) {
            await showNotificationPopup("싹쓸이!", `서울할머니님이 바닥을 모두 쓸었습니다! 상대방의 피를 한 장 가져옵니다.`);
            await stealPi(player);
        }

        const counts = floor.reduce((acc, c) => { acc[c.month] = (acc[c.month] || 0) + 1; return acc; }, {});
        for (const m in counts) {
            if (counts[m] === 3 && !ppukStacks.includes(parseInt(m))) {
                ppukStacks.push(parseInt(m));
            }
        }

        render();
        const goStopTriggered = await updateScores(player);
        if (!goStopTriggered) {
            switchTurn(player);
        }
    }

    async function aiTurn() {
        try {
            if (currentPlayer !== 'ai') return;
            await sleep(800);

            const specialMove = getAISpecialMove();

            if (specialMove.action === 'bomb') {
                await aiPlayBomb(specialMove.month);
                return; // Turn is handled by aiPlayBomb
            }

            if (specialMove.action === 'shake') {
                aiShake = true;
                const monthToShake = specialMove.month;
                aiHand.forEach(card => {
                    if (card.month === monthToShake) {
                        card.isShaken = true;
                    }
                });
                await showNotificationPopup("흔들기!", "서울할머니가 흔들었습니다!\n흔든 패를 확인하세요.");
                render();
            }

            const cardToPlay = getAIBestMove();
            if (cardToPlay) {
                await aiPlayTurn(cardToPlay);
            } else {
                // AI has no cards, round ends.
                const playerScore = calculateScore(playerCaptured).score;
                const aiScore = calculateScore(aiCaptured).score;
                if (playerScore >= 7 && playerScore > aiScore) {
                    await endRound('player');
                } else if (aiScore >= 7 && aiScore > playerScore) {
                    await endRound('ai');
                } else {
                    await endRound('draw');
                }
            }
        } catch (e) {
            console.error("Error during aiTurn:", e);
            await showNotificationPopup("오류 발생", "AI 턴 진행 중 오류가 발생했습니다: " + e.message);
        }
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
            if (playerScoreInfo.score >= 7 && !isGoStopTurn) {
                if (playerHand.length > 0) { // Still have cards, offer Go/Stop
                    await handleGoStopPopup();
                    return true;
                } else { // Last card played for the win
                    await endRound('player');
                    return true;
                }
            }
        } else { // AI's turn
            if (aiScoreInfo.score >= 7 && !isGoStopTurn) {
                // AI always stops if it can win.
                await endRound('ai');
                return true;
            }
        }
        
        // If the deck is empty and hands are empty, end the round
        if (deck.length === 0 && playerHand.length === 0 && aiHand.length === 0) {
            const playerScore = playerScoreInfo.score;
            const aiScore = aiScoreInfo.score;
            if (playerScore >= 7 && playerScore > aiScore) {
                await endRound('player');
            } else if (aiScore >= 7 && aiScore > playerScore) {
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

    function enterFullscreen() {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
            elem.msRequestFullscreen();
        }
    }

    // --- Window Control Buttons ---
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const exitGameBtn = document.getElementById('exit-game-btn');

    function enterFullscreen() {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
            elem.msRequestFullscreen();
        }
    }

    function exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE/Edge */
            document.msExitFullscreen();
        }
    }

    fullscreenBtn.addEventListener('click', () => {
        enterFullscreen();
        fullscreenBtn.style.display = 'none'; // Hide after use
    });

    exitGameBtn.addEventListener('click', async () => {
        const choice = await showPopup("게임 종료", "정말로 게임을 종료하시겠습니까?", [
            { text: '예', value: 'yes' },
            { text: '아니오', value: 'no' }
        ]);

        if (choice === 'yes') {
            if (document.fullscreenElement) {
                exitFullscreen();
            }
            // Navigate to a blank page to simulate closing the tab
            window.location.href = 'about:blank';
        }
    });


    // --- Start Game ---
    (async () => {
        const welcomeShown = localStorage.getItem('goStopWelcomeShown');
        if (!welcomeShown) {
            popupModal.classList.add('welcome-popup');

            const choice = await showPopup(
                "보건복지부에서 온 편지",
                "안녕하세요 김여사님.\n\n열심히 산 당신께 5만원을 게임머니로 드렸습니다.\n저랑 게임해서 돈도 벌어서 손녀들에게 맛있는거 사주세요~",
                [{ text: '준비되면 누르세요', value: 'start' }]
            );

            if (choice === 'start') {
                enterFullscreen();
            }

            popupModal.classList.remove('welcome-popup');
            localStorage.setItem('goStopWelcomeShown', 'true');
        }
        
        loadGameData();
        startGame();
    })();
});