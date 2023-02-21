import { message, Select } from 'antd';
import { useIntl } from 'react-intl';
import { assignFlightOfflineBooking } from '~/apis/flight';
import { some } from '~/utils/constants/constant';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';
import { SUCCESS_CODE } from '../../constant';
import { fetFlightBookingOffline } from '../../flightSlice';

interface SelectHandlerProps {
  handlerInfo: any;
  bookingId: number;
}

const SelectHandler: React.FC<SelectHandlerProps> = ({ bookingId, handlerInfo }) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const { pagingOffline, filterOffline }: some = useAppSelector((state) => state.flightReducer);

  const salesList: some[] = useAppSelector((state) => state.flightReducer.salesList);

  const handleReassignBooking = async (value: { value: string; label: React.ReactNode }) => {
    try {
      const { data } = await assignFlightOfflineBooking({
        id: bookingId,
        handlerInfo: { email: null, fullName: null, saleId: Number(value?.value) },
      });
      if (data.code === SUCCESS_CODE) {
        message.success(
          `${intl.formatMessage({ id: 'IDS_TEXT_HANDED_OVER_TO' }, { value: value?.label })}`,
        );
        dispatch(
          fetFlightBookingOffline({
            formData: filterOffline,
            isFilter: false,
            paging: pagingOffline,
          }),
        );
      } else {
        message.error(data?.message);
      }
    } catch (error) {}
  };

  return (
    <Select
      showSearch
      onClick={(e) => e.stopPropagation()}
      style={{ width: 200 }}
      placeholder='Tìm kiếm'
      optionFilterProp='children'
      defaultValue={handlerInfo}
      onChange={handleReassignBooking}
      labelInValue
    >
      {salesList?.map((elm: some, index: number) => {
        return (
          <Select.Option key={index} value={elm?.id?.toString()}>
            {elm?.name}
          </Select.Option>
        );
      })}
    </Select>
  );
};

export default SelectHandler;
