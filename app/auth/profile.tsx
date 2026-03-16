import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { MaterialIcons } from "@expo/vector-icons";

/**
 * Profile / Role Management Screen - /auth/profile
 * Allows users to toggle their role between USER and MECHANIC
 */
export default function ProfileScreen() {
  const router = useRouter();
  const colors = useColors();

  // TODO: Get these from auth context/secure storage
  const [currentRole, setCurrentRole] = useState<"USER" | "MECHANIC">("USER");
  const [selectedRole, setSelectedRole] = useState<"USER" | "MECHANIC">(
    currentRole
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleRoleChange = (newRole: "USER" | "MECHANIC") => {
    if (newRole !== currentRole) {
      setSelectedRole(newRole);
      setShowConfirmModal(true);
    }
  };

  const handleConfirmRoleChange = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      // TODO: Get mobile from auth context
      const mobile = "+919876543210";

      // API call to POST /api/v1/auth/role
      const response = await fetch(
        `http://localhost:8080/api/v1/auth/role`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // TODO: Add authorization header with token
          },
          body: JSON.stringify({
            mobile,
            role: selectedRole,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Success - update current role
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setCurrentRole(selectedRole);
        setSuccessMessage(data.message || "User role updated successfully");

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        // Error response from API
        const errorMessage =
          data.errors?.[0] || data.message || "Failed to update role. Please try again.";
        setSuccessMessage(errorMessage);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setSelectedRole(currentRole);
      }
    } catch (err) {
      setSuccessMessage("Network error. Please check your connection.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setSelectedRole(currentRole);
    } finally {
      setLoading(false);
    }
  };

  const isDarkMode = currentRole === "MECHANIC";

  return (
    <ScreenContainer
      className={isDarkMode ? "bg-foreground" : "bg-background"}
      edges={["top", "left", "right", "bottom"]}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 py-8">
          {/* Header */}
          <View className="mb-8">
            <Text
              className={`text-4xl font-bold mb-2 ${isDarkMode ? "text-background" : "text-foreground"}`}
              style={{ fontFamily: "Montserrat" }}
            >
              Profile
            </Text>
            <Text
              className={`text-base ${isDarkMode ? "text-muted" : "text-muted"}`}
              style={{ fontFamily: "Montserrat" }}
            >
              Manage your account and role
            </Text>
          </View>

          {/* Current Role Card */}
          <View
            className="mb-8 rounded-xl p-6"
            style={{
              backgroundColor: isDarkMode ? colors.surface : colors.surface,
              borderColor: colors.primary,
              borderWidth: 2,
            }}
          >
            <View className="flex-row items-center gap-4 mb-4">
              <View
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <MaterialIcons
                  name={currentRole === "MECHANIC" ? "build" : "person"}
                  size={24}
                  color="#ffffff"
                />
              </View>
              <View className="flex-1">
                <Text
                  className={`text-sm font-semibold ${isDarkMode ? "text-muted" : "text-muted"}`}
                  style={{ fontFamily: "Montserrat" }}
                >
                  Current Role
                </Text>
                <Text
                  className={`text-2xl font-bold ${isDarkMode ? "text-background" : "text-foreground"}`}
                  style={{ fontFamily: "Montserrat" }}
                >
                  {currentRole === "USER" ? "Customer" : "Mechanic"}
                </Text>
              </View>
            </View>
            <Text
              className={`text-sm ${isDarkMode ? "text-muted" : "text-muted"}`}
              style={{ fontFamily: "Montserrat" }}
            >
              {currentRole === "USER"
                ? "You can request mechanic services"
                : "You can offer mechanic services"}
            </Text>
          </View>

          {/* Role Toggle Section */}
          <View className="mb-8">
            <Text
              className={`mb-3 text-sm font-semibold ${isDarkMode ? "text-background" : "text-foreground"}`}
              style={{ fontFamily: "Montserrat" }}
            >
              Switch Role
            </Text>
            <View
              className="flex-row gap-3 rounded-lg p-1"
              style={{ backgroundColor: colors.surface }}
            >
              {(["USER", "MECHANIC"] as const).map((r) => (
                <Pressable
                  key={r}
                  onPress={() => handleRoleChange(r)}
                  disabled={loading}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      paddingVertical: 12,
                      paddingHorizontal: 12,
                      borderRadius: 6,
                      backgroundColor:
                        selectedRole === r ? colors.primary : "transparent",
                      alignItems: "center",
                      opacity: loading ? 0.5 : pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text
                    className={`text-sm font-semibold ${selectedRole === r ? "text-white" : isDarkMode ? "text-background" : "text-foreground"}`}
                    style={{ fontFamily: "Montserrat" }}
                  >
                    {r === "USER" ? "Customer" : "Mechanic"}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Success/Error Message */}
          {successMessage && (
            <View
              className="mb-6 rounded-lg p-4"
              style={{
                backgroundColor: successMessage.includes("successfully")
                  ? colors.success
                  : colors.error,
              }}
            >
              <Text
                className="text-sm font-semibold text-white"
                style={{ fontFamily: "Montserrat" }}
              >
                {successMessage}
              </Text>
            </View>
          )}

          {/* Logout Button */}
          <Pressable
            onPress={() => {
              // TODO: Implement logout
              router.replace("/auth/otp-request");
            }}
            style={({ pressed }) => [
              {
                borderColor: colors.primary,
                borderWidth: 1,
                borderRadius: 8,
                paddingVertical: 12,
                paddingHorizontal: 16,
                alignItems: "center",
                justifyContent: "center",
                minHeight: 48,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text
              className="text-base font-semibold text-primary"
              style={{ fontFamily: "Montserrat" }}
            >
              Logout
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View
          className="flex-1 items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <View
            className="rounded-2xl p-6 w-80 mx-auto"
            style={{ backgroundColor: colors.surface }}
          >
            {/* Modal Header */}
            <Text
              className="text-xl font-bold text-foreground mb-2"
              style={{ fontFamily: "Montserrat" }}
            >
              Change Role?
            </Text>

            {/* Modal Message */}
            <Text
              className="text-base text-muted mb-6"
              style={{ fontFamily: "Montserrat" }}
            >
              You are switching from{" "}
              <Text className="font-semibold">
                {currentRole === "USER" ? "Customer" : "Mechanic"}
              </Text>{" "}
              to{" "}
              <Text className="font-semibold">
                {selectedRole === "USER" ? "Customer" : "Mechanic"}
              </Text>
              . This will update your permissions.
            </Text>

            {/* Modal Buttons */}
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => {
                  setShowConfirmModal(false);
                  setSelectedRole(currentRole);
                }}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                    borderRadius: 8,
                    paddingVertical: 12,
                    alignItems: "center",
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text
                  className="text-base font-semibold text-foreground"
                  style={{ fontFamily: "Montserrat" }}
                >
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                onPress={handleConfirmRoleChange}
                disabled={loading}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    backgroundColor: colors.primary,
                    borderRadius: 8,
                    paddingVertical: 12,
                    alignItems: "center",
                    opacity: loading ? 0.5 : pressed ? 0.9 : 1,
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
                    Confirm
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
