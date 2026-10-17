export type ShelfType = "upper" | "middle" | "drawer" | "door";
export type IngredientCategory = "fresh" | "pantry";

export interface BoundingBox {
  ymin: number;
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface DetectedItem {
  id: string;
  name: string;
  quantity: string;
  numericQty: number;
  unit: string;
  shelf: ShelfType;
  category: IngredientCategory;
  confidence: number;
  isSelected?: boolean;
  urgentConsume?: boolean;
  expiryDays?: number;
  box_2d?: [number, number, number, number]; // [ymin, xmin, ymax, xmax] in 0-1000
  notes?: string;
}

export interface DetectionResult {
  success: boolean;
  isSimulated?: boolean;
  warning?: string;
  detected_items: DetectedItem[];
  rawOutput?: any;
}

export interface ShelfConfig {
  id: ShelfType;
  name: string;
  englishName: string;
  badge: string;
  color: string;
  bgColor: string;
  borderColor: string;
  accentColor: string;
  iconName: string;
  description: string;
  allowedCategories: string[];
  recommendedTemp: string;
}

export interface PresetFridge {
  id: string;
  title: string;
  description: string;
  badge: string;
  itemCount: number;
  imageUrl: string;
  defaultPrompt: string;
  detectedItems: DetectedItem[];
}

export interface ApplianceOption {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface CookingPreferences {
  appliances: string[]; // ids of selected appliances
  dietStyles: string[]; // ["high_protein", "low_carb", "low_fat", "vegetarian"]
  allergiesAndAvoid: string[]; // e.g. ["不吃香菜", "無辛辣"]
  timeLimit: number; // 15, 30, 60 (minutes)
  onePotPreferred: boolean;
}

export interface RecipeIngredient {
  name: string;
  amount: number;
  unit: string;
  rawText: string;
}

export type DishArtStyle = "watercolor" | "japanese_cookbook" | "colored_pencil" | "vintage_sketch";

export interface RecipeItem {
  id: string;
  title: string;
  difficulty: string;
  cookingTime: string;
  cookingTimeMinutes: number;
  usedAppliances: string[];
  onePot: boolean;
  prepTime: string;
  cookTime: string;
  usedIngredients: RecipeIngredient[];
  additionalPantry: string[];
  description: string;
  prepSteps: string[];
  cookSteps: string[];
  highlightTag?: string;
  imageUrl?: string;
  imageStyle?: DishArtStyle;
  imagePrompt?: string;
}

export interface DeductedItemDetail {
  id: string;
  name: string;
  deductedAmount: string;
  previousQty: string;
  remainingQty: string;
  isDepleted: boolean;
}

export interface DeductionRecord {
  id: string;
  timestamp: number;
  recipeTitle: string;
  deductions: DeductedItemDetail[];
  remainingSnapshot: DetectedItem[];
  nextMealSuggestion: string;
}
