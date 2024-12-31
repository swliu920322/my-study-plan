<template>
  <a-config-provider :csp="{ nonce: 'YourNonceCode' }" :locale="zhCN">
    <div class="flex">
      <aside :style="{ width: collapsed ? '80px' : '200px' }" class="transition-all">
        <div class="p-4">
          <a-button type="primary" :icon="h(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)"
            @click="toggleCollapsed">
          </a-button>
        </div>
        <a-menu id="menu" v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" mode="inline"
          :inline-collapsed="collapsed" :items="menuItems" @click="handleMenuClick" />
      </aside>
      <main class="flex-1">
        <RouterView />
      </main>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { HomeOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined, EnvironmentOutlined } from '@ant-design/icons-vue';
import { ref, h, VNode, computed } from 'vue'
import { useRouter } from 'vue-router';

// 菜单折叠状态
const collapsed = ref(false)
// 切换折叠状态
const toggleCollapsed = () => {
  collapsed.value = !collapsed.value
}

// 菜单项数据结构
interface MenuItem {
  key: string
  label: string
  icon?: VNode
  url?: string
  children?: MenuItem[]
}

const selectedKeys = computed(() => {
  console.log(router.currentRoute.value.path)
  return [router.currentRoute.value.path]
})
const openKeys = ref<string[]>([])

// 菜单数据
const menuItems = ref<MenuItem[]>([
  { key: '/home', label: '首页', icon: h(HomeOutlined), url: '/home' },
  { key: '/goal', label: '目标管理', icon: h(EnvironmentOutlined), url: '/goal' },
  { key: '/type', label: '类型管理', icon: h(SettingOutlined), url: '/type' }
])
const router = useRouter();

const handleMenuClick = (menuInfo: { item: MenuItem }) => {
  if (menuInfo.item.url) {
    router.push(menuInfo.item.url)
  }
}

</script>



<style scoped></style>
