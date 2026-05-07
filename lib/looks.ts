import { FEED_LOOKS } from "@/lib/look-data";

export function getLookById(id: string) {
  return FEED_LOOKS.find((look) => look.id === id);
}
