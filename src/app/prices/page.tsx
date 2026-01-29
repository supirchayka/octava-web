import { getServicePrices } from "@/lib/api/servicePrices";
import { PricesPageClient } from "./PricesPageClient";

export default async function PricesPage() {
  const [femalePrices, malePrices] = await Promise.all([
    getServicePrices("female"),
    getServicePrices("male"),
  ]);

  return (
    <PricesPageClient
      data={{
        female: femalePrices,
        male: malePrices,
      }}
    />
  );
}
