import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Switch, Modal } from 'react-native'
import tw from 'twrnc'
import Svg, { Path, Rect, Circle, Line, Polyline } from 'react-native-svg'

// Simple SVG Icons
function IconDashboard() {
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <Rect x="3" y="3" width="7" height="9" rx="1" />
      <Rect x="14" y="3" width="7" height="5" rx="1" />
      <Rect x="14" y="12" width="7" height="9" rx="1" />
      <Rect x="3" y="16" width="7" height="5" rx="1" />
    </Svg>
  )
}

function IconOrders() {
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <Polyline points="14 2 14 8 20 8" />
      <Line x1="16" y1="13" x2="8" y2="13" />
      <Line x1="16" y1="17" x2="8" y2="17" />
    </Svg>
  )
}

function IconCatalog() {
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <Path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </Svg>
  )
}

function IconSettings() {
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <Circle cx="12" cy="12" r="3" />
      <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </Svg>
  )
}

function IconClock() {
  return (
    <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
      <Circle cx="12" cy="12" r="10" />
      <Polyline points="12 6 12 12 16 14" />
    </Svg>
  )
}

interface OwnerDashboardProps {
  user: any
  onSignOut: () => void
}

export default function OwnerDashboard({ user, onSignOut }: OwnerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'catalog' | 'settings'>('dashboard')
  const [isLiveToday, setIsLiveToday] = useState(true) // Zomato-style Daily Go-Live Mode

  // Workers / Staff members list
  const [workers, setWorkers] = useState([
    { id: 'w1', name: 'Suresh (Kitchen)', phone: '+91 98765 11223' },
    { id: 'w2', name: 'Karthik (Counter)', phone: '+91 98765 44556' }
  ])
  const [newWorkerName, setNewWorkerName] = useState('')
  const [newWorkerPhone, setNewWorkerPhone] = useState('')

  // Catalog items
  const [menuItems, setMenuItems] = useState([
    { id: '1', name: 'Spicy Paneer Burger', price: 120, desc: 'Crispy paneer patty with spicy cream', available: true, category: 'Food', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200' },
    { id: '2', name: 'Salted French Fries', price: 80, desc: 'Golden salted fries, crispy outside', available: true, category: 'Food', img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200' },
    { id: '3', name: 'Loaded Cheese Pizza', price: 180, desc: 'Double mozzarella cheese on fresh crust', available: false, category: 'Food', img: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=200' }
  ])

  // Orders state with 15-minute countdown deadline
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
      createdTime: Date.now() - 3 * 60 * 1000, // 3 mins ago
      expireTime: Date.now() + 12 * 60 * 1000 // 12 mins left
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

  // Live 1-second Ticking Timer for 15m order acceptance deadline
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Auto-reject orders when 15m timer expires
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

  // Form states for adding items
  const [newItemName, setNewItemName] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('')
  const [newItemDesc, setNewItemDesc] = useState('')
  const [newItemCat, setNewItemCat] = useState('Food')
  const [newItemImg, setNewItemImg] = useState('')

  // Settings states
  const [upiId, setUpiId] = useState('campusbites@ybl')
  const [contactPhone, setContactPhone] = useState('+91 98765 43210')

  const [toast, setToast] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  // Format 15-minute countdown (mm:ss)
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

  // Confirm Acceptance (Full or Partial)
  const handleConfirmAcceptance = () => {
    if (!partialOrder) return

    const updatedItems = partialOrder.items.map((item: any, idx: number) => ({
      ...item,
      accepted: !!checkedItems[item.id || idx]
    }))

    const hasAnyAccepted = updatedItems.some((i: any) => i.accepted)
    if (!hasAnyAccepted) {
      showToast('Select at least 1 item to accept or decline the order.')
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

  // Direct Status Transition
  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    showToast(`Order updated to ${newStatus.toUpperCase()}!`)
  }

  // Add Worker Staff
  const handleAddWorker = () => {
    if (!newWorkerName || !newWorkerPhone) {
      showToast('Enter worker name and phone number')
      return
    }
    setWorkers(prev => [...prev, { id: `w_${Date.now()}`, name: newWorkerName, phone: newWorkerPhone }])
    setNewWorkerName('')
    setNewWorkerPhone('')
    showToast('Worker added! They can now access dashboard.')
  }

  const handleRemoveWorker = (id: string) => {
    setWorkers(prev => prev.filter(w => w.id !== id))
    showToast('Worker access revoked.')
  }

  // Add Catalog Item
  const handleAddItem = () => {
    if (!newItemName || !newItemPrice) {
      showToast('Name and Price are required!')
      return
    }
    const newItem = {
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
    <View style={tw`flex-1 bg-gray-50`}>
      {toast && (
        <View style={[tw`absolute top-4 left-4 right-4 z-50 rounded-full px-4 py-3 shadow-lg items-center`, { backgroundColor: '#8fda58' }]}>
          <Text style={tw`text-white text-xs font-bold text-center`}>{toast}</Text>
        </View>
      )}

      {/* Header with Zomato-style Daily Go-Live Toggle */}
      <View style={tw`bg-white border-b border-gray-100 px-4 pt-8 pb-4`}>
        <View style={tw`flex-row justify-between items-center mb-3`}>
          <View>
            <Text style={[tw`text-[11px] font-black uppercase tracking-[2.5px]`, { color: '#8fda58' }]}>
              {user?.role === 'worker' ? 'Staff Portal' : 'Merchant Partner'}
            </Text>
            <Text style={tw`text-[20px] font-black text-gray-900`}>{user?.name || 'Campus Bites'}</Text>
          </View>
          <View style={tw`flex-row items-center gap-2 bg-gray-50 border border-gray-100 rounded-full px-3 py-1.5`}>
            <Text style={tw`text-[11px] font-bold text-gray-700`}>{isLiveToday ? '🟢 LIVE TODAY' : '🔴 OFFLINE'}</Text>
            <Switch
              value={isLiveToday}
              onValueChange={v => {
                setIsLiveToday(v)
                showToast(v ? 'Shop is now LIVE for customer orders!' : 'Shop is OFFLINE for today.')
              }}
              thumbColor={isLiveToday ? '#8fda58' : '#d1d5db'}
              trackColor={{ false: '#f3f4f6', true: '#dcfce7' }}
            />
          </View>
        </View>

        {/* Daily Go-Live Banner */}
        <View style={[tw`rounded-2xl px-4 py-2.5 flex-row items-center justify-between border`, { backgroundColor: isLiveToday ? '#f0fdf4' : '#fef2f2', borderColor: isLiveToday ? '#bbf7d0' : '#fecaca' }]}>
          <Text style={[tw`text-[11px] font-bold`, { color: isLiveToday ? '#15803d' : '#b91c1c' }]}>
            {isLiveToday ? '⚡ Store active: Visible to campus students for orders' : '🔒 Store closed for today: Invisible to customers'}
          </Text>
          <TouchableOpacity onPress={() => setIsLiveToday(!isLiveToday)}>
            <Text style={[tw`text-[11px] font-black underline`, { color: isLiveToday ? '#15803d' : '#b91c1c' }]}>
              {isLiveToday ? 'Go Offline' : 'Go Live Now'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={tw`pb-32`}>
        {/* ── 1. DASHBOARD TAB ─────────────────────────────────────────────── */}
        {activeTab === 'dashboard' && (
          <View style={tw`p-4 gap-4`}>
            {/* Stats Grid */}
            <View style={tw`flex-row flex-wrap gap-3`}>
              <View style={tw`flex-1 min-w-[45%] bg-white rounded-3xl p-4 border border-gray-100 shadow-sm`}>
                <Text style={tw`text-2xl`}>📈</Text>
                <Text style={tw`text-lg font-black text-gray-900 mt-2`}>₹12,450</Text>
                <Text style={tw`text-[11px] text-gray-400 font-bold uppercase tracking-wider`}>Today's Sales</Text>
              </View>

              <View style={tw`flex-1 min-w-[45%] bg-white rounded-3xl p-4 border border-gray-100 shadow-sm`}>
                <Text style={tw`text-2xl`}>📋</Text>
                <Text style={tw`text-lg font-black text-gray-900 mt-2`}>{orders.length}</Text>
                <Text style={tw`text-[11px] text-gray-400 font-bold uppercase tracking-wider`}>Total Orders</Text>
              </View>

              <View style={tw`flex-1 min-w-[45%] bg-white rounded-3xl p-4 border border-gray-100 shadow-sm`}>
                <Text style={tw`text-2xl`}>⏳</Text>
                <Text style={tw`text-lg font-black text-gray-900 mt-2`}>{orders.filter(o => o.status === 'incoming' || o.status === 'preparing').length}</Text>
                <Text style={tw`text-[11px] text-gray-400 font-bold uppercase tracking-wider`}>Active Orders</Text>
              </View>

              <View style={tw`flex-1 min-w-[45%] bg-white rounded-3xl p-4 border border-gray-100 shadow-sm`}>
                <Text style={tw`text-2xl`}>👥</Text>
                <Text style={tw`text-lg font-black text-gray-900 mt-2`}>{workers.length}</Text>
                <Text style={tw`text-[11px] text-gray-400 font-bold uppercase tracking-wider`}>Active Staff</Text>
              </View>
            </View>

            {/* Velocity Chart */}
            <View style={tw`bg-white rounded-3xl p-5 border border-gray-100 shadow-sm`}>
              <Text style={tw`text-[13px] font-bold text-gray-700 mb-3`}>Weekly Sales Trends</Text>
              <View style={tw`h-32 flex-row items-end justify-between px-2`}>
                {[45, 60, 85, 30, 95, 70, 110].map((h, i) => (
                  <View key={i} style={tw`items-center`}>
                    <View style={[tw`w-6 rounded-t-lg`, { height: h, backgroundColor: i === 6 ? '#8fda58' : '#e5e7eb' }]} />
                    <Text style={tw`text-[10px] text-gray-400 font-bold mt-1.5`}>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* ── 2. LIVE ORDERS TAB (With 15-Minute Countdown & Actions) ─────── */}
        {activeTab === 'orders' && (
          <View style={tw`p-4 gap-4`}>
            {orders.map(order => {
              const isExpired = now > order.expireTime
              const remainingStr = getRemainingTimeStr(order.expireTime)

              return (
                <View key={order.id} style={tw`bg-white rounded-3xl p-4 border border-gray-100 shadow-sm`}>
                  {/* Order Top Bar */}
                  <View style={tw`flex-row justify-between items-start border-b border-gray-50 pb-3`}>
                    <View>
                      <Text style={tw`text-[15px] font-black text-gray-800`}>{order.id}</Text>
                      <Text style={tw`text-[11px] text-gray-400 font-medium`}>Placed 3 mins ago</Text>
                    </View>

                    {/* Status Badge */}
                    <View style={[tw`px-2.5 py-1 rounded-full`, 
                      order.status === 'incoming' ? tw`bg-blue-50` :
                      order.status === 'preparing' ? tw`bg-orange-50` :
                      order.status === 'delivering' ? tw`bg-purple-50` :
                      order.status === 'cancelled' ? tw`bg-red-50` : tw`bg-green-50`
                    ]}>
                      <Text style={[tw`text-[10px] font-black uppercase`,
                        order.status === 'incoming' ? tw`text-blue-600` :
                        order.status === 'preparing' ? tw`text-orange-600` :
                        order.status === 'delivering' ? tw`text-purple-600` :
                        order.status === 'cancelled' ? tw`text-red-600` : tw`text-green-600`
                      ]}>{order.status}</Text>
                    </View>
                  </View>

                  {/* 15-Minute Ticking Acceptance Countdown */}
                  {order.status === 'incoming' && (
                    <View style={tw`bg-red-50 border border-red-100 rounded-2xl p-2.5 my-3 flex-row items-center justify-between`}>
                      <View style={tw`flex-row items-center gap-1.5`}>
                        <IconClock />
                        <Text style={tw`text-[11px] font-bold text-red-600`}>15m Accept Window:</Text>
                      </View>
                      <Text style={tw`text-[13px] font-black text-red-600 font-mono`}>{remainingStr}</Text>
                    </View>
                  )}

                  {/* Customer Info */}
                  <View style={tw`py-2 gap-0.5`}>
                    <Text style={tw`text-[13px] font-extrabold text-gray-900`}>{order.customerName}</Text>
                    <Text style={tw`text-[12px] text-gray-600 font-semibold`}>📍 {order.location} · {order.landmark}</Text>
                    <Text style={tw`text-[11px] text-gray-400 font-bold mt-0.5`}>💳 {order.paymentMode}</Text>
                  </View>

                  {/* Order Items Breakdown */}
                  <View style={tw`bg-gray-50 rounded-2xl p-3 my-2 gap-1.5`}>
                    {order.items.map((i: any, idx: number) => (
                      <View key={idx} style={tw`flex-row justify-between items-center`}>
                        <Text style={[tw`text-[12px] font-bold`, i.accepted !== false ? tw`text-gray-800` : tw`text-gray-400 line-through`]}>
                          {i.name} x {i.quantity} {i.accepted === false ? '(Rejected)' : ''}
                        </Text>
                        <Text style={[tw`text-[12px] font-black`, i.accepted !== false ? tw`text-gray-900` : tw`text-gray-400 line-through`]}>
                          ₹{i.price * i.quantity}
                        </Text>
                      </View>
                    ))}
                    <View style={tw`border-t border-gray-200/60 pt-2 mt-1 flex-row justify-between`}>
                      <Text style={tw`text-[13px] font-black text-gray-900`}>Accepted Total</Text>
                      <Text style={tw`text-[13px] font-black text-gray-900`}>₹{order.total}</Text>
                    </View>
                  </View>

                  {/* 4-Stage Milestone Actions */}
                  <View style={tw`flex-row gap-2 mt-2`}>
                    {order.status === 'incoming' && (
                      <>
                        <TouchableOpacity
                          onPress={() => handleOpenAcceptModal(order)}
                          style={[tw`flex-1 py-3 rounded-xl items-center`, { backgroundColor: '#8fda58' }]}
                        >
                          <Text style={tw`text-[12px] font-black text-white`}>Accept / Partial Accept</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => handleUpdateStatus(order.id, 'cancelled')}
                          style={tw`bg-red-50 px-4 py-3 rounded-xl justify-center`}
                        >
                          <Text style={tw`text-[12px] font-bold text-red-500`}>Decline</Text>
                        </TouchableOpacity>
                      </>
                    )}

                    {order.status === 'preparing' && (
                      <TouchableOpacity
                        onPress={() => handleUpdateStatus(order.id, 'delivering')}
                        style={[tw`flex-1 py-3 rounded-xl items-center`, { backgroundColor: '#ea580c' }]}
                      >
                        <Text style={tw`text-[12px] font-black text-white`}>Mark Ready (Out for Delivery)</Text>
                      </TouchableOpacity>
                    )}

                    {order.status === 'delivering' && (
                      <TouchableOpacity
                        onPress={() => handleUpdateStatus(order.id, 'completed')}
                        style={[tw`flex-1 py-3 rounded-xl items-center`, { backgroundColor: '#16a34a' }]}
                      >
                        <Text style={tw`text-[12px] font-black text-white`}>Mark Delivered</Text>
                      </TouchableOpacity>
                    )}

                    {order.status === 'completed' && (
                      <View style={tw`flex-1 py-2.5 items-center bg-gray-50 rounded-xl`}>
                        <Text style={tw`text-[12px] text-gray-500 font-bold`}>✓ Delivered successfully</Text>
                      </View>
                    )}

                    {order.status === 'cancelled' && (
                      <View style={tw`flex-1 py-2.5 items-center bg-red-50 rounded-xl`}>
                        <Text style={tw`text-[11px] text-red-500 font-bold`}>✕ {order.cancelReason || 'Order Cancelled'}</Text>
                      </View>
                    )}
                  </View>
                </View>
              )
            })}
          </View>
        )}

        {/* ── 3. CATALOG TAB ───────────────────────────────────────────────── */}
        {activeTab === 'catalog' && (
          <View style={tw`p-4 gap-4`}>
            {/* Add Item Form */}
            <View style={tw`bg-white rounded-3xl p-5 border border-gray-100 shadow-sm`}>
              <Text style={tw`text-[14px] font-black text-gray-800 mb-3`}>Add New Menu Item</Text>
              
              <View style={tw`gap-3`}>
                <View>
                  <Text style={tw`text-[10px] font-bold text-gray-400 uppercase mb-1`}>Item Name</Text>
                  <TextInput placeholder="e.g. Cold Coffee" value={newItemName} onChangeText={setNewItemName} style={tw`bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-[12px] text-gray-800`} />
                </View>

                <View style={tw`flex-row gap-3`}>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-[10px] font-bold text-gray-400 uppercase mb-1`}>Price (₹)</Text>
                    <TextInput placeholder="Price" keyboardType="number-pad" value={newItemPrice} onChangeText={setNewItemPrice} style={tw`bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-[12px] text-gray-800`} />
                  </View>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-[10px] font-bold text-gray-400 uppercase mb-1`}>Category</Text>
                    <TextInput placeholder="Category" value={newItemCat} onChangeText={setNewItemCat} style={tw`bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-[12px] text-gray-800`} />
                  </View>
                </View>

                <View>
                  <Text style={tw`text-[10px] font-bold text-gray-400 uppercase mb-1`}>Description</Text>
                  <TextInput placeholder="Ingredients or description" value={newItemDesc} onChangeText={setNewItemDesc} style={tw`bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-[12px] text-gray-800`} />
                </View>

                <TouchableOpacity
                  onPress={handleAddItem}
                  style={[tw`w-full py-3.5 rounded-xl items-center mt-2`, { backgroundColor: '#8fda58' }]}
                >
                  <Text style={tw`text-[13px] font-black text-white`}>Publish Product</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Menu List */}
            <Text style={tw`text-[14px] font-black text-gray-800 mt-2 px-1`}>Catalog Items</Text>
            <View style={tw`gap-3`}>
              {menuItems.map(item => (
                <View key={item.id} style={tw`bg-white rounded-3xl p-3 border border-gray-100 shadow-sm flex-row items-center gap-3`}>
                  <Image source={{ uri: item.img }} style={tw`w-14 h-14 rounded-2xl`} />
                  <View style={tw`flex-1 min-w-0`}>
                    <Text style={tw`font-bold text-[13px] text-gray-900 truncate`}>{item.name}</Text>
                    <Text style={tw`text-[10px] text-gray-400 font-semibold`}>₹{item.price} · {item.category}</Text>
                  </View>
                  
                  <View style={tw`items-center`}>
                    <Text style={tw`text-[9px] font-bold text-gray-400 mb-0.5`}>{item.available ? 'Available' : 'Sold Out'}</Text>
                    <Switch value={item.available} onValueChange={() => toggleItemAvailability(item.id)} thumbColor={item.available ? '#8fda58' : '#d1d5db'} trackColor={{ false: '#f3f4f6', true: '#dcfce7' }} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── 4. SETTINGS & WORKERS TAB ────────────────────────────────────── */}
        {activeTab === 'settings' && (
          <View style={tw`p-4 gap-4`}>
            {/* Store Configs */}
            <View style={tw`bg-white rounded-3xl p-5 border border-gray-100 shadow-sm gap-4`}>
              <Text style={tw`text-[14px] font-black text-gray-800 border-b border-gray-50 pb-2`}>Store Payment & Contact</Text>

              <View>
                <Text style={tw`text-[10px] font-bold text-gray-400 uppercase mb-1`}>Merchant UPI ID</Text>
                <TextInput value={upiId} onChangeText={setUpiId} style={tw`bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-[12px] text-gray-800`} />
              </View>

              <View>
                <Text style={tw`text-[10px] font-bold text-gray-400 uppercase mb-1`}>Support Phone Number</Text>
                <TextInput value={contactPhone} onChangeText={setContactPhone} style={tw`bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-[12px] text-gray-800`} />
              </View>

              <TouchableOpacity
                onPress={() => showToast('Store settings updated!')}
                style={[tw`w-full py-3.5 rounded-xl items-center mt-1`, { backgroundColor: '#8fda58' }]}
              >
                <Text style={tw`text-[13px] font-black text-white`}>Save Configurations</Text>
              </TouchableOpacity>
            </View>

            {/* Worker / Staff Management (By Phone Number) */}
            <View style={tw`bg-white rounded-3xl p-5 border border-gray-100 shadow-sm gap-4`}>
              <View>
                <Text style={tw`text-[14px] font-black text-gray-800`}>Manage Shop Workers & Staff</Text>
                <Text style={tw`text-[11px] text-gray-400 font-medium mt-0.5`}>Add worker phone numbers to grant them access to this Dashboard on their phones.</Text>
              </View>

              <View style={tw`gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100`}>
                <TextInput
                  placeholder="Worker Name (e.g. Ramesh Kitchen)"
                  value={newWorkerName}
                  onChangeText={setNewWorkerName}
                  style={tw`bg-white border border-gray-200 rounded-xl px-3 py-2 text-[12px] text-gray-800`}
                />
                <TextInput
                  placeholder="Worker Phone Number (+91 98765 00000)"
                  keyboardType="phone-pad"
                  value={newWorkerPhone}
                  onChangeText={setNewWorkerPhone}
                  style={tw`bg-white border border-gray-200 rounded-xl px-3 py-2 text-[12px] text-gray-800`}
                />
                <TouchableOpacity
                  onPress={handleAddWorker}
                  style={[tw`w-full py-3 rounded-xl items-center`, { backgroundColor: '#8fda58' }]}
                >
                  <Text style={tw`text-[12px] font-black text-white`}>Add Worker Access</Text>
                </TouchableOpacity>
              </View>

              {/* List of Active Workers */}
              <Text style={tw`text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1`}>Active Staff Members ({workers.length})</Text>
              <View style={tw`gap-2`}>
                {workers.map(w => (
                  <View key={w.id} style={tw`flex-row items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100`}>
                    <View>
                      <Text style={tw`text-[13px] font-extrabold text-gray-800`}>{w.name}</Text>
                      <Text style={tw`text-[11px] text-gray-500 font-medium`}>{w.phone}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleRemoveWorker(w.id)} style={tw`bg-red-50 px-3 py-1.5 rounded-lg`}>
                      <Text style={tw`text-[10px] font-bold text-red-500`}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity
              onPress={onSignOut}
              style={tw`w-full py-4 rounded-2xl items-center bg-red-50 mt-2`}
            >
              <Text style={tw`text-[14px] font-bold text-red-500`}>Log Out Partner Portal</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Partial Acceptance Modal */}
      <Modal visible={!!partialOrder} transparent animationType="slide" onRequestClose={() => setPartialOrder(null)}>
        <View style={tw`flex-1 justify-end bg-black/50`}>
          <View style={tw`bg-white rounded-t-3xl p-6 pb-10 gap-4 max-h-[80%]`}>
            <View style={tw`flex-row justify-between items-center border-b border-gray-100 pb-3`}>
              <View>
                <Text style={tw`text-[18px] font-black text-gray-900`}>Accept Order / Check Items</Text>
                <Text style={tw`text-[11px] text-gray-400 font-medium`}>{partialOrder?.id} · {partialOrder?.customerName}</Text>
              </View>
              <TouchableOpacity onPress={() => setPartialOrder(null)} style={tw`w-8 h-8 rounded-full bg-gray-100 items-center justify-center`}>
                <Text style={tw`text-gray-500 font-bold text-base`}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={tw`text-[12px] text-gray-500 font-semibold`}>
              Uncheck any item that is out of stock. The customer bill will update automatically.
            </Text>

            <ScrollView style={tw`max-h-60`}>
              <View style={tw`gap-3`}>
                {partialOrder?.items.map((item: any, idx: number) => {
                  const itemKey = item.id || idx
                  const isChecked = !!checkedItems[itemKey]
                  return (
                    <TouchableOpacity
                      key={itemKey}
                      onPress={() => setCheckedItems(prev => ({ ...prev, [itemKey]: !isChecked }))}
                      style={[
                        tw`flex-row items-center justify-between p-3.5 rounded-2xl border`,
                        { backgroundColor: isChecked ? '#f0fdf4' : '#fef2f2', borderColor: isChecked ? '#bbf7d0' : '#fecaca' }
                      ]}
                    >
                      <View style={tw`flex-row items-center gap-3`}>
                        <View style={[tw`w-6 h-6 rounded-md items-center justify-center border`, { borderColor: isChecked ? '#16a34a' : '#ef4444', backgroundColor: isChecked ? '#16a34a' : 'transparent' }]}>
                          {isChecked && <Text style={tw`text-white font-bold text-xs`}>✓</Text>}
                        </View>
                        <View>
                          <Text style={[tw`text-[13px] font-bold`, { color: isChecked ? '#111827' : '#9ca3af' }]}>{item.name} x {item.quantity}</Text>
                          <Text style={tw`text-[11px] text-gray-400`}>₹{item.price * item.quantity}</Text>
                        </View>
                      </View>
                      <Text style={[tw`text-[11px] font-black`, { color: isChecked ? '#15803d' : '#b91c1c' }]}>
                        {isChecked ? 'Accepted' : 'Out of Stock'}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </ScrollView>

            <TouchableOpacity
              onPress={handleConfirmAcceptance}
              style={[tw`w-full py-4 rounded-2xl items-center mt-2`, { backgroundColor: '#8fda58' }]}
            >
              <Text style={tw`text-[15px] font-black text-white`}>Confirm & Start Preparing</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Tab Navigator */}
      <View style={[tw`absolute bottom-4 inset-x-4 bg-[#1a3a2a] rounded-[24px] h-[64px] flex-row px-4 items-center justify-between shadow-lg`, { elevation: 12 }]}>
        <TouchableOpacity onPress={() => setActiveTab('dashboard')} style={tw`items-center justify-center flex-1`}>
          <Text style={{ color: activeTab === 'dashboard' ? '#8fda58' : '#ffffff' }}><IconDashboard /></Text>
          <Text style={[tw`text-[9px] font-extrabold mt-1`, { color: activeTab === 'dashboard' ? '#8fda58' : '#ffffff' }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('orders')} style={tw`items-center justify-center flex-1`}>
          <Text style={{ color: activeTab === 'orders' ? '#8fda58' : '#ffffff' }}><IconOrders /></Text>
          <Text style={[tw`text-[9px] font-extrabold mt-1`, { color: activeTab === 'orders' ? '#8fda58' : '#ffffff' }]}>Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('catalog')} style={tw`items-center justify-center flex-1`}>
          <Text style={{ color: activeTab === 'catalog' ? '#8fda58' : '#ffffff' }}><IconCatalog /></Text>
          <Text style={[tw`text-[9px] font-extrabold mt-1`, { color: activeTab === 'catalog' ? '#8fda58' : '#ffffff' }]}>Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('settings')} style={tw`items-center justify-center flex-1`}>
          <Text style={{ color: activeTab === 'settings' ? '#8fda58' : '#ffffff' }}><IconSettings /></Text>
          <Text style={[tw`text-[9px] font-extrabold mt-1`, { color: activeTab === 'settings' ? '#8fda58' : '#ffffff' }]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
