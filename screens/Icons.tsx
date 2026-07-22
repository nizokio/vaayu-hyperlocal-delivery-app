import React from 'react'
import Svg, { Path, Circle, Polyline, Line, Polygon } from 'react-native-svg'

interface IconProps {
  color?: string
  size?: number
}

interface ActiveIconProps {
  active: boolean
}

export function IconMapPin({ color = 'currentColor', size = 14 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <Circle cx="12" cy="10" r="3"/>
    </Svg>
  )
}

export function IconChevronDown({ color = 'currentColor', size = 12 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="6 9 12 15 18 9"/>
    </Svg>
  )
}

export function IconSearch({ color = 'currentColor', size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="11" cy="11" r="8"/>
      <Line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </Svg>
  )
}

export function IconScan({ color = 'currentColor', size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 7V5a2 2 0 0 1 2-2h2"/>
      <Path d="M17 3h2a2 2 0 0 1 2 2v2"/>
      <Path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
      <Path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
      <Line x1="7" y1="12" x2="17" y2="12"/>
    </Svg>
  )
}

export function IconCart({ color = 'currentColor', size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="9" cy="21" r="1"/>
      <Circle cx="20" cy="21" r="1"/>
      <Path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </Svg>
  )
}

export function IconBell({ color = 'currentColor', size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <Path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </Svg>
  )
}

export function IconHome({ active }: ActiveIconProps) {
  const c = active ? '#ffffff' : '#6b7280'
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill={active ? c : 'none'} stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <Polyline points="9 22 9 12 15 12 15 22"/>
    </Svg>
  )
}

export function IconBag({ active }: ActiveIconProps) {
  const c = active ? '#ffffff' : '#6b7280'
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill={active ? c : 'none'} stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <Line x1="3" y1="6" x2="21" y2="6"/>
      <Path d="M16 10a4 4 0 0 1-8 0"/>
    </Svg>
  )
}

export function IconNavCart({ active }: ActiveIconProps) {
  const c = active ? '#ffffff' : '#6b7280'
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill={active ? c : 'none'} stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="9" cy="21" r="1"/>
      <Circle cx="20" cy="21" r="1"/>
      <Path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </Svg>
  )
}

export function IconUser({ active }: ActiveIconProps) {
  const c = active ? '#ffffff' : '#6b7280'
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill={active ? c : 'none'} stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <Circle cx="12" cy="7" r="4"/>
    </Svg>
  )
}

export function IconStar({ color = '#f59e0b', size = 11 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
      <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </Svg>
  )
}

export function IconArrowRight({ color = 'currentColor', size = 16 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Line x1="5" y1="12" x2="19" y2="12"/>
      <Polyline points="12 5 19 12 12 19"/>
    </Svg>
  )
}

export function IconClock({ color = 'currentColor', size = 12 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10"/>
      <Polyline points="12 6 12 12 16 14"/>
    </Svg>
  )
}

export function IconPercent({ color = 'currentColor', size = 12 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <Line x1="19" y1="5" x2="5" y2="19"/>
      <Circle cx="6.5" cy="6.5" r="2.5"/>
      <Circle cx="17.5" cy="17.5" r="2.5"/>
    </Svg>
  )
}

export function IconArrowLeft({ color = 'currentColor', size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <Line x1="19" y1="12" x2="5" y2="12"/>
      <Polyline points="12 19 5 12 12 5"/>
    </Svg>
  )
}
