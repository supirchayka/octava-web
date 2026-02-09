export type PhoneCountryCode = "RU" | "KZ" | "BY" | "AM" | "KG";

export type PhoneCountry = {
  code: PhoneCountryCode;
  name: string;
  dialCode: string;
  localExample: string;
  groups: number[];
};

export const PHONE_COUNTRIES: PhoneCountry[] = [
  {
    code: "RU",
    name: "Россия",
    dialCode: "7",
    localExample: "999 123 45 67",
    groups: [3, 3, 2, 2],
  },
  {
    code: "KZ",
    name: "Казахстан",
    dialCode: "7",
    localExample: "701 123 45 67",
    groups: [3, 3, 2, 2],
  },
  {
    code: "BY",
    name: "Беларусь",
    dialCode: "375",
    localExample: "29 123 45 67",
    groups: [2, 3, 2, 2],
  },
  {
    code: "AM",
    name: "Армения",
    dialCode: "374",
    localExample: "77 123 456",
    groups: [2, 3, 3],
  },
  {
    code: "KG",
    name: "Киргизия",
    dialCode: "996",
    localExample: "700 123 456",
    groups: [3, 3, 3],
  },
];

export const DEFAULT_PHONE_COUNTRY: PhoneCountryCode = "RU";

export function getPhoneCountry(countryCode: PhoneCountryCode): PhoneCountry {
  return (
    PHONE_COUNTRIES.find((country) => country.code === countryCode) ??
    PHONE_COUNTRIES[0]
  );
}

export function getCountryDigitsLimit(country: PhoneCountry): number {
  return country.groups.reduce((sum, group) => sum + group, 0);
}

export function parsePhoneDigits(value: string, country: PhoneCountry): string {
  const numeric = value.replace(/\D/g, "");
  const withoutDialCode = numeric.startsWith(country.dialCode)
    ? numeric.slice(country.dialCode.length)
    : numeric;

  return withoutDialCode.slice(0, getCountryDigitsLimit(country));
}

export function formatPhone(country: PhoneCountry, digits: string): string {
  const normalizedDigits = digits.replace(/\D/g, "");
  const groups: string[] = [];
  let cursor = 0;

  for (const groupLength of country.groups) {
    if (cursor >= normalizedDigits.length) break;
    groups.push(normalizedDigits.slice(cursor, cursor + groupLength));
    cursor += groupLength;
  }

  return groups.length > 0
    ? `+${country.dialCode} ${groups.join(" ")}`
    : `+${country.dialCode}`;
}

export function getPhonePlaceholder(country: PhoneCountry): string {
  return `+${country.dialCode} ${country.localExample}`;
}
