<template>
  <div class="kitchen-container">
    <div class="kitchen-header">
      <h1>🍳 中央厨房</h1>
      <p>管理食材、烹饪美食、分发餐食、增益团队</p>
    </div>

    <div class="stats-row">
      <div class="stat-card" v-for="stat in statsCards" :key="stat.key">
        <div class="stat-icon">{{ stat.icon }}</div>
        <div class="stat-content">
          <div class="stat-number">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <el-tabs v-model="activeTab" class="kitchen-tabs">
      <el-tab-pane label="📦 食材库存" name="ingredients">
        <div class="section-header">
          <h3>食材列表</h3>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索食材..."
            style="width: 200px"
            clearable
          />
          <el-select v-model="categoryFilter" placeholder="分类筛选" clearable style="width: 150px">
            <el-option label="基础食材" value="basic" />
            <el-option label="蔬菜" value="vegetable" />
            <el-option label="肉类" value="meat" />
            <el-option label="海鲜" value="seafood" />
            <el-option label="其他" value="other" />
          </el-select>
        </div>
        <div class="ingredient-grid">
          <div
            class="ingredient-card"
            v-for="ingredient in filteredIngredients"
            :key="ingredient.id"
            :class="{ 'low-stock': ingredient.stock < 10 }"
          >
            <div class="ingredient-icon">{{ ingredient.icon }}</div>
            <div class="ingredient-name">{{ ingredient.name }}</div>
            <div class="ingredient-desc">{{ ingredient.description }}</div>
            <div class="ingredient-stock">
              <span class="stock-label">库存:</span>
              <span class="stock-value">{{ ingredient.stock }} {{ ingredient.unit }}</span>
            </div>
            <div class="ingredient-shelf">
              <span>保质期: {{ ingredient.shelfLife }}天</span>
            </div>
            <div class="ingredient-actions">
              <el-button size="small" type="primary" @click="adjustStock(ingredient, 10)">
                +10
              </el-button>
              <el-button size="small" type="danger" @click="adjustStock(ingredient, -5)">
                -5
              </el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="📜 配方列表" name="recipes">
        <div class="section-header">
          <h3>可烹饪配方</h3>
          <el-select v-model="difficultyFilter" placeholder="难度筛选" clearable style="width: 150px">
            <el-option label="简单" value="easy" />
            <el-option label="中等" value="medium" />
            <el-option label="困难" value="hard" />
          </el-select>
        </div>
        <div class="recipe-grid">
          <div
            class="recipe-card"
            v-for="recipe in filteredRecipes"
            :key="recipe.id"
            :class="{ locked: recipe.status === 'locked' }"
          >
            <div class="recipe-header">
              <span class="recipe-icon">{{ recipe.icon }}</span>
              <span class="recipe-name">{{ recipe.name }}</span>
              <el-tag :type="getDifficultyType(recipe.difficulty)" size="small">
                {{ getDifficultyLabel(recipe.difficulty) }}
              </el-tag>
            </div>
            <div class="recipe-desc">{{ recipe.description }}</div>
            <div class="recipe-ingredients">
              <div class="section-subtitle">所需食材:</div>
              <div class="ingredient-list">
                <div
                  v-for="ing in recipe.ingredients"
                  :key="ing.ingredientId"
                  class="ingredient-item"
                  :class="{ insufficient: !hasEnoughIngredient(ing) }"
                >
                  <span>{{ getIngredientName(ing.ingredientId) }}</span>
                  <span>
                    {{ ing.amount }} / {{ getIngredientStock(ing.ingredientId) }}
                  </span>
                </div>
              </div>
            </div>
            <div class="recipe-buffs" v-if="recipe.buffs.length > 0">
              <div class="section-subtitle">增益效果:</div>
              <div class="buff-list">
                <el-tag
                  v-for="buff in recipe.buffs"
                  :key="buff.id"
                  size="small"
                  effect="light"
                  :type="getBuffType(buff.type)"
                >
                  {{ buff.icon }} {{ buff.name }} +{{ buff.value }}%
                </el-tag>
              </div>
            </div>
            <div class="recipe-footer">
              <div class="recipe-info">
                <span>⏱️ {{ formatTime(recipe.cookTime) }}</span>
                <span>产出: {{ recipe.outputAmount }}份</span>
              </div>
              <el-button
                type="primary"
                :disabled="!canCook(recipe)"
                @click="showCookDialog(recipe)"
              >
                开始烹饪
              </el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="🍽️ 餐食管理" name="meals">
        <div class="section-header">
          <h3>可用餐食</h3>
        </div>
        <div class="meal-grid">
          <div
            class="meal-card"
            v-for="meal in kitchenStore.getAvailableMeals"
            :key="meal.id"
            :class="[`quality-${meal.quality}`, { 'expiring': meal.shelfLife <= 1 }]"
          >
            <div class="meal-header">
              <span class="meal-icon">{{ meal.icon }}</span>
              <span class="meal-name">{{ meal.name }}</span>
              <el-tag :type="getQualityType(meal.quality)" size="small">
                {{ getQualityLabel(meal.quality) }}
              </el-tag>
            </div>
            <div class="meal-desc">{{ meal.description }}</div>
            <div class="meal-stats">
              <div class="stat-item">
                <span class="stat-label">库存</span>
                <span class="stat-value">{{ meal.stock }}份</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">营养</span>
                <span class="stat-value">{{ meal.nutritionValue }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">士气</span>
                <span class="stat-value">+{{ meal.moraleBoost }}</span>
              </div>
            </div>
            <div class="meal-buffs" v-if="meal.buffs.length > 0">
              <div class="buff-list">
                <el-tag
                  v-for="buff in meal.buffs"
                  :key="buff.id"
                  size="small"
                  effect="light"
                  :type="getBuffType(buff.type)"
                >
                  {{ buff.icon }} {{ buff.name }}
                </el-tag>
              </div>
            </div>
            <el-button
              type="success"
              @click="showDistributeDialog(meal)"
              :disabled="meal.stock <= 0"
            >
              分发餐食
            </el-button>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="👥 成员管理" name="members">
        <div class="section-header">
          <h3>团队成员</h3>
        </div>
        <div class="member-grid">
          <div
            class="member-card"
            v-for="member in kitchenStore.members"
            :key="member.id"
          >
            <div class="member-header">
              <span class="member-avatar">{{ member.avatar }}</span>
              <div class="member-info">
                <div class="member-name">{{ member.name }}</div>
                <el-tag :type="getRoleType(member.role)" size="small">
                  {{ getRoleLabel(member.role) }}
                </el-tag>
              </div>
              <el-tag :type="getStatusType(member.status)" size="small">
                {{ getStatusLabel(member.status) }}
              </el-tag>
            </div>

            <div class="member-stats">
              <div class="stat-row">
                <span class="stat-label">等级</span>
                <span class="stat-value">Lv.{{ member.level }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">经验</span>
                <span class="stat-value">{{ member.exp }}/2000</span>
              </div>
            </div>

            <div class="member-bars">
              <div class="bar-item">
                <span>体力</span>
                <el-progress
                  :percentage="Math.round((member.stats.currentStamina / member.stats.maxStamina) * 100)"
                  :color="getBarColor(member.stats.currentStamina, member.stats.maxStamina)"
                  :stroke-width="8"
                />
                <span>{{ member.stats.currentStamina }}/{{ member.stats.maxStamina }}</span>
              </div>
              <div class="bar-item">
                <span>饥饿</span>
                <el-progress
                  :percentage="100 - member.stats.hunger"
                  color="#67c23a"
                  :stroke-width="8"
                />
                <span>{{ 100 - member.stats.hunger }}%</span>
              </div>
              <div class="bar-item">
                <span>士气</span>
                <el-progress
                  :percentage="member.stats.morale"
                  color="#e6a23c"
                  :stroke-width="8"
                />
                <span>{{ member.stats.morale }}%</span>
              </div>
            </div>

            <div class="member-attrs">
              <div class="attr-item" title="力量">
                <span>💪</span>
                <span>{{ member.stats.strength }}</span>
              </div>
              <div class="attr-item" title="耐力">
                <span>🏃</span>
                <span>{{ member.stats.stamina }}</span>
              </div>
              <div class="attr-item" title="智力">
                <span>🧠</span>
                <span>{{ member.stats.intelligence }}</span>
              </div>
              <div class="attr-item" title="敏捷">
                <span>⚡</span>
                <span>{{ member.stats.agility }}</span>
              </div>
            </div>

            <div class="member-buffs" v-if="member.currentBuff.length > 0">
              <div class="section-subtitle">当前增益:</div>
              <div class="buff-list">
                <el-tag
                  v-for="buff in member.currentBuff"
                  :key="buff.id + Math.random()"
                  size="small"
                  effect="light"
                  :type="getBuffType(buff.type)"
                >
                  {{ buff.icon }} {{ buff.name }}
                </el-tag>
              </div>
            </div>

            <div class="member-schedule">
              <div class="section-subtitle">今日排班:</div>
              <div class="schedule-list">
                <div
                  v-for="schedule in member.schedule"
                  :key="schedule.id"
                  class="schedule-item"
                  :class="schedule.status"
                >
                  <span>{{ schedule.startTime }}-{{ schedule.endTime }}</span>
                  <span>{{ getActivityLabel(schedule.activity) }}</span>
                  <span v-if="schedule.mealId" class="schedule-meal">
                    {{ getMealName(schedule.mealId) }}
                  </span>
                  <el-tag :type="getScheduleStatusType(schedule.status)" size="small">
                    {{ getScheduleStatusLabel(schedule.status) }}
                  </el-tag>
                </div>
              </div>
            </div>

            <div class="member-actions">
              <el-button
                size="small"
                type="success"
                @click="feedMember(member)"
                :disabled="member.status === 'injured'"
              >
                快速喂食
              </el-button>
              <el-button
                size="small"
                type="primary"
                @click="showScheduleDialog(member)"
              >
                编辑排班
              </el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="🔥 烹饪进度" name="cooking">
        <div class="section-header">
          <h3>正在烹饪</h3>
        </div>
        <div class="cooking-list" v-if="kitchenStore.getActiveCookingTasks.length > 0">
          <div
            class="cooking-task"
            v-for="task in kitchenStore.getActiveCookingTasks"
            :key="task.id"
          >
            <div class="task-header">
              <span class="task-icon">👨‍🍳</span>
              <span class="task-name">{{ task.recipeName }}</span>
              <span class="task-cook">厨师: {{ task.cookName }}</span>
            </div>
            <div class="task-progress">
              <el-progress
                :percentage="getCookingProgress(task)"
                :status="getCookingProgress(task) >= 100 ? 'success' : ''"
                color="#f56c6c"
              />
              <span class="task-time">
                剩余: {{ getRemainingTime(task) }}
              </span>
            </div>
            <div class="task-footer">
              <span>预计产出: {{ task.outputAmount }}份</span>
            </div>
          </div>
        </div>
        <el-empty v-else description="暂无烹饪任务" />

        <div class="section-header" style="margin-top: 30px">
          <h3>烹饪历史</h3>
        </div>
        <el-table :data="completedCookingTasks" style="width: 100%">
          <el-table-column prop="recipeName" label="配方" width="120" />
          <el-table-column prop="cookName" label="厨师" width="100" />
          <el-table-column prop="outputAmount" label="产出" width="80" />
          <el-table-column label="品质" width="100">
            <template #default="{ row }">
              <el-tag :type="getQualityType(row.quality)" size="small">
                {{ getQualityLabel(row.quality) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="endTime" label="完成时间" width="200">
            <template #default="{ row }">
              {{ formatDate(row.endTime) }}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="📊 分发记录" name="distribution">
        <div class="section-header">
          <h3>分发历史</h3>
        </div>
        <el-table :data="kitchenStore.distributionRecords" style="width: 100%">
          <el-table-column prop="mealName" label="餐食" width="120" />
          <el-table-column prop="memberName" label="成员" width="100" />
          <el-table-column prop="amount" label="数量" width="80" />
          <el-table-column label="效果" min-width="200">
            <template #default="{ row }">
              <span>营养+{{ row.effect.nutrition }}, 士气+{{ row.effect.morale }}, 体力+{{ row.effect.staminaRestore }}</span>
            </template>
          </el-table-column>
          <el-table-column label="增益" min-width="200">
            <template #default="{ row }">
              <el-tag
                v-for="buff in row.appliedBuffs"
                :key="buff.id"
                size="small"
                effect="light"
                style="margin-right: 5px"
              >
                {{ buff.icon }} {{ buff.name }}
              </el-tag>
              <span v-if="row.appliedBuffs.length === 0">无</span>
            </template>
          </el-table-column>
          <el-table-column prop="distributedAt" label="时间" width="200">
            <template #default="{ row }">
              {{ formatDate(row.distributedAt) }}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      v-model="cookDialogVisible"
      title="开始烹饪"
      width="500px"
    >
      <div v-if="selectedRecipe">
        <div class="dialog-recipe">
          <span class="recipe-icon">{{ selectedRecipe.icon }}</span>
          <span class="recipe-name">{{ selectedRecipe.name }}</span>
        </div>
        <div class="dialog-section">
          <label>选择厨师:</label>
          <el-select v-model="selectedCookId" placeholder="选择厨师（可选）" style="width: 100%">
            <el-option label="无厨师（自动烹饪）" :value="null" />
            <el-option
              v-for="cook in kitchenStore.getCooks"
              :key="cook.id"
              :label="`${cook.name} (智力: ${cook.stats.intelligence})`"
              :value="cook.id"
            />
          </el-select>
          <div class="tip">厨师智力越高，烹饪出高品质食物的概率越大</div>
        </div>
        <div class="dialog-section">
          <label>烹饪时间:</label>
          <span>{{ formatTime(selectedRecipe.cookTime) }}</span>
        </div>
        <div class="dialog-section">
          <label>预计产出:</label>
          <span>{{ selectedRecipe.outputAmount }}份</span>
        </div>
      </div>
      <template #footer>
        <el-button @click="cookDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCook">开始烹饪</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="distributeDialogVisible"
      title="分发餐食"
      width="500px"
    >
      <div v-if="selectedMeal">
        <div class="dialog-meal">
          <span class="meal-icon">{{ selectedMeal.icon }}</span>
          <span class="meal-name">{{ selectedMeal.name }}</span>
          <el-tag :type="getQualityType(selectedMeal.quality)" size="small">
            {{ getQualityLabel(selectedMeal.quality) }}
          </el-tag>
        </div>
        <div class="dialog-section">
          <label>选择成员:</label>
          <el-select v-model="selectedMemberId" placeholder="选择成员" style="width: 100%">
            <el-option
              v-for="member in kitchenStore.getActiveMembers"
              :key="member.id"
              :label="`${member.name} (${getRoleLabel(member.role)})`"
              :value="member.id"
            />
          </el-select>
        </div>
        <div class="dialog-section">
          <label>分发数量:</label>
          <el-input-number
            v-model="distributeAmount"
            :min="1"
            :max="selectedMeal.stock"
          />
        </div>
        <div class="dialog-section">
          <label>预计效果:</label>
          <div class="effect-preview">
            <div>🍎 营养值: {{ selectedMeal.nutritionValue * distributeAmount }}</div>
            <div>😊 士气提升: +{{ selectedMeal.moraleBoost * distributeAmount }}</div>
            <div>⚡ 体力恢复: +{{ Math.round(selectedMeal.nutritionValue * 0.5 * distributeAmount) }}</div>
          </div>
        </div>
        <div class="dialog-section" v-if="selectedMeal.buffs.length > 0">
          <label>附加增益:</label>
          <div class="buff-list">
            <el-tag
              v-for="buff in selectedMeal.buffs"
              :key="buff.id"
              size="small"
              effect="light"
              :type="getBuffType(buff.type)"
            >
              {{ buff.icon }} {{ buff.name }} +{{ buff.value }}%
            </el-tag>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="distributeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmDistribute">确认分发</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="scheduleDialogVisible"
      title="编辑排班"
      width="600px"
    >
      <div v-if="selectedMember">
        <div class="dialog-member">
          <span class="member-avatar">{{ selectedMember.avatar }}</span>
          <span class="member-name">{{ selectedMember.name }} 的排班</span>
        </div>
        <el-table
          :data="editingSchedule"
          border
          style="width: 100%"
          @row-click="handleScheduleRowClick"
        >
          <el-table-column label="时间" width="150">
            <template #default="{ row }">
              {{ row.startTime }} - {{ row.endTime }}
            </template>
          </el-table-column>
          <el-table-column label="活动" width="120">
            <template #default="{ row }">
              {{ getActivityLabel(row.activity) }}
            </template>
          </el-table-column>
          <el-table-column label="关联餐食" width="150">
            <template #default="{ row }">
              <el-select
                v-if="row.activity === 'eat'"
                v-model="row.mealId"
                placeholder="选择餐食"
                size="small"
                style="width: 120px"
              >
                <el-option
                  v-for="meal in kitchenStore.getAvailableMeals"
                  :key="meal.id"
                  :label="meal.name"
                  :value="meal.id"
                />
              </el-select>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getScheduleStatusType(row.status)" size="small">
                {{ getScheduleStatusLabel(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button
                v-if="row.activity === 'eat' && row.status === 'pending'"
                type="success"
                size="small"
                @click.stop="executeEatSchedule(row)"
              >
                执行
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <el-button @click="scheduleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSchedule">保存排班</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useKitchenStore } from '../../store';
import { ElMessage, ElMessageBox } from 'element-plus';

const kitchenStore = useKitchenStore();

const activeTab = ref('ingredients');
const searchKeyword = ref('');
const categoryFilter = ref('');
const difficultyFilter = ref('');

const cookDialogVisible = ref(false);
const selectedRecipe = ref(null);
const selectedCookId = ref(null);

const distributeDialogVisible = ref(false);
const selectedMeal = ref(null);
const selectedMemberId = ref(null);
const distributeAmount = ref(1);

const scheduleDialogVisible = ref(false);
const selectedMember = ref(null);
const editingSchedule = ref([]);

let progressTimer = null;

const statsCards = computed(() => [
  { key: 'recipes', icon: '📜', label: '已解锁配方', value: kitchenStore.kitchenStats?.unlockedRecipes || 0 },
  { key: 'meals', icon: '🍽️', label: '烹饪总数', value: kitchenStore.kitchenStats?.totalMealsCooked || 0 },
  { key: 'distributed', icon: '📤', label: '分发总数', value: kitchenStore.kitchenStats?.totalMealsDistributed || 0 },
  { key: 'cooking', icon: '🔥', label: '正在烹饪', value: kitchenStore.kitchenStats?.activeCookingTasks || 0 },
  { key: 'morale', icon: '😊', label: '平均士气', value: Math.round(kitchenStore.kitchenStats?.averageMorale || 0) + '%' },
  { key: 'stamina', icon: '⚡', label: '平均体力', value: Math.round(kitchenStore.kitchenStats?.averageStamina || 0) + '%' },
]);

const filteredIngredients = computed(() => {
  let data = kitchenStore.ingredients;
  if (searchKeyword.value) {
    data = data.filter(item => item.name.includes(searchKeyword.value));
  }
  if (categoryFilter.value) {
    data = data.filter(item => item.category === categoryFilter.value);
  }
  return data;
});

const filteredRecipes = computed(() => {
  let data = kitchenStore.getAvailableRecipes;
  if (difficultyFilter.value) {
    data = data.filter(item => item.difficulty === difficultyFilter.value);
  }
  return data;
});

const completedCookingTasks = computed(() => {
  return kitchenStore.cookingTasks.filter(t => t.status === 'completed');
});

const hasEnoughIngredient = (ing) => {
  const ingredient = kitchenStore.getIngredientById(ing.ingredientId);
  return ingredient && ingredient.stock >= ing.amount;
};

const getIngredientName = (id) => {
  const ingredient = kitchenStore.getIngredientById(id);
  return ingredient ? ingredient.name : '未知';
};

const getIngredientStock = (id) => {
  const ingredient = kitchenStore.getIngredientById(id);
  return ingredient ? ingredient.stock : 0;
};

const getMealName = (id) => {
  const meal = kitchenStore.getMealById(id);
  return meal ? meal.name : '未知';
};

const canCook = (recipe) => {
  return kitchenStore.checkRecipeAvailable(recipe.id);
};

const adjustStock = async (ingredient, amount) => {
  try {
    await kitchenStore.updateIngredientStock(ingredient.id, amount, '手动调整');
    ElMessage.success(`${ingredient.name} 库存已${amount > 0 ? '增加' : '减少'} ${Math.abs(amount)}`);
  } catch (error) {
    ElMessage.error(error.message);
  }
};

const showCookDialog = (recipe) => {
  selectedRecipe.value = recipe;
  selectedCookId.value = null;
  cookDialogVisible.value = true;
};

const confirmCook = async () => {
  try {
    await kitchenStore.startCooking(selectedRecipe.value.id, selectedCookId.value);
    cookDialogVisible.value = false;
    ElMessage.success(`开始烹饪 ${selectedRecipe.value.name}！`);
    await kitchenStore.fetchKitchenStats();
  } catch (error) {
    ElMessage.error(error.message);
  }
};

const showDistributeDialog = (meal) => {
  selectedMeal.value = meal;
  selectedMemberId.value = null;
  distributeAmount.value = 1;
  distributeDialogVisible.value = true;
};

const confirmDistribute = async () => {
  if (!selectedMemberId.value) {
    ElMessage.warning('请选择成员');
    return;
  }
  try {
    await kitchenStore.distributeMeal(selectedMeal.value.id, selectedMemberId.value, distributeAmount.value);
    distributeDialogVisible.value = false;
    ElMessage.success(`已将 ${selectedMeal.value.name} 分发给成员！`);
    await kitchenStore.fetchKitchenStats();
    await kitchenStore.fetchDistributionRecords();
  } catch (error) {
    ElMessage.error(error.message);
  }
};

const feedMember = async (member) => {
  const availableMeals = kitchenStore.getAvailableMeals;
  if (availableMeals.length === 0) {
    ElMessage.warning('没有可用的餐食');
    return;
  }

  const bestMeal = availableMeals.reduce((prev, curr) =>
    curr.nutritionValue > prev.nutritionValue ? curr : prev
  );

  try {
    await kitchenStore.distributeMeal(bestMeal.id, member.id, 1);
    ElMessage.success(`已喂食 ${member.name} ${bestMeal.name}！`);
  } catch (error) {
    ElMessage.error(error.message);
  }
};

const showScheduleDialog = (member) => {
  selectedMember.value = member;
  editingSchedule.value = JSON.parse(JSON.stringify(member.schedule));
  scheduleDialogVisible.value = true;
};

const handleScheduleRowClick = (row) => {
};

const executeEatSchedule = async (schedule) => {
  if (!schedule.mealId) {
    ElMessage.warning('请先选择餐食');
    return;
  }
  try {
    await kitchenStore.executeScheduledEat(schedule.id);
    ElMessage.success('已执行就餐排班！');
    schedule.status = 'completed';
    await kitchenStore.fetchKitchenStats();
    await kitchenStore.fetchDistributionRecords();
  } catch (error) {
    ElMessage.error(error.message);
  }
};

const saveSchedule = async () => {
  try {
    await kitchenStore.updateMemberSchedule(selectedMember.value.id, editingSchedule.value);
    scheduleDialogVisible.value = false;
    ElMessage.success('排班已保存！');
  } catch (error) {
    ElMessage.error(error.message);
  }
};

const getCookingProgress = (task) => {
  const now = Date.now();
  const start = new Date(task.startTime).getTime();
  const end = new Date(task.endTime).getTime();
  const total = end - start;
  const elapsed = now - start;
  return Math.min(100, Math.round((elapsed / total) * 100));
};

const getRemainingTime = (task) => {
  const now = Date.now();
  const end = new Date(task.endTime).getTime();
  const remaining = Math.max(0, end - now);
  const seconds = Math.ceil(remaining / 1000);
  if (seconds < 60) return `${seconds}秒`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}分${secs}秒`;
};

const formatTime = (seconds) => {
  if (seconds < 60) return `${seconds}秒`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}分${seconds % 60}秒`;
  return `${Math.floor(seconds / 3600)}小时${Math.floor((seconds % 3600) / 60)}分`;
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString('zh-CN');
};

const getDifficultyType = (difficulty) => {
  const types = { easy: 'success', medium: 'warning', hard: 'danger' };
  return types[difficulty] || 'info';
};

const getDifficultyLabel = (difficulty) => {
  const labels = { easy: '简单', medium: '中等', hard: '困难' };
  return labels[difficulty] || difficulty;
};

const getQualityType = (quality) => {
  const types = { normal: 'info', good: 'success', excellent: 'warning', legendary: 'danger' };
  return types[quality] || 'info';
};

const getQualityLabel = (quality) => {
  const labels = { normal: '普通', good: '良好', excellent: '优秀', legendary: '传奇' };
  return labels[quality] || quality;
};

const getBuffType = (type) => {
  const types = { stat_boost: 'primary', efficiency: 'success', resistance: 'warning', special: 'danger' };
  return types[type] || 'info';
};

const getRoleType = (role) => {
  const types = { leader: 'danger', cook: 'warning', gatherer: 'success', builder: 'info', guard: 'primary', scout: 'warning' };
  return types[role] || 'info';
};

const getRoleLabel = (role) => {
  const labels = { leader: '队长', cook: '厨师', gatherer: '采集者', builder: '建造师', guard: '守卫', scout: '侦察兵' };
  return labels[role] || role;
};

const getStatusType = (status) => {
  const types = { idle: 'info', working: 'primary', resting: 'success', eating: 'warning', injured: 'danger' };
  return types[status] || 'info';
};

const getStatusLabel = (status) => {
  const labels = { idle: '空闲', working: '工作中', resting: '休息中', eating: '就餐中', injured: '受伤' };
  return labels[status] || status;
};

const getActivityLabel = (activity) => {
  const labels = { gather: '采集', cook: '烹饪', build: '建造', guard: '守卫', scout: '侦察', rest: '休息', eat: '就餐' };
  return labels[activity] || activity;
};

const getScheduleStatusType = (status) => {
  const types = { pending: 'info', in_progress: 'primary', completed: 'success', missed: 'danger' };
  return types[status] || 'info';
};

const getScheduleStatusLabel = (status) => {
  const labels = { pending: '待执行', in_progress: '进行中', completed: '已完成', missed: '已错过' };
  return labels[status] || status;
};

const getBarColor = (current, max) => {
  const percent = (current / max) * 100;
  if (percent > 60) return '#67c23a';
  if (percent > 30) return '#e6a23c';
  return '#f56c6c';
};

onMounted(async () => {
  await kitchenStore.fetchAllData();
  await kitchenStore.fetchDistributionRecords();

  progressTimer = setInterval(() => {
  }, 1000);
});

onUnmounted(() => {
  if (progressTimer) {
    clearInterval(progressTimer);
  }
  kitchenStore.cleanup();
});
</script>

<style scoped>
.kitchen-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  padding: 20px;
}

.kitchen-header {
  text-align: center;
  color: #8b4513;
  margin-bottom: 30px;
}

.kitchen-header h1 {
  font-size: 36px;
  margin: 0 0 10px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.kitchen-header p {
  font-size: 16px;
  margin: 0;
  opacity: 0.8;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 15px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 36px;
  margin-right: 15px;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.kitchen-tabs {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.section-header h3 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.section-subtitle {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}

.ingredient-grid,
.recipe-grid,
.meal-grid,
.member-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.ingredient-card,
.recipe-card,
.meal-card,
.member-card {
  background: #fafafa;
  border-radius: 10px;
  padding: 20px;
  border: 2px solid #eee;
  transition: all 0.3s ease;
}

.ingredient-card:hover,
.recipe-card:hover,
.meal-card:hover,
.member-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: #e6a23c;
}

.ingredient-card.low-stock {
  border-color: #f56c6c;
  background: #fef0f0;
}

.ingredient-icon,
.recipe-icon,
.meal-icon,
.member-avatar {
  font-size: 48px;
  text-align: center;
  display: block;
  margin-bottom: 10px;
}

.ingredient-name,
.recipe-name,
.meal-name,
.member-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 8px;
}

.ingredient-desc,
.recipe-desc,
.meal-desc {
  font-size: 13px;
  color: #666;
  text-align: center;
  margin-bottom: 12px;
  min-height: 36px;
}

.ingredient-stock,
.ingredient-shelf {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-bottom: 8px;
  padding: 4px 10px;
  background: white;
  border-radius: 4px;
}

.stock-label {
  color: #999;
}

.stock-value {
  font-weight: bold;
  color: #e6a23c;
}

.ingredient-actions {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.ingredient-actions .el-button {
  flex: 1;
}

.recipe-header,
.meal-header,
.member-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.recipe-header .recipe-icon,
.meal-header .meal-icon,
.member-header .member-avatar {
  font-size: 32px;
  margin: 0;
}

.recipe-header .recipe-name,
.meal-header .meal-name,
.member-header .member-name {
  flex: 1;
  text-align: left;
  margin: 0;
}

.recipe-ingredients {
  background: white;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}

.ingredient-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ingredient-item {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  padding: 4px 8px;
  background: #f5f5f5;
  border-radius: 4px;
}

.ingredient-item.insufficient {
  background: #fef0f0;
  color: #f56c6c;
}

.buff-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.recipe-buffs,
.meal-buffs,
.member-buffs {
  margin-bottom: 12px;
}

.recipe-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.recipe-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

.meal-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
}

.stat-item {
  text-align: center;
}

.stat-item .stat-label {
  display: block;
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.stat-item .stat-value {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.quality-good {
  border-color: #67c23a;
}

.quality-excellent {
  border-color: #e6a23c;
  background: #fdf6ec;
}

.quality-legendary {
  border-color: #f56c6c;
  background: linear-gradient(135deg, #fef0f0 0%, #fde2e2 100%);
  box-shadow: 0 0 15px rgba(245, 108, 108, 0.3);
}

.expiring {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.member-info {
  flex: 1;
}

.member-stats {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 12px;
}

.stat-row {
  text-align: center;
}

.stat-row .stat-label {
  display: block;
  font-size: 11px;
  color: #999;
}

.stat-row .stat-value {
  font-weight: bold;
  color: #333;
}

.member-bars {
  margin-bottom: 12px;
}

.bar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.bar-item > span:first-child {
  width: 40px;
  font-size: 12px;
  color: #666;
}

.bar-item > span:last-child {
  width: 60px;
  font-size: 12px;
  text-align: right;
}

.bar-item .el-progress {
  flex: 1;
}

.member-attrs {
  display: flex;
  justify-content: space-around;
  padding: 10px;
  background: white;
  border-radius: 8px;
  margin-bottom: 12px;
}

.attr-item {
  text-align: center;
  font-size: 12px;
}

.attr-item span:first-child {
  display: block;
  font-size: 18px;
  margin-bottom: 2px;
}

.member-schedule {
  margin-bottom: 12px;
}

.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.schedule-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: white;
  border-radius: 4px;
  font-size: 12px;
  flex-wrap: wrap;
}

.schedule-item.completed {
  background: #f0f9eb;
  opacity: 0.7;
}

.schedule-item.in_progress {
  background: #ecf5ff;
}

.schedule-meal {
  color: #e6a23c;
  font-weight: bold;
}

.member-actions {
  display: flex;
  gap: 10px;
}

.member-actions .el-button {
  flex: 1;
}

.cooking-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cooking-task {
  background: #fdf6ec;
  border: 2px solid #e6a23c;
  border-radius: 10px;
  padding: 20px;
}

.task-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.task-icon {
  font-size: 32px;
}

.task-name {
  flex: 1;
  font-size: 18px;
  font-weight: bold;
  color: #8b4513;
}

.task-cook {
  font-size: 13px;
  color: #666;
}

.task-progress {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.task-progress .el-progress {
  flex: 1;
}

.task-time {
  font-size: 13px;
  color: #e6a23c;
  font-weight: bold;
  min-width: 100px;
  text-align: right;
}

.task-footer {
  font-size: 12px;
  color: #666;
}

.dialog-recipe,
.dialog-meal,
.dialog-member {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #fdf6ec;
  border-radius: 8px;
  margin-bottom: 20px;
}

.dialog-recipe .recipe-icon,
.dialog-meal .meal-icon,
.dialog-member .member-avatar {
  font-size: 48px;
  margin: 0;
}

.dialog-recipe .recipe-name,
.dialog-meal .meal-name,
.dialog-member .member-name {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.dialog-section {
  margin-bottom: 15px;
}

.dialog-section label {
  display: block;
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.tip {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.effect-preview {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 6px;
}

.effect-preview > div {
  margin-bottom: 6px;
  font-size: 14px;
}

.recipe-card.locked {
  opacity: 0.5;
  pointer-events: none;
}

.recipe-card.locked::after {
  content: '🔒 未解锁';
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 12px;
  color: #f56c6c;
}

.recipe-card {
  position: relative;
}
</style>
