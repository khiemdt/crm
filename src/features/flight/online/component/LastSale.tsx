import { Button } from 'antd';
import { FC } from 'react';
import { IconEmail, IconSms } from '~/assets';
import '~/features/flight/online/FlightOnline.scss';
import { some } from '~/utils/constants/constant';

interface InOutBoundType {
  text: some;
  record: some;
  handelModelSMS: (dataRow: some) => void;
  handelModelEmail: (dataRow: some) => void;
}
const LastSale: FC<InOutBoundType> = (props: some) => {
  const { text, record, handelModelSMS, handelModelEmail } = props;

  return (
    <>
      <div className='lase-sale'>
        <div className='name-sale'>{`${text ? text : ' '}`}</div>
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
