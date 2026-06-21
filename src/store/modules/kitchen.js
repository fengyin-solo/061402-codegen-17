import { defineStore } from 'pinia';
import * as kitchenApi from '../../api/kitchen';

export default defineStore('kitchen', {
  state: () => ({
    ingredients: [],
    recipes: [],
    meals: [],
    members: [],
    cookingTasks: [],
    distributionRecords: [],
    inventoryLogs: [],
    kitchenStats: null,
    buffs: [],
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0
    },
    loading: false,
    error: null,
    activeTimers: new Map()
  }),

  getters: {
    getIngredientById: (state) => (id) => {
      return state.ingredients.find(item => item.id === id);
    },
    getRecipeById: (state) => (id) => {
      return state.recipes.find(item => item.id === id);
    },
    getMealById: (state) => (id) => {
      return state.meals.find(item => item.id === id);
    },
    getMemberById: (state) => (id) => {
      return state.members.find(item => item.id === id);
    },
    getCookingTaskById: (state) => (id) => {
      return state.cookingTasks.find(item => item.id === id);
    },
    getActiveCookingTasks: (state) => {
      return state.cookingTasks.filter(task => task.status === 'cooking');
    },
    getAvailableMeals: (state) => {
      return state.meals.filter(meal => meal.stock > 0);
    },
    getAvailableRecipes: (state) => {
      return state.recipes.filter(recipe => recipe.status === 'unlocked');
    },
    getLowStockIngredients: (state) => {
      return state.ingredients.filter(item => item.stock < 10);
    },
    getExpiringMeals: (state) => {
      return state.meals.filter(meal => meal.stock > 0 && meal.shelfLife <= 1);
    },
    getActiveMembers: (state) => {
      return state.members.filter(member => member.status !== 'injured');
    },
    getCooks: (state) => {
      return state.members.filter(member => member.role === 'cook' && member.status === 'idle');
    }
  },

  actions: {
    async fetchIngredients(params = {}) {
      this.loading = true;
      this.error = null;
      try {
        const result = await kitchenApi.getIngredientList({
          page: this.pagination.page,
          pageSize: this.pagination.pageSize,
          ...params
        });
        this.ingredients = result.data.data;
        this.pagination = {
          ...this.pagination,
          total: result.data.total,
          totalPages: result.data.totalPages
        };
        return result.data;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to fetch ingredients:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchRecipes(params = {}) {
      this.loading = true;
      this.error = null;
      try {
        const result = await kitchenApi.getRecipeList({
          page: this.pagination.page,
          pageSize: this.pagination.pageSize,
          ...params
        });
        this.recipes = result.data.data;
        this.pagination = {
          ...this.pagination,
          total: result.data.total,
          totalPages: result.data.totalPages
        };
        return result.data;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to fetch recipes:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchMeals(params = {}) {
      this.loading = true;
      this.error = null;
      try {
        const result = await kitchenApi.getMealList({
          page: this.pagination.page,
          pageSize: this.pagination.pageSize,
          ...params
        });
        this.meals = result.data.data;
        this.pagination = {
          ...this.pagination,
          total: result.data.total,
          totalPages: result.data.totalPages
        };
        return result.data;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to fetch meals:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchMembers(params = {}) {
      this.loading = true;
      this.error = null;
      try {
        const result = await kitchenApi.getMemberList({
          page: this.pagination.page,
          pageSize: this.pagination.pageSize,
          ...params
        });
        this.members = result.data.data;
        this.pagination = {
          ...this.pagination,
          total: result.data.total,
          totalPages: result.data.totalPages
        };
        return result.data;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to fetch members:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchCookingTasks(params = {}) {
      this.loading = true;
      this.error = null;
      try {
        const result = await kitchenApi.getCookingTasks(params);
        this.cookingTasks = result.data.data;
        return result.data;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to fetch cooking tasks:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchDistributionRecords(params = {}) {
      this.loading = true;
      this.error = null;
      try {
        const result = await kitchenApi.getDistributionRecords(params);
        this.distributionRecords = result.data.data;
        return result.data;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to fetch distribution records:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchInventoryLogs(params = {}) {
      this.loading = true;
      this.error = null;
      try {
        const result = await kitchenApi.getInventoryLogs(params);
        this.inventoryLogs = result.data.data;
        return result.data;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to fetch inventory logs:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchKitchenStats() {
      this.loading = true;
      this.error = null;
      try {
        const result = await kitchenApi.getKitchenStats();
        this.kitchenStats = result.data;
        return result.data;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to fetch kitchen stats:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchBuffs() {
      try {
        const result = await kitchenApi.getBuffList();
        this.buffs = result.data;
        return result.data;
      } catch (error) {
        console.error('Failed to fetch buffs:', error);
      }
    },

    async startCooking(recipeId, cookId = null) {
      this.loading = true;
      this.error = null;
      try {
        const recipe = this.getRecipeById(recipeId);
        for (const ing of recipe.ingredients) {
          const ingredient = this.getIngredientById(ing.ingredientId);
          if (!ingredient || ingredient.stock < ing.amount) {
            throw new Error(`食材不足: ${ingredient?.name || '未知食材'}`);
          }
        }

        const result = await kitchenApi.startCooking(recipeId, cookId);
        if (result.code !== 200) {
          throw new Error(result.message);
        }

        this.cookingTasks.unshift(result.data);

        for (const ing of recipe.ingredients) {
          const ingredient = this.ingredients.find(i => i.id === ing.ingredientId);
          if (ingredient) {
            ingredient.stock -= ing.amount;
          }
        }

        this.scheduleCookingCompletion(result.data);

        return result.data;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to start cooking:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    scheduleCookingCompletion(task) {
      const now = Date.now();
      const endTime = new Date(task.endTime).getTime();
      const delay = Math.max(0, endTime - now);

      if (this.activeTimers.has(task.id)) {
        clearTimeout(this.activeTimers.get(task.id));
      }

      const timer = setTimeout(async () => {
        try {
          await this.completeCooking(task.id);
        } catch (error) {
          console.error('Auto complete cooking failed:', error);
        }
        this.activeTimers.delete(task.id);
      }, delay);

      this.activeTimers.set(task.id, timer);
    },

    async completeCooking(taskId) {
      this.loading = true;
      this.error = null;
      try {
        const result = await kitchenApi.completeCooking(taskId);
        if (result.code !== 200) {
          throw new Error(result.message);
        }

        const task = this.cookingTasks.find(t => t.id === taskId);
        if (task) {
          task.status = 'completed';
          task.quality = result.data.quality;
        }

        const meal = this.meals.find(m => m.id === result.data.outputMealId);
        if (meal) {
          meal.stock += result.data.outputAmount;
          meal.quality = result.data.quality;
        }

        if (result.data.cookId) {
          const cook = this.members.find(m => m.id === result.data.cookId);
          if (cook) {
            cook.exp += 50;
            cook.stats.currentStamina = Math.max(0, cook.stats.currentStamina - 10);
          }
        }

        return result.data;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to complete cooking:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async distributeMeal(mealId, memberId, amount = 1) {
      this.loading = true;
      this.error = null;
      try {
        const result = await kitchenApi.distributeMeal(mealId, memberId, amount);
        if (result.code !== 200) {
          throw new Error(result.message);
        }

        const meal = this.meals.find(m => m.id === mealId);
        if (meal) {
          meal.stock -= amount;
        }

        const member = this.members.find(m => m.id === memberId);
        if (member) {
          const effect = result.data.effect;
          member.stats.hunger = Math.max(0, member.stats.hunger - effect.nutrition);
          member.stats.morale = Math.min(100, member.stats.morale + effect.morale);
          member.stats.currentStamina = Math.min(member.stats.maxStamina, member.stats.currentStamina + effect.staminaRestore);
          member.currentBuff = [...member.currentBuff, ...result.data.appliedBuffs];
        }

        this.distributionRecords.unshift(result.data);

        return result.data;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to distribute meal:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateIngredientStock(id, amount, reason) {
      this.loading = true;
      this.error = null;
      try {
        const result = await kitchenApi.updateIngredientStock(id, amount, reason);
        if (result.code === 200) {
          const ingredient = this.ingredients.find(i => i.id === id);
          if (ingredient) {
            ingredient.stock = result.data.stock;
          }
        }
        return result.data;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to update ingredient stock:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateMemberSchedule(memberId, schedule) {
      this.loading = true;
      this.error = null;
      try {
        const result = await kitchenApi.updateMemberSchedule(memberId, schedule);
        if (result.code === 200) {
          const member = this.members.find(m => m.id === memberId);
          if (member) {
            member.schedule = schedule;
          }
        }
        return result.data;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to update member schedule:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async executeScheduledEat(scheduleId) {
      this.loading = true;
      this.error = null;
      try {
        const result = await kitchenApi.executeScheduledEat(scheduleId);
        if (result.code !== 200) {
          throw new Error(result.message);
        }

        const { schedule, distribution } = result.data;

        if (distribution) {
          const meal = this.meals.find(m => m.id === distribution.mealId);
          if (meal) {
            meal.stock -= distribution.amount;
          }

          const member = this.members.find(m => m.id === distribution.memberId);
          if (member) {
            member.stats.hunger = Math.max(0, member.stats.hunger - distribution.effect.nutrition);
            member.stats.morale = Math.min(100, member.stats.morale + distribution.effect.morale);
            member.stats.currentStamina = Math.min(member.stats.maxStamina, member.stats.currentStamina + distribution.effect.staminaRestore);
            member.currentBuff = [...member.currentBuff, ...distribution.appliedBuffs];

            const sched = member.schedule.find(s => s.id === scheduleId);
            if (sched) {
              sched.status = schedule.status;
            }
          }

          this.distributionRecords.unshift(distribution);
        }

        return result.data;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to execute scheduled eat:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    checkRecipeAvailable(recipeId) {
      const recipe = this.getRecipeById(recipeId);
      if (!recipe || recipe.status !== 'unlocked') return false;

      for (const ing of recipe.ingredients) {
        const ingredient = this.getIngredientById(ing.ingredientId);
        if (!ingredient || ingredient.stock < ing.amount) {
          return false;
        }
      }
      return true;
    },

    async fetchAllData() {
      await Promise.all([
        this.fetchIngredients(),
        this.fetchRecipes(),
        this.fetchMeals(),
        this.fetchMembers(),
        this.fetchCookingTasks(),
        this.fetchKitchenStats(),
        this.fetchBuffs()
      ]);

      this.getActiveCookingTasks.forEach(task => {
        if (task.status === 'cooking') {
          this.scheduleCookingCompletion(task);
        }
      });
    },

    setPage(page) {
      this.pagination.page = page;
    },

    setPageSize(pageSize) {
      this.pagination.pageSize = pageSize;
      this.pagination.page = 1;
    },

    clearError() {
      this.error = null;
    },

    cleanup() {
      this.activeTimers.forEach(timer => clearTimeout(timer));
      this.activeTimers.clear();
    }
  }
});
