import request from '../utils/request';

const mockIngredients = [
  { id: 1, name: '面粉', icon: '🌾', description: '基础食材，用于制作面包和面食', stock: 50, unit: '份', category: 'basic', shelfLife: 30, createdAt: '2026-06-01', updatedAt: '2026-06-20' },
  { id: 2, name: '野菜', icon: '🥬', description: '新鲜采集的野生蔬菜', stock: 30, unit: '份', category: 'vegetable', shelfLife: 5, createdAt: '2026-06-15', updatedAt: '2026-06-20' },
  { id: 3, name: '野果', icon: '🍎', description: '甜美的野生水果', stock: 40, unit: '份', category: 'vegetable', shelfLife: 7, createdAt: '2026-06-18', updatedAt: '2026-06-20' },
  { id: 4, name: '兔肉', icon: '🐰', description: '狩猎获得的新鲜兔肉', stock: 20, unit: '份', category: 'meat', shelfLife: 3, createdAt: '2026-06-19', updatedAt: '2026-06-20' },
  { id: 5, name: '鱼肉', icon: '🐟', description: '从海里捕获的鲜鱼', stock: 25, unit: '份', category: 'seafood', shelfLife: 2, createdAt: '2026-06-20', updatedAt: '2026-06-20' },
  { id: 6, name: '贝类', icon: '🐚', description: '海滩上收集的贝类', stock: 15, unit: '份', category: 'seafood', shelfLife: 2, createdAt: '2026-06-20', updatedAt: '2026-06-20' },
  { id: 7, name: '淡水', icon: '💧', description: '干净的饮用水', stock: 100, unit: '升', category: 'basic', shelfLife: 7, createdAt: '2026-06-01', updatedAt: '2026-06-20' },
  { id: 8, name: '香草', icon: '🌿', description: '用于调味的野生香草', stock: 10, unit: '份', category: 'other', shelfLife: 14, createdAt: '2026-06-10', updatedAt: '2026-06-20' },
];

const mockBuffs = [
  { id: 'buff_strength_1', name: '力量增强', icon: '💪', description: '力量+20%', type: 'stat_boost', stat: 'strength', value: 20, duration: 1800 },
  { id: 'buff_stamina_1', name: '耐力提升', icon: '🏃', description: '耐力+20%', type: 'stat_boost', stat: 'stamina', value: 20, duration: 1800 },
  { id: 'buff_intelligence_1', name: '智慧之光', icon: '🧠', description: '智力+20%', type: 'stat_boost', stat: 'intelligence', value: 20, duration: 1800 },
  { id: 'buff_agility_1', name: '敏捷提升', icon: '⚡', description: '敏捷+20%', type: 'stat_boost', stat: 'agility', value: 20, duration: 1800 },
  { id: 'buff_efficiency_1', name: '高效工作', icon: '⚙️', description: '工作效率+30%', type: 'efficiency', value: 30, duration: 3600 },
  { id: 'buff_resistance_1', name: '抗性提升', icon: '🛡️', description: '伤害抗性+25%', type: 'resistance', value: 25, duration: 3600 },
  { id: 'buff_special_1', name: '幸运加持', icon: '🍀', description: '幸运值提升', type: 'special', value: 15, duration: 7200 },
];

const mockRecipes = [
  {
    id: 1, name: '烤野菜', icon: '🥗', description: '简单烤制的野菜，补充基础营养',
    ingredients: [{ ingredientId: 2, amount: 2 }],
    outputMealId: 1, outputAmount: 2, cookTime: 60, difficulty: 'easy', unlockLevel: 1,
    buffs: [], status: 'unlocked', createdAt: '2026-06-01', updatedAt: '2026-06-01'
  },
  {
    id: 2, name: '水果沙拉', icon: '🥗', description: '新鲜水果混合，提升士气',
    ingredients: [{ ingredientId: 3, amount: 3 }],
    outputMealId: 2, outputAmount: 2, cookTime: 30, difficulty: 'easy', unlockLevel: 1,
    buffs: [mockBuffs[6]], status: 'unlocked', createdAt: '2026-06-01', updatedAt: '2026-06-01'
  },
  {
    id: 3, name: '烤鱼', icon: '🐟', description: '炭火烤制的鲜鱼，提升耐力',
    ingredients: [{ ingredientId: 5, amount: 2 }, { ingredientId: 8, amount: 1 }],
    outputMealId: 3, outputAmount: 1, cookTime: 120, difficulty: 'medium', unlockLevel: 2,
    buffs: [mockBuffs[1]], status: 'unlocked', createdAt: '2026-06-05', updatedAt: '2026-06-05'
  },
  {
    id: 4, name: '烤兔肉', icon: '🍖', description: '香嫩的烤兔肉，大幅提升力量',
    ingredients: [{ ingredientId: 4, amount: 2 }, { ingredientId: 8, amount: 1 }],
    outputMealId: 4, outputAmount: 2, cookTime: 180, difficulty: 'medium', unlockLevel: 3,
    buffs: [mockBuffs[0]], status: 'unlocked', createdAt: '2026-06-10', updatedAt: '2026-06-10'
  },
  {
    id: 5, name: '海鲜汤', icon: '🍲', description: '多种海鲜熬制的浓汤，全属性提升',
    ingredients: [{ ingredientId: 5, amount: 2 }, { ingredientId: 6, amount: 3 }, { ingredientId: 7, amount: 2 }],
    outputMealId: 5, outputAmount: 3, cookTime: 240, difficulty: 'hard', unlockLevel: 5,
    buffs: [mockBuffs[0], mockBuffs[1], mockBuffs[2], mockBuffs[3]], status: 'unlocked', createdAt: '2026-06-15', updatedAt: '2026-06-15'
  },
  {
    id: 6, name: '面包', icon: '🍞', description: '基础面包，可长期保存',
    ingredients: [{ ingredientId: 1, amount: 3 }, { ingredientId: 7, amount: 1 }],
    outputMealId: 6, outputAmount: 4, cookTime: 300, difficulty: 'medium', unlockLevel: 2,
    buffs: [mockBuffs[4]], status: 'unlocked', createdAt: '2026-06-08', updatedAt: '2026-06-08'
  },
];

const mockMeals = [
  { id: 1, name: '烤野菜', icon: '🥗', description: '简单烤制的野菜', stock: 5, quality: 'normal', buffs: [], nutritionValue: 15, moraleBoost: 5, shelfLife: 1, recipeId: 1, createdAt: '2026-06-20', updatedAt: '2026-06-20' },
  { id: 2, name: '水果沙拉', icon: '🥗', description: '新鲜水果混合', stock: 3, quality: 'good', buffs: [mockBuffs[6]], nutritionValue: 20, moraleBoost: 15, shelfLife: 1, recipeId: 2, createdAt: '2026-06-20', updatedAt: '2026-06-20' },
  { id: 3, name: '烤鱼', icon: '🐟', description: '炭火烤制的鲜鱼', stock: 2, quality: 'good', buffs: [mockBuffs[1]], nutritionValue: 35, moraleBoost: 10, shelfLife: 2, recipeId: 3, createdAt: '2026-06-20', updatedAt: '2026-06-20' },
  { id: 4, name: '烤兔肉', icon: '🍖', description: '香嫩的烤兔肉', stock: 4, quality: 'excellent', buffs: [mockBuffs[0]], nutritionValue: 45, moraleBoost: 20, shelfLife: 2, recipeId: 4, createdAt: '2026-06-20', updatedAt: '2026-06-20' },
  { id: 5, name: '海鲜汤', icon: '🍲', description: '多种海鲜熬制的浓汤', stock: 0, quality: 'legendary', buffs: [mockBuffs[0], mockBuffs[1], mockBuffs[2], mockBuffs[3]], nutritionValue: 80, moraleBoost: 40, shelfLife: 1, recipeId: 5, createdAt: '2026-06-20', updatedAt: '2026-06-20' },
  { id: 6, name: '面包', icon: '🍞', description: '基础面包', stock: 8, quality: 'normal', buffs: [mockBuffs[4]], nutritionValue: 25, moraleBoost: 5, shelfLife: 7, recipeId: 6, createdAt: '2026-06-18', updatedAt: '2026-06-20' },
];

const mockMembers = [
  {
    id: 1, name: '李明', avatar: '👨', role: 'leader', level: 5, exp: 1250,
    stats: { strength: 15, stamina: 18, intelligence: 16, agility: 14, maxStamina: 100, currentStamina: 75, hunger: 30, morale: 80 },
    currentBuff: [], status: 'idle', assignedTask: null,
    schedule: [
      { id: 's1', dayOfWeek: 1, startTime: '06:00', endTime: '08:00', activity: 'eat', mealId: 6, status: 'pending' },
      { id: 's2', dayOfWeek: 1, startTime: '08:00', endTime: '12:00', activity: 'gather', status: 'pending' },
      { id: 's3', dayOfWeek: 1, startTime: '12:00', endTime: '13:00', activity: 'rest', status: 'pending' },
      { id: 's4', dayOfWeek: 1, startTime: '13:00', endTime: '18:00', activity: 'build', status: 'pending' },
    ],
    inventory: [], createdAt: '2026-06-01', updatedAt: '2026-06-20'
  },
  {
    id: 2, name: '王芳', avatar: '👩', role: 'cook', level: 4, exp: 980,
    stats: { strength: 10, stamina: 12, intelligence: 18, agility: 12, maxStamina: 100, currentStamina: 85, hunger: 20, morale: 85 },
    currentBuff: [mockBuffs[4]], status: 'idle', assignedTask: null,
    schedule: [
      { id: 's5', dayOfWeek: 1, startTime: '06:00', endTime: '08:00', activity: 'eat', mealId: 3, status: 'pending' },
      { id: 's6', dayOfWeek: 1, startTime: '08:00', endTime: '18:00', activity: 'cook', status: 'pending' },
    ],
    inventory: [], createdAt: '2026-06-01', updatedAt: '2026-06-20'
  },
  {
    id: 3, name: '张伟', avatar: '🧔', role: 'gatherer', level: 3, exp: 650,
    stats: { strength: 14, stamina: 20, intelligence: 10, agility: 16, maxStamina: 100, currentStamina: 60, hunger: 45, morale: 70 },
    currentBuff: [mockBuffs[1]], status: 'working', assignedTask: 'gather_food',
    schedule: [
      { id: 's7', dayOfWeek: 1, startTime: '06:00', endTime: '18:00', activity: 'gather', status: 'in_progress' },
    ],
    inventory: [], createdAt: '2026-06-03', updatedAt: '2026-06-20'
  },
  {
    id: 4, name: '刘静', avatar: '👧', role: 'scout', level: 3, exp: 720,
    stats: { strength: 11, stamina: 15, intelligence: 14, agility: 20, maxStamina: 100, currentStamina: 70, hunger: 35, morale: 75 },
    currentBuff: [mockBuffs[3]], status: 'idle', assignedTask: null,
    schedule: [
      { id: 's8', dayOfWeek: 1, startTime: '08:00', endTime: '18:00', activity: 'scout', status: 'pending' },
    ],
    inventory: [], createdAt: '2026-06-05', updatedAt: '2026-06-20'
  },
];

const mockCookingTasks = [
  {
    id: 'ct1', recipeId: 6, recipeName: '面包', cookId: 2, cookName: '王芳',
    startTime: new Date(Date.now() - 120000).toISOString(),
    endTime: new Date(Date.now() + 180000).toISOString(),
    status: 'cooking', outputMealId: 6, outputAmount: 4, quality: null,
    createdAt: new Date(Date.now() - 120000).toISOString()
  },
];

const mockDistributionRecords = [
  {
    id: 'dr1', mealId: 1, mealName: '烤野菜', memberId: 3, memberName: '张伟', amount: 1,
    distributedAt: '2026-06-20 07:30:00', appliedBuffs: [],
    effect: { nutrition: 15, morale: 5, staminaRestore: 10 }
  },
  {
    id: 'dr2', mealId: 4, mealName: '烤兔肉', memberId: 1, memberName: '李明', amount: 1,
    distributedAt: '2026-06-20 07:30:00', appliedBuffs: [mockBuffs[0]],
    effect: { nutrition: 45, morale: 20, staminaRestore: 30 }
  },
];

const mockInventoryLogs = [
  { id: 'il1', type: 'ingredient', itemId: 2, itemName: '野菜', changeType: 'add', amount: 10, balance: 30, reason: '采集获得', createdAt: '2026-06-20 06:00:00' },
  { id: 'il2', type: 'ingredient', itemId: 2, itemName: '野菜', changeType: 'consume', amount: 4, balance: 26, reason: '制作烤野菜', relatedId: 'ct2', createdAt: '2026-06-20 08:00:00' },
  { id: 'il3', type: 'meal', itemId: 1, itemName: '烤野菜', changeType: 'cook', amount: 4, balance: 5, reason: '烹饪完成', relatedId: 'ct2', createdAt: '2026-06-20 09:00:00' },
  { id: 'il4', type: 'meal', itemId: 4, itemName: '烤兔肉', changeType: 'distribute', amount: 1, balance: 4, reason: '分发给成员', relatedId: 'dr2', createdAt: '2026-06-20 07:30:00' },
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const wrapResponse = (data) => ({ code: 200, message: 'success', data });

export const getIngredientList = async (params = {}) => {
  await delay(300);
  let data = [...mockIngredients];
  if (params.keyword) {
    data = data.filter(item => item.name.includes(params.keyword));
  }
  if (params.category) {
    data = data.filter(item => item.category === params.category);
  }
  return wrapResponse({ data, total: data.length, page: params.page || 1, pageSize: params.pageSize || 10, totalPages: Math.ceil(data.length / (params.pageSize || 10)) });
};

export const getIngredientDetail = async (id) => {
  await delay(200);
  const ingredient = mockIngredients.find(item => item.id === id);
  return wrapResponse(ingredient);
};

export const updateIngredientStock = async (id, amount, reason) => {
  await delay(300);
  const ingredient = mockIngredients.find(item => item.id === id);
  if (ingredient) {
    ingredient.stock += amount;
    ingredient.updatedAt = new Date().toISOString();
    mockInventoryLogs.unshift({
      id: 'il' + Date.now(),
      type: 'ingredient',
      itemId: id,
      itemName: ingredient.name,
      changeType: amount > 0 ? 'add' : 'consume',
      amount: Math.abs(amount),
      balance: ingredient.stock,
      reason: reason || (amount > 0 ? '手动添加' : '手动消耗'),
      createdAt: new Date().toISOString()
    });
  }
  return wrapResponse(ingredient);
};

export const getRecipeList = async (params = {}) => {
  await delay(300);
  let data = [...mockRecipes];
  if (params.keyword) {
    data = data.filter(item => item.name.includes(params.keyword));
  }
  if (params.status) {
    data = data.filter(item => item.status === params.status);
  }
  if (params.difficulty) {
    data = data.filter(item => item.difficulty === params.difficulty);
  }
  return wrapResponse({ data, total: data.length, page: params.page || 1, pageSize: params.pageSize || 10, totalPages: Math.ceil(data.length / (params.pageSize || 10)) });
};

export const getRecipeDetail = async (id) => {
  await delay(200);
  const recipe = mockRecipes.find(item => item.id === id);
  return wrapResponse(recipe);
};

export const getMealList = async (params = {}) => {
  await delay(300);
  let data = [...mockMeals];
  if (params.keyword) {
    data = data.filter(item => item.name.includes(params.keyword));
  }
  if (params.quality) {
    data = data.filter(item => item.quality === params.quality);
  }
  return wrapResponse({ data, total: data.length, page: params.page || 1, pageSize: params.pageSize || 10, totalPages: Math.ceil(data.length / (params.pageSize || 10)) });
};

export const getMealDetail = async (id) => {
  await delay(200);
  const meal = mockMeals.find(item => item.id === id);
  return wrapResponse(meal);
};

export const getMemberList = async (params = {}) => {
  await delay(300);
  let data = [...mockMembers];
  if (params.keyword) {
    data = data.filter(item => item.name.includes(params.keyword));
  }
  if (params.role) {
    data = data.filter(item => item.role === params.role);
  }
  if (params.status) {
    data = data.filter(item => item.status === params.status);
  }
  return wrapResponse({ data, total: data.length, page: params.page || 1, pageSize: params.pageSize || 10, totalPages: Math.ceil(data.length / (params.pageSize || 10)) });
};

export const getMemberDetail = async (id) => {
  await delay(200);
  const member = mockMembers.find(item => item.id === id);
  return wrapResponse(member);
};

export const getCookingTasks = async (params = {}) => {
  await delay(300);
  let data = [...mockCookingTasks];
  if (params.status) {
    data = data.filter(item => item.status === params.status);
  }
  return wrapResponse({ data, total: data.length, page: params.page || 1, pageSize: params.pageSize || 10, totalPages: Math.ceil(data.length / (params.pageSize || 10)) });
};

export const startCooking = async (recipeId, cookId = null) => {
  await delay(300);
  const recipe = mockRecipes.find(r => r.id === recipeId);
  if (!recipe) {
    return { code: 404, message: '配方不存在', data: null };
  }

  for (const ing of recipe.ingredients) {
    const ingredient = mockIngredients.find(i => i.id === ing.ingredientId);
    if (!ingredient || ingredient.stock < ing.amount) {
      return { code: 400, message: `食材不足: ${ingredient?.name || '未知食材'}`, data: null };
    }
  }

  for (const ing of recipe.ingredients) {
    const ingredient = mockIngredients.find(i => i.id === ing.ingredientId);
    ingredient.stock -= ing.amount;
    mockInventoryLogs.unshift({
      id: 'il' + Date.now() + Math.random(),
      type: 'ingredient',
      itemId: ing.ingredientId,
      itemName: ingredient.name,
      changeType: 'consume',
      amount: ing.amount,
      balance: ingredient.stock,
      reason: `制作${recipe.name}`,
      createdAt: new Date().toISOString()
    });
  }

  const cook = cookId ? mockMembers.find(m => m.id === cookId) : null;
  const task = {
    id: 'ct' + Date.now(),
    recipeId: recipe.id,
    recipeName: recipe.name,
    cookId: cookId,
    cookName: cook ? cook.name : '无厨师',
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + recipe.cookTime * 1000).toISOString(),
    status: 'cooking',
    outputMealId: recipe.outputMealId,
    outputAmount: recipe.outputAmount,
    quality: null,
    createdAt: new Date().toISOString()
  };

  mockCookingTasks.unshift(task);

  return wrapResponse(task);
};

export const completeCooking = async (taskId) => {
  await delay(300);
  const task = mockCookingTasks.find(t => t.id === taskId);
  if (!task) {
    return { code: 404, message: '烹饪任务不存在', data: null };
  }

  const cook = task.cookId ? mockMembers.find(m => m.id === task.cookId) : null;
  const cookIntelligence = cook ? cook.stats.intelligence : 10;
  const qualityRoll = Math.random() * 100 + cookIntelligence;
  let quality = 'normal';
  if (qualityRoll > 150) quality = 'legendary';
  else if (qualityRoll > 120) quality = 'excellent';
  else if (qualityRoll > 90) quality = 'good';

  task.status = 'completed';
  task.quality = quality;

  const meal = mockMeals.find(m => m.id === task.outputMealId);
  if (meal) {
    meal.stock += task.outputAmount;
    meal.quality = quality;
    meal.updatedAt = new Date().toISOString();

    mockInventoryLogs.unshift({
      id: 'il' + Date.now(),
      type: 'meal',
      itemId: meal.id,
      itemName: meal.name,
      changeType: 'cook',
      amount: task.outputAmount,
      balance: meal.stock,
      reason: `烹饪完成 - ${quality}品质`,
      relatedId: taskId,
      createdAt: new Date().toISOString()
    });
  }

  if (cook) {
    cook.exp += 50;
    cook.stats.currentStamina = Math.max(0, cook.stats.currentStamina - 10);
  }

  return wrapResponse(task);
};

export const distributeMeal = async (mealId, memberId, amount = 1) => {
  await delay(300);
  const meal = mockMeals.find(m => m.id === mealId);
  const member = mockMembers.find(m => m.id === memberId);

  if (!meal || meal.stock < amount) {
    return { code: 400, message: '餐食库存不足', data: null };
  }
  if (!member) {
    return { code: 404, message: '成员不存在', data: null };
  }

  meal.stock -= amount;

  const staminaRestore = meal.nutritionValue * 0.5;
  member.stats.hunger = Math.max(0, member.stats.hunger - meal.nutritionValue);
  member.stats.morale = Math.min(100, member.stats.morale + meal.moraleBoost);
  member.stats.currentStamina = Math.min(member.stats.maxStamina, member.stats.currentStamina + staminaRestore);

  const appliedBuffs = [...meal.buffs];
  member.currentBuff = [...member.currentBuff, ...appliedBuffs];

  const record = {
    id: 'dr' + Date.now(),
    mealId,
    mealName: meal.name,
    memberId,
    memberName: member.name,
    amount,
    distributedAt: new Date().toISOString(),
    appliedBuffs,
    effect: {
      nutrition: meal.nutritionValue,
      morale: meal.moraleBoost,
      staminaRestore
    }
  };

  mockDistributionRecords.unshift(record);

  mockInventoryLogs.unshift({
    id: 'il' + Date.now(),
    type: 'meal',
    itemId: meal.id,
    itemName: meal.name,
    changeType: 'distribute',
    amount,
    balance: meal.stock,
    reason: `分发给${member.name}`,
    relatedId: record.id,
    createdAt: new Date().toISOString()
  });

  return wrapResponse(record);
};

export const getDistributionRecords = async (params = {}) => {
  await delay(300);
  let data = [...mockDistributionRecords];
  if (params.memberId) {
    data = data.filter(item => item.memberId === params.memberId);
  }
  return wrapResponse({ data, total: data.length, page: params.page || 1, pageSize: params.pageSize || 10, totalPages: Math.ceil(data.length / (params.pageSize || 10)) });
};

export const getInventoryLogs = async (params = {}) => {
  await delay(300);
  let data = [...mockInventoryLogs];
  if (params.type) {
    data = data.filter(item => item.type === params.type);
  }
  return wrapResponse({ data, total: data.length, page: params.page || 1, pageSize: params.pageSize || 10, totalPages: Math.ceil(data.length / (params.pageSize || 10)) });
};

export const getKitchenStats = async () => {
  await delay(300);
  const stats = {
    totalRecipes: mockRecipes.length,
    unlockedRecipes: mockRecipes.filter(r => r.status === 'unlocked').length,
    totalMealsCooked: mockInventoryLogs.filter(l => l.changeType === 'cook').reduce((sum, l) => sum + l.amount, 0),
    totalMealsDistributed: mockInventoryLogs.filter(l => l.changeType === 'distribute').reduce((sum, l) => sum + l.amount, 0),
    activeCookingTasks: mockCookingTasks.filter(t => t.status === 'cooking').length,
    lowStockIngredients: mockIngredients.filter(i => i.stock < 10),
    expiringMeals: mockMeals.filter(m => m.stock > 0 && m.shelfLife <= 1),
    averageMorale: mockMembers.reduce((sum, m) => sum + m.stats.morale, 0) / mockMembers.length,
    averageStamina: mockMembers.reduce((sum, m) => sum + m.stats.currentStamina, 0) / mockMembers.length,
    todayMeals: mockMeals.filter(m => m.stock > 0)
  };
  return wrapResponse(stats);
};

export const updateMemberSchedule = async (memberId, schedule) => {
  await delay(300);
  const member = mockMembers.find(m => m.id === memberId);
  if (member) {
    member.schedule = schedule;
    member.updatedAt = new Date().toISOString();
  }
  return wrapResponse(member);
};

export const executeScheduledEat = async (scheduleId) => {
  await delay(300);
  for (const member of mockMembers) {
    const schedule = member.schedule.find(s => s.id === scheduleId);
    if (schedule && schedule.activity === 'eat' && schedule.mealId) {
      schedule.status = 'in_progress';
      const result = await distributeMeal(schedule.mealId, member.id, 1);
      if (result.code === 200) {
        schedule.status = 'completed';
      } else {
        schedule.status = 'missed';
      }
      return wrapResponse({ schedule, distribution: result.data });
    }
  }
  return { code: 404, message: '排班不存在', data: null };
};

export const getBuffList = async () => {
  await delay(200);
  return wrapResponse(mockBuffs);
};

export const processSpoilage = async () => {
  await delay(300);
  const spoiled = [];
  
  for (const meal of mockMeals) {
    if (meal.stock > 0) {
      const spoiledAmount = Math.floor(Math.random() * 2);
      if (spoiledAmount > 0) {
        meal.stock = Math.max(0, meal.stock - spoiledAmount);
        spoiled.push({ name: meal.name, amount: spoiledAmount });
        mockInventoryLogs.unshift({
          id: 'il' + Date.now() + Math.random(),
          type: 'meal',
          itemId: meal.id,
          itemName: meal.name,
          changeType: 'spoil',
          amount: spoiledAmount,
          balance: meal.stock,
          reason: '食物腐坏',
          createdAt: new Date().toISOString()
        });
      }
    }
  }
  
  return wrapResponse(spoiled);
};
