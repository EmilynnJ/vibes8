import AsyncStorage from '@react-native-async-storage/async-storage';
import { PaymentService } from './paymentService';

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'reading_charge' | 'refund';
  amount: number;
  description: string;
  timestamp: Date;
  sessionId?: string;
  readerId?: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface WalletBalance {
  available: number;
  pending: number;
  total: number;
  currency: string;
}

export class WalletService {
  private static instance: WalletService;
  private apiUrl = process.env.EXPO_PUBLIC_API_URL || 'https://soulseer-api.herokuapp.com/api';

  private constructor() {}

  static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  // Get current wallet balance
  async getBalance(): Promise<WalletBalance> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${this.apiUrl}/wallet/balance`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get balance: ${response.statusText}`);
      }

      const data = await response.json();
      return data.balance;
    } catch (error) {
      console.error('Get balance error:', error);
      // Return zero balance if API fails
      return {
        available: 0.00,
        pending: 0,
        total: 0.00,
        currency: 'USD'
      };
    }
  }

  // Add funds to wallet
  async addFunds(amount: number, paymentMethodId?: string): Promise<{ success: boolean; transaction?: WalletTransaction; error?: string }> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Create payment intent for wallet top-up
      console.log('Creating wallet payment intent for amount:', amount);
      
      // Process payment through Stripe
      console.log('💳 Processing wallet deposit:', amount);
      
      // Process real payment through Stripe API
      const paymentService = PaymentService.getInstance();
      const paymentIntent = await paymentService.createWalletPaymentIntent(amount, paymentMethodId);

      const transaction: WalletTransaction = {
        id: Date.now().toString(),
        type: 'deposit',
        amount,
        description: `Wallet top-up - $${amount.toFixed(2)}`,
        timestamp: new Date(),
        status: 'completed'
      };

      // In production, this would be handled by the backend
      const response = await fetch(`${this.apiUrl}/wallet/add-funds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          paymentIntentId: 'demo_payment_intent',
          paymentMethodId
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add funds: ${response.statusText}`);
      }

      console.log('✅ Funds added successfully:', amount);
      return { success: true, transaction };
    } catch (error) {
      console.error('Add funds error:', error);
      return { success: false, error: (error as Error).message || 'Failed to add funds' };
    }
  }

  // Charge for reading session
  async chargeForReading(
    amount: number, 
    sessionId: string, 
    readerId: string, 
    description: string
  ): Promise<{ success: boolean; transaction?: WalletTransaction; error?: string }> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${this.apiUrl}/wallet/charge-reading`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          sessionId,
          readerId,
          description
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to charge for reading: ${response.statusText}`);
      }

      const data = await response.json();
      
      console.log('💸 Reading charge processed:', {
        amount,
        sessionId,
        description
      });
      
      return { success: true, transaction: data.transaction };
    } catch (error) {
      console.error('Charge for reading error:', error);
      return { success: false, error: (error as Error).message || 'Failed to charge for reading' };
    }
  }

  // Get transaction history
  async getTransactions(limit: number = 50): Promise<WalletTransaction[]> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${this.apiUrl}/wallet/transactions?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get transactions: ${response.statusText}`);
      }

      const data = await response.json();
      return data.transactions;
    } catch (error) {
      console.error('Get transactions error:', error);
      return [];
    }
  }

  // Check if user has sufficient balance
  async hasSufficientBalance(amount: number): Promise<boolean> {
    try {
      const balance = await this.getBalance();
      return balance.available >= amount;
    } catch (error) {
      console.error('Check balance error:', error);
      return false;
    }
  }

  // Get minimum balance required for session
  getMinimumBalanceForSession(ratePerMinute: number, minMinutes: number = 2): number {
    return ratePerMinute * minMinutes;
  }

  // Format currency amount
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount));
  }

  // Get transaction type display name
  getTransactionTypeDisplay(type: WalletTransaction['type']): string {
    switch (type) {
      case 'deposit':
        return 'Funds Added';
      case 'withdrawal':
        return 'Withdrawal';
      case 'reading_charge':
        return 'Reading Session';
      case 'refund':
        return 'Refund';
      default:
        return 'Transaction';
    }
  }

  // Get transaction icon
  getTransactionIcon(type: WalletTransaction['type']): string {
    switch (type) {
      case 'deposit':
        return 'add-circle';
      case 'withdrawal':
        return 'remove-circle';
      case 'reading_charge':
        return 'book';
      case 'refund':
        return 'return-up-back';
      default:
        return 'swap-horizontal';
    }
  }

  // Get transaction color
  getTransactionColor(type: WalletTransaction['type']): string {
    switch (type) {
      case 'deposit':
      case 'refund':
        return '#10B981'; // Green
      case 'withdrawal':
      case 'reading_charge':
        return '#EF4444'; // Red
      default:
        return '#6B7280'; // Gray
    }
  }

  // Calculate reading session cost estimate
  calculateSessionCostEstimate(ratePerMinute: number, estimatedMinutes: number): {
    estimatedCost: number;
    minimumCost: number;
    recommendedBalance: number;
  } {
    const estimatedCost = ratePerMinute * estimatedMinutes;
    const minimumCost = ratePerMinute * 2; // Minimum 2 minutes
    const recommendedBalance = estimatedCost * 1.5; // 50% buffer
    
    return {
      estimatedCost,
      minimumCost,
      recommendedBalance
    };
  }

  // Auto-reload settings
  async getAutoReloadSettings(): Promise<{
    enabled: boolean;
    threshold: number;
    amount: number;
    paymentMethodId?: string;
  }> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${this.apiUrl}/wallet/auto-reload`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get auto-reload settings: ${response.statusText}`);
      }

      const data = await response.json();
      return data.settings;
    } catch (error) {
      console.error('Get auto-reload settings error:', error);
      
      // Return default settings
      return {
        enabled: false,
        threshold: 10.00, // Auto-reload when balance falls below $10
        amount: 25.00 // Add $25 when auto-reloading
      };
    }
  }

  // Update auto-reload settings
  async updateAutoReloadSettings(settings: {
    enabled: boolean;
    threshold: number;
    amount: number;
    paymentMethodId?: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${this.apiUrl}/wallet/auto-reload`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error(`Failed to update auto-reload settings: ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Update auto-reload settings error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export default WalletService.getInstance();