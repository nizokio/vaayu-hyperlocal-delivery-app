import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Modal, Vibration, Alert } from 'react-native'
import tw from 'twrnc'
import Svg, { Path, Rect, Circle, Line, Polyline } from 'react-native-svg'


// Language Translations Dictionary for Low-Literacy Shop Owners
const i18n: Record<string, Record<string, string>> = {
  en: {
    orders: "Orders",
    menu: "Food Stock",
    settings: "Settings",
    shopOpen: "🟢 SHOP IS OPEN FOR ORDERS",
    shopClosed: "🔴 SHOP IS CLOSED FOR TODAY",
    tapToClose: "(Tap to Close)",
    tapToOpen: "(Tap to Open)",
    newWaiting: "NEW ORDERS WAITING",
    todayCash: "TODAY'S CASH",
    accept: "✅ ACCEPT ORDER",
    decline: "❌ DECLINE",
    markReady: "🛵 MARK READY (DISPATCH)",
    markDelivered: "🎉 MARK DELIVERED",
    completed: "✓ DELIVERED",
    rejected: "✕ REJECTED",
    inStock: "🟢 IN STOCK",
    soldOut: "🔴 SOLD OUT",
    addFood: "➕ ADD NEW FOOD ITEM",
    photoButton: "📷 TAP TO UPLOAD FOOD PHOTO",
    saveFood: "SAVE FOOD ITEM",
    namePlaceholder: "Food Name (e.g. Samosa)",
    pricePlaceholder: "Price in ₹ (e.g. 20)",
    addWorker: "👥 ADD SHOP WORKER STAFF",
    workerHelp: "Add helper phone numbers to grant them access to this app.",
    workerName: "Worker Name (e.g. Ramesh)",
    workerPhone: "Worker Mobile Number (+91 98765 00000)",
    saveWorker: "ADD WORKER",
    logout: "LOG OUT PARTNER PORTAL",
    language: "🌐 SELECT APP LANGUAGE",
    timeLeft: "TIME LEFT TO ACCEPT",
    scheduled: "🟢 SCHEDULED ORDER",
    instant: "⚡ INSTANT DELIVERY",
  },
  hi: {
    orders: "आर्डर",
    menu: "खाना स्टॉक",
    settings: "सेटिंग्स",
    shopOpen: "🟢 दुकान चालू है (आर्डर आ रहे हैं)",
    shopClosed: "🔴 दुकान आज बंद है",
    tapToClose: "(बंद करने के लिए दबाएं)",
    tapToOpen: "(चालू करने के लिए दबाएं)",
    newWaiting: "नए आर्डर प्रतिक्षा में",
    todayCash: "आज की कुल बिक्री",
    accept: "✅ स्वीकार करें (स्वीकार)",
    decline: "❌ मना करें",
    markReady: "🛵 तैयार है (रवाना करें)",
    markDelivered: "🎉 डिलिवर हो गया",
    completed: "✓ पूर्ण हुआ",
    rejected: "✕ आर्डर रद्द",
    inStock: "🟢 उपलब्ध है",
    soldOut: "🔴 खत्म हो गया",
    addFood: "➕ नया खाना जोड़ें",
    photoButton: "📷 फोटो जोड़ने के लिए दबाएं",
    saveFood: "खाना सेव करें",
    namePlaceholder: "खाने का नाम (जैसे समोसा)",
    pricePlaceholder: "कीमत ₹ (जैसे 20)",
    addWorker: "👥 हेल्पर / वर्कर जोड़ें",
    workerHelp: "अपने हेल्पर का मोबाइल नंबर जोड़ें ताकि वे आर्डर ले सकें।",
    workerName: "वर्कर का नाम (जैसे रमेश)",
    workerPhone: "वर्कर मोबाइल नंबर (+91 98765 00000)",
    saveWorker: "वर्कर जोड़ें",
    logout: "लॉग आउट करें",
    language: "🌐 भाषा चुनें / SELECT LANGUAGE",
    timeLeft: "स्वीकार करने का समय",
    scheduled: "🟢 निर्धारित आर्डर",
    instant: "⚡ तुरंत डिलिवरी",
  },
  ta: {
    orders: "ஆர்டர்கள்",
    menu: "உணவு இருப்பு",
    settings: "அமைப்புகள்",
    shopOpen: "🟢 கடை திறக்கப்பட்டுள்ளது",
    shopClosed: "🔴 கடை இன்று மூடப்பட்டுள்ளது",
    tapToClose: "(மூட தட்டவும்)",
    tapToOpen: "(திறக்க தட்டவும்)",
    newWaiting: "புதிய ஆர்டர்கள்",
    todayCash: "இன்றைய விற்பனை",
    accept: "✅ ஏற்றுக்கொள்",
    decline: "❌ நிராகரி",
    markReady: "🛵 தயார் (அனுப்பு)",
    markDelivered: "🎉 டெலிவரி செய்யப்பட்டது",
    completed: "✓ முடிந்தது",
    rejected: "✕ நிராகரிக்கப்பட்டது",
    inStock: "🟢 இருப்பில் உள்ளது",
    soldOut: "🔴 முடிந்தது",
    addFood: "➕ புதிய உணவு சேர்க்க",
    photoButton: "📷 படம் சேர்க்க தட்டவும்",
    saveFood: "சேமிக்க",
    namePlaceholder: "உணவு பெயர் (எ.கா சமோசா)",
    pricePlaceholder: "விலை ₹ (எ.கா 20)",
    addWorker: "👥 பணியாளரைச் சேர்க்க",
    workerHelp: "பணியாளர் மொபைல் எண்ணைச் சேர்க்கவும்.",
    workerName: "பணியாளர் பெயர்",
    workerPhone: "மொபைல் எண் (+91 98765 00000)",
    saveWorker: "சேர்க்க",
    logout: "வெளியேறு",
    language: "🌐 மொழியைத் தேர்ந்தெடுக்கவும்",
    timeLeft: "ஏற்றுக்கொள்ள நேரம்",
    scheduled: "🟢 திட்டமிடப்பட்ட ஆர்டர்",
    instant: "⚡ உடனடி டெலிவரி",
  }
}

function IconOrders({ active }: { active: boolean }) {
  const c = active ? "#ffffff" : "#6b7280"
  return (
    <Svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5">
      <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <Polyline points="14 2 14 8 20 8" />
      <Line x1="16" y1="13" x2="8" y2="13" />
      <Line x1="16" y1="17" x2="8" y2="17" />
    </Svg>
  )
}

function IconMenu({ active }: { active: boolean }) {
  const c = active ? "#ffffff" : "#6b7280"
  return (
    <Svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5">
      <Path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </Svg>
  )
}

function IconSettings({ active }: { active: boolean }) {
  const c = active ? "#ffffff" : "#6b7280"
  return (
    <Svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5">
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
  const [lang, setLang] = useState<'en' | 'hi' | 'ta'>('en')

  const t = i18n[lang] || i18n['en']

  // Trigger haptic vibration feedback helper
  const triggerHaptic = () => {
    try {
      Vibration.vibrate(80)
    } catch {
      // Fallback
    }
  }

  // Workers List
  const [workers, setWorkers] = useState([
    { id: 'w1', name: 'Suresh (Kitchen)', phone: '+91 98765 11223' },
  ])
  const [newWorkerName, setNewWorkerName] = useState('')
  const [newWorkerPhone, setNewWorkerPhone] = useState('')

  // Food Menu Items with Photos
  const [menuItems, setMenuItems] = useState([
    { id: '1', name: 'Spicy Paneer Burger', price: 120, available: true, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200' },
    { id: '2', name: 'Salted French Fries', price: 80, available: true, img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200' },
    { id: '3', name: 'Loaded Cheese Pizza', price: 180, available: false, img: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=200' }
  ])

  // Simple Item Add Form with Photo Upload
  const [newItemName, setNewItemName] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('')
  const [newItemImg, setNewItemImg] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200')

  // Orders State with 15m countdown
  const [orders, setOrders] = useState([
    {
      id: 'ORD-8942',
      customerName: 'Aditya Sharma',
      location: 'Block A, Room 102',
      landmark: 'Near Reception',
      deliveryMode: 'instant',
      items: [
        { id: 'cb_1', name: 'Spicy Paneer Burger', quantity: 2, price: 120, accepted: true },
        { id: 'cb_2', name: 'Salted French Fries', quantity: 1, price: 80, accepted: true }
      ],
      total: 320,
      paymentMode: 'cod', // cod = 💵, upi = 📱
      status: 'incoming',
      expireTime: Date.now() + 12 * 60 * 1000,
      totalDuration: 15 * 60 * 1000
    },
    {
      id: 'ORD-7210',
      customerName: 'Rohan Mehta',
      location: 'Block C, Room 305',
      landmark: 'Lift area',
      deliveryMode: 'regular',
      selectedSlotLabel: '12:00 PM – 2:00 PM',
      items: [
        { id: 'cb_2', name: 'Salted French Fries', quantity: 1, price: 80, accepted: true }
      ],
      total: 80,
      paymentMode: 'upi',
      status: 'preparing',
      expireTime: Date.now() - 5 * 60 * 1000,
      totalDuration: 15 * 60 * 1000
    }
  ])

  // Live timer tick
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Auto-reject on 15m timeout & haptic trigger on new incoming order
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
    triggerHaptic()
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  // Format 15m countdown mm:ss and progress percentage
  const getTimerDetails = (expireTime: number, totalDuration: number = 15 * 60 * 1000) => {
    const diff = Math.max(0, Math.floor((expireTime - now) / 1000))
    const totalSecs = Math.floor(totalDuration / 1000)
    const ratio = diff / totalSecs
    const mins = Math.floor(diff / 60)
    const secs = diff % 60
    const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`

    // Color shifting: Green (> 10m) -> Orange (5-10m) -> Red (< 5m)
    let colorClass = 'bg-green-500'
    let textClass = 'text-green-700'
    let bgClass = 'bg-green-50'
    let borderClass = 'border-green-200'

    if (mins < 5) {
      colorClass = 'bg-red-500'
      textClass = 'text-red-700'
      bgClass = 'bg-red-50'
      borderClass = 'border-red-200'
    } else if (mins < 10) {
      colorClass = 'bg-orange-500'
      textClass = 'text-orange-700'
      bgClass = 'bg-orange-50'
      borderClass = 'border-orange-200'
    }

    return { timeStr, ratio, colorClass, textClass, bgClass, borderClass }
  }

  // Partial Accept Modal
  const [partialOrder, setPartialOrder] = useState<any>(null)
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({})

  const handleOpenAcceptModal = (order: any) => {
    triggerHaptic()
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
      showToast('Select at least 1 item')
      return
    }

    const newTotal = updatedItems
      .filter((i: any) => i.accepted)
      .reduce((sum: number, i: any) => sum + i.price * i.quantity, 0)

    setOrders(prev => prev.map(o => o.id === partialOrder.id ? { ...o, items: updatedItems, total: newTotal, status: 'preparing' } : o))
    showToast(t.accept)
    setPartialOrder(null)
  }

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    triggerHaptic()
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    showToast('Updated!')
  }

  const handleAddWorker = () => {
    if (!newWorkerName || !newWorkerPhone) {
      showToast('Enter worker info')
      return
    }
    setWorkers(prev => [...prev, { id: `w_${Date.now()}`, name: newWorkerName, phone: newWorkerPhone }])
    setNewWorkerName('')
    setNewWorkerPhone('')
    showToast('Worker Added!')
  }

  const handleAddItem = () => {
    if (!newItemName || !newItemPrice) {
      showToast('Enter food name & price')
      return
    }
    setMenuItems(prev => [{ id: `i_${Date.now()}`, name: newItemName, price: parseFloat(newItemPrice) || 0, available: true, img: newItemImg }, ...prev])
    setNewItemName('')
    setNewItemPrice('')
    showToast('Food Added!')
  }

  const incomingCount = orders.filter(o => o.status === 'incoming').length
  const todayTotal = orders.filter(o => o.status === 'completed' || o.status === 'delivering' || o.status === 'preparing').reduce((s, o) => s + o.total, 0)

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      {toast && (
        <View style={tw`absolute top-4 left-4 right-4 z-50 bg-black rounded-2xl p-4 items-center shadow-xl`}>
          <Text style={tw`text-white font-black text-sm text-center`}>✨ {toast}</Text>
        </View>
      )}

      {/* Top Header with Quick Language Selector */}
      <View style={tw`bg-white px-4 pt-8 pb-3 border-b border-gray-200`}>
        <View style={tw`flex-row justify-between items-center mb-1`}>
          <View>
            <Text style={tw`text-[12px] font-black text-green-700 uppercase tracking-widest`}>
              {user?.role === 'worker' ? 'WORKER PORTAL' : 'SHOP OWNER'}
            </Text>
            <Text style={tw`text-[24px] font-black text-gray-900`}>{user?.name || 'Campus Bites'}</Text>
          </View>

          {/* Quick Language Toggle */}
          <View style={tw`flex-row gap-1 bg-gray-100 p-1 rounded-xl`}>
            {(['en', 'hi', 'ta'] as const).map((l) => (
              <TouchableOpacity
                key={l}
                onPress={() => {
                  setLang(l)
                  triggerHaptic()
                }}
                style={[tw`px-2.5 py-1 rounded-lg`, lang === l ? tw`bg-green-700` : tw`bg-transparent`]}
              >
                <Text style={[tw`text-[11px] font-black uppercase`, lang === l ? tw`text-white` : tw`text-gray-600`]}>
                  {l === 'en' ? 'EN' : l === 'hi' ? 'हिंदी' : 'தமி'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* GIANT ZOMATO-STYLE DAILY TOGGLE BUTTON (56px+ height) */}
        <TouchableOpacity
          onPress={() => {
            const next = !isLiveToday
            setIsLiveToday(next)
            showToast(next ? t.shopOpen : t.shopClosed)
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
          <Text style={tw`text-white text-[17px] font-black tracking-wide text-center uppercase`}>
            {isLiveToday ? `${t.shopOpen} ${t.tapToClose}` : `${t.shopClosed} ${t.tapToOpen}`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 2 Simple Large Summary Cards (+20% font size) */}
      <View style={tw`flex-row px-4 pt-4 gap-3`}>
        <View style={[tw`flex-1 rounded-2xl p-4 border`, incomingCount > 0 ? tw`bg-red-50 border-red-300` : tw`bg-white border-gray-200`]}>
          <Text style={tw`text-[12px] font-black uppercase text-gray-500`}>{t.newWaiting}</Text>
          <Text style={[tw`text-[32px] font-black mt-0.5`, incomingCount > 0 ? tw`text-red-600` : tw`text-gray-900`]}>{incomingCount}</Text>
        </View>

        <View style={tw`flex-1 bg-white rounded-2xl p-4 border border-gray-200`}>
          <Text style={tw`text-[12px] font-black uppercase text-gray-500`}>{t.todayCash}</Text>
          <Text style={tw`text-[32px] font-black text-gray-900 mt-0.5`}>₹{todayTotal}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={tw`p-4 pb-36`}>
        {/* ── 1. ORDERS TAB (Low Literacy Redesign) ────────────────────────── */}
        {activeTab === 'orders' && (
          <View style={tw`gap-4`}>
            <Text style={tw`text-[18px] font-black text-gray-900`}>{t.orders} ({orders.length})</Text>

            {orders.map(order => {
              const timer = getTimerDetails(order.expireTime, order.totalDuration)

              return (
                <View key={order.id} style={tw`bg-white rounded-3xl p-5 border-2 border-gray-300 shadow-md gap-3`}>
                  {/* GIANT Order ID & Delivery Room (Focal Point) */}
                  <View style={tw`flex-row justify-between items-start border-b border-gray-100 pb-3`}>
                    <View style={tw`flex-1 mr-2`}>
                      <Text style={tw`text-[28px] font-black text-gray-900 leading-none`}>{order.id}</Text>
                      <Text style={tw`text-[20px] font-black text-green-700 mt-1`}>📍 {order.location}</Text>
                    </View>

                    {/* Payment Icon Only (💵 for COD, 📱 for UPI) + Status */}
                    <View style={tw`items-end gap-1.5`}>
                      <View style={tw`bg-gray-100 px-3 py-1.5 rounded-full`}>
                        <Text style={tw`text-2xl`}>{order.paymentMode === 'cod' ? '💵' : '📱'}</Text>
                      </View>
                      <View style={[tw`px-3 py-1 rounded-full`, 
                        order.status === 'incoming' ? tw`bg-red-100` :
                        order.status === 'preparing' ? tw`bg-orange-100` :
                        order.status === 'delivering' ? tw`bg-purple-100` : tw`bg-green-100`
                      ]}>
                        <Text style={[tw`text-[12px] font-black uppercase`,
                          order.status === 'incoming' ? tw`text-red-700` :
                          order.status === 'preparing' ? tw`text-orange-700` :
                          order.status === 'delivering' ? tw`text-purple-700` : tw`text-green-700`
                        ]}>
                          {order.status === 'incoming' ? '📥 NEW' :
                           order.status === 'preparing' ? '🍳 COOK' :
                           order.status === 'delivering' ? '🛵 ROAD' : '✅ DONE'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* VISUAL COLOR-SHIFTING PROGRESS TIMER BAR (Green -> Orange -> Red) */}
                  {order.status === 'incoming' && (
                    <View style={[tw`rounded-2xl p-3 border flex-col gap-1.5`, tw`${timer.bgClass} ${timer.borderClass}`]}>
                      <View style={tw`flex-row justify-between items-center`}>
                        <Text style={[tw`text-[13px] font-black`, tw`${timer.textClass}`]}>⏱️ {t.timeLeft}:</Text>
                        <Text style={[tw`text-[18px] font-black font-mono`, tw`${timer.textClass}`]}>{timer.timeStr}</Text>
                      </View>
                      {/* Visual progress bar fill */}
                      <View style={tw`w-full h-3.5 bg-gray-200 rounded-full overflow-hidden`}>
                        <View style={[tw`h-full rounded-full`, tw`${timer.colorClass}`, { width: `${Math.max(5, Math.min(100, timer.ratio * 100))}%` }]} />
                      </View>
                    </View>
                  )}

                  {/* Delivery Mode Badge: Scheduled (GREEN) vs Instant (BLUE) */}
                  {order.deliveryMode === 'regular' || order.selectedSlotLabel ? (
                    <View style={tw`bg-green-50 border border-green-200 rounded-xl px-3 py-2 flex-row items-center justify-between`}>
                      <Text style={tw`text-[12px] font-black text-green-700 uppercase`}>{t.scheduled}</Text>
                      <Text style={tw`text-[13px] font-bold text-green-800`}>
                        <Text style={tw`font-black text-green-900`}>{order.selectedSlotLabel || '12:00 PM – 2:00 PM'}</Text>
                      </Text>
                    </View>
                  ) : (
                    <View style={tw`bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 flex-row items-center justify-between`}>
                      <Text style={tw`text-[12px] font-black text-blue-700 uppercase`}>{t.instant}</Text>
                      <Text style={tw`text-[13px] font-bold text-blue-800`}>
                        <Text style={tw`font-black text-blue-900`}>Within 15 Mins</Text>
                      </Text>
                    </View>
                  )}

                  {/* Items List */}
                  <View style={tw`bg-gray-50 rounded-2xl p-3 gap-2 border border-gray-200`}>
                    {order.items.map((it: any, idx: number) => (
                      <View key={idx} style={tw`flex-row justify-between items-center`}>
                        <Text style={[tw`text-[15px] font-black`, it.accepted !== false ? tw`text-gray-900` : tw`text-gray-400 line-through`]}>
                          {it.name} x {it.quantity}
                        </Text>
                        <Text style={tw`text-[15px] font-black text-gray-900`}>₹{it.price * it.quantity}</Text>
                      </View>
                    ))}
                    <View style={tw`border-t border-gray-300 pt-2 mt-1 flex-row justify-between items-center`}>
                      <Text style={tw`text-[16px] font-black text-gray-900`}>TOTAL</Text>
                      <Text style={tw`text-[20px] font-black text-green-700`}>₹{order.total}</Text>
                    </View>
                  </View>

                  {/* 30% TALLER ACTION BUTTONS (Minimum 56px height for easy tapping) */}
                  <View style={tw`gap-2.5 mt-1`}>
                    {order.status === 'incoming' && (
                      <>
                        <TouchableOpacity
                          onPress={() => handleOpenAcceptModal(order)}
                          style={tw`w-full h-14 bg-green-600 rounded-2xl items-center justify-center shadow-lg active:scale-95`}
                        >
                          <Text style={tw`text-white font-black text-[17px] uppercase`}>{t.accept} (₹{order.total})</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => handleUpdateStatus(order.id, 'cancelled')}
                          style={tw`w-full h-12 bg-red-100 rounded-2xl items-center justify-center active:scale-95`}
                        >
                          <Text style={tw`text-red-700 font-black text-[14px]`}>{t.decline}</Text>
                        </TouchableOpacity>
                      </>
                    )}

                    {order.status === 'preparing' && (
                      <TouchableOpacity
                        onPress={() => handleUpdateStatus(order.id, 'delivering')}
                        style={tw`w-full h-14 bg-orange-500 rounded-2xl items-center justify-center shadow-lg active:scale-95`}
                      >
                        <Text style={tw`text-white font-black text-[17px] uppercase`}>{t.markReady}</Text>
                      </TouchableOpacity>
                    )}

                    {order.status === 'delivering' && (
                      <TouchableOpacity
                        onPress={() => handleUpdateStatus(order.id, 'completed')}
                        style={tw`w-full h-14 bg-green-700 rounded-2xl items-center justify-center shadow-lg active:scale-95`}
                      >
                        <Text style={tw`text-white font-black text-[17px] uppercase`}>{t.markDelivered}</Text>
                      </TouchableOpacity>
                    )}

                    {order.status === 'completed' && (
                      <View style={tw`w-full py-3 bg-green-50 rounded-2xl items-center`}>
                        <Text style={tw`text-green-800 font-black text-[14px]`}>{t.completed}</Text>
                      </View>
                    )}

                    {order.status === 'cancelled' && (
                      <View style={tw`w-full py-3 bg-red-50 rounded-2xl items-center`}>
                        <Text style={tw`text-red-700 font-black text-[14px]`}>{t.rejected}</Text>
                      </View>
                    )}
                  </View>
                </View>
              )
            })}
          </View>
        )}

        {/* ── 2. FOOD STOCK SCREEN (Photos & Giant Single-Tap Switches) ─────── */}
        {activeTab === 'menu' && (
          <View style={tw`gap-4`}>
            {/* Camera-First Prominent Add Food Form */}
            <View style={tw`bg-white rounded-3xl p-5 border-2 border-gray-300 gap-4 shadow-sm`}>
              <Text style={tw`text-[18px] font-black text-gray-900`}>{t.addFood}</Text>
              
              {/* Prominent Photo Picker Button First */}
              <TouchableOpacity
                onPress={() => showToast("Photo attached!")}
                style={tw`w-full h-24 bg-green-50 border-2 border-dashed border-green-500 rounded-2xl items-center justify-center gap-1 active:scale-95`}
              >
                <Text style={tw`text-3xl`}>📷</Text>
                <Text style={tw`text-green-800 font-black text-[13px]`}>{t.photoButton}</Text>
              </TouchableOpacity>

              <TextInput
                placeholder={t.namePlaceholder}
                value={newItemName}
                onChangeText={setNewItemName}
                style={tw`bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14 text-[16px] font-bold text-gray-900`}
              />

              <TextInput
                placeholder={t.pricePlaceholder}
                keyboardType="number-pad"
                value={newItemPrice}
                onChangeText={setNewItemPrice}
                style={tw`bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14 text-[16px] font-bold text-gray-900`}
              />

              <TouchableOpacity
                onPress={handleAddItem}
                style={tw`w-full h-14 bg-green-600 rounded-2xl items-center justify-center shadow-md active:scale-95`}
              >
                <Text style={tw`text-white font-black text-[16px]`}>{t.saveFood}</Text>
              </TouchableOpacity>
            </View>

            {/* Food Stock List with Thumbnails & Giant Stock Switch */}
            <Text style={tw`text-[18px] font-black text-gray-900 mt-2`}>{t.menu} ({menuItems.length})</Text>
            <View style={tw`gap-3`}>
              {menuItems.map(item => (
                <View key={item.id} style={tw`bg-white rounded-2xl p-4 border-2 border-gray-200 flex-row justify-between items-center gap-3 shadow-xs`}>
                  {/* Photo Thumbnail */}
                  <Image source={{ uri: item.img }} style={tw`w-16 h-16 rounded-xl`} resizeMode="cover" />

                  <View style={tw`flex-1 min-w-0`}>
                    <Text style={tw`text-[16px] font-black text-gray-900`}>{item.name}</Text>
                    <Text style={tw`text-[15px] font-black text-green-700 mt-0.5`}>₹{item.price}</Text>
                  </View>

                  {/* GIANT SINGLE-TAP STOCK SWITCH (Green = IN, Red = OUT) */}
                  <TouchableOpacity
                    onPress={() => {
                      triggerHaptic()
                      setMenuItems(prev => prev.map(i => i.id === item.id ? { ...i, available: !i.available } : i))
                    }}
                    activeOpacity={0.8}
                    style={[
                      tw`px-5 h-12 rounded-2xl items-center justify-center border-2 shadow-sm`,
                      item.available ? tw`bg-green-600 border-green-700` : tw`bg-red-600 border-red-700`
                    ]}
                  >
                    <Text style={tw`text-white font-black text-[14px] uppercase`}>
                      {item.available ? t.inStock : t.soldOut}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── 3. SETTINGS & LANGUAGE TOGGLE ────────────────────────────────── */}
        {activeTab === 'settings' && (
          <View style={tw`gap-4`}>
            {/* Language Selector Box */}
            <View style={tw`bg-white rounded-3xl p-5 border-2 border-gray-300 gap-3 shadow-sm`}>
              <Text style={tw`text-[16px] font-black text-gray-900`}>{t.language}</Text>
              
              <View style={tw`gap-2`}>
                {[
                  { code: 'en', name: 'English' },
                  { code: 'hi', name: 'हिन्दी (Hindi)' },
                  { code: 'ta', name: 'தமிழ் (Tamil)' },
                ].map(l => (
                  <TouchableOpacity
                    key={l.code}
                    onPress={() => {
                      setLang(l.code as any)
                      showToast(`Language set to ${l.name}`)
                    }}
                    style={[
                      tw`w-full h-14 rounded-2xl border-2 flex-row items-center px-4 justify-between`,
                      lang === l.code ? tw`bg-green-50 border-green-600` : tw`bg-gray-50 border-gray-200`
                    ]}
                  >
                    <Text style={[tw`text-[16px] font-black`, lang === l.code ? tw`text-green-800` : tw`text-gray-800`]}>{l.name}</Text>
                    {lang === l.code && <Text style={tw`text-green-700 font-black text-lg`}>✓</Text>}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Worker Staff Access */}
            <View style={tw`bg-white rounded-3xl p-5 border-2 border-gray-300 gap-3 shadow-sm`}>
              <Text style={tw`text-[16px] font-black text-gray-900`}>{t.addWorker}</Text>
              <Text style={tw`text-[13px] text-gray-500 font-medium`}>{t.workerHelp}</Text>

              <TextInput
                placeholder={t.workerName}
                value={newWorkerName}
                onChangeText={setNewWorkerName}
                style={tw`bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14 text-[16px] font-bold text-gray-900`}
              />

              <TextInput
                placeholder={t.workerPhone}
                keyboardType="phone-pad"
                value={newWorkerPhone}
                onChangeText={setNewWorkerPhone}
                style={tw`bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14 text-[16px] font-bold text-gray-900`}
              />

              <TouchableOpacity
                onPress={handleAddWorker}
                style={tw`w-full h-14 bg-green-600 rounded-2xl items-center justify-center mt-1 shadow-md`}
              >
                <Text style={tw`text-white font-black text-[16px]`}>{t.saveWorker}</Text>
              </TouchableOpacity>

              {workers.map(w => (
                <View key={w.id} style={tw`flex-row justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs`}>
                  <View>
                    <Text style={tw`font-bold text-gray-900 text-[14px]`}>{w.name}</Text>
                    <Text style={tw`text-gray-500 text-[12px]`}>{w.phone}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setWorkers(prev => prev.filter(x => x.id !== w.id))} style={tw`bg-red-100 px-3 py-1.5 rounded-lg`}>
                    <Text style={tw`text-red-700 font-bold text-[12px]`}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <TouchableOpacity onPress={onSignOut} style={tw`w-full h-14 bg-red-100 rounded-2xl items-center justify-center mt-2`}>
              <Text style={tw`text-red-700 font-black text-[16px]`}>{t.logout}</Text>
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
                  <Text style={tw`text-[16px] font-black text-gray-900`}>{item.name} x {item.quantity}</Text>
                  <Text style={[tw`text-[14px] font-black uppercase`, isChecked ? tw`text-green-700` : tw`text-red-700`]}>
                    {isChecked ? t.inStock : t.soldOut}
                  </Text>
                </TouchableOpacity>
              )
            })}

            <TouchableOpacity
              onPress={handleConfirmAcceptance}
              style={tw`w-full h-14 bg-green-600 rounded-2xl items-center justify-center mt-2 shadow-md`}
            >
              <Text style={tw`text-white font-black text-[17px] uppercase`}>{t.accept}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Sliding Capsule Bottom Navigation Bar (Larger Icons) ── */}
      <View style={tw`absolute bottom-4 left-4 right-4 z-40`}>
        <View style={[tw`rounded-[28px] p-1 border shadow-xl`, { backgroundColor: 'rgba(255, 255, 255, 0.96)', borderColor: 'rgba(255, 255, 255, 0.6)' }]}>
          <View style={tw`flex-row items-center justify-around py-1 px-1`}>
            {[
              { id: 'orders', label: t.orders, Icon: IconOrders },
              { id: 'menu', label: t.menu, Icon: IconMenu },
              { id: 'settings', label: t.settings, Icon: IconSettings },
            ].map(({ id, label, Icon }) => {
              const isActive = activeTab === id
              return (
                <TouchableOpacity
                  key={id}
                  onPress={() => {
                    triggerHaptic()
                    setActiveTab(id as any)
                  }}
                  style={[
                    tw`flex-row items-center py-3 px-4 rounded-full`,
                    { backgroundColor: isActive ? '#1a3a2a' : 'transparent' }
                  ]}
                >
                  <Icon active={isActive} />
                  {isActive && (
                    <Text style={tw`text-[14px] font-black text-white ml-2`}>{label}</Text>
                  )}
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </View>
    </View>
  )
}
