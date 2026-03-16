import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { MaterialIcons } from "@expo/vector-icons";

interface Service {
  id: number;
  name: string;
  description: string;
  vehicleType: "CAR" | "BIKE" | "TRUCK";
}

/**
 * Service Detail Screen
 * Displays detailed information about a specific service
 */
export default function ServiceDetailScreen() {
  const router = useRouter();
  const colors = useColors();
  const params = useLocalSearchParams();
  const serviceId = params.serviceId as string;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /**
   * Fetch service details from API
   */
  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        setError("");
        const response = await fetch(
          `http://localhost:8080/api/v1/services/${serviceId}`
        );
        const data = await response.json();

        if (data.success) {
          setService(data.data);
        } else {
          setError(data.message || "Failed to fetch service details");
        }
      } catch (err) {
        setError("Network error. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchServiceDetail();
    }
  }, [serviceId]);

  /**
   * Get vehicle type icon
   */
  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType) {
      case "CAR":
        return "directions-car";
      case "BIKE":
        return "two-wheeler";
      case "TRUCK":
        return "local-shipping";
      default:
        return "help-outline";
    }
  };

  /**
   * Handle request service button
   */
  const handleRequestService = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Implement booking/request flow
    alert(`Service request for "${service?.name}" initiated`);
  };

  if (loading) {
    return (
      <ScreenContainer className="bg-background" edges={["top", "left", "right"]}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text
            className="mt-4 text-sm text-muted"
            style={{ fontFamily: "Montserrat" }}
          >
            Loading service details...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  if (error || !service) {
    return (
      <ScreenContainer className="bg-background" edges={["top", "left", "right"]}>
        <View className="flex-1 items-center justify-center px-6">
          <MaterialIcons name="error-outline" size={48} color={colors.error} />
          <Text
            className="mt-4 text-center text-base font-semibold text-error"
            style={{ fontFamily: "Montserrat" }}
          >
            {error || "Service not found"}
          </Text>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              {
                marginTop: 16,
                backgroundColor: colors.primary,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 8,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text
              className="text-sm font-semibold text-white"
              style={{ fontFamily: "Montserrat" }}
            >
              Go Back
            </Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with back button */}
        <View className="flex-row items-center px-6 py-4 gap-3">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <MaterialIcons name="chevron-left" size={28} color={colors.primary} />
          </Pressable>
          <Text
            className="flex-1 text-2xl font-bold text-foreground"
            style={{ fontFamily: "Montserrat" }}
          >
            Service Details
          </Text>
        </View>

        {/* Service Hero Section */}
        <View className="px-6 py-6">
          <View
            className="w-full rounded-2xl p-8 items-center justify-center"
            style={{ backgroundColor: colors.surface, aspectRatio: 1 }}
          >
            <View
              className="w-24 h-24 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <MaterialIcons
                name={getVehicleIcon(service.vehicleType)}
                size={48}
                color="#ffffff"
              />
            </View>
          </View>
        </View>

        {/* Service Info Card */}
        <View className="px-6 gap-6">
          {/* Service Name */}
          <View>
            <Text
              className="text-3xl font-bold text-foreground mb-2"
              style={{ fontFamily: "Montserrat" }}
            >
              {service.name}
            </Text>
            <View className="flex-row items-center gap-2">
              <View
                className="px-4 py-2 rounded-full"
                style={{ backgroundColor: colors.primary }}
              >
                <Text
                  className="text-sm font-semibold text-white"
                  style={{ fontFamily: "Montserrat" }}
                >
                  {service.vehicleType}
                </Text>
              </View>
            </View>
          </View>

          {/* Service Description */}
          <View>
            <Text
              className="text-sm font-semibold text-muted mb-2"
              style={{ fontFamily: "Montserrat" }}
            >
              Description
            </Text>
            <Text
              className="text-base text-foreground leading-relaxed"
              style={{ fontFamily: "Montserrat" }}
            >
              {service.description}
            </Text>
          </View>

          {/* Service Details */}
          <View
            className="rounded-xl p-4 gap-3"
            style={{ backgroundColor: colors.surface }}
          >
            <View className="flex-row items-center gap-3">
              <MaterialIcons
                name="info-outline"
                size={20}
                color={colors.primary}
              />
              <View className="flex-1">
                <Text
                  className="text-xs font-semibold text-muted"
                  style={{ fontFamily: "Montserrat" }}
                >
                  Service ID
                </Text>
                <Text
                  className="text-sm font-semibold text-foreground"
                  style={{ fontFamily: "Montserrat" }}
                >
                  #{service.id}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-3">
              <MaterialIcons
                name="directions-car"
                size={20}
                color={colors.primary}
              />
              <View className="flex-1">
                <Text
                  className="text-xs font-semibold text-muted"
                  style={{ fontFamily: "Montserrat" }}
                >
                  Vehicle Type
                </Text>
                <Text
                  className="text-sm font-semibold text-foreground"
                  style={{ fontFamily: "Montserrat" }}
                >
                  {service.vehicleType}
                </Text>
              </View>
            </View>
          </View>

          {/* Request Service Button */}
          <Pressable
            onPress={handleRequestService}
            style={({ pressed }) => [
              {
                backgroundColor: colors.primary,
                borderRadius: 8,
                paddingVertical: 14,
                paddingHorizontal: 16,
                alignItems: "center",
                justifyContent: "center",
                minHeight: 48,
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
          >
            <Text
              className="text-base font-semibold text-white"
              style={{ fontFamily: "Montserrat" }}
            >
              Request Service
            </Text>
          </Pressable>

          {/* Additional Info */}
          <View
            className="rounded-xl p-4"
            style={{ backgroundColor: colors.surface }}
          >
            <Text
              className="text-sm font-semibold text-foreground mb-2"
              style={{ fontFamily: "Montserrat" }}
            >
              How it works
            </Text>
            <Text
              className="text-xs text-muted leading-relaxed"
              style={{ fontFamily: "Montserrat" }}
            >
              1. Request this service{"\n"}
              2. Select your vehicle details{"\n"}
              3. Choose a mechanic{"\n"}
              4. Schedule the appointment{"\n"}
              5. Get the service done
            </Text>
          </View>

          {/* Spacer */}
          <View className="h-6" />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
