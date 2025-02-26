```yaml
meta:
  type: 组件
  category: 反馈
title: 全局提示 Message
description: 由用户的操作触发的轻量级全局反馈。
```

@import ./__demo__/basic.md

@import ./__demo__/type.md

@import ./__demo__/icon.md

@import ./__demo__/position.md

@import ./__demo__/closeable.md

@import ./__demo__/update.md

### `Message` 全局方法

Message提供的全局方法，可以通过一下三种方法使用：
1. 通过this.$message调用
2. 在Composition API中，通过getCurrentInstance().appContext.config.globalProperties.$message调用
3. 导入Message，通过Message本身调用


### MessageMethod

|参数名|描述|类型|默认值|
|---|---|---|:---:|
|info|显示信息提示|`(config: string \| MessageConfig) => MessageReturn`|`-`|
|success|显示成功提示|`(config: string \| MessageConfig) => MessageReturn`|`-`|
|warning|显示警告提示|`(config: string \| MessageConfig) => MessageReturn`|`-`|
|error|显示错误提示|`(config: string \| MessageConfig) => MessageReturn`|`-`|
|clear|清空全部提示|`(position?: MessagePosition) => void`|`-`|



### MessageConfig

|参数名|描述|类型|默认值|
|---|---|---|:---:|
|content|内容|`RenderContent`|`-`|
|id|唯一id|`string`|`-`|
|icon|消息的图标|`RenderFunction`|`-`|
|position|消息的位置|`'top'\|'bottom'`|`-`|
|showIcon|是否显示图标|`boolean`|`false`|
|closable|是否显示关闭按钮|`boolean`|`false`|
|duration|消息显示的持续时间|`number`|`-`|



### MessageReturn

|参数名|描述|类型|默认值|
|---|---|---|:---:|
|close|关闭当前消息|`() => void`|`-`|


