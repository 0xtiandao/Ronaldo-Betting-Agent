// The Odds API Integration
class OddsAPI {
    constructor() {
        // For demo purposes, we'll use mock data
        // In production, you would need a real API key from The Odds API
        this.apiKey = '3b06e4206ab58cc4d283cb8c5fe66794';
        this.baseUrl = 'https://api.the-odds-api.com/v4';
        this.sports = {
            soccer: 'soccer_epl' // English Premier League as example
        };
        
        // Cache for odds data
        this.cachedMatches = [];
        this.lastFetch = null;
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    // Get current and upcoming matches
    async getMatches(sport = 'soccer') {
        try {
            // Check cache first
            if (this.shouldUseCache()) {
                return this.cachedMatches;
            }

            // For demo purposes, return mock data
            // In production, you would make a real API call
            const mockMatches = this.getMockMatches();
            
            this.cachedMatches = mockMatches;
            this.lastFetch = Date.now();
            
            return mockMatches;
        } catch (error) {
            console.error('Error fetching matches:', error);
            return [];
        }
    }

    // Get odds for a specific match
    async getOdds(matchId) {
        try {
            const matches = await this.getMatches();
            const match = matches.find(m => m.id === matchId);
            return match ? match.odds : null;
        } catch (error) {
            console.error('Error getting odds:', error);
            return null;
        }
    }

    // Check if we should use cached data
    shouldUseCache() {
        return this.lastFetch && 
               this.cachedMatches.length > 0 && 
               (Date.now() - this.lastFetch) < this.cacheTimeout;
    }

    // Mock data for demonstration
    getMockMatches() {
        const now = new Date();
        const matches = [
            {
                id: 'match_1',
                sport: 'Soccer',
                league: 'Premier League',
                homeTeam: 'Manchester United',
                awayTeam: 'Liverpool',
                startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
                status: 'upcoming',
                odds: {
                    home: 2.10,
                    draw: 3.20,
                    away: 3.50
                }
            },
            {
                id: 'match_2',
                sport: 'Soccer',
                league: 'Premier League',
                homeTeam: 'Chelsea',
                awayTeam: 'Arsenal',
                startTime: new Date(now.getTime() + 4 * 60 * 60 * 1000), // 4 hours from now
                status: 'upcoming',
                odds: {
                    home: 1.85,
                    draw: 3.40,
                    away: 4.20
                }
            },
            {
                id: 'match_3',
                sport: 'Soccer',
                league: 'La Liga',
                homeTeam: 'Real Madrid',
                awayTeam: 'Barcelona',
                startTime: new Date(now.getTime() + 6 * 60 * 60 * 1000), // 6 hours from now
                status: 'upcoming',
                odds: {
                    home: 2.30,
                    draw: 3.10,
                    away: 3.00
                }
            },
            {
                id: 'match_4',
                sport: 'Soccer',
                league: 'Bundesliga',
                homeTeam: 'Bayern Munich',
                awayTeam: 'Borussia Dortmund',
                startTime: new Date(now.getTime() + 8 * 60 * 60 * 1000), // 8 hours from now
                status: 'upcoming',
                odds: {
                    home: 1.70,
                    draw: 3.80,
                    away: 4.50
                }
            },
            {
                id: 'match_5',
                sport: 'Soccer',
                league: 'Serie A',
                homeTeam: 'Juventus',
                awayTeam: 'Inter Milan',
                startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
                status: 'upcoming',
                odds: {
                    home: 2.50,
                    draw: 3.00,
                    away: 2.80
                }
            }
        ];

        return matches;
    }

    // Format match data for display
    formatMatch(match) {
        return {
            id: match.id,
            title: `${match.homeTeam} vs ${match.awayTeam}`,
            league: match.league,
            time: this.formatTime(match.startTime),
            odds: match.odds,
            homeTeam: match.homeTeam,
            awayTeam: match.awayTeam,
            status: match.status
        };
    }

    // Format time for display
    formatTime(date) {
        const now = new Date();
        const diffMinutes = Math.floor((date - now) / (1000 * 60));
        
        if (diffMinutes < 60) {
            return `in ${diffMinutes} minutes`;
        } else if (diffMinutes < 24 * 60) {
            const hours = Math.floor(diffMinutes / 60);
            return `in ${hours} hours`;
        } else {
            const days = Math.floor(diffMinutes / (24 * 60));
            return `in ${days} days`;
        }
    }

    // Get match by teams (for AI agent to use)
    async findMatchByTeams(homeTeam, awayTeam) {
        try {
            const matches = await this.getMatches();
            return matches.find(match => 
                match.homeTeam.toLowerCase().includes(homeTeam.toLowerCase()) &&
                match.awayTeam.toLowerCase().includes(awayTeam.toLowerCase())
            );
        } catch (error) {
            console.error('Error finding match:', error);
            return null;
        }
    }

    // Search matches by keyword
    async searchMatches(keyword) {
        try {
            const matches = await this.getMatches();
            const searchTerm = keyword.toLowerCase();
            
            return matches.filter(match => 
                match.homeTeam.toLowerCase().includes(searchTerm) ||
                match.awayTeam.toLowerCase().includes(searchTerm) ||
                match.league.toLowerCase().includes(searchTerm)
            );
        } catch (error) {
            console.error('Error searching matches:', error);
            return [];
        }
    }

    // Calculate potential winnings
    calculateWinnings(betAmount, odds) {
        return betAmount * odds;
    }

    // Validate bet
    validateBet(matchId, betType, amount) {
        const errors = [];
        
        if (!matchId) {
            errors.push('No match selected');
        }
        
        if (!betType || !['home', 'draw', 'away'].includes(betType)) {
            errors.push('Invalid bet type');
        }
        
        if (!amount || amount <= 0) {
            errors.push('Bet amount must be greater than 0');
        }
        
        if (amount < 0.001) {
            errors.push('Minimum bet amount is 0.001 SOL');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Real API call (commented out for demo)
    /*
    async makeApiCall(endpoint) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}?apiKey=${this.apiKey}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    }
    */
}

// Initialize odds API instance
const oddsAPI = new OddsAPI();
