import { getPricesPage } from "@/lib/api/pages";
import { getServicePrices } from "@/lib/api/servicePrices";
import { resolveMediaUrl } from "@/lib/media";
import type { ServicePriceCategory } from "@/types/api";
import { PricesPageClient } from "./PricesPageClient";

function sortPriceCategories(
  categories: ServicePriceCategory[],
): ServicePriceCategory[] {
  return categories.map((category) => ({
    ...category,
    services: category.services.map((service) => ({
      ...service,
      pricesExtended: [...service.pricesExtended].sort(
        (left, right) => left.order - right.order,
      ),
    })),
  }));
}

export default async function PricesPage() {
  const [femalePrices, malePrices, pricesPage] = await Promise.all([
    getServicePrices("female"),
    getServicePrices("male"),
    getPricesPage().catch(() => null),
  ]);

  return (
    <PricesPageClient
      data={{
        female: sortPriceCategories(femalePrices),
        male: sortPriceCategories(malePrices),
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
