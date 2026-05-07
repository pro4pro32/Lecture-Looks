export type LookItem = {
  name: string;
  store: string;
  currentPricePln: number;
  affiliateLink: string;
  tag?: "Najtansza opcja" | "Premium wersja";
};

export type Occasion = "wyklad" | "casual" | "impreza" | "sesja";

export type FeedLook = {
  id: string;
  title: string;
  styles: string[];
  occasion: Occasion;
  description: string;
  savingsLabel: string;
  imageUrl: string;
  items: LookItem[];
};

export const OCCASION_LABELS: Record<Occasion, string> = {
  wyklad: "Wyklad",
  casual: "Casual",
  impreza: "Impreza",
  sesja: "Sesja",
};

export const FEED_LOOKS: FeedLook[] = [
  {
    id: "soft-rose-layers",
    title: "Soft Rose Layers",
    styles: ["Clean Girl", "Coquette", "Old Money"],
    occasion: "wyklad",
    description:
      "Subtelny set inspirowany kobiecym stylem: pastelowe akcenty, premium basic i wyrazna sylwetka.",
    savingsLabel: "Taniej o 40% niz w ZARA",
    imageUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80",
    items: [
      {
        name: "Plaszcz oversize",
        store: "About You",
        currentPricePln: 229,
        affiliateLink: "https://example.com/affiliate/about-you-plaszcz",
      },
      {
        name: "Top rib",
        store: "SHEIN",
        currentPricePln: 45,
        affiliateLink: "https://example.com/affiliate/shein-top",
        tag: "Najtansza opcja",
      },
      {
        name: "Spodnie wide leg",
        store: "Zalando",
        currentPricePln: 169,
        affiliateLink: "https://example.com/affiliate/zalando-spodnie",
      },
      {
        name: "Skorzana torebka",
        store: "Vinted",
        currentPricePln: 119,
        affiliateLink: "https://example.com/affiliate/vinted-torebka",
      },
      {
        name: "Botki premium",
        store: "Polska marka (Reserved)",
        currentPricePln: 329,
        affiliateLink: "https://example.com/affiliate/polska-marka-botki",
        tag: "Premium wersja",
      },
    ],
  },
  {
    id: "minimal-slate-chic",
    title: "Minimal Slate Chic",
    styles: ["Minimal", "Quiet Luxury", "Old Money"],
    occasion: "casual",
    description:
      "Monochromatyczna baza i czyste linie, idealne na wyklady i szybki przeskok na spotkanie po zajeciach.",
    savingsLabel: "Taniej o 40% niz w ZARA",
    imageUrl:
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1000&q=80",
    items: [
      {
        name: "Marynarka boxy",
        store: "Zalando",
        currentPricePln: 259,
        affiliateLink: "https://example.com/affiliate/zalando-marynarka",
      },
      {
        name: "T-shirt basic",
        store: "SHEIN",
        currentPricePln: 35,
        affiliateLink: "https://example.com/affiliate/shein-tshirt",
        tag: "Najtansza opcja",
      },
      {
        name: "Jeans straight fit",
        store: "About You",
        currentPricePln: 189,
        affiliateLink: "https://example.com/affiliate/about-you-jeans",
      },
      {
        name: "Sneakers retro",
        store: "Polska marka (CCC)",
        currentPricePln: 209,
        affiliateLink: "https://example.com/affiliate/polska-marka-sneakers",
      },
      {
        name: "Pasek skorzany",
        store: "Vinted",
        currentPricePln: 59,
        affiliateLink: "https://example.com/affiliate/vinted-pasek",
        tag: "Premium wersja",
      },
    ],
  },
  {
    id: "downtown-campus",
    title: "Downtown Campus",
    styles: ["Downtown Girl", "Y2K", "Acubi"],
    occasion: "impreza",
    description:
      "Mocniejsze kontrasty, warstwy i dodatki, ktore nadaja stylizacji charakteru i miejskiego luzu.",
    savingsLabel: "Taniej o 40% niz w ZARA",
    imageUrl:
      "https://images.unsplash.com/photo-1464863979621-258859e62245?auto=format&fit=crop&w=1000&q=80",
    items: [
      {
        name: "Kurtka bomber",
        store: "About You",
        currentPricePln: 269,
        affiliateLink: "https://example.com/affiliate/about-you-bomber",
      },
      {
        name: "Crop top",
        store: "SHEIN",
        currentPricePln: 39,
        affiliateLink: "https://example.com/affiliate/shein-crop-top",
        tag: "Najtansza opcja",
      },
      {
        name: "Spodnie cargo",
        store: "Zalando",
        currentPricePln: 179,
        affiliateLink: "https://example.com/affiliate/zalando-cargo",
      },
      {
        name: "Torebka mini",
        store: "Vinted",
        currentPricePln: 79,
        affiliateLink: "https://example.com/affiliate/vinted-mini-bag",
      },
      {
        name: "Buty skorzane",
        store: "Polska marka (RylyBela)",
        currentPricePln: 349,
        affiliateLink: "https://example.com/affiliate/polska-marka-buty",
        tag: "Premium wersja",
      },
    ],
  },
  {
    id: "clean-y2k-balance",
    title: "Clean Y2K Balance",
    styles: ["Y2K", "Clean Girl", "Minimal"],
    occasion: "sesja",
    description:
      "Nowoczesny miks trendu Y2K i clean estetyki: lekko, swiezo i nadal komfortowo na caly dzien.",
    savingsLabel: "Taniej o 40% niz w ZARA",
    imageUrl:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80",
    items: [
      {
        name: "Sweter polo",
        store: "About You",
        currentPricePln: 159,
        affiliateLink: "https://example.com/affiliate/about-you-sweter",
      },
      {
        name: "Koszula biala",
        store: "Polska marka (Mohito)",
        currentPricePln: 119,
        affiliateLink: "https://example.com/affiliate/polska-marka-koszula",
      },
      {
        name: "Spodnica midi",
        store: "Zalando",
        currentPricePln: 149,
        affiliateLink: "https://example.com/affiliate/zalando-spodnica",
      },
      {
        name: "Loafers",
        store: "Vinted",
        currentPricePln: 89,
        affiliateLink: "https://example.com/affiliate/vinted-loafers",
        tag: "Najtansza opcja",
      },
      {
        name: "Trencz premium",
        store: "SHEIN",
        currentPricePln: 289,
        affiliateLink: "https://example.com/affiliate/shein-trencz",
        tag: "Premium wersja",
      },
    ],
  },
];
