import { Popover, Input, Button, Form } from 'antd';

import '~/components/popover/PopoverSelect.scss';
import { FC, useState, useEffect } from 'react';

import { useIntl } from 'react-intl';
import { isEmpty } from '~/utils/helpers/helpers';
import { IconCloseNoneCycleSmall, IconCloseNoneCycleWhite } from '~/assets';
import { PopoverInputProps } from '~/components/popover/Modal';

const PopoverInput: FC<PopoverInputProps> = ({
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
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(form.getFieldValue(name));
  }, [visible]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const setFormValue = () => {
    setVisible(false);
    setTimeout(() => {
      form.setFieldsValue({ [name]: value });
      handleFetData({
        ...form.getFieldsValue(true),
        [name]: !isEmpty(value) ? value : undefined,
      });
    }, 100);
  };

  const content = (
    <div className='content-popover-input'>
      <Input
        value={value}
        allowClear
        placeholder={intl.formatMessage({ id: title })}
        onChange={onChange}
      />
      <Button type='primary' className='btn-ok' onClick={setFormValue} disabled={isEmpty(value)}>
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
        <span className='first-name'>{form.getFieldValue(name)}</span>
        {visible ? (
          <IconCloseNoneCycleWhite style={{ marginLeft: 8 }} onClick={handleActionRemoveField} />
        ) : (
          <IconCloseNoneCycleSmall style={{ marginLeft: 8 }} onClick={handleActionRemoveField} />
        )}
      </Button>
    </Popover>
  );
};

export default PopoverInput;
