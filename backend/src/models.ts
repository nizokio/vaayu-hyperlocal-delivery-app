export type DeliveryMode = 'regular' | 'instant';

export interface FeeBreakdown {
  deliveryFee: number;
  platformFee: number;
  totalCharges: number;
}

export interface User {
  email: string;
  name: string;
  phoneNumber: string;
  role: 'customer' | 'owner';
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userEmail: string;
  shopName: string;
  items: OrderItem[];
  totalAmount: number; // Subtotal + totalCharges
  deliveryMode: DeliveryMode;
  selectedSlotId?: string; // e.g. 'slot_1' or 'slot_2'
  selectedSlotLabel?: string; // e.g. '12:00 PM – 2:00 PM'
  feeBreakdown: FeeBreakdown;
  deliveryVenue: string;
  status: 'pending' | 'preparing' | 'on_the_way' | 'delivered';
  createdAt: number;
}
