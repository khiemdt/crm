import { Popover, Checkbox, Input, Button } from 'antd';
import '~/components/popover/PopoverSelect.scss';
import { FC, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { isEmpty, removeAccent } from '~/utils/helpers/helpers';
import { IconChevronDown } from '~/assets';
import { PopoverSelectCAProps } from '~/components/popover/Modal';

const PopoverSelectCA: FC<PopoverSelectCAProps> = ({
  trigger = 'click',
  placement = 'bottomLeft',
  listItem = [],
  value = [],
  handleSelected = () => {},
  title = '',
  className = '',
}) => {
  const intl = useIntl();
  const [listItemC, setListItemC] = useState(listItem);
  const [valueC, setValueC] = useState(value);

  useEffect(() => {
    setListItemC(listItem);
  }, [listItem]);

  useEffect(() => {
    setValueC(value);
  }, [value]);

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

  const onChangeItem = (e: CheckboxChangeEvent, id: number) => {
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
        {listItemC.map((el, idx) => (
          <div className='item-select' key={idx.toString()}>
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
      placement={placement}
      autoAdjustOverflow={false}
      overlayClassName='popover-select'
      content={content}
      onVisibleChange={(visible) => {
        if (!visible && JSON.stringify(value) !== JSON.stringify(valueC)) {
          handleSelected(valueC);
        }
      }}
    >
      <Button className={`item-btn-filter ${className}`}>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {intl.formatMessage({ id: title })}
          <span className='first-name'>{getNameFirst()}</span>
          {valueC.length > 1 && <span className='number-tag'>{`+${valueC.length - 1}`}</span>}
        </span>

        <IconChevronDown style={{ marginLeft: 8 }} />
      </Button>
    </Popover>
  );
};

export default PopoverSelectCA;
