import { describe, it, expect } from "vitest";

/**
 * E.164 Format Validation Tests
 * E.164 format: +[country code][number]
 * Example: +919876543210
 */

const validateE164 = (phone: string): boolean => {
  // E.164 format: +[1-3 digit country code][4-14 digit number]
  const e164Regex = /^\+\d{1,3}\d{4,14}$/;
  // Additional validation: total length should not exceed 15 digits (1-3 country + 4-14 number)
  const totalDigits = phone.replace(/\D/g, "").length;
  return e164Regex.test(phone) && totalDigits <= 15;
};

describe("OTP Request Screen - E.164 Validation", () => {
  describe("Valid E.164 Formats", () => {
    it("should accept valid Indian phone number (+91)", () => {
      expect(validateE164("+919876543210")).toBe(true);
    });

    it("should accept valid US phone number (+1)", () => {
      expect(validateE164("+12025551234")).toBe(true);
    });

    it("should accept valid UK phone number (+44)", () => {
      expect(validateE164("+441632960000")).toBe(true);
    });

    it("should accept phone with minimum digits (1 country code + 4 digits)", () => {
      expect(validateE164("+11234")).toBe(true);
    });

    it("should accept phone with maximum digits (3 country code + 14 digits)", () => {
      expect(validateE164("+123456789012345")).toBe(true);
    });
  });

  describe("Invalid E.164 Formats", () => {
    it("should reject phone without + prefix", () => {
      expect(validateE164("919876543210")).toBe(false);
    });

    it("should reject phone with spaces", () => {
      expect(validateE164("+91 9876543210")).toBe(false);
    });

    it("should reject phone with dashes", () => {
      expect(validateE164("+91-9876543210")).toBe(false);
    });

    it("should reject phone with parentheses", () => {
      expect(validateE164("+91(9876543210)")).toBe(false);
    });

    it("should reject empty string", () => {
      expect(validateE164("")).toBe(false);
    });

    it("should reject phone with only + sign", () => {
      expect(validateE164("+")).toBe(false);
    });

    it("should reject phone with letters", () => {
      expect(validateE164("+91ABC9876543210")).toBe(false);
    });

    it("should reject phone with too few digits (less than 4)", () => {
      expect(validateE164("+1123")).toBe(false);
    });

    it("should reject phone with too many digits (more than 14)", () => {
      expect(validateE164("+123456789012345678")).toBe(false);
    });

    it("should reject phone with special characters", () => {
      expect(validateE164("+91@9876543210")).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    it("should accept country code with single digit", () => {
      expect(validateE164("+1123456789")).toBe(true);
    });

    it("should accept country code with three digits", () => {
      expect(validateE164("+1234567890")).toBe(true);
    });

    it("should reject phone exceeding 15 total digits", () => {
      expect(validateE164("+123456789012345678")).toBe(false);
    });

    it("should handle leading zeros in number", () => {
      expect(validateE164("+910123456789")).toBe(true);
    });
  });
});
