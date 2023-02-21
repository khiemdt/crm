import { Button, Form, Select } from 'antd';
import Input from 'antd/lib/input/Input';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { IconReset } from '~/assets';
import PopoverSelectCA from '~/components/popover/PopoverSelectCA';
import { AllowAgentType } from '~/features/systems/systemSlice';
import { some, TIME_OUT_QUERY_API_FLIGHT_SEARCH } from '~/utils/constants/constant';
import { removeFieldEmptyFilter } from '~/utils/helpers/helpers';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';
import { fetFlightBookingOffline } from '../../flightSlice';
import {
  defaultBookingOfflineFilterValue,
  FLIGHT_BOOKING_OFFLINE_STATUS,
  listFilterDefault,
} from '../constant';
import DateRangeSelected from './DateRangeSelected';

let timeoutSearch: any = null;

interface IFlightOfflineFilterProps {}

const FlightOfflineFilter: React.FunctionComponent<IFlightOfflineFilterProps> = (props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const intl = useIntl();
  let location = useLocation();

  const allowAgents: AllowAgentType[] = useAppSelector((state) => state.systemReducer.allowAgents);
  const { pagingOffline }: some = useAppSelector((state) => state.flightReducer);

  const [form] = Form.useForm();

  const handleChangeRoute = (formData: object) => {
    const searchParams = removeFieldEmptyFilter(formData);
    navigate({
      pathname: location.pathname,
      search: createSearchParams({
        ...searchParams,
        ...pagingOffline,
      }).toString(),
    });
  };

  const handleFetDataChangeField = (formData: some = {}) => {
    handleChangeRoute(formData);
    dispatch(fetFlightBookingOffline({ formData: formData, isFilter: true, ...pagingOffline }));
  };

  const handleChangeField = (key: string, values: string[] | some) => {
    form.setFieldsValue({ [key]: values });
    const formValue = { ...form.getFieldsValue(true) };
    const { bookingId, caIds, phoneNumber, paymentStatus, userId, date } = formValue;
    const formData: any = {
      caIds: key === 'caIds' ? values : caIds,
      bookingId,
      phoneNumber,
      paymentStatus,
      userId,
      createdFrom: date?.fromDate,
      createdTo: date?.toDate,
      ...pagingOffline,
    };
    handleFetDataChangeField(formData);
  };

  const handleSearch = (allValues: some) => {
    clearTimeout(timeoutSearch);
    timeoutSearch = setTimeout(() => {
      handleChangeRoute(allValues);
      dispatch(fetFlightBookingOffline({ formData: allValues, isFilter: true, ...pagingOffline }));
    }, TIME_OUT_QUERY_API_FLIGHT_SEARCH);
  };

  const handleResetFilter = () => {
    const formTemp = {
      ...defaultBookingOfflineFilterValue,
      createdFrom: undefined,
      createdTo: undefined,
      userId: undefined,
      date: undefined,
    };
    form.setFieldsValue(formTemp);
    handleFetDataChangeField(formTemp);
  };

  React.useEffect(() => {
    return () => {
      clearTimeout(timeoutSearch);
    };
  }, []);

  return (
    <div className='fl-bk-offline-filter-container'>
      <Form
        form={form}
        scrollToFirstError
        colon={false}
        hideRequiredMark
        className='filter-form-flight'
        initialValues={defaultBookingOfflineFilterValue}
        onValuesChange={(_, allValues) => {
          const { bookingId, caIds, phoneNumber, paymentStatus, userId, date } = allValues;
          const valueSearch = {
            bookingId: bookingId,
            caIds: caIds,
            phoneNumber: phoneNumber,
            paymentStatus: paymentStatus,
            userId: userId,
            createdFrom: date?.fromDate,
            createdTo: date?.toDate,
          };
          handleSearch(valueSearch);
        }}
      >
        {listFilterDefault.map((el, index: number) => (
          <Form.Item
            key={index}
            name={el.key}
            rules={el.rules || undefined}
            style={{ marginRight: 10 }}
          >
            <Input allowClear placeholder={intl.formatMessage({ id: el.name })} />
          </Form.Item>
        ))}
        <Form.Item name='paymentStatus' style={{ marginRight: 10 }}>
          <Select
            className='ant-select-selection-search'
            style={{ minWidth: 200 }}
            placeholder='Trạng thái'
            allowClear
          >
            {FLIGHT_BOOKING_OFFLINE_STATUS.map((elm: some, index: number) => {
              return (
                <Select.Option key={index} value={elm?.id}>
                  {elm?.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name='date'>
          <DateRangeSelected
            name='date'
            title='IDS_TEXT_CREATED_DATE'
            handleRemoveField={() => {
              form.resetFields(['date']);
              handleChangeField('date', {});
            }}
            defaultVisible={false}
            handleFetData={handleChangeField}
          />
        </Form.Item>
        <Form.Item
          name='caIds'
          shouldUpdate={(prevValues, curValues) => prevValues.caIds !== curValues.caIds}
        >
          <PopoverSelectCA
            listItem={allowAgents}
            value={form.getFieldValue('caIds')}
            handleSelected={(idSelecteds: string[]) => handleChangeField('caIds', idSelecteds)}
            title='IDS_TEXT_CA'
          />
        </Form.Item>
        <Button className='btn-download-clear' icon={<IconReset />} onClick={handleResetFilter} />
      </Form>
    </div>
  );
};

export default FlightOfflineFilter;
