import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native'
import tw from 'twrnc'
import Svg, { Path, Line, Polyline } from 'react-native-svg'

const promos = ['CAMPUS50', 'FIRSTORDER', 'FLAT30']

interface CartScreenProps {
  cartItems: any[]
  cartShop: any
  changeQuantity: (id: string, diff: number) => void
  placeOrder: (finalTotal: number, discount: number, appliedPromo: string, deliveryMode: 'regular' | 'instant', selectedSlotId?: string) => void
  address: { area: string; room: string; landmark: string }
  setAddress: React.Dispatch<React.SetStateAction<{ area: string; room: string; landmark: string }>>
  onContinueShopping: () => void
}

function QtyButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <TouchableOpacity
      onPress={onClick}
      style={[
        tw`w-7 h-7 rounded-full items-center justify-center`,
        { backgroundColor: '#f3f4f6' }
      ]}
    >
      <Text style={[tw`font-bold text-base`, { color: '#8fda58' }]}>{label}</Text>
    </TouchableOpacity>
  )
}

export default function CartScreen({
  cartItems,
  cartShop,
  changeQuantity,
  placeOrder,
  address,
  setAddress,
  onContinueShopping
}: CartScreenProps) {
  const [promoInput, setPromoInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState('')
  const [promoError, setPromoError] = useState('')
  const [placed, setPlaced] = useState(false)
  const [placedOrderDetails, setPlacedOrderDetails] = useState<any>(null)
  const [deliveryMode, setDeliveryMode] = useState<'regular' | 'instant'>('regular')
  const [selectedSlotId, setSelectedSlotId] = useState('slot_1')
  const [feesExpanded, setFeesExpanded] = useState(false)

  const slots = [
    { id: 'slot_1', label: '12:00 PM – 2:00 PM' },
    { id: 'slot_2', label: '7:00 PM – 9:00 PM' }
  ]

  const applyPromo = () => {
    if (promos.includes(promoInput.toUpperCase())) {
      setAppliedPromo(promoInput.toUpperCase())
      setPromoError('')
    } else {
      setPromoError('Invalid promo code')
      setAppliedPromo('')
    }
  }

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * (i.quantity || i.qty), 0)
  const otherCharges = subtotal === 0 ? 0 : deliveryMode === 'regular' ? 10 : 15
  const deliveryFee = subtotal === 0 ? 0 : deliveryMode === 'regular' ? 5 : 10
  const platformFee = subtotal === 0 ? 0 : 5
  const discount = appliedPromo ? Math.round(subtotal * 0.2) : 0
  const total = subtotal + otherCharges - discount

  const handlePlaceOrder = () => {
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`
    setPlacedOrderDetails({
      orderId,
      total,
    })
    setPlaced(true)
    // Execute global place order to add to tracking
    placeOrder(total, discount, appliedPromo, deliveryMode, deliveryMode === 'regular' ? selectedSlotId : undefined)
  }

  if (placed) {
    return (
      <View style={tw`flex-1 items-center justify-center px-6 text-center bg-white`}>
        <View style={tw`w-24 h-24 rounded-full bg-gray-100 items-center justify-center mb-6`}>
          <Text style={tw`text-5xl`}>🎉</Text>
        </View>
        <Text style={tw`text-[24px] font-black text-gray-900 mb-2`}>Order Placed!</Text>
        <Text style={tw`text-[14px] text-gray-500 font-medium mb-1`}>Your order is being prepared.</Text>
        <Text style={tw`text-[14px] text-gray-500 font-medium mb-8`}>
          Estimated delivery: <Text style={tw`font-bold text-gray-700`}>20–25 min</Text>
        </Text>
        <View style={[tw`border rounded-2xl px-6 py-4 mb-8 w-full`, { backgroundColor: '#eeeff5', borderColor: '#eeeff5' }]}>
          <Text style={[tw`text-[13px] font-semibold text-center`, { color: '#8fda58' }]}>
            Order ID: <Text style={[tw`font-black`, { color: '#8fda58' }]}>{placedOrderDetails?.orderId || '#ORD-9012'}</Text>
          </Text>
          <Text style={[tw`text-[13px] font-semibold mt-1 text-center`, { color: '#8fda58' }]}>
            Total paid: <Text style={[tw`font-black`, { color: '#8fda58' }]}>₹{placedOrderDetails?.total}</Text>
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setPlaced(false)
            setAppliedPromo('')
            setPromoInput('')
            onContinueShopping()
          }}
          style={[tw`w-full py-4 rounded-2xl items-center`, { backgroundColor: '#8fda58' }]}
        >
          <Text style={tw`text-[15px] font-bold text-white`}>Continue shopping</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (cartItems.length === 0) {
    return (
      <View style={tw`flex-1 items-center justify-center px-6 text-center bg-white`}>
        <View style={tw`w-24 h-24 rounded-full bg-gray-100 items-center justify-center mb-6`}>
          <Text style={tw`text-5xl`}>🛒</Text>
        </View>
        <Text style={tw`text-[22px] font-black text-gray-900 mb-2`}>Your cart is empty</Text>
        <Text style={tw`text-[14px] text-gray-400 font-medium`}>Add items from a shop to get started.</Text>
        <TouchableOpacity
          onPress={onContinueShopping}
          style={[tw`px-6 py-3 rounded-xl mt-6`, { backgroundColor: '#8fda58' }]}
        >
          <Text style={tw`text-white font-bold text-xs`}>Go Shopping</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={tw`flex-1`}>
      {/* Header */}
      <View style={tw`bg-white border-b border-gray-100 px-4 pt-6 pb-4`}>
        <Text style={tw`text-[24px] font-black text-gray-900`}>Your Cart</Text>
        <Text style={tw`text-[13px] text-gray-400 font-medium mt-0.5`}>
          {cartItems.reduce((s, i) => s + (i.quantity || i.qty), 0)} items from {cartShop?.name}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-36`}>
        {/* Items */}
        <View style={tw`px-4 pt-4 flex-col gap-3`}>
          {cartItems.map(item => (
            <View key={item.id} style={tw`bg-white rounded-3xl p-3 shadow-sm flex-row items-center gap-3`}>
              <Image
                source={{ uri: item.img || 'https://images.unsplash.com/photo-1667329829058-ac191ba4a905?w=200&h=200&fit=crop&auto=format' }}
                style={tw`w-16 h-16 rounded-2xl`}
                resizeMode="cover"
              />
              <View style={tw`flex-1 min-w-0`}>
                <Text style={tw`font-bold text-[14px] text-gray-900`} numberOfLines={1}>{item.name}</Text>
                <Text style={tw`text-[11px] text-gray-400 font-medium`}>{cartShop?.name}</Text>
                <Text style={tw`font-black text-[14px] text-gray-900 mt-1`}>₹{item.price}</Text>
              </View>
              <View style={tw`flex-row items-center gap-2 flex-none`}>
                <QtyButton label="−" onClick={() => changeQuantity(item.id, -1)} />
                <Text style={tw`text-[15px] font-black text-gray-900 w-5 text-center`}>{item.quantity || item.qty}</Text>
                <QtyButton label="+" onClick={() => changeQuantity(item.id, 1)} />
              </View>
            </View>
          ))}
        </View>

        {/* Delivery Mode Selection */}
        <View style={tw`mx-4 mt-4 bg-white rounded-3xl p-4 shadow-sm`}>
          <Text style={tw`text-gray-900 text-xs font-bold mb-3 uppercase tracking-wider`}>Delivery Mode</Text>
          <View style={tw`flex-row gap-3 mb-3`}>
            <TouchableOpacity
              onPress={() => setDeliveryMode('regular')}
              style={[
                tw`flex-1 p-3 rounded-2xl border-2 items-center`,
                { borderColor: deliveryMode === 'regular' ? '#8fda58' : '#e5e7eb', backgroundColor: deliveryMode === 'regular' ? '#eeeff5' : '#ffffff' }
              ]}
            >
              <Text style={tw`text-lg mb-1`}>📅</Text>
              <Text style={tw`text-xs font-bold text-gray-800`}>Regular Slot</Text>
              <Text style={tw`text-[10px] text-gray-400 font-medium mt-0.5`}>Fee: ₹10 · Batched</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setDeliveryMode('instant')}
              style={[
                tw`flex-1 p-3 rounded-2xl border-2 items-center`,
                { borderColor: deliveryMode === 'instant' ? '#8fda58' : '#e5e7eb', backgroundColor: deliveryMode === 'instant' ? '#eeeff5' : '#ffffff' }
              ]}
            >
              <Text style={tw`text-lg mb-1`}>⚡</Text>
              <Text style={tw`text-xs font-bold text-gray-800`}>Instant ASAP</Text>
              <Text style={tw`text-[10px] text-gray-400 font-medium mt-0.5`}>Fee: ₹15 · Individual</Text>
            </TouchableOpacity>
          </View>

          {/* Slot Selector (for regular mode) */}
          {deliveryMode === 'regular' && (
            <View style={tw`mt-2`}>
              <Text style={tw`text-[10px] font-bold text-gray-400 uppercase mb-1.5`}>Select Delivery Slot</Text>
              <View style={tw`flex-col gap-2`}>
                {slots.map(s => {
                  const isSelected = selectedSlotId === s.id
                  return (
                    <TouchableOpacity
                      key={s.id}
                      onPress={() => setSelectedSlotId(s.id)}
                      style={[
                        tw`w-full p-2.5 rounded-xl border flex-row items-center justify-between px-4`,
                        { borderColor: isSelected ? '#8fda58' : '#e5e7eb', backgroundColor: isSelected ? '#eeeff5' : '#f9fafb' }
                      ]}
                    >
                      <Text style={tw`text-xs font-bold text-gray-700`}>{s.label}</Text>
                      {isSelected && <View style={tw`w-2 h-2 rounded-full bg-[#8fda58]`} />}
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          )}
        </View>

        {/* Delivery Venue & Hostel Details */}
        <View style={tw`mx-4 mt-4 bg-white rounded-3xl p-4 shadow-sm`}>
          <Text style={tw`text-gray-900 text-xs font-bold mb-3 uppercase tracking-wider`}>Delivery Details</Text>
          <View style={tw`mb-3`}>
            <Text style={tw`text-[10px] font-bold text-gray-400 uppercase`}>Fixed Delivery Venue</Text>
            <View style={tw`bg-gray-100 border border-gray-100 rounded-lg p-2.5 mt-1`}>
              <Text style={tw`text-xs font-bold text-gray-700`}>IIIT Trichy main gate</Text>
            </View>
          </View>
          <View style={tw`flex-row gap-3 mb-3`}>
            <View style={tw`flex-1`}>
              <Text style={tw`text-[10px] font-bold text-gray-400 uppercase`}>Hostel / Block</Text>
              <TextInput
                value={address.area}
                placeholder="e.g. Block A"
                placeholderTextColor="#9ca3af"
                onChangeText={text => setAddress(prev => ({ ...prev, area: text }))}
                style={tw`w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-xs font-semibold text-gray-800 mt-1`}
              />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-[10px] font-bold text-gray-400 uppercase`}>Room Number</Text>
              <TextInput
                value={address.room}
                placeholder="e.g. Room 102"
                placeholderTextColor="#9ca3af"
                onChangeText={text => setAddress(prev => ({ ...prev, room: text }))}
                style={tw`w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-xs font-semibold text-gray-800 mt-1`}
              />
            </View>
          </View>
          <View>
            <Text style={tw`text-[10px] font-bold text-gray-400 uppercase`}>Landmark / Notes</Text>
            <TextInput
              value={address.landmark}
              placeholder="e.g. Near reception"
              placeholderTextColor="#9ca3af"
              onChangeText={text => setAddress(prev => ({ ...prev, landmark: text }))}
              style={tw`w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-xs font-semibold text-gray-800 mt-1`}
            />
          </View>
        </View>

        {/* Promo code */}
        <View style={tw`mx-4 mt-4 bg-white rounded-3xl p-4 shadow-sm`}>
          <Text style={tw`text-[13px] font-bold text-gray-700 mb-2`}>Promo code</Text>
          <View style={tw`flex-row gap-2`}>
            <TextInput
              placeholder="Enter code (try CAMPUS50)"
              value={promoInput}
              onChangeText={text => { setPromoInput(text); setPromoError('') }}
              autoCapitalize="characters"
              placeholderTextColor="#9ca3af"
              style={tw`flex-1 bg-gray-100 rounded-xl px-3 py-2 text-[13px] font-medium text-gray-700`}
            />
            <TouchableOpacity
              onPress={applyPromo}
              style={[tw`px-4 py-2 rounded-xl justify-center`, { backgroundColor: '#8fda58' }]}
            >
              <Text style={tw`text-[13px] font-bold text-white`}>Apply</Text>
            </TouchableOpacity>
          </View>
          {appliedPromo ? (
            <Text style={[tw`text-[12px] font-semibold mt-2`, { color: '#8fda58' }]}>✓ {appliedPromo} applied — 20% off!</Text>
          ) : null}
          {promoError ? (
            <Text style={tw`text-[12px] text-red-500 font-semibold mt-2`}>{promoError}</Text>
          ) : null}
        </View>



        {/* Payment mode banner */}
        <View style={[tw`mx-4 mt-3 border rounded-2xl p-4 flex-row gap-3`, { backgroundColor: '#eeeff5', borderColor: '#eeeff5' }]}>
          <Text style={tw`text-xl`}>💵</Text>
          <View style={tw`flex-1`}>
            <Text style={[tw`text-[13px] font-bold`, { color: '#2e1065' }]}>Cash / UPI on Delivery Only</Text>
            <Text style={[tw`text-[11px] font-medium leading-relaxed mt-0.5`, { color: '#8fda58' }]}>
              Pay the deliverer staff directly in cash or scan their UPI QR when the order reaches your room.
            </Text>
          </View>
        </View>

        {/* Bill summary */}
        <View style={tw`mx-4 mt-3 bg-white rounded-3xl p-4 shadow-sm`}>
          <Text style={tw`text-[14px] font-bold text-gray-900 mb-3`}>Bill summary</Text>
          <View style={tw`flex-col gap-2`}>
            <View style={tw`flex-row justify-between`}>
              <Text style={tw`text-[13px] text-gray-500 font-medium`}>Subtotal</Text>
              <Text style={tw`text-[13px] font-semibold text-gray-800`}>₹{subtotal}</Text>
            </View>
            <View style={tw`flex-col`}>
              <TouchableOpacity
                onPress={() => setFeesExpanded(!feesExpanded)}
                style={tw`flex-row justify-between items-center py-0.5`}
              >
                <View style={tw`flex-row items-center gap-1`}>
                  <Text style={tw`text-[13px] text-gray-500 font-medium`}>Other charges</Text>
                  <Svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <Polyline points={feesExpanded ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}/>
                  </Svg>
                </View>
                <Text style={tw`text-[13px] font-semibold text-gray-800`}>₹{otherCharges}</Text>
              </TouchableOpacity>

              {feesExpanded && (
                <View style={tw`bg-gray-50 rounded-xl px-3 py-2 mt-1.5 flex-col gap-1.5 border border-gray-100`}>
                  <View style={tw`flex-row justify-between`}>
                    <Text style={tw`text-[11px] text-gray-400 font-medium`}>Delivery fee</Text>
                    <Text style={tw`text-[11px] font-semibold text-gray-600`}>₹{deliveryFee}</Text>
                  </View>
                  <View style={tw`flex-row justify-between`}>
                    <Text style={tw`text-[11px] text-gray-400 font-medium`}>Platform fee</Text>
                    <Text style={tw`text-[11px] font-semibold text-gray-600`}>₹{platformFee}</Text>
                  </View>
                </View>
              )}
            </View>
            {discount > 0 ? (
              <View style={tw`flex-row justify-between`}>
                <Text style={[tw`text-[13px] font-medium`, { color: '#8fda58' }]}>Promo discount</Text>
                <Text style={[tw`text-[13px] font-semibold`, { color: '#8fda58' }]}>−₹{discount}</Text>
              </View>
            ) : null}
            <View style={tw`border-t border-gray-100 pt-2 mt-1 flex-row justify-between`}>
              <Text style={tw`text-[15px] font-black text-gray-900`}>Total</Text>
              <Text style={tw`text-[15px] font-black text-gray-900`}>₹{total}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button Capsule */}
      <View style={tw`absolute bottom-0 inset-x-0 bg-white border-t border-gray-100 px-4 pt-3 pb-24 flex-row`}>
        <TouchableOpacity
          onPress={handlePlaceOrder}
          style={[tw`w-full py-4 rounded-2xl flex-row items-center justify-between px-6 shadow-md`, { backgroundColor: '#8fda58' }]}
        >
          <Text style={tw`text-[16px] font-black text-white`}>Place order (COD)</Text>
          <View style={tw`flex-row items-center gap-1.5`}>
            <Text style={[tw`text-[15px] font-bold`, { color: '#c084fc' }]}>₹{total}</Text>
            <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <Line x1="5" y1="12" x2="19" y2="12"/>
              <Polyline points="12 5 19 12 12 19"/>
            </Svg>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}
