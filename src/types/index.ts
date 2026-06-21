// 全局类型定义

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  userId: number;
  orderNumber: string;
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  productName: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  keyword?: string;
  status?: string;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
  topProducts: Product[];
}

export interface Ingredient {
  id: number;
  name: string;
  icon: string;
  description: string;
  stock: number;
  unit: string;
  category: 'basic' | 'vegetable' | 'meat' | 'seafood' | 'other';
  shelfLife: number;
  createdAt: string;
  updatedAt: string;
}

export interface Buff {
  id: string;
  name: string;
  icon: string;
  description: string;
  type: 'stat_boost' | 'efficiency' | 'resistance' | 'special';
  stat?: 'strength' | 'stamina' | 'intelligence' | 'agility';
  value: number;
  duration: number;
}

export interface Recipe {
  id: number;
  name: string;
  icon: string;
  description: string;
  ingredients: { ingredientId: number; amount: number }[];
  outputMealId: number;
  outputAmount: number;
  cookTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  unlockLevel: number;
  buffs: Buff[];
  status: 'locked' | 'unlocked' | 'researching';
  createdAt: string;
  updatedAt: string;
}

export interface Meal {
  id: number;
  name: string;
  icon: string;
  description: string;
  stock: number;
  quality: 'normal' | 'good' | 'excellent' | 'legendary';
  buffs: Buff[];
  nutritionValue: number;
  moraleBoost: number;
  shelfLife: number;
  recipeId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: number;
  name: string;
  avatar: string;
  role: 'leader' | 'cook' | 'gatherer' | 'builder' | 'guard' | 'scout';
  level: number;
  exp: number;
  stats: {
    strength: number;
    stamina: number;
    intelligence: number;
    agility: number;
    maxStamina: number;
    currentStamina: number;
    hunger: number;
    morale: number;
  };
  currentBuff: Buff[];
  status: 'idle' | 'working' | 'resting' | 'eating' | 'injured';
  assignedTask: string | null;
  schedule: DailySchedule[];
  inventory: { itemId: number; itemType: 'ingredient' | 'meal'; amount: number }[];
  createdAt: string;
  updatedAt: string;
}

export interface DailySchedule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  activity: 'gather' | 'cook' | 'build' | 'guard' | 'scout' | 'rest' | 'eat';
  targetId?: number;
  mealId?: number;
  status: 'pending' | 'in_progress' | 'completed' | 'missed';
}

export interface CookingTask {
  id: string;
  recipeId: number;
  recipeName: string;
  cookId: number | null;
  cookName: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'cooking' | 'completed' | 'failed';
  outputMealId: number;
  outputAmount: number;
  quality: 'normal' | 'good' | 'excellent' | 'legendary' | null;
  createdAt: string;
}

export interface DistributionRecord {
  id: string;
  mealId: number;
  mealName: string;
  memberId: number;
  memberName: string;
  amount: number;
  distributedAt: string;
  appliedBuffs: Buff[];
  effect: {
    nutrition: number;
    morale: number;
    staminaRestore: number;
  };
}

export interface InventoryLog {
  id: string;
  type: 'ingredient' | 'meal';
  itemId: number;
  itemName: string;
  changeType: 'add' | 'consume' | 'distribute' | 'spoil' | 'cook';
  amount: number;
  balance: number;
  reason: string;
  relatedId?: string;
  createdAt: string;
}

export interface KitchenStats {
  totalRecipes: number;
  unlockedRecipes: number;
  totalMealsCooked: number;
  totalMealsDistributed: number;
  activeCookingTasks: number;
  lowStockIngredients: Ingredient[];
  expiringMeals: Meal[];
  averageMorale: number;
  averageStamina: number;
  todayMeals: Meal[];
}

export interface KitchenPaginationParams extends PaginationParams {
  category?: string;
  status?: string;
  quality?: string;
  memberId?: number;
}