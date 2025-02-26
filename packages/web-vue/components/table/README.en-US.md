```yaml
meta:
  type: Component
  category: Data Display
title: Table
description: It is used for data collection, display, analysis and processing, and operation and processing.
```

*Auto translate by google.*

@import ./__demo__/basic.md

@import ./__demo__/row-selection.md

@import ./__demo__/radio.md

@import ./__demo__/expand.md

@import ./__demo__/subtree.md

@import ./__demo__/props.md

@import ./__demo__/sort.md

@import ./__demo__/fixed.md

@import ./__demo__/group.md

@import ./__demo__/custom.md

@import ./__demo__/virtual-list.md


### `<table>` Props

|Attribute|Description|Type|Default|
|---|---|---|:---:|
|columns|Column info of the table|`TableColumn[]`|`[]`|
|data|Table data|`TableData[]`|`[]`|
|bordered|Whether to show the border|`boolean \| TableBorder`|`true`|
|hoverable|Whether to show the hover effect|`boolean`|`true`|
|stripe|Whether to enable the stripe effect|`boolean`|`false`|
|size|The size of the table|`'mini' \| 'small' \| 'medium' \| 'large'`|`'large'`|
|table-layout-fixed|The table-layout property of the table is set to fixed. After it is set to fixed, the width of the table will not be stretched beyond 100% by the content.|`boolean`|`false`|
|loading|Whether it is loading state|`boolean`|`false`|
|hide-header|Whether to hide the header|`boolean`|`false`|
|row-selection|Table row selector configuration|`TableRowSelection`|`-`|
|expandable|Expand row configuration of the table|`TableExpandable`|`-`|
|scroll|Scrolling attribute configuration of the table|`{ x: number; y: number }`|`-`|
|pagination|Pagination properties configuration|`boolean \| PaginationProps`|`true`|
|page-position|The position of the page selector|`'tl' \| 'top' \| tr' \| 'bl' \| 'bottom' \| 'br'`|`'br'`|
|indent-size|The indentation distance of the tree table|`number`|`16`|
|show-header|Whether to show the header|`boolean`|`true`|
|virtual-list-props|Pass the virtual list attribute, pass in this parameter to turn on virtual scrolling|`VirtualListProps`|`-`|
### `<table>` Events

|Event Name|Description|Parameters|
|---|---|---|
|expand|Triggered when a row is clicked to expand|-|
|expanded-change|Triggered when the expanded data row changes|-|
|select|Triggered when the row selector is clicked|-|
|select-all|Triggered when the select all selector is clicked|-|
|selection-change|Triggered when the selected data row changes|-|
|sorter-change|Triggered when the collation changes|-|
|filter-change|Triggered when the filter options are changed|-|
|page-change|Triggered when the table pagination changes|-|
|page-size-change|Triggered when the number of data per page of the table changes|-|
|cell-click|Triggered when a cell is clicked|-|
|row-click|Triggered when row data is clicked|-|
|header-click|Triggered when the header data is clicked|-|




### `<table-column>` Props

|Attribute|Description|Type|Default|
|---|---|---|:---:|
|data-index|Identifies the column information, corresponding to the data in TableData|`string`|`-`|
|title|Column title|`string`|`-`|
|width|Column width|`number`|`-`|
|align|Alignment direction|`TableColumn['align']`|`-`|
|fixed|Fixed position|`TableColumn['fixed']`|`-`|
|ellipsis|Whether to display as omitted|`boolean`|`false`|
|sortable|Sorting related options|`TableSortable`|`-`|
|filterable|Filter related options|`TableFilterable`|`-`|




### TableData

|Name|Description|Type|Default|
|---|---|---|:---:|
|key|The key of the data row (required)|`string`|`-`|
|expand|Expand row content|`string \| (() => VNode)`|`-`|
|children|Sub data|`TableData[]`|`-`|
|disabled|Whether to disable the row selector|`boolean`|`false`|



### TableSortable

|Name|Description|Type|Default|
|---|---|---|:---:|
|sortDirections|Supported sort direction|`Array<'ascend' \| 'descend'>`|`-`|
|sorter|Sorting function|`(a: any, b: any) => number`|`-`|
|sortOrder|Sort direction|`'ascend' \| 'descend' \| ''`|`-`|
|defaultSortOrder|Default sort direction (uncontrolled mode)|`'ascend' \| 'descend' \| ''`|`-`|



### TableFilterData

|Name|Description|Type|Default|
|---|---|---|:---:|
|text|Filter the content of the data option|`string \| (() => VNode)`|`-`|
|value|Filter the value of the data option|`string`|`-`|



### TableFilterable

|Name|Description|Type|Default|
|---|---|---|:---:|
|filters|Filter data|`TableFilterData[]`|`-`|
|filter|Filter function|`(filteredValue: string[], record: TableData) => boolean`|`-`|
|multiple|Whether to support multiple selection|`boolean`|`false`|
|filteredValue|Filter value|`string[]`|`-`|
|defaultFilteredValue|Default filter value|`string[]`|`-`|
|renderContent|The content of filter box|`(data: {    filterValue: string[];    setFilterValue: (filterValue: string[]) => void;    handleFilterConfirm: (event: Event) => void;    handleFilterReset: (event: Event) => void;  }) => VNode`|`-`|
|icon|Filter icon for button|`() => VNode`|`-`|
|triggerProps|Pop-up box configuration of filter box|`TriggerProps`|`-`|



### TableColumn

|Name|Description|Type|Default|
|---|---|---|:---:|
|dataIndex|The identifier of the column information, corresponding to the data in `TableData`|`string`|`-`|
|title|Column header|`string \| (() => VNode)`|`-`|
|width|Column width|`number`|`-`|
|align|Alignment direction|`'left' \| 'center' \| 'right'`|`-`|
|fixed|Fixed position|`'left' \| 'right'`|`-`|
|ellipsis|Whether to show ellipsis|`boolean`|`false`|
|sortable|Sorting related options|`TableSortable`|`-`|
|filterable|Filter related options|`TableFilterable`|`-`|
|children|Header sub-data, used for header grouping|`TableColumn[]`|`-`|
|render|Customize the rendering of column cells|`({    record,    column,  }: {    record: TableData;    column: TableColumn;  }) => VNode`|`-`|



### TableRowSelection

|Name|Description|Type|Default|
|---|---|---|:---:|
|type|The type of row selector|`'checkbox' \| 'radio'`|`-`|
|selectedRowKeys|Selected row (controlled mode)|`string[]`|`-`|
|defaultSelectedRowKeys|The selected row by default (uncontrolled mode)|`string[]`|`-`|
|showCheckedAll|Whether to show the select all selector|`boolean`|`false`|
|title|Column title|`string`|`-`|
|width|Column width|`number`|`-`|
|fixed|Is it fixed|`boolean`|`false`|



### TableExpandable

|Name|Description|Type|Default|
|---|---|---|:---:|
|expandedRowKeys|Displayed Expanded Row (Controlled Mode)|`string[]`|`-`|
|defaultExpandedRowKeys|Expand row displayed by default (Uncontrolled mode)|`string[]`|`-`|
|defaultExpandAllRows|Whether to expand all rows by default|`boolean`|`false`|
|expandedRowRender|Whether to expand all rows by default|`(record: TableData, index: number) => VNode`|`-`|
|icon|Expand icon|`(expanded: boolean, record: TableData) => VNode`|`-`|
|title|Column title|`string`|`-`|
|width|Column width|`number`|`-`|
|fixed|Is it fixed|`boolean`|`false`|


