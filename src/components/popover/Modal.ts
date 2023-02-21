import { TooltipPlacement } from 'antd/lib/tooltip';
import { ItemListOptionFilterStatusFlight, some } from '~/utils/constants/constant';

export interface PopoverInputProps {
  trigger?: string;
  placement?: TooltipPlacement;
  title?: string;
  handleRemoveField: Function;
  defaultVisible: boolean;
  name: string;
  handleFetData?: Function;
}

export interface PopoverRadioProps {
  trigger?: string;
  placement?: TooltipPlacement;
  title?: string;
  handleRemoveField: Function;
  defaultVisible: boolean;
  name: string;
  options?: ItemListOptionFilterStatusFlight[];
  handleFetData: Function;
}

export interface PopoverRangePickerProps {
  trigger?: string;
  placement?: TooltipPlacement;
  title?: string;
  handleRemoveField: Function;
  defaultVisible: boolean;
  name: string;
  handleFetData?: Function;
  listFilterAdd: some[];
}

export interface ItemListOptionFilterFlight {
  name: string;
  id: number | string | boolean;
}

export interface PopoverSelectProps {
  trigger?: string;
  placement?: TooltipPlacement;
  listItem?: ItemListOptionFilterFlight[];
  title?: string;
  defaultVisible: boolean;
  handleRemoveField: Function;
  name: string;
  handleFetData: Function;
  isSingleSelected?: boolean;
}

interface itemList {
  name: string;
  key: string;
  type: string;
}

export interface PopoverSelectAddFieldsProps {
  trigger?: string;
  placement?: TooltipPlacement;
  listItem: itemList[];
  value: string[];
  handleSelected: Function;
  title: string;
}

export interface itemListCA {
  name: string;
  id: number;
  code?: string;
}

export interface PopoverSelectCAProps {
  trigger?: string;
  placement?: TooltipPlacement;
  listItem?: itemListCA[];
  value: number[];
  handleSelected: Function;
  title: string;
  className?: string;
}

export interface ItemotherListSearchFlight {
  name: string;
  key: string;
  defaultValue: boolean;
}

export interface PopoverSelectFieldsProps {
  trigger?: string;
  placement?: TooltipPlacement;
  listFields?: ItemotherListSearchFlight[];
  title?: string;
  defaultVisible: boolean;
  handleRemoveField: Function;
  name: string;
  handleFetData: Function;
  isDefault?: boolean;
}
