import { Button, Form, Popover } from 'antd';

import moment, { Moment } from 'moment';
import { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { IconCloseNoneCycle, IconCloseNoneCycleWhite, IconCalendar } from '~/assets';
import CalendarHome from '~/components/calendar/Calendar';
import '~/components/popover/PopoverSelect.scss';
import { some } from '~/utils/constants/constant';
import { DATE_FORMAT_BACK_END, DATE_FORMAT_FRONT_END } from '~/utils/constants/moment';
import { isEmpty } from '~/utils/helpers/helpers';

interface DateRangeSelectedProps {
  title?: string;
  name: string;
  handleRemoveField?: Function;
  handleFetData?: Function;
  defaultVisible: boolean;
}

const DateRangeSelected: FC<DateRangeSelectedProps> = ({
  title = '',
  defaultVisible = false,
  name = 'date',
  handleRemoveField,
  handleFetData,
}) => {
  const form = Form.useFormInstance();
  const intl = useIntl();
  const [visible, setVisible] = useState(defaultVisible);
  const [startDate, setStartDate] = useState<Moment | null>(null);
  const [endDate, setEndDate] = useState<Moment | null>(null);
  const date: some = Form.useWatch('date', form);

  console.log('form.getFieldValue(name)', form.getFieldsValue(true), date);
  const getValue = () => {
    let result = '';
    if (!isEmpty(form.getFieldValue(name))) {
      result = `${moment(form.getFieldValue(name)[`fromDate`], DATE_FORMAT_BACK_END).format(
        DATE_FORMAT_FRONT_END,
      )} - ${moment(form.getFieldValue(name)[`toDate`], DATE_FORMAT_BACK_END).format(
        DATE_FORMAT_FRONT_END,
      )}`;
    }
    return result;
  };

  const setFormValue = () => {
    setVisible(false);
    form.setFieldsValue({
      [name]: {
        fromDate: startDate?.format(DATE_FORMAT_BACK_END),
        toDate: endDate?.format(DATE_FORMAT_BACK_END),
      },
    });
    handleFetData &&
      handleFetData(name, {
        fromDate: startDate?.format(DATE_FORMAT_BACK_END),
        toDate: endDate?.format(DATE_FORMAT_BACK_END),
      });
  };

  const handleActionRemoveField = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    handleRemoveField && handleRemoveField();
    e.stopPropagation();
    e.preventDefault();
  };

  const content = (
    <div className='content-popover-input content-popover-range-picker'>
      <CalendarHome
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

  useEffect(() => {
    if (!isEmpty(form.getFieldValue(name))) {
      setStartDate(moment(form.getFieldValue(name)[`fromDate`], DATE_FORMAT_BACK_END));
      setEndDate(moment(form.getFieldValue(name)[`toDate`], DATE_FORMAT_BACK_END));
    }
  }, [visible]);

  return (
    <Popover
      trigger='click'
      placement='bottomLeft'
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
        {!isEmpty(form.getFieldValue(name)) ? (
          visible ? (
            <IconCloseNoneCycleWhite style={{ marginLeft: 8 }} onClick={handleActionRemoveField} />
          ) : (
            <IconCloseNoneCycle style={{ marginLeft: 8 }} onClick={handleActionRemoveField} />
          )
        ) : (
          <IconCalendar style={{ marginLeft: 8, fill: '#fff' }} />
        )}
      </Button>
    </Popover>
  );
};

export default DateRangeSelected;
