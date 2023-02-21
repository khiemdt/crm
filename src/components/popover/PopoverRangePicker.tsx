import { Popover, Button, Form } from 'antd';

import '~/components/popover/PopoverSelect.scss';
import { FC, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { isEmpty } from '~/utils/helpers/helpers';
import { IconCloseNoneCycleSmall, IconCloseNoneCycleWhite } from '~/assets';
import Calendar from '../calendar/Calendar';
import moment, { Moment } from 'moment';
import { listFilterAddFlight } from '~/utils/constants/dataOptions';
import { PopoverRangePickerProps } from '~/components/popover/Modal';

const PopoverRangePicker: FC<PopoverRangePickerProps> = ({
  trigger = 'click',
  placement = 'bottomLeft',
  title = '',
  handleRemoveField = () => {},
  defaultVisible = false,
  name = '',
  handleFetData = () => {},
  listFilterAdd = [],
}) => {
  const form = Form.useFormInstance();
  const intl = useIntl();
  const [visible, setVisible] = useState(defaultVisible);
  const [startDate, setStartDate] = useState<Moment | null>(null);
  const [endDate, setEndDate] = useState<Moment | null>(null);

  useEffect(() => {
    const keys: string[] = getItemAddFields(name)?.keys || [];
    if (!isEmpty(form.getFieldValue(name))) {
      setStartDate(moment(form.getFieldValue(name)[keys[0]], 'DD-MM-YYYY'));
      setEndDate(moment(form.getFieldValue(name)[keys[1]], 'DD-MM-YYYY'));
    }
  }, [visible]);

  const getValue = () => {
    let result = '';
    const keys: string[] = getItemAddFields(name)?.keys || [];
    if (!isEmpty(form.getFieldValue(name))) {
      result = `${moment(form.getFieldValue(name)[keys[0]], 'DD-MM-YYYY').format(
        'DD/M/YYYY',
      )} - ${moment(form.getFieldValue(name)[keys[1]], 'DD-MM-YYYY').format('DD/M/YYYY')}`;
    }
    return result;
  };

  const setFormValue = () => {
    setVisible(false);
    setTimeout(() => {
      const keys: string[] = getItemAddFields(name)?.keys || [];
      form.setFieldsValue({
        [name]: {
          [keys[0]]: startDate?.format('DD-MM-YYYY'),
          [keys[1]]: endDate?.format('DD-MM-YYYY'),
        },
      });
      handleFetData({
        ...form.getFieldsValue(true),
        [name]: {
          [keys[0]]: startDate?.format('DD-MM-YYYY'),
          [keys[1]]: endDate?.format('DD-MM-YYYY'),
        },
      });
    }, 100);
  };

  const getItemAddFields = (key: string) => {
    return listFilterAdd.find((el) => el.key === key);
  };

  const content = (
    <div className='content-popover-input content-popover-range-picker'>
      <Calendar
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
      <Button
        type='primary'
        className='btn-ok'
        onClick={setFormValue}
        disabled={isEmpty(startDate) || isEmpty(endDate)}
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
        {!isEmpty(getValue()) && <span className='first-name'>{getValue()}</span>}
        {visible ? (
          <IconCloseNoneCycleWhite style={{ marginLeft: 8 }} onClick={handleActionRemoveField} />
        ) : (
          <IconCloseNoneCycleSmall style={{ marginLeft: 8 }} onClick={handleActionRemoveField} />
        )}
      </Button>
    </Popover>
  );
};

export default PopoverRangePicker;
