<template>
  <div class="flex h-[3rem] mb-4">
    <div class="flex-shrink-0 flex items-center h-full pr-2">
      <img src="@/assets/images/utopian.jpg" alt="utopian"
        class="h-full rounded-full cursor-pointer transition-transform duration-300 hover:scale-110 border border-gray-100 p-1 bg-gradient-to-r from-orange-400 via-yellow-300 to-pink-300 shadow-[0_0_8px_2px_rgba(249,115,22,0.3)] transition-all"
        @click="handleLogo" />
    </div>

    <div class="flex-1 h-full mx-0">
      <div class="w-full h-full flex items-center">
        <el-input v-model="searchText" class="w-full" :prefix-icon="Search" clearable />
      </div>
    </div>
  </div>

  <el-row :gutter="10">
    <el-col v-for="music in currentData" :key="music" :xs="12" :sm="8" :md="6" :lg="4" :xl="4" class="mb-2">
      <el-card class="max-w-[480px] h-[80px] relative cursor-pointer transition-all duration-300 overflow-hidden group"
        shadow="hover">
        <el-tooltip :content="music" placement="top" effect="customized" :show-after="500">
          <span class="text-sm line-clamp-2 relative z-10" @click="handleCopy(music)">
            {{ music }}
          </span>
        </el-tooltip>
      </el-card>
    </el-col>
  </el-row>

  <div class="flex justify-center mt-4">
    <el-pagination v-model:current-page="currentPage" :page-size="pageSize" :page-count="pageCount"
      :pager-count="pagerCount" :background="background" layout="prev, pager, next, slot" :total="total" prev-text="上一页"
      next-text="下一页" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      <div>共 {{ total }} 个</div>
    </el-pagination>
  </div>
</template>

<script setup lang="ts">
import musics from "../../public/musics.json";
import { ref, computed, watch } from "vue";
import {
  Search,
} from "@element-plus/icons-vue";
import useClipboard from "vue-clipboard3";
import { ElMessage } from "element-plus";

const handleLogo = () => {
  window.open("https://github.com/yanhanfrontend", "_blank");
};

const { toClipboard } = useClipboard();

const handleCopy = async (music) => {
  try {
    await toClipboard(music);

    ElMessage({
      message: "已复制",
      type: "success",
    });
  } catch (e) {
    console.log(e);
  }
};

const searchText = ref("");

const background = ref(true);

const allData = ref(musics);
const filterdData = ref(musics);
const total = computed(() => {
  return filterdData.value.length;
});

const pageSize = ref(parseInt((import.meta as any).env.VITE_PAGE_SIZE));
const pageCount = computed(() => {
  return parseInt(String(filterdData.value.length / pageSize.value)) + 1;
});
const pagerCount = ref(parseInt((import.meta as any).env.VITE_PAGER_COUNT));

const currentPage = ref(1);
const currentData = ref([]);

const createFilter = (queryString) => {
  return (music) => {
    return music.toLowerCase().includes(queryString.toLowerCase());
  };
};

watch(
  [() => searchText.value, () => currentPage.value, () => pageSize.value],
  ([newSearchText, newCurrentPage, newPageSize]) => {
    filterdData.value = newSearchText
      ? allData.value.filter(createFilter(newSearchText))
      : allData.value;
    const startIndex = (newCurrentPage - 1) * pageSize.value;
    const endIndex = startIndex + newPageSize;
    currentData.value = filterdData.value.slice(startIndex, endIndex);
  },
  { deep: true, immediate: true },
);

const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1;
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
};
</script>

<style scoped></style>
