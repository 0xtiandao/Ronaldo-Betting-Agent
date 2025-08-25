// Solana Wallet Integration
class SolanaWallet {
    constructor() {
        this.provider = null;
        this.publicKey = null;
        this.connection = new solanaWeb3.Connection(
            'https://api.devnet.solana.com',
            'confirmed'
        );
        this.isConnected = false;
    }

    async connect() {
        try {
            // Check if Phantom wallet is installed
            if (window.solana && window.solana.isPhantom) {
                this.provider = window.solana;
            } else {
                throw new Error('Phantom wallet not found! Please install Phantom wallet.');
            }

            // Connect to wallet
            const response = await this.provider.connect();
            this.publicKey = response.publicKey;
            this.isConnected = true;

            console.log('Wallet connected successfully:', this.publicKey.toString());
            
            // Update UI
            this.updateWalletUI();
            
            // Get balance
            await this.updateBalance();
            
            return {
                success: true,
                publicKey: this.publicKey.toString()
            };
        } catch (error) {
            console.error('Wallet connection error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async disconnect() {
        try {
            if (this.provider) {
                await this.provider.disconnect();
            }
            this.publicKey = null;
            this.isConnected = false;
            this.updateWalletUI();
            
            return { success: true };
        } catch (error) {
            console.error('Wallet disconnection error:', error);
            return { success: false, error: error.message };
        }
    }

    async getBalance() {
        try {
            if (!this.publicKey) {
                throw new Error('Wallet not connected');
            }

            const balance = await this.connection.getBalance(this.publicKey);
            return balance / solanaWeb3.LAMPORTS_PER_SOL; // Convert lamports to SOL
        } catch (error) {
            console.error('Error getting balance:', error);
            return 0;
        }
    }

    async updateBalance() {
        const balance = await this.getBalance();
        const balanceElement = document.getElementById('balance');
        const solBalanceElement = document.getElementById('solBalance');
        
        if (balanceElement) {
            balanceElement.textContent = `${balance.toFixed(3)} SOL`;
        }
        
        if (solBalanceElement) {
            solBalanceElement.textContent = balance.toFixed(3);
        }
        
        return balance;
    }

    async sendTransaction(toPublicKey, amount) {
        try {
            if (!this.publicKey || !this.isConnected) {
                throw new Error('Wallet not connected');
            }

            const transaction = new solanaWeb3.Transaction().add(
                solanaWeb3.SystemProgram.transfer({
                    fromPubkey: this.publicKey,
                    toPubkey: new solanaWeb3.PublicKey(toPublicKey),
                    lamports: amount * solanaWeb3.LAMPORTS_PER_SOL,
                })
            );

            // Get recent blockhash
            const { blockhash } = await this.connection.getRecentBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = this.publicKey;

            // Sign and send transaction
            const signedTransaction = await this.provider.signTransaction(transaction);
            const signature = await this.connection.sendRawTransaction(signedTransaction.serialize());
            
            // Wait for confirmation
            await this.connection.confirmTransaction(signature);
            
            console.log('Transaction successful:', signature);
            
            // Update balance after transaction
            setTimeout(() => this.updateBalance(), 2000);
            
            return {
                success: true,
                signature: signature
            };
        } catch (error) {
            console.error('Transaction error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    updateWalletUI() {
        const connectButton = document.getElementById('connectWallet');
        const walletConnected = document.getElementById('walletConnected');
        const walletAddress = document.getElementById('walletAddress');

        if (this.isConnected && this.publicKey) {
            connectButton.style.display = 'none';
            walletConnected.style.display = 'flex';
            
            if (walletAddress) {
                const address = this.publicKey.toString();
                walletAddress.textContent = `${address.slice(0, 4)}...${address.slice(-4)}`;
            }
        } else {
            connectButton.style.display = 'inline-flex';
            walletConnected.style.display = 'none';
        }
    }

    formatPublicKey(publicKey) {
        if (!publicKey) return '';
        const key = publicKey.toString();
        return `${key.slice(0, 4)}...${key.slice(-4)}`;
    }

    // Mock deposit function (for demo purposes)
    async deposit(amount) {
        try {
            // In a real implementation, this would involve:
            // 1. Creating a program-owned account
            // 2. Transferring tokens to that account
            // 3. Updating user's betting balance
            
            console.log(`Simulating deposit of ${amount} SOL to betting account`);
            
            // For demo, we'll just show a success message
            return {
                success: true,
                message: `Deposited ${amount} SOL to betting account`,
                newBalance: amount
            };
        } catch (error) {
            console.error('Deposit error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Mock withdraw function (for demo purposes)
    async withdraw(amount) {
        try {
            // In a real implementation, this would involve:
            // 1. Checking user's betting balance
            // 2. Transferring tokens from program account back to user
            // 3. Updating user's betting balance
            
            console.log(`Simulating withdrawal of ${amount} SOL from betting account`);
            
            // For demo, we'll just show a success message
            return {
                success: true,
                message: `Withdrew ${amount} SOL from betting account`,
                newBalance: 0
            };
        } catch (error) {
            console.error('Withdrawal error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Initialize wallet instance
const wallet = new SolanaWallet();
