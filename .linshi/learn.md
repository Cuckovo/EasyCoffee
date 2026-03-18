# Vue3 + Vite + Capacitor + SQLite + TailwindCSS 项目搭建全流程指南

本教程详细记录了在 `F:\Web` 目录下从零搭建一个基于 Vue 3、面向 Android 移动端（含本地 SQLite 数据库）并使用 Tailwind CSS 作为样式框架的现代化混合应用的全过程。本教程高度可复用，可作为未来同类项目的标准 SOP。

## 1. 前置环境准备

在开始之前，请确保您的开发机器上已安装以下核心环境：
*   **Node.js**: 建议 v18+ 或 v20+ 长期支持版本（提供 npm 包管理）。
*   **Android Studio**: 用于编译和运行安卓项目，需提前配置好 Android SDK。

---

## 2. 初始化 Vite + Vue 项目

在指定的开发目录下（如 `F:\Web`），使用 Vite 脚手架快速创建 Vue 项目：

```bash
# 切换到工作目录
cd F:\Web

# 使用 Vite 创建名为 test01 的 Vue 项目（这里使用 JavaScript 模板）
npm create vite@latest test01 -- --template vue

# 进入项目目录
cd test01
```

---

## 3. 安装核心依赖包

本项目需要集成多项技术，我们通过 npm 将它们安装到项目中。

```bash
# 1. 安装 Vue 基础生态 (路由和状态管理)
npm install vue-router pinia

# 2. 安装 Capacitor 核心及安卓平台支持，以及 SQLite 插件
npm install @capacitor/core @capacitor/android @capacitor-community/sqlite

# 3. 安装开发依赖 (Capacitor CLI 及 TailwindCSS Vite 插件)
npm install -D @capacitor/cli @tailwindcss/vite
```
*(注：这里采用了 Tailwind CSS v4 配合 Vite 插件的最新集成方式)*

---

## 4. 配置跨平台引擎 (Capacitor)

初始化 Capacitor 项目结构，并指明前端构建输出目录为 `dist`：

```bash
# 初始化 Capacitor，设定 App 名称和包名
npx cap init test01 com.test01.app --web-dir dist
```

---

## 5. 搭建前端基础架构 (Router, Pinia, Tailwind)

为了让项目拥有清晰的结构，我们需要手动创建几个核心目录和文件：

### 5.1 创建目录结构
```bash
mkdir -p src/router src/views src/stores
```

### 5.2 配置 Vue Router (`src/router/index.ts`)
```javascript
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home }
  ]
})
export default router;
```

### 5.3 配置 Pinia 状态管理 (`src/stores/index.ts`)
```javascript
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({ count: 0 }),
  actions: { 
    increment() { 
      this.count++ 
    } 
  }
})
```

### 5.4 配置 Tailwind CSS v4 样式 (`src/style.css`)
清空原有内容，只需一行即可引入全新的 Tailwind CSS v4：
```css
@import 'tailwindcss';
```

### 5.5 修改 Vite 配置以支持 Tailwind (`vite.config.js`)
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
  ],
})
```

### 5.6 整合至 `main.js` 和 `App.vue`
**`src/main.js`**：
```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css' // 引入包含 Tailwind 的样式

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
```

**`src/App.vue`**（作为路由出口）：
```vue
<template>
  <router-view />
</template>

<script>
export default {
  name: 'App'
}
</script>
```

**`src/views/Home.vue`**（编写一个测试页面以验证所有配置）：
```vue
<template>
  <div class="p-4 text-center">
    <h1 class="text-2xl font-bold text-blue-500">Welcome to Vue + Tailwind + Capacitor</h1>
    <p class="mt-2 text-gray-600">项目基础环境已成功搭建完毕！</p>
  </div>
</template>
```

---

## 6. 构建并添加 Android 平台

前端代码编写完成后，我们需要将其构建并同步到安卓原生项目中。

```bash
# 1. 打包前端代码到 dist 目录
npm run build

# 2. 将打包好的 Web 资源以及 SQLite 等原生插件注入到 Android 原生工程中
npx cap add android
```
*(执行完毕后，项目根目录会多出一个 `android` 文件夹，这就是原生的安卓工程。)*

---

## 7. 日常开发与调试流

环境搭建完成后，在日常开发中请遵循以下工作流：

*   **Web 端实时开发**：
    ```bash
    npm run dev
    ```
    *(在浏览器中开发和调试 Vue 组件、Tailwind 样式及路由逻辑)*

*   **同步到 Android 移动端**：
    每次修改完代码想要在手机上测试，需要执行：
    ```bash
    npm run build
    npx cap sync
    ```

*   **使用 Android Studio 打开或打包 APP**：
    ```bash
    npx cap open android
    ```
    *(这会自动唤起 Android Studio，你可以连接真机或使用模拟器点击 "Run" 进行测试，或是打包成 APK 格式。)*

---

## 💡 关于 SQLite 的进阶说明
由于本环境已经安装了 `@capacitor-community/sqlite`，在移动端运行时可以直接调用原生 SQLite。
* **开发建议**：在 Web 端调试时，Capacitor SQLite 提供了一个基于 Web (Jeep-sqlite) 的降级方案，但建议主要的数据存储逻辑最好直接跑在 Android 模拟器/真机上验证，以保证原生 API 的准确性。
