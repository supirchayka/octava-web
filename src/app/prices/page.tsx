import { getPricesPage } from "@/lib/api/pages";
import { getServicePrices } from "@/lib/api/servicePrices";
import { resolveMediaUrl } from "@/lib/media";
import { PricesPageClient } from "./PricesPageClient";

export default async function PricesPage() {
  const [femalePrices, malePrices, pricesPage] = await Promise.all([
    getServicePrices("female"),
    getServicePrices("male"),
    getPricesPage().catch(() => null),
  ]);

  return (
    <PricesPageClient
      data={{
        female: femalePrices,
        male: malePrices,
      }}
      pricePdf={
        pricesPage?.prices?.priceListFile?.url
          ? {
              url: resolveMediaUrl(pricesPage.prices.priceListFile.url),
              name: pricesPage.prices.priceListFile.name,
            }
          : null
      }
    />
  );
}
