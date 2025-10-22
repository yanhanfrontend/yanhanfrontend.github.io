<template>
  <div class="flex h-[3rem] mb-4">
    <div class="flex-shrink-0 flex items-center h-full pr-2">
      <img
          src="@/assets/images/utopian.jpg"
          alt="utopian"
          class="h-full rounded-full cursor-pointer transition-transform duration-300 hover:scale-110
             border border-gray-100 p-1 bg-gradient-to-r from-orange-400 via-yellow-300 to-pink-300
             shadow-[0_0_8px_2px_rgba(249,115,22,0.3)] transition-all"
          @click="handleLogo"
      />
    </div>

    <div class="flex-1 h-full mx-0">
      <div class="w-full h-full flex items-center">
        <el-input
            v-model="searchText"
            class="w-full"
            :prefix-icon="Search"
            clearable
        />
      </div>
    </div>

    <div class="flex-shrink-0 flex justify-center items-center h-full pl-2">
      <el-icon :size="20" color="#67C23A" class="cursor-pointer" @click="handleAdd">
        <CirclePlus/>
      </el-icon>
    </div>
  </div>

  <el-dialog
      v-model="formDialogVisible"
      :title="formTitle"
      width="500"
      align-center
      :close-on-click-modal="false"
      @close="handleFormCancel"
  >
    <el-form :model="form" ref="formRef" label-position="top">
      <el-form-item label="名称" :label-width="100" prop="name">
        <el-input
            v-model="form.name"
            :rows="4"
            type="textarea"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="flex justify-center">
        <el-button type="primary" @click="handleConfirm">
          确定
        </el-button>
        <el-button @click="handleFormCancel">取消</el-button>
      </div>
    </template>
  </el-dialog>

  <el-row :gutter="10">
    <el-col v-for="music in currentData" :key="music" :xs="12" :sm="8" :md="6" :lg="4" :xl="4" class="mb-2">
      <el-card class="max-w-[480px] h-[80px] relative cursor-pointer transition-all duration-300 overflow-hidden group"
               shadow="hover">
        <el-tooltip :content="music" placement="top" effect="customized" :show-after="500">
          <span class="text-sm line-clamp-2 relative z-10" @click="handleCopy(music)">
            {{ music }}
          </span>
        </el-tooltip>

        <div
            class="absolute right-2 top-1 bottom-1 flex flex-col justify-between py-2 gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <el-icon color="#909399" class="cursor-pointer" @click.stop="handleEdit(music)">
            <Edit/>
          </el-icon>

          <el-popconfirm
              title="确定删除吗？"
              placement="top"
              confirm-button-text="是"
              cancel-button-text="否"
              confirm-button-type="danger"
              :icon="WarningFilled"
              icon-color="#F56C6C"
              @confirm="handleDelete(music)"
          >
            <template #reference>
              <el-icon color="#909399" class="cursor-pointer">
                <Delete/>
              </el-icon>
            </template>
          </el-popconfirm>
        </div>
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
        layout="prev, pager, next, slot"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        prev-text="上一页"
        next-text="下一页"
    >
      <div>
        共 {{ total }} 个
      </div>
    </el-pagination>
  </div>
</template>

<script setup lang="ts">
import musics from '../../public/musics.json'
import {ref, computed, watch} from 'vue'
import {Search, CirclePlus, Edit, Delete, WarningFilled} from '@element-plus/icons-vue'
import useClipboard from 'vue-clipboard3'
import {ElMessage} from 'element-plus'

const handleLogo = () => {
  window.open('https://github.com/yanhanfrontend', '_blank')
}

const formDialogVisible = ref(false)
const mode = ref('')
const formTitle = ref('')

const form = ref({
  name: '',
})
const formRef = ref(null);
const resetForm = () => {
  form.value = {name: ''};
  formRef.value?.resetFields();
};

const handleAdd = () => {
  formDialogVisible.value = true
  mode.value = 'add'
  formTitle.value = '添加歌曲'
}

const handleEdit = (music) => {
  formDialogVisible.value = true
  mode.value = 'edit'
  formTitle.value = '修改歌曲'
}

const handleConfirm = () => {
  //todo
  handleFormCancel();
}

const handleFormCancel = () => {
  resetForm();
  formDialogVisible.value = false
}

const handleDelete = (music) => {
//todo
  ElMessage({
    message: '已删除',
    type: 'success',
  })
}

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
const total = computed(() => {
  return filterdData.value.length
})

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
</style>