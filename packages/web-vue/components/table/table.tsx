import type { CSSProperties, PropType, Slot } from 'vue';
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { getPrefixCls } from '../_utils/global-config';
import { off, on } from '../_utils/dom';
import type { Size } from '../_utils/constant';
import { isArray, isFunction, isObject } from '../_utils/is';
import type {
  Filters,
  Sorter,
  TableColumn,
  TableExpandable,
  TableOperationColumn,
  TableRowSelection,
  TableBorder,
  TableComponents,
  TableData,
  TablePagePosition,
} from './interface';
import { getColumnsFromSlot, getGroupColumns } from './utils';
import { useRowSelection } from './hooks/use-row-selection';
import { useExpand } from './hooks/use-expand';
import { usePagination } from './hooks/use-pagination';
import IconPlus from '../icon/icon-plus';
import IconMinus from '../icon/icon-minus';
import Spin from '../spin';
import Pagination, { PaginationProps } from '../pagination';
import Empty from '../empty';
import ColGroup from './table-col-group.vue';
import Thead from './table-thead.vue';
import Tbody from './table-tbody.vue';
import Tr from './table-tr.vue';
import Th from './table-th';
import Td from './table-td';
import OperationTh from './table-operation-th';
import OperationTd from './table-operation-td';
import VirtualList from '../_components/virtual-list/virtual-list.vue';
import { VirtualListProps } from '../_components/virtual-list/interface';
import usePickSlots from '../_hooks/use-pick-slots';
import { omit } from '../_utils/omit';

const DEFAULT_BORDERED = {
  wrapper: true,
  cell: false,
  headerCell: false,
  bodyCell: false,
};

export default defineComponent({
  name: 'Table',
  props: {
    /**
     * @zh 表格的列描述信息
     * @en Column info of the table
     */
    columns: {
      type: Array as PropType<TableColumn[]>,
      default: () => [],
    },
    /**
     * @zh 表格的数据
     * @en Table data
     */
    data: {
      type: Array as PropType<TableData[]>,
      default: () => [],
    },
    /**
     * @zh 是否显示边框
     * @en Whether to show the border
     */
    bordered: {
      type: [Boolean, Object] as PropType<boolean | TableBorder>,
      default: true,
    },
    /**
     * @zh 是否显示选中效果
     * @en Whether to show the hover effect
     */
    hoverable: {
      type: Boolean,
      default: true,
    },
    /**
     * @zh 是否开启斑马纹效果
     * @en Whether to enable the stripe effect
     */
    stripe: {
      type: Boolean,
      default: false,
    },
    /**
     * @zh 表格的大小
     * @en The size of the table
     * @values 'mini','small','medium','large'
     */
    size: {
      type: String as PropType<Size>,
      default: 'large',
    },
    /**
     * @zh 表格的 table-layout 属性设置为 fixed，设置为 fixed 后，表格的宽度不会被内容撑开超出 100%。
     * @en The table-layout property of the table is set to fixed. After it is set to fixed, the width of the table will not be stretched beyond 100% by the content.
     */
    tableLayoutFixed: {
      type: Boolean,
      default: false,
    },
    /**
     * @zh 是否为加载中状态
     * @en Whether it is loading state
     */
    loading: {
      type: Boolean,
      default: false,
    },
    /**
     * @zh 是否隐藏表头
     * @en Whether to hide the header
     */
    hideHeader: {
      type: Boolean,
      default: false,
    },
    /**
     * @zh 表格的行选择器配置
     * @en Table row selector configuration
     */
    rowSelection: {
      type: Object as PropType<TableRowSelection>,
    },
    /**
     * @zh 表格的展开行配置
     * @en Expand row configuration of the table
     */
    expandable: {
      type: Object as PropType<TableExpandable>,
    },
    /**
     * @zh 表格的滚动属性配置
     * @en Scrolling attribute configuration of the table
     */
    scroll: {
      type: Object as PropType<{ x: number; y: number }>,
    },
    /**
     * @zh 分页的属性配置
     * @en Pagination properties configuration
     */
    pagination: {
      type: [Boolean, Object] as PropType<boolean | PaginationProps>,
      default: true,
    },
    /**
     * @zh 分页选择器的位置
     * @en The position of the page selector
     * @values 'tl','top',tr','bl','bottom','br'
     */
    pagePosition: {
      type: String as PropType<TablePagePosition>,
      default: 'br',
    },
    /**
     * @zh 树形表格的缩进距离
     * @en The indentation distance of the tree table
     */
    indentSize: {
      type: Number,
      default: 16,
    },
    /**
     * @zh 是否显示表头
     * @en Whether to show the header
     */
    showHeader: {
      type: Boolean,
      default: true,
    },
    /**
     * @zh 传递虚拟列表属性，传入此参数以开启虚拟滚动
     * @en Pass the virtual list attribute, pass in this parameter to turn on virtual scrolling
     * @type VirtualListProps
     */
    virtualListProps: {
      type: Object as PropType<VirtualListProps>,
    },
    components: {
      type: Object as PropType<TableComponents>,
    },
    // for JSX
    onExpand: {
      type: Function as PropType<(rowKey: string) => void>,
    },
    onExpandedChange: {
      type: Function as PropType<(rowKeys: string[]) => void>,
    },
    onSelect: {
      type: Function as PropType<(rowKeys: string[]) => void>,
    },
    onSelectAll: {
      type: Function as PropType<(checked: boolean) => void>,
    },
    onSelectionChange: {
      type: Function as PropType<(rowKeys: string[]) => void>,
    },
    onSorterChange: {
      type: Function as PropType<
        (dataIndex: string, direction: string) => void
      >,
    },
    onFilterChange: {
      type: Function as PropType<
        (dataIndex: string, filteredValues: string[]) => void
      >,
    },
    onPageChange: {
      type: Function as PropType<(page: number) => void>,
    },
    onPageSizeChange: {
      type: Function as PropType<(pageSize: number) => void>,
    },
    onCellClick: {
      type: Function as PropType<
        (record: TableData, column: TableColumn) => void
      >,
    },
    onRowClick: {
      type: Function as PropType<(record: TableData) => void>,
    },
    onHeaderClick: {
      type: Function as PropType<(column: TableColumn) => void>,
    },
  },
  emits: [
    /**
     * @zh 点击展开行时触发
     * @en Triggered when a row is clicked to expand
     */
    'expand',
    /**
     * @zh 已展开的数据行发生改变时触发
     * @en Triggered when the expanded data row changes
     */
    'expandedChange',
    /**
     * @zh 点击行选择器时触发
     * @en Triggered when the row selector is clicked
     */
    'select',
    /**
     * @zh 点击全选选择器时触发
     * @en Triggered when the select all selector is clicked
     */
    'selectAll',
    /**
     * @zh 已选择的数据行发生改变时触发
     * @en Triggered when the selected data row changes
     */
    'selectionChange',
    /**
     * @zh 排序规则发生改变时触发
     * @en Triggered when the collation changes
     */
    'sorterChange',
    /**
     * @zh 过滤选项发生改变时触发
     * @en Triggered when the filter options are changed
     */
    'filterChange',
    /**
     * @zh 表格分页发生改变时触发
     * @en Triggered when the table pagination changes
     */
    'pageChange',
    /**
     * @zh 表格每页数据数量发生改变时触发
     * @en Triggered when the number of data per page of the table changes
     */
    'pageSizeChange',
    /**
     * @zh 点击单元格时触发
     * @en Triggered when a cell is clicked
     */
    'cellClick',
    /**
     * @zh 点击行数据时触发
     * @en Triggered when row data is clicked
     */
    'rowClick',
    /**
     * @zh 点击表头数据时触发
     * @en Triggered when the header data is clicked
     */
    'headerClick',
  ],
  setup(props, { emit, slots }) {
    const prefixCls = getPrefixCls('table');
    const bordered = computed(() => {
      if (isObject(props.bordered)) {
        return { ...DEFAULT_BORDERED, ...props.bordered };
      }
      return { ...DEFAULT_BORDERED, wrapper: props.bordered };
    });

    // 获取滚动信息
    const isScroll = computed(() => {
      const x = Boolean(props.scroll?.x);
      const y = Boolean(props.scroll?.y);
      return { x, y };
    });

    const theadRef = ref<HTMLElement>();
    const tbodyRef = ref<HTMLElement>();

    const handleBodyScroll = () => {
      if (theadRef.value && tbodyRef.value) {
        theadRef.value.scrollLeft = tbodyRef.value.scrollLeft;
      }
    };

    onMounted(() => {
      watch(isScroll, ({ y }, _, onInvalidate) => {
        onInvalidate(() => {
          if (tbodyRef.value) {
            off(tbodyRef.value, 'scroll', handleBodyScroll);
          }
        });
        if (y && tbodyRef.value && theadRef.value) {
          on(tbodyRef.value, 'scroll', handleBodyScroll);
        }
      });
    });

    const columnsSlot = usePickSlots(slots, 'columns');

    const slotColumns = computed(() => {
      if (columnsSlot.value) {
        return getColumnsFromSlot(columnsSlot.value());
      }
      return undefined;
    });

    // 拆解分组后的数据表头信息
    const dataColumns = ref<TableColumn[]>([]);
    const groupColumns = ref<TableColumn[][]>([]);

    watch(
      () => [props.columns, slotColumns.value],
      ([columns, slotColumns]) => {
        const result = getGroupColumns(slotColumns ?? columns ?? []);
        dataColumns.value = result.dataColumns;
        groupColumns.value = result.groupColumns;
      },
      { immediate: true }
    );

    const isPaginationTop = computed(() =>
      ['tl', 'top', 'tr'].includes(props.pagePosition)
    );

    // 获取固定列信息
    const getFixedTable = () => {
      let hasLeftFixedColumn = false;
      let hasRightFixedColumn = false;
      if (props.rowSelection?.fixed || props.expandable?.fixed) {
        hasLeftFixedColumn = true;
      }

      for (const column of dataColumns.value) {
        if (column.fixed === 'left') {
          hasLeftFixedColumn = true;
        } else if (column.fixed === 'right') {
          hasRightFixedColumn = true;
        }
      }

      return {
        hasLeftFixedColumn,
        hasRightFixedColumn,
      };
    };

    const { hasLeftFixedColumn, hasRightFixedColumn } = getFixedTable();

    const hasEllipsis = computed(() => {
      for (const col of dataColumns.value) {
        if (col.ellipsis) {
          return true;
        }
      }
      return false;
    });

    // 外部筛选项，优先使用
    const outerFilters = computed(() => {
      const filters: Filters = {};
      for (const item of dataColumns.value) {
        if (item.dataIndex && item.filterable?.filteredValue) {
          filters[item.dataIndex] = item.filterable.filteredValue;
        }
      }
      return filters;
    });

    // External sorting, priority use
    const outerSorter = computed((): Sorter => {
      for (const item of dataColumns.value) {
        if (item.dataIndex && item.sortable?.sortOrder) {
          // Take the first existing collation
          return {
            filed: item.dataIndex,
            direction: item.sortable.sortOrder,
          };
        }
      }
      return {};
    });

    const getDefaultFilters = () => {
      const filters: Filters = {};
      for (const item of dataColumns.value) {
        if (item.dataIndex && item.filterable?.defaultFilteredValue) {
          filters[item.dataIndex] = item.filterable.defaultFilteredValue;
        }
      }
      return filters;
    };

    const getDefaultSorter = (): Sorter => {
      for (const item of dataColumns.value) {
        if (item.dataIndex && item.sortable?.defaultSortOrder) {
          // 取第一个存在的排序规则
          return {
            filed: item.dataIndex,
            direction: item.sortable.defaultSortOrder,
          };
        }
      }
      return {};
    };

    const _filters = ref(getDefaultFilters());
    const _sorter = ref(getDefaultSorter());

    const computedFilters = computed<Filters>(() => ({
      ..._filters.value,
      ...outerFilters.value,
    }));

    const computedSorter = computed<Sorter>(() => ({
      ..._sorter.value,
      ...outerSorter.value,
    }));

    const handleFilterChange = (
      dataIndex: string,
      filteredValues: string[]
    ) => {
      const newFilters = {
        ...computedFilters.value,
        [dataIndex]: filteredValues,
      };
      _filters.value = newFilters;

      emit('filterChange', dataIndex, filteredValues);
    };

    const handleSorterChange = (
      dataIndex: string,
      direction: 'ascend' | 'descend' | ''
    ) => {
      const newSorter: Sorter = direction
        ? {
            filed: dataIndex,
            direction,
          }
        : {};

      _sorter.value = newSorter;

      emit('sorterChange', dataIndex, direction);
    };

    const getColumnByDataIndex = (dataIndex: string) => {
      for (const item of dataColumns.value) {
        if (item.dataIndex === dataIndex) {
          return item;
        }
      }
      return undefined;
    };

    const disabledKeys = new Set();

    const allRowKeys = computed(() => {
      const allRowKeys: string[] = [];
      disabledKeys.clear();
      const travelData = (data: TableData[]) => {
        if (isArray(data) && data.length > 0) {
          for (const record of data) {
            allRowKeys.push(record.key);
            if (record.disabled) {
              disabledKeys.add(record.key);
            }
            if (record.children) {
              travelData(record.children);
            }
          }
        }
      };

      travelData(props.data);

      return allRowKeys;
    });

    const currentAllRowKeys = computed(() =>
      flattenData.value.map((column) => column.key)
    );

    const currentAllEnabledRowKeys = computed(() => {
      const keys: string[] = [];
      for (const column of flattenData.value) {
        if (!column.disabled) {
          keys.push(column.key);
        }
      }
      return keys;
    });

    const {
      isRadio,
      selectedRowKeys,
      currentSelectedRowKeys,
      handleSelect,
      handleSelectAll,
    } = useRowSelection(
      props,
      {
        allRowKeys,
        currentAllRowKeys,
        currentAllEnabledRowKeys,
      },
      emit
    );

    const { expandedRowKeys, handleExpand } = useExpand(
      props,
      allRowKeys.value,
      emit
    );

    const hasSubTree = ref(false);

    const processData = (origin: TableData[]) => {
      let data = isArray(origin) ? [...origin] : [];
      if (data.length > 0) {
        for (const field of Object.keys(computedFilters.value)) {
          const filteredValues = computedFilters.value[field];
          const column = getColumnByDataIndex(field);
          if (
            column &&
            column.filterable?.filter &&
            filteredValues.length > 0
          ) {
            data = data.filter((record) => {
              const isValid = column.filterable?.filter(filteredValues, record);
              if (isValid && record.children) {
                if (!hasSubTree.value) {
                  hasSubTree.value = true;
                }
                record.children = processData(record.children);
              }
              return isValid;
            });
          }
        }

        if (computedSorter.value.filed) {
          const column = getColumnByDataIndex(computedSorter.value.filed);
          if (column) {
            data.sort((a, b) => {
              const valueA = a[computedSorter.value.filed];
              const valueB = b[computedSorter.value.filed];
              const result =
                column.sortable?.sorter?.(valueA, valueB) ?? valueA > valueB
                  ? 1
                  : -1;
              return computedSorter.value.direction === 'descend'
                ? -result
                : result;
            });
          }
        }
      }

      return data;
    };

    // 数据处理（筛选和排序）
    const processedData = computed(() => processData(props.data));

    const { page, pageSize, handlePageChange, handlePageSizeChange } =
      usePagination(props, emit);

    const flattenData = computed(() => {
      if (props.pagination && processedData.value.length > pageSize.value) {
        return processedData.value.slice(
          (page.value - 1) * pageSize.value,
          page.value * pageSize.value
        );
      }
      return processedData.value;
    });

    const containerRef = ref<HTMLDivElement>();
    const containerScrollLeft = ref(0);

    const getBodyScrollPosition = () => {
      let alignLeft = true;
      let alignRight = true;

      const scrollContainer = isScroll.value.y
        ? tbodyRef.value
        : containerRef.value;

      if (scrollContainer) {
        alignLeft = containerScrollLeft.value === 0;
        alignRight =
          containerScrollLeft.value + scrollContainer.offsetWidth >=
          scrollContainer.scrollWidth;
      }

      return {
        alignLeft,
        alignRight,
      };
    };

    const getTableScrollCls = () => {
      const { alignLeft, alignRight } = getBodyScrollPosition();
      if (alignLeft && alignRight) {
        return `${prefixCls}-scroll-position-both`;
      }
      if (alignLeft) {
        return `${prefixCls}-scroll-position-left`;
      }
      if (alignRight) {
        return `${prefixCls}-scroll-position-right`;
      }
      return `${prefixCls}-scroll-position-middle`;
    };

    const getTableFixedCls = () => {
      const cls = [];
      if (hasLeftFixedColumn) {
        cls.push(`${prefixCls}-has-fixed-col-left`);
      }
      if (hasRightFixedColumn) {
        cls.push(`${prefixCls}-has-fixed-col-right`);
      }
      return cls;
    };

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      if (target.scrollLeft !== containerScrollLeft.value) {
        containerScrollLeft.value = target.scrollLeft;
      }
      if (isScroll.value.y && theadRef.value) {
        theadRef.value.scrollLeft = target.scrollLeft;
      }
    };

    const handleRowClick = (record: TableData) => {
      emit('rowClick', record);
    };

    const handleCellClick = (record: TableData, column: TableColumn) => {
      emit('cellClick', record, column);
    };

    const handleHeaderClick = (column: TableColumn) => {
      emit('headerClick', column);
    };

    const getOperations = () => {
      const operations: TableOperationColumn[] = [];
      const hasFixedColumn = hasLeftFixedColumn || hasRightFixedColumn;
      let expand: TableOperationColumn | undefined;
      let selection: TableOperationColumn | undefined;

      if (props.expandable) {
        expand = {
          name: 'expand',
          title: props.expandable.title,
          width: props.expandable.width ?? 40,
          fixed: props.expandable.fixed || hasFixedColumn,
        };
        operations.push(expand);
      }

      if (props.rowSelection) {
        selection = {
          name: 'selection',
          title: props.rowSelection.title,
          width: props.rowSelection.width ?? 40,
          fixed: props.rowSelection.fixed || hasFixedColumn,
        };
        operations.push(selection);
      }

      const operationsFn = props.components?.operations;

      return isFunction(operationsFn)
        ? operationsFn({ expand, selection })
        : operations;
    };

    const operations = computed(() => getOperations());

    const contentStyle = computed(() => {
      const style: CSSProperties = {};
      if (isScroll.value.x) {
        style.width = `${props.scroll?.x}px`;
      }
      return style;
    });

    const cls = computed(() => [
      prefixCls,
      `${prefixCls}-size-${props.size}`,
      {
        [`${prefixCls}-border`]: bordered.value.wrapper,
        [`${prefixCls}-border-cell`]: bordered.value.cell,
        [`${prefixCls}-border-header-cell`]:
          !bordered.value.cell && bordered.value.headerCell,
        [`${prefixCls}-border-body-cell`]:
          !bordered.value.cell && bordered.value.bodyCell,
        [`${prefixCls}-stripe`]: props.stripe,
        [`${prefixCls}-hover`]: props.hoverable,
        // [`${prefixCls}-type-radio`]: rowSelection && rowSelection.type === 'radio',
        [`${prefixCls}-layout-fixed`]:
          props.tableLayoutFixed ||
          isScroll.value.x ||
          isScroll.value.y ||
          hasEllipsis.value,
      },
    ]);

    const paginationCls = computed(() => [
      `${prefixCls}-pagination`,
      {
        [`${prefixCls}-pagination-left`]:
          props.pagePosition === 'tl' || props.pagePosition === 'bl',
        [`${prefixCls}-pagination-center`]:
          props.pagePosition === 'top' || props.pagePosition === 'bottom',
        [`${prefixCls}-pagination-top`]: isPaginationTop.value,
      },
    ]);

    const tableCls = computed(() => {
      const cls = getTableFixedCls();

      if (isScroll.value.x) {
        cls.push(getTableScrollCls());
      }

      if (isScroll.value.y || isVirtualList.value) {
        cls.push(`${prefixCls}-scroll-y`);
      }

      return cls;
    });

    const thRefs = ref<{
      operation: HTMLElement[];
      data: Record<string, HTMLElement>;
    }>({
      operation: [],
      data: {},
    });

    const isVirtualList = computed(() => Boolean(props.virtualListProps));

    const hasScrollBar = computed(() => {
      return (
        (tbodyRef.value &&
          tbodyRef.value.offsetWidth > tbodyRef.value.clientWidth) ??
        false
      );
    });

    const renderContent = () => {
      if (isScroll.value.y || isVirtualList.value) {
        const style: CSSProperties = {
          overflowY: hasScrollBar.value ? 'scroll' : 'hidden',
        };

        return (
          <>
            {props.showHeader && (
              <div ref={theadRef} class={`${prefixCls}-header`} style={style}>
                <table
                  cellpadding={0}
                  cellspacing={0}
                  style={contentStyle.value}
                >
                  <ColGroup
                    dataColumns={dataColumns.value}
                    operations={operations.value}
                  />
                  {renderHeader()}
                </table>
              </div>
            )}
            {isVirtualList.value ? (
              renderVirtualListBody()
            ) : (
              <div
                ref={tbodyRef}
                class={`${prefixCls}-body`}
                style={{ maxHeight: `${props.scroll?.y}px` }}
                onScroll={handleScroll}
              >
                <table
                  cellpadding={0}
                  cellspacing={0}
                  style={contentStyle.value}
                >
                  <ColGroup
                    dataColumns={dataColumns.value}
                    operations={operations.value}
                  />
                  {renderBody()}
                </table>
              </div>
            )}
          </>
        );
      }

      return (
        <table cellpadding={0} cellspacing={0}>
          <ColGroup
            dataColumns={dataColumns.value}
            operations={operations.value}
          />
          {props.showHeader && renderHeader()}
          {renderBody()}
        </table>
      );
    };

    const renderTable = (content?: Slot) => (
      <>
        <div
          ref={containerRef}
          class={[`${prefixCls}-container`, tableCls.value]}
          onScroll={handleScroll}
        >
          <div class={`${prefixCls}-content`}>
            {content ? (
              <table
                cellpadding={0}
                cellspacing={0}
                style={isScroll.value.y ? undefined : contentStyle.value}
              >
                {content()}
              </table>
            ) : (
              renderContent()
            )}
          </div>
        </div>
        {slots.footer && (
          <div class={`${prefixCls}-footer`}>{slots.footer()}</div>
        )}
      </>
    );

    const spinProps = computed(() =>
      isObject(props.loading) ? props.loading : { loading: props.loading }
    );

    const renderPagination = () => {
      const paginationProps = isObject(props.pagination)
        ? omit(props.pagination, [
            'current',
            'pageSize',
            'defaultCurrent',
            'defaultPageSize',
          ])
        : {};

      return (
        <div class={paginationCls.value}>
          <Pagination
            total={processedData.value.length}
            current={page.value}
            pageSize={pageSize.value}
            onChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            {...paginationProps}
          />
        </div>
      );
    };

    const renderHeader = () => (
      <Thead>
        {groupColumns.value.map((row, index) => (
          <Tr key={`header-row-${index}`}>
            {index === 0 &&
              operations.value.map((operation, index) => (
                <OperationTh
                  ref={(ins) => {
                    if (ins?.$el) {
                      thRefs.value.operation[index] = ins.$el;
                    }
                  }}
                  key={`operation-th-${index}`}
                  operationColumn={operation}
                  operations={operations.value}
                  rowSelection={props.rowSelection}
                  expandable={props.expandable}
                  selectedNumber={currentSelectedRowKeys.value.length}
                  totalNumber={currentAllRowKeys.value.length}
                  totalEnabledNumber={currentAllEnabledRowKeys.value.length}
                  onSelectAll={handleSelectAll}
                />
              ))}
            {row.map((column, index) => {
              const sortOrder =
                column.dataIndex === computedSorter.value.filed
                  ? computedSorter.value.direction
                  : '';

              return (
                <Th
                  key={`th-${index}`}
                  ref={(ins) => {
                    if (ins?.$el) {
                      thRefs.value.data[column.dataIndex] = ins.$el;
                    }
                  }}
                  column={column}
                  operations={operations.value}
                  dataColumns={dataColumns.value}
                  sortOrder={sortOrder}
                  filterValue={computedFilters.value[column.dataIndex] ?? []}
                  onSorterChange={handleSorterChange}
                  onFilterChange={handleFilterChange}
                  onClick={(e) => handleHeaderClick(column)}
                />
              );
            })}
          </Tr>
        ))}
      </Thead>
    );

    const renderEmpty = () => {
      return (
        <Tr isEmptyRow>
          <Td colSpan={dataColumns.value.length + operations.value.length}>
            {slots.empty?.() ?? <Empty />}
          </Td>
        </Tr>
      );
    };

    const renderExpandContent = (record: TableData) => {
      if (slots.expand) {
        return slots.expand({ record });
      }
      if (isFunction(record.expand)) {
        return record.expand();
      }
      return record.expand;
    };

    const renderExpandBtn = (record: TableData) => {
      const rowKey = record.key;
      const expanded = expandedRowKeys.value.includes(rowKey);

      return (
        <button
          class={`${prefixCls}-expand-btn`}
          onClick={() => handleExpand(rowKey)}
        >
          {slots.expandIcon?.({ expanded, record }) ?? expanded ? (
            <IconMinus />
          ) : (
            <IconPlus />
          )}
        </button>
      );
    };

    const renderRecord = (record: TableData, indentSize: number) => {
      const rowKey = record.key;
      const expandContent = renderExpandContent(record);
      const showExpand = expandedRowKeys.value.includes(rowKey);

      const hasSubTree = Boolean(record.children);
      const subTreeHasSubData =
        record.children?.some((record) => Boolean(record.children)) ?? false;

      return (
        <>
          <Tr
            onClick={(e) => handleRowClick(record)}
            style={{ position: 'flex' }}
            key={rowKey}
          >
            {operations.value.map((operation, index) => {
              const style =
                isVirtualList.value &&
                thRefs.value.operation[index]?.offsetWidth
                  ? {
                      width: `${thRefs.value.operation[index]?.offsetWidth}px`,
                    }
                  : undefined;

              return (
                <OperationTd
                  key={`operation-td-${index}`}
                  style={style}
                  record={record}
                  isRadio={isRadio.value}
                  hasExpand={Boolean(expandContent)}
                  operationColumn={operation}
                  operations={operations.value}
                  selectedRowKeys={selectedRowKeys.value}
                  expandedRowKeys={expandedRowKeys.value}
                  onSelect={handleSelect}
                  onExpand={handleExpand}
                />
              );
            })}
            {dataColumns.value.map((column, index) => {
              const extraProps =
                index === 0
                  ? {
                      showExpandBtn: hasSubTree,
                      indentSize: hasSubTree ? indentSize - 20 : indentSize,
                    }
                  : {};

              const style =
                isVirtualList.value &&
                thRefs.value.data[column.dataIndex]?.offsetWidth
                  ? {
                      width: `${
                        thRefs.value.data[column.dataIndex]?.offsetWidth
                      }px`,
                    }
                  : undefined;

              return (
                <Td
                  key={`td-${index}`}
                  style={style}
                  record={record}
                  isSorted={
                    Boolean(computedSorter.value.filed) &&
                    column.dataIndex === computedSorter.value.filed
                  }
                  column={column}
                  operations={operations.value}
                  dataColumns={dataColumns.value}
                  {...extraProps}
                  onClick={(e) => handleCellClick(record, column)}
                >
                  {{ expandBtn: () => renderExpandBtn(record) }}
                </Td>
              );
            })}
          </Tr>
          {showExpand &&
            (hasSubTree ? (
              record.children?.map((item) =>
                renderRecord(
                  item,
                  subTreeHasSubData
                    ? indentSize + props.indentSize + 20
                    : indentSize + props.indentSize
                )
              )
            ) : (
              <Tr isExpandRow key={`${rowKey}-expand`}>
                <Td
                  isFixedExpand={hasLeftFixedColumn || hasRightFixedColumn}
                  containerWidth={containerRef.value?.offsetWidth}
                  colSpan={dataColumns.value.length + operations.value.length}
                >
                  {expandContent}
                </Td>
              </Tr>
            ))}
        </>
      );
    };

    const virtualListRef = ref();

    const renderVirtualListBody = () => {
      return (
        <VirtualList
          ref={virtualListRef}
          class={`${prefixCls}-body`}
          {...props.virtualListProps}
          data={flattenData.value}
          v-slots={{
            item: ({ item }: { item: TableData }) => renderRecord(item, 0),
          }}
        />
      );
    };

    const renderBody = () => {
      const hasSubData = flattenData.value.some((record) =>
        Boolean(record.children)
      );

      return (
        <Tbody>
          {flattenData.value.length > 0
            ? flattenData.value.map((record) =>
                renderRecord(record, hasSubData ? 20 : 0)
              )
            : renderEmpty()}
        </Tbody>
      );
    };

    return () => {
      if (slots.default) {
        return <div class={cls.value}>{renderTable(slots.default)}</div>;
      }

      return (
        <div class={cls.value}>
          <Spin {...spinProps.value}>
            {props.pagination !== false &&
              isPaginationTop.value &&
              renderPagination()}
            {renderTable()}
            {props.pagination !== false &&
              !isPaginationTop.value &&
              renderPagination()}
          </Spin>
        </div>
      );
    };
  },
  /**
   * @zh 展开行图标
   * @en Expand row icon
   * @slot expandIcon
   */
  /**
   * @zh 展开行内容
   * @en Expand row content
   * @slot expandedRow
   */
  /**
   * @zh 筛选按钮图标
   * @en Filter button icon
   * @slot filterIcon
   */
  /**
   * @zh 筛选弹出框内容
   * @en The content of filter popup box
   * @slot filterContent
   */
  // 生成文档使用
  render: undefined,
});
