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
      <el-card class="max-w-[480px] h-[80px] relative cursor-pointer transition-all duration-300" shadow="hover"
               @click="handleCopy(music)">
        <el-tooltip :content="music" placement="top" effect="customized" :show-after="500">
          <span class="text-sm line-clamp-2 relative z-10">
            {{ music }}
          </span>
        </el-tooltip>
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
        :total="filterdData.length"
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
import useClipboard from 'vue-clipboard3'
import {ElMessage} from 'element-plus'

const {toClipboard} = useClipboard()

const handleCopy = async (music) => {
  try {
    await toClipboard(music)

    ElMessage({
      message: '已复制',
      type: 'success',
    })
  } catch (e) {
  }
}

const searchText = ref('')

const background = ref(true)

const allData = ref(musics);
const filterdData = ref(musics);

const pageSize = ref(parseInt(import.meta.env.VITE_PAGE_SIZE));
const pageCount = computed(() => {
  return parseInt(String(filterdData.value.length / pageSize.value)) + 1;
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
.el-popper.is-customized {
  padding: 6px 12px;
  background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
}

.el-popper.is-customized .el-popper__arrow::before {
  background: linear-gradient(45deg, #b2e68d, #bce689);
  right: 0;
}
</style>