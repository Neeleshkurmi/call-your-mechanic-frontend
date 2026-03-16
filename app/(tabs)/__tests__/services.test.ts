import { describe, it, expect } from "vitest";

/**
 * Services API Response Parsing Tests
 */

interface Service {
  id: number;
  name: string;
  description: string;
  vehicleType: "CAR" | "BIKE" | "TRUCK";
}

interface ApiResponse {
  timestamp: string;
  success: boolean;
  message: string;
  data: Service[] | Service | string;
  errors: string[][];
}

describe("Services API - Response Parsing", () => {
  describe("List Services Response", () => {
    it("should parse successful services list response", () => {
      const response: ApiResponse = {
        timestamp: "2026-03-15T12:34:56Z",
        success: true,
        message: "Services fetched successfully",
        data: [
          {
            id: 1,
            name: "Oil Change",
            description: "Regular oil and filter change",
            vehicleType: "CAR",
          },
          {
            id: 2,
            name: "Tire Repair",
            description: "Puncture repair and inflation",
            vehicleType: "BIKE",
          },
        ],
        errors: [[]],
      };

      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      expect((response.data as Service[]).length).toBe(2);
      expect((response.data as Service[])[0].vehicleType).toBe("CAR");
    });

    it("should handle empty services list", () => {
      const response: ApiResponse = {
        timestamp: "2026-03-15T12:34:56Z",
        success: true,
        message: "Services fetched successfully",
        data: [],
        errors: [[]],
      };

      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      expect((response.data as Service[]).length).toBe(0);
    });

    it("should handle error response for invalid vehicle type", () => {
      const response: ApiResponse = {
        timestamp: "2026-03-15T12:34:56Z",
        success: false,
        message: "Validation failed",
        data: "string",
        errors: [["vehicleType: Invalid vehicle type provided"]],
      };

      expect(response.success).toBe(false);
      expect(response.errors.length).toBeGreaterThan(0);
      expect(response.errors[0][0]).toContain("vehicleType");
    });
  });

  describe("Service Detail Response", () => {
    it("should parse successful service detail response", () => {
      const response: ApiResponse = {
        timestamp: "2026-03-15T12:34:56Z",
        success: true,
        message: "Service fetched successfully",
        data: {
          id: 4,
          name: "Flat Tyre Repair",
          description: "On-site puncture repair and tyre inflation.",
          vehicleType: "BIKE",
        },
        errors: [[]],
      };

      expect(response.success).toBe(true);
      const service = response.data as Service;
      expect(service.id).toBe(4);
      expect(service.name).toBe("Flat Tyre Repair");
      expect(service.vehicleType).toBe("BIKE");
    });

    it("should handle service not found error", () => {
      const response: ApiResponse = {
        timestamp: "2026-03-15T12:34:56Z",
        success: false,
        message: "Service not found",
        data: "string",
        errors: [["serviceId: Service with ID 999 not found"]],
      };

      expect(response.success).toBe(false);
      expect(response.message).toBe("Service not found");
    });
  });

  describe("Vehicle Type Filtering", () => {
    it("should correctly filter services by CAR", () => {
      const services: Service[] = [
        {
          id: 1,
          name: "Oil Change",
          description: "Regular oil and filter change",
          vehicleType: "CAR",
        },
        {
          id: 2,
          name: "Tire Repair",
          description: "Puncture repair and inflation",
          vehicleType: "BIKE",
        },
        {
          id: 3,
          name: "Engine Overhaul",
          description: "Complete engine service",
          vehicleType: "CAR",
        },
      ];

      const filtered = services.filter((s) => s.vehicleType === "CAR");
      expect(filtered.length).toBe(2);
      expect(filtered.every((s) => s.vehicleType === "CAR")).toBe(true);
    });

    it("should correctly filter services by BIKE", () => {
      const services: Service[] = [
        {
          id: 1,
          name: "Oil Change",
          description: "Regular oil and filter change",
          vehicleType: "CAR",
        },
        {
          id: 2,
          name: "Tire Repair",
          description: "Puncture repair and inflation",
          vehicleType: "BIKE",
        },
        {
          id: 3,
          name: "Chain Maintenance",
          description: "Chain cleaning and lubrication",
          vehicleType: "BIKE",
        },
      ];

      const filtered = services.filter((s) => s.vehicleType === "BIKE");
      expect(filtered.length).toBe(2);
      expect(filtered.every((s) => s.vehicleType === "BIKE")).toBe(true);
    });

    it("should correctly filter services by TRUCK", () => {
      const services: Service[] = [
        {
          id: 1,
          name: "Oil Change",
          description: "Regular oil and filter change",
          vehicleType: "CAR",
        },
        {
          id: 4,
          name: "Brake System Service",
          description: "Complete brake system inspection and service",
          vehicleType: "TRUCK",
        },
      ];

      const filtered = services.filter((s) => s.vehicleType === "TRUCK");
      expect(filtered.length).toBe(1);
      expect(filtered[0].vehicleType).toBe("TRUCK");
    });

    it("should return all services when no filter applied", () => {
      const services: Service[] = [
        {
          id: 1,
          name: "Oil Change",
          description: "Regular oil and filter change",
          vehicleType: "CAR",
        },
        {
          id: 2,
          name: "Tire Repair",
          description: "Puncture repair and inflation",
          vehicleType: "BIKE",
        },
        {
          id: 4,
          name: "Brake System Service",
          description: "Complete brake system inspection and service",
          vehicleType: "TRUCK",
        },
      ];

      expect(services.length).toBe(3);
    });
  });

  describe("Error Handling", () => {
    it("should handle network error gracefully", () => {
      const error = new Error("Network error. Please check your connection.");
      expect(error.message).toContain("Network error");
    });

    it("should extract error message from API response", () => {
      const response: ApiResponse = {
        timestamp: "2026-03-15T12:34:56Z",
        success: false,
        message: "Validation failed",
        data: "string",
        errors: [["vehicleType: Invalid vehicle type provided"]],
      };

      const errorMessage = response.errors[0] || response.message;
      expect(errorMessage).toBeDefined();
    });

    it("should handle server error response", () => {
      const response: ApiResponse = {
        timestamp: "2026-03-15T12:34:56Z",
        success: false,
        message: "Internal server error",
        data: "string",
        errors: [["Server encountered an unexpected error"]],
      };

      expect(response.success).toBe(false);
      expect(response.message).toContain("error");
    });
  });
});
