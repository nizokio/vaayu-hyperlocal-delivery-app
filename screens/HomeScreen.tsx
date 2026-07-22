import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, FlatList, StyleSheet } from 'react-native'
import tw from 'twrnc'
import Svg, { Path, Line, Polyline, Circle } from 'react-native-svg'
import { LinearGradient } from 'expo-linear-gradient'
import {
  IconMapPin,
  IconChevronDown,
  IconSearch,
  IconScan,
  IconBell,
  IconCart,
  IconStar,
  IconClock,
  IconPercent
} from './Icons'

// ── Redesigned Swiggy-Style Category Database ─────────────────────────────────────

export const categories = [
  {
    id: 1,
    name: "Food",
    title: "FOOD",
    sub: "CANTEENS & CAFES",
    badge: "15 MINS DELIVERY",
    img: require('../assets/categories/food.jpg'),
    isLarge: true,
  },
  {
    id: 2,
    name: "Grocery",
    title: "GROCERY",
    sub: "DAILY ESSENTIALS",
    badge: "FRESH & FAST",
    img: require('../assets/categories/grocery.jpg'),
    isLarge: true,
  },
  {
    id: 3,
    name: "Pharmacy",
    title: "PHARMACY",
    sub: "MEDICINES & CARE",
    badge: "CAMPUS HEALTH",
    img: require('../assets/categories/pharmacy.jpg'),
    isLarge: false,
  },
  {
    id: 5,
    name: "Stationery",
    title: "STATIONERY",
    sub: "BOOKS & LABS",
    badge: "EXAM SPECIALS",
    img: require('../assets/categories/stationery.jpg'),
    isLarge: false,
  },
  {
    id: 6,
    name: "Others",
    title: "OTHERS",
    sub: "SERVICES & MORE",
    badge: "CAMPUS PICKUP",
    img: require('../assets/categories/others.jpg'),
    isLarge: false,
  },
]

export const deals = [
  { id: 1, title: '50% off your first order', sub: 'Valid till midnight · Use CAMPUS50', color: '#8fda58', accent: '#eeeff5', img: 'https://images.unsplash.com/photo-1499778003268-cbafc6d08bab?w=400&h=240&fit=crop&auto=format' },
  { id: 2, title: 'Free delivery on ₹99+', sub: 'All grocery orders today', color: '#ea580c', accent: '#fed7aa', img: 'https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=400&h=240&fit=crop&auto=format' },
  { id: 3, title: 'Late night special', sub: 'Orders after 10 PM · 30% off', color: '#7c3aed', accent: '#ede9fe', img: 'https://images.unsplash.com/photo-1547754070-c73f90c116b5?w=400&h=240&fit=crop&auto=format' },
]

export const popularShops = [
  {
    id: 1,
    name: "Campus Bites",
    tag: "Burgers · Fast Food",
    rating: 4.8,
    time: "18 min",
    discount: "20% off",
    img: "https://images.unsplash.com/photo-1667329829058-ac191ba4a905?w=400&h=300&fit=crop&auto=format",
    badge: "Top Rated",
    upiId: "campusbites@ybl",
    items: [
      { id: "cb_1", name: "Spicy Paneer Burger", desc: "Crispy paneer patty with spicy cream and lettuce.", price: 120, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100" },
      { id: "cb_2", name: "Salted French Fries", desc: "Golden salted fries, crispy outside, soft inside.", price: 80, img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=100" },
      { id: "cb_3", name: "Loaded Cheese Pizza", desc: "Double mozzarella cheese on fresh marinara crust.", price: 180, img: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=100" }
    ]
  },
  {
    id: 2,
    name: "Green Leaf Grocery",
    tag: "Grocery · Essentials",
    rating: 4.6,
    time: "12 min",
    discount: "Free delivery",
    img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop&auto=format",
    badge: "Campus Pick",
    upiId: "greenleaf@paytm",
    items: [
      { id: "gl_1", name: "Fresh Bananas (1 Dozen)", desc: "Ripe sweet yellow bananas, farm fresh.", price: 60, img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=100" },
      { id: "gl_2", name: "Instant Noodles Pack", desc: "Classic masala noodles (Pack of 4).", price: 56, img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=100" },
      { id: "gl_3", name: "Full Cream Milk (1L)", desc: "Fresh pasteurized full cream milk brick.", price: 66, img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100" }
    ]
  },
  {
    id: 3,
    name: "The Brew House",
    tag: "Coffee · Snacks",
    rating: 4.9,
    time: "10 min",
    discount: "₹30 off",
    img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop&auto=format",
    badge: "New",
    upiId: "brewhouse@oksbi",
    items: [
      { id: "bh_1", name: "Iced Caramel Macchiato", desc: "Fresh espresso with caramel drizzle and milk.", price: 140, img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=100" },
      { id: "bh_2", name: "Choco Chip Muffin", desc: "Soft muffin baked fresh with rich dark chocolate chips.", price: 70, img: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=100" }
    ]
  },
  {
    id: 4,
    name: "Pharma Plus",
    tag: "Medicines · Health",
    rating: 4.5,
    time: "22 min",
    discount: "15% off",
    img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop&auto=format",
    badge: "",
    upiId: "pharmaplus@ybl",
    items: [
      { id: "pp_1", name: "Pain Relief Tablets", desc: "Aspirin 500mg strips (10 tablets).", price: 40, img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=100" },
      { id: "pp_2", name: "Waterproof Bandages", desc: "Pack of 20 sterile minor wound band-aids.", price: 50, img: "https://images.unsplash.com/photo-1599839619722-397514112236?w=100" }
    ]
  },
]

export const allShopsList = popularShops

function IconMenu({ color = "#ffffff", size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <Line x1="3" y1="12" x2="21" y2="12" />
      <Line x1="3" y1="6" x2="21" y2="6" />
      <Line x1="3" y1="18" x2="21" y2="18" />
    </Svg>
  )
}

function IconLocationTarget({ color = "#ffffff", size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Circle cx="12" cy="12" r="3" />
      <Line x1="12" y1="1" x2="12" y2="3" />
      <Line x1="12" y1="21" x2="12" y2="23" />
      <Line x1="1" y1="12" x2="3" y2="12" />
      <Line x1="21" y1="12" x2="23" y2="12" />
    </Svg>
  )
}

function IconMicrophone({ color = "#9ca3af", size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
      <Path d="M19 10v1a7 7 0 0 1-14 0v-1" />
      <Line x1="12" y1="19" x2="12" y2="22" />
    </Svg>
  )
}

interface HomeScreenProps {
  user: any
  savedShops: Set<number>
  cartItems: any[]
  address: { area: string; room: string; landmark: string }
  onSelectShop: (shop: any) => void
  onToggleSave: (id: number) => void
  onOpenCart: () => void
  onOpenNotifications: () => void
}

export default function HomeScreen({
  user,
  savedShops,
  cartItems,
  address,
  onSelectShop,
  onToggleSave,
  onOpenCart,
  onOpenNotifications
}: HomeScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const activeCategoryObj = categories.find(c => c.id === selectedCategory)

  const filteredPopular = popularShops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          shop.tag.toLowerCase().includes(searchQuery.toLowerCase())
    if (activeCategoryObj) {
      const catName = activeCategoryObj.name.toLowerCase()
      const matchesCat = shop.tag.toLowerCase().includes(catName) || shop.name.toLowerCase().includes(catName)
      return matchesSearch && matchesCat
    }
    return matchesSearch
  })

  const cartCount = cartItems.reduce((sum: number, i: any) => sum + (i.quantity || i.qty), 0)

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      {/* ── Top Header ── */}
      <View style={{ backgroundColor: '#8fda58', paddingBottom: 12 }}>
        <View style={tw`flex-row items-center justify-between px-4 pt-3 pb-2`}>
          {/* Middle Address Details */}
          <View style={tw`flex-1 items-center justify-center px-4`}>
            <TouchableOpacity style={tw`flex-row items-center gap-1`}>
              <Text style={tw`text-[14px] font-black text-white uppercase tracking-wider`}>IIIT TIRUCHIRAPPALLI</Text>
              <IconChevronDown color="#ffffff" size={12} />
            </TouchableOpacity>
            <Text style={tw`text-[11px] text-white/90 font-medium text-center mt-0.5`} numberOfLines={1}>
              {address.room ? `${address.area}, ${address.room}` : 'IIIT Tiruchirappalli, Gate 1'}
            </Text>
          </View>

          {/* Right Action Icons */}
          <View style={tw`flex-row items-center gap-2.5`}>
            <TouchableOpacity onPress={onOpenNotifications} style={tw`relative p-1`}>
              <IconBell color="#ffffff" size={22} />
              <View style={[tw`absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-white border rounded-full items-center justify-center`, { borderColor: '#8fda58' }]}>
                <Text style={[tw`text-[9px] font-black`, { color: '#8fda58' }]}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search bar */}
        <View style={tw`px-4 pt-1.5 pb-2`}>
          <View style={tw`flex-row items-center gap-2.5 bg-white rounded-2xl px-4 py-2.5`}>
            <IconSearch color="#9ca3af" size={18} />
            <TextInput
              placeholder="Search food, groceries, pharmacy..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={tw`flex-1 text-[14px] text-gray-700 font-medium p-0`}
            />
            <IconMicrophone color="#9ca3af" size={18} />
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-32`}>
        {/* Welcome area */}
        <View style={tw`px-4 pt-5 pb-4`}>
          <Text style={[tw`text-[11px] font-semibold uppercase tracking-widest mb-1.5`, { color: '#8fda58' }]}>
            Good evening, {user?.name || 'Student'} 👋
          </Text>
          <Text style={tw`text-[28px] font-black text-gray-900 leading-tight tracking-tight`}>
            Everything you need,{' '}
            <Text style={[tw`font-black`, { color: '#8fda58' }]}>delivered fast.</Text>
          </Text>
          <Text style={tw`text-[13px] text-gray-500 mt-1 font-semibold`}>From campus to your hostel in minutes.</Text>
        </View>

        {/* Deal banners */}
        <View style={tw`mb-5`}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`px-4 gap-3`}>
            {deals.map(deal => (
              <View
                key={deal.id}
                style={[
                  tw`rounded-3xl overflow-hidden relative p-5 justify-between`,
                  { backgroundColor: deal.color, width: 300, minHeight: 140 }
                ]}
              >
                <Image
                  source={{ uri: deal.img }}
                  style={[tw`absolute inset-0 opacity-20`, { width: 300, height: 140 }]}
                  resizeMode="cover"
                />
                <View style={[tw`self-start text-[10px] font-bold px-2.5 py-1 rounded-full`, { backgroundColor: deal.accent }]}>
                  <Text style={{ color: deal.color, fontSize: 10, fontWeight: '800' }}>LIMITED OFFER</Text>
                </View>
                <View style={tw`mt-4`}>
                  <Text style={tw`text-white font-black text-[18px] leading-tight`}>{deal.title}</Text>
                  <Text style={tw`text-white/85 text-[11px] font-semibold mt-1`}>{deal.sub}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ── Custom Layout: Food & Grocery on Left, Pharma & Stationery on Right of Food ── */}
        <View style={tw`px-4 mb-6`}>
          <View style={tw`flex-row items-center justify-between mb-3.5`}>
            <Text style={tw`text-[18px] font-black text-gray-900 tracking-tight`}>
              Browse by Category
            </Text>
            {selectedCategory && (
              <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                <Text style={tw`text-[13px] font-bold text-[#8fda58]`}>Show All</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Row 1: Food on Left (Large), Pharma & Stationery on Right (Small Tabs) */}
          <View style={tw`flex-row gap-3 mb-3`}>
            {/* Left: Food (Featured Large Card) */}
            {(() => {
              const food = categories.find(c => c.name === 'Food')!
              const isSelected = selectedCategory === food.id
              return (
                <TouchableOpacity
                  onPress={() => setSelectedCategory(isSelected ? null : food.id)}
                  activeOpacity={0.85}
                  style={[
                    tw`flex-1 bg-white rounded-3xl p-4 justify-between border relative overflow-hidden`,
                    {
                      borderColor: isSelected ? '#8fda58' : '#f3f4f6',
                      borderWidth: isSelected ? 2.5 : 1,
                      minHeight: 155,
                    }
                  ]}
                >
                  <View style={tw`z-10`}>
                    <Text style={tw`text-[16px] font-black text-gray-900 tracking-tight leading-tight mb-0.5`}>
                      {food.title}
                    </Text>
                    <Text style={tw`text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2`}>
                      {food.sub}
                    </Text>
                    <View style={tw`self-start bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100`}>
                      <Text style={tw`text-[10px] font-black text-orange-600`}>{food.badge}</Text>
                    </View>
                  </View>
                  <Image
                    source={food.img}
                    style={tw`w-22 h-22 absolute bottom-1 right-1 rounded-2xl`}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )
            })()}

            {/* Right: Stack of 2 Small Tabs (Pharmacy & Stationery) on Side of Food */}
            <View style={tw`w-[44%] gap-2.5`}>
              {['Pharmacy', 'Stationery'].map(catName => {
                const cat = categories.find(c => c.name === catName)!
                const isSelected = selectedCategory === cat.id
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setSelectedCategory(isSelected ? null : cat.id)}
                    activeOpacity={0.85}
                    style={[
                      tw`flex-1 bg-white rounded-2xl p-2.5 flex-row items-center justify-between border relative overflow-hidden`,
                      {
                        borderColor: isSelected ? '#8fda58' : '#f3f4f6',
                        borderWidth: isSelected ? 2.5 : 1,
                      }
                    ]}
                  >
                    <View style={tw`z-10 flex-1 pr-1`}>
                      <Text style={tw`text-[12px] font-black text-gray-900 tracking-tight`} numberOfLines={1}>
                        {cat.title}
                      </Text>
                      <Text style={tw`text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-0.5`} numberOfLines={1}>
                        {cat.sub}
                      </Text>
                    </View>
                    <Image
                      source={cat.img}
                      style={tw`w-10 h-10 rounded-lg`}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>

          {/* Row 2: Grocery on Left (Large), Others on Right */}
          <View style={tw`flex-row gap-3`}>
            {/* Left: Grocery (Featured Card) */}
            {(() => {
              const grocery = categories.find(c => c.name === 'Grocery')!
              const isSelected = selectedCategory === grocery.id
              return (
                <TouchableOpacity
                  onPress={() => setSelectedCategory(isSelected ? null : grocery.id)}
                  activeOpacity={0.85}
                  style={[
                    tw`flex-1 bg-white rounded-3xl p-4 justify-between border relative overflow-hidden`,
                    {
                      borderColor: isSelected ? '#8fda58' : '#f3f4f6',
                      borderWidth: isSelected ? 2.5 : 1,
                      minHeight: 110,
                    }
                  ]}
                >
                  <View style={tw`z-10`}>
                    <Text style={tw`text-[15px] font-black text-gray-900 tracking-tight leading-tight mb-0.5`}>
                      {grocery.title}
                    </Text>
                    <Text style={tw`text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2`}>
                      {grocery.sub}
                    </Text>
                    <View style={tw`self-start bg-green-50 px-2 py-0.5 rounded-full border border-green-100`}>
                      <Text style={tw`text-[9px] font-black text-green-700`}>{grocery.badge}</Text>
                    </View>
                  </View>
                  <Image
                    source={grocery.img}
                    style={tw`w-18 h-18 absolute bottom-1 right-1 rounded-xl`}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )
            })()}

            {/* Right: Others (Small Tab) */}
            {(() => {
              const others = categories.find(c => c.name === 'Others')!
              const isSelected = selectedCategory === others.id
              return (
                <TouchableOpacity
                  onPress={() => setSelectedCategory(isSelected ? null : others.id)}
                  activeOpacity={0.85}
                  style={[
                    tw`w-[44%] bg-white rounded-3xl p-3.5 justify-between border relative overflow-hidden`,
                    {
                      borderColor: isSelected ? '#8fda58' : '#f3f4f6',
                      borderWidth: isSelected ? 2.5 : 1,
                      minHeight: 110,
                    }
                  ]}
                >
                  <View style={tw`z-10`}>
                    <Text style={tw`text-[13px] font-black text-gray-900 tracking-tight leading-tight mb-0.5`}>
                      {others.title}
                    </Text>
                    <Text style={tw`text-[9px] font-bold text-gray-400 uppercase tracking-wider`}>
                      {others.sub}
                    </Text>
                  </View>
                  <Image
                    source={others.img}
                    style={tw`w-14 h-14 absolute bottom-1 right-1 rounded-xl`}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )
            })()}
          </View>
        </View>

        {/* Popular near you */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-[17px] font-black text-gray-900 px-4 mb-3`}>Popular Campus Shops</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`px-4 gap-3`}>
            {filteredPopular.map(shop => (
              <TouchableOpacity
                key={shop.id}
                onPress={() => onSelectShop(shop)}
                style={tw`w-52 bg-white rounded-3xl overflow-hidden border border-gray-100`}
              >
                <View style={tw`relative h-32`}>
                  <Image
                    source={{ uri: shop.img }}
                    style={tw`w-full h-full`}
                    resizeMode="cover"
                  />
                  {shop.isLive === false ? (
                    <View style={tw`absolute top-3 left-3 px-2.5 py-1 rounded-full bg-red-600`}>
                      <Text style={tw`text-[10px] font-black text-white uppercase`}>OFFLINE TODAY</Text>
                    </View>
                  ) : shop.badge ? (
                    <View style={[tw`absolute top-3 left-3 px-2.5 py-1 rounded-full`, { backgroundColor: '#8fda58' }]}>
                      <Text style={tw`text-[10px] font-black text-white uppercase`}>{shop.badge}</Text>
                    </View>
                  ) : null}

                  <TouchableOpacity
                    onPress={() => onToggleSave(shop.id)}
                    style={tw`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 items-center justify-center`}
                  >
                    <Svg width="16" height="16" viewBox="0 0 24 24" fill={savedShops.has(shop.id) ? "#ef4444" : "none"} stroke={savedShops.has(shop.id) ? "#ef4444" : "#374151"} strokeWidth="2">
                      <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </Svg>
                  </TouchableOpacity>
                </View>

                <View style={tw`p-3.5`}>
                  <View style={tw`flex-row items-center justify-between mb-1`}>
                    <Text style={tw`text-[15px] font-extrabold text-gray-900 flex-1 mr-2`} numberOfLines={1}>
                      {shop.name}
                    </Text>
                    <View style={tw`flex-row items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded-md`}>
                      <IconStar color="#16a34a" size={10} />
                      <Text style={tw`text-[11px] font-black text-green-700`}>{shop.rating}</Text>
                    </View>
                  </View>

                  <Text style={tw`text-[12px] text-gray-400 font-medium mb-3`}>{shop.tag}</Text>

                  <View style={tw`flex-row items-center justify-between pt-2 border-t border-gray-100`}>
                    <Text style={[tw`text-[11px] font-extrabold`, { color: '#8fda58' }]}>{shop.discount}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  )
}
