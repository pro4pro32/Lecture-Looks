import type { FeedLook } from "@/lib/look-data";

export function rankLooksForWeek(looks: FeedLook[]) {
  return [...looks]
    .map((look) => {
      const total = look.items.reduce((sum, item) => sum + item.currentPricePln, 0);
      const score = Math.round(look.styles.length * 10 + (1000 - total) / 20);
      return { look, score };
    })
    .sort((a, b) => b.score - a.score);
}

export function getPersonalizedRecommendations(
  looks: FeedLook[],
  savedLookIds: string[],
  selectedStyles: string[],
  limit = 4,
) {
  const savedSet = new Set(savedLookIds);

  return looks
    .filter((look) => !savedSet.has(look.id))
    .map((look) => {
      const styleMatchCount = look.styles.filter((style) => selectedStyles.includes(style)).length;
      const total = look.items.reduce((sum, item) => sum + item.currentPricePln, 0);
      const score = styleMatchCount * 100 + Math.max(0, 900 - total);
      return { look, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.look);
}

export function getPriceDropAlerts(looks: FeedLook[], savedLookIds: string[]) {
  const savedLooks = looks.filter((look) => savedLookIds.includes(look.id));

  return savedLooks.flatMap((look) =>
    look.items
      .map((item) => {
        const previousPrice = Math.round(item.currentPricePln * 1.2);
        const diff = previousPrice - item.currentPricePln;
        const dropPercent = Math.round((diff / previousPrice) * 100);
        return {
          id: `${look.id}-${item.name}`,
          lookTitle: look.title,
          itemName: item.name,
          currentPrice: item.currentPricePln,
          previousPrice,
          dropPercent,
        };
      })
      .filter((alert) => alert.dropPercent >= 15),
  );
}
