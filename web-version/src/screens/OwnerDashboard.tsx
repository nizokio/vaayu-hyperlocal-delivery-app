import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface OwnerDashboardProps {
  user: any
  onSignOut: () => void
}

export default function OwnerDashboard({ user, onSignOut }: OwnerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'catalog' | 'settings'>('dashboard')
  const [isLiveToday, setIsLiveToday] = useState(true) // Zomato-style Daily Go-Live Toggle

  // Workers list
  const [workers, setWorkers] = useState([
    { id: 'w1', name: 'Suresh (Kitchen)', phone: '+91 98765 11223' },
    { id: 'w2', name: 'Karthik (Counter)', phone: '+91 98765 44556' }
  ])
  const [newWorkerName, setNewWorkerName] = useState('')
  const [newWorkerPhone, setNewWorkerPhone] = useState('')

  // Catalog state
  const [menuItems, setMenuItems] = useState([
    { id: '1', name: 'Spicy Paneer Burger', price: 120, desc: 'Crispy paneer patty with spicy cream', available: true, category: 'Food', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200' },
    { id: '2', name: 'Salted French Fries', price: 80, desc: 'Golden salted fries, crispy outside', available: true, category: 'Food', img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200' },
    { id: '3', name: 'Loaded Cheese Pizza', price: 180, desc: 'Double mozzarella cheese on fresh crust', available: false, category: 'Food', img: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=200' }
  ])

  // Orders state with 15m expiration timer
  const [orders, setOrders] = useState([
    {
      id: 'ORD-8942',
      customerName: 'Aditya Sharma',
      location: 'Block A, Room 102',
      landmark: 'Near Reception',
      items: [
        { id: 'cb_1', name: 'Spicy Paneer Burger', quantity: 2, price: 120, accepted: true },
        { id: 'cb_2', name: 'Salted French Fries', quantity: 1, price: 80, accepted: true }
      ],
      total: 320,
      paymentMode: 'UPI on Delivery',
      status: 'incoming', // incoming, preparing, delivering, completed, cancelled
      createdTime: Date.now() - 3 * 60 * 1000,
      expireTime: Date.now() + 12 * 60 * 1000
    },
    {
      id: 'ORD-7210',
      customerName: 'Rohan Mehta',
      location: 'Block C, Room 305',
      landmark: 'Lift area',
      items: [
        { id: 'cb_2', name: 'Salted French Fries', quantity: 1, price: 80, accepted: true },
        { id: 'cb_3', name: 'Loaded Cheese Pizza', quantity: 1, price: 180, accepted: true }
      ],
      total: 260,
      paymentMode: 'Cash on Delivery',
      status: 'preparing',
      createdTime: Date.now() - 20 * 60 * 1000,
      expireTime: Date.now() - 5 * 60 * 1000
    },
    {
      id: 'ORD-4102',
      customerName: 'Sneha Reddy',
      location: 'Block B, Room 221',
      landmark: 'Water cooler side',
      items: [{ id: 'cb_1', name: 'Spicy Paneer Burger', quantity: 1, price: 120, accepted: true }],
      total: 120,
      paymentMode: 'UPI on Delivery',
      status: 'delivering',
      createdTime: Date.now() - 35 * 60 * 1000,
      expireTime: Date.now() - 20 * 60 * 1000
    }
  ])

  // Live 1-second ticking timer for 15m order accept window
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Auto-reject incoming orders when 15m timer expires
  useEffect(() => {
    setOrders(prev => prev.map(o => {
      if (o.status === 'incoming' && now > o.expireTime) {
        return { ...o, status: 'cancelled', cancelReason: 'Auto-rejected (15m timeout expired)' }
      }
      return o
    }))
  }, [now])

  // Partial Order Accept Modal State
  const [partialOrder, setPartialOrder] = useState<any>(null)
  const [checkedItems, setCheckedItems] = useState<{ [itemId: string]: boolean }>({})

  // Form states for adding catalog items
  const [newItemName, setNewItemName] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('')
  const [newItemDesc, setNewItemDesc] = useState('')
  const [newItemCat, setNewItemCat] = useState('Food')
  const [newItemImg, setNewItemImg] = useState('')

  // Settings
  const [upiId, setUpiId] = useState('campusbites@ybl')
  const [contactPhone, setContactPhone] = useState('+91 98765 43210')

  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Format 15m countdown mm:ss
  const getRemainingTimeStr = (expireTime: number) => {
    const diff = Math.max(0, Math.floor((expireTime - now) / 1000))
    const mins = Math.floor(diff / 60)
    const secs = diff % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Open Partial Accept Modal
  const handleOpenAcceptModal = (order: any) => {
    setPartialOrder(order)
    const initialChecks: { [key: string]: boolean } = {}
    order.items.forEach((item: any, idx: number) => {
      initialChecks[item.id || idx] = true
    })
    setCheckedItems(initialChecks)
  }

  // Confirm Acceptance
  const handleConfirmAcceptance = () => {
    if (!partialOrder) return

    const updatedItems = partialOrder.items.map((item: any, idx: number) => ({
      ...item,
      accepted: !!checkedItems[item.id || idx]
    }))

    const hasAnyAccepted = updatedItems.some((i: any) => i.accepted)
    if (!hasAnyAccepted) {
      showToast('Select at least 1 item to accept or decline order')
      return
    }

    const newTotal = updatedItems
      .filter((i: any) => i.accepted)
      .reduce((sum: number, i: any) => sum + i.price * i.quantity, 0)

    setOrders(prev => prev.map(o => {
      if (o.id === partialOrder.id) {
        return {
          ...o,
          items: updatedItems,
          total: newTotal,
          status: 'preparing'
        }
      }
      return o
    }))

    const isPartial = updatedItems.some((i: any) => !i.accepted)
    showToast(isPartial ? 'Partial order accepted! Bill updated.' : 'Order accepted & marked as Preparing!')
    setPartialOrder(null)
  }

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    showToast(`Order updated to ${newStatus.toUpperCase()}`)
  }

  const handleAddWorker = () => {
    if (!newWorkerName || !newWorkerPhone) {
      showToast('Enter worker name and phone number')
      return
    }
    setWorkers(prev => [...prev, { id: `w_${Date.now()}`, name: newWorkerName, phone: newWorkerPhone }])
    setNewWorkerName('')
    setNewWorkerPhone('')
    showToast('Worker staff access added!')
  }

  const handleRemoveWorker = (id: string) => {
    setWorkers(prev => prev.filter(w => w.id !== id))
    showToast('Worker access revoked')
  }

  const handleAddItem = () => {
    if (!newItemName || !newItemPrice) {
      showToast('Name and Price are required')
      return
    }
    const item = {
      id: `item_${Date.now()}`,
      name: newItemName,
      price: parseFloat(newItemPrice) || 0,
      desc: newItemDesc || 'Fresh campus item',
      available: true,
      category: newItemCat,
      img: newItemImg || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'
    }
    setMenuItems(prev => [item, ...prev])
    setNewItemName('')
    setNewItemPrice('')
    setNewItemDesc('')
    setNewItemImg('')
    showToast('Product added to menu!')
  }

  const toggleItemAvailability = (id: string) => {
    setMenuItems(prev => prev.map(item => item.id === id ? { ...item, available: !item.available } : item))
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-5 left-1/2 z-50 bg-[#1a3a2a] text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-xl border border-green-800/40 backdrop-blur-md"
          >
            ✨ {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header with Daily Go-Live Switch */}
      <div className="bg-white border-b border-gray-100 p-4 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">
              {user?.role === 'worker' ? 'Staff Portal' : 'Merchant Partner'}
            </span>
            <h1 className="text-[20px] font-black text-gray-900 leading-tight">{user?.name || 'Campus Bites'}</h1>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-full px-3 py-1.5">
            <span className="text-[11px] font-bold text-gray-700">{isLiveToday ? '🟢 LIVE TODAY' : '🔴 OFFLINE'}</span>
            <button
              onClick={() => {
                const next = !isLiveToday
                setIsLiveToday(next)
                showToast(next ? 'Shop is now LIVE for customer orders!' : 'Shop is OFFLINE for today.')
              }}
              className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${isLiveToday ? 'bg-green-500 justify-end' : 'bg-gray-300 justify-start'}`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-xs" />
            </button>
          </div>
        </div>

        {/* Daily Go-Live Banner */}
        <div className={`rounded-2xl p-3 flex items-center justify-between text-xs border ${isLiveToday ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          <span className="font-semibold">
            {isLiveToday ? '⚡ Store active: Visible to campus students for live orders' : '🔒 Store closed today: Customers cannot place orders'}
          </span>
          <button onClick={() => setIsLiveToday(!isLiveToday)} className="font-bold underline cursor-pointer">
            {isLiveToday ? 'Go Offline' : 'Go Live Now'}
          </button>
        </div>
      </div>

      {/* Content views */}
      <div className="p-4 flex-1">
        {/* ── 1. DASHBOARD OVERVIEW ── */}
        {activeTab === 'dashboard' && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xs">
                <span className="text-2xl">📈</span>
                <p className="text-xl font-black text-gray-900 mt-2">₹12,450</p>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Today's Sales</p>
              </div>
              <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xs">
                <span className="text-2xl">📋</span>
                <p className="text-xl font-black text-gray-900 mt-2">{orders.length}</p>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Total Orders</p>
              </div>
              <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xs">
                <span className="text-2xl">⏳</span>
                <p className="text-xl font-black text-gray-900 mt-2">{orders.filter(o => o.status === 'incoming' || o.status === 'preparing').length}</p>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Active Orders</p>
              </div>
              <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xs">
                <span className="text-2xl">👥</span>
                <p className="text-xl font-black text-gray-900 mt-2">{workers.length}</p>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Active Staff</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs">
              <p className="text-xs font-bold text-gray-700 mb-3">Weekly Sales Volume</p>
              <div className="h-32 flex items-end justify-between px-2">
                {[45, 60, 85, 30, 95, 70, 110].map((h, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-6 rounded-t-lg transition-all ${i === 6 ? 'bg-green-500' : 'bg-gray-200'}`}
                      style={{ height: `${h}px` }}
                    />
                    <span className="text-[10px] text-gray-400 font-bold">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 2. LIVE ORDERS TAB (15m Timer & Milestones) ── */}
        {activeTab === 'orders' && (
          <div className="flex flex-col gap-4">
            {orders.map(order => {
              const remainingStr = getRemainingTimeStr(order.expireTime)

              return (
                <div key={order.id} className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xs">
                  <div className="flex justify-between items-start border-b border-gray-50 pb-3">
                    <div>
                      <p className="text-sm font-black text-gray-900">{order.id}</p>
                      <p className="text-[11px] text-gray-400 font-medium">Placed 3 mins ago</p>
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                      order.status === 'incoming' ? 'bg-blue-50 text-blue-600' :
                      order.status === 'preparing' ? 'bg-orange-50 text-orange-600' :
                      order.status === 'delivering' ? 'bg-purple-50 text-purple-600' :
                      order.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  {/* 15m Accept Window Ticking Countdown */}
                  {order.status === 'incoming' && (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-2.5 my-3 flex items-center justify-between text-xs">
                      <span className="font-bold text-red-600">⏱️ 15m Accept Window:</span>
                      <span className="font-black text-red-600 font-mono text-sm">{remainingStr}</span>
                    </div>
                  )}

                  <div className="py-2">
                    <p className="text-xs font-extrabold text-gray-900">{order.customerName}</p>
                    <p className="text-[12px] text-gray-600 font-semibold">📍 {order.location} · {order.landmark}</p>
                    <p className="text-[11px] text-gray-400 font-bold mt-0.5">💳 {order.paymentMode}</p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-3 my-2 flex flex-col gap-1.5 text-xs">
                    {order.items.map((i: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className={`font-bold ${i.accepted !== false ? 'text-gray-800' : 'text-gray-400 line-through'}`}>
                          {i.name} x {i.quantity} {i.accepted === false ? '(Rejected)' : ''}
                        </span>
                        <span className={`font-black ${i.accepted !== false ? 'text-gray-900' : 'text-gray-400 line-through'}`}>
                          ₹{i.price * i.quantity}
                        </span>
                      </div>
                    ))}
                    <div className="border-t border-gray-200/60 pt-2 mt-1 flex justify-between font-black text-gray-900">
                      <span>Accepted Total</span>
                      <span>₹{order.total}</span>
                    </div>
                  </div>

                  {/* Milestone Action Buttons */}
                  <div className="flex gap-2 mt-2">
                    {order.status === 'incoming' && (
                      <>
                        <button
                          onClick={() => handleOpenAcceptModal(order)}
                          className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-black transition-colors cursor-pointer shadow-xs"
                        >
                          Accept / Partial Accept
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                          className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-3 rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {order.status === 'preparing' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'delivering')}
                        className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black transition-colors cursor-pointer shadow-xs"
                      >
                        Mark Ready (Out for Delivery)
                      </button>
                    )}

                    {order.status === 'delivering' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'completed')}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-black transition-colors cursor-pointer shadow-xs"
                      >
                        Mark Delivered
                      </button>
                    )}

                    {order.status === 'completed' && (
                      <div className="w-full py-2.5 text-center bg-gray-50 text-gray-500 rounded-xl text-xs font-bold">
                        ✓ Delivered successfully
                      </div>
                    )}

                    {order.status === 'cancelled' && (
                      <div className="w-full py-2.5 text-center bg-red-50 text-red-500 rounded-xl text-xs font-bold">
                        ✕ {order.cancelReason || 'Order Cancelled'}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── 3. CATALOG TAB ── */}
        {activeTab === 'catalog' && (
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex flex-col gap-3">
              <p className="text-xs font-black text-gray-800">Add New Menu Item</p>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Item Name</label>
                <input
                  type="text"
                  placeholder="e.g. Cold Coffee"
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-medium outline-none mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Price (₹)</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={newItemPrice}
                    onChange={e => setNewItemPrice(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-medium outline-none mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Category</label>
                  <input
                    type="text"
                    placeholder="Category"
                    value={newItemCat}
                    onChange={e => setNewItemCat(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-medium outline-none mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Description</label>
                <input
                  type="text"
                  placeholder="Ingredients or description"
                  value={newItemDesc}
                  onChange={e => setNewItemDesc(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-medium outline-none mt-1"
                />
              </div>

              <button
                onClick={handleAddItem}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl text-xs transition-colors cursor-pointer mt-1"
              >
                Publish Product
              </button>
            </div>

            <p className="text-xs font-black text-gray-800 px-1">Catalog Items</p>
            <div className="flex flex-col gap-3">
              {menuItems.map(item => (
                <div key={item.id} className="bg-white rounded-3xl p-3 border border-gray-100 shadow-xs flex items-center justify-between gap-3">
                  <img src={item.img} alt={item.name} className="w-14 h-14 rounded-2xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-gray-900 truncate">{item.name}</p>
                    <p className="text-[10px] text-gray-400 font-semibold">₹{item.price} · {item.category}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] font-bold text-gray-400 mb-0.5">{item.available ? 'Available' : 'Sold Out'}</span>
                    <button
                      onClick={() => toggleItemAvailability(item.id)}
                      className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${item.available ? 'bg-green-500 justify-end' : 'bg-gray-300 justify-start'}`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full shadow-xs" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 4. SETTINGS & WORKERS TAB ── */}
        {activeTab === 'settings' && (
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex flex-col gap-3">
              <p className="text-xs font-black text-gray-800 border-b border-gray-50 pb-2">Store Payment & Contact</p>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Merchant UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-medium outline-none mt-1"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Support Contact Number</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-medium outline-none mt-1"
                />
              </div>
              <button
                onClick={() => showToast('Store configuration saved!')}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl text-xs transition-colors cursor-pointer mt-1"
              >
                Save Configurations
              </button>
            </div>

            {/* Worker Management */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex flex-col gap-4">
              <div>
                <p className="text-xs font-black text-gray-800">Manage Shop Workers & Staff Access</p>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">Add staff phone numbers to grant them access to this Shop Owner Dashboard on their phones.</p>
              </div>

              <div className="flex flex-col gap-2.5 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <input
                  type="text"
                  placeholder="Worker Name (e.g. Ramesh Kitchen)"
                  value={newWorkerName}
                  onChange={e => setNewWorkerName(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium outline-none"
                />
                <input
                  type="tel"
                  placeholder="Worker Phone Number (+91 98765 00000)"
                  value={newWorkerPhone}
                  onChange={e => setNewWorkerPhone(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium outline-none"
                />
                <button
                  onClick={handleAddWorker}
                  className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Add Worker Access
                </button>
              </div>

              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Staff Members ({workers.length})</p>
              <div className="flex flex-col gap-2">
                {workers.map(w => (
                  <div key={w.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
                    <div>
                      <p className="text-xs font-extrabold text-gray-800">{w.name}</p>
                      <p className="text-[11px] text-gray-500 font-medium">{w.phone}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveWorker(w.id)}
                      className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onSignOut}
              className="w-full py-3.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-2xl text-xs transition-colors cursor-pointer mt-2"
            >
              Log Out Partner Portal
            </button>
          </div>
        )}
      </div>

      {/* Partial Acceptance Modal */}
      {partialOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl p-6 pb-10 flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <p className="text-lg font-black text-gray-900">Accept Order / Check Items</p>
                <p className="text-[11px] text-gray-400 font-medium">{partialOrder.id} · {partialOrder.customerName}</p>
              </div>
              <button
                onClick={() => setPartialOrder(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-500 font-semibold">
              Uncheck any item that is out of stock. The customer bill will update automatically.
            </p>

            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
              {partialOrder.items.map((item: any, idx: number) => {
                const itemKey = item.id || idx
                const isChecked = !!checkedItems[itemKey]
                return (
                  <div
                    key={itemKey}
                    onClick={() => setCheckedItems(prev => ({ ...prev, [itemKey]: !isChecked }))}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${isChecked ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold text-white ${isChecked ? 'bg-green-600' : 'bg-gray-300'}`}>
                        {isChecked ? '✓' : ''}
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${isChecked ? 'text-gray-900' : 'text-gray-400'}`}>{item.name} x {item.quantity}</p>
                        <p className="text-[11px] text-gray-400">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                    <span className={`text-[11px] font-black ${isChecked ? 'text-green-700' : 'text-red-700'}`}>
                      {isChecked ? 'Accepted' : 'Out of Stock'}
                    </span>
                  </div>
                )
              })}
            </div>

            <button
              onClick={handleConfirmAcceptance}
              className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-black rounded-2xl text-xs transition-colors cursor-pointer mt-2"
            >
              Confirm & Start Preparing
            </button>
          </div>
        </div>
      )}

      {/* Floating Bottom Nav */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-32px)] max-w-[390px]">
        <div className="bg-[#1a3a2a] text-white rounded-3xl p-1.5 shadow-xl border border-green-800/30 flex items-center justify-around">
          {[
            { id: 'dashboard', label: 'Home', icon: '📊' },
            { id: 'orders', label: 'Orders', icon: '📋' },
            { id: 'catalog', label: 'Menu', icon: '🍔' },
            { id: 'settings', label: 'Settings', icon: '⚙️' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center py-1.5 px-4 rounded-2xl transition-all cursor-pointer ${activeTab === tab.id ? 'bg-green-500 text-white font-bold' : 'text-gray-400 hover:text-white'}`}
            >
              <span className="text-sm">{tab.icon}</span>
              <span className="text-[10px] font-bold mt-0.5">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
