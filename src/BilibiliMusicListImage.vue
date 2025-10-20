<template>
  <div class="flex justify-center mb-4">
    <div class="w-[400px]">
      <el-autocomplete
          v-model="searchText"
          :fetch-suggestions="handleFetchSuggestions"
          :trigger-on-focus="false"
          clearable
          @select="handleSelect"
          @clear="handleClear"
      >
        <template #prefix>
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </template>
      </el-autocomplete>
    </div>
  </div>

  <el-row :gutter="10">
    <el-col v-for="music in currentData" :key="music" :xs="12" :sm="8" :md="6" :lg="4" :xl="4" class="mb-2">
      <el-card class="max-w-[480px] h-[80px]" shadow="hover">
        <el-text size="small" line-clamp="2">
          {{ music }}
        </el-text>
      </el-card>
    </el-col>
  </el-row>

  <div class="flex justify-center mt-4">
    <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :page-count="pageCount"
        :pager-count="pagerCount"
        :background="background"
        layout="total, prev, pager, next"
        :total="allData.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        prev-text="上一页"
        next-text="下一页"
    >
      <template #total="{ total }">
        <span>总记录：{{ total }} 条数据</span>
      </template>
    </el-pagination>
  </div>
</template>

<script setup lang="ts">
import musics from '@/musics.json'
import {ref, computed, onMounted} from 'vue'

const searchText = ref('')

const background = ref(true)

const allData = ref(musics);
const filterdData = ref([]);
const currentData = ref([]);

const currentPage = ref(1);
const pageSize = ref(parseInt(import.meta.env.VITE_PAGE_SIZE));
const pageCount = ref(allData.value.length/pageSize.value + 1);
const pagerCount = ref(parseInt(import.meta.env.VITE_PAGER_COUNT));

const handleFetchSuggestions = (queryString, cb) => {
  const filtered = queryString
      ? allData.value.filter(createFilter(queryString))
      : allData.value
  const results = filtered.map(item => ({value: item}));
  cb(results)
}
const createFilter = (queryString) => {
  return (music) => {
    return (
        music.toLowerCase().includes(queryString.toLowerCase())
    )
  }
}

const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1;
  handleSelect(searchText);
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  handleSelect(searchText);
};

const handleSelect = (searchText) => {
  filterdData.value = searchText ? allData.value.filter(createFilter(searchText.value)) : allData.value
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  currentData.value = filterdData.value.slice(startIndex, endIndex);

  pageCount.value = parseInt(filterdData.value.length/pageSize.value) + 1;
}

const handleClear = () => {
  handleSelect("");
}

onMounted(() => {
  handleSelect(searchText);
})
</script>

<style scoped>
</style>