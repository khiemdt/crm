import { Popover, Checkbox, Input, Button, Form } from 'antd';

import '~/components/popover/PopoverSelect.scss';
import { FC, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { isEmpty, removeAccent } from '~/utils/helpers/helpers';
import { IconCloseNoneCycleSmall, IconCloseNoneCycleWhite } from '~/assets';
import { PopoverSelectProps } from '~/components/popover/Modal';

const PopoverSingleSelect: FC<PopoverSelectProps> = ({
  trigger = 'click',
  placement = 'bottomLeft',
  listItem = [],
  title = '',
  defaultVisible = false,
  handleRemoveField = () => {},
  name = '',
  handleFetData = () => {},
}) => {
  const intl = useIntl();
  const form = Form.useFormInstance();
  const [listItemC, setListItemC] = useState(listItem);
  const [visible, setVisible] = useState(defaultVisible);
  const [valueC, setValueC] = useState<number | string | null>(null);

  useEffect(() => {
    setValueC(form.getFieldValue(name) || null);
  }, [visible]);

  useEffect(() => {
    setListItemC(listItem);
  }, [listItem]);

  const handleSearchList = (e: React.ChangeEvent<HTMLInputElement>) => {
    const listItemTemp = listItem.filter(
      (el) =>
        removeAccent(el.name?.toLowerCase()).indexOf(removeAccent(e.target.value?.toLowerCase())) >=
        0,
    );
    setListItemC(listItemTemp);
  };

  const onChangeItem = (e: CheckboxChangeEvent, id: number | string) => {
    const idTemp: any = e.target.checked ? id : undefined;
    setValueC(idTemp);
    form.setFieldsValue({ [name]: idTemp });
    handleFetData({
      ...form.getFieldsValue(true),
      [name]: idTemp,
    });
    setVisible(false);
  };

  const getNameFirst = () => {
    if (!isEmpty(valueC) && !isEmpty(listItemC)) {
      const firstItem = listItemC.find((el) => el.id == valueC);
      return firstItem?.name;
    }
    return '';
  };

  const handleActionRemoveField = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    handleRemoveField();
    e.stopPropagation();
    e.preventDefault();
  };

  const content = (
    <>
      <div className='header-select'>
        <Input
          allowClear
          placeholder={intl.formatMessage({ id: 'IDS_TEXT_SEARCH' })}
          onChange={handleSearchList}
        />
      </div>
      <div className='content-select'>
        {listItemC.map((el: any) => (
          <div className='item-select' key={el.name}>
            <Checkbox
              checked={valueC == el.id}
              className='check-box check-box-item'
              onChange={(e) => onChangeItem(e, el.id)}
            >
              {el.name}
            </Checkbox>
          </div>
        ))}
      </div>
      <div className='bottom-select'>
        <Button type='text' disabled={isEmpty(valueC)} onClick={() => setValueC(null)}>
          Bỏ chọn
        </Button>
      </div>
    </>
  );

  return (
    <Popover
      trigger={trigger}
      autoAdjustOverflow={false}
      placement={placement}
      overlayClassName='popover-select'
      content={content}
      onVisibleChange={(visible) => {
        setVisible(visible);
      }}
      visible={visible}
    >
      <Button
        className={`item-btn-filter ${visible && 'item-btn-filter-active'}`}
        onClick={() => setVisible(!visible)}
      >
        {intl.formatMessage({ id: title })}
        <span className='first-name'>{getNameFirst()}</span>
        {visible ? (
          <IconCloseNoneCycleWhite style={{ marginLeft: 8 }} onClick={handleActionRemoveField} />
        ) : (
          <IconCloseNoneCycleSmall style={{ marginLeft: 8 }} onClick={handleActionRemoveField} />
        )}
      </Button>
    </Popover>
  );
};

export default PopoverSingleSelect;
