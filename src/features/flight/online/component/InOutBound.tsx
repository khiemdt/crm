import '~/features/flight/online/FlightOnline.scss';
import { useAppSelector } from '~/utils/hook/redux';
import { AirlinesType } from '~/features/systems/systemSlice';
import '~/features/flight/online/FlightOnline.scss';
import { isEmpty } from '~/utils/helpers/helpers';
import { some } from '~/utils/constants/constant';
import { FC } from 'react';

interface InOutBoundType {
  record: some;
}
const InOutBound: FC<InOutBoundType> = (props: some) => {
  const { record } = props;
  const airlines: AirlinesType[] = useAppSelector((state) => state.systemReducer.airlines);

  const getIcon = (airlineId: number) => {
    const item = airlines.find((el) => el?.id === airlineId);
    return item?.logo || '';
  };

  const getLocationName = () => {
    let result = `${record?.outbound?.fromAirport} -> ${record?.outbound?.toAirport}`;
    if (record.isTwoWay) {
      result += ` -> ${record?.inbound?.toAirport}`;
    }
    return result;
  };

  return (
    <div className='in-out-container'>
      <div className='list-icon-airline'>
        {!isEmpty(getIcon(record?.outbound?.airlineId)) && (
          <img src={getIcon(record?.outbound?.airlineId)} alt='' className='icon-airline' />
        )}
        {record.isTwoWay && !isEmpty(getIcon(record?.inbound?.airlineId)) && (
          <img
            src={getIcon(record?.inbound?.airlineId)}
            alt=''
            className='icon-airline icon-airline-right'
          />
        )}
      </div>
      <span className='name-location'>{getLocationName()}</span>
    </div>
  );
};
export default InOutBound;
