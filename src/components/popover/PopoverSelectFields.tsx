import { Popover, Checkbox, Input, Button, Form } from 'antd';

import '~/components/popover/PopoverSelect.scss';
import { FC, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { isEmpty, removeAccent } from '~/utils/helpers/helpers';
import { IconCloseNoneCycleSmall, IconCloseNoneCycleWhite } from '~/assets';
import { ItemotherListSearchFlight, PopoverSelectFieldsProps } from '~/components/popover/Modal';

const PopoverSelectFields: FC<PopoverSelectFieldsProps> = ({
  trigger = 'click',
  placement = 'bottomLeft',
  listFields = [],
  title = '',
  defaultVisible = false,
  handleRemoveField = () => {},
  name = '',
  handleFetData = () => {},
  isDefault = true,
}) => {
  const intl = useIntl();
  const form = Form.useFormInstance();
  const [listItemC, setListItemC] = useState<ItemotherListSearchFlight[]>(listFields);
  const [visible, setVisible] = useState(defaultVisible);
  const [valueC, setValueC] = useState<string[]>([]);

  useEffect(() => {
    setValueC(form.getFieldValue(name) || (isDefault ? ['removeTest'] : []));
  }, [visible]);

  useEffect(() => {
    setListItemC(listFields);
  }, [listFields]);

  const onChange = (e: CheckboxChangeEvent) => {
    const idSelected = listItemC.map((el) => el.key);
    setValueC(idSelected.length === valueC.length ? [] : idSelected);
  };

  const handleSearchList = (e: React.ChangeEvent<HTMLInputElement>) => {
    const listItemTemp = listFields.filter(
      (el) =>
        removeAccent(el.name?.toLowerCase()).indexOf(removeAccent(e.target.value?.toLowerCase())) >=
        0,
    );
    setListItemC(listItemTemp);
  };

  const onChangeItem = (e: CheckboxChangeEvent, key: string) => {
    if (e.target.checked) {
      setValueC([...valueC, key]);
    } else {
      setValueC(valueC.filter((el) => el !== key));
    }
  };

  const getNameFirst = () => {
    if (!isEmpty(valueC) && !isEmpty(listItemC)) {
      const firstItem = listItemC.find((el) => el.key === valueC[valueC.length - 1]);
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
        {listItemC.map((el) => (
          <div className='item-select' key={el.name}>
            <Checkbox
              checked={valueC.includes(el.key)}
              className='check-box check-box-item'
              onChange={(e) => onChangeItem(e, el.key)}
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

export default PopoverSelectFields;
