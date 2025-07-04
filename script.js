// script.js atualizado

// Variáveis globais
let timer;
let remainingTime = 0;
let totalTime = 0;
let currentColor = '';
let currentOrder = '';

// Iniciar o temporizador
function startTimer(minutes, color) {
    clearInterval(timer);
    totalTime = minutes * 60;
    remainingTime = totalTime;
    currentColor = color;
    currentOrder = document.getElementById('order-number').value || 'Sem pedido';
    
    updateTimerDisplay();
    document.getElementById('color-indicator').style.backgroundColor = color;
    document.getElementById('order-display').textContent = currentOrder;
    document.querySelector('.finish-btn').disabled = false;
    
    timer = setInterval(() => {
        remainingTime--;
        updateTimerDisplay();
        
        if (remainingTime <= 0) {
            clearInterval(timer);
            playAlertSound();
        }
    }, 1000);
}

// Atualizar a exibição do temporizador
function updateTimerDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('timer-display').textContent = display;
    
    // Atualizar barra de progresso
    const progress = (remainingTime / totalTime) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    document.getElementById('percentage-display').textContent = `${Math.round(100 - progress)}%`;
}

// Iniciar temporizador personalizado
function startCustomTimer() {
    const customTime = parseInt(document.getElementById('custom-time').value);
    if (customTime && customTime > 0) {
        startTimer(customTime, '#6a11cb');
        document.getElementById('custom-time-frame').style.display = 'none';
    }
}

// Alternar exibição do tempo personalizado
function toggleCustomTime() {
    const customTimeFrame = document.getElementById('custom-time-frame');
    customTimeFrame.style.display = customTimeFrame.style.display === 'none' ? 'block' : 'none';
    
    if (customTimeFrame.style.display === 'block') {
        customTimeFrame.classList.add('fade-in');
        document.getElementById('custom-time').focus();
    }
}

// Finalizar o temporizador
function finishTimer() {
    clearInterval(timer);
    saveToHistory();
    resetTimer();
}

// Reiniciar a página
function restartPage() {
    location.reload();
}

// Resetar o temporizador
function resetTimer() {
    clearInterval(timer);
    remainingTime = 0;
    totalTime = 0;
    document.getElementById('timer-display').textContent = '00:00';
    document.getElementById('progress-bar').style.width = '100%';
    document.getElementById('percentage-display').textContent = '0%';
    document.getElementById('color-indicator').style.backgroundColor = 'transparent';
    document.getElementById('order-display').textContent = '';
    document.querySelector('.finish-btn').disabled = true;
}

// Salvar no histórico
function saveToHistory() {
    const usedMinutes = Math.round((totalTime - remainingTime) / 60);
    const expectedMinutes = Math.round(totalTime / 60);
    const orderNumber = currentOrder || 'Sem número';
    
    const historyItem = {
        orderNumber: orderNumber,
        expectedTime: expectedMinutes,
        usedTime: usedMinutes,
        timestamp: new Date().toISOString()
    };
    
    let history = JSON.parse(localStorage.getItem('timerHistory')) || [];
    history.unshift(historyItem); // Adiciona no início do array
    localStorage.setItem('timerHistory', JSON.stringify(history));
    
    updateHistoryList();
}

// Atualizar lista de histórico
function updateHistoryList() {
    const historyList = document.getElementById('history-list');
    const history = JSON.parse(localStorage.getItem('timerHistory')) || [];
    
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        historyList.innerHTML = '<div class="history-empty">Nenhum pedido registrado</div>';
        return;
    }
    
    history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item fade-in';
        historyItem.innerHTML = `
            <div>
                <span class="order-id">${item.orderNumber}</span>
                <span class="time-info">Previsto: ${item.expectedTime} min</span>
            </div>
            <div class="time-info">Usado: ${item.usedTime} min</div>
        `;
        historyList.appendChild(historyItem);
    });
}

// Limpar histórico
function clearHistory() {
    if (confirm('Tem certeza que deseja limpar todo o histórico?')) {
        localStorage.removeItem('timerHistory');
        updateHistoryList();
    }
}

// Imprimir histórico
function printHistory() {
    window.print();
}

// Tocar som de alerta
function playAlertSound() {
    const sound = document.getElementById('alert-sound');
    sound.play();
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    updateHistoryList();
    
    // Permitir Enter no campo de pedido
    document.getElementById('order-number').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            startTimer(30, '#2E5E4E');
        }
    });
    
    // Permitir Enter no tempo personalizado
    document.getElementById('custom-time').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            startCustomTimer();
        }
    });
});