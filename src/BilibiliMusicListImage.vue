<template>
  <el-row :gutter="20">
    <el-col v-for="music in currentData" :key="music" :xs="8" :sm="6" :md="4" class="mb-6">
      <el-card class="max-w-[480px] h-[110px]" shadow="always">
        <el-text size="large" line-clamp="3">
          {{ music }}
        </el-text>
      </el-card>
    </el-col>
  </el-row>

  <div class="flex justify-center mt-4">
    <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :pager-count="pagerCount"
        :disabled="disabled"
        :background="background"
        layout="total, prev, pager, next"
        :total="allData.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        prev-text="上一页"
        next-text="下一页"
    >
    </el-pagination>
  </div>
</template>

<script setup lang="ts">
import musics from '@/musics.json'
import {ref, computed} from 'vue'

const background = ref(true)
const disabled = ref(false)

const allData = ref(musics);

const currentPage = ref(1);
const pageSize = ref(parseInt(import.meta.env.VITE_PAGE_SIZE));
const pagerCount = ref(parseInt(import.meta.env.VITE_PAGER_COUNT));

const currentData = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return allData.value.slice(startIndex, endIndex);
});

const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1;
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
};
</script>

<style scoped>

</style>