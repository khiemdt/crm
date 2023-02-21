import { Col, Row, Tooltip } from 'antd';
import moment from 'moment';
import 'moment/locale/vi';
import { useState } from 'react';
import { IconArrow } from '~/assets';
import { UserInfo } from '~/components/Layout/LeftSideBar';
import { FORMAT_DAYS, TYPE_TICKET_INFO } from '~/features/flight/constant';
import FromUpdateCode from '~/features/flight/online/detail/components/detailBookingInfo/form/FromUpdateCode';
import { AirlinesType } from '~/features/systems/systemSlice';
import { some } from '~/utils/constants/constant';
import {
  C_DATE_FORMAT,
  DATE_FORMAT_BACK_END,
  DATE_FORMAT_DAY,
  DATE_FORMAT_FRONT_END,
} from '~/utils/constants/moment';
import { useAppSelector } from '~/utils/hook/redux';
import FormInboundCode from './form/FormInboundCode';
import FormOutboundCode from './form/FormOutboundCode';
import ModalFindTickets from './modal/ModalFindTickets';
import ModalOriginTicket from './modal/ModalOriginTicket';
import ModalRebookTicket from './modal/ModalRebookTicket';
import ModalUpdateFlightPNRCode from './modal/ModalUpdateFlightPNRCode';

const getBaggage = (booking: some, key: 'outboundBaggage' | 'inboundBaggage') => {
  return booking?.guests
    ?.map((val: some) => {
      let arrayGuests: some[] = [];
      val?.[key]?.weight && arrayGuests?.push(val?.[key]);
      return arrayGuests;
    })
    ?.flat();
};

const getFormatDay = (date: string) => FORMAT_DAYS[new Date(date).getDay()];
const getExtraTime = (arrivalDate: string, departureDate: string) => {
  const extraTime =
    Number(moment(arrivalDate, DATE_FORMAT_BACK_END)?.format('DD')) -
    Number(moment(departureDate, DATE_FORMAT_BACK_END)?.format(DATE_FORMAT_DAY));
  return extraTime !== 0 ? `(+${extraTime}d)` : null;
};

const BookingInfo = () => {
  const booking = useAppSelector((state) => state.flightReducer.flightOnlineDetail);
  const userInfo: UserInfo = useAppSelector((state) => state.systemReducer.userInfo);
  const airlines: AirlinesType[] = useAppSelector((state) => state.systemReducer.airlines);
  const [modalRebookTicket, setModalRebookTicket] = useState<boolean>(false);
  const [modalFindTickets, setModalFindTickets] = useState<some>({
    open: false,
    data: null,
  });
  const [modalOriginTicket, setModalOriginTicket] = useState<boolean>(false);
  const [updateFlightPNRCode, setUpdateFlightPNRCode] = useState<string>('');
  const generalInfo = useAppSelector((state) => state.flightReducer.generalInfo);

  const getIcon = (airlineId: number) => {
    const item = airlines.find((el) => el?.id === airlineId);
    return item?.logo || '';
  };
  const departureInfo = booking?.departureInfo;
  const returnInfo = booking?.returnInfo;
  return (
    <div className='booking-info'>
      <Row gutter={12} className='contact-info-box'>
        <Col span={24}>
          {booking?.outbound && <FormOutboundCode generalInfo={generalInfo} />}
          {departureInfo?.flights?.map((val: some, index: number) => {
            return (
              <div key={index} style={{ marginLeft: booking?.outbound && 32, marginBottom: 16 }}>
                <Row className='info-airline'>
                  <Col className='air-box' style={{ width: 110 }}>
                    <Tooltip title={val?.airlineName}>
                      <img src={getIcon(val?.airlineId)} className='icon-airline' alt='' />
                    </Tooltip>
                    <b>{val?.fromAirport} </b> - <b>{val?.toAirport} </b>
                  </Col>
                  <Col className='air-box'>
                    <b
                      onClick={() => {
                        setModalFindTickets({
                          open: true,
                          data: val,
                        });
                      }}
                      style={{ minWidth: 50 }}
                      className='text-blue'
                    >
                      {val?.flightCode}
                    </b>
                    {val?.airlineClassCode && (
                      <span className='text-airline-code'>{val?.airlineClassCode}</span>
                    )}
                    <span>
                      {`${getFormatDay(
                        moment(booking?.outbound?.departureDate, DATE_FORMAT_BACK_END).format(
                          C_DATE_FORMAT,
                        ),
                      )}, ${moment(val?.departureDate, DATE_FORMAT_FRONT_END).format(
                        DATE_FORMAT_FRONT_END,
                      )}`}
                    </span>
                    <span>{val?.departureTime}</span> <IconArrow />
                    <span>{val?.arrivalTime}</span>
                    <span className='text-success'>
                      {getExtraTime(val?.arrivalDate, val?.departureDate)}{' '}
                    </span>
                    {/* {getBaggage(booking, 'outboundBaggage')?.map(
                      (baggage: number | some[number], indexBaggage: number) => {
                        return (
                          <Tooltip placement='top' title={baggage?.description} key={indexBaggage}>
                            <span className='text-white text-baggage'>{baggage?.weight}kg</span>
                          </Tooltip>
                        );
                      },
                    )} */}
                  </Col>

                  <Col className='air-box no-gap'>
                    <FromUpdateCode
                      index={index}
                      type={TYPE_TICKET_INFO?.DEPARTURE}
                      flightPNR={val?.flightPNR}
                    />
                  </Col>
                </Row>
              </div>
            );
          })}
          {booking?.inbound && <FormInboundCode generalInfo={generalInfo} />}
          {returnInfo?.flights?.map((val: some, index: number) => {
            return (
              <div key={index} style={{ marginLeft: booking?.inbound && 32, marginBottom: 16 }}>
                <Row className='info-airline'>
                  <Col className='air-box' style={{ width: 110 }}>
                    <img src={getIcon(val?.airlineId)} alt='' className='icon-airline' />
                    <b>{val?.fromAirport} </b> - <b>{val?.toAirport} </b>
                  </Col>
                  <Col className='air-box'>
                    <b
                      onClick={() => {
                        setModalFindTickets({
                          open: true,
                          data: val,
                        });
                      }}
                      style={{ minWidth: 50 }}
                      className='text-blue'
                    >
                      {val?.flightCode}
                    </b>
                    {/* <span className='text-grey text-sm'>{booking?.inboundAgentId}</span> */}
                    {val?.airlineClassCode && (
                      <span className='text-airline-code'>{val?.airlineClassCode}</span>
                    )}
                    <span>
                      {`${getFormatDay(
                        moment(booking?.inbound?.departureDate, DATE_FORMAT_BACK_END).format(
                          C_DATE_FORMAT,
                        ),
                      )}, ${moment(val?.departureDate, DATE_FORMAT_FRONT_END).format(
                        DATE_FORMAT_FRONT_END,
                      )}`}
                    </span>
                    <span>{val?.departureTime}</span> <IconArrow />
                    <span>{val?.arrivalTime}</span>
                    <span className='text-grey'>
                      {getExtraTime(val?.arrivalDate, val?.departureDate)}
                    </span>
                    {/* {getBaggage(booking, 'inboundBaggage')?.map(
                      (baggage: number | some[number], indexBaggage: number) => {
                        return (
                          <Tooltip placement='top' title={baggage?.description} key={indexBaggage}>
                            <span className='text-white text-baggage'>{baggage?.weight}kg</span>
                          </Tooltip>
                        );
                      },
                    )} */}
                  </Col>

                  <Col className='air-box'>
                    <FromUpdateCode
                      index={index}
                      type={TYPE_TICKET_INFO?.RETURN}
                      flightPNR={val?.flightPNR}
                    />
                  </Col>
                </Row>
              </div>
            );
          })}
        </Col>
      </Row>
      <ModalFindTickets
        data={modalFindTickets.data}
        modal={modalFindTickets.open}
        setModal={setModalFindTickets}
      />
      <ModalOriginTicket modal={modalOriginTicket} setModal={setModalOriginTicket} />
      <ModalRebookTicket modal={modalRebookTicket} setModal={setModalRebookTicket} />
      <ModalUpdateFlightPNRCode modal={updateFlightPNRCode} setModal={setUpdateFlightPNRCode} />
    </div>
  );
};
export default BookingInfo;
