export const CONFIG = {
  allowedDomains: ['iiitt.ac.in'], // Whitelist for registration (MVP)
  fixedDeliveryVenue: 'IIIT Trichy main gate',
  fees: {
    regular: { deliveryFee: 5, platformFee: 5 },
    instant: { deliveryFee: 10, platformFee: 5 }
  },
  deliverySlots: [
    { id: 'slot_1', label: '12:00 PM – 2:00 PM', cutoffHour: 11 }, // 11:00 AM cutoff
    { id: 'slot_2', label: '7:00 PM – 9:00 PM', cutoffHour: 18 }   // 6:00 PM cutoff
  ]
}
