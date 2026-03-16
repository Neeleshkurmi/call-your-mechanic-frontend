# Call Your Mechanic - Project TODO

## Phase 1: Project Setup & Branding
- [x] Generate custom app logo and update branding
- [x] Update app.config.ts with app name and logo URL
- [x] Configure theme colors (Deep Slate, Amber Orange, Light Gray)
- [x] Update Montserrat font in project

## Phase 2: OTP Request Screen
- [x] Create /auth/otp/request screen component
- [x] Implement phone number input with international prefix selector
- [x] Add E.164 format validation
- [x] Implement error state visualization (red border + helper text)
- [x] Create "Send Code" button with loading state
- [x] Wire up API integration for POST /auth/otp/request
- [x] Add success toast notification
- [x] Navigation to Verify OTP Screen on success

## Phase 3: OTP Verify Screen
- [x] Create /auth/otp/verify screen component
- [x] Display mobile number from previous step with "Edit" link
- [x] Implement 6-digit PIN input layout (individual boxes)
- [x] Add auto-advance between PIN input boxes
- [x] Create segmented control for USER/MECHANIC role selection
- [x] Implement loading spinner for verification state
- [x] Wire up API integration for POST /auth/otp/verify
- [x] Add success toast notification
- [ ] Store accessToken on successful verification
- [x] Navigation to Home/Profile Screen on success
- [x] Error handling with red text and shake animation

## Phase 4: Role Management / Profile Screen
- [x] Create /auth/user/role profile/settings screen
- [x] Display current role with role-specific icon and styling
- [x] Implement role toggle (segmented control)
- [x] Create confirmation modal for role changes
- [x] Wire up API integration for POST /auth/user/role
- [x] Implement theme switching (USER: light, MECHANIC: dark)
- [x] Add success toast notification on role update
- [x] Update UI to reflect new role and permissions

## Phase 5: Navigation & Layout
- [x] Set up authentication flow navigation (stack navigator)
- [ ] Create home screen as post-auth destination
- [ ] Implement tab navigation (if needed)
- [ ] Add deep linking support for auth callbacks
- [x] Implement safe area handling on all screens
- [ ] Test navigation flows end-to-end

## Phase 6: API Integration & State Management
- [x] Create API client for OTP endpoints
- [x] Implement error handling for API responses
- [ ] Create auth context/provider for token management
- [ ] Implement AsyncStorage for token persistence
- [ ] Add request/response interceptors
- [x] Handle specific error messages from API (e.g., "Mobile must be in E.164 format")

## Phase 7: UI Polish & Accessibility
- [x] Implement haptic feedback on button presses
- [x] Add press feedback (scale + opacity) to buttons
- [x] Ensure color contrast meets WCAG AA standards
- [x] Verify touch targets are minimum 44x48px
- [ ] Test on multiple screen sizes
- [x] Implement dark mode support
- [x] Add loading states to all interactive elements

## Phase 8: Testing & Validation
- [x] Test OTP request flow end-to-end (E.164 validation tests pass)
- [ ] Test OTP verification flow end-to-end
- [ ] Test role change flow end-to-end
- [ ] Test error states and validation messages
- [ ] Test on iOS and Android simulators
- [ ] Test dark mode switching
- [ ] Verify all navigation flows work correctly
- [ ] Test accessibility (screen readers, touch targets)

## Phase 9: Final Delivery
- [ ] Create checkpoint
- [ ] Prepare project for publishing
- [ ] Document any remaining known issues
- [ ] Deliver to user with instructions
