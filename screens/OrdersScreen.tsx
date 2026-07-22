import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native'
import tw from 'twrnc'
import Svg, { Path, Polyline, Circle, Line } from 'react-native-svg'

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  delivered:   { label: 'Delivered',    color: '#8fda58', bg: '#eeeff5', dot: '#8fda58' },
  on_the_way:  { label: 'On the way',  color: '#2563eb', bg: '#eff6ff', dot: '#2563eb' },
  preparing:   { label: 'Preparing',   color: '#d97706', bg: '#fffbeb', dot: '#d97706' },
  cancelled:   { label: 'Cancelled',   color: '#dc2626', bg: '#fef2f2', dot: '#dc2626' },
}

const tabs = ['All', 'Active', 'Past']

function LiveTracker() {
  return (
    <View style={[tw`mx-4 mb-4 rounded-3xl overflow-hidden`, { backgroundColor: '#8fda58' }]}>
      <View style={tw`p-4`}>
        <View style={tw`flex-row items-start justify-between mb-3`}>
          <View>
            <Text style={[tw`text-[10px] font-bold uppercase tracking-widest mb-1`, { color: '#c084fc' }]}>Live tracking</Text>
            <Text style={tw`text-white font-black text-[18px]`}>The Brew House</Text>
            <Text style={[tw`text-[12px] font-medium mt-0.5`, { color: '#eeeff5' }]}>Cappuccino x2 · Chocolate Muffin x1</Text>
          </View>
          <View style={tw`bg-white/20 rounded-2xl px-3 py-1.5 items-center`}>
            <Text style={tw`text-white font-black text-[20px] leading-none`}>5</Text>
            <Text style={[tw`text-[9px] font-bold uppercase`, { color: '#eeeff5' }]}>min</Text>
          </View>
        </View>

        {/* Progress steps */}
        <View style={tw`flex-row items-center mt-4`}>
          {['Placed', 'Preparing', 'On the way', 'Delivered'].map((step, i) => {
            const done = i < 2
            const active = i === 2
            return (
              <View key={step} style={tw`flex-1 items-center`}>
                <View style={tw`flex-row items-center w-full`}>
                  {i > 0 && <View style={[tw`flex-1 h-0.5`, { backgroundColor: done || active ? '#c084fc' : 'rgba(255,255,255,0.2)' }]} />}
                  <View
                    style={[
                      tw`w-5 h-5 rounded-full items-center justify-center`,
                      {
                        backgroundColor: done ? '#c084fc' : active ? '#ffffff' : 'rgba(255,255,255,0.2)',
                      }
                    ]}
                  >
                    {done && (
                      <Svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#8fda58" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <Polyline points="20 6 9 17 4 12"/>
                      </Svg>
                    )}
                    {active && <View style={tw`w-2.5 h-2.5 rounded-full bg-purple-500`} />}
                  </View>
                  {i < 3 && <View style={[tw`flex-1 h-0.5`, { backgroundColor: done ? '#c084fc' : 'rgba(255,255,255,0.2)' }]} />}
                </View>
                <Text style={[tw`text-[9px] font-semibold mt-1.5`, { color: done || active ? '#eeeff5' : 'rgba(255,255,255,0.4)' }]}>{step}</Text>
              </View>
            )
          })}
        </View>
      </View>
    </View>
  )
}

interface OrdersScreenProps {
  orders: any[]
  onReorder: (order: any) => void
  onTrackOrder: (order: any) => void
}

export default function OrdersScreen({ orders, onReorder, onTrackOrder }: OrdersScreenProps) {
  const [activeTab, setActiveTab] = useState('All')

  const filtered = orders.filter(o => {
    if (activeTab === 'Active') return o.status === 'on_the_way' || o.status === 'preparing' || o.status === 'pending'
    if (activeTab === 'Past') return o.status === 'delivered' || o.status === 'cancelled'
    return true
  })

  return (
    <View style={tw`flex-1`}>
      {/* Header */}
      <View style={tw`bg-white border-b border-gray-100 px-4 pt-6 pb-3`}>
        <Text style={tw`text-[24px] font-black text-gray-900`}>My Orders</Text>
        <Text style={tw`text-[13px] text-gray-400 font-medium mt-0.5`}>Track and reorder your deliveries</Text>
        
        {/* Tabs */}
        <View style={tw`flex-row gap-2 mt-3`}>
          {tabs.map(t => (
            <TouchableOpacity
              key={t}
              onPress={() => setActiveTab(t)}
              style={[
                tw`px-4 py-1.5 rounded-full`,
                {
                  backgroundColor: activeTab === t ? '#8fda58' : '#f3f4f6',
                }
              ]}
            >
              <Text style={{ color: activeTab === t ? '#ffffff' : '#6b7280', fontSize: 13, fontWeight: '600' }}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-32 pt-4`}>
        {/* Live tracker card — only show when active tab includes on_the_way */}
        {(activeTab === 'All' || activeTab === 'Active') && <LiveTracker />}

        <View style={tw`flex-col gap-3 px-4`}>
          {filtered.length === 0 ? (
            <View style={tw`items-center justify-center py-12`}>
              <Text style={tw`text-4xl mb-3`}>📦</Text>
              <Text style={tw`text-gray-400 font-medium text-sm`}>No orders found in this section</Text>
            </View>
          ) : (
            filtered.map(order => {
              const s = statusConfig[order.status] || { label: order.status, color: '#6b7280', bg: '#f3f4f6', dot: '#9ca3af' }
              return (
                <View key={order.id} style={tw`bg-white rounded-3xl overflow-hidden shadow-sm`}>
                  <View style={tw`flex-row gap-3 p-3`}>
                    <Image
                      source={{ uri: order.img || 'https://images.unsplash.com/photo-1667329829058-ac191ba4a905?w=200&h=200&fit=crop&auto=format' }}
                      style={tw`w-16 h-16 rounded-2xl`}
                      resizeMode="cover"
                    />
                    <View style={tw`flex-1 min-w-0`}>
                      <View style={tw`flex-row items-start justify-between gap-2`}>
                        <Text style={tw`font-bold text-[14px] text-gray-900`}>{order.shopName || order.shop}</Text>
                        <View
                          style={[
                            tw`rounded-full px-2 py-0.5 flex-row items-center gap-1`,
                            { backgroundColor: s.bg }
                          ]}
                        >
                          <View style={[tw`w-1.5 h-1.5 rounded-full`, { backgroundColor: s.dot }]} />
                          <Text style={{ color: s.color, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>
                            {s.label}
                          </Text>
                        </View>
                      </View>
                      <Text style={tw`text-[11px] text-gray-400 font-medium mt-0.5`} numberOfLines={1}>
                        {order.items.map((it: any) => typeof it === 'string' ? it : `${it.quantity || it.qty}x ${it.name}`).join(' · ')}
                      </Text>
                      {/* Delivery Mode & Slot & Venue Details */}
                      <View style={tw`flex-row flex-wrap items-center gap-1.5 mt-1.5`}>
                        <View style={tw`bg-gray-100 rounded-md px-1.5 py-0.5`}>
                          <Text style={tw`text-[9px] text-gray-500 font-bold uppercase`}>
                            {order.deliveryMode === 'instant' ? '⚡ Instant' : `📅 Slot: ${order.selectedSlotLabel || 'Regular'}`}
                          </Text>
                        </View>
                        <View style={tw`bg-gray-100 rounded-md px-1.5 py-0.5`}>
                          <Text style={tw`text-[9px] text-gray-500 font-bold uppercase`} numberOfLines={1}>
                            📍 {order.deliveryVenue || 'IIIT Trichy Main Gate'}
                          </Text>
                        </View>
                      </View>
                      <View style={tw`flex-row items-center justify-between mt-2`}>
                        <Text style={tw`text-[12px] text-gray-500 font-medium`}>
                          {order.date || new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                        <Text style={tw`font-black text-[14px] text-gray-900`}>₹{order.totalAmount || order.total}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Actions */}
                  <View style={tw`border-t border-gray-100 flex-row`}>
                    <TouchableOpacity
                      onPress={() => onTrackOrder(order)}
                      style={tw`flex-1 py-2.5 items-center justify-center`}
                    >
                      <Text style={tw`text-[12px] font-semibold text-gray-500`}>View details</Text>
                    </TouchableOpacity>
                    <View style={tw`w-px bg-gray-100`} />
                    {order.status === 'delivered' || order.status === 'cancelled' ? (
                      <TouchableOpacity
                        onPress={() => onReorder(order)}
                        style={tw`flex-1 py-2.5 items-center justify-center`}
                      >
                        <Text style={[tw`text-[12px] font-bold`, { color: '#8fda58' }]}>Reorder</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => onTrackOrder(order)}
                        style={tw`flex-1 py-2.5 items-center justify-center`}
                      >
                        <Text style={tw`text-[12px] font-bold text-blue-600`}>Track order</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )
            })
          )}
        </View>
      </ScrollView>
    </View>
  )
}
