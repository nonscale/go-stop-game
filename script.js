const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const OPPONENT_NAME = "송도 할머니";
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('opponent-name').textContent = OPPONENT_NAME;
    document.getElementById('opponent-name-info').textContent = OPPONENT_NAME;
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

    const playerConditionalStopBtn = document.getElementById('player-conditional-stop-btn');
    if (playerConditionalStopBtn) {
        playerConditionalStopBtn.addEventListener('click', () => {
            if (currentPlayer !== 'player' || isGoStopTurn || isTurnInProgress) {
                showNotificationPopup("알림", "상대방이 게임을 진행 중입니다.\n기다려주세요.");
                return;
            }

            const playerScoreInfo = calculateScore(playerCaptured, playerStolenPi);
            const currentScore = playerScoreInfo.score;

            if (currentScore < 7) {
                showIntermediateScorePopup(playerScoreInfo);
            } else {
                handleGoStopPopup(); // Score is high enough, show the real Go/Stop choice.
            }
        });
    }

    playerHandDiv.addEventListener('click', (e) => {
        if (currentPlayer !== 'player' || isGoStopTurn || isTurnInProgress) return; // Add lock check
        const cardDiv = e.target.closest('.card');
        if (cardDiv && cardDiv.dataset.cardId) {
            isTurnInProgress = true; // Set lock
            hideDiscardHint(); // Hide hint on any card click
            const cardId = cardDiv.dataset.cardId; // Keep it as a string
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

    // --- Game State ---
    let deck, floor, playerHand, aiHand, playerCaptured, aiCaptured, currentPlayer;
    let playerStolenPi, aiStolenPi; // 훔친 피를 저장할 배열
    let playerMoney, aiMoney;
    let ppukStacks = [], playerShake = false, aiShake = false, playerShakeActive = false, aiShakeActive = false, canShake = false, playerGoCount = 0, aiGoCount = 0, hasBeenOfferedShake = false;
    let isGoStopTurn = false, canBomb = false, bombMonths = [], inactivityTimer = null, turnNotificationTimer = null, isTurnInProgress = false;
    let currentChanceIndex = 0; // 순차적으로 찬스를 표시하기 위한 인덱스

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


        playerHand.sort((a, b) => {
            const aShaken = a.isShaken ? 1 : 0;
            const bShaken = b.isShaken ? 1 : 0;
            if (aShaken !== bShaken) return aShaken - bShaken;
            return a.month - b.month;
        });
        playerHand.forEach(card => {
            const cardDiv = createCardDiv(card);
            if (card.isShaken) {
                cardDiv.classList.add('shaken');
            }
            playerHandDiv.appendChild(cardDiv);
        });

        // AI 손 패 렌더링 (흔든 패는 앞면, 나머지는 뒷면)
        aiHand.sort((a, b) => {
            const aShaken = a.isShaken ? 1 : 0;
            const bShaken = b.isShaken ? 1 : 0;
            if (aShaken !== bShaken) return aShaken - bShaken;
            return a.month - b.month;
        }).forEach(card => {
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
        normalFloorCards.sort((a, b) => a.month - b.month).forEach(card => { // Sort normal cards too for consistency
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


        const renderCaptured = (playerPrefix, capturedCards, stolenPi) => {
            const gwangDiv = document.getElementById(`${playerPrefix}-gwang`);
            const yeolDiv = document.getElementById(`${playerPrefix}-yeol`);
            const ttiDiv = document.getElementById(`${playerPrefix}-tti`);
            const piDiv = document.getElementById(`${playerPrefix}-pi`);
            const stolenPiDiv = document.getElementById(`${playerPrefix}-stolen-pi`); // 훔친 피 영역
            gwangDiv.innerHTML = '';
            yeolDiv.innerHTML = '';
            ttiDiv.innerHTML = '';
            piDiv.innerHTML = '';
            stolenPiDiv.innerHTML = ''; // 훔친 피 영역 초기화
            let gwangCount = 0, yeolCount = 0, ttiCount = 0, piCount = 0, stolenPiCount = 0;
            let gwangIndex = 0, yeolIndex = 0, ttiIndex = 0, piIndex = 0, stolenPiIndex = 0;
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

            stolenPi.sort((a, b) => a.month - b.month).forEach(card => {
                const cardDiv = createCardDiv(card, true);
                cardDiv.style.left = `${stolenPiIndex++ * overlap}px`;
                stolenPiDiv.appendChild(cardDiv);
                stolenPiCount += card.isDoublePi ? 2 : 1;
            });

            document.getElementById(`${playerPrefix}-gwang-count`).textContent = gwangCount;
            document.getElementById(`${playerPrefix}-yeol-count`).textContent = yeolCount;
            document.getElementById(`${playerPrefix}-tti-count`).textContent = ttiCount;
            document.getElementById(`${playerPrefix}-pi-count`).textContent = piCount;
            document.getElementById(`${playerPrefix}-stolen-pi-count`).textContent = stolenPiCount; // 훔친 피 개수 업데이트
        };

        renderCaptured('player', playerCaptured, playerStolenPi);
        renderCaptured('ai', aiCaptured, aiStolenPi);
        playerMoneySpan.textContent = playerMoney;
        aiMoneySpan.textContent = aiMoney;
        playerScoreSpan.textContent = calculateScore(playerCaptured, playerStolenPi).score;
        aiScoreSpan.textContent = calculateScore(aiCaptured, aiStolenPi).score;

        // Update large score displays
        const playerScoreLarge = document.getElementById('player-score-large');
        const aiScoreLarge = document.getElementById('ai-score-large');
        if (playerScoreLarge) playerScoreLarge.textContent = `${calculateScore(playerCaptured, playerStolenPi).score}점`;
        if (aiScoreLarge) aiScoreLarge.textContent = `${calculateScore(aiCaptured, aiStolenPi).score}점`;

        checkAndCelebrateSets();
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

    async function showToastPopup(title, message, duration = 3000) {
        popupTitle.textContent = title;
        popupMessage.textContent = message;
        popupChoicesDiv.innerHTML = '';
        popupChoicesDiv.style.display = 'none';

        const popupButtonsDiv = document.getElementById('popup-buttons');
        popupButtonsDiv.innerHTML = ''; // No buttons

        popupOverlay.classList.remove('hidden');

        await sleep(duration); // Pause execution for the duration
        hidePopup(); // Hide after the pause
    }

    function showIntermediateScorePopup(scoreInfo) {
        // 상세 점수 및 개수 계산
        const gwangs = playerCaptured.filter(c => c.type === TYPES.GWANG);
        const yeols = playerCaptured.filter(c => c.type === TYPES.YEOL);
        const ttis = playerCaptured.filter(c => c.type === TYPES.TTI);
        const pis = playerCaptured.filter(c => c.type === TYPES.PI || c.isDoublePi);

        // 피 개수 계산 (쌍피 고려 + 훔친 피 고려)
        const totalPiCount = pis.reduce((acc, card) => acc + (card.isDoublePi ? 2 : 1), 0) +
            playerStolenPi.reduce((acc, card) => acc + (card.isDoublePi ? 2 : 1), 0);

        // 부분 점수 계산 로직
        let gwangScore = 0;
        if (gwangs.length === 5) gwangScore = 15;
        else if (gwangs.length === 4) gwangScore = 4;
        else if (gwangs.length === 3) gwangScore = gwangs.some(c => c.isBiGwang) ? 2 : 3;

        let yeolScore = 0;
        const godoriCards = yeols.filter(c => [5, 13, 30].includes(c.id));
        if (godoriCards.length === 3) yeolScore += 5;
        const nonGodoriYeols = yeols.filter(c => !godoriCards.includes(c));
        if (yeols.length >= 5) yeolScore += yeols.length - 4;

        let ttiScore = 0;
        if (ttis.length >= 5) ttiScore += ttis.length - 4;

        let piScore = 0;
        if (totalPiCount >= 10) piScore = totalPiCount - 9;

        // **노인 사용자를 위한 가독성 중심 UI**
        // 폰트 크기 대폭 확대, 줄 간격 확보, 명확한 색상 대비
        // 공간 절약을 위해 패딩과 마진을 세밀하게 조정
        // 2x2 그리드 사용하여 세로 길이 절반으로 축소
        const message = `
            <div style="font-size: 1.3em; color: #111; margin-bottom: 5px; font-weight: bold; line-height: 1.2;">
                총 <span style="color:#c00; font-size: 1.2em;">${scoreInfo.score}점</span>
            </div>
            <div style="font-size: 1.15em; background: #fffcf0; padding: 8px; border: 2px solid #ddd; border-radius: 12px; text-align: left; line-height: 1.25; display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
                <div style="border-bottom: 1px solid #ccc; padding-bottom: 2px;">
                    <span>🎴 광(${gwangs.length})</span><br><b style="color:#007bff;">${gwangScore}점</b>
                </div>
                <div style="border-bottom: 1px solid #ccc; padding-bottom: 2px;">
                    <span>🌱 열(${yeols.length})</span><br><b style="color:#28a745;">${yeolScore}점</b>
                </div>
                <div style="padding-top: 2px;">
                    <span>🎋 띠(${ttis.length})</span><br><b style="color:#d39e00;">${ttiScore}점</b>
                </div>
                <div style="padding-top: 2px;">
                    <span>🔴 피(${totalPiCount})</span><br><b style="color:#dc3545;">${piScore}점</b>
                </div>
            </div>
            <div style="margin-top: 8px; font-size: 0.9em; color: #555; background-color: #f0f0f0; padding: 5px; border-radius: 8px;">
                <b>7점</b> 이상 스톱 가능 (1분 후 닫힘)
            </div>
        `;

        popupTitle.textContent = "점수 상세";
        popupTitle.style.fontSize = "1.4em";
        popupTitle.style.marginBottom = "5px";
        popupMessage.innerHTML = message;

        popupChoicesDiv.innerHTML = '';
        popupChoicesDiv.style.display = 'none';

        const popupButtonsDiv = document.getElementById('popup-buttons');
        popupButtonsDiv.innerHTML = '';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '확 인';
        closeBtn.style.width = "100%";
        closeBtn.style.padding = "12px 0";
        closeBtn.style.fontSize = "1.3em";
        closeBtn.style.fontWeight = "bold";
        closeBtn.style.backgroundColor = "#4CAF50";
        closeBtn.style.color = "white";
        closeBtn.style.border = "none";
        closeBtn.style.borderRadius = "10px";
        closeBtn.style.marginTop = "8px";

        closeBtn.addEventListener('click', () => {
            hidePopup();
            if (popupTimeout) clearTimeout(popupTimeout);
        });
        popupButtonsDiv.appendChild(closeBtn);

        popupOverlay.classList.remove('hidden');

        // 1분(60초) 후 자동 닫힘
        const popupTimeout = setTimeout(() => {
            hidePopup();
        }, 60000);
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
        // Fisher-Yates shuffle for a more robust and unbiased shuffle.
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
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
                if (gameBoard.contains(tempCard)) gameBoard.removeChild(tempCard);
                resolve();
            }, 700); // End of animation
        });
    }

    async function startGame(startingPlayer = 'player') {
        // Reset all game state variables for a new round
        deck = JSON.parse(JSON.stringify(CARDS));
        playerHand = [];
        aiHand = [];
        floor = [];
        playerCaptured = [];
        aiCaptured = [];
        playerStolenPi = []; // 훔친 피 배열 초기화
        aiStolenPi = []; // 훔친 피 배열 초기화
        ppukStacks = [];
        playerShake = false;
        aiShake = false;
        playerShakeActive = false;
        aiShakeActive = false;
        playerGoCount = 0;
        aiGoCount = 0;
        canShake = false;
        isGoStopTurn = false;
        hasBeenOfferedShake = false;
        canBomb = false;
        bombMonth = -1;
        isTurnInProgress = false;
        currentChanceIndex = 0; // 찬스 인덱스 초기화

        // Shuffle deck
        for (let i = 0; i < 5; i++) {
            shuffleDeck(deck);
        }

        // Deal cards
        for (let i = 0; i < 10; i++) { playerHand.push(deck.pop()); aiHand.push(deck.pop()); } // Fixed: Added missing semicolon
        for (let i = 0; i < 8; i++) { floor.push(deck.pop()); } // Fixed: Added missing semicolon
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
            const monthList = initialPpukMonths.join(', ');
            await showNotificationPopup("시작 뻑!", `바닥에 ${monthList}월 패 3장이 깔린 상태로 시작합니다.`);
        }

        // Nagari (misdeal) check for 4 cards of the same month in any hand or on the floor
        const playerHandCounts = playerHand.reduce((acc, card) => { acc[card.month] = (acc[card.month] || 0) + 1; return acc; }, {});
        const aiHandCounts = aiHand.reduce((acc, card) => { acc[card.month] = (acc[card.month] || 0) + 1; return acc; }, {});
        const floorCounts = floor.reduce((acc, card) => { acc[card.month] = (acc[card.month] || 0) + 1; return acc; }, {});
        const isMisdeal = Object.values(playerHandCounts).some(count => count === 4) ||
            Object.values(aiHandCounts).some(count => count === 4) ||
            Object.values(floorCounts).some(count => count === 4);

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
                showTurnNotificationBubble(); // 게임 시작 시 첫 알림 표시
                startInactivityTimer(); // Start timer on player's first turn
            } catch (e) {
                console.error("Error during special actions at start:", e);
                await showNotificationPopup("오류 발생", "게임 시작 중 오류가 발생했습니다: " + e.message);
            }
        }
    }

    async function endRound(winner) {
        clearInactivityTimer();
        let message;
        let finalWinnings = 0;

        if (winner === 'draw') {
            message = "이번 판은 무승부입니다!";
        } else {
            const winnerName = winner === 'player' ? '김여사' : OPPONENT_NAME;
            const winnerCaptured = winner === 'player' ? playerCaptured : aiCaptured;
            const loserCaptured = winner === 'player' ? aiCaptured : playerCaptured;
            const winnerStolenPi = winner === 'player' ? playerStolenPi : aiStolenPi;
            const loserStolenPi = winner === 'player' ? aiStolenPi : playerStolenPi;
            const winnerGoCount = winner === 'player' ? playerGoCount : aiGoCount;
            const loserGoCount = winner === 'player' ? aiGoCount : playerGoCount;
            const winnerShake = winner === 'player' ? playerShake : aiShake;

            const winnerScoreInfo = calculateScore(winnerCaptured, winnerStolenPi);
            const loserScoreInfo = calculateScore(loserCaptured, loserStolenPi);

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
            finalWinnings = finalScore * 100;

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
            // Don't render money immediately, wait for animation
            // render(); 

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

        // 1. Show Popup FIRST (User reads score, confirms)
        await showPopup("라운드 종료", message, [{ text: '다음 판', value: 'next' }]);

        // 2. Play Money Animation (Only if not draw)
        if (winner !== 'draw') {
            await animateMoneyTransfer(winner, finalWinnings);
            render(); // Update UI after animation to show new money balances
        }

        // Check for bankruptcy and reset if needed
        if (playerMoney <= 0 || aiMoney <= 0) {
            const bankruptPlayer = playerMoney <= 0 ? '김여사' : OPPONENT_NAME;
            await showPopup("게임 종료", `${bankruptPlayer}님이 파산했습니다!\n새 게임을 시작합니다.`, [{ text: '새 게임', value: 'new' }]);
            localStorage.clear(); // Clear all game data on bankruptcy
            loadGameData();
        }

        await startGame(winner === 'draw' ? 'player' : winner);
    }

    async function animateMoneyTransfer(winner, amount) {
        const coinCount = Math.min(20, Math.max(5, Math.floor(amount / 1000))); // 5 to 20 coins
        const startElement = winner === 'player' ? document.getElementById('ai-money') : document.getElementById('player-money');
        const endElement = winner === 'player' ? document.getElementById('player-money') : document.getElementById('ai-money');

        if (!startElement || !endElement) return;

        const startRect = startElement.getBoundingClientRect();
        const endRect = endElement.getBoundingClientRect();
        const gameBoard = document.getElementById('game-board');
        const gameBoardRect = gameBoard.getBoundingClientRect();

        const promises = [];

        for (let i = 0; i < coinCount; i++) {
            promises.push(new Promise(resolve => {
                const coin = document.createElement('div');
                coin.classList.add('money-coin');

                // Random start offset
                const startX = (startRect.left - gameBoardRect.left) + (startRect.width / 2) + (Math.random() * 20 - 10);
                const startY = (startRect.top - gameBoardRect.top) + (startRect.height / 2) + (Math.random() * 20 - 10);

                coin.style.left = `${startX}px`;
                coin.style.top = `${startY}px`;

                gameBoard.appendChild(coin);

                // Delay for staggered animation
                setTimeout(() => {
                    coin.style.transition = 'left 5s ease-in-out, top 5s ease-in-out'; // Smooth 5s animation
                    // Removed bouncy effect and opacity fade-out so it stays visible

                    // Random end offset
                    const endX = (endRect.left - gameBoardRect.left) + (endRect.width / 2) + (Math.random() * 20 - 10);
                    const endY = (endRect.top - gameBoardRect.top) + (endRect.height / 2) + (Math.random() * 20 - 10);

                    coin.style.left = `${endX}px`;
                    coin.style.top = `${endY}px`;
                    // coin.style.opacity = '0'; // REMOVED: Keep full visibility until end

                    setTimeout(() => {
                        if (gameBoard.contains(coin)) gameBoard.removeChild(coin);
                        resolve();
                    }, 5000); // Wait for transition
                }, i * 300); // Stagger
            }));
        }

        await Promise.all(promises);
    }

    function chooseBestCard(cards) {
        return cards.sort((a, b) => TYPE_VALUES[b.type] - TYPE_VALUES[a.type])[0];
    }

    /**
     * Animate a card or a group of cards from one point to another.
     * @param {Array<{element: HTMLElement, card: object}>} cards - Array of objects containing the card element and card data.
     * @param {{x: number, y: number}} destination - The destination coordinates relative to the game board.
     * @param {number} duration - The animation duration in ms.
     * @param {object} options - Optional parameters {stagger, scale, finalClass}.
     * @returns {Promise<void>} A promise that resolves when all animations are complete.
     */
    function animateCardMovement(cards, destination, duration, options = {}) {
        const { stagger = 50, scale = 1, finalClass = 'captured-card' } = options;
        const gameBoard = document.getElementById('game-board');
        const gameBoardRect = gameBoard.getBoundingClientRect();

        const animations = cards.map((cardInfo, index) => {
            return new Promise(resolve => {
                const { element: originalElement, card } = cardInfo;

                if (!originalElement) {
                    resolve();
                    return;
                }

                const startRect = originalElement.getBoundingClientRect();
                const animatedCard = createCardDiv(card, finalClass === 'captured-card');
                animatedCard.classList.add('card-animation');

                animatedCard.style.position = 'absolute';
                animatedCard.style.left = `${startRect.left - gameBoardRect.left}px`;
                animatedCard.style.top = `${startRect.top - gameBoardRect.top}px`;
                animatedCard.style.width = `${startRect.width}px`;
                animatedCard.style.height = `${startRect.height}px`;
                animatedCard.style.zIndex = 3001 + index;

                gameBoard.appendChild(animatedCard);
                if (originalElement) originalElement.style.opacity = '0';

                setTimeout(() => {
                    animatedCard.style.transition = `all ${duration / 1000}s ease-in-out`;
                    const destX = destination.x + (index * (finalClass === 'captured-card' ? 12 : 25));
                    animatedCard.style.left = `${destX}px`;
                    animatedCard.style.top = `${destination.y}px`;

                    const finalWidth = finalClass === 'captured-card' ? '36px' : '66px';
                    const finalHeight = finalClass === 'captured-card' ? '54px' : '99px';
                    animatedCard.style.height = finalHeight;
                    animatedCard.style.width = finalWidth;

                    if (scale !== 1) {
                        animatedCard.style.transform = `scale(${scale})`;
                    }
                }, 50 + (index * stagger));

                setTimeout(() => {
                    if (gameBoard.contains(animatedCard)) gameBoard.removeChild(animatedCard);
                    resolve();
                }, duration + 100 + (index * stagger));
            });
        });

        return Promise.all(animations);
    }

    /**
     * Helper function to animate and place a single card on the floor, either next to a match or in a generic spot.
     * @param {object} card - The card object to animate.
     * @param {HTMLElement} startElement - The element from which the card starts its animation (e.g., player hand card div, deck div).
     * @param {HTMLElement | null} matchElement - The HTML element of the card on the floor it's trying to match, or null if no direct match.
     * @returns {Promise<void>} A promise that resolves when the animation is complete.
     */
    async function animatePlay(card, startElement, matchElement = null) {
        const gameBoard = document.getElementById('game-board');
        const gameBoardRect = gameBoard.getBoundingClientRect();
        const floorDiv = document.getElementById('floor');
        const floorRect = floorDiv.getBoundingClientRect();

        let destX, destY;

        if (matchElement) {
            const matchRect = matchElement.getBoundingClientRect();
            destX = (matchRect.left - gameBoardRect.left) - (matchRect.width * 0.8);
            destY = (matchRect.top - gameBoardRect.top);
        } else {
            const tempCardForMeasurement = createCardDiv(card);
            floorDiv.appendChild(tempCardForMeasurement);
            const destRect = tempCardForMeasurement.getBoundingClientRect();
            floorDiv.removeChild(tempCardForMeasurement);
            destX = destRect.left - gameBoardRect.left;
            destY = destRect.top - gameBoardRect.top;
        }

        await animateCardMovement(
            [{ element: startElement, card: card }],
            { x: destX, y: destY },
            500,
            { finalClass: 'card' }
        );
    }

    async function animatePiSteal(player) {
        const opponent = player === 'player' ? 'ai' : 'player';
        const opponentCaptured = opponent === 'player' ? playerCaptured : aiCaptured;

        // Find the card to steal (logic from original stealPi)
        let stolenCardIndex = opponentCaptured.findIndex(c => c.type === TYPES.PI && !c.isDoublePi);
        if (stolenCardIndex === -1) stolenCardIndex = opponentCaptured.findIndex(c => c.isDoublePi && c.type === TYPES.YEOL);
        if (stolenCardIndex === -1) stolenCardIndex = opponentCaptured.findIndex(c => c.isDoublePi);
        if (stolenCardIndex === -1) stolenCardIndex = opponentCaptured.findIndex(c => c.type === TYPES.PI);

        if (stolenCardIndex === -1) return; // No card to steal

        const stolenCard = opponentCaptured[stolenCardIndex];

        const opponentPiAreaId = opponent === 'player' ? 'player-pi' : 'ai-pi';
        const opponentPiArea = document.getElementById(opponentPiAreaId);

        let originalCardDiv = null;
        if (opponentPiArea) {
            originalCardDiv = opponentPiArea.querySelector(`[data-card-id="${stolenCard.id}"]`);
        }

        if (!originalCardDiv) {
            const opponentCapturedSections = document.getElementById(`${opponent}-captured-sections`);
            if (opponentCapturedSections) {
                originalCardDiv = opponentCapturedSections.querySelector(`[data-card-id="${stolenCard.id}"]`);
            }
        }

        if (!originalCardDiv) return;

        const highlightClass = player === 'player' ? 'highlight-ai-move' : 'highlight-player-move';
        originalCardDiv.classList.add(highlightClass);
        await sleep(500);

        const gameBoard = document.getElementById('game-board');
        const gameBoardRect = gameBoard.getBoundingClientRect();

        const animatedCard = createCardDiv(stolenCard, true);
        animatedCard.classList.add('pi-steal-animation');
        const startRect = originalCardDiv.getBoundingClientRect();

        animatedCard.style.position = 'absolute';
        animatedCard.style.left = `${startRect.left - gameBoardRect.left}px`;
        animatedCard.style.top = `${startRect.top - gameBoardRect.top}px`;
        animatedCard.style.zIndex = 3000;
        gameBoard.appendChild(animatedCard);

        originalCardDiv.style.opacity = '0';
        originalCardDiv.classList.remove(highlightClass);

        const floorDiv = document.getElementById('floor');
        const floorRect = floorDiv.getBoundingClientRect();
        const centerX = (floorRect.left - gameBoardRect.left) + (floorRect.width / 2) - (startRect.width / 2);
        const centerY = (floorRect.top - gameBoardRect.top) + (floorRect.height / 2) - (startRect.height / 2);

        const stealerStolenPiArea = document.getElementById(`${player}-stolen-pi`);
        const destRect = stealerStolenPiArea.getBoundingClientRect();
        const destX = (destRect.left - gameBoardRect.left) + (stealerStolenPiArea.childElementCount * 12);
        const destY = destRect.top - gameBoardRect.top;

        await sleep(50);

        animatedCard.style.left = `${centerX}px`;
        animatedCard.style.top = `${centerY}px`;
        animatedCard.style.transform = 'scale(2.5)';
        await sleep(1200);

        await sleep(500);

        animatedCard.style.left = `${destX}px`;
        animatedCard.style.top = `${destY}px`;
        animatedCard.style.transform = 'scale(1)';
        await sleep(1200);

        gameBoard.removeChild(animatedCard);

        const actualStolenCard = opponentCaptured.splice(stolenCardIndex, 1)[0];
        const stolenPiPile = player === 'player' ? playerStolenPi : aiStolenPi;
        stolenPiPile.push(actualStolenCard);

        render();
    }

    async function stealPi(player) {
        await animatePiSteal(player);
    }

    async function playTurn(player, cardId) {
        if (player !== 'player') return;

        hideTurnNotificationBubble();
        if (playerShakeActive) {
            const shakenCardsInHand = playerHand.filter(c => c.isShaken);
            if (shakenCardsInHand.length > 0) {
                const shakenMonth = shakenCardsInHand[0].month;
                const playedCard = playerHand.find(c => c.id === cardId);
                if (playedCard && playedCard.month === shakenMonth) {
                    playerShakeActive = false;
                    hideShakeBubbles();
                }
            }
        }

        clearInactivityTimer();

        try {
            if (currentPlayer !== player) return;

            const hand = playerHand;
            const cardIndex = hand.findIndex(c => c.id === cardId);
            if (cardIndex === -1) return;

            const playedCard = hand[cardIndex];
            const playedCardDiv = playerHandDiv.querySelector(`[data-card-id="${cardId}"]`);

            if (canBomb && bombMonths.includes(playedCard.month)) {
                await playBomb(player, playedCard.month);
                return;
            }

            const matches = floor.filter(c => c.month === playedCard.month);
            let targetMatchElement = null;
            if (matches.length > 0) {
                const firstMatchCard = matches[0];
                targetMatchElement = floorDiv.querySelector(`[data-card-id="${firstMatchCard.id}"]`);
            }

            await animatePlay(playedCard, playedCardDiv, targetMatchElement);

            hand.splice(cardIndex, 1);
            floor.push(playedCard);
            render();
            await sleep(300);

            if (playedCard.type === 'dummy') {
                floor.pop();
                await finishTurn(player, null, null, null, 0);
                return;
            }

            const ppukIndex = ppukStacks.indexOf(playedCard.month);
            if (ppukIndex > -1) {
                await showToastPopup("'싼 거' 먹기!", `김여사님이 '쌌던' 패를 먹었습니다! 상대방 피 1장을 가져옵니다.`);
                const handCaptures = floor.filter(c => c.month === playedCard.month);
                ppukStacks.splice(ppukIndex, 1); // 뻑 스택에서 제거
                await stealPi(player); // 피 훔치기
                await finishTurn(player, handCaptures, null, null, 0);
                return;
            }

            const currentMatches = floor.filter(c => c.month === playedCard.month && c.id !== playedCard.id);

            if (currentMatches.length === 0) {
                await finishTurn(player, null, playedCard, null, 0);
            } else {
                let match;
                if (currentMatches.length > 1) {
                    match = await showChoicePopup(playedCard, currentMatches);
                } else {
                    match = currentMatches[0];
                }
                const handCaptures = [playedCard, match];
                await finishTurn(player, handCaptures, null, playedCard.month, currentMatches.length);
            }
        } catch (e) {
            console.error("Error during playTurn:", e);
            await showNotificationPopup("오류 발생", "플레이 중 오류가 발생했습니다: " + e.message);
        }
    }

    async function finishTurn(player, handCaptures, justPlayedOnFloor, playedMonth = null, matchCountAtTurnStart = 0) {
        const mainCaptured = player === 'player' ? playerCaptured : aiCaptured;
        let turnCaptures = handCaptures ? [...handCaptures] : [];
        let deckCaptures = [];

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

        const deckMatches = floor.filter(c => c.month === drawnCard.month && c.id !== drawnCard.id);
        let deckTargetMatchElement = null;
        if (deckMatches.length > 0) {
            const firstDeckMatchCard = deckMatches[0];
            deckTargetMatchElement = floorDiv.querySelector(`[data-card-id="${firstDeckMatchCard.id}"]`);
        }

        const deckArea = document.getElementById('deck-area').querySelector('.card-back');
        await animatePlay(drawnCard, deckArea, deckTargetMatchElement);

        floor.push(drawnCard);
        render();
        await sleep(500); // Let the card land and be visible

        const playerName = player === 'player' ? '김여사' : OPPONENT_NAME;
        let eventOccurred = false;
        let isNewPpeok = false;
        let stealPiOnEvent = false;

        if (playedMonth && drawnCard.month === playedMonth) {
            if (matchCountAtTurnStart === 2) { // 따닥!
                await showNotificationPopup("따닥!", `${playerName}님의 따닥! 상대방의 피를 한 장 가져옵니다.`);
                const remainingCardOnFloor = floor.find(c => c.month === playedMonth && ![...turnCaptures,
                    drawnCard].map(card => card.id).includes(c.id));
                if (remainingCardOnFloor) deckCaptures.push(remainingCardOnFloor);
                deckCaptures.push(drawnCard);
                stealPiOnEvent = true;
                eventOccurred = true;
            } else if (matchCountAtTurnStart === 1) { // 뻑 (쌌다)
                await showToastPopup("뻑!", `${playerName}님이 뻑!을 했습니다.`);
                isNewPpeok = true;
                // stealPiOnEvent = true; 제거됨 - 뻑 시 피를 훔치지 않음
                eventOccurred = true;
            }
        }

        if (!eventOccurred) {
            const ppukIndex = ppukStacks.indexOf(drawnCard.month);
            if (ppukIndex > -1) { // 쌌던 패 먹기
                await showToastPopup("'싼 거' 먹기!", `${playerName}님이 '쌌던' 패를 먹었습니다! 상대방 피 1장을 가져옵니다.`);
                deckCaptures.push(...floor.filter(c => c.month === drawnCard.month));
                ppukStacks.splice(ppukIndex, 1);
                stealPiOnEvent = true;
            } else if (justPlayedOnFloor && drawnCard.month === justPlayedOnFloor.month) { // 쪽!
                await showToastPopup('쪽!', `${playerName}님, 쪽! 축하합니다!`);
                deckCaptures.push(justPlayedOnFloor, drawnCard);
                stealPiOnEvent = true;
            } else { // 일반 덱 매치
                const currentDeckMatches = floor.filter(c => c.month === drawnCard.month && c.id !== drawnCard.id
                    && ![...turnCaptures].map(card => card.id).includes(c.id));
                if (currentDeckMatches.length > 0) {
                    let match = (currentDeckMatches.length > 1 && player === 'player') ? await showChoicePopup
                        (drawnCard, currentDeckMatches) : chooseBestCard(currentDeckMatches);
                    deckCaptures.push(drawnCard, match);
                }
            }
        }

        if (isNewPpeok) {
            turnCaptures = [];
        }

        const allTurnCaptures = [...turnCaptures, ...deckCaptures];

        if (allTurnCaptures.length > 0) {
            allTurnCaptures.forEach(c => c[player === 'player' ? 'highlight' : 'aiHighlight'] = true);
            render();
            await sleep(800); // Pause to show all highlighted cards

            const cardsToAnimate = allTurnCaptures.map(c => ({
                card: c,
                element: floorDiv.querySelector(`[data-card-id="${c.id}"]`)
            })).filter(item => item.element);

            if (cardsToAnimate.length > 0) {
                const animationGroups = cardsToAnimate.reduce((acc, item) => {
                    const type = item.card.type;
                    if (!acc[type]) acc[type] = [];
                    acc[type].push(item);
                    return acc;
                }, {});

                const gameBoardRect = document.getElementById('game-board').getBoundingClientRect();
                const animationPromises = Object.keys(animationGroups).map(type => {
                    const group = animationGroups[type];
                    const destPile = document.getElementById(`${player}-${type}`);
                    const captureDestRect = destPile.getBoundingClientRect();
                    return animateCardMovement(
                        group,
                        { x: captureDestRect.left - gameBoardRect.left, y: captureDestRect.top - gameBoardRect.top },
                        800
                    );
                });
                await Promise.all(animationPromises);
            }

            allTurnCaptures.forEach(c => c[player === 'player' ? 'highlight' : 'aiHighlight'] = false);
            const capturedIds = allTurnCaptures.map(c => c.id);
            floor = floor.filter(c => !capturedIds.includes(c.id));
            mainCaptured.push(...allTurnCaptures);
        }

        if (floor.length === 0 && allTurnCaptures.length > 0 && deck.length > 0) {
            await showToastPopup("싹쓸이!", `${playerName}님이 바닥을 모두 쓸었습니다! 상대방의 피를 한 장 가져옵니다.`);
            stealPiOnEvent = true;
        }

        if (isNewPpeok) {
            ppukStacks.push(playedMonth);
        }

        if (stealPiOnEvent) {
            await stealPi(player);
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
                await playBomb('ai', specialMove.month);
                return;
            }
            if (specialMove.action === 'shake') {
                aiShake = true;
                aiShakeActive = true;
                aiHand.forEach(card => {
                    if (card.month === specialMove.month) card.isShaken = true;
                });
                showShakeBubble('ai', '패 흔들었소.');
                render();
                await sleep(1500);
            }

            const cardToPlay = getAIBestMove();
            if (!cardToPlay) {
                const playerScore = calculateScore(playerCaptured, playerStolenPi).score;
                const aiScore = calculateScore(aiCaptured, aiStolenPi).score;
                if (playerScore >= 7 && playerScore > aiScore) await endRound('player');
                else if (aiScore >= 7 && aiScore > playerScore) await endRound('ai');
                else await endRound('draw');
                return;
            }

            const aiHandIndex = aiHand.findIndex(c => c.id === cardToPlay.id);
            const cardDiv = aiHandDiv.children[aiHandIndex];

            const matches = floor.filter(c => c.month === cardToPlay.month);
            let targetMatchElement = null;
            if (matches.length > 0) {
                const firstMatchCard = matches[0];
                targetMatchElement = floorDiv.querySelector(`[data-card-id="${firstMatchCard.id}"]`);
            }

            await animatePlay(cardToPlay, cardDiv, targetMatchElement);

            aiHand.splice(aiHandIndex, 1);
            floor.push(cardToPlay);

            render();
            await sleep(300);

            if (cardToPlay.type === 'dummy') {
                floor.pop();
                await finishTurn('ai', null, null, null, 0);
                return;
            }

            const ppukIndex = ppukStacks.indexOf(cardToPlay.month);
            if (ppukIndex > -1) {
                await showToastPopup("'싼 거' 먹기!", `${OPPONENT_NAME}님이 '쌌던' 패를 먹었습니다! 상대방 피 1장을 가져옵니다.`);
                const handCaptures = floor.filter(c => c.month === cardToPlay.month);
                ppukStacks.splice(ppukIndex, 1); // 뻑 스택에서 제거
                await stealPi('ai'); // 피 훔치기
                await finishTurn('ai', handCaptures, null, null, 0);
                return;
            }

            const currentMatches = floor.filter(c => c.month === cardToPlay.month && c.id !== cardToPlay.id);

            if (currentMatches.length === 0) {
                await finishTurn('ai', null, cardToPlay, null, 0);
            } else {
                const match = chooseBestCard(currentMatches);
                const handCaptures = [cardToPlay, match];
                await finishTurn('ai', handCaptures, null, cardToPlay.month, currentMatches.length);
            }
        } catch (e) {
            console.error("Error during aiTurn:", e);
            await showNotificationPopup("오류 발생", "AI 턴 진행 중 오류가 발생했습니다: " + e.message);
        }
    }

    async function switchTurn(fromPlayer) {
        clearInactivityTimer();
        hideTurnNotificationBubble(); // 이전 턴의 알림을 확실히 제거
        hideDiscardHint(); // Hide any existing hints before switching turns
        hideShakeBubbles(); // Clear any previous shake bubbles
        hideInfoBubble(); // Clear any previous info bubbles

        currentPlayer = fromPlayer === 'player' ? 'ai' : 'player';

        if (currentPlayer === 'ai') {
            if (aiShakeActive) {
                showShakeBubble('ai', '패 흔들었소.');
            }
            playerHandDiv.style.pointerEvents = 'none';

            // AI 턴에서도 찬스 알림 표시
            showTurnNotificationBubble();

            setTimeout(aiTurn, 1000);
        } else { // Player's turn
            if (playerShakeActive) {
                showShakeBubble('player', '흔들었어요!');
            }

            if (playerHand.length === 0) {
                const playerScore = calculateScore(playerCaptured).score;
                const aiScore = calculateScore(aiCaptured).score;
                if (playerScore >= 7 && playerScore > aiScore) {
                    await endRound('player');
                } else if (aiScore >= 7 && aiScore > playerScore) {
                    await endRound('ai');
                } else {
                    await endRound('draw');
                }
                return;
            }

            isTurnInProgress = false; // Release lock
            playerHandDiv.style.pointerEvents = 'auto';
            try {
                await handleSpecialActions();
                showTurnNotificationBubble(); // 플레이어 턴 시작 시 알림 표시
                startInactivityTimer();
            } catch (e) {
                console.error("Error during special actions on player turn:", e);
                await showNotificationPopup("오류 발생", "게임 진행 중 오류가 발생했습니다: " + e.message);
            }
        }
    }

    async function playBomb(player, month) {
        const hand = player === 'player' ? playerHand : aiHand;
        const handDiv = player === 'player' ? playerHandDiv : aiHandDiv;
        const playerName = player === 'player' ? '김여사' : OPPONENT_NAME;

        const bombCardsFromHand = hand.filter(c => c.month === month);
        const bombCardDivs = bombCardsFromHand.map(c => handDiv.querySelector(`[data-card-id="${c.id}"]`));

        const floorDest = floorDiv.getBoundingClientRect();
        const gameBoardRect = document.getElementById('game-board').getBoundingClientRect();

        const animationPromises = bombCardsFromHand.map((c, i) => {
            return animateCardMovement(
                [{ card: c, element: bombCardDivs[i] }],
                { x: floorDest.left - gameBoardRect.left + 15 + (i * 70), y: floorDest.top - gameBoardRect.top + 15 },
                600,
                { finalClass: 'card' }
            );
        });
        await Promise.all(animationPromises);

        const floorCard = floor.find(c => c.month === month);
        const allBombCards = [...bombCardsFromHand, floorCard];

        // 손패에서 폭탄 카드 제거
        if (player === 'player') {
            playerHand = hand.filter(c => c.month !== month);
        } else {
            aiHand = hand.filter(c => c.month !== month);
        }

        // 가짜 패 2장 추가 (폭탄으로 손패가 부족해지므로)
        const dummyCard1 = { id: 'dummy1', month: -1, type: 'dummy', name: '가짜패', image: 'Hanafuda_card_back_Alt.svg.png' };
        const dummyCard2 = { id: 'dummy2', month: -1, type: 'dummy', name: '가짜패', image: 'Hanafuda_card_back_Alt.svg.png' };

        if (player === 'player') {
            playerHand.push(dummyCard1, dummyCard2);
        } else {
            aiHand.push(dummyCard1, dummyCard2);
        }

        floor.push(...bombCardsFromHand);
        render();
        await sleep(500);

        // 폭탄 메시지 표시 및 피 훔치기
        await showNotificationPopup("폭탄!", `${playerName}님의 폭탄! 상대방의 피를 한 장 가져옵니다.`);
        await stealPi(player);
        await finishTurn(player, allBombCards, null, month, 1);
    }

    // ... rest of the file
    // --- Inactivity Timer & Turn Notification ---
    function clearInactivityTimer() {
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
            inactivityTimer = null;
        }
    }

    function startInactivityTimer() {
        clearInactivityTimer();
        if (currentPlayer !== 'player' || isGoStopTurn) return;

        // 더 이상 startInactivityTimer에서 showTurnNotificationBubble을 직접 호출하지 않습니다.
        // (switchTurn에서 이미 호출되었으므로 중복 증가 방지)
    }

    let prevPlayerSets = { godori: false, hongdan: false, cheongdan: false, chodan: false };
    let prevAiSets = { godori: false, hongdan: false, cheongdan: false, chodan: false };

    function checkAndCelebrateSets() {
        const checkSets = (captured, prevSets, playerName) => {
            const currentSets = {
                godori: captured.filter(c => [5, 13, 30].includes(c.id)).length === 3,
                hongdan: captured.filter(c => [2, 6, 10].includes(c.id)).length === 3,
                cheongdan: captured.filter(c => [22, 34, 38].includes(c.id)).length === 3,
                chodan: captured.filter(c => [14, 18, 26].includes(c.id)).length === 3
            };

            if (currentSets.godori && !prevSets.godori) showCelebrationPopup(playerName, "고도리");
            if (currentSets.hongdan && !prevSets.hongdan) showCelebrationPopup(playerName, "홍단");
            if (currentSets.cheongdan && !prevSets.cheongdan) showCelebrationPopup(playerName, "청단");
            if (currentSets.chodan && !prevSets.chodan) showCelebrationPopup(playerName, "초단");

            return currentSets;
        };

        prevPlayerSets = checkSets(playerCaptured, prevPlayerSets, '김여사');
        prevAiSets = checkSets(aiCaptured, prevAiSets, OPPONENT_NAME);
    }

    function showCelebrationPopup(playerName, setName) {
        const popup = document.createElement('div');
        popup.className = 'celebration-popup';
        popup.innerHTML = `
            <div class="celebration-content">
                <div class="confetti">🎉</div>
                <div class="celebration-text">
                    <span class="player-name-pop">${playerName}</span><br>
                    <span class="set-name-pop">${setName} 달성!</span>
                </div>
                <div class="confetti">🎊</div>
            </div>
        `;
        document.body.appendChild(popup);

        // Sound effect (optional, maybe later)

        // Remove after animation
        setTimeout(() => {
            popup.classList.add('fade-out');
            setTimeout(() => popup.remove(), 500);
        }, 2500);
    }

    function showTurnNotificationBubble() {
        if (isTurnInProgress || isGoStopTurn) return; // 턴 진행 중이거나 고/스톱 선택 시에는 표시하지 않음

        // Remove any existing bubble first
        hideTurnNotificationBubble();

        // 모든 가능한 찬스를 수집
        const allChances = [];

        // --- Player Chances ---
        // 1. Check Godori (2, 4, 8 Yeol)
        const godoriCards = [5, 13, 30]; // IDs for Feb(5), Apr(13), Aug(30) Yeol
        const playerGodori = playerCaptured.filter(c => godoriCards.includes(c.id)).map(c => c.id);
        if (playerGodori.length === 2) {
            const missingId = godoriCards.find(id => !playerGodori.includes(id));
            const isMissingCapturedByAi = aiCaptured.some(c => c.id === missingId);
            if (!isMissingCapturedByAi) {
                allChances.push({ message: "고도리 찬스!", type: "player-warning" });
            }
        }

        // 2. Check Hongdan (1, 2, 3 Tti)
        const hongdanCards = [2, 6, 10];
        const playerHongdan = playerCaptured.filter(c => hongdanCards.includes(c.id)).map(c => c.id);
        if (playerHongdan.length === 2) {
            const missingId = hongdanCards.find(id => !playerHongdan.includes(id));
            const isMissingCapturedByAi = aiCaptured.some(c => c.id === missingId);
            if (!isMissingCapturedByAi) {
                allChances.push({ message: "홍단 찬스!", type: "player-warning" });
            }
        }

        // 3. Check Cheongdan (6, 9, 10 Tti)
        const cheongdanCards = [22, 34, 38];
        const playerCheongdan = playerCaptured.filter(c => cheongdanCards.includes(c.id)).map(c => c.id);
        if (playerCheongdan.length === 2) {
            const missingId = cheongdanCards.find(id => !playerCheongdan.includes(id));
            const isMissingCapturedByAi = aiCaptured.some(c => c.id === missingId);
            if (!isMissingCapturedByAi) {
                allChances.push({ message: "청단 찬스!", type: "player-warning" });
            }
        }

        // 4. Check Chodan (4, 5, 7 Tti)
        const chodanCards = [14, 18, 26];
        const playerChodan = playerCaptured.filter(c => chodanCards.includes(c.id)).map(c => c.id);
        if (playerChodan.length === 2) {
            const missingId = chodanCards.find(id => !playerChodan.includes(id));
            const isMissingCapturedByAi = aiCaptured.some(c => c.id === missingId);
            if (!isMissingCapturedByAi) {
                allChances.push({ message: "초단 찬스!", type: "player-warning" });
            }
        }

        // --- AI (Opponent) Chances ---
        // 1. AI Godori
        const aiGodori = aiCaptured.filter(c => godoriCards.includes(c.id)).map(c => c.id);
        if (aiGodori.length === 2) {
            const missingId = godoriCards.find(id => !aiGodori.includes(id));
            const isMissingCapturedByPlayer = playerCaptured.some(c => c.id === missingId);
            if (!isMissingCapturedByPlayer) {
                allChances.push({ message: "할머니 고도리 찬스!", type: "ai-warning" });
            }
        }

        // 2. AI Hongdan
        const aiHongdan = aiCaptured.filter(c => hongdanCards.includes(c.id)).map(c => c.id);
        if (aiHongdan.length === 2) {
            const missingId = hongdanCards.find(id => !aiHongdan.includes(id));
            const isMissingCapturedByPlayer = playerCaptured.some(c => c.id === missingId);
            if (!isMissingCapturedByPlayer) {
                allChances.push({ message: "할머니 홍단 찬스!", type: "ai-warning" });
            }
        }

        // 3. AI Cheongdan
        const aiCheongdan = aiCaptured.filter(c => cheongdanCards.includes(c.id)).map(c => c.id);
        if (aiCheongdan.length === 2) {
            const missingId = cheongdanCards.find(id => !aiCheongdan.includes(id));
            const isMissingCapturedByPlayer = playerCaptured.some(c => c.id === missingId);
            if (!isMissingCapturedByPlayer) {
                allChances.push({ message: "할머니 청단 찬스!", type: "ai-warning" });
            }
        }

        // 4. AI Chodan
        const aiChodan = aiCaptured.filter(c => chodanCards.includes(c.id)).map(c => c.id);
        if (aiChodan.length === 2) {
            const missingId = chodanCards.find(id => !aiChodan.includes(id));
            const isMissingCapturedByPlayer = playerCaptured.some(c => c.id === missingId);
            if (!isMissingCapturedByPlayer) {
                allChances.push({ message: "할머니 초단 찬스!", type: "ai-warning" });
            }
        }

        // 찬스가 있으면 순차적으로 표시
        let message = '';
        let type = 'player-generic';

        if (allChances.length > 0) {
            // 순차적으로 돌아가며 표시
            const selectedChance = allChances[currentChanceIndex % allChances.length];
            message = selectedChance.message;
            type = selectedChance.type;

            // 다음 턴을 위해 인덱스 증가
            currentChanceIndex++;
        } else {
            // Generic Message based on current player
            if (currentPlayer === 'player') {
                message = '김여사님 차례에요.';
                type = 'player-generic';
            } else {
                message = `${OPPONENT_NAME} 차례에요.`;
                type = 'ai-generic';
            }
        }

        renderBubble(message, type);
    }

    function renderBubble(message, type) {
        const bubble = document.createElement('div');
        bubble.className = 'turn-notification-bubble';
        bubble.textContent = message;

        let parentArea;

        if (type === 'ai-warning' || type === 'ai-generic') {
            bubble.classList.add(type.includes('warning') ? 'warning-bubble' : 'standard-bubble', 'ai-side');
            parentArea = document.getElementById('ai-area');
        } else if (type === 'player-warning') {
            bubble.classList.add('warning-bubble', 'player-side');
            parentArea = document.getElementById('player-area');
        } else {
            // Generic Player
            bubble.classList.add('player-side'); // Standard position
            parentArea = document.getElementById('player-area');
        }

        if (parentArea) {
            parentArea.appendChild(bubble);
        }

        // Hide timer
        const duration = (type.includes('warning')) ? 5000 : 3000;
        turnNotificationTimer = setTimeout(hideTurnNotificationBubble, duration);
    }

    function hideTurnNotificationBubble() {
        // Clear the auto-hide timer if it's running
        if (turnNotificationTimer) {
            clearTimeout(turnNotificationTimer);
            turnNotificationTimer = null;
        }
        const existingBubble = document.querySelector('.turn-notification-bubble');
        if (existingBubble) {
            existingBubble.remove();
        }
    }

    function showShakeBubble(player, message) {
        const areaId = player === 'player' ? 'player-area' : 'ai-area';
        const parentArea = document.getElementById(areaId);
        if (!parentArea) return;

        // Remove any existing bubble first
        const existingBubble = parentArea.querySelector('.speech-bubble');
        if (existingBubble) {
            existingBubble.remove();
        }

        const bubble = document.createElement('div');
        bubble.className = 'speech-bubble';
        bubble.textContent = message;

        // Position bubble
        if (player === 'player') {
            bubble.style.bottom = '130px'; // Above the hand
            bubble.style.right = '20px';
        } else {
            bubble.style.top = '90px'; // Below the hand
            bubble.style.right = '20px';
        }

        parentArea.appendChild(bubble);

        // Animate in
        setTimeout(() => {
            bubble.classList.add('visible');
        }, 100);

        // Automatically hide the bubble after 3 seconds
        setTimeout(hideShakeBubbles, 3000);
    }

    function hideShakeBubbles() {
        const bubbles = document.querySelectorAll('.speech-bubble');
        bubbles.forEach(bubble => bubble.remove());
    }

    function showInfoBubble(message) {
        const parentArea = document.getElementById('player-area');
        if (!parentArea) return;

        // Remove previous info bubble
        const existingBubble = parentArea.querySelector('.info-bubble');
        if (existingBubble) existingBubble.remove();

        const bubble = document.createElement('div');
        bubble.className = 'info-bubble';
        bubble.textContent = message;
        parentArea.appendChild(bubble);

        // Animate in
        setTimeout(() => bubble.classList.add('visible'), 100);

        // Animate out and remove after a delay
        setTimeout(() => {
            bubble.classList.remove('visible');
            setTimeout(() => {
                if (bubble.parentElement) {
                    bubble.remove();
                }
            }, 500); // Remove from DOM after fade out
        }, 4500); // Visible for 4.5 seconds
    }

    function hideInfoBubble() {
        const bubble = document.querySelector('.info-bubble');
        if (bubble) bubble.remove();
    }

    // --- HINT SYSTEM ---
    function findBestDiscard() {
        // 1. Check if any capture is possible. If so, no hint.
        const canCapture = playerHand.some(handCard => floor.some(floorCard => floorCard.month === handCard.month));
        if (canCapture) {
            return null;
        }

        // 2. If no capture, find the safest card to discard.
        // Strategy: Prioritize discarding cards that are least valuable and less likely to help the opponent.
        let bestCard = null;
        let bestDangerScore = Infinity;

        for (const card of playerHand) {
            let dangerScore = 100; // Base danger

            // Lower danger for lower value cards
            if (card.type === TYPES.PI) dangerScore -= 50;
            if (card.type === TYPES.TTI) dangerScore -= 30;
            if (card.type === TYPES.YEOL) dangerScore -= 10;
            if (card.type === TYPES.GWANG) dangerScore += 50; // High danger

            // Lower danger if opponent already has cards of this month (less likely to make a new yaku)
            const opponentHasMonth = aiCaptured.some(c => c.month === card.month);
            if (opponentHasMonth) {
                dangerScore -= 20;
            }

            // Higher danger if this is the 3rd card of a month on the board (risk of ppeok)
            const floorCount = floor.filter(c => c.month === card.month).length;
            if (floorCount === 2) {
                dangerScore += 40;
            }

            if (dangerScore < bestDangerScore) {
                bestDangerScore = dangerScore;
                bestCard = card;
            }
        }
        return bestCard;
    }

    function showDiscardHint(cardId) {
        hideDiscardHint(); // Remove any previous hint
        const cardDiv = document.querySelector(`#player-hand .card[data-card-id="${cardId}"]`);
        if (!cardDiv) return;

        // Add class to elevate the card's stacking context
        cardDiv.classList.add('hinted-card');

        const hintContainer = document.createElement('div');
        hintContainer.className = 'hint-container';
        hintContainer.id = 'discard-hint';

        const hintBubble = document.createElement('div');
        hintBubble.className = 'hint-bubble';
        hintBubble.textContent = '이 카드를 내는 게 좋겠어요!';

        const hintArrow = document.createElement('div');
        hintArrow.className = 'hint-arrow';

        hintContainer.appendChild(hintBubble);
        hintContainer.appendChild(hintArrow);
        cardDiv.appendChild(hintContainer);

        // Automatically hide the hint after 3 seconds
        setTimeout(hideDiscardHint, 3000);
    }

    function hideDiscardHint() {
        // Remove the helper class from any card that has it
        const oldHintedCard = document.querySelector('.hinted-card');
        if (oldHintedCard) {
            oldHintedCard.classList.remove('hinted-card');
        }

        // Remove the hint element itself
        const existingHint = document.getElementById('discard-hint');
        if (existingHint) {
            existingHint.parentNode.removeChild(existingHint);
        }
    }

    async function handleSpecialActions() {
        if (isGoStopTurn) return;
        const special = checkForSpecials(); // This now returns an object

        // Offer to shake.
        if (special.canShake && !playerShake && !hasBeenOfferedShake) {
            hasBeenOfferedShake = true; // Ask only once per round
            const choice = await showPopup('흔들기!', '패에 같은 월의 카드가 3장 있습니다.\n흔드시겠습니까?',
                [
                    { text: '예', value: 'yes' },
                    { text: '아니오', value: 'no' }
                ]
            );
            if (choice === 'yes') {
                playerShake = true; // For score bonus
                playerShakeActive = true; // For bubble
                // Mark the cards as shaken
                const monthToShake = special.shakeMonth;
                playerHand.forEach(card => {
                    if (card.month === monthToShake) {
                        card.isShaken = true;
                    }
                });
                showShakeBubble('player', '흔들었어요!');
                render(); // Re-render to show shaken cards
            }
        }
    }

    async function handleGoStopPopup() {
        isGoStopTurn = true;
        clearInactivityTimer();

        const playerScore = calculateScore(playerCaptured, playerStolenPi).score;
        const aiScore = calculateScore(aiCaptured, aiStolenPi).score;
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
            await showToastPopup("고!", '김여사님이 고!를 외쳤습니다.');
            switchTurn('player');
        } else {
            await endRound('player');
        }
    }

    function checkForSpecials() {
        const hand = playerHand;
        const handCounts = hand.reduce((acc, c) => { acc[c.month] = (acc[c.month] || 0) + 1; return acc; }, {});

        let special = { canShake: false, shakeMonth: -1, canBomb: false, bombMonths: [] };

        for (const month in handCounts) {
            const monthNum = parseInt(month);
            if (handCounts[monthNum] >= 3) {
                if (!special.canShake) { // Only find the first one for shaking
                    special.canShake = true;
                    special.shakeMonth = monthNum;
                }

                const floorHasMatch = floor.some(c => c.month === monthNum);
                if (handCounts[monthNum] === 3 && floorHasMatch) {
                    const floorCount = floor.filter(c => c.month === monthNum).length;
                    if (floorCount === 1) {
                        special.canBomb = true;
                        special.bombMonths.push(monthNum); // But find all bombs
                    }
                }
            }
        }
        // Update global vars
        canBomb = special.canBomb;
        bombMonths = special.bombMonths;
        return special;
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
                const scoreBefore = calculateScore(aiCaptured, aiStolenPi).score;
                const scoreAfter = calculateScore(futureCaptures, aiStolenPi).score;
                if (scoreAfter > scoreBefore) {
                    currentScore += (scoreAfter - scoreBefore) * 10;
                }

            } else {
                // This is a discard move
                currentScore -= TYPE_VALUES[card.type];
                if (card.isDoublePi) currentScore -= 5;

                // Penalty for giving player a good card. Check if player can take it.
                const playerHandHasMatch = playerHand.some(c => c.month === card.month);
                if (playerHandHasMatch) {
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
        const playerScoreInfo = calculateScore(playerCaptured, playerStolenPi);
        const aiScoreInfo = calculateScore(aiCaptured, aiStolenPi);

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

    function calculateScore(captured, stolenPi = []) {
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

        const piCount = pis.reduce((acc, card) => acc + (card.isDoublePi ? 2 : 1), 0) + stolenPi.reduce((acc, card) => acc + (card.isDoublePi ? 2 : 1), 0);
        if (piCount >= 10) score += piCount - 9;

        return { score, piCount, gwangCount: gwangs.length };
    }

    function initializeCardHover() {
        const capturedAreas = [
            'player-gwang', 'player-yeol', 'player-tti', 'player-pi',
            'ai-gwang', 'ai-yeol', 'ai-tti', 'ai-pi'
        ];
        const originalOverlap = 12; // Original overlap from renderCaptured
        const spreadOverlap = 35;   // New overlap on hover (card width is 36px)

        capturedAreas.forEach(id => {
            const container = document.getElementById(id);
            if (!container) return;

            const section = container.closest('.section');

            container.addEventListener('mouseenter', () => {
                if (section) section.style.zIndex = '10';
                const cards = container.querySelectorAll('.captured-card');
                cards.forEach((card, index) => {
                    card.style.left = `${index * spreadOverlap}px`;
                });
            });

            container.addEventListener('mouseleave', () => {
                if (section) section.style.zIndex = '1';
                const cards = container.querySelectorAll('.captured-card');
                cards.forEach((card, index) => {
                    card.style.left = `${index * originalOverlap}px`;
                });
            });
        });
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
        initializeCardHover();
    })();
});