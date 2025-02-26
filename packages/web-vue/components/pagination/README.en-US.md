```yaml
meta:
  type: Component
  category: Navigation
title: Pagination
description: Use paging to control the amount of information in a single page, and page jumps can also be performed.
```

*Auto translate by google.*

@import ./__demo__/basic.md

@import ./__demo__/ellipsis.md

@import ./__demo__/page-size.md

@import ./__demo__/jumper.md

@import ./__demo__/size.md

@import ./__demo__/simple.md

@import ./__demo__/total.md

@import ./__demo__/all.md


### `<pagination>` Props

|Attribute|Description|Type|Default|
|---|---|---|:---:|
|total **(required)**|Total number of data|`number`|`-`|
|current **(v-model)**|Current page number|`number`|`-`|
|default-current|The default number of pages (uncontrolled state)|`number`|`1`|
|page-size **(v-model)**|Number of data items displayed per page|`number`|`-`|
|default-page-size|The number of data items displayed per page by default (uncontrolled state)|`number`|`10`|
|disabled|Whether to disable|`boolean`|`false`|
|hide-on-single-page|Whether to hide pagination when single page|`boolean`|`false`|
|simple|Whether it is simple mode|`boolean`|`false`|
|show-total|Whether to display the total number of data|`boolean`|`false`|
|show-more|Whether to show more buttons|`boolean`|`false`|
|show-jumper|Whether to show jump|`boolean`|`false`|
|show-page-size|Whether to display the data number selector|`boolean`|`false`|
|page-size-options|Selection list of data number selector|`number[]`|`[10, 20, 30, 40, 50]`|
|page-size-props|Props of data number selector|`SelectProps`|`-`|
|size|The size of the page selector|`'mini' \| 'small' \| 'medium' \| 'large'`|`'medium'`|
|page-item-style|The style of the paging button|`CSSProperties`|`-`|
|active-page-item-style|The style of the current paging button|`CSSProperties`|`-`|
### `<pagination>` Events

|Event Name|Description|Parameters|
|---|---|---|
|change|Triggered when page number changes|page: `number`|
|page-size-change|Triggered when the number of data items changes|pageSize: `number`|
### `<pagination>` Slots

|Slot Name|Description|Parameters|
|---|---|---|
|page-item|Page item|type: `PageItemType`The type of page item<br>page: `number`The page number of the paging button (exists only when `type='page'`)<br>element: `VNode`Default page item|


