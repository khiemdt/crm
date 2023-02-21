import { Popover, Checkbox, Input, Button, Form } from 'antd';

import '~/components/popover/PopoverSelect.scss';
import { FC, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { isEmpty, removeAccent } from '~/utils/helpers/helpers';
import { IconCloseNoneCycleSmall, IconCloseNoneCycleWhite } from '~/assets';
import { PopoverSelectProps } from '~/components/popover/Modal';

const PopoverSelect: FC<PopoverSelectProps> = ({
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
  const [valueC, setValueC] = useState<(number | string | boolean)[]>([]);

  useEffect(() => {
    setValueC(form.getFieldValue(name) || []);
  }, [visible]);

  useEffect(() => {
    setListItemC(listItem);
  }, [listItem]);

  const onChange = (e: CheckboxChangeEvent) => {
    const idSelected = listItemC.map((el) => el.id);
    setValueC(idSelected.length === valueC.length ? [] : idSelected);
  };

  const handleSearchList = (e: React.ChangeEvent<HTMLInputElement>) => {
    const listItemTemp = listItem.filter(
      (el) =>
        removeAccent(el.name?.toLowerCase()).indexOf(removeAccent(e.target.value?.toLowerCase())) >=
        0,
    );
    setListItemC(listItemTemp);
  };

  const onChangeItem = (e: CheckboxChangeEvent, id: number | string) => {
    if (e.target.checked) {
      setValueC([...valueC, id]);
    } else {
      setValueC(valueC.filter((el) => el !== id));
    }
  };

  const getNameFirst = () => {
    if (!isEmpty(valueC) && !isEmpty(listItemC)) {
      const firstItem = listItemC.find((el) => el.id === valueC[valueC.length - 1]);
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
        <Checkbox
          checked={valueC.length === listItemC.length}
          onChange={onChange}
          className='check-box'
        />
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
              checked={valueC.includes(el.id)}
              className='check-box check-box-item'
              onChange={(e) => onChangeItem(e, el.id)}
            >
              {el.name}
            </Checkbox>
          </div>
        ))}
      </div>
      <div className='bottom-select'>
        <Button type='text' disabled={isEmpty(valueC)} onClick={() => setValueC([])}>
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
        const valueCurrent = form.getFieldValue(name);
        if (!visible && JSON.stringify(valueCurrent) !== JSON.stringify(valueC)) {
          form.setFieldsValue({ [name]: valueC });
          handleFetData({
            ...form.getFieldsValue(true),
            [name]: valueC,
          });
        }
      }}
      visible={visible}
    >
      <Button
        className={`item-btn-filter ${visible && 'item-btn-filter-active'}`}
        onClick={() => setVisible(!visible)}
      >
        {intl.formatMessage({ id: title })}
        <span className='first-name'>{getNameFirst()}</span>
        {valueC.length > 1 && <span className='number-tag'>{`+${valueC.length - 1}`}</span>}
        {visible ? (
          <IconCloseNoneCycleWhite style={{ marginLeft: 8 }} onClick={handleActionRemoveField} />
        ) : (
          <IconCloseNoneCycleSmall style={{ marginLeft: 8 }} onClick={handleActionRemoveField} />
        )}
      </Button>
    </Popover>
  );
};

export default PopoverSelect;
