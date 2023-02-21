import { Button } from 'antd';
import { FC } from 'react';
import { IconEmail, IconSms } from '~/assets';
import '~/features/flight/online/FlightOnline.scss';
import { some } from '~/utils/constants/constant';
import { useAppSelector } from '~/utils/hook/redux';

interface InOutBoundType {
  text: some;
  record: some;
  handelModelSMS: (dataRow: some) => void;
  handelModelEmail: (dataRow: some) => void;
}
const LastSale: FC<InOutBoundType> = (props: some) => {
  const { text, record, handelModelSMS, handelModelEmail } = props;
  const salesList = useAppSelector((state: some) => state?.flightReducer.salesList);
  return (
    <>
      <div className='lase-sale'>
        <div className='name-sale'>{`${
          text ? salesList.find((el: some) => el.id === text).name : ' '
        }`}</div>
        <div className='group-button-action group-button-action-flight-online'>
          <Button
            className='customer-btn'
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handelModelSMS(record);
            }}
          >
            <IconSms />
          </Button>
          <Button
            className='customer-btn btn-email'
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handelModelEmail(record);
            }}
          >
            <IconEmail />
          </Button>
        </div>
      </div>
    </>
  );
};
export default LastSale;
