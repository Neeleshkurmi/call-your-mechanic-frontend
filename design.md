# Call Your Mechanic - Mobile App Design

## Design Philosophy

The "Call Your Mechanic" app follows a **clean, automotive-inspired aesthetic** with a professional, trust-building visual language. The design prioritizes clarity, accessibility, and one-handed mobile usage in portrait orientation (9:16).

---

## Color Palette

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| **Deep Slate** | `#1a2332` | `#0f1419` | Primary text, headers, dark accents |
| **Amber Orange** | `#ff9500` | `#ffb84d` | Primary CTA buttons, highlights, success states |
| **Light Gray** | `#f5f5f5` | `#2a2e35` | Backgrounds, surfaces, card containers |
| **Neutral Gray** | `#6b7280` | `#9ca3af` | Secondary text, disabled states |
| **Error Red** | `#ef4444` | `#f87171` | Validation errors, error states |
| **Success Green** | `#22c55e` | `#4ade80` | Success confirmations, valid inputs |

---

## Screen List

### 1. **Request OTP Screen** (`/auth/otp/request`)
**Purpose:** Collect user's phone number and initiate OTP flow.

**Content & Functionality:**
- **Header:** "Enter Your Mobile Number" (centered, Deep Slate, 24px bold)
- **Subheader:** "We'll send you a verification code" (Neutral Gray, 14px)
- **Phone Number Input:**
  - International prefix selector (default: +91, dropdown)
  - Text input field for phone number (11 digits for India)
  - Placeholder: "9876543210"
  - Validation: E.164 format (e.g., +919876543210)
  - Error state: Red border + helper text "Mobile must be in E.164 format"
- **Send Code Button:** Large, full-width, Amber Orange, 48px height, 8px border radius
- **Loading State:** Spinner overlay, button disabled
- **Success:** Toast notification, transition to Verify OTP Screen

**Key User Flow:**
1. User enters phone number
2. Taps "Send Code"
3. API validates E.164 format
4. On success: Toast "Code sent to +91XXXXXXXXXX" → Navigate to Verify OTP
5. On error: Display error message in red below input

---

### 2. **Verify OTP Screen** (`/auth/otp/verify`)
**Purpose:** Verify OTP and select user role (User or Mechanic).

**Content & Functionality:**
- **Header:** "Enter Verification Code" (centered, Deep Slate, 24px bold)
- **Mobile Number Display:**
  - "+91XXXXXXXXXX" (Neutral Gray, 14px)
  - "Edit" link (Amber Orange, tappable to return to Request OTP)
- **6-Digit PIN Input:**
  - 6 individual input boxes (each 48x48px, Deep Slate border, Amber Orange focus)
  - Auto-advance to next box on digit entry
  - Backspace support
- **Role Selection (Segmented Control):**
  - Two options: "USER" | "MECHANIC"
  - Active option: Amber Orange background, white text
  - Inactive: Light Gray background, Deep Slate text
  - Default: "USER"
- **Verify Button:** Large, full-width, Amber Orange, 48px height
- **Loading State:** Spinner, button disabled
- **Success Toast:** "Verification successful!" → Navigate to Home/Profile
- **Error State:** Red text below PIN input, shake animation

**Key User Flow:**
1. User enters 6-digit OTP
2. Selects role (USER or MECHANIC)
3. Taps "Verify"
4. API validates OTP + role
5. On success: Store accessToken, Toast notification, navigate to Home
6. On error: Display error message, allow retry

---

### 3. **Role Management / Profile Screen** (`/auth/user/role`)
**Purpose:** Allow users to toggle their role and manage profile settings.

**Content & Functionality:**
- **Header:** "Profile Settings" (centered, Deep Slate, 24px bold)
- **Current Role Display:**
  - Card showing current role (USER or MECHANIC)
  - Role-specific icon (wrench for MECHANIC, user icon for USER)
  - Role-specific background color (USER: Light Gray, MECHANIC: Deep Slate)
- **Role Toggle:**
  - Segmented control: "USER" | "MECHANIC"
  - Active option: Amber Orange background, white text
  - Tap to switch role
- **Confirmation Modal:**
  - Title: "Change Role?"
  - Message: "You are switching from [Current Role] to [New Role]. This will update your permissions."
  - Buttons: "Cancel" (Light Gray) | "Confirm" (Amber Orange)
  - On confirm: API POST to `/auth/user/role`
- **Success Toast:** "User role updated successfully"
- **Theme Switching:**
  - USER role: Light theme (Light Gray background, Deep Slate text)
  - MECHANIC role: Dark theme (Deep Slate background, Light Gray text)

**Key User Flow:**
1. User views current role
2. Taps to switch role
3. Confirmation modal appears
4. User confirms
5. API updates role
6. Toast notification, UI updates to reflect new role + theme

---

## Key User Flows

### Flow 1: New User Registration
```
Request OTP Screen
  ↓ (Enter phone + tap Send Code)
Verify OTP Screen
  ↓ (Enter OTP + select role + tap Verify)
Home / Profile Screen
```

### Flow 2: Role Change
```
Profile Screen
  ↓ (Tap role toggle)
Confirmation Modal
  ↓ (Confirm)
API POST /auth/user/role
  ↓ (Success)
Profile Screen (updated theme + role)
```

### Flow 3: Edit Phone Number
```
Verify OTP Screen
  ↓ (Tap "Edit" link)
Request OTP Screen
  ↓ (Enter new phone + tap Send Code)
Verify OTP Screen (with new phone)
```

---

## Typography

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| **Headers** | Montserrat | 24px | Bold (700) | Deep Slate |
| **Subheaders** | Montserrat | 16px | SemiBold (600) | Deep Slate |
| **Body Text** | Montserrat | 14px | Regular (400) | Deep Slate |
| **Helper Text** | Montserrat | 12px | Regular (400) | Neutral Gray |
| **Error Text** | Montserrat | 12px | Regular (400) | Error Red |
| **Button Text** | Montserrat | 16px | SemiBold (600) | White / Deep Slate |

---

## Component Specifications

### Buttons
- **Primary Button (CTA):**
  - Background: Amber Orange
  - Text: White, Montserrat 16px SemiBold
  - Height: 48px
  - Border Radius: 8px
  - Padding: 12px horizontal
  - Press State: Scale 0.97, opacity 0.9
  - Disabled: Opacity 0.5

- **Secondary Button:**
  - Background: Light Gray
  - Text: Deep Slate, Montserrat 16px SemiBold
  - Height: 48px
  - Border Radius: 8px
  - Press State: Opacity 0.7

### Input Fields
- **Phone Input:**
  - Height: 48px
  - Border: 1px, Neutral Gray
  - Border Radius: 8px
  - Padding: 12px
  - Focus: Border color → Amber Orange
  - Error: Border color → Error Red

- **PIN Input (6 digits):**
  - Each box: 48x48px
  - Border: 1px, Neutral Gray
  - Border Radius: 8px
  - Focus: Border → Amber Orange, background → Light Gray
  - Text: Deep Slate, 18px, centered

### Cards
- **Role Card:**
  - Background: Light Gray (USER) / Deep Slate (MECHANIC)
  - Border Radius: 12px
  - Padding: 16px
  - Shadow: Subtle (0.5px blur, 0.1 opacity)
  - Text: Deep Slate (USER) / Light Gray (MECHANIC)

### Segmented Control
- **Container:**
  - Background: Light Gray
  - Border Radius: 8px
  - Padding: 4px
  - Height: 40px

- **Active Segment:**
  - Background: Amber Orange
  - Text: White
  - Border Radius: 6px

- **Inactive Segment:**
  - Background: Transparent
  - Text: Deep Slate
  - Border Radius: 6px

### Modal
- **Overlay:** Semi-transparent black (0.5 opacity)
- **Container:**
  - Background: Light Gray
  - Border Radius: 16px
  - Padding: 24px
  - Shadow: Elevated (4px blur, 0.2 opacity)

- **Title:** Deep Slate, 18px Bold
- **Message:** Neutral Gray, 14px Regular
- **Buttons:** Arranged horizontally, 48px height

### Toast Notification
- **Success:** Green background, white text, 4px border radius, 2px padding
- **Error:** Red background, white text, 4px border radius, 2px padding
- **Duration:** 3 seconds, fade out animation

### Loading Spinner
- **Color:** Amber Orange
- **Size:** 40px
- **Animation:** Smooth rotation, 1s duration

---

## Validation & Error Handling

### Phone Number Validation
- **Format:** E.164 (e.g., +919876543210)
- **Error Message:** "Mobile must be in E.164 format"
- **Visual Feedback:** Red border, error text below input

### OTP Validation
- **Format:** 6 digits
- **Error Message:** "Invalid OTP. Please try again."
- **Visual Feedback:** Red text below PIN input, shake animation

### Role Selection
- **Requirement:** Must select before verifying
- **Default:** "USER"
- **Error Message:** "Please select a role to continue"

---

## Accessibility

- **Color Contrast:** All text meets WCAG AA standards (4.5:1 ratio)
- **Touch Targets:** Minimum 44x44px for all interactive elements
- **Font Sizes:** Minimum 14px for body text
- **Labels:** All inputs have associated labels
- **Haptic Feedback:** Light haptic on button press (iOS)

---

## Responsive Design

- **Portrait Orientation:** 9:16 aspect ratio (primary)
- **Safe Area:** Account for notch and home indicator
- **Padding:** 16px horizontal margins on all screens
- **Spacing:** 8px, 12px, 16px, 24px increments

---

## Dark Mode Considerations

- **Automatic Switching:** Based on system settings
- **Color Adjustments:** Lighter variants of Deep Slate and Amber Orange
- **Contrast:** Maintained across all states
- **MECHANIC Role:** Naturally aligns with dark theme aesthetic

---

## Success Criteria

- [ ] All screens render correctly on iOS and Android
- [ ] Phone number input validates E.164 format
- [ ] OTP input accepts 6 digits with auto-advance
- [ ] Role selection required before verification
- [ ] API integration complete (request, verify, role change)
- [ ] Error messages display correctly
- [ ] Toast notifications appear on success/error
- [ ] Role toggle switches theme appropriately
- [ ] Modal confirmation works for role changes
- [ ] All buttons and inputs are accessible (touch targets, labels)
