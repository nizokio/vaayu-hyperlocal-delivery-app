import { useState, useEffect } from 'react'

interface OwnerDashboardProps {
  user: any
  onSignOut: () => void
}

export default function OwnerDashboard({ user, onSignOut }: OwnerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'settings'>('orders')
  const [isLiveToday, setIsLiveToday] = useState(true)

  // Staff members list
  const [workers, setWorkers] = useState([
    { id: 'w1', name: 'Suresh (Kitchen)', phone: '+91 98765 11223' },
  ])
  const [newWorkerName, setNewWorkerName] = useState('')
  const [newWorkerPhone, setNewWorkerPhone] = useState('')

  // Food Menu Items
  const [menuItems, setMenuItems] = useState([
    { id: '1', name: 'Spicy Paneer Burger', price: 120, available: true },
    { id: '2', name: 'Salted French Fries', price: 80, available: true },
    { id: '3', name: 'Loaded Cheese Pizza', price: 180, available: false }
  ])

  // Simple Item Add Form
  const [newItemName, setNewItemName] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('')

  // Orders State with 15m countdown
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
      paymentMode: 'Cash on Delivery',
      status: 'incoming',
      expireTime: Date.now() + 12 * 60 * 1000
    },
    {
      id: 'ORD-7210',
      customerName: 'Rohan Mehta',
      location: 'Block C, Room 305',
      landmark: 'Lift area',
      items: [
        { id: 'cb_2', name: 'Salted French Fries', quantity: 1, price: 80, accepted: true }
      ],
      total: 80,
      paymentMode: 'UPI on Delivery',
      status: 'preparing',
      expireTime: Date.now() - 5 * 60 * 1000
    }
  ])

  // Live timer tick
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Auto-reject on 15m timeout
  useEffect(() => {
    setOrders(prev => prev.map(o => {
      if (o.status === 'incoming' && now > o.expireTime) {
        return { ...o, status: 'cancelled', cancelReason: '15m Timeout Expired' }
      }
      return o
    }))
  }, [now])

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 2500)
  }

  // Format 15m countdown (mm:ss)
  const getRemainingTimeStr = (expireTime: number) => {
    const diff = Math.max(0, Math.floor((expireTime - now) / 1000))
    const mins = Math.floor(diff / 60)
    const secs = diff % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Partial Accept Modal
  const [partialOrder, setPartialOrder] = useState<any>(null)
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({})

  const handleOpenAcceptModal = (order: any) => {
    setPartialOrder(order)
    const checks: { [key: string]: boolean } = {}
    order.items.forEach((item: any, idx: number) => {
      checks[item.id || idx] = true
    })
    setCheckedItems(checks)
  }

  const handleConfirmAcceptance = () => {
    if (!partialOrder) return
    const updatedItems = partialOrder.items.map((item: any, idx: number) => ({
      ...item,
      accepted: !!checkedItems[item.id || idx]
    }))

    if (!updatedItems.some((i: any) => i.accepted)) {
      showToast('Select at least 1 item to accept')
      return
    }

    const newTotal = updatedItems
      .filter((i: any) => i.accepted)
      .reduce((sum: number, i: any) => sum + i.price * i.quantity, 0)

    setOrders(prev => prev.map(o => o.id === partialOrder.id ? { ...o, items: updatedItems, total: newTotal, status: 'preparing' } : o))
    showToast('Order Accepted!')
    setPartialOrder(null)
  }

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    showToast(`Order status updated!`)
  }

  const handleAddWorker = () => {
    if (!newWorkerName || !newWorkerPhone) {
      showToast('Enter worker name & phone number')
      return
    }
    setWorkers(prev => [...prev, { id: `w_${Date.now()}`, name: newWorkerName, phone: newWorkerPhone }])
    setNewWorkerName('')
    setNewWorkerPhone('')
    showToast('Worker added successfully!')
  }

  const handleAddItem = () => {
    if (!newItemName || !newItemPrice) {
      showToast('Enter item name & price')
      return
    }
    setMenuItems(prev => [{ id: `i_${Date.now()}`, name: newItemName, price: parseFloat(newItemPrice) || 0, available: true }, ...prev])
    setNewItemName('')
    setNewItemPrice('')
    showToast('Food item added!')
  }

  const incomingCount = orders.filter(o => o.status === 'incoming').length
  const todayTotal = orders.filter(o => o.status === 'completed' || o.status === 'delivering' || o.status === 'preparing').reduce((s, o) => s + o.total, 0)

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 pb-20">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-xl">
          ✨ {toastMessage}
        </div>
      )}

      {/* Top Simple Header */}
      <div className="bg-white px-4 pt-6 pb-4 border-b border-gray-200 sticky top-0 z-30">
        <span className="text-[11px] font-black text-green-700 uppercase tracking-widest">
          {user?.role === 'worker' ? 'SHOP WORKER PORTAL' : 'SHOP OWNER DASHBOARD'}
        </span>
        <h1 className="text-[22px] font-black text-gray-900 leading-tight mt-0.5">{user?.name || 'Campus Bites'}</h1>

        {/* GIANT HIGH-CONTRAST ZOMATO-STYLE DAILY TOGGLE BUTTON */}
        <button
          onClick={() => {
            const next = !isLiveToday
            setIsLiveToday(next)
            showToast(next ? 'Shop is OPEN for orders!' : 'Shop is CLOSED for today.')
          }}
          className={`mt-3 w-full py-4 rounded-2xl text-white text-sm font-black uppercase tracking-wide cursor-pointer transition-colors shadow-md border-2 ${
            isLiveToday ? 'bg-green-600 border-green-700 hover:bg-green-700' : 'bg-red-600 border-red-700 hover:bg-red-700'
          }`}
        >
          {isLiveToday ? '🟢 SHOP IS OPEN FOR ORDERS (Tap to Close)' : '🔴 SHOP IS CLOSED FOR TODAY (Tap to Open)'}
        </button>
      </div>

      {/* 2 Simple Summary Cards */}
      <div className="grid grid-cols-2 gap-3 px-4 pt-4">
        <div className={`rounded-2xl p-4 border ${incomingCount > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
          <p className="text-[11px] font-black uppercase text-gray-500">New Orders Waiting</p>
          <p className={`text-2xl font-black mt-1 ${incomingCount > 0 ? 'text-red-600' : 'text-gray-900'}`}>{incomingCount}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200">
          <p className="text-[11px] font-black uppercase text-gray-500">Today's Total Cash</p>
          <p className="text-2xl font-black text-gray-900 mt-1">₹{todayTotal}</p>
        </div>
      </div>

      <div className="p-4 flex-1">
        {/* ── 1. ORDERS TAB (Big Easy Buttons) ── */}
        {activeTab === 'orders' && (
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-black text-gray-900">Current Customer Orders ({orders.length})</h2>

            {orders.map(order => {
              const remainingStr = getRemainingTimeStr(order.expireTime)
              return (
                <div key={order.id} className="bg-white rounded-3xl p-5 border-2 border-gray-200 shadow-xs flex flex-col gap-3">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
                    <span className="text-base font-black text-gray-900">{order.id}</span>
                    <span className={`text-[11px] font-black px-3 py-1 rounded-full uppercase ${
                      order.status === 'incoming' ? 'bg-red-100 text-red-700' :
                      order.status === 'preparing' ? 'bg-orange-100 text-orange-700' :
                      order.status === 'delivering' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  {/* 15m Accept Countdown Banner */}
                  {order.status === 'incoming' && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-2.5 flex justify-between items-center text-xs">
                      <span className="font-black text-red-700">⏱️ Time left to Accept:</span>
                      <span className="font-black text-red-700 font-mono text-sm">{remainingStr}</span>
                    </div>
                  )}

                  <div>
                    <p className="text-base font-black text-gray-900">{order.customerName}</p>
                    <p className="text-xs font-extrabold text-gray-700 mt-0.5">📍 {order.location} ({order.landmark})</p>
                    <p className="text-[12px] font-bold text-gray-500 mt-0.5">💳 {order.paymentMode}</p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-3 flex flex-col gap-1.5 border border-gray-100 text-xs">
                    {order.items.map((it: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className={`font-bold ${it.accepted !== false ? 'text-gray-900' : 'text-gray-400 line-through'}`}>
                          {it.name} x {it.quantity}
                        </span>
                        <span className="font-black text-gray-900">₹{it.price * it.quantity}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 pt-2 mt-1 flex justify-between">
                      <span className="font-black text-gray-900 text-sm">Bill Total</span>
                      <span className="font-black text-green-700 text-base">₹{order.total}</span>
                    </div>
                  </div>

                  {/* GIANT ACTION BUTTONS */}
                  <div className="flex flex-col gap-2 mt-1">
                    {order.status === 'incoming' && (
                      <>
                        <button
                          onClick={() => handleOpenAcceptModal(order)}
                          className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-black text-sm uppercase rounded-2xl transition-colors cursor-pointer shadow-md"
                        >
                          ✅ ACCEPT ORDER (₹{order.total})
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                          className="w-full py-3 bg-red-100 hover:bg-red-200 text-red-700 font-extrabold text-xs rounded-2xl cursor-pointer"
                        >
                          ❌ DECLINE ORDER
                        </button>
                      </>
                    )}

                    {order.status === 'preparing' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'delivering')}
                        className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black text-sm uppercase rounded-2xl transition-colors cursor-pointer shadow-md"
                      >
                        🛵 MARK READY FOR DELIVERY
                      </button>
                    )}

                    {order.status === 'delivering' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'completed')}
                        className="w-full py-4 bg-green-700 hover:bg-green-800 text-white font-black text-sm uppercase rounded-2xl transition-colors cursor-pointer shadow-md"
                      >
                        🎉 MARK ORDER DELIVERED
                      </button>
                    )}

                    {order.status === 'completed' && (
                      <div className="w-full py-3 text-center bg-green-50 text-green-800 font-bold text-xs rounded-2xl">
                        ✓ Order Completed
                      </div>
                    )}

                    {order.status === 'cancelled' && (
                      <div className="w-full py-3 text-center bg-red-50 text-red-700 font-bold text-xs rounded-2xl">
                        ✕ Order Rejected
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── 2. FOOD MENU ITEMS TAB ── */}
        {activeTab === 'menu' && (
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-3xl p-5 border border-gray-200 flex flex-col gap-3">
              <p className="text-base font-black text-gray-900">➕ Add New Food Item</p>

              <input
                type="text"
                placeholder="Food Item Name (e.g. Samosa)"
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-medium outline-none"
              />

              <input
                type="number"
                placeholder="Price in ₹ (e.g. 20)"
                value={newItemPrice}
                onChange={e => setNewItemPrice(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-medium outline-none"
              />

              <button
                onClick={handleAddItem}
                className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-black text-xs rounded-xl transition-colors cursor-pointer mt-1"
              >
                Save Food Item
              </button>
            </div>

            <p className="text-base font-black text-gray-900 mt-2">Food Stock Status ({menuItems.length})</p>
            <div className="flex flex-col gap-3">
              {menuItems.map(item => (
                <div key={item.id} className="bg-white rounded-2xl p-4 border border-gray-200 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-black text-gray-900">{item.name}</p>
                    <p className="text-xs font-bold text-green-700 mt-0.5">₹{item.price}</p>
                  </div>

                  <button
                    onClick={() => setMenuItems(prev => prev.map(i => i.id === item.id ? { ...i, available: !i.available } : i))}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase border-2 cursor-pointer transition-colors ${item.available ? 'bg-green-50 text-green-700 border-green-600' : 'bg-red-50 text-red-700 border-red-600'}`}
                  >
                    {item.available ? '🟢 IN STOCK' : '🔴 SOLD OUT'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 3. SETTINGS & WORKERS TAB ── */}
        {activeTab === 'settings' && (
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-3xl p-5 border border-gray-200 flex flex-col gap-3">
              <p className="text-base font-black text-gray-900">👥 Add Shop Worker Staff</p>
              <p className="text-xs text-gray-500 font-medium">Give staff access to accept orders on their phones.</p>

              <input
                type="text"
                placeholder="Worker Name (e.g. Ramesh)"
                value={newWorkerName}
                onChange={e => setNewWorkerName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-medium outline-none"
              />

              <input
                type="tel"
                placeholder="Worker Mobile Number (+91 98765 00000)"
                value={newWorkerPhone}
                onChange={e => setNewWorkerPhone(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-medium outline-none"
              />

              <button
                onClick={handleAddWorker}
                className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-black text-xs rounded-xl transition-colors cursor-pointer mt-1"
              >
                Add Worker
              </button>

              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mt-2">Added Workers ({workers.length})</p>
              {workers.map(w => (
                <div key={w.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                  <div>
                    <p className="font-bold text-gray-900">{w.name}</p>
                    <p className="text-gray-500">{w.phone}</p>
                  </div>
                  <button
                    onClick={() => setWorkers(prev => prev.filter(x => x.id !== w.id))}
                    className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg font-bold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button onClick={onSignOut} className="w-full py-4 bg-red-100 hover:bg-red-200 text-red-700 font-black text-sm rounded-2xl cursor-pointer mt-2">
              Log Out
            </button>
          </div>
        )}
      </div>

      {/* Partial Acceptance Item Checklist Modal */}
      {partialOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl p-6 flex flex-col gap-4">
            <p className="text-base font-black text-gray-900">Uncheck items that are out of stock:</p>

            <div className="flex flex-col gap-3">
              {partialOrder.items.map((item: any, idx: number) => {
                const itemKey = item.id || idx
                const isChecked = !!checkedItems[itemKey]
                return (
                  <div
                    key={itemKey}
                    onClick={() => setCheckedItems(prev => ({ ...prev, [itemKey]: !isChecked }))}
                    className={`flex justify-between items-center p-4 rounded-2xl border-2 cursor-pointer transition-colors ${isChecked ? 'bg-green-50 border-green-600 text-green-900' : 'bg-red-50 border-red-600 text-red-900'}`}
                  >
                    <span className="text-sm font-black">{item.name} x {item.quantity}</span>
                    <span className="text-xs font-black uppercase">
                      {isChecked ? '✓ YES (IN STOCK)' : '✕ NO (SOLD OUT)'}
                    </span>
                  </div>
                )
              })}
            </div>

            <button
              onClick={handleConfirmAcceptance}
              className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-black text-base uppercase rounded-2xl shadow-md cursor-pointer mt-2"
            >
              CONFIRM ACCEPTANCE
            </button>
          </div>
        </div>
      )}

      {/* Simple 3-Tab Bottom Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-300 flex items-center justify-around h-16 z-40 max-w-[430px] mx-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center flex-1 cursor-pointer ${activeTab === 'orders' ? 'text-green-600 font-bold' : 'text-gray-500'}`}
        >
          <span className="text-xl">📋</span>
          <span className="text-[11px] font-black mt-0.5">Orders</span>
        </button>

        <button
          onClick={() => setActiveTab('menu')}
          className={`flex flex-col items-center flex-1 cursor-pointer ${activeTab === 'menu' ? 'text-green-600 font-bold' : 'text-gray-500'}`}
        >
          <span className="text-xl">🍔</span>
          <span className="text-[11px] font-black mt-0.5">Food Stock</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center flex-1 cursor-pointer ${activeTab === 'settings' ? 'text-green-600 font-bold' : 'text-gray-500'}`}
        >
          <span className="text-xl">⚙️</span>
          <span className="text-[11px] font-black mt-0.5">Settings</span>
        </button>
      </div>
    </div>
  )
}
