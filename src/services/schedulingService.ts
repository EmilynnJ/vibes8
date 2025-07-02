import { ScheduledReading, TimeSlot, ReaderAvailability, ReadingPackage, ReadingRequest } from '../types/readings';

export class SchedulingService {
  private static instance: SchedulingService;
  
  public static getInstance(): SchedulingService {
    if (!SchedulingService.instance) {
      SchedulingService.instance = new SchedulingService();
    }
    return SchedulingService.instance;
  }

  // Get available time slots for a reader
  async getAvailableTimeSlots(
    readerId: string,
    readingType: 'chat' | 'phone' | 'video',
    startDate: Date,
    endDate: Date,
    duration: number = 30
  ): Promise<TimeSlot[]> {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/scheduling/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          readerId,
          readingType,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          duration
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch available time slots');
      }

      const data = await response.json();
      return data.timeSlots.map((slot: any) => ({
        ...slot,
        date: new Date(slot.date)
      }));
    } catch (error) {
      console.error('Error fetching time slots:', error);
      return [];
    }
  }

  // Book a scheduled reading
  async bookScheduledReading(bookingData: {
    readerId: string;
    clientId: string;
    timeSlot: TimeSlot;
    packageId?: string;
    readingType: 'chat' | 'phone' | 'video';
    duration: number;
    price: number;
    specialRequests?: string;
    notes?: string;
  }): Promise<ScheduledReading> {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/scheduling/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        throw new Error('Failed to book reading');
      }

      const reading = await response.json();
      return {
        ...reading,
        scheduledDate: new Date(reading.scheduledDate),
        createdAt: new Date(reading.createdAt),
        updatedAt: new Date(reading.updatedAt)
      };
    } catch (error) {
      console.error('Error booking reading:', error);
      throw new Error('Failed to book reading');
    }
  }

  // Get scheduled readings for a user
  async getScheduledReadings(
    userId: string,
    userType: 'client' | 'reader',
    status?: string[]
  ): Promise<ScheduledReading[]> {
    try {
      const params = new URLSearchParams({
        userId,
        userType,
        ...(status && { status: status.join(',') })
      });

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/scheduling/readings?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${await this.getAuthToken()}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch scheduled readings');
      }

      const data = await response.json();
      return data.readings.map((reading: any) => ({
        ...reading,
        scheduledDate: new Date(reading.scheduledDate),
        createdAt: new Date(reading.createdAt),
        updatedAt: new Date(reading.updatedAt)
      }));
    } catch (error) {
      console.error('Error fetching scheduled readings:', error);
      return [];
    }
  }

  // Reschedule a reading
  async rescheduleReading(
    readingId: string,
    newTimeSlot: TimeSlot,
    reason?: string
  ): Promise<ScheduledReading> {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/scheduling/reschedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          readingId,
          newTimeSlot,
          reason
        })
      });

      if (!response.ok) {
        throw new Error('Failed to reschedule reading');
      }

      const reading = await response.json();
      return {
        ...reading,
        scheduledDate: new Date(reading.scheduledDate),
        createdAt: new Date(reading.createdAt),
        updatedAt: new Date(reading.updatedAt)
      };
    } catch (error) {
      console.error('Error rescheduling reading:', error);
      throw error;
    }
  }

  // Cancel a scheduled reading
  async cancelReading(readingId: string, reason: string): Promise<void> {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/scheduling/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          readingId,
          reason
        })
      });

      if (!response.ok) {
        throw new Error('Failed to cancel reading');
      }
    } catch (error) {
      console.error('Error cancelling reading:', error);
      throw error;
    }
  }

  // Get reading packages for a reader
  async getReadingPackages(readerId: string): Promise<ReadingPackage[]> {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/readers/${readerId}/packages`,
        {
          headers: {
            'Authorization': `Bearer ${await this.getAuthToken()}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch reading packages');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching packages:', error);
      return [];
    }
  }

  // Set reader availability
  async setReaderAvailability(
    readerId: string,
    availability: Omit<ReaderAvailability, 'id' | 'readerId' | 'createdAt' | 'updatedAt'>[]
  ): Promise<ReaderAvailability[]> {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/readers/${readerId}/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({ availability })
      });

      if (!response.ok) {
        throw new Error('Failed to set availability');
      }

      const data = await response.json();
      return data.availability.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt)
      }));
    } catch (error) {
      console.error('Error setting availability:', error);
      throw error;
    }
  }

  // Send reading request for instant reading
  async sendReadingRequest(requestData: {
    clientId: string;
    readerId: string;
    readingType: 'chat' | 'phone' | 'video';
    message?: string;
    urgency?: 'low' | 'medium' | 'high';
  }): Promise<ReadingRequest> {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/readings/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Failed to send reading request');
      }

      const request = await response.json();
      return {
        ...request,
        createdAt: new Date(request.createdAt),
        expiresAt: new Date(request.expiresAt)
      };
    } catch (error) {
      console.error('Error sending reading request:', error);
      throw error;
    }
  }

  // Utility methods
  isTimeSlotAvailable(slot: TimeSlot, existingBookings: ScheduledReading[]): boolean {
    const slotStart = new Date(`${slot.date.toDateString()} ${slot.startTime}`);
    const slotEnd = new Date(`${slot.date.toDateString()} ${slot.endTime}`);

    return !existingBookings.some(booking => {
      const bookingStart = new Date(booking.scheduledDate);
      const bookingEnd = new Date(bookingStart.getTime() + booking.duration * 60000);

      return (slotStart < bookingEnd && slotEnd > bookingStart);
    });
  }

  formatTimeSlot(slot: TimeSlot): string {
    const date = slot.date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return `${date} at ${slot.startTime}`;
  }

  calculatePackageDiscount(originalPrice: number, discountedPrice: number): number {
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  }

  getNextAvailableSlot(slots: TimeSlot[]): TimeSlot | null {
    const now = new Date();
    const availableSlots = slots.filter(slot => {
      const slotTime = new Date(`${slot.date.toDateString()} ${slot.startTime}`);
      return slotTime > now && slot.isAvailable;
    });

    return availableSlots.length > 0 ? availableSlots[0] : null;
  }

  // Private helper methods
  private async getAuthToken(): Promise<string> {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    return await AsyncStorage.getItem('authToken') || '';
  }
}

export default SchedulingService;