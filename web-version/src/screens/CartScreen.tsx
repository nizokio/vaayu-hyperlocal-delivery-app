import { useState } from 'react'

interface CartItem {
  id: number
  name: string
  shop: string
  price: number
  qty: number
  img: string
}

const initialItems: CartItem[] = [
  { id: 1, name: 'Veg Burger', shop: 'Campus Bites', price: 89, qty: 1, img: 'https://images.unsplash.com/photo-1667329829058-ac191ba4a905?w=200&h=200&fit=crop&auto=format' },
  { id: 2, name: 'Fries (Large)', shop: 'Campus Bites', price: 59, qty: 2, img: 'https://images.unsplash.com/photo-1547754070-c73f90c116b5?w=200&h=200&fit=crop&auto=format' },
  { id: 3, name: 'Cappuccino', shop: 'The Brew House', price: 79, qty: 1, img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop&auto=format' },
]

const promos = ['CAMPUS50', 'FIRSTORDER', 'FLAT30']

function QtyButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-7 h-7 rounded-full flex items-center justify-center text-[16px] font-bold transition-all active:scale-90"
      style={{ backgroundColor: '#f3f4f6', color: '#1a3a2a' }}
    >
      {label}
    </button>
  )
}

export default function CartScreen() {
  const [items, setItems] = useState<CartItem[]>(initialItems)
  const [promoInput, setPromoInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState('')
  const [promoError, setPromoError] = useState('')
  const [placed, setPlaced] = useState(false)

  const changeQty = (id: number, delta: number) => {
    setItems(prev =>
      prev
        .map(i => i.id === id ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0)
    )
  }

  const applyPromo = () => {
    if (promos.includes(promoInput.toUpperCase())) {
      setAppliedPromo(promoInput.toUpperCase())
      setPromoError('')
    } else {
      setPromoError('Invalid promo code')
      setAppliedPromo('')
    }
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const deliveryFee = subtotal > 200 ? 0 : 30
  const discount = appliedPromo ? Math.round(subtotal * 0.2) : 0
  const total = subtotal + deliveryFee - discount

  if (placed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full px-6 text-center">
        <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center text-5xl mb-6">🎉</div>
        <h2 className="text-[24px] font-black text-gray-900 mb-2">Order Placed!</h2>
        <p className="text-[14px] text-gray-500 font-medium mb-1">Your order is being prepared.</p>
        <p className="text-[14px] text-gray-500 font-medium mb-8">Estimated delivery: <span className="font-bold text-gray-700">20–25 min</span></p>
        <div className="bg-green-50 border border-green-100 rounded-2xl px-6 py-4 mb-8 w-full">
          <p className="text-[13px] text-green-700 font-semibold">Order ID: <span className="font-black text-green-900">#ORD-9012</span></p>
          <p className="text-[13px] text-green-700 font-semibold mt-1">Total paid: <span className="font-black text-green-900">₹{total}</span></p>
        </div>
        <button
          onClick={() => { setPlaced(false); setItems(initialItems); setAppliedPromo(''); setPromoInput('') }}
          className="w-full py-4 rounded-2xl text-[15px] font-bold text-white"
          style={{ backgroundColor: '#1a3a2a' }}
        >
          Continue shopping
        </button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full px-6 text-center">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-5xl mb-6">🛒</div>
        <h2 className="text-[22px] font-black text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-[14px] text-gray-400 font-medium">Add items from a shop to get started.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 pt-6 pb-4">
        <h1 className="text-[24px] font-black text-gray-900">Your Cart</h1>
        <p className="text-[13px] text-gray-400 font-medium mt-0.5">{items.reduce((s, i) => s + i.qty, 0)} items from {[...new Set(items.map(i => i.shop))].join(' & ')}</p>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar pb-4">
        {/* Items */}
        <div className="px-4 pt-4 flex flex-col gap-3">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-3xl p-3 shadow-sm flex items-center gap-3">
              <img src={item.img} alt={item.name} className="w-16 h-16 rounded-2xl object-cover flex-none" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[14px] text-gray-900 truncate">{item.name}</p>
                <p className="text-[11px] text-gray-400 font-medium">{item.shop}</p>
                <p className="font-black text-[14px] text-gray-900 mt-1">₹{item.price}</p>
              </div>
              <div className="flex items-center gap-2 flex-none">
                <QtyButton label="−" onClick={() => changeQty(item.id, -1)} />
                <span className="text-[15px] font-black text-gray-900 w-5 text-center">{item.qty}</span>
                <QtyButton label="+" onClick={() => changeQty(item.id, 1)} />
              </div>
            </div>
          ))}
        </div>

        {/* Promo code */}
        <div className="mx-4 mt-4 bg-white rounded-3xl p-4 shadow-sm">
          <p className="text-[13px] font-bold text-gray-700 mb-2">Promo code</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter code (try CAMPUS50)"
              value={promoInput}
              onChange={e => { setPromoInput(e.target.value); setPromoError('') }}
              className="flex-1 bg-gray-100 rounded-xl px-3 py-2 text-[13px] font-medium text-gray-700 placeholder-gray-400 outline-none"
            />
            <button
              onClick={applyPromo}
              className="px-4 py-2 rounded-xl text-[13px] font-bold text-white transition-all active:scale-95"
              style={{ backgroundColor: '#1a3a2a' }}
            >
              Apply
            </button>
          </div>
          {appliedPromo && (
            <p className="text-[12px] text-green-600 font-semibold mt-2">✓ {appliedPromo} applied — 20% off!</p>
          )}
          {promoError && (
            <p className="text-[12px] text-red-500 font-semibold mt-2">{promoError}</p>
          )}
        </div>

        {/* Delivery info */}
        <div className="mx-4 mt-3 bg-green-50 border border-green-100 rounded-2xl px-4 py-3 flex items-center gap-2">
          <span className="text-lg">🚴</span>
          <p className="text-[12px] text-green-700 font-semibold">
            {deliveryFee === 0 ? 'Free delivery on this order!' : `Add ₹${200 - subtotal} more for free delivery`}
          </p>
        </div>

        {/* Bill summary */}
        <div className="mx-4 mt-3 bg-white rounded-3xl p-4 shadow-sm">
          <p className="text-[14px] font-bold text-gray-900 mb-3">Bill summary</p>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-[13px] text-gray-500 font-medium">Subtotal</span>
              <span className="text-[13px] font-semibold text-gray-800">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[13px] text-gray-500 font-medium">Delivery fee</span>
              <span className="text-[13px] font-semibold" style={{ color: deliveryFee === 0 ? '#16a34a' : '#374151' }}>
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <span className="text-[13px] text-green-600 font-medium">Promo discount</span>
                <span className="text-[13px] font-semibold text-green-600">−₹{discount}</span>
              </div>
            )}
            <div className="border-t border-gray-100 pt-2 mt-1 flex justify-between">
              <span className="text-[15px] font-black text-gray-900">Total</span>
              <span className="text-[15px] font-black text-gray-900">₹{total}</span>
            </div>
          </div>
        </div>

        <div className="h-4" />
      </div>

      {/* Checkout button */}
      <div className="px-4 pt-3 pb-4 bg-white border-t border-gray-100">
        <button
          onClick={() => setPlaced(true)}
          className="w-full py-4 rounded-2xl text-[16px] font-black text-white flex items-center justify-between px-6 transition-all active:scale-[0.98]"
          style={{ backgroundColor: '#1a3a2a' }}
        >
          <span>Place order</span>
          <div className="flex items-center gap-1">
            <span className="text-green-300 text-[15px] font-bold">₹{total}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </div>
        </button>
      </div>
    </div>
  )
}
