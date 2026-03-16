import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="otp-request"
        options={{
          title: "Request OTP",
        }}
      />
      <Stack.Screen
        name="otp-verify"
        options={{
          title: "Verify OTP",
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Stack>
  );
}
