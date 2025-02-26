import { ValueData } from '../_utils/types';
import { isObject } from '../_utils/is';

export const getValueData = (value: Array<string | number | ValueData>) => {
  const result: ValueData[] = [];
  for (const item of value) {
    if (isObject(item)) {
      result.push(item);
    } else {
      result.push({
        value: item,
        label: String(item),
        closable: true,
      });
    }
  }
  return result;
};
