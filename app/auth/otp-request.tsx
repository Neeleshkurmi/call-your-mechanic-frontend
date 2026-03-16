import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { cn } from "@/lib/utils";

/**
 * OTP Request Screen - /auth/otp/request
 * Collects user's phone number and initiates OTP flow
 */
export default function OTPRequestScreen() {
  const router = useRouter();
  const colors = useColors();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Validate E.164 format: +[country code][number]
   * Example: +919876543210
   * Total digits: 1-3 country code + 4-14 number = max 15 total digits
   */
  const validateE164 = (phone: string): boolean => {
    const e164Regex = /^\+\d{1,3}\d{4,14}$/;
    const totalDigits = phone.replace(/\D/g, "").length;
    return e164Regex.test(phone) && totalDigits <= 15;
  };

  const handleSendCode = async () => {
    setError("");

    // Validate phone number is not empty
    if (!phoneNumber.trim()) {
      setError("Please enter a phone number");
      return;
    }

    // Construct full phone number in E.164 format
    const fullPhone = `${countryCode}${phoneNumber}`;

    // Validate E.164 format
    if (!validateE164(fullPhone)) {
      setError("Mobile must be in E.164 format");
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      // API call to POST /auth/otp/request
      const response = await fetch(
        `http://127.0.0.1:3000/auth/otp/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile: fullPhone,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Success - navigate to OTP verify screen
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.push({
          pathname: "/auth/otp-verify",
          params: { mobile: fullPhone },
        });
      } else {
        // Error response from API
        const errorMessage =
          data.errors?.[0] || "Failed to send OTP. Please try again.";
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
              Enter Your Mobile
            </Text>
            <Text
              className="text-base text-muted text-center"
              style={{ fontFamily: "Montserrat" }}
            >
              We'll send you a verification code
            </Text>
          </View>

          {/* Phone Input Section */}
          <View className="mb-6">
            <View className="flex-row gap-3">
              {/* Country Code Selector */}
              <Pressable
                onPress={() => {
                  // Simple toggle between +91 and +1 for demo
                  setCountryCode(countryCode === "+91" ? "+1" : "+91");
                }}
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text
                  className="font-semibold text-foreground"
                  style={{ fontFamily: "Montserrat" }}
                >
                  {countryCode}
                </Text>
              </Pressable>

              {/* Phone Number Input */}
              <TextInput
                className="flex-1 px-4 py-3 rounded-lg text-foreground font-semibold"
                style={{
                  fontFamily: "Montserrat",
                  backgroundColor: colors.surface,
                  borderColor: error ? colors.error : colors.border,
                  borderWidth: 1,
                  fontSize: 16,
                }}
                placeholder="9876543210"
                placeholderTextColor={colors.muted}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={(text) => {
                  setPhoneNumber(text.replace(/\D/g, ""));
                  if (error) setError("");
                }}
                editable={!loading}
                maxLength={15}
              />
            </View>

            {/* Error Message */}
            {error && (
              <Text
                className="mt-2 text-sm font-semibold text-error"
                style={{ fontFamily: "Montserrat" }}
              >
                {error}
              </Text>
            )}

            {/* Helper Text */}
            <Text
              className="mt-2 text-xs text-muted"
              style={{ fontFamily: "Montserrat" }}
            >
              Format: {countryCode}9876543210
            </Text>
          </View>

          {/* Send Code Button */}
          <Pressable
            onPress={handleSendCode}
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
                Send Code
              </Text>
            )}
          </Pressable>

          {/* Info Text */}
          <Text
            className="mt-6 text-center text-sm text-muted"
            style={{ fontFamily: "Montserrat" }}
          >
            You'll receive a 6-digit verification code via SMS
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
