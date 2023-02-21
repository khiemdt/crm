import { Popover, Checkbox, Input, Button, Form } from 'antd';

import '~/components/popover/PopoverSelect.scss';
import { FC, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { isEmpty } from '~/utils/helpers/helpers';
import { IconCloseNoneCycleSmall, IconCloseNoneCycleWhite } from '~/assets';
import { PopoverSelectProps } from '~/components/popover/Modal';
import { some } from '~/utils/constants/constant';

const PopoverSelectSubGroup: FC<PopoverSelectProps> = ({
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
    let result: any[] = [];
    listItem.forEach((el: some) => {
      const ids = el.subCategories.map((it: some) => it.id);
      result = [...result, ...ids];
    });
    setValueC(result.length === valueC.length ? [] : result);
  };

  const onChangeItem = (e: CheckboxChangeEvent, id: number | string) => {
    if (e.target.checked) {
      setValueC([...valueC, id]);
    } else {
      setValueC(valueC.filter((el) => el !== id));
    }
  };

  const getNameFirst = () => {
    let result: some = {};
    if (!isEmpty(valueC) && !isEmpty(listItemC)) {
      listItemC.forEach((el: some) => {
        const firstItem = el.subCategories.find(
          (item: some) => item.id === valueC[valueC.length - 1],
        );
        if (!isEmpty(firstItem)) {
          result = firstItem;
        }
      });
    }
    return result?.name;
  };

  const handleActionRemoveField = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    handleRemoveField();
    e.stopPropagation();
    e.preventDefault();
  };

  const lengthList = () => {
    let result = 0;
    listItemC.forEach((el: some) => {
      result += el.subCategories.length;
    });
    return result;
  };

  const content = (
    <>
      <div className='header-select'>
        <Checkbox
          checked={valueC.length === lengthList()}
          onChange={onChange}
          className='check-box'
        />
        Chọn tất cả
      </div>
      <div className='content-select'>
        {listItemC.map((el: some) => {
          if (isEmpty(el.subCategories)) return null;
          return (
            <div key={el.id}>
              <div style={{ padding: '12px 24px 6px', fontWeight: 500 }}>{el.name}</div>
              {el?.subCategories.map((item: some) => (
                <div className='item-select' key={`sub-${item.id}`}>
                  <Checkbox
                    checked={valueC.includes(item.id)}
                    className='check-box check-box-item'
                    onChange={(e) => onChangeItem(e, item.id)}
                  >
                    {item.name}
                  </Checkbox>
                </div>
              ))}
            </div>
          );
        })}
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

export default PopoverSelectSubGroup;
