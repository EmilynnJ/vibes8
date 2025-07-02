// Simplified Payment Service for React Native
export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    expiryMonth: number;
    expiryYear: number;
  };
}

export class PaymentService {
  private static instance: PaymentService;

  private constructor() {}

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  private async getAuthToken(): Promise<string> {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    return await AsyncStorage.getItem('authToken') || '';
  }

  // Create payment intent for reading session
  async createReadingPaymentIntent(amount: number, readerId: string, sessionType: string): Promise<PaymentIntent> {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/payments/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          currency: 'usd',
          readerId,
          sessionType
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Payment intent creation failed:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  // Create payment intent for shop purchase
  async createShopPaymentIntent(amount: number, productIds: string[]): Promise<PaymentIntent> {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/payments/shop-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          currency: 'usd',
          productIds
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create shop payment intent');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Payment intent creation failed:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  // Confirm payment with Stripe
  async confirmPayment(paymentIntentClientSecret: string, paymentMethodId: string): Promise<{ success: boolean; paymentIntent?: any; error?: string }> {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/payments/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          paymentIntentClientSecret,
          paymentMethodId
        })
      });
      
      if (!response.ok) {
        throw new Error('Payment confirmation failed');
      }
      
      const result = await response.json();
      return { success: true, paymentIntent: result };
    } catch (error) {
      console.error('Payment confirmation failed:', error);
      return { success: false, error: 'Payment confirmation failed' };
    }
  }

  // Add wallet funds
  async addWalletFunds(amount: number, paymentMethodId?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const paymentIntent = await this.createWalletPaymentIntent(amount);
      const result = await this.confirmPayment(paymentIntent.clientSecret, paymentMethodId || 'pm_demo');
      
      return { success: result.success, error: result.error };
    } catch (error) {
      console.error('Add wallet funds failed:', error);
      return { success: false, error: 'Failed to add wallet funds' };
    }
  }

  // Create payment intent for wallet top-up
  async createWalletPaymentIntent(amount: number, paymentMethodId?: string): Promise<PaymentIntent> {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/payments/wallet-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          currency: 'usd',
          paymentMethodId
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create wallet payment intent');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Wallet payment intent creation failed:', error);
      throw new Error('Failed to create wallet payment intent');
    }
  }

  // Get saved payment methods (simulated)
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return [
        {
          id: 'pm_demo_1234',
          type: 'card',
          card: {
            brand: 'visa',
            last4: '1234',
            expiryMonth: 12,
            expiryYear: 2025
          }
        }
      ];
    } catch (error) {
      console.error('Get payment methods failed:', error);
      return [];
    }
  }

  // Save payment method (simulated)
  async savePaymentMethod(paymentMethodId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    } catch (error) {
      console.error('Save payment method failed:', error);
      return { success: false, error: 'Failed to save payment method' };
    }
  }

  // Calculate reading session cost
  calculateSessionCost(minutes: number, ratePerMinute: number): number {
    return Math.round((minutes * ratePerMinute) * 100) / 100;
  }

  // Format currency amount
  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  }
}

export default PaymentService.getInstance();