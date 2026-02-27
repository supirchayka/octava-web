export type PhoneCountryCode =
  | "RU"
  | "KZ"
  | "BY"
  | "AM"
  | "US"
  | "DE"
  | "FR"
  | "IT"
  | "ES"
  | "PL"
  | "NL"
  | "BE"
  | "AT"
  | "CH"
  | "SE"
  | "NO"
  | "DK"
  | "FI"
  | "CZ"
  | "GR"
  | "HU"
  | "PT"
  | "RO"
  | "IE"
  | "GB"
  | "TR"
  | "AE";

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
    code: "US",
    name: "Соединенные Штаты Америки",
    dialCode: "1",
    localExample: "201 555 0123",
    groups: [3, 3, 4],
  },
  {
    code: "DE",
    name: "Германия",
    dialCode: "49",
    localExample: "151 2345 6789",
    groups: [3, 4, 4],
  },
  {
    code: "FR",
    name: "Франция",
    dialCode: "33",
    localExample: "6 12 34 56 78",
    groups: [1, 2, 2, 2, 2],
  },
  {
    code: "IT",
    name: "Италия",
    dialCode: "39",
    localExample: "312 345 6789",
    groups: [3, 3, 4],
  },
  {
    code: "ES",
    name: "Испания",
    dialCode: "34",
    localExample: "612 34 56 78",
    groups: [3, 2, 2, 2],
  },
  {
    code: "PL",
    name: "Польша",
    dialCode: "48",
    localExample: "512 345 678",
    groups: [3, 3, 3],
  },
  {
    code: "NL",
    name: "Нидерланды",
    dialCode: "31",
    localExample: "6 1234 5678",
    groups: [1, 4, 4],
  },
  {
    code: "BE",
    name: "Бельгия",
    dialCode: "32",
    localExample: "470 12 34 56",
    groups: [3, 2, 2, 2],
  },
  {
    code: "AT",
    name: "Австрия",
    dialCode: "43",
    localExample: "660 123 4567",
    groups: [3, 3, 4],
  },
  {
    code: "CH",
    name: "Швейцария",
    dialCode: "41",
    localExample: "79 123 45 67",
    groups: [2, 3, 2, 2],
  },
  {
    code: "SE",
    name: "Швеция",
    dialCode: "46",
    localExample: "70 123 45 67",
    groups: [2, 3, 2, 2],
  },
  {
    code: "NO",
    name: "Норвегия",
    dialCode: "47",
    localExample: "412 34 567",
    groups: [3, 2, 3],
  },
  {
    code: "DK",
    name: "Дания",
    dialCode: "45",
    localExample: "20 12 34 56",
    groups: [2, 2, 2, 2],
  },
  {
    code: "FI",
    name: "Финляндия",
    dialCode: "358",
    localExample: "40 123 4567",
    groups: [2, 3, 4],
  },
  {
    code: "CZ",
    name: "Чехия",
    dialCode: "420",
    localExample: "601 123 456",
    groups: [3, 3, 3],
  },
  {
    code: "GR",
    name: "Греция",
    dialCode: "30",
    localExample: "691 234 5678",
    groups: [3, 3, 4],
  },
  {
    code: "HU",
    name: "Венгрия",
    dialCode: "36",
    localExample: "30 123 4567",
    groups: [2, 3, 4],
  },
  {
    code: "PT",
    name: "Португалия",
    dialCode: "351",
    localExample: "912 345 678",
    groups: [3, 3, 3],
  },
  {
    code: "RO",
    name: "Румыния",
    dialCode: "40",
    localExample: "712 345 678",
    groups: [3, 3, 3],
  },
  {
    code: "IE",
    name: "Ирландия",
    dialCode: "353",
    localExample: "85 123 4567",
    groups: [2, 3, 4],
  },
  {
    code: "GB",
    name: "Великобритания",
    dialCode: "44",
    localExample: "7400 123 456",
    groups: [4, 3, 3],
  },
  {
    code: "TR",
    name: "Турция",
    dialCode: "90",
    localExample: "501 234 56 78",
    groups: [3, 3, 2, 2],
  },
  {
    code: "AE",
    name: "Объединенные Арабские Эмираты",
    dialCode: "971",
    localExample: "50 123 4567",
    groups: [2, 3, 4],
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
