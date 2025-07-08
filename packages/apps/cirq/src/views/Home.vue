<!-- src/views/Homepage.vue -->
<script setup>
// 首页组件逻辑
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Cirq - 个人关系管理系统</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- 联系人卡片 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">联系人管理</h2>
          <p>管理您的所有联系人信息，包括基本信息、社交媒体、标签等。</p>
          <div class="card-actions justify-end">
            <router-link to="/contacts" class="btn btn-primary">查看联系人</router-link>
          </div>
        </div>
      </div>

      <!-- 提醒卡片 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">智能提醒</h2>
          <p>设置重要日期提醒，如生日、纪念日等。</p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary" disabled>即将推出</button>
          </div>
        </div>
      </div>

      <!-- 时间线卡片 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">关系时间线</h2>
          <p>记录与重要联系人的互动历史。</p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary" disabled>即将推出</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 可选：自定义样式 */
</style>
