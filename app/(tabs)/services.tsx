import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
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

type VehicleType = "CAR" | "BIKE" | "TRUCK" | null;

/**
 * Services List Screen
 * Displays available services with vehicle type filtering
 */
export default function ServicesScreen() {
  const router = useRouter();
  const colors = useColors();

  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const vehicleTypes: VehicleType[] = ["CAR", "BIKE", "TRUCK"];

  /**
   * Fetch services from API
   */
  const fetchServices = async (vehicleType?: VehicleType) => {
    try {
      setError("");
      let url = "http://localhost:8080/api/v1/services";

      if (vehicleType) {
        url += `?vehicleType=${vehicleType}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        setServices(data.data);
        setFilteredServices(data.data);
      } else {
        setError(data.message || "Failed to fetch services");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Load services on mount
   */
  useEffect(() => {
    fetchServices();
  }, []);

  /**
   * Handle vehicle type filter selection
   */
  const handleFilterChange = (vehicleType: VehicleType) => {
    setSelectedVehicleType(vehicleType);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (vehicleType) {
      const filtered = services.filter((s) => s.vehicleType === vehicleType);
      setFilteredServices(filtered);
    } else {
      setFilteredServices(services);
    }
  };

  /**
   * Handle pull-to-refresh
   */
  const handleRefresh = () => {
    setRefreshing(true);
    fetchServices(selectedVehicleType);
  };

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
   * Render service card
   */
  const renderServiceCard = ({ item }: { item: Service }) => (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({
          pathname: "/service-detail",
          params: { serviceId: item.id.toString() },
        });
      }}
      style={({ pressed }) => [
        {
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          borderColor: colors.border,
          borderWidth: 1,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View className="flex-row items-start gap-3">
        {/* Vehicle Icon */}
        <View
          className="w-12 h-12 rounded-lg items-center justify-center"
          style={{ backgroundColor: colors.primary }}
        >
          <MaterialIcons
            name={getVehicleIcon(item.vehicleType)}
            size={24}
            color="#ffffff"
          />
        </View>

        {/* Service Info */}
        <View className="flex-1">
          <Text
            className="text-lg font-bold text-foreground mb-1"
            style={{ fontFamily: "Montserrat" }}
          >
            {item.name}
          </Text>
          <Text
            className="text-sm text-muted mb-2"
            style={{ fontFamily: "Montserrat" }}
          >
            {item.description}
          </Text>
          <View className="flex-row items-center gap-2">
            <View
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: colors.primary }}
            >
              <Text
                className="text-xs font-semibold text-white"
                style={{ fontFamily: "Montserrat" }}
              >
                {item.vehicleType}
              </Text>
            </View>
          </View>
        </View>

        {/* Chevron */}
        <MaterialIcons
          name="chevron-right"
          size={24}
          color={colors.primary}
        />
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="bg-background" edges={["top", "left", "right"]}>
      {/* Header */}
      <View className="px-6 py-4 border-b" style={{ borderBottomColor: colors.border }}>
        <Text
          className="text-2xl font-bold text-foreground mb-1"
          style={{ fontFamily: "Montserrat" }}
        >
          Services
        </Text>
        <Text
          className="text-sm text-muted"
          style={{ fontFamily: "Montserrat" }}
        >
          Browse available services
        </Text>
      </View>

      {/* Vehicle Type Filter */}
      <View className="px-6 py-4 gap-3">
        <Text
          className="text-sm font-semibold text-foreground"
          style={{ fontFamily: "Montserrat" }}
        >
          Filter by Vehicle Type
        </Text>
        <View className="flex-row gap-3">
          {/* "All" button */}
          <Pressable
            onPress={() => handleFilterChange(null)}
            style={({ pressed }) => [
              {
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderRadius: 8,
                backgroundColor:
                  selectedVehicleType === null ? colors.primary : colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
                alignItems: "center",
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text
              className={`text-sm font-semibold ${selectedVehicleType === null ? "text-white" : "text-foreground"}`}
              style={{ fontFamily: "Montserrat" }}
            >
              All
            </Text>
          </Pressable>

          {/* Vehicle type buttons */}
          {vehicleTypes.map((type) => (
            <Pressable
              key={type}
              onPress={() => handleFilterChange(type)}
              style={({ pressed }) => [
                {
                  flex: 1,
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  backgroundColor:
                    selectedVehicleType === type ? colors.primary : colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                  alignItems: "center",
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text
                className={`text-sm font-semibold ${selectedVehicleType === type ? "text-white" : "text-foreground"}`}
                style={{ fontFamily: "Montserrat" }}
              >
                {type}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Services List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text
            className="mt-4 text-sm text-muted"
            style={{ fontFamily: "Montserrat" }}
          >
            Loading services...
          </Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <MaterialIcons name="error-outline" size={48} color={colors.error} />
          <Text
            className="mt-4 text-center text-base font-semibold text-error"
            style={{ fontFamily: "Montserrat" }}
          >
            {error}
          </Text>
          <Pressable
            onPress={handleRefresh}
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
              Try Again
            </Text>
          </Pressable>
        </View>
      ) : filteredServices.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <MaterialIcons name="inbox" size={48} color={colors.muted} />
          <Text
            className="mt-4 text-center text-base font-semibold text-muted"
            style={{ fontFamily: "Montserrat" }}
          >
            No services available
          </Text>
          <Text
            className="mt-2 text-center text-sm text-muted"
            style={{ fontFamily: "Montserrat" }}
          >
            Try selecting a different vehicle type
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredServices}
          renderItem={renderServiceCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 12 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
          scrollIndicatorInsets={{ right: 1 }}
        />
      )}
    </ScreenContainer>
  );
}
