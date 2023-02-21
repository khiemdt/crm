import { Popover, Button, Form, Radio, Space } from 'antd';
import type { RadioChangeEvent } from 'antd';

import '~/components/popover/PopoverSelect.scss';
import { FC, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { isEmpty } from '~/utils/helpers/helpers';
import { IconCloseNoneCycleSmall, IconCloseNoneCycleWhite } from '~/assets';
import { PopoverRadioProps } from '~/components/popover/Modal';

const PopoverRadio: FC<PopoverRadioProps> = ({
  trigger = 'click',
  placement = 'bottomLeft',
  title = '',
  handleRemoveField = () => {},
  defaultVisible = false,
  name = '',
  options = [],
  handleFetData = () => {},
}) => {
  const form = Form.useFormInstance();
  const intl = useIntl();
  const [visible, setVisible] = useState(defaultVisible);
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(form.getFieldValue(name));
  }, [visible]);

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  const setFormValue = () => {
    setVisible(false);
    setTimeout(() => {
      form.setFieldsValue({ [name]: value });
      handleFetData({
        ...form.getFieldsValue(true),
        [name]: value,
      });
    }, 100);
  };

  const getNameValueSelected = () => {
    const itemSelected = options.find((el) => el.id === form.getFieldValue(name));
    return itemSelected?.name;
  };

  const content = (
    <div className='content-popover-input content-popover-radio'>
      <Radio.Group onChange={onChange} value={value}>
        <Space direction='vertical'>
          {options.map((el) => (
            <Radio key={el.name} value={el.id}>
              {el.name}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
      <Button
        type='primary'
        className='btn-ok btn-ok-radio'
        onClick={setFormValue}
        disabled={isEmpty(value)}
      >
        {intl.formatMessage({ id: 'IDS_TEXT_OK' })}
      </Button>
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
        <span className='first-name'>{getNameValueSelected()}</span>
        {visible ? (
          <IconCloseNoneCycleWhite style={{ marginLeft: 8 }} onClick={handleActionRemoveField} />
        ) : (
          <IconCloseNoneCycleSmall style={{ marginLeft: 8 }} onClick={handleActionRemoveField} />
        )}
      </Button>
    </Popover>
  );
};

export default PopoverRadio;
