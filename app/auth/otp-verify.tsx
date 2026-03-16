import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

/**
 * OTP Verify Screen - /auth/otp/verify
 * Verifies OTP and allows role selection (USER or MECHANIC)
 */
export default function OTPVerifyScreen() {
  const router = useRouter();
  const colors = useColors();
  const params = useLocalSearchParams();
  const mobile = params.mobile as string;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [role, setRole] = useState<"USER" | "MECHANIC">("USER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, "");

    if (digit.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = digit;
      setOtp(newOtp);

      // Auto-advance to next input
      if (digit && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      // Clear error when user starts typing
      if (error) setError("");
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    setError("");

    // Validate all OTP digits are entered
    if (otp.some((digit) => !digit)) {
      setError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const otpCode = otp.join("");

      // API call to POST /api/v1/auth/otp/verify
      const response = await fetch(
        `http://localhost:8080/api/v1/auth/otp/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile,
            otp: otpCode,
            role,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Success - store token and navigate to home
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // TODO: Store accessToken in secure storage
        // const token = data.data.accessToken;
        router.replace("/");
      } else {
        // Error response from API
        const errorMessage =
          data.errors?.[0] || data.message || "Verification failed. Please try again.";
        setError(errorMessage);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPhone = () => {
    router.back();
  };

  return (
    <ScreenContainer
      className="bg-background"
      edges={["top", "left", "right", "bottom"]}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center px-6 py-8">
          {/* Header */}
          <View className="mb-8 items-center">
            <Text
              className="text-4xl font-bold text-foreground mb-2"
              style={{ fontFamily: "Montserrat" }}
            >
              Verify Code
            </Text>
            <Text
              className="text-base text-muted text-center"
              style={{ fontFamily: "Montserrat" }}
            >
              Enter the 6-digit code sent to your phone
            </Text>
          </View>

          {/* Mobile Number Display */}
          <View className="mb-8 flex-row items-center justify-center gap-2">
            <Text
              className="text-base text-muted"
              style={{ fontFamily: "Montserrat" }}
            >
              {mobile}
            </Text>
            <Pressable
              onPress={handleEditPhone}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            >
              <Text
                className="text-base font-semibold text-primary"
                style={{ fontFamily: "Montserrat" }}
              >
                Edit
              </Text>
            </Pressable>
          </View>

          {/* 6-Digit PIN Input */}
          <View className="mb-8 flex-row justify-center gap-3">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputRefs.current[index] = ref;
                }}
                className="w-12 h-12 text-center text-lg font-bold text-foreground rounded-lg"
                style={{
                  fontFamily: "Montserrat",
                  backgroundColor: colors.surface,
                  borderColor:
                    error && !digit
                      ? colors.error
                      : digit
                        ? colors.primary
                        : colors.border,
                  borderWidth: 2,
                  fontSize: 18,
                }}
                maxLength={1}
                keyboardType="number-pad"
                value={digit}
                onChangeText={(value) => handleOtpChange(index, value)}
                onKeyPress={(e) => handleKeyPress(index, e.nativeEvent.key)}
                editable={!loading}
              />
            ))}
          </View>

          {/* Error Message */}
          {error && (
            <Text
              className="mb-6 text-center text-sm font-semibold text-error"
              style={{ fontFamily: "Montserrat" }}
            >
              {error}
            </Text>
          )}

          {/* Role Selection */}
          <View className="mb-8">
            <Text
              className="mb-3 text-sm font-semibold text-foreground"
              style={{ fontFamily: "Montserrat" }}
            >
              I am a:
            </Text>
            <View
              className="flex-row gap-3 rounded-lg p-1"
              style={{ backgroundColor: colors.surface }}
            >
              {(["USER", "MECHANIC"] as const).map((r) => (
                <Pressable
                  key={r}
                  onPress={() => setRole(r)}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      borderRadius: 6,
                      backgroundColor:
                        role === r ? colors.primary : "transparent",
                      alignItems: "center",
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text
                    className={`text-sm font-semibold ${role === r ? "text-white" : "text-foreground"}`}
                    style={{ fontFamily: "Montserrat" }}
                  >
                    {r === "USER" ? "Customer" : "Mechanic"}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Verify Button */}
          <Pressable
            onPress={handleVerify}
            disabled={loading}
            style={({ pressed }) => [
              {
                backgroundColor: colors.primary,
                borderRadius: 8,
                paddingVertical: 12,
                paddingHorizontal: 16,
                alignItems: "center",
                justifyContent: "center",
                minHeight: 48,
                opacity: loading ? 0.5 : pressed ? 0.9 : 1,
                transform: [{ scale: pressed && !loading ? 0.97 : 1 }],
              },
            ]}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text
                className="text-base font-semibold text-white"
                style={{ fontFamily: "Montserrat" }}
              >
                Verify
              </Text>
            )}
          </Pressable>

          {/* Resend Code Link */}
          <View className="mt-6 flex-row justify-center gap-1">
            <Text
              className="text-sm text-muted"
              style={{ fontFamily: "Montserrat" }}
            >
              Didn't receive code?
            </Text>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            >
              <Text
                className="text-sm font-semibold text-primary"
                style={{ fontFamily: "Montserrat" }}
              >
                Resend
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
