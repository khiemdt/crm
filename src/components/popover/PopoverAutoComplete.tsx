import { Popover, Button, Form, AutoComplete, message, Row, Col, Select, Tooltip } from 'antd';

import '~/components/popover/PopoverSelect.scss';
import { FC, useEffect, useState } from 'react';

import { useIntl } from 'react-intl';
import { isEmpty } from '~/utils/helpers/helpers';
import { IconCloseNoneCycleSmall, IconCloseNoneCycleWhite } from '~/assets';
import { PopoverInputProps } from '~/components/popover/Modal';
import { some, TIME_OUT_QUERY_API_FLIGHT_REMOVE_FIELD } from '~/utils/constants/constant';
import { searchHotel } from '~/apis/hotel';
import { SUCCESS_CODE } from '~/features/flight/constant';

let timeoutSearch: any = null;
const { Option } = Select;

const PopoverAutoComplete: FC<PopoverInputProps> = ({
  trigger = 'click',
  placement = 'bottomLeft',
  title = '',
  handleRemoveField = () => {},
  defaultVisible = false,
  name = '',
  handleFetData = () => {},
}) => {
  const form = Form.useFormInstance();
  const intl = useIntl();
  const [visible, setVisible] = useState(defaultVisible);
  const [options, setOptions] = useState<some[]>([]);

  const onSearch = (searchText: string) => {
    clearTimeout(timeoutSearch);
    timeoutSearch = setTimeout(() => {
      fetHotels(searchText);
    }, TIME_OUT_QUERY_API_FLIGHT_REMOVE_FIELD);
  };

  const fetHotels = async (searchText: string) => {
    const dataDTO = {
      size: 5,
      term: searchText,
    };
    try {
      const { data } = await searchHotel(dataDTO);
      if (data.code === SUCCESS_CODE) {
        setOptions(data.data);
      } else {
        message.error(data?.message);
      }
    } catch (error) {}
  };

  const onSelect = (value: any) => {
    const itemSelected: some | undefined = options.find((el: some) => el.name === value);
    let listField = form.getFieldValue('filedAdds');
    console.log('listField', listField);
    if (!listField.includes('rootHotelId')) {
      listField = [...listField, 'rootHotelId'];
    }
    setVisible(false);
    setTimeout(() => {
      form.setFieldsValue({
        [name]: itemSelected?.name,
        rootHotelId: itemSelected?.id,
        filedAdds: listField,
      });
      handleFetData({
        ...form.getFieldsValue(true),
        [name]: itemSelected?.name,
        rootHotelId: itemSelected?.id,
      });
    }, 100);
  };

  const content = (
    <div className='content-popover-input'>
      <AutoComplete
        className='hotel-name-search'
        onSearch={onSearch}
        placeholder='Nhập mã hoặc tên khách sạn'
        onSelect={onSelect}
      >
        {options.map((el: some) => (
          <Option key={el.id} value={`${el.name}`} className='select-item-option'>
            <div className='option-item-hotel-name'>
              <span className='option-item-hotel-name-value' title={el.name}>
                {' '}
                {el.name}
              </span>
              <span className='option-item-hotel-name-value option-item-hotel-name-value-address'>
                {' '}
                {el.address}
              </span>
            </div>
          </Option>
        ))}
      </AutoComplete>
    </div>
  );

  const handleActionRemoveField = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    handleRemoveField();
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <Popover
      trigger={trigger}
      autoAdjustOverflow={false}
      placement={placement}
      overlayClassName='popover-select'
      content={content}
      visible={visible}
      onVisibleChange={(visible) => setVisible(visible)}
    >
      <Button
        className={`item-btn-filter ${visible && 'item-btn-filter-active'}`}
        onClick={() => setVisible(!visible)}
      >
        {intl.formatMessage({ id: title })}
        <Tooltip placement='top' title={form.getFieldValue(name)}>
          <span className='first-name'>{form.getFieldValue(name)}</span>
        </Tooltip>
        {visible ? (
          <IconCloseNoneCycleWhite style={{ marginLeft: 8 }} onClick={handleActionRemoveField} />
        ) : (
          <IconCloseNoneCycleSmall style={{ marginLeft: 8 }} onClick={handleActionRemoveField} />
        )}
      </Button>
    </Popover>
  );
};

export default PopoverAutoComplete;
