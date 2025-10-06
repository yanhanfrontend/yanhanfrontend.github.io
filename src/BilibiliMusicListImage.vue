<template>
  <el-row :gutter="10">
    <el-col v-for="music in currentData" :key="music" :span="4" class="mb-2">
      <el-card class="max-w-[480px] h-[130px] overflow-hidden text-ellipsis line-clamp-3">
        <p class="text item" :title="music">{{ music }}</p>
      </el-card>
    </el-col>
  </el-row>

  <div class="flex justify-center mt-4">
    <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :pager-count="50"
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
const pageSize = ref(36);

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