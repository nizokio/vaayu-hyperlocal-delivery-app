import { useState } from 'react'

type Role = 'customer' | 'owner'
type Step = 'role' | 'details' | 'verify'

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 text-gray-500 font-semibold text-[13px] mb-6 cursor-pointer hover:text-gray-900 transition-colors">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
      Back
    </button>
  )
}

function InputField({
  label, placeholder, type = 'text', value, onChange, hint, error
}: {
  label: string; placeholder: string; type?: string
  value: string; onChange: (v: string) => void; hint?: string; error?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-bold text-gray-600 uppercase tracking-wider">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-gray-100/90 rounded-2xl px-4 py-3.5 text-[14px] font-medium text-gray-800 placeholder-gray-400 outline-none focus:bg-white focus:ring-2 focus:ring-green-500/30 transition-all border border-transparent focus:border-green-500/40"
      />
      {error ? (
        <p className="text-[11px] text-red-500 font-semibold px-1">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-gray-400 font-medium px-1">{hint}</p>
      ) : null}
    </div>
  )
}

function PrimaryButton({ label, onClick, disabled = false }: { label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-4 rounded-2xl text-[15px] font-black text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed"
      style={{ backgroundColor: disabled ? '#9ca3af' : '#1a3a2a' }}
    >
      {label}
      {!disabled && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5" y1="12" x2="19" y2="12"/>
        </svg>
      )}
    </button>
  )
}

// ── Role selection ────────────────────────────────────────────────────────────

function RoleCard({
  emoji, title, description, features, selected, onClick
}: {
  emoji: string; title: string; description: string
  features: string[]; selected: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-3xl p-4 border-2 transition-all active:scale-[0.98] cursor-pointer"
      style={{
        borderColor: selected ? '#1a3a2a' : '#e5e7eb',
        backgroundColor: selected ? '#f0fdf4' : '#ffffff',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-none"
          style={{ backgroundColor: selected ? '#dcfce7' : '#f3f4f6' }}
        >
          {emoji}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-[16px] font-black text-gray-900">{title}</p>
            <div
              className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-none transition-all"
              style={{ borderColor: selected ? '#1a3a2a' : '#d1d5db', backgroundColor: selected ? '#1a3a2a' : 'transparent' }}
            >
              {selected && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </div>
          </div>
          <p className="text-[12px] text-gray-500 font-medium mt-0.5">{description}</p>
          <div className="flex flex-col gap-1 mt-3">
            {features.map(f => (
              <div key={f} className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selected ? '#16a34a' : '#9ca3af' }} />
                <p className="text-[11px] font-semibold" style={{ color: selected ? '#16a34a' : '#9ca3af' }}>{f}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </button>
  )
}

function RoleStep({ onSelect }: { onSelect: (r: Role) => void }) {
  const [selected, setSelected] = useState<Role | null>(null)

  return (
    <div className="flex flex-col flex-1 px-5 pt-16 pb-6">
      {/* Logo mark */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl text-white font-bold" style={{ backgroundColor: '#8fda58' }}>
          ⚡
        </div>
        <span className="text-[20px] font-black text-gray-900 tracking-tight">vaayu</span>
      </div>

      <h1 className="text-[28px] font-black text-gray-900 leading-tight mb-1">Join the campus<br/>community</h1>
      <p className="text-[14px] text-gray-400 font-medium mb-8">Choose how you'd like to use Vaayu.</p>

      <div className="flex flex-col gap-3 flex-1">
        <RoleCard
          emoji="🎓"
          title="I'm a Student"
          description="Order food, groceries & essentials delivered to your hostel or class."
          features={['Order from local campus shops', 'Live delivery tracking', 'Campus wallet & offers']}
          selected={selected === 'customer'}
          onClick={() => setSelected('customer')}
        />
        <RoleCard
          emoji="🏪"
          title="I'm a Shop Owner"
          description="List your shop and start receiving orders from students on campus."
          features={['Manage your storefront', 'Accept & track orders', 'Earnings dashboard & payouts']}
          selected={selected === 'owner'}
          onClick={() => setSelected('owner')}
        />
      </div>

      <div className="mt-6">
        <PrimaryButton
          label={selected ? `Continue as ${selected === 'customer' ? 'Student' : 'Shop Owner'}` : 'Select a role to continue'}
          disabled={!selected}
          onClick={() => selected && onSelect(selected)}
        />
        <p className="text-center text-[12px] text-gray-400 font-medium mt-4">
          Already have an account?{' '}
          <span className="text-green-600 font-bold cursor-pointer hover:underline">Sign in</span>
        </p>
      </div>
    </div>
  )
}

// ── Customer signup ───────────────────────────────────────────────────────────

function CustomerForm({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [college, setCollege] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agree, setAgree] = useState(false)

  const passwordMatch = password.length >= 6 && password === confirmPassword
  const valid = name.trim().length > 0 && email.trim().length > 0 && phone.trim().length === 10 && college.trim().length > 0 && passwordMatch && agree

  return (
    <div className="flex flex-col flex-1 px-5 pt-14 pb-6 overflow-y-auto hide-scrollbar">
      <BackButton onClick={onBack} />

      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-xl">🎓</div>
        <span className="text-[12px] font-bold text-green-600 uppercase tracking-widest">Student account</span>
      </div>
      <h1 className="text-[26px] font-black text-gray-900 leading-tight mb-1">Create your<br/>account</h1>
      <p className="text-[13px] text-gray-400 font-medium mb-6">Free forever. No card required.</p>

      <div className="flex flex-col gap-4">
        <InputField
          label="Full Name"
          placeholder="e.g. Aditya Sharma"
          value={name}
          onChange={setName}
        />
        <InputField
          label="College Email"
          placeholder="e.g. 251420@iiitt.ac.in"
          type="email"
          value={email}
          onChange={setEmail}
          hint="Enter your official IIITT email (e.g. 251420@iiitt.ac.in)"
        />
        <InputField label="Phone number" placeholder="+91 98765 43210" type="tel" value={phone} onChange={setPhone} />
        <InputField label="College / University" placeholder="IIITT Campus" value={college} onChange={setCollege} />
        <InputField label="Password" placeholder="Min. 6 characters" type="password" value={password} onChange={setPassword} />
        <InputField
          label="Confirm Password"
          placeholder="Retype password to confirm"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          error={confirmPassword && password !== confirmPassword ? "Passwords do not match" : undefined}
        />
      </div>

      {/* Terms */}
      <div
        className="flex items-start gap-3 mt-5 cursor-pointer select-none"
        onClick={() => setAgree(v => !v)}
      >
        <div
          className="w-5 h-5 rounded-md border-2 flex-none flex items-center justify-center mt-0.5 transition-all"
          style={{ borderColor: agree ? '#1a3a2a' : '#d1d5db', backgroundColor: agree ? '#1a3a2a' : 'transparent' }}
        >
          {agree && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
        </div>
        <p className="text-[12px] text-gray-500 font-medium leading-relaxed">
          I agree to the{' '}
          <span className="text-green-600 font-bold">Terms of Service</span>
          {' '}and{' '}
          <span className="text-green-600 font-bold">Privacy Policy</span>
        </p>
      </div>

      <div className="mt-6">
        <PrimaryButton label="Proceed to Email Verification" disabled={!valid} onClick={onNext} />
      </div>
    </div>
  )
}

// ── Shop owner signup ─────────────────────────────────────────────────────────

const availableCategories = ['Food', 'Grocery', 'Pharmacy', 'Stationery', 'Others']

function OwnerForm({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [ownerName, setOwnerName] = useState('')
  const [shopName, setShopName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [category, setCategory] = useState('')
  const [customCategory, setCustomCategory] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agree, setAgree] = useState(false)

  const effectiveCategory = category === 'Others' ? customCategory.trim() : category
  const passwordMatch = password.length >= 6 && password === confirmPassword
  const valid = ownerName && shopName && email && phone && address && effectiveCategory && passwordMatch && agree

  return (
    <div className="flex flex-col flex-1 px-5 pt-14 pb-6 overflow-y-auto hide-scrollbar">
      <BackButton onClick={onBack} />

      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-xl">🏪</div>
        <span className="text-[12px] font-bold text-orange-500 uppercase tracking-widest">Shop owner account</span>
      </div>
      <h1 className="text-[26px] font-black text-gray-900 leading-tight mb-1">List your<br/>shop</h1>
      <p className="text-[13px] text-gray-400 font-medium mb-6">Reach hundreds of students near you.</p>

      <div className="flex flex-col gap-4">
        <InputField label="Your name" placeholder="Ramesh Sharma" value={ownerName} onChange={setOwnerName} />
        <InputField label="Shop name" placeholder="Sharma General Store" value={shopName} onChange={setShopName} />
        <InputField label="Business email" placeholder="shop@example.com" type="email" value={email} onChange={setEmail} />
        <InputField label="Phone number" placeholder="+91 98765 43210" type="tel" value={phone} onChange={setPhone} />
        <InputField label="Shop address" placeholder="IIIT Tiruchirappalli, Gate 1" value={address} onChange={setAddress} hint="Students will use this to find you" />

        {/* Category Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-bold text-gray-600 uppercase tracking-wider">Shop category</label>
          <div className="flex flex-wrap gap-2">
            {availableCategories.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCategory(c)
                  if (c !== 'Others') setCustomCategory('')
                }}
                className="px-3.5 py-2 rounded-full text-[12px] font-bold transition-all cursor-pointer border active:scale-95"
                style={{
                  backgroundColor: category === c ? '#1a3a2a' : '#f3f4f6',
                  color: category === c ? '#ffffff' : '#4b5563',
                  borderColor: category === c ? '#1a3a2a' : '#e5e7eb',
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Category input field when 'Others' is selected */}
        {category === 'Others' && (
          <InputField
            label="Custom Category Name"
            placeholder="e.g. Books & Gifts, Printing, Electronics"
            value={customCategory}
            onChange={setCustomCategory}
            hint="Enter your own shop category name"
          />
        )}

        <InputField label="Password" placeholder="Min. 6 characters" type="password" value={password} onChange={setPassword} />
        <InputField
          label="Confirm Password"
          placeholder="Retype password to confirm"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          error={confirmPassword && password !== confirmPassword ? "Passwords do not match" : undefined}
        />
      </div>

      {/* Terms */}
      <div
        className="flex items-start gap-3 mt-4 cursor-pointer select-none"
        onClick={() => setAgree(v => !v)}
      >
        <div
          className="w-5 h-5 rounded-md border-2 flex-none flex items-center justify-center mt-0.5 transition-all"
          style={{ borderColor: agree ? '#1a3a2a' : '#d1d5db', backgroundColor: agree ? '#1a3a2a' : 'transparent' }}
        >
          {agree && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
        </div>
        <p className="text-[12px] text-gray-500 font-medium leading-relaxed">
          I agree to the{' '}
          <span className="text-green-600 font-bold">Merchant Terms</span>
          {' '}and{' '}
          <span className="text-green-600 font-bold">Privacy Policy</span>
        </p>
      </div>

      <div className="mt-6">
        <PrimaryButton label="Proceed to Email Verification" disabled={!valid} onClick={onNext} />
      </div>
    </div>
  )
}

// ── Email OTP verify (Enters App directly upon OTP entry, Post-verification screen removed) ──────────────

function VerifyStep({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [otp, setOtp] = useState(['', '', '', ''])

  const handleOtp = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[idx] = val
    setOtp(next)
    if (val && idx < 3) {
      document.getElementById(`otp-${idx + 1}`)?.focus()
    } else if (val && idx === 3) {
      // Complete verification and open app directly!
      onComplete()
    }
  }

  const handleKey = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus()
    }
  }

  const filled = otp.every(d => d !== '')

  return (
    <div className="flex flex-col flex-1 px-5 pt-20 pb-6">
      <BackButton onClick={onBack} />

      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-xs" style={{ backgroundColor: '#f0fdf4' }}>
        📧
      </div>
      <h1 className="text-[26px] font-black text-gray-900 leading-tight mb-2">Verify your<br/>email</h1>
      <p className="text-[13px] text-gray-400 font-medium mb-8">
        We sent a 4-digit code to your email address. Enter it below.
      </p>

      {/* OTP boxes */}
      <div className="flex gap-3 justify-center mb-8">
        {otp.map((digit, i) => (
          <input
            key={i}
            id={`otp-${i}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleOtp(e.target.value, i)}
            onKeyDown={e => handleKey(e, i)}
            className="w-16 h-16 text-center text-[24px] font-black rounded-2xl border-2 outline-none transition-all"
            style={{
              borderColor: digit ? '#1a3a2a' : '#e5e7eb',
              backgroundColor: digit ? '#f0fdf4' : '#f9fafb',
              color: '#1a3a2a',
            }}
          />
        ))}
      </div>

      <PrimaryButton label="Verify & Enter App" disabled={!filled} onClick={onComplete} />

      <p className="text-center text-[12px] text-gray-400 font-medium mt-4">
        Didn't receive it?{' '}
        <span className="text-green-600 font-bold cursor-pointer hover:underline">Resend code to email (30s)</span>
      </p>
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function SignupScreen({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState<Step>('role')
  const [role, setRole] = useState<Role>('customer')

  const handleRole = (r: Role) => {
    setRole(r)
    setStep('details')
  }

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {step === 'role' && <RoleStep onSelect={handleRole} />}
      {step === 'details' && role === 'customer' && (
        <CustomerForm onNext={() => setStep('verify')} onBack={() => setStep('role')} />
      )}
      {step === 'details' && role === 'owner' && (
        <OwnerForm onNext={() => setStep('verify')} onBack={() => setStep('role')} />
      )}
      {step === 'verify' && (
        <VerifyStep onComplete={onDone} onBack={() => setStep('details')} />
      )}
    </div>
  )
}
