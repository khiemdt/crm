import { Popover, Checkbox, Input, Button } from 'antd';

import '~/components/popover/PopoverSelect.scss';
import { FC, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { removeAccent } from '~/utils/helpers/helpers';
import { IconAdd } from '~/assets';
import { PopoverSelectAddFieldsProps } from '~/components/popover/Modal';

const PopoverSelectAddFields: FC<PopoverSelectAddFieldsProps> = ({
  trigger = 'click',
  placement = 'bottomLeft',
  listItem = [],
  value = [],
  handleSelected = () => {},
  title = '',
}) => {
  const intl = useIntl();
  const [listItemC, setListItemC] = useState(listItem);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setListItemC(listItem);
  }, [listItem]);

  const onChange = (e: CheckboxChangeEvent) => {
    setVisible(false);
    const idSelected = listItemC.map((el) => el.key);
    handleSetSelected(idSelected.length === value.length ? [] : idSelected);
  };

  const handleSearchList = (e: React.ChangeEvent<HTMLInputElement>) => {
    const listItemTemp = listItem.filter(
      (el) =>
        removeAccent(intl.formatMessage({ id: el.name })?.toLowerCase()).indexOf(
          removeAccent(e.target.value?.toLowerCase()),
        ) >= 0,
    );
    setListItemC(listItemTemp);
  };

  const onChangeItem = (e: CheckboxChangeEvent, id: string) => {
    setVisible(false);
    if (e.target.checked) {
      handleSetSelected([...value, id]);
    } else {
      handleSetSelected(value.filter((el) => el !== id));
    }
  };

  const handleSetSelected = (items: string[]) => {
    setTimeout(() => {
      handleSelected(items);
    }, 100);
  };

  const content = (
    <>
      <div className='header-select'>
        <Checkbox
          checked={value.length === listItemC.length}
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
        {listItemC.map((el, idx) => (
          <div className='item-select' key={idx.toString()}>
            <Checkbox
              checked={value.includes(el.key)}
              className='check-box check-box-item'
              onChange={(e) => onChangeItem(e, el.key)}
            >
              {intl.formatMessage({ id: el.name })}
            </Checkbox>
          </div>
        ))}
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
      visible={visible}
      onVisibleChange={(visible) => setVisible(visible)}
    >
      <Button className='item-btn-filter' onClick={() => setVisible(!visible)}>
        {intl.formatMessage({ id: title })}
        <IconAdd style={{ marginLeft: 8 }} />
      </Button>
    </Popover>
  );
};

export default PopoverSelectAddFields;
