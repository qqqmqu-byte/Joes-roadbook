<p align="center">
  <img src="https://img.shields.io/badge/疆·路书-Roadbook-orange?style=for-the-badge&logo=map&logoColor=white" alt="banner"/>
</p>

<h1 align="center">🗺️ 疆 · 路书 — 把一段旅程，装进一个网页</h1>

<p align="center">
  <b>一份单文件、可离线、可装主屏的自驾路书。</b><br/>
  行程总览、每日时间轴、交互地图、一键导航、倒计时、美食与安全锦囊——打开即看，<br/>
  更关键的是：<b>它不只是南疆的，它是一套「填数据就能生成你自己的路书」的模板。</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/部署-单文件HTML-orange?style=flat-square"/>
  <img src="https://img.shields.io/badge/特性-可装主屏-blue?style=flat-square"/>
  <img src="https://img.shields.io/badge/数据-可改可生成-green?style=flat-square"/>
  <img src="https://img.shields.io/badge/语言-中文-gray?style=flat-square"/>
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square"/>
</p>

---

## ✨ 它能替你做什么

> 把一份 11 天的南疆自驾计划，做成手机上随时能翻、能导航、能倒计时的随身路书。

- **📅 行程总览 + 每日时间轴** — 11 天一眼看全，点哪天看哪天；海拔区间、行驶里程、强度星级、住宿价格一目了然。
- **⏳ 倒计时 / 回到今天** — 出发前数着日子，旅途中一键跳回「今天」，归来后自动进入回顾模式。
- **🗺️ 交互式地图** — 每天行车路线 + 景点标注，高德 / OpenStreetMap / ArcGIS 多源容错；点标记即可拉起高德 / 百度 / 腾讯 / Apple 地图导航。
- **🍜 美食 & 🛡️ 安全锦囊** — 跟着本地人吃的餐厅清单、边防证 / 高反 / 行车 / 穿搭的完整 checklist。
- **📱 可装主屏** — 内联 PWA manifest，像 App 一样全屏打开，弱网也能看。

---

## 💡 为什么它不一样

不是又一个写死的旅行博客页面。它是**一套可复用的路书引擎**：

| | 普通游记页面 | 疆 · 路书 |
| --- | --- | --- |
| 内容 | 写死在 HTML 里 | 全部在 `data.js`，改数据 = 改路线 |
| 复用 | 别人只能看 | 别人能**一键生成自己的路书** |
| 部署 | 需框架/构建 | 单文件，丢哪都能跑 |
| 导航 | 截图看 | 真实可调起地图 App |

**核心理念：你写的不是一份路书，而是一个能造出路书的工具。**

---

## 🚀 三步上手

```bash
# 1. 看：起一个本地静态服务（地图瓦片加载最稳）
python -m http.server 8080
#    浏览器打开 http://localhost:8080
```

```
2. 改：点页面右下角 ⚙️ → 导出 roadbook.json
        按结构改成你的行程 → 导入，专属路书立即生成

3. 发：丢到 GitHub Pages / Vercel / 任意静态托管，分享给同行的人
```

> 不想碰 JSON？直接编辑 `data.js` 里的 `days` 数组也一样（字段说明见下方「数据格式」）。

---

## 🧩 填数据，造你自己的路书

页面内置 **🛠 路书数据编辑器**（右下角 ⚙️），三种方式任选：

- **⬇️ 导出 JSON** — 把当前路书下载为 `roadbook.json`（也是你最好的填空模板）。
- **⬆️ 导入文件 / 📋 粘贴 JSON** — 换成你自己的行程，立即重新生成。
- **↺ 恢复默认** — 一键回到示例数据。

导入的数据存在浏览器 `localStorage`，刷新不丢；想彻底换一套，导出 → 改 → 再导入即可。

### 数据格式速览（`data.js`）

```js
window.ROADBOOK = {
  tripStart: '2026-09-25T00:00:00+08:00',   // 出发时间（驱动倒计时/回到今天）
  tripEnd:   '2026-10-05T23:59:59+08:00',
  days: [ {                                   // 每天一段行程
    day: 1, title: '抵达喀什', alt: '1300m', drive: '0km',
    intensity: '★☆☆☆☆', stay: '🏨 喀什希尔顿', stayPrice: '¥1142',
    items: [ { t:'07:00', p:'白沙湖', tr:'🚗', tag:'must',
              d:'[绝佳机位] 北岸免费、人少、能走到水边！' } ],
    tip: '今日行程建议…'
  } ],
  poiCoords: { '白沙湖': [38.77, 74.97] },     // 地点名 → [纬度, 经度]，用于地图打点
  mapQueries: { '白沙湖': '阿克陶白沙湖' },     // 地点名 → 地图搜索词
  restaurants: [ { n:'店名', city:'喀什', cat:'街头小吃', price:'3-5元', desc:'…' } ],
  travelTips: [ { title:'安全检查清单', items:[ '…' ] } ]
}
```

> `tag` 取值决定颜色与标签：`must`=必去 · `photo`=出片 · `food`=美食 · `warn`=避坑 · `transit`=交通。

---

## 🗂️ 文件结构

```
Joes-roadbook/
├── index.html         # 界面 + 渲染逻辑 + 内置数据编辑器（单文件即可运行）
├── data.js            # 💡 数据层：改这里 = 改路书（days / 坐标 / 餐厅 / 贴士）
├── data.example.json  # 示例数据导出，作为你的「填空模板」
├── README.md
└── LICENSE
```

> 当前版本 `index.html` 与 `data.js` 解耦，零构建、零依赖安装。

---

## 🛠️ 技术栈

| 能力 | 方案 |
| --- | --- |
| 结构 / 样式 | 单文件 HTML + [Tailwind CSS](https://tailwindcss.com)（CDN） |
| 地图 | [Leaflet](https://leafletjs.com)（CDN）+ 高德 / OSM / ArcGIS 瓦片 |
| 逻辑 | 原生 JavaScript，数据驱动渲染 |
| 离线 / 安装 | 内联 Web App Manifest（PWA） |
| 复用 | `data.js` 数据层 + 页面内 JSON 导入/导出 |

---

## ⚠️ 已知限制 / 路线图

- **依赖外部 CDN**：Tailwind、Leaflet、字体与地图瓦片均来自公网，首次打开需联网。
- **统计埋点**：示例内置了作者的腾讯 beacon 统计（`beacon.cdn.qq.com`）。**部署你自己的版本前请移除或替换**，否则访问数据会混进原作者账号。
- **地图边界合规**：地图瓦片来自第三方，跨境 / 边界区域的标注以瓦片提供方为准。
- 🗺️ **路线图**：可视化表单编辑器（不用写 JSON 也能填）、多路书切换、离线圈层本地化。

欢迎提 Issue / PR，一起把「填数据即生成路书」做得更顺手。

---

## 📄 许可证

[MIT](./LICENSE) © qqqmqu-byte — 随便改、随便发，注明出处即可。

<p align="center">用一份数据，造一段旅程 🌄</p>
