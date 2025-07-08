<script setup>
import { usePlayerStore } from '@/stores/player'
import StatInput from './StatInput.vue'
import StatPair from './StatPair.vue'

const props = defineProps(['playerId'])
const store = usePlayerStore()

const save = async () => {
  await store.saveStats(props.playerId)
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- 基础数据 -->
    <div class="space-y-2">
      <StatInput label="GP" v-model="store.stats.GP" />
      <StatInput label="MIN" v-model="store.stats.MIN" />
    </div>

    <!-- 得分 -->
    <div class="space-y-2">
      <StatPair label="FGM/FGA" v-model:made="store.stats.FGM" v-model:attempted="store.stats.FGA"
        :percentage="store.percentages.fg" />
      <StatPair label="3PM/3PA" v-model:made="store.stats.TPM" v-model:attempted="store.stats.TPA"
        :percentage="store.percentages.three" />
      <StatPair label="FTM/FTA" v-model:made="store.stats.FTM" v-model:attempted="store.stats.FTA"
        :percentage="store.percentages.ft" />
      <div class="form-control">
        <label class="label">
          <span class="label-text">总得分</span>
        </label>
        <input :value="store.pts" class="input input-bordered" readonly>
      </div>
    </div>

    <!-- 篮板 -->
    <div class="space-y-2">
      <StatInput label="OREB" v-model="store.stats.OREB" />
      <StatInput label="DREB" v-model="store.stats.DREB" />
      <div class="form-control">
        <label class="label">
          <span class="label-text">总篮板</span>
        </label>
        <input :value="store.reb" class="input input-bordered" readonly>
      </div>
    </div>

    <!-- 其他数据 -->
    <div class="space-y-2">
      <StatInput label="AST" v-model="store.stats.AST" />
      <StatInput label="STL" v-model="store.stats.STL" />
      <StatInput label="BLK" v-model="store.stats.BLK" />
      <StatInput label="TOV" v-model="store.stats.TOV" />
      <StatInput label="PF" v-model="store.stats.PF" />
    </div>

    <button @click="save" class="btn btn-primary col-span-full">
      保存数据
    </button>
  </div>
</template>
