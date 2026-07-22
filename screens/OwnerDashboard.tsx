import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Switch, Dimensions } from 'react-native'
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
      <Polyline points="10 9 9 9 8 9" />
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

interface OwnerDashboardProps {
  user: any
  onSignOut: () => void
}

export default function OwnerDashboard({ user, onSignOut }: OwnerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'catalog' | 'settings'>('dashboard')
  const [storeOpen, setStoreOpen] = useState(true)

  // Catalog items state (Prepopulated with mock data)
  const [menuItems, setMenuItems] = useState([
    { id: '1', name: 'Spicy Paneer Burger', price: 120, desc: 'Crispy paneer patty with spicy cream', available: true, category: 'Food', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200' },
    { id: '2', name: 'Salted French Fries', price: 80, desc: 'Golden salted fries, crispy outside', available: true, category: 'Food', img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200' },
    { id: '3', name: 'Loaded Cheese Pizza', price: 180, desc: 'Double mozzarella cheese on fresh crust', available: false, category: 'Food', img: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=200' }
  ])

  // Orders state
  const [orders, setOrders] = useState([
    {
      id: 'ORD-8942',
      customerName: 'Aditya Sharma',
      location: 'Block A, Room 102',
      landmark: 'Near Reception',
      items: [{ name: 'Spicy Paneer Burger', quantity: 2, price: 120 }],
      total: 250,
      paymentMode: 'UPI on Delivery',
      status: 'incoming', // incoming, preparing, delivering, completed, cancelled
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
    setTimeout(() => setToast(null), 2000)
  }

  // Handle order actions
  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    showToast(`Order status updated to ${newStatus}!`)
  }

  // Handle adding new items
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

      {/* Header */}
      <View style={tw`bg-white border-b border-gray-100 px-4 pt-8 pb-4 flex-row justify-between items-center`}>
        <View>
          <Text style={[tw`text-[12px] font-black uppercase tracking-[2.5px]`, { color: '#8fda58' }]}>Partner Portal</Text>
          <Text style={tw`text-[20px] font-black text-gray-900`}>{user?.name || 'Campus Bites'}</Text>
        </View>
        <View style={tw`flex-row items-center gap-2 bg-gray-50 border border-gray-100 rounded-full px-3 py-1.5`}>
          <Text style={tw`text-[11px] font-bold text-gray-500`}>{storeOpen ? '🏪 Open' : '🔒 Closed'}</Text>
          <Switch value={storeOpen} onValueChange={setStoreOpen} thumbColor={storeOpen ? '#8fda58' : '#d1d5db'} trackColor={{ false: '#f3f4f6', true: '#dcfce7' }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={tw`pb-32`}>
        {/* ── 1. DASHBOARD / ANALYTICS TAB ─────────────────────────────────────── */}
        {activeTab === 'dashboard' && (
          <View style={tw`p-4 gap-4`}>
            {/* Stats Cards */}
            <View style={tw`flex-row flex-wrap gap-3`}>
              <View style={tw`flex-1 min-w-[45%] bg-white rounded-3xl p-4 border border-gray-100 shadow-sm`}>
                <Text style={tw`text-2xl`}>📈</Text>
                <Text style={tw`text-lg font-black text-gray-900 mt-2`}>₹12,450</Text>
                <Text style={tw`text-[11px] text-gray-400 font-bold uppercase tracking-wider`}>Today's Earnings</Text>
              </View>

              <View style={tw`flex-1 min-w-[45%] bg-white rounded-3xl p-4 border border-gray-100 shadow-sm`}>
                <Text style={tw`text-2xl`}>📋</Text>
                <Text style={tw`text-lg font-black text-gray-900 mt-2`}>{orders.length}</Text>
                <Text style={tw`text-[11px] text-gray-400 font-bold uppercase tracking-wider`}>Total Orders</Text>
              </View>

              <View style={tw`flex-1 min-w-[45%] bg-white rounded-3xl p-4 border border-gray-100 shadow-sm`}>
                <Text style={tw`text-2xl`}>⏳</Text>
                <Text style={tw`text-lg font-black text-gray-900 mt-2`}>{orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length}</Text>
                <Text style={tw`text-[11px] text-gray-400 font-bold uppercase tracking-wider`}>Active Orders</Text>
              </View>

              <View style={tw`flex-1 min-w-[45%] bg-white rounded-3xl p-4 border border-gray-100 shadow-sm`}>
                <Text style={tw`text-2xl`}>⭐️</Text>
                <Text style={tw`text-lg font-black text-gray-900 mt-2`}>4.8 / 5</Text>
                <Text style={tw`text-[11px] text-gray-400 font-bold uppercase tracking-wider`}>Outlet Rating</Text>
              </View>
            </View>

            {/* Sales Graph Placeholder (Styled using beautiful SVGs) */}
            <View style={tw`bg-white rounded-3xl p-5 border border-gray-100 shadow-sm`}>
              <Text style={tw`text-[13px] font-bold text-gray-700 mb-3`}>Weekly Order Velocity</Text>
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

        {/* ── 2. LIVE ORDERS TAB ─────────────────────────────────────────────── */}
        {activeTab === 'orders' && (
          <View style={tw`p-4 gap-4`}>
            {orders.map(order => (
              <View key={order.id} style={tw`bg-white rounded-3xl p-4 border border-gray-100 shadow-sm`}>
                <View style={tw`flex-row justify-between items-start border-b border-gray-50 pb-3`}>
                  <View>
                    <Text style={tw`text-[14px] font-black text-gray-800`}>{order.id}</Text>
                    <Text style={tw`text-[11px] text-gray-400 font-medium`}>{order.time}</Text>
                  </View>
                  <View style={[tw`px-2.5 py-1 rounded-full`, 
                    order.status === 'incoming' ? tw`bg-blue-50 text-blue-600` :
                    order.status === 'preparing' ? tw`bg-orange-50 text-orange-600` :
                    order.status === 'delivering' ? tw`bg-purple-50 text-purple-600` : tw`bg-green-50 text-green-600`
                  ]}>
                    <Text style={tw`text-[10px] font-black uppercase`}>{order.status}</Text>
                  </View>
                </View>

                {/* Customer Details */}
                <View style={tw`py-3 gap-1`}>
                  <Text style={tw`text-[13px] font-extrabold text-gray-900`}>{order.customerName}</Text>
                  <Text style={tw`text-[12px] text-gray-500 font-semibold`}>📍 {order.location} · {order.landmark}</Text>
                  <Text style={tw`text-[11px] text-gray-400 font-bold`}>💳 {order.paymentMode}</Text>
                </View>

                {/* Items */}
                <View style={tw`bg-gray-50 rounded-2xl p-3 mb-4`}>
                  {order.items.map((i, idx) => (
                    <View key={idx} style={tw`flex-row justify-between items-center`}>
                      <Text style={tw`text-[12px] font-bold text-gray-700`}>{i.name} x {i.quantity}</Text>
                      <Text style={tw`text-[12px] font-black text-gray-900`}>₹{i.price * i.quantity}</Text>
                    </View>
                  ))}
                  <View style={tw`border-t border-gray-200/55 pt-2 mt-2 flex-row justify-between`}>
                    <Text style={tw`text-[12px] font-black text-gray-900`}>Subtotal</Text>
                    <Text style={tw`text-[12px] font-black text-gray-900`}>₹{order.total}</Text>
                  </View>
                </View>

                {/* Merchant Status Transition Actions */}
                <View style={tw`flex-row gap-2`}>
                  {order.status === 'incoming' && (
                    <>
                      <TouchableOpacity
                        onPress={() => handleUpdateStatus(order.id, 'preparing')}
                        style={[tw`flex-1 py-3 rounded-xl items-center`, { backgroundColor: '#8fda58' }]}
                      >
                        <Text style={tw`text-[12px] font-black text-white`}>Accept & Prepare</Text>
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
                      <Text style={tw`text-[12px] font-black text-white`}>Mark Ready (Delivering)</Text>
                    </TouchableOpacity>
                  )}

                  {order.status === 'delivering' && (
                    <TouchableOpacity
                      onPress={() => handleUpdateStatus(order.id, 'completed')}
                      style={[tw`flex-1 py-3 rounded-xl items-center`, { backgroundColor: '#16a34a' }]}
                    >
                      <Text style={tw`text-[12px] font-black text-white`}>Complete Order</Text>
                    </TouchableOpacity>
                  )}

                  {order.status === 'completed' && (
                    <View style={tw`flex-1 py-2 items-center bg-gray-50 rounded-xl`}>
                      <Text style={tw`text-[12px] text-gray-400 font-bold`}>✓ Delivered successfully</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ── 3. CATALOG TAB ─────────────────────────────────────────────────── */}
        {activeTab === 'catalog' && (
          <View style={tw`p-4 gap-4`}>
            {/* Add New Product form */}
            <View style={tw`bg-white rounded-3xl p-5 border border-gray-100 shadow-sm`}>
              <Text style={tw`text-[14px] font-black text-gray-800 mb-3`}>Add New Item</Text>
              
              <View style={tw`gap-3`}>
                <View>
                  <Text style={tw`text-[10px] font-bold text-gray-400 uppercase mb-1`}>Item Name</Text>
                  <TextInput placeholder="e.g. Masala Chai" value={newItemName} onChangeText={setNewItemName} style={tw`bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-[12px] text-gray-800`} />
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
                  <Text style={tw`text-[10px] font-bold text-gray-400 uppercase mb-1`}>Short Description</Text>
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
            <Text style={tw`text-[14px] font-black text-gray-800 mt-2 px-1`}>Menu Catalog</Text>
            <View style={tw`gap-3`}>
              {menuItems.map(item => (
                <View key={item.id} style={tw`bg-white rounded-3xl p-3 border border-gray-100 shadow-sm flex-row items-center gap-3`}>
                  <Image source={{ uri: item.img }} style={tw`w-14 h-14 rounded-2xl`} />
                  <View style={tw`flex-1 min-w-0`}>
                    <Text style={tw`font-bold text-[13px] text-gray-900 truncate`}>{item.name}</Text>
                    <Text style={tw`text-[10px] text-gray-400 font-semibold`}>₹{item.price} · {item.category}</Text>
                  </View>
                  
                  {/* Availability toggle switch */}
                  <View style={tw`items-center`}>
                    <Text style={tw`text-[9px] font-bold text-gray-400 mb-0.5`}>{item.available ? 'Available' : 'Sold Out'}</Text>
                    <Switch value={item.available} onValueChange={() => toggleItemAvailability(item.id)} thumbColor={item.available ? '#8fda58' : '#d1d5db'} trackColor={{ false: '#f3f4f6', true: '#dcfce7' }} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── 4. SETTINGS TAB ────────────────────────────────────────────────── */}
        {activeTab === 'settings' && (
          <View style={tw`p-4 gap-4`}>
            <View style={tw`bg-white rounded-3xl p-5 border border-gray-100 shadow-sm gap-4`}>
              <Text style={tw`text-[14px] font-black text-gray-800 border-b border-gray-50 pb-2`}>Store Configurations</Text>

              <View>
                <Text style={tw`text-[10px] font-bold text-gray-400 uppercase mb-1`}>Merchant UPI ID</Text>
                <TextInput value={upiId} onChangeText={setUpiId} style={tw`bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-[12px] text-gray-800`} />
              </View>

              <View>
                <Text style={tw`text-[10px] font-bold text-gray-400 uppercase mb-1`}>Support Phone Number</Text>
                <TextInput value={contactPhone} onChangeText={setContactPhone} style={tw`bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-[12px] text-gray-800`} />
              </View>

              <TouchableOpacity
                onPress={() => showToast('Configurations saved!')}
                style={[tw`w-full py-3.5 rounded-xl items-center mt-2`, { backgroundColor: '#8fda58' }]}
              >
                <Text style={tw`text-[13px] font-black text-white`}>Save Settings</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={onSignOut}
              style={tw`w-full py-4 rounded-2xl items-center bg-red-50 mt-4`}
            >
              <Text style={tw`text-[14px] font-bold text-red-500`}>Log Out Partner Portal</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Merchant Bottom Tab Navigator */}
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
