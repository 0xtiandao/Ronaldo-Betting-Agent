// AI Agent for Sports Betting
class RonaldoAI {
    constructor() {
        this.name = 'Ronaldo';
        this.responses = this.initializeResponses();
        this.currentContext = {
            lastMatch: null,
            lastBetAmount: null,
            awaitingConfirmation: false,
            pendingBet: null
        };
        this.bettingHistory = [];
        this.keywords = this.initializeKeywords();
    }

    // Initialize AI responses
    initializeResponses() {
        return {
            greeting: [
                "Hello! I'm Ronaldo AI Agent. I can help you bet on football matches!",
                "Hi there! I'm ready to help you place bets on exciting matches!",
                "Welcome! Tell me which match you want to bet on!"
            ],
            help: [
                "I can help you:\n• View match list\n• Place bets on matches\n• Check betting history\n• Manage balance",
                "You can tell me things like: 'I want to bet on Manchester United to win' or 'Show me today's matches'",
                "Try saying: 'Bet 0.1 SOL on Real Madrid to win' or 'I want to bet on a draw'"
            ],
            noMatches: [
                "No matches found right now. Try searching with different keywords!",
                "I couldn't find any matches. Would you like to see the current match list?"
            ],
            betPlaced: [
                "Excellent! I've placed your bet. Good luck! 🍀",
                "Bet placed successfully! Hope you win! ⚽",
                "Done! I've placed the bet as requested!"
            ],
            betError: [
                "There was an error placing the bet. Please try again!",
                "Cannot place bet right now. Please check your balance and try again!"
            ],
            needWallet: [
                "You need to connect your Solana wallet before placing bets!",
                "Please connect your wallet to start betting!"
            ],
            confirmBet: [
                "Are you sure you want to place this bet? Type 'confirm' to continue.",
                "Please confirm: Do you want to place this bet?"
            ]
        };
    }

    // Initialize keywords for intent recognition
    initializeKeywords() {
        return {
            betting: ['bet', 'place bet', 'wager', 'stake'],
            teams: ['manchester', 'liverpool', 'chelsea', 'arsenal', 'real madrid', 'barcelona', 'bayern', 'juventus'],
            outcomes: ['win', 'lose', 'draw', 'victory', 'defeat'],
            amounts: ['sol', 'token', '0.'],
            help: ['help', 'guide', 'how to', 'what can'],
            confirmation: ['confirm', 'yes', 'ok', 'agree', 'sure'],
            cancel: ['cancel', 'no', 'stop', 'abort']
        };
    }

    // Process user message and generate response
    async processMessage(message) {
        const intent = this.analyzeIntent(message);
        let response = '';

        try {
            switch (intent.type) {
                case 'greeting':
                    response = this.getRandomResponse('greeting');
                    break;
                
                case 'help':
                    response = this.getRandomResponse('help');
                    break;
                
                case 'betting':
                    response = await this.processBetting(message, intent);
                    break;
                
                case 'confirmation':
                    response = await this.processConfirmation(true);
                    break;
                
                case 'cancel':
                    response = await this.processConfirmation(false);
                    break;
                
                case 'matches':
                    response = await this.showMatches(intent.teams);
                    break;
                
                case 'history':
                    response = this.showBettingHistory();
                    break;
                
                default:
                    response = await this.handleDefault(message);
            }
        } catch (error) {
            console.error('Error processing message:', error);
            response = "Xin lỗi, tôi gặp lỗi khi xử lý tin nhắn của bạn. Vui lòng thử lại!";
        }

        return response;
    }

    // Analyze user intent
    analyzeIntent(message) {
        const msg = message.toLowerCase();
        const intent = { type: 'unknown', confidence: 0 };

        // Check for greetings
        if (msg.match(/^(hello|hi|hey|greetings)/)) {
            intent.type = 'greeting';
            intent.confidence = 0.9;
        }
        
        // Check for help
        else if (this.containsKeywords(msg, this.keywords.help)) {
            intent.type = 'help';
            intent.confidence = 0.8;
        }
        
        // Check for confirmation
        else if (this.containsKeywords(msg, this.keywords.confirmation)) {
            intent.type = 'confirmation';
            intent.confidence = 0.9;
        }
        
        // Check for cancellation
        else if (this.containsKeywords(msg, this.keywords.cancel)) {
            intent.type = 'cancel';
            intent.confidence = 0.9;
        }
        
        // Check for betting intent
        else if (this.containsKeywords(msg, this.keywords.betting)) {
            intent.type = 'betting';
            intent.confidence = 0.8;
            intent.teams = this.extractTeams(msg);
            intent.outcome = this.extractOutcome(msg);
            intent.amount = this.extractAmount(msg);
        }
        
        // Check for matches request
        else if (msg.includes('trận đấu') || msg.includes('matches')) {
            intent.type = 'matches';
            intent.teams = this.extractTeams(msg);
        }
        
        // Check for history request
        else if (msg.includes('lịch sử') || msg.includes('history')) {
            intent.type = 'history';
        }

        return intent;
    }

    // Extract team names from message
    extractTeams(message) {
        const teams = [];
        this.keywords.teams.forEach(team => {
            if (message.toLowerCase().includes(team)) {
                teams.push(team);
            }
        });
        return teams;
    }

    // Extract betting outcome from message
    extractOutcome(message) {
        const msg = message.toLowerCase();
        if (msg.includes('win') || msg.includes('victory')) return 'home';
        if (msg.includes('lose') || msg.includes('defeat')) return 'away';
        if (msg.includes('draw') || msg.includes('tie')) return 'draw';
        return null;
    }

    // Extract betting amount from message
    extractAmount(message) {
        const amountMatch = message.match(/(\d+\.?\d*)\s*(sol|token)/i);
        return amountMatch ? parseFloat(amountMatch[1]) : null;
    }

    // Check if message contains keywords
    containsKeywords(message, keywords) {
        return keywords.some(keyword => message.includes(keyword));
    }

    // Process betting request
    async processBetting(message, intent) {
        if (!wallet.isConnected) {
            return this.getRandomResponse('needWallet');
        }

        try {
            // If awaiting confirmation, handle it
            if (this.currentContext.awaitingConfirmation) {
                return this.getRandomResponse('confirmBet');
            }

            // Extract betting details
            const teams = intent.teams;
            const outcome = intent.outcome;
            const amount = intent.amount;

            // Find matching games
            let matches = [];
            if (teams.length > 0) {
                for (const team of teams) {
                    const teamMatches = await oddsAPI.searchMatches(team);
                    matches = matches.concat(teamMatches);
                }
                // Remove duplicates
                matches = matches.filter((match, index, self) => 
                    index === self.findIndex(m => m.id === match.id));
            } else {
                matches = await oddsAPI.getMatches();
            }

            if (matches.length === 0) {
                return this.getRandomResponse('noMatches');
            }

            // If specific details provided, create bet
            if (matches.length === 1 && outcome && amount) {
                const match = matches[0];
                return await this.createBet(match, outcome, amount);
            }

            // Show available matches
            return this.formatMatchesForBetting(matches);

        } catch (error) {
            console.error('Error processing betting:', error);
            return this.getRandomResponse('betError');
        }
    }

    // Create a betting transaction
    async createBet(match, outcome, amount) {
        try {
            // Validate bet
            const validation = oddsAPI.validateBet(match.id, outcome, amount);
            if (!validation.isValid) {
                return `Lỗi: ${validation.errors.join(', ')}`;
            }

            // Check wallet balance
            const balance = await wallet.getBalance();
            if (balance < amount) {
                return `Insufficient balance! You have ${balance.toFixed(3)} SOL, need ${amount} SOL.`;
            }

            // Set up confirmation
            this.currentContext.awaitingConfirmation = true;
            this.currentContext.pendingBet = {
                match: match,
                outcome: outcome,
                amount: amount,
                odds: match.odds[outcome],
                potentialWin: oddsAPI.calculateWinnings(amount, match.odds[outcome])
            };

            const outcomeText = outcome === 'home' ? match.homeTeam : 
                               outcome === 'away' ? match.awayTeam : 'Hòa';

            return `🎯 Confirm Bet:\n\n` +
                   `📅 Match: ${match.homeTeam} vs ${match.awayTeam}\n` +
                   `💰 Bet: ${amount} SOL on ${outcomeText}\n` +
                   `📊 Odds: ${match.odds[outcome]}\n` +
                   `🏆 Potential Win: ${this.currentContext.pendingBet.potentialWin.toFixed(3)} SOL\n\n` +
                   `Type 'confirm' to place bet or 'cancel' to abort.`;

        } catch (error) {
            console.error('Error creating bet:', error);
            return this.getRandomResponse('betError');
        }
    }

    // Process confirmation
    async processConfirmation(confirmed) {
        if (!this.currentContext.awaitingConfirmation || !this.currentContext.pendingBet) {
            return "No pending transaction to confirm.";
        }

        if (!confirmed) {
            this.currentContext.awaitingConfirmation = false;
            this.currentContext.pendingBet = null;
            return "Bet cancelled.";
        }

        try {
            const bet = this.currentContext.pendingBet;
            
            // Create betting record
            const bettingRecord = {
                id: Date.now().toString(),
                match: bet.match,
                outcome: bet.outcome,
                amount: bet.amount,
                odds: bet.odds,
                potentialWin: bet.potentialWin,
                timestamp: new Date(),
                status: 'pending'
            };

            // Add to history
            this.bettingHistory.push(bettingRecord);
            
            // Update UI
            this.updateBettingHistoryUI();
            
            // Reset context
            this.currentContext.awaitingConfirmation = false;
            this.currentContext.pendingBet = null;

            // Simulate balance update (in real app, this would be a blockchain transaction)
            await wallet.updateBalance();

            return this.getRandomResponse('betPlaced') + 
                   `\n\n📋 Bet ID: ${bettingRecord.id}`;

        } catch (error) {
            console.error('Error confirming bet:', error);
            return this.getRandomResponse('betError');
        }
    }

    // Show available matches
    async showMatches(teamFilter = []) {
        try {
            let matches = await oddsAPI.getMatches();
            
            if (teamFilter.length > 0) {
                matches = matches.filter(match => 
                    teamFilter.some(team => 
                        match.homeTeam.toLowerCase().includes(team) ||
                        match.awayTeam.toLowerCase().includes(team)
                    )
                );
            }

            if (matches.length === 0) {
                return this.getRandomResponse('noMatches');
            }

            return this.formatMatchesList(matches);
        } catch (error) {
            console.error('Error showing matches:', error);
            return "Error loading match list.";
        }
    }

    // Format matches for display
    formatMatchesList(matches) {
        let response = "📋 Current Matches:\n\n";
        
        matches.slice(0, 5).forEach((match, index) => {
            response += `${index + 1}. ${match.homeTeam} vs ${match.awayTeam}\n`;
            response += `   🏆 ${match.league}\n`;
            response += `   ⏰ ${oddsAPI.formatTime(match.startTime)}\n`;
            response += `   📊 Odds: ${match.odds.home} | ${match.odds.draw} | ${match.odds.away}\n\n`;
        });

        response += "Tell me which match you want to bet on!";
        return response;
    }

    // Format matches for betting
    formatMatchesForBetting(matches) {
        if (matches.length === 1) {
            const match = matches[0];
            return `🎯 Found Match:\n\n` +
                   `${match.homeTeam} vs ${match.awayTeam}\n` +
                   `🏆 ${match.league}\n` +
                   `⏰ ${oddsAPI.formatTime(match.startTime)}\n` +
                   `📊 Odds: Home ${match.odds.home} | Draw ${match.odds.draw} | Away ${match.odds.away}\n\n` +
                   `Tell me how you want to bet! Example: "Bet 0.1 SOL on home team to win"`;
        }

        return this.formatMatchesList(matches);
    }

    // Show betting history
    showBettingHistory() {
        if (this.bettingHistory.length === 0) {
            return "📈 You have no betting history yet.";
        }

        let response = "📈 Your Betting History:\n\n";
        
        this.bettingHistory.slice(-5).reverse().forEach((bet, index) => {
            const outcomeText = bet.outcome === 'home' ? bet.match.homeTeam : 
                               bet.outcome === 'away' ? bet.match.awayTeam : 'Hòa';
            
            response += `${index + 1}. ${bet.match.homeTeam} vs ${bet.match.awayTeam}\n`;
            response += `   💰 ${bet.amount} SOL on ${outcomeText}\n`;
            response += `   📊 Odds: ${bet.odds}\n`;
            response += `   📅 ${bet.timestamp.toLocaleString('en-US')}\n`;
            response += `   📋 Status: ${this.getStatusText(bet.status)}\n\n`;
        });

        return response;
    }

    // Get status text in English
    getStatusText(status) {
        const statusMap = {
            'pending': '⏳ Pending',
            'won': '✅ Won',
            'lost': '❌ Lost',
            'void': '🚫 Void'
        };
        return statusMap[status] || status;
    }

    // Handle default/unknown messages
    async handleDefault(message) {
        // Try to find relevant matches based on message content
        const searchResults = await oddsAPI.searchMatches(message);
        
        if (searchResults.length > 0) {
            return this.formatMatchesList(searchResults);
        }

        // Default helpful response
        return "I don't understand your request. You can:\n" +
               "• Say 'matches' to see the list\n" +
               "• Say 'bet [team] to win [amount]' to place a bet\n" +
               "• Say 'history' to see betting history\n" +
               "• Say 'help' for guidance";
    }

    // Get random response from array
    getRandomResponse(category) {
        const responses = this.responses[category];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Update betting history UI
    updateBettingHistoryUI() {
        const historyContainer = document.getElementById('bettingHistory');
        if (!historyContainer) return;

        if (this.bettingHistory.length === 0) {
            historyContainer.innerHTML = `
                <div class="no-history">
                    <i class="fas fa-info-circle"></i>
                    <p>No betting history yet</p>
                </div>
            `;
            return;
        }

        const historyHTML = this.bettingHistory.slice(-10).reverse().map(bet => {
            const outcomeText = bet.outcome === 'home' ? bet.match.homeTeam : 
                               bet.outcome === 'away' ? bet.match.awayTeam : 'Hòa';
            
            return `
                <div class="history-item ${bet.status}">
                    <div class="history-header">
                        <strong>${bet.match.homeTeam} vs ${bet.match.awayTeam}</strong>
                        <span class="status">${this.getStatusText(bet.status)}</span>
                    </div>
                    <div class="history-details">
                        <p>💰 Bet: ${bet.amount} SOL on ${outcomeText}</p>
                        <p>📊 Odds: ${bet.odds} | Potential Win: ${bet.potentialWin.toFixed(3)} SOL</p>
                        <p>📅 ${bet.timestamp.toLocaleString('en-US')}</p>
                    </div>
                </div>
            `;
        }).join('');

        historyContainer.innerHTML = historyHTML;
    }
}

// Initialize AI agent
const ronaldoAI = new RonaldoAI();
