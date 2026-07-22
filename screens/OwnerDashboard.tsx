import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Switch, Modal } from 'react-native'
import tw from 'twrnc'
import Svg, { Path, Rect, Circle, Line, Polyline } from 'react-native-svg'

function IconOrders() {
  return (
    <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <Polyline points="14 2 14 8 20 8" />
      <Line x1="16" y1="13" x2="8" y2="13" />
      <Line x1="16" y1="17" x2="8" y2="17" />
    </Svg>
  )
}

function IconMenu() {
  return (
    <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <Path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </Svg>
  )
}

function IconSettings() {
  return (
    <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <Circle cx="12" cy="12" r="3" />
      <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </Svg>
  )
}

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
  const [toast, setToast] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
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
    <View style={tw`flex-1 bg-gray-100`}>
      {toast && (
        <View style={tw`absolute top-4 left-4 right-4 z-50 bg-black rounded-2xl p-3 items-center shadow-lg`}>
          <Text style={tw`text-white font-bold text-xs`}>✨ {toast}</Text>
        </View>
      )}

      {/* Top Simple Header */}
      <View style={tw`bg-white px-4 pt-8 pb-3 border-b border-gray-200`}>
        <Text style={tw`text-[11px] font-black text-green-700 uppercase tracking-widest`}>
          {user?.role === 'worker' ? 'SHOP WORKER PORTAL' : 'SHOP OWNER DASHBOARD'}
        </Text>
        <Text style={tw`text-[22px] font-black text-gray-900 mt-0.5`}>{user?.name || 'Campus Bites'}</Text>

        {/* GIANT HIGH-CONTRAST ZOMATO-STYLE DAILY TOGGLE BUTTON */}
        <TouchableOpacity
          onPress={() => {
            const next = !isLiveToday
            setIsLiveToday(next)
            showToast(next ? 'Shop is OPEN for orders!' : 'Shop is CLOSED for today.')
          }}
          activeOpacity={0.8}
          style={[
            tw`mt-3 w-full py-4 rounded-2xl items-center justify-center shadow-md border-2`,
            {
              backgroundColor: isLiveToday ? '#16a34a' : '#dc2626',
              borderColor: isLiveToday ? '#15803d' : '#b91c1c'
            }
          ]}
        >
          <Text style={tw`text-white text-[16px] font-black tracking-wide text-center uppercase`}>
            {isLiveToday ? '🟢 SHOP IS OPEN FOR ORDERS (Tap to Close)' : '🔴 SHOP IS CLOSED FOR TODAY (Tap to Open)'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 2 Simple Summary Cards */}
      <View style={tw`flex-row px-4 pt-4 gap-3`}>
        <View style={[tw`flex-1 rounded-2xl p-4 border`, incomingCount > 0 ? tw`bg-red-50 border-red-200` : tw`bg-white border-gray-200`]}>
          <Text style={tw`text-[11px] font-black uppercase text-gray-500`}>New Orders Waiting</Text>
          <Text style={[tw`text-[28px] font-black mt-1`, incomingCount > 0 ? tw`text-red-600` : tw`text-gray-900`]}>{incomingCount}</Text>
        </View>

        <View style={tw`flex-1 bg-white rounded-2xl p-4 border border-gray-200`}>
          <Text style={tw`text-[11px] font-black uppercase text-gray-500`}>Today's Total Cash</Text>
          <Text style={tw`text-[28px] font-black text-gray-900 mt-1`}>₹{todayTotal}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={tw`p-4 pb-32`}>
        {/* ── 1. ORDERS TAB (Big Easy Buttons) ───────────────────────────── */}
        {activeTab === 'orders' && (
          <View style={tw`gap-4`}>
            <Text style={tw`text-[16px] font-black text-gray-900`}>Current Customer Orders ({orders.length})</Text>

            {orders.map(order => {
              const remainingStr = getRemainingTimeStr(order.expireTime)
              return (
                <View key={order.id} style={tw`bg-white rounded-3xl p-5 border-2 border-gray-200 shadow-sm gap-3`}>
                  {/* Order Top Line */}
                  <View style={tw`flex-row justify-between items-center border-b border-gray-100 pb-2.5`}>
                    <Text style={tw`text-[16px] font-black text-gray-900`}>{order.id}</Text>
                    <View style={[tw`px-3 py-1 rounded-full`, 
                      order.status === 'incoming' ? tw`bg-red-100` :
                      order.status === 'preparing' ? tw`bg-orange-100` :
                      order.status === 'delivering' ? tw`bg-purple-100` : tw`bg-green-100`
                    ]}>
                      <Text style={[tw`text-[11px] font-black uppercase`,
                        order.status === 'incoming' ? tw`text-red-700` :
                        order.status === 'preparing' ? tw`text-orange-700` :
                        order.status === 'delivering' ? tw`text-purple-700` : tw`text-green-700`
                      ]}>{order.status}</Text>
                    </View>
                  </View>

                  {/* 15m Accept Countdown Banner */}
                  {order.status === 'incoming' && (
                    <View style={tw`bg-red-50 border border-red-200 rounded-xl p-2.5 flex-row justify-between items-center`}>
                      <Text style={tw`text-[12px] font-black text-red-700`}>⏱️ Time left to Accept:</Text>
                      <Text style={tw`text-[16px] font-black text-red-700 font-mono`}>{remainingStr}</Text>
                    </View>
                  )}

                  {/* Customer Info */}
                  <View>
                    <Text style={tw`text-[16px] font-black text-gray-900`}>{order.customerName}</Text>
                    <Text style={tw`text-[13px] font-extrabold text-gray-700 mt-0.5`}>📍 {order.location} ({order.landmark})</Text>
                    <Text style={tw`text-[12px] font-bold text-gray-500 mt-0.5`}>💳 {order.paymentMode}</Text>
                  </View>

                  {/* Ordered Items List */}
                  <View style={tw`bg-gray-50 rounded-2xl p-3 gap-1.5 border border-gray-100`}>
                    {order.items.map((it: any, idx: number) => (
                      <View key={idx} style={tw`flex-row justify-between items-center`}>
                        <Text style={[tw`text-[13px] font-bold`, it.accepted !== false ? tw`text-gray-900` : tw`text-gray-400 line-through`]}>
                          {it.name} x {it.quantity}
                        </Text>
                        <Text style={tw`text-[13px] font-black text-gray-900`}>₹{it.price * it.quantity}</Text>
                      </View>
                    ))}
                    <View style={tw`border-t border-gray-200 pt-2 mt-1 flex-row justify-between`}>
                      <Text style={tw`text-[14px] font-black text-gray-900`}>Bill Total</Text>
                      <Text style={tw`text-[16px] font-black text-green-700`}>₹{order.total}</Text>
                    </View>
                  </View>

                  {/* GIANT ACTION BUTTONS */}
                  <View style={tw`gap-2 mt-1`}>
                    {order.status === 'incoming' && (
                      <>
                        <TouchableOpacity
                          onPress={() => handleOpenAcceptModal(order)}
                          style={tw`w-full py-4 bg-green-600 rounded-2xl items-center shadow-md`}
                        >
                          <Text style={tw`text-white font-black text-[15px] uppercase`}>✅ ACCEPT ORDER (₹{order.total})</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => handleUpdateStatus(order.id, 'cancelled')}
                          style={tw`w-full py-3 bg-red-100 rounded-2xl items-center`}
                        >
                          <Text style={tw`text-red-700 font-extrabold text-[13px]`}>❌ DECLINE ORDER</Text>
                        </TouchableOpacity>
                      </>
                    )}

                    {order.status === 'preparing' && (
                      <TouchableOpacity
                        onPress={() => handleUpdateStatus(order.id, 'delivering')}
                        style={tw`w-full py-4 bg-orange-500 rounded-2xl items-center shadow-md`}
                      >
                        <Text style={tw`text-white font-black text-[15px] uppercase`}>🛵 MARK READY FOR DELIVERY</Text>
                      </TouchableOpacity>
                    )}

                    {order.status === 'delivering' && (
                      <TouchableOpacity
                        onPress={() => handleUpdateStatus(order.id, 'completed')}
                        style={tw`w-full py-4 bg-green-700 rounded-2xl items-center shadow-md`}
                      >
                        <Text style={tw`text-white font-black text-[15px] uppercase`}>🎉 MARK ORDER DELIVERED</Text>
                      </TouchableOpacity>
                    )}

                    {order.status === 'completed' && (
                      <View style={tw`w-full py-3 bg-green-50 rounded-2xl items-center`}>
                        <Text style={tw`text-green-800 font-bold text-[13px]`}>✓ Order Completed</Text>
                      </View>
                    )}

                    {order.status === 'cancelled' && (
                      <View style={tw`w-full py-3 bg-red-50 rounded-2xl items-center`}>
                        <Text style={tw`text-red-700 font-bold text-[13px]`}>✕ Order Rejected</Text>
                      </View>
                    )}
                  </View>
                </View>
              )
            })}
          </View>
        )}

        {/* ── 2. FOOD MENU ITEMS TAB ───────────────────────────────────────── */}
        {activeTab === 'menu' && (
          <View style={tw`gap-4`}>
            {/* Simple Add Food Form */}
            <View style={tw`bg-white rounded-3xl p-5 border border-gray-200 gap-3`}>
              <Text style={tw`text-[16px] font-black text-gray-900`}>➕ Add New Food Item</Text>
              
              <TextInput
                placeholder="Food Item Name (e.g. Samosa)"
                value={newItemName}
                onChangeText={setNewItemName}
                style={tw`bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900`}
              />

              <TextInput
                placeholder="Price in ₹ (e.g. 20)"
                keyboardType="number-pad"
                value={newItemPrice}
                onChangeText={setNewItemPrice}
                style={tw`bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900`}
              />

              <TouchableOpacity
                onPress={handleAddItem}
                style={tw`w-full py-3.5 bg-green-600 rounded-xl items-center mt-1`}
              >
                <Text style={tw`text-white font-black text-[14px]`}>Save Food Item</Text>
              </TouchableOpacity>
            </View>

            {/* Menu List */}
            <Text style={tw`text-[16px] font-black text-gray-900 mt-2`}>Food Stock Status ({menuItems.length})</Text>
            <View style={tw`gap-3`}>
              {menuItems.map(item => (
                <View key={item.id} style={tw`bg-white rounded-2xl p-4 border border-gray-200 flex-row justify-between items-center`}>
                  <View>
                    <Text style={tw`text-[15px] font-black text-gray-900`}>{item.name}</Text>
                    <Text style={tw`text-[13px] font-bold text-green-700 mt-0.5`}>₹{item.price}</Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => setMenuItems(prev => prev.map(i => i.id === item.id ? { ...i, available: !i.available } : i))}
                    style={[tw`px-4 py-2 rounded-xl border-2`, item.available ? tw`bg-green-50 border-green-600` : tw`bg-red-50 border-red-600`]}
                  >
                    <Text style={[tw`text-[12px] font-black uppercase`, item.available ? tw`text-green-700` : tw`text-red-700`]}>
                      {item.available ? '🟢 IN STOCK' : '🔴 SOLD OUT'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── 3. SETTINGS & WORKERS TAB ────────────────────────────────────── */}
        {activeTab === 'settings' && (
          <View style={tw`gap-4`}>
            {/* Worker Staff Access */}
            <View style={tw`bg-white rounded-3xl p-5 border border-gray-200 gap-3`}>
              <Text style={tw`text-[16px] font-black text-gray-900`}>👥 Add Shop Worker Staff</Text>
              <Text style={tw`text-[12px] text-gray-500 font-medium`}>Give staff access to accept orders on their phones.</Text>

              <TextInput
                placeholder="Worker Name (e.g. Ramesh)"
                value={newWorkerName}
                onChangeText={setNewWorkerName}
                style={tw`bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900`}
              />

              <TextInput
                placeholder="Worker Mobile Number (+91 98765 00000)"
                keyboardType="phone-pad"
                value={newWorkerPhone}
                onChangeText={setNewWorkerPhone}
                style={tw`bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900`}
              />

              <TouchableOpacity
                onPress={handleAddWorker}
                style={tw`w-full py-3.5 bg-green-600 rounded-xl items-center mt-1`}
              >
                <Text style={tw`text-white font-black text-[14px]`}>Add Worker</Text>
              </TouchableOpacity>

              {/* Workers List */}
              <Text style={tw`text-[12px] font-black text-gray-500 uppercase mt-2`}>Added Workers ({workers.length})</Text>
              {workers.map(w => (
                <View key={w.id} style={tw`flex-row justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-200`}>
                  <View>
                    <Text style={tw`text-[14px] font-bold text-gray-900`}>{w.name}</Text>
                    <Text style={tw`text-[12px] text-gray-500`}>{w.phone}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setWorkers(prev => prev.filter(x => x.id !== w.id))} style={tw`bg-red-100 px-3 py-1.5 rounded-lg`}>
                    <Text style={tw`text-red-700 font-bold text-[11px]`}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <TouchableOpacity onPress={onSignOut} style={tw`w-full py-4 bg-red-100 rounded-2xl items-center mt-2`}>
              <Text style={tw`text-red-700 font-black text-[15px]`}>Log Out</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Partial Acceptance Item Checklist Modal */}
      <Modal visible={!!partialOrder} transparent animationType="slide" onRequestClose={() => setPartialOrder(null)}>
        <View style={tw`flex-1 justify-end bg-black/60`}>
          <View style={tw`bg-white rounded-t-3xl p-6 gap-4`}>
            <Text style={tw`text-[18px] font-black text-gray-900`}>Uncheck items that are out of stock:</Text>
            
            {partialOrder?.items.map((item: any, idx: number) => {
              const itemKey = item.id || idx
              const isChecked = !!checkedItems[itemKey]
              return (
                <TouchableOpacity
                  key={itemKey}
                  onPress={() => setCheckedItems(prev => ({ ...prev, [itemKey]: !isChecked }))}
                  style={[tw`flex-row justify-between items-center p-4 rounded-2xl border-2`, isChecked ? tw`bg-green-50 border-green-600` : tw`bg-red-50 border-red-600`]}
                >
                  <Text style={tw`text-[15px] font-black text-gray-900`}>{item.name} x {item.quantity}</Text>
                  <Text style={[tw`text-[13px] font-black uppercase`, isChecked ? tw`text-green-700` : tw`text-red-700`]}>
                    {isChecked ? '✓ YES (IN STOCK)' : '✕ NO (SOLD OUT)'}
                  </Text>
                </TouchableOpacity>
              )
            })}

            <TouchableOpacity
              onPress={handleConfirmAcceptance}
              style={tw`w-full py-4 bg-green-600 rounded-2xl items-center mt-2 shadow-md`}
            >
              <Text style={tw`text-white font-black text-[16px] uppercase`}>CONFIRM ACCEPTANCE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Simple 3-Tab Bottom Bar */}
      <View style={tw`absolute bottom-0 inset-x-0 bg-white border-t border-gray-300 flex-row h-16 items-center justify-around px-2`}>
        <TouchableOpacity onPress={() => setActiveTab('orders')} style={tw`items-center flex-1`}>
          <Text style={{ color: activeTab === 'orders' ? '#16a34a' : '#6b7280' }}><IconOrders /></Text>
          <Text style={[tw`text-[11px] font-black mt-0.5`, { color: activeTab === 'orders' ? '#16a34a' : '#6b7280' }]}>Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('menu')} style={tw`items-center flex-1`}>
          <Text style={{ color: activeTab === 'menu' ? '#16a34a' : '#6b7280' }}><IconMenu /></Text>
          <Text style={[tw`text-[11px] font-black mt-0.5`, { color: activeTab === 'menu' ? '#16a34a' : '#6b7280' }]}>Food Stock</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('settings')} style={tw`items-center flex-1`}>
          <Text style={{ color: activeTab === 'settings' ? '#16a34a' : '#6b7280' }}><IconSettings /></Text>
          <Text style={[tw`text-[11px] font-black mt-0.5`, { color: activeTab === 'settings' ? '#16a34a' : '#6b7280' }]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
