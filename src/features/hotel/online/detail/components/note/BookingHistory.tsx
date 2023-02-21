import { message, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { getBookingHistoryLog } from '~/apis/hotel';
import { SUCCESS_CODE } from '~/features/flight/constant';
import {
  BOOKING_LOG_FIELDS,
  getFieldObjectChange,
  HOTEL_BOOKING_FIELDS,
  ROOM_BOOKING_FIELDS,
} from '~/features/hotel/constant';
import { providerStatusHotel, some } from '~/utils/constants/constant';
import { DATE_FORMAT_TIME_BACK_END } from '~/utils/constants/moment';
import { formatMoney, isEmpty } from '~/utils/helpers/helpers';
interface IBookingHistoryProps {}

const BookingHistory: React.FunctionComponent<IBookingHistoryProps> = (props) => {
  const params = useParams();

  const [dataList, setData] = React.useState<some[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const getBookingLog = async () => {
    try {
      setLoading(true);
      const { data } = await getBookingHistoryLog({ bookingId: params.id, top: 100 });
      if (data.code === SUCCESS_CODE) {
        setData(
          data?.data
            ?.filter((elm: some) => elm?.beforeChange !== elm?.afterChange)
            ?.map((elm: some) => {
              const oldContent = JSON.parse(elm?.beforeChange || {});
              const newContent = JSON.parse(elm?.afterChange || {});
              const fieldChange = getFieldObjectChange(oldContent, newContent).map(
                (elm: string) => {
                  if (elm === 'partnerBookingCode') return 'checkinCode';
                  return elm;
                },
              );
              const fieldHotelChange = getFieldObjectChange(oldContent?.hotel, newContent?.hotel);
              const fieldRoomBookingChange = newContent?.roomBookings?.map(
                (elm: some, idx: number) => {
                  return getFieldObjectChange(
                    oldContent?.roomBookings[idx],
                    newContent?.roomBookings[idx],
                  );
                },
              );

              return {
                ...elm,
                fieldChange: [...new Set(fieldChange)],
                oldContent,
                newContent,
                fieldHotelChange,
                fieldRoomBookingChange,
              };
            }) || [],
        );
      } else {
        message.error(data?.message);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getHotelBookingsLog = ({ content, fieldHotelChange }: some) => {
    return (
      <React.Fragment>
        {fieldHotelChange?.map((key: string) => {
          const value: some = HOTEL_BOOKING_FIELDS?.find((elm: some) => elm.key === key) || {};
          if (!['string', 'number'].includes(typeof content[key])) return; // must change
          if (key === 'address') {
            return (
              <React.Fragment key={key}>
                - {value?.title}:&nbsp;
                {!isEmpty(content?.address) ? content?.address?.address : 'Không có'}
              </React.Fragment>
            );
          }
          return (
            <div key={key}>
              {!isEmpty(value) && (
                <>
                  - {value?.title}:&nbsp;
                  {value?.typeValue == 'money' ? formatMoney(content[key]) : content[key]}
                </>
              )}
            </div>
          );
        })}
      </React.Fragment>
    );
  };

  const getRoomBookingsLog = ({ content, fieldRoomBookingChange }: some) => {
    return (
      <div>
        {content?.roomBookings?.map((room: some, index: number) => {
          return (
            <React.Fragment key={index}>
              {fieldRoomBookingChange[index]?.map((key: string) => {
                const value: some = ROOM_BOOKING_FIELDS?.find((elm: some) => elm.key === key) || {};
                if (key === 'freeBreakfast') {
                  return (
                    <React.Fragment key={key}>
                      - {value?.title}&nbsp;{index + 1}:&nbsp;
                      {room?.freeBreakfast ? 'Miễn phí bữa sáng' : 'Không miễn phí bữa sáng'}
                    </React.Fragment>
                  );
                }
                if (['bookingType', 'rateType'].includes(key)) {
                  <React.Fragment key={key}>
                    - {value?.title}&nbsp;{index + 1}:&nbsp;
                    {room[key]?.toUpperCase()}
                  </React.Fragment>;
                }
                return (
                  <div key={key}>
                    {!isEmpty(value) && (
                      <>
                        - {value?.title}&nbsp;{index + 1}:&nbsp;
                        {value?.typeValue == 'money' ? formatMoney(room[key]) : room[key]}
                      </>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const getLogsContent = (record: some, dataFieldKey: string) => {
    return (
      <div>
        {!isEmpty(record?.fieldChange) && (
          <>
            {record?.fieldChange?.map((key: string) => {
              const value: some = BOOKING_LOG_FIELDS?.find((elm: some) => elm.key === key) || {};
              if (!['string', 'number'].includes(typeof record[dataFieldKey][key])) {
                if (key === 'roomBookings') {
                  return (
                    <div key={key}>
                      {getRoomBookingsLog({
                        content: record[dataFieldKey],
                        fieldRoomBookingChange: record?.fieldRoomBookingChange,
                      })}
                    </div>
                  );
                }
                if (key === 'hotel') {
                  return (
                    <div key={key}>
                      {getHotelBookingsLog({
                        content: record[dataFieldKey]?.hotel,
                        fieldHotelChange: record?.fieldHotelChange,
                      })}
                    </div>
                  );
                }
                if (key === 'cancelPolicies') {
                  return (
                    <>
                      {!isEmpty(record[dataFieldKey]?.cancelPolicies) ? (
                        <>
                          {record[dataFieldKey]?.cancelPolicies.map((elm: any) => {
                            return (
                              <ul key={key}>
                                <li>{elm}</li>
                              </ul>
                            );
                          })}
                        </>
                      ) : null}
                    </>
                  );
                }
                return;
              } else {
                if (key === 'providerStatus') {
                  return (
                    <div key={key}>
                      - {value?.title}:&nbsp;
                      {
                        providerStatusHotel?.find(
                          (elm: some) => elm.id === record[dataFieldKey][key],
                        )?.name
                      }
                    </div>
                  );
                }
                return (
                  <div key={key}>
                    - {value?.title}:&nbsp;
                    {value?.typeValue == 'money'
                      ? formatMoney(record[dataFieldKey][key])
                      : record[dataFieldKey][key]}
                  </div>
                );
              }
            })}
          </>
        )}
      </div>
    );
  };

  const columns: ColumnsType<some> = [
    {
      title: 'Người xử lý',
      key: 'bookingId',
      render: (_, record) => {
        return (
          <div>
            {record?.created && (
              <div>{`${moment(record?.created).format(DATE_FORMAT_TIME_BACK_END)}`}</div>
            )}
            <span style={{ color: '#007864' }}>{record?.sale?.name}</span>
          </div>
        );
      },
    },
    {
      title: 'Nội dung cũ',
      key: 'oldContent',
      render: (_, record) => {
        return <>{getLogsContent(record, 'oldContent')}</>;
      },
    },
    {
      title: 'Nội dung mới',
      key: 'newContent',
      render: (_, record) => {
        return <>{getLogsContent(record, 'newContent')}</>;
      },
    },
  ];

  React.useEffect(() => {
    getBookingLog();
  }, []);

  return (
    <Table
      rowKey={(record) => record.id}
      columns={columns}
      dataSource={dataList}
      loading={loading}
      pagination={false}
      style={{ minHeight: 400 }}
    />
  );
};

export default BookingHistory;
