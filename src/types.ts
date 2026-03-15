export interface Product {
  id: number;
  namePart1: string;
  namePart2: string;
  price: number;
  primaryColor: string;
  lineColor: string;
  accentColor: string;
  texturePattern: 'classic' | 'street' | 'tech' | 'cross';
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    namePart1: "SPA",
    namePart2: "ING",
    price: 34.99,
    primaryColor: "#C25E00",
    lineColor: "#1a1a1a",
    accentColor: "#FF5500",
    texturePattern: "classic"
  },
  {
    id: 2,
    namePart1: "VER",
    namePart2: "TEX",
    price: 49.99,
    primaryColor: "#004d25",
    lineColor: "#aaffaa",
    accentColor: "#00ff41",
    texturePattern: "street"
  },
  {
    id: 3,
    namePart1: "NEB",
    namePart2: "ULA",
    price: 59.99,
    primaryColor: "#0077b6",
    lineColor: "#FFFFFF",
    accentColor: "#00C2FF",
    texturePattern: "tech"
  },
  {
    id: 4,
    namePart1: "INF",
    namePart2: "ERNO",
    price: 64.99,
    primaryColor: "#6a040f",
    lineColor: "#ffba08",
    accentColor: "#d00000",
    texturePattern: "street"
  },
  {
    id: 5,
    namePart1: "STE",
    namePart2: "ALTH",
    price: 79.99,
    primaryColor: "#ff0080",
    lineColor: "#111111",
    accentColor: "#ff0080",
    texturePattern: "cross"
  }
];
