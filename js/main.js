// Main Application Logic
class BettingApp {
    constructor() {
        this.initialized = false;
        this.init();
    }

    async init() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setupApp());
            } else {
                this.setupApp();
            }
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }

    setupApp() {
        try {
            this.setupEventListeners();
            this.loadMatches();
            this.displayWelcomeMessage();
            this.initialized = true;
            console.log('Application initialized successfully!');
        } catch (error) {
            console.error('Error setting up app:', error);
        }
    }

    setupEventListeners() {
        // Wallet connection
        const connectWalletBtn = document.getElementById('connectWallet');
        if (connectWalletBtn) {
            connectWalletBtn.addEventListener('click', () => this.handleWalletConnection());
        }

        // Chat functionality
        const chatInput = document.getElementById('chatInput');
        const sendButton = document.getElementById('sendMessage');
        
        if (chatInput && sendButton) {
            sendButton.addEventListener('click', () => this.handleSendMessage());
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSendMessage();
                }
            });
        }

        // Refresh matches
        const refreshBtn = document.getElementById('refreshMatches');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadMatches());
        }

        // Wallet actions
        const depositBtn = document.getElementById('depositBtn');
        const withdrawBtn = document.getElementById('withdrawBtn');
        
        if (depositBtn) {
            depositBtn.addEventListener('click', () => this.showDepositModal());
        }
        
        if (withdrawBtn) {
            withdrawBtn.addEventListener('click', () => this.showWithdrawModal());
        }

        // Modal functionality
        this.setupModalEvents();
    }

    setupModalEvents() {
        // Close modals
        const closeButtons = document.querySelectorAll('.close-modal');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // Deposit confirmation
        const confirmDepositBtn = document.getElementById('confirmDeposit');
        if (confirmDepositBtn) {
            confirmDepositBtn.addEventListener('click', () => this.handleDeposit());
        }

        // Withdraw confirmation
        const confirmWithdrawBtn = document.getElementById('confirmWithdraw');
        if (confirmWithdrawBtn) {
            confirmWithdrawBtn.addEventListener('click', () => this.handleWithdraw());
        }
    }

    async handleWalletConnection() {
        try {
            const connectBtn = document.getElementById('connectWallet');
            connectBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
            connectBtn.disabled = true;

            const result = await wallet.connect();
            
            if (result.success) {
                this.addChatMessage('Ronaldo', '🎉 Excellent! Your wallet has been connected successfully. Now you can start betting!');
                await this.updateWalletDisplay();
            } else {
                this.addChatMessage('Ronaldo', `❌ Wallet connection error: ${result.error}`);
                connectBtn.innerHTML = '<i class="fas fa-wallet"></i> Connect Solana Wallet';
                connectBtn.disabled = false;
            }
        } catch (error) {
            console.error('Wallet connection error:', error);
            this.addChatMessage('Ronaldo', '❌ An error occurred while connecting wallet. Please try again!');
        }
    }

    async updateWalletDisplay() {
        try {
            await wallet.updateBalance();
            
            // Update betting token balance (mock)
            const bettingTokenElement = document.getElementById('bettingTokenBalance');
            if (bettingTokenElement) {
                bettingTokenElement.textContent = '0.000'; // Mock value
            }
        } catch (error) {
            console.error('Error updating wallet display:', error);
        }
    }

    async handleSendMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();
        
        if (!message) return;

        try {
            // Add user message to chat
            this.addChatMessage('You', message);
            chatInput.value = '';

            // Show typing indicator
            this.showTypingIndicator();

            // Process message with AI
            const response = await ronaldoAI.processMessage(message);
            
            // Remove typing indicator and add response
            this.hideTypingIndicator();
            this.addChatMessage('Ronaldo', response);

        } catch (error) {
            console.error('Error handling message:', error);
            this.hideTypingIndicator();
            this.addChatMessage('Ronaldo', 'Sorry, I encountered an error processing your message.');
        }
    }

    addChatMessage(sender, message) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        const isBot = sender === 'Ronaldo';
        
        messageDiv.className = `message ${isBot ? 'bot-message' : 'user-message'}`;
        messageDiv.innerHTML = `
            <div class="avatar">
                <i class="fas fa-${isBot ? 'robot' : 'user'}"></i>
            </div>
            <div class="message-content">
                <p>${message.replace(/\n/g, '<br>')}</p>
                <span class="timestamp">${this.formatTime(new Date())}</span>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    showTypingIndicator() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const typingDiv = document.createElement('div');
        typingDiv.id = 'typingIndicator';
        typingDiv.className = 'message bot-message';
        typingDiv.innerHTML = `
            <div class="avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p><i class="fas fa-circle typing-dot"></i><i class="fas fa-circle typing-dot"></i><i class="fas fa-circle typing-dot"></i></p>
            </div>
        `;

        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Add typing animation
        const style = document.createElement('style');
        style.textContent = `
            .typing-dot {
                animation: typing 1.4s infinite;
                font-size: 0.3em;
                margin: 0 2px;
            }
            .typing-dot:nth-child(2) { animation-delay: 0.2s; }
            .typing-dot:nth-child(3) { animation-delay: 0.4s; }
            @keyframes typing {
                0%, 60%, 100% { opacity: 0.3; }
                30% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    displayWelcomeMessage() {
        this.addChatMessage('Ronaldo', 'Welcome to Ronaldo AI Agent! I am your smart betting assistant. Please connect your Solana wallet to get started! ⚽🤖');
    }

    async loadMatches() {
        try {
            const matchesContainer = document.getElementById('matchesContainer');
            if (!matchesContainer) return;

            // Show loading
            matchesContainer.innerHTML = `
                <div class="loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    Loading matches...
                </div>
            `;

            const matches = await oddsAPI.getMatches();
            
            if (matches.length === 0) {
                matchesContainer.innerHTML = `
                    <div class="no-matches">
                        <i class="fas fa-info-circle"></i>
                        <p>No matches available currently</p>
                    </div>
                `;
                return;
            }

            const matchesHTML = matches.map(match => this.createMatchCard(match)).join('');
            matchesContainer.innerHTML = matchesHTML;

            // Add click events to odds
            this.setupOddsClickEvents();

        } catch (error) {
            console.error('Error loading matches:', error);
            const matchesContainer = document.getElementById('matchesContainer');
            if (matchesContainer) {
                matchesContainer.innerHTML = `
                    <div class="error">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Error loading matches</p>
                    </div>
                `;
            }
        }
    }

    createMatchCard(match) {
        return `
            <div class="match-card" data-match-id="${match.id}">
                <div class="match-info">
                    <div class="teams">${match.homeTeam} vs ${match.awayTeam}</div>
                    <div class="match-time">${oddsAPI.formatTime(match.startTime)}</div>
                </div>
                <div class="match-league">🏆 ${match.league}</div>
                <div class="odds-container">
                    <div class="odd-item" data-outcome="home" data-odds="${match.odds.home}">
                        <div class="odd-label">${match.homeTeam}</div>
                        <div class="odd-value">${match.odds.home}</div>
                    </div>
                    <div class="odd-item" data-outcome="draw" data-odds="${match.odds.draw}">
                        <div class="odd-label">Draw</div>
                        <div class="odd-value">${match.odds.draw}</div>
                    </div>
                    <div class="odd-item" data-outcome="away" data-odds="${match.odds.away}">
                        <div class="odd-label">${match.awayTeam}</div>
                        <div class="odd-value">${match.odds.away}</div>
                    </div>
                </div>
            </div>
        `;
    }

    setupOddsClickEvents() {
        const oddItems = document.querySelectorAll('.odd-item');
        oddItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const matchCard = e.target.closest('.match-card');
                const matchId = matchCard.dataset.matchId;
                const outcome = item.dataset.outcome;
                const odds = item.dataset.odds;
                
                this.handleOddsClick(matchId, outcome, odds);
            });
        });
    }

    async handleOddsClick(matchId, outcome, odds) {
        try {
            if (!wallet.isConnected) {
                this.addChatMessage('Ronaldo', 'You need to connect your wallet before placing bets!');
                return;
            }

            const matches = await oddsAPI.getMatches();
            const match = matches.find(m => m.id === matchId);
            
            if (!match) {
                this.addChatMessage('Ronaldo', 'Cannot find this match!');
                return;
            }

            const outcomeText = outcome === 'home' ? match.homeTeam : 
                               outcome === 'away' ? match.awayTeam : 'Draw';

            this.addChatMessage('Ronaldo', 
                `🎯 You selected to bet on ${outcomeText} with odds ${odds} for ${match.homeTeam} vs ${match.awayTeam}.\n\n` +
                `Please tell me how much you want to bet. Example: "Bet 0.1 SOL"`
            );

            // Auto-fill chat input
            const chatInput = document.getElementById('chatInput');
            if (chatInput) {
                chatInput.value = `Bet 0.1 SOL on ${outcomeText}`;
                chatInput.focus();
            }

        } catch (error) {
            console.error('Error handling odds click:', error);
            this.addChatMessage('Ronaldo', 'An error occurred while processing your selection.');
        }
    }

    showDepositModal() {
        const modal = document.getElementById('depositModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    showWithdrawModal() {
        const modal = document.getElementById('withdrawModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    async handleDeposit() {
        try {
            const amountInput = document.getElementById('depositAmount');
            const amount = parseFloat(amountInput.value);

            if (!amount || amount <= 0) {
                alert('Please enter a valid amount!');
                return;
            }

            if (!wallet.isConnected) {
                alert('Please connect your wallet first!');
                return;
            }

            const result = await wallet.deposit(amount);
            
            if (result.success) {
                this.addChatMessage('Ronaldo', `✅ ${result.message}`);
                await this.updateWalletDisplay();
                
                // Close modal
                document.getElementById('depositModal').style.display = 'none';
                amountInput.value = '';
            } else {
                alert(`Error: ${result.error}`);
            }

        } catch (error) {
            console.error('Deposit error:', error);
            alert('An error occurred while depositing!');
        }
    }

    async handleWithdraw() {
        try {
            const amountInput = document.getElementById('withdrawAmount');
            const amount = parseFloat(amountInput.value);

            if (!amount || amount <= 0) {
                alert('Please enter a valid amount!');
                return;
            }

            if (!wallet.isConnected) {
                alert('Please connect your wallet first!');
                return;
            }

            const result = await wallet.withdraw(amount);
            
            if (result.success) {
                this.addChatMessage('Ronaldo', `✅ ${result.message}`);
                await this.updateWalletDisplay();
                
                // Close modal
                document.getElementById('withdrawModal').style.display = 'none';
                amountInput.value = '';
            } else {
                alert(`Error: ${result.error}`);
            }

        } catch (error) {
            console.error('Withdraw error:', error);
            alert('An error occurred while withdrawing!');
        }
    }

    formatTime(date) {
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Utility method to show notifications
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the application
const bettingApp = new BettingApp();

// Add global error handler
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        border-left: 4px solid #007bff;
        animation: slideIn 0.3s ease;
    }
    
    .notification-success {
        border-left-color: #28a745;
    }
    
    .notification-error {
        border-left-color: #dc3545;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(notificationStyles);

console.log('🚀 Ronaldo Betting Agent is ready!');
