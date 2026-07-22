import { useState } from 'react'

interface MenuItem {
  id: string
  name: string
  price: number
  desc: string
  available: boolean
  category: string
  img: string
}

interface Order {
  id: string
  customerName: string
  location: string
  landmark: string
  items: { name: string; quantity: number; price: number }[]
  total: number
  paymentMode: string
  status: 'incoming' | 'preparing' | 'delivering' | 'completed' | 'cancelled'
  time: string
}

interface OwnerDashboardProps {
  user: any
  onSignOut: () => void
}

export default function OwnerDashboard({ user, onSignOut }: OwnerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'catalog' | 'settings'>('dashboard')
  const [storeOpen, setStoreOpen] = useState(true)

  // Catalog items
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: '1', name: 'Spicy Paneer Burger', price: 120, desc: 'Crispy paneer patty with spicy cream', available: true, category: 'Food', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200' },
    { id: '2', name: 'Salted French Fries', price: 80, desc: 'Golden salted fries, crispy outside', available: true, category: 'Food', img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200' },
    { id: '3', name: 'Loaded Cheese Pizza', price: 180, desc: 'Double mozzarella cheese on fresh crust', available: false, category: 'Food', img: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=200' }
  ])

  // Orders
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-8942',
      customerName: 'Aditya Sharma',
      location: 'Block A, Room 102',
      landmark: 'Near Reception',
      items: [{ name: 'Spicy Paneer Burger', quantity: 2, price: 120 }],
      total: 250,
      paymentMode: 'UPI on Delivery',
      status: 'incoming',
      time: '10 mins ago'
    },
    {
      id: 'ORD-7210',
      customerName: 'Rohan Mehta',
      location: 'Block C, Room 305',
      landmark: 'Lift area',
      items: [{ name: 'Salted French Fries', quantity: 1, price: 80 }, { name: 'Loaded Cheese Pizza', quantity: 1, price: 180 }],
      total: 275,
      paymentMode: 'Cash on Delivery',
      status: 'preparing',
      time: '25 mins ago'
    },
    {
      id: 'ORD-4102',
      customerName: 'Sneha Reddy',
      location: 'Block B, Room 221',
      landmark: 'Water cooler side',
      items: [{ name: 'Spicy Paneer Burger', quantity: 1, price: 120 }],
      total: 135,
      paymentMode: 'UPI on Delivery',
      status: 'delivering',
      time: '35 mins ago'
    }
  ])

  // Form states
  const [newItemName, setNewItemName] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('')
  const [newItemDesc, setNewItemDesc] = useState('')
  const [newItemCat, setNewItemCat] = useState('Food')
  const [newItemImg, setNewItemImg] = useState('')

  // Settings
  const [upiId, setUpiId] = useState('campusbites@ybl')
  const [contactPhone, setContactPhone] = useState('+91 98765 43210')

  const [toast, setToast] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }

  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    showToast(`Order status updated to ${newStatus}!`)
  }

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItemName || !newItemPrice) {
      showToast('Name and Price are required!')
      return
    }
    const newItem: MenuItem = {
      id: `item_${Date.now()}`,
      name: newItemName,
      price: parseFloat(newItemPrice) || 0,
      desc: newItemDesc || 'Freshly made campus item',
      available: true,
      category: newItemCat,
      img: newItemImg || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'
    }
    setMenuItems(prev => [newItem, ...prev])
    setNewItemName('')
    setNewItemPrice('')
    setNewItemDesc('')
    setNewItemImg('')
    showToast('Item added to Catalog!')
  }

  const toggleItemAvailability = (id: string) => {
    setMenuItems(prev => prev.map(item => item.id === id ? { ...item, available: !item.available } : item))
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 pb-24 md:pb-6">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1a3a2a] text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-xl">
          ✨ {toast}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div>
          <span className="text-[11px] font-black text-green-600 uppercase tracking-widest block">Partner Dashboard</span>
          <h1 className="text-xl font-black text-gray-900">{user?.name || 'Campus Bites'}</h1>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-full px-4 py-2">
          <span className="text-[12px] font-bold text-gray-500">{storeOpen ? '🏪 Open' : '🔒 Closed'}</span>
          <button
            onClick={() => setStoreOpen(!storeOpen)}
            className={`w-10 h-6 rounded-full flex items-center p-0.5 transition-colors cursor-pointer ${storeOpen ? 'bg-green-500 justify-end' : 'bg-gray-300 justify-start'}`}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
          </button>
        </div>
      </header>

      {/* Main Grid View */}
      <main className="max-w-4xl w-full mx-auto p-4 flex-1">
        {/* ── 1. DASHBOARD / ANALYTICS TAB ─────────────────────────────────────── */}
        {activeTab === 'dashboard' && (
          <div className="flex flex-col gap-6">
            {/* Stats list */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs">
                <span className="text-3xl">📈</span>
                <p className="text-2xl font-black text-gray-900 mt-2">₹12,450</p>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Today's Earnings</p>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs">
                <span className="text-3xl">📋</span>
                <p className="text-2xl font-black text-gray-900 mt-2">{orders.length}</p>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Total Orders</p>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs">
                <span className="text-3xl">⏳</span>
                <p className="text-2xl font-black text-gray-900 mt-2">{orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length}</p>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Active Orders</p>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs">
                <span className="text-3xl">⭐️</span>
                <p className="text-2xl font-black text-gray-900 mt-2">4.8 / 5</p>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Outlet Rating</p>
              </div>
            </div>

            {/* Weekly Earnings Vector Graph */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
              <h3 className="text-[14px] font-bold text-gray-700 mb-6">Weekly Order Velocity</h3>
              <div className="h-40 flex items-end justify-between px-2 pt-4">
                {[45, 60, 85, 30, 95, 70, 110].map((h, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 w-full">
                    <div
                      className={`w-8 rounded-t-lg transition-all duration-500`}
                      style={{ height: `${h}px`, backgroundColor: i === 6 ? '#8fda58' : '#e5e7eb' }}
                    />
                    <span className="text-[10px] text-gray-400 font-bold">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 2. LIVE ORDERS TAB ─────────────────────────────────────────────── */}
        {activeTab === 'orders' && (
          <div className="flex flex-col gap-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex flex-col gap-4">
                <div className="flex items-start justify-between border-b border-gray-50 pb-3">
                  <div>
                    <h3 className="text-[15px] font-black text-gray-800">{order.id}</h3>
                    <p className="text-[11px] text-gray-400 font-medium">{order.time}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                    order.status === 'incoming' ? 'bg-blue-50 text-blue-600' :
                    order.status === 'preparing' ? 'bg-orange-50 text-orange-600' :
                    order.status === 'delivering' ? 'bg-purple-50 text-purple-600' : 'bg-green-50 text-green-600'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="flex flex-col gap-1 text-[13px]">
                  <p className="font-extrabold text-gray-900">{order.customerName}</p>
                  <p className="text-gray-500 font-semibold">📍 {order.location} · {order.landmark}</p>
                  <p className="text-gray-400 font-bold">💳 {order.paymentMode}</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-2">
                  {order.items.map((i, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[13px]">
                      <span className="font-bold text-gray-700">{i.name} x {i.quantity}</span>
                      <span className="font-black text-gray-900">₹{i.price * i.quantity}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-black text-gray-900 text-[13px]">
                    <span>Total Bill</span>
                    <span>₹{order.total}</span>
                  </div>
                </div>

                {/* Transition flow */}
                <div className="flex gap-2">
                  {order.status === 'incoming' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'preparing')}
                        className="flex-1 py-3 rounded-xl text-[13px] font-black text-white bg-green-500 hover:bg-green-600 transition-colors cursor-pointer"
                      >
                        Accept & Prepare
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                        className="px-5 py-3 rounded-xl text-[13px] font-bold text-red-500 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {order.status === 'preparing' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'delivering')}
                      className="flex-1 py-3 rounded-xl text-[13px] font-black text-white bg-orange-500 hover:bg-orange-600 transition-colors cursor-pointer"
                    >
                      Mark Ready (Delivering)
                    </button>
                  )}

                  {order.status === 'delivering' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'completed')}
                      className="flex-1 py-3 rounded-xl text-[13px] font-black text-white bg-green-600 hover:bg-green-700 transition-colors cursor-pointer"
                    >
                      Complete Order
                    </button>
                  )}

                  {order.status === 'completed' && (
                    <div className="flex-1 py-2 text-center bg-gray-50 rounded-xl text-[12px] text-gray-400 font-bold">
                      ✓ Delivered successfully
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── 3. CATALOG TAB ─────────────────────────────────────────────────── */}
        {activeTab === 'catalog' && (
          <div className="flex flex-col gap-6">
            {/* Add menu item form */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
              <h3 className="text-[15px] font-black text-gray-800 mb-4">Add New Item</h3>
              <form onSubmit={handleAddItem} className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Item Name</label>
                  <input type="text" placeholder="e.g. Garlic Bread" value={newItemName} onChange={e => setNewItemName(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-green-500" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Price (₹)</label>
                    <input type="number" placeholder="Price" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-green-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Category</label>
                    <input type="text" placeholder="Food/Grocery" value={newItemCat} onChange={e => setNewItemCat(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-green-500" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Description</label>
                  <input type="text" placeholder="Short description" value={newItemDesc} onChange={e => setNewItemDesc(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-green-500" />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl text-[14px] font-black text-white bg-green-500 hover:bg-green-600 transition-colors mt-2 cursor-pointer"
                >
                  Publish Product
                </button>
              </form>
            </div>

            {/* Menu List */}
            <div>
              <h3 className="text-[15px] font-black text-gray-800 mb-3 px-1">Menu Catalog</h3>
              <div className="flex flex-col gap-3">
                {menuItems.map(item => (
                  <div key={item.id} className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xs flex items-center gap-4">
                    <img src={item.img} alt={item.name} className="w-14 h-14 rounded-2xl object-cover flex-none" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[14px] text-gray-900 truncate">{item.name}</p>
                      <p className="text-[11px] text-gray-400 font-semibold mt-0.5">₹{item.price} · {item.category}</p>
                    </div>
                    
                    <div className="flex flex-col items-center flex-none">
                      <span className="text-[9px] font-bold text-gray-400 mb-1">{item.available ? 'Available' : 'Sold Out'}</span>
                      <button
                        onClick={() => toggleItemAvailability(item.id)}
                        className={`w-9 h-5 rounded-full flex items-center p-0.5 transition-colors cursor-pointer ${item.available ? 'bg-green-500 justify-end' : 'bg-gray-300 justify-start'}`}
                      >
                        <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 4. SETTINGS TAB ────────────────────────────────────────────────── */}
        {activeTab === 'settings' && (
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col gap-4">
              <h3 className="text-[15px] font-black text-gray-800 border-b border-gray-50 pb-2">Store Configurations</h3>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Merchant UPI ID</label>
                <input type="text" value={upiId} onChange={e => setUpiId(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-green-500" />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Support Phone Number</label>
                <input type="text" value={contactPhone} onChange={e => setContactPhone(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-green-500" />
              </div>

              <button
                onClick={() => showToast('Configurations saved!')}
                className="w-full py-3.5 rounded-xl text-[14px] font-black text-white bg-green-500 hover:bg-green-600 transition-colors mt-2 cursor-pointer"
              >
                Save Settings
              </button>
            </div>

            <button
              onClick={onSignOut}
              className="w-full py-4 rounded-2xl text-[14px] font-bold text-red-500 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer mt-4"
            >
              Log Out Partner Portal
            </button>
          </div>
        )}
      </main>

      {/* Navigation for Desktop & Mobile */}
      <nav className="fixed bottom-0 inset-x-0 bg-[#1a3a2a] md:bg-white md:border-t md:border-gray-100 h-[64px] flex justify-around items-center px-4 shadow-lg md:shadow-none z-40">
        <button onClick={() => setActiveTab('dashboard')} className="flex flex-col items-center justify-center flex-1 cursor-pointer">
          <span style={{ color: activeTab === 'dashboard' ? '#8fda58' : '#ffffff' }} className="md:text-gray-500">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="3" width="7" height="9" rx="1" />
              <rect x="14" y="3" width="7" height="5" rx="1" />
              <rect x="14" y="12" width="7" height="9" rx="1" />
              <rect x="3" y="16" width="7" height="5" rx="1" />
            </svg>
          </span>
          <span className={`text-[9px] font-extrabold mt-1 ${activeTab === 'dashboard' ? 'text-green-400 md:text-green-600' : 'text-white md:text-gray-400'}`}>Home</span>
        </button>

        <button onClick={() => setActiveTab('orders')} className="flex flex-col items-center justify-center flex-1 cursor-pointer">
          <span style={{ color: activeTab === 'orders' ? '#8fda58' : '#ffffff' }} className="md:text-gray-500">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </span>
          <span className={`text-[9px] font-extrabold mt-1 ${activeTab === 'orders' ? 'text-green-400 md:text-green-600' : 'text-white md:text-gray-400'}`}>Orders</span>
        </button>

        <button onClick={() => setActiveTab('catalog')} className="flex flex-col items-center justify-center flex-1 cursor-pointer">
          <span style={{ color: activeTab === 'catalog' ? '#8fda58' : '#ffffff' }} className="md:text-gray-500">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </span>
          <span className={`text-[9px] font-extrabold mt-1 ${activeTab === 'catalog' ? 'text-green-400 md:text-green-600' : 'text-white md:text-gray-400'}`}>Menu</span>
        </button>

        <button onClick={() => setActiveTab('settings')} className="flex flex-col items-center justify-center flex-1 cursor-pointer">
          <span style={{ color: activeTab === 'settings' ? '#8fda58' : '#ffffff' }} className="md:text-gray-500">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </span>
          <span className={`text-[9px] font-extrabold mt-1 ${activeTab === 'settings' ? 'text-green-400 md:text-green-600' : 'text-white md:text-gray-400'}`}>Settings</span>
        </button>
      </nav>
    </div>
  )
}
