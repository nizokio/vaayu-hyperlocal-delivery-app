import React, { useState, useEffect } from 'react'

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

interface OwnerDashboardProps {
  user: any
  onSignOut: () => void
}

export default function OwnerDashboard({ user, onSignOut }: OwnerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'settings'>('orders')
  const [isLiveToday, setIsLiveToday] = useState(true)
  const [lang, setLang] = useState<'en' | 'hi' | 'ta'>('en')

  const t = i18n[lang] || i18n['en']

  // Audio/vibration feedback
  const triggerBeep = () => {
    try {
      if ('vibrate' in navigator) navigator.vibrate(100)
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
      gain.gain.setValueAtTime(0.1, ctx.currentTime)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.15)
    } catch {
      // Audio fallback
    }
  }

  // Staff members list
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

  // Form with Photo Upload
  const [newItemName, setNewItemName] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('')
  const [newItemImg, setNewItemImg] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200')

  // Orders State
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
      paymentMode: 'cod',
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
    triggerBeep()
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 2500)
  }

  // Format 15m countdown mm:ss & progress color shift
  const getTimerDetails = (expireTime: number, totalDuration: number = 15 * 60 * 1000) => {
    const diff = Math.max(0, Math.floor((expireTime - now) / 1000))
    const totalSecs = Math.floor(totalDuration / 1000)
    const ratio = diff / totalSecs
    const mins = Math.floor(diff / 60)
    const secs = diff % 60
    const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`

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
    triggerBeep()
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
    triggerBeep()
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
    <div className="flex flex-col min-h-screen bg-gray-100 pb-28 max-w-[430px] mx-auto relative select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl flex items-center gap-2">
          <span>✨</span> {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="bg-white px-5 pt-6 pb-4 border-b border-gray-200 sticky top-0 z-30">
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-[12px] font-black text-green-700 uppercase tracking-widest">
              {user?.role === 'worker' ? 'WORKER PORTAL' : 'SHOP OWNER'}
            </p>
            <h1 className="text-[26px] font-black text-gray-900 leading-tight">{user?.name || 'Campus Bites'}</h1>
          </div>

          {/* Quick Language Toggle */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            {(['en', 'hi', 'ta'] as const).map((l) => (
              <button
                key={l}
                onClick={() => {
                  setLang(l)
                  triggerBeep()
                }}
                className={`px-2.5 py-1 rounded-lg font-black text-[11px] uppercase cursor-pointer ${
                  lang === l ? 'bg-green-700 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {l === 'en' ? 'EN' : l === 'hi' ? 'हिंदी' : 'தமி'}
              </button>
            ))}
          </div>
        </div>

        {/* GIANT ZOMATO-STYLE DAILY GO-LIVE BUTTON (Min 56px height) */}
        <button
          onClick={() => {
            const next = !isLiveToday
            setIsLiveToday(next)
            showToast(next ? t.shopOpen : t.shopClosed)
          }}
          className={`w-full h-14 rounded-2xl font-black text-[17px] tracking-wide text-white uppercase shadow-md transition-transform active:scale-[0.98] cursor-pointer flex items-center justify-center border-2 ${
            isLiveToday ? 'bg-green-600 border-green-700' : 'bg-red-600 border-red-700'
          }`}
        >
          {isLiveToday ? `${t.shopOpen} ${t.tapToClose}` : `${t.shopClosed} ${t.tapToOpen}`}
        </button>
      </div>

      {/* 2 Simple Large Summary Cards */}
      <div className="grid grid-cols-2 gap-3 p-4">
        <div className={`rounded-2xl p-4 border ${incomingCount > 0 ? 'bg-red-50 border-red-300' : 'bg-white border-gray-200'}`}>
          <p className="text-[12px] font-black uppercase text-gray-500">{t.newWaiting}</p>
          <p className={`text-[32px] font-black mt-0.5 ${incomingCount > 0 ? 'text-red-600' : 'text-gray-900'}`}>{incomingCount}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200">
          <p className="text-[12px] font-black uppercase text-gray-500">{t.todayCash}</p>
          <p className="text-[32px] font-black text-gray-900 mt-0.5">₹{todayTotal}</p>
        </div>
      </div>

      <div className="px-4 flex-1">
        {/* ── 1. ORDERS TAB (Low-Literacy Redesign) ── */}
        {activeTab === 'orders' && (
          <div className="flex flex-col gap-4">
            <h2 className="text-[18px] font-black text-gray-900">{t.orders} ({orders.length})</h2>

            {orders.map(order => {
              const timer = getTimerDetails(order.expireTime, order.totalDuration)

              return (
                <div key={order.id} className="bg-white rounded-3xl p-5 border-2 border-gray-300 shadow-md flex flex-col gap-3">
                  {/* GIANT Order ID & Delivery Location (Primary Focal Point) */}
                  <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                    <div>
                      <span className="text-[28px] font-black text-gray-900 block leading-none">{order.id}</span>
                      <span className="text-[20px] font-black text-green-700 mt-1 block">📍 {order.location}</span>
                    </div>

                    {/* Payment Icon Only (💵 for COD, 📱 for UPI) + Status Badge */}
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="bg-gray-100 px-3 py-1.5 rounded-full text-2xl">
                        {order.paymentMode === 'cod' ? '💵' : '📱'}
                      </span>
                      <span className={`text-[12px] font-black px-3 py-1 rounded-full uppercase ${
                        order.status === 'incoming' ? 'bg-red-100 text-red-700' :
                        order.status === 'preparing' ? 'bg-orange-100 text-orange-700' :
                        order.status === 'delivering' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {order.status === 'incoming' ? '📥 NEW' :
                         order.status === 'preparing' ? '🍳 COOK' :
                         order.status === 'delivering' ? '🛵 ROAD' : '✅ DONE'}
                      </span>
                    </div>
                  </div>

                  {/* VISUAL COLOR-SHIFTING PROGRESS TIMER BAR */}
                  {order.status === 'incoming' && (
                    <div className={`rounded-2xl p-3 border flex flex-col gap-1.5 ${timer.bgClass} ${timer.borderClass}`}>
                      <div className="flex justify-between items-center">
                        <span className={`text-[13px] font-black ${timer.textClass}`}>⏱️ {t.timeLeft}:</span>
                        <span className={`text-[18px] font-black font-mono ${timer.textClass}`}>{timer.timeStr}</span>
                      </div>
                      <div className="w-full h-3.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${timer.colorClass}`} style={{ width: `${Math.max(5, Math.min(100, timer.ratio * 100))}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Delivery Mode Badge */}
                  {order.deliveryMode === 'regular' || order.selectedSlotLabel ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-2.5 flex justify-between items-center text-xs">
                      <span className="font-black text-green-700 uppercase">{t.scheduled}</span>
                      <span className="font-bold text-green-800">
                        <strong className="font-black text-green-900">{order.selectedSlotLabel || '12:00 PM – 2:00 PM'}</strong>
                      </span>
                    </div>
                  ) : (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-2.5 flex justify-between items-center text-xs">
                      <span className="font-black text-blue-700 uppercase">{t.instant}</span>
                      <span className="font-bold text-blue-800">
                        <strong className="font-black text-blue-900">Within 15 Mins</strong>
                      </span>
                    </div>
                  )}

                  {/* Ordered Items List */}
                  <div className="bg-gray-50 rounded-2xl p-3 flex flex-col gap-2 border border-gray-200">
                    {order.items.map((it: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-[15px]">
                        <span className={`font-black ${it.accepted !== false ? 'text-gray-900' : 'text-gray-400 line-through'}`}>
                          {it.name} x {it.quantity}
                        </span>
                        <span className="font-black text-gray-900">₹{it.price * it.quantity}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-300 pt-2 mt-1 flex justify-between items-center">
                      <span className="text-[16px] font-black text-gray-900">TOTAL</span>
                      <span className="text-[20px] font-black text-green-700">₹{order.total}</span>
                    </div>
                  </div>

                  {/* 30% TALLER ACTION BUTTONS (Min 56px height) */}
                  <div className="flex flex-col gap-2.5 mt-1">
                    {order.status === 'incoming' && (
                      <>
                        <button
                          onClick={() => handleOpenAcceptModal(order)}
                          className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-black text-[17px] uppercase rounded-2xl shadow-lg transition-transform active:scale-[0.98] cursor-pointer"
                        >
                          {t.accept} (₹{order.total})
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                          className="w-full h-12 bg-red-100 hover:bg-red-200 text-red-700 font-black text-[14px] rounded-2xl cursor-pointer"
                        >
                          {t.decline}
                        </button>
                      </>
                    )}

                    {order.status === 'preparing' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'delivering')}
                        className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white font-black text-[17px] uppercase rounded-2xl shadow-lg transition-transform active:scale-[0.98] cursor-pointer"
                      >
                        {t.markReady}
                      </button>
                    )}

                    {order.status === 'delivering' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'completed')}
                        className="w-full h-14 bg-green-700 hover:bg-green-800 text-white font-black text-[17px] uppercase rounded-2xl shadow-lg transition-transform active:scale-[0.98] cursor-pointer"
                      >
                        {t.markDelivered}
                      </button>
                    )}

                    {order.status === 'completed' && (
                      <div className="w-full py-3 bg-green-50 rounded-2xl text-center">
                        <span className="text-green-800 font-black text-[14px]">{t.completed}</span>
                      </div>
                    )}

                    {order.status === 'cancelled' && (
                      <div className="w-full py-3 bg-red-50 rounded-2xl text-center">
                        <span className="text-red-700 font-black text-[14px]">{t.rejected}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── 2. FOOD STOCK SCREEN (Photos & Giant Stock Switch) ── */}
        {activeTab === 'menu' && (
          <div className="flex flex-col gap-4">
            {/* Camera-First Form */}
            <div className="bg-white rounded-3xl p-5 border-2 border-gray-300 flex flex-col gap-4 shadow-sm">
              <h2 className="text-[18px] font-black text-gray-900">{t.addFood}</h2>
              
              {/* Camera Upload Button First */}
              <button
                onClick={() => showToast("Photo attached!")}
                className="w-full h-24 bg-green-50 border-2 border-dashed border-green-500 rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-green-100 transition-colors"
              >
                <span className="text-3xl">📷</span>
                <span className="text-green-800 font-black text-[13px]">{t.photoButton}</span>
              </button>

              <input
                type="text"
                placeholder={t.namePlaceholder}
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14 text-[16px] font-bold text-gray-900 outline-none focus:border-green-600"
              />

              <input
                type="number"
                placeholder={t.pricePlaceholder}
                value={newItemPrice}
                onChange={e => setNewItemPrice(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14 text-[16px] font-bold text-gray-900 outline-none focus:border-green-600"
              />

              <button
                onClick={handleAddItem}
                className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-black text-[16px] rounded-2xl shadow-md cursor-pointer"
              >
                {t.saveFood}
              </button>
            </div>

            {/* Food Stock Items List */}
            <h2 className="text-[18px] font-black text-gray-900 mt-2">{t.menu} ({menuItems.length})</h2>
            <div className="flex flex-col gap-3">
              {menuItems.map(item => (
                <div key={item.id} className="bg-white rounded-2xl p-4 border-2 border-gray-200 flex items-center justify-between gap-3 shadow-xs">
                  <img src={item.img} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />

                  <div className="flex-1 min-w-0">
                    <h3 className="text-[16px] font-black text-gray-900">{item.name}</h3>
                    <p className="text-[15px] font-black text-green-700 mt-0.5">₹{item.price}</p>
                  </div>

                  {/* GIANT SINGLE-TAP STOCK TOGGLE */}
                  <button
                    onClick={() => {
                      triggerBeep()
                      setMenuItems(prev => prev.map(i => i.id === item.id ? { ...i, available: !i.available } : i))
                    }}
                    className={`px-5 h-12 rounded-2xl font-black text-[14px] uppercase text-white shadow-sm cursor-pointer border-2 ${
                      item.available ? 'bg-green-600 border-green-700' : 'bg-red-600 border-red-700'
                    }`}
                  >
                    {item.available ? t.inStock : t.soldOut}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 3. SETTINGS & LANGUAGE TOGGLE ── */}
        {activeTab === 'settings' && (
          <div className="flex flex-col gap-4">
            {/* Language Selector */}
            <div className="bg-white rounded-3xl p-5 border-2 border-gray-300 flex flex-col gap-3 shadow-sm">
              <h2 className="text-[16px] font-black text-gray-900">{t.language}</h2>
              
              <div className="flex flex-col gap-2">
                {[
                  { code: 'en', name: 'English' },
                  { code: 'hi', name: 'हिन्दी (Hindi)' },
                  { code: 'ta', name: 'தமிழ் (Tamil)' },
                ].map(l => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code as any)
                      showToast(`Language set to ${l.name}`)
                    }}
                    className={`w-full h-14 rounded-2xl border-2 flex items-center justify-between px-4 font-black text-[16px] cursor-pointer ${
                      lang === l.code ? 'bg-green-50 border-green-600 text-green-800' : 'bg-gray-50 border-gray-200 text-gray-800'
                    }`}
                  >
                    <span>{l.name}</span>
                    {lang === l.code && <span className="text-green-700 text-lg">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Staff Worker Access */}
            <div className="bg-white rounded-3xl p-5 border-2 border-gray-300 flex flex-col gap-3 shadow-sm">
              <h2 className="text-[16px] font-black text-gray-900">{t.addWorker}</h2>
              <p className="text-[13px] text-gray-500 font-medium">{t.workerHelp}</p>

              <input
                type="text"
                placeholder={t.workerName}
                value={newWorkerName}
                onChange={e => setNewWorkerName(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14 text-[16px] font-bold text-gray-900 outline-none"
              />

              <input
                type="text"
                placeholder={t.workerPhone}
                value={newWorkerPhone}
                onChange={e => setNewWorkerPhone(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14 text-[16px] font-bold text-gray-900 outline-none"
              />

              <button
                onClick={handleAddWorker}
                className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-black text-[16px] rounded-2xl shadow-md cursor-pointer"
              >
                {t.saveWorker}
              </button>

              {workers.map(w => (
                <div key={w.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <p className="font-bold text-gray-900 text-[14px]">{w.name}</p>
                    <p className="text-gray-500 text-[12px]">{w.phone}</p>
                  </div>
                  <button onClick={() => setWorkers(prev => prev.filter(x => x.id !== w.id))} className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold">
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button onClick={onSignOut} className="w-full h-14 bg-red-100 text-red-700 font-black text-[16px] rounded-2xl cursor-pointer">
              {t.logout}
            </button>
          </div>
        )}
      </div>

      {/* Partial Accept Modal */}
      {partialOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl p-6 w-full max-w-[430px] mx-auto flex flex-col gap-4">
            <h3 className="text-[18px] font-black text-gray-900">Uncheck items out of stock:</h3>
            
            {partialOrder.items.map((item: any, idx: number) => {
              const itemKey = item.id || idx
              const isChecked = !!checkedItems[itemKey]
              return (
                <button
                  key={itemKey}
                  onClick={() => setCheckedItems(prev => ({ ...prev, [itemKey]: !isChecked }))}
                  className={`flex justify-between items-center p-4 rounded-2xl border-2 cursor-pointer ${
                    isChecked ? 'bg-green-50 border-green-600' : 'bg-red-50 border-red-600'
                  }`}
                >
                  <span className="text-[16px] font-black text-gray-900">{item.name} x {item.quantity}</span>
                  <span className={`text-[14px] font-black uppercase ${isChecked ? 'text-green-700' : 'text-red-700'}`}>
                    {isChecked ? t.inStock : t.soldOut}
                  </span>
                </button>
              )
            })}

            <button
              onClick={handleConfirmAcceptance}
              className="w-full h-14 bg-green-600 text-white font-black text-[17px] uppercase rounded-2xl shadow-md cursor-pointer"
            >
              {t.accept}
            </button>
          </div>
        </div>
      )}

      {/* Sliding Bottom Nav Capsule */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40" style={{ width: 'calc(100% - 32px)', maxWidth: 390 }}>
        <div className="bg-white/95 backdrop-blur-md rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.14)] border border-white/60 p-1">
          <div className="flex items-center justify-around relative px-2 py-1.5">
            {[
              { id: 'orders', label: t.orders, icon: '📋' },
              { id: 'menu', label: t.menu, icon: '🍔' },
              { id: 'settings', label: t.settings, icon: '⚙️' },
            ].map(({ id, label, icon }) => {
              const isActive = activeTab === id
              return (
                <button
                  key={id}
                  onClick={() => {
                    triggerBeep()
                    setActiveTab(id as any)
                  }}
                  className="relative flex items-center gap-1.5 py-2.5 px-4 rounded-full overflow-hidden transition-colors cursor-pointer select-none"
                  style={{
                    backgroundColor: isActive ? '#1a3a2a' : 'transparent',
                    color: isActive ? '#ffffff' : '#6b7280'
                  }}
                >
                  <span className="text-base">{icon}</span>
                  {isActive && (
                    <span className="text-[14px] font-black text-white whitespace-nowrap">
                      {label}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
