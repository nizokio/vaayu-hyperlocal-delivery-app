import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Alert, Platform, StatusBar as RNStatusBar, Animated, Easing, Pressable, ScrollView } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import tw from 'twrnc'
import Svg, { Path, Circle, Polyline, Line } from 'react-native-svg'

// Import Screens & Icons
import HomeScreen, { allShopsList, popularShops } from './screens/HomeScreen'
import CartScreen from './screens/CartScreen'
import OrdersScreen from './screens/OrdersScreen'
import ProfileScreen from './screens/ProfileScreen'
import SignupScreen from './screens/SignupScreen'
import ShopDetailsScreen from './screens/ShopDetailsScreen'
import OwnerDashboard from './screens/OwnerDashboard'
import { BACKEND_URL } from './screens/apiConfig'

type TabId = "home" | "orders" | "cart" | "profile"

function IconHome({ active }: { active: boolean }) {
  const c = active ? "#ffffff" : "#6b7280"
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill={active ? c : "none"} stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <Polyline points="9,22 9,12 15,12 15,22" />
    </Svg>
  )
}

function IconBag({ active }: { active: boolean }) {
  const c = active ? "#ffffff" : "#6b7280"
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill={active ? c : "none"} stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <Line x1="3" y1="6" x2="21" y2="6" />
      <Path d="M16 10a4 4 0 0 1-8 0" />
    </Svg>
  )
}

function IconCart({ active }: { active: boolean }) {
  const c = active ? "#ffffff" : "#6b7280"
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill={active ? c : "none"} stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="9" cy="21" r="1" />
      <Circle cx="20" cy="21" r="1" />
      <Path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </Svg>
  )
}

function IconUser({ active }: { active: boolean }) {
  const c = active ? "#ffffff" : "#6b7280"
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill={active ? c : "none"} stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </Svg>
  )
}

const NAV_ITEMS: { id: TabId; label: string; Icon: React.FC<{ active: boolean }>; maxWidth: number }[] = [
  { id: "home",    label: "Home",    Icon: IconHome,    maxWidth: 45 },
  { id: "orders",  label: "Orders",  Icon: IconBag,     maxWidth: 56 },
  { id: "cart",    label: "Cart",    Icon: IconCart,    maxWidth: 35 },
  { id: "profile", label: "Profile", Icon: IconUser,    maxWidth: 52 },
]

function NavTab({
  id, label, Icon, isActive, onPress, maxWidth,
}: {
  id: TabId; label: string
  Icon: React.FC<{ active: boolean }>
  isActive: boolean; onPress: () => void
  maxWidth: number
}) {
  const width  = useRef(new Animated.Value(isActive ? 1 : 0)).current
  const opacity = useRef(new Animated.Value(isActive ? 1 : 0)).current
  const scale  = useRef(new Animated.Value(isActive ? 1 : 0.95)).current
  const translateY = useRef(new Animated.Value(isActive ? -1 : 0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(width, {
        toValue: isActive ? 1 : 0,
        duration: 250,
        easing: Easing.bezier(0.25, 1, 0.5, 1),
        useNativeDriver: false
      }),
      Animated.timing(opacity, {
        toValue: isActive ? 1 : 0,
        duration: 200,
        easing: Easing.bezier(0.25, 1, 0.5, 1),
        useNativeDriver: true
      }),
      Animated.spring(scale, {
        toValue: isActive ? 1 : 0.95,
        useNativeDriver: true,
        tension: 100,
        friction: 12
      }),
      Animated.spring(translateY, {
        toValue: isActive ? -1 : 0,
        useNativeDriver: true,
        tension: 100,
        friction: 12
      }),
    ]).start()
  }, [isActive])

  const labelWidth = width.interpolate({ inputRange: [0, 1], outputRange: [0, maxWidth] })
  const textMarginLeft = width.interpolate({ inputRange: [0, 1], outputRange: [0, 8] })

  return (
    <Pressable onPress={onPress} style={styles.tabPressable}>
      <Animated.View
        style={[
          styles.pill,
          { backgroundColor: isActive ? "#8fda58" : "transparent", transform: [{ scale }] },
        ]}
      >
        <Animated.View style={{ transform: [{ translateY }] }}>
          <Icon active={isActive} />
        </Animated.View>
        <Animated.View style={{ width: labelWidth, marginLeft: textMarginLeft, overflow: "hidden" }}>
          <Animated.Text style={[styles.label, { opacity }]} numberOfLines={1}>
            {label}
          </Animated.Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  )
}

export default function App() {
  // App States
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('home')
  const [savedShops, setSavedShops] = useState<Set<number>>(new Set([3]))
  const [selectedShop, setSelectedShop] = useState<any>(null)
  
  // Cart State
  const [cartItems, setCartItems] = useState<any[]>([])
  const [cartShop, setCartShop] = useState<any>(null)

  // Orders State
  const [orders, setOrders] = useState<any[]>([
    {
      id: "ORD-8841",
      shopName: "Campus Bites",
      items: [{ name: "Spicy Paneer Burger", quantity: 2, price: 120 }],
      total: 240,
      status: "delivered",
      paymentMethod: "cod",
      createdAt: Date.now() - 3600000 * 24
    }
  ])

  // Profile Address State (Default: IIIT Tiruchirappalli Gate 1)
  const [address, setAddress] = useState({
    area: "IIIT Tiruchirappalli",
    room: "Gate 1",
    landmark: "Sethurapatti, Trichy"
  })

  // Notifications Modal State
  const [showNotifications, setShowNotifications] = useState(false)

  // Toast / Alert State
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 2500)
  }

  // Load orders from backend when user is authenticated
  useEffect(() => {
    if (!user?.email) return

    const fetchOrders = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/orders?email=${user.email}`)
        if (response.ok) {
          const data = await response.json()
          if (Array.isArray(data) && data.length > 0) {
            setOrders(data)
          }
        }
      } catch (err) {
        // Silent catch: use local default state when backend server is offline
      }
    }

    fetchOrders()
  }, [user])

  // Handle Save Shop toggle
  const toggleSave = (id: number) => {
    setSavedShops(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
    showToast("Shop save state updated!")
  }

  // Cart operations
  const addToCart = (item: any, shop: any) => {
    if (cartShop && cartShop.id !== shop.id) {
      Alert.alert(
        "Replace Cart Items?",
        `Your cart has items from ${cartShop.name}. Discard and add from ${shop.name}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Replace",
            onPress: () => {
              setCartItems([{ ...item, quantity: 1, shopId: shop.id, shopName: shop.name }])
              setCartShop(shop)
              showToast("Cart replaced successfully")
            }
          }
        ]
      )
      return
    }

    setCartShop(shop)
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...item, quantity: 1, shopId: shop.id, shopName: shop.name }]
    })
    showToast(`${item.name} added to cart!`)
  }

  const changeQuantity = (itemId: string, diff: number) => {
    setCartItems(prev => {
      const updated = prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity + diff } : i)
      const filtered = updated.filter(i => i.quantity > 0)
      if (filtered.length === 0) {
        setCartShop(null)
      }
      return filtered
    })
  }

  const handlePlaceOrder = async (
    finalTotal: number,
    discount: number,
    appliedPromo: string,
    deliveryMode: 'regular' | 'instant',
    selectedSlotId?: string
  ) => {
    const localOrderItems = cartItems.map(i => ({
      id: i.id,
      name: i.name,
      quantity: i.quantity || i.qty,
      price: i.price
    }))

    try {
      const response = await fetch(`${BACKEND_URL}/api/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user?.email || 'test@iiitt.ac.in',
          shopName: cartShop.name,
          items: localOrderItems,
          deliveryMode,
          selectedSlotId
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        Alert.alert("Order Failed", errorData.error || "Failed to place order.")
        return
      }

      const createdOrder = await response.json()
      setOrders(prev => [createdOrder, ...prev])
      setCartItems([])
      setCartShop(null)
      showToast("Order placed successfully via Cash on Delivery!")
    } catch (error) {
      console.log("Offline mode: Order placed locally.")
      // Fallback local mode
      const fallbackOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        userEmail: user?.email || 'guest@iiitt.ac.in',
        shopName: cartShop.name,
        items: [...cartItems],
        totalAmount: finalTotal,
        total: finalTotal,
        deliveryMode,
        selectedSlotId,
        selectedSlotLabel: deliveryMode === 'regular' ? (selectedSlotId === 'slot_1' ? '12:00 PM – 2:00 PM' : '7:00 PM – 9:00 PM') : undefined,
        deliveryVenue: 'IIIT Trichy main gate',
        status: "pending" as const,
        createdAt: Date.now()
      }
      setOrders(prev => [fallbackOrder, ...prev])
      setCartItems([])
      setCartShop(null)
      showToast("Offline mode: Order placed locally!")
    }
  }

  // Simulate active order progression
  useEffect(() => {
    const pendingOrders = orders.filter(o => o.status === 'pending')
    if (pendingOrders.length > 0) {
      const timer = setTimeout(() => {
        setOrders(prev => prev.map(o => o.status === 'pending' ? { ...o, status: 'preparing' } : o))
        showToast("Merchant is preparing your order!")
      }, 5000)
      return () => clearTimeout(timer)
    }

    const preparingOrders = orders.filter(o => o.status === 'preparing')
    if (preparingOrders.length > 0) {
      const timer = setTimeout(() => {
        setOrders(prev => prev.map(o => o.status === 'preparing' ? { ...o, status: 'on_the_way' } : o))
        showToast("Order is out for delivery!")
      }, 7000)
      return () => clearTimeout(timer)
    }
  }, [orders])

  // Reorder flow
  const handleReorder = (order: any) => {
    const shopsList = (allShopsList && allShopsList.length > 0) ? allShopsList : (popularShops || [])
    const shopToReorder = shopsList.find((s: any) => s.name === order?.shopName) || shopsList[0] || { id: 1, name: "Campus Bites" }
    
    const orderItems = Array.isArray(order?.items) ? order.items : []
    const updatedItems = orderItems.map((i: any) => ({
      ...i,
      id: i.id || `item_${Date.now()}_${Math.random()}`,
      quantity: i.quantity || 1,
      shopId: shopToReorder.id,
      shopName: shopToReorder.name
    }))
    
    setCartShop(shopToReorder)
    setCartItems(updatedItems)
    setActiveTab('cart')
    showToast("Items added back to cart!")
  }

  const handleTrackOrder = (order: any) => {
    setActiveTab('orders')
    showToast(`Tracking order: ${order.id}`)
  }

  const handleSignup = (userData: any) => {
    // Immediately log user in with zero delay!
    setUser(userData)
    setActiveTab('home')
    showToast("Welcome to Vaayu!")

    // Non-blocking background sync to backend
    fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userData.email,
        name: userData.name,
        phoneNumber: userData.phoneNumber,
        role: userData.role
      })
    }).catch(() => {
      // Background sync silent catch
    })
  }

  // If user is not onboarded, show signup screen
  if (!user) {
    return (
      <SignupScreen
        onDone={handleSignup}
      />
    )
  }

  // If partner / owner / worker staff logs in, show merchant dashboard
  if (user.role === 'owner' || user.role === 'worker') {
    return (
      <SafeAreaView style={[tw`flex-1`, { backgroundColor: '#ffffff' }]}>
        <StatusBar style="dark" backgroundColor="#ffffff" />
        <OwnerDashboard user={user} onSignOut={() => setUser(null)} />
      </SafeAreaView>
    )
  }

  const isHomeScreen = activeTab === 'home' && !selectedShop
  const safeAreaBg = isHomeScreen ? '#8fda58' : '#ffffff'
  const statusBarStyle = isHomeScreen ? 'light' : 'dark'

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: safeAreaBg }, styles.safeArea]}>
      <StatusBar style={statusBarStyle} backgroundColor={safeAreaBg} />
      
      {/* Toast Alert */}
      {toastMessage && (
        <View style={[tw`absolute top-16 left-4 right-4 z-50 rounded-full px-4 py-3 shadow-lg justify-center items-center`, { backgroundColor: '#8fda58' }]}>
          <Text style={tw`text-white text-xs font-bold text-center`}>{toastMessage}</Text>
        </View>
      )}

      {/* Main Content Pane */}
      <View style={tw`flex-1`}>
        {selectedShop ? (
          <ShopDetailsScreen
            shop={selectedShop}
            cartItems={cartItems}
            onBack={() => setSelectedShop(null)}
            onAddToCart={addToCart}
            onChangeQuantity={changeQuantity}
            onViewCart={() => {
              setSelectedShop(null)
              setActiveTab('cart')
            }}
          />
        ) : (
          <View style={tw`flex-1`}>
            {activeTab === 'home' && (
              <HomeScreen
                user={user}
                savedShops={savedShops}
                cartItems={cartItems}
                address={address}
                onSelectShop={setSelectedShop}
                onToggleSave={toggleSave}
                onOpenCart={() => setActiveTab('cart')}
                onOpenNotifications={() => setShowNotifications(true)}
              />
            )}
            {activeTab === 'orders' && (
              <OrdersScreen
                orders={orders}
                onReorder={handleReorder}
                onTrackOrder={handleTrackOrder}
              />
            )}
            {activeTab === 'cart' && (
              <CartScreen
                cartItems={cartItems}
                cartShop={cartShop}
                changeQuantity={changeQuantity}
                placeOrder={handlePlaceOrder}
                address={address}
                setAddress={setAddress}
                onContinueShopping={() => setActiveTab('home')}
              />
            )}
            {activeTab === 'profile' && (
              <ProfileScreen
                user={user}
                onSignOut={() => {
                  setUser(null)
                  setCartItems([])
                  setCartShop(null)
                }}
              />
            )}
          </View>
        )}
      </View>

      {/* Bottom Nav Capsule */}
      {!selectedShop && (
        <View style={styles.wrapper} pointerEvents="box-none">
          <View style={styles.bar}>
            {NAV_ITEMS.map(({ id, label, Icon, maxWidth }) => (
              <NavTab
                key={id}
                id={id}
                label={label}
                Icon={Icon}
                isActive={activeTab === id}
                maxWidth={maxWidth}
                onPress={() => {
                  setSelectedShop(null)
                  setActiveTab(id)
                }}
              />
            ))}
          </View>
        </View>
      )}

      {/* ── Campus Notifications Modal Drawer (Overlays navigation bar) ── */}
      {showNotifications && (
        <View style={[tw`absolute inset-0 justify-end`, { backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, elevation: 100 }]}>
          <View style={tw`bg-white rounded-t-3xl p-6 pb-10 border-t border-gray-100 max-h-[85%]`}>
            <View style={tw`flex-row items-center justify-between pb-4 border-b border-gray-100 mb-4`}>
              <View style={tw`flex-row items-center gap-2`}>
                <Text style={tw`text-2xl`}>🔔</Text>
                <Text style={tw`text-[20px] font-black text-gray-900`}>Campus Notifications</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowNotifications(false)}
                style={tw`w-8 h-8 rounded-full bg-gray-100 items-center justify-center`}
              >
                <Text style={tw`text-gray-500 font-bold text-base`}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={tw`max-h-96`}>
              <View style={tw`gap-3`}>
                <View style={tw`bg-green-50 border border-green-100 rounded-2xl p-4 flex-row items-start gap-3`}>
                  <Text style={tw`text-2xl`}>🎉</Text>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-[14px] font-black text-gray-900 mb-0.5`}>Welcome to IIIT Tiruchirappalli!</Text>
                    <Text style={tw`text-[12px] text-gray-600 font-medium leading-relaxed`}>
                      Official campus delivery is live for Gate 1 & Hostels.
                    </Text>
                    <Text style={tw`text-[10px] text-gray-400 font-bold mt-1`}>Just now</Text>
                  </View>
                </View>

                <View style={tw`bg-gray-50 border border-gray-100 rounded-2xl p-4 flex-row items-start gap-3`}>
                  <Text style={tw`text-2xl`}>🍔</Text>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-[14px] font-black text-gray-900 mb-0.5`}>Campus Bites Special Offer</Text>
                    <Text style={tw`text-[12px] text-gray-600 font-medium leading-relaxed`}>
                      Get 20% off on all burgers & sides today with code CAMPUS20.
                    </Text>
                    <Text style={tw`text-[10px] text-gray-400 font-bold mt-1`}>2 hours ago</Text>
                  </View>
                </View>

                <View style={tw`bg-gray-50 border border-gray-100 rounded-2xl p-4 flex-row items-start gap-3`}>
                  <Text style={tw`text-2xl`}>⚡</Text>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-[14px] font-black text-gray-900 mb-0.5`}>15-Min Delivery Guarantee</Text>
                    <Text style={tw`text-[12px] text-gray-600 font-medium leading-relaxed`}>
                      Groceries & essentials now deliver to Gate 1 in under 15 mins.
                    </Text>
                    <Text style={tw`text-[10px] text-gray-400 font-bold mt-1`}>Yesterday</Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              onPress={() => {
                setShowNotifications(false)
                showToast("All notifications marked as read")
              }}
              style={[tw`w-full py-3.5 rounded-2xl items-center mt-5`, { backgroundColor: '#8fda58' }]}
            >
              <Text style={tw`text-[14px] font-black text-white`}>Mark All as Read</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  wrapper: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.97)",
    borderRadius: 28,
    padding: 10,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 12,
    alignSelf: "center",
  },
  tabPressable: {
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 15,
    overflow: "hidden",
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },
})
