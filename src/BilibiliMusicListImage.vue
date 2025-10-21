<template>
  <div class="flex justify-center mb-4">
    <div class="w-[400px]">
      <el-input
          v-model="searchText"
          class="responsive-input"
          :prefix-icon="Search"
          clearable
      />
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
    </el-pagination>
  </div>
</template>

<script setup lang="ts">
import musics from '@/musics.json'
import {ref, computed, watch} from 'vue'
import {Search} from '@element-plus/icons-vue'

const searchText = ref('')

const background = ref(true)

const allData = ref(musics);
const filterdData = ref(musics);

const pageSize = ref(parseInt(import.meta.env.VITE_PAGE_SIZE));
const pageCount = computed(() => {
  return parseInt(filterdData.value.length / pageSize.value) + 1;
});
const pagerCount = ref(parseInt(import.meta.env.VITE_PAGER_COUNT));

const currentPage = ref(1);
const currentData = ref([]);

const createFilter = (queryString) => {
  return (music) => {
    return (
        music.toLowerCase().includes(queryString.toLowerCase())
    )
  }
}

watch([() => searchText.value, () => currentPage.value, () => pageSize.value], ([newSearchText, newCurrentPage, newPageSize]) => {
      filterdData.value = newSearchText ? allData.value.filter(createFilter(newSearchText)) : allData.value
      const startIndex = (newCurrentPage - 1) * pageSize.value;
      const endIndex = startIndex + newPageSize;
      currentData.value = filterdData.value.slice(startIndex, endIndex);
    },
    {deep: true, immediate: true}
)

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