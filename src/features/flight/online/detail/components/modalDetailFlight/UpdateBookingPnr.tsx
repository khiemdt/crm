import {
  Alert,
  Button,
  Col,
  Divider,
  message,
  Modal,
  Radio,
  RadioChangeEvent,
  Row,
  Spin,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  fetchPatchBookingInfoByReservation,
  validateBookingInfoByReservation,
} from '~/apis/flight';
import Loading from '~/components/loading/Loading';
import { MODAL_KEY_MENU } from '~/features/flight/constant';
import { fetFlightBookingsDetail } from '~/features/flight/flightSlice';
import { listFlightFormatName } from '~/features/flight/offline/constant';
import { some } from '~/utils/constants/constant';
import { listAgeCategory, listGender } from '~/utils/constants/dataOptions';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';

interface Props {
  modal: boolean;
  setModal: any;
  data?: some[];
  type: string;
}

const UpdateBookingPnr: React.FC<Props> = (props) => {
  const booking = useAppSelector((state) => state.flightReducer.flightOnlineDetail);
  const { modal, setModal, data, type } = props;
  const listNames: some = listFlightFormatName;
  const dispatch = useAppDispatch();

  const [typeModal, setTypeModal] = useState<string>(type);
  const [isOutbound, setIsOutbound] = useState<boolean>(true);
  const [errMes, setErrMes] = useState<any>(null);
  const [diff, setDiff] = useState<some>({
    diff: [],
    key: null,
  });

  const [isLoading, setLoading] = useState(false);
  const handleClose = () => {
    setModal(false);
  };

  const handleChange = (e: RadioChangeEvent) => {
    setIsOutbound(e.target.value);
  };

  const retrievePnrAndCompare = async (queryParams: some) => {
    setLoading(true);
    try {
      const { data } = await validateBookingInfoByReservation(queryParams);
      if (data.code === 200) {
        const { key, differences } = data.data;
        setTypeModal(MODAL_KEY_MENU.UPDATE_BOOKING_PNR);
        setDiff({
          key: key,
          diff: differences,
        });
      } else {
        setErrMes(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const patchBookingInfoByReservation = async (queryParams: some) => {
    setLoading(true);
    try {
      const { data } = await fetchPatchBookingInfoByReservation(queryParams);
      if (data.code === 200) {
        message.success(data.message);
        setModal(false);
        dispatch(fetFlightBookingsDetail({ filters: { dealId: booking.id } }));
      } else {
        if (data.code === 1502) {
          message.error('Hết thời gian, vui lòng bấm cập nhật đơn hàng theo PNR lại');
          dispatch(fetFlightBookingsDetail({ filters: { dealId: booking.id } }));
        } else {
          message.error(data.message);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const formatValueFactor = (title: some, stt: string) => {
    let result: string = '';
    if (title.fromAirport && stt == 'TicketValidator') {
      result = `${title.fromAirport} - ${title.toAirport}`;
      return result;
    }
    if (title.fromAirport) {
      result = `Hành trình ${title.fromAirport} - ${title.toAirport}`;
    }
    if (title.fromAirport && (title.ageCategory || title.firstName)) {
      result = `${result} ;`;
    }
    if (title.ageCategory || title.firstName) {
      result = `${result} 
      ${formatAgeCategory(title.ageCategory)}
        ${title.lastName}
        ${title.firstName}`;
    }
    return result;
  };

  const formatAgeCategory = (stt: string) => {
    return listAgeCategory.find((el: some) => el.code == stt)?.name || 'Không có';
  };

  const formatValue = (value: any, name: any) => {
    switch (value) {
      case 'gender':
        return formatGender(name);
      default:
        return name ? name : 'Không có';
    }
  };
  const formatGender = (params: string) => {
    return listGender.find((el) => el.code == params)?.name || 'Không rõ';
  };

  const renderClass = (arr: some[], key: string) => {
    const ar = Object.keys(arr);
    if (ar.length) {
      if (
        ar.some(function (el) {
          return el == key;
        })
      ) {
        return 'text-danger text-bold';
      }
    } else {
      return '';
    }
  };

  const errMesContent = <p className='text-danger'>{errMes} </p>;
  const beforeUploadContent = (
    <div>
      <Row>
        <Radio.Group onChange={handleChange} value={isOutbound}>
          <Radio value={true}> Chiều đi </Radio>
          <Radio value={false}> Chiều về </Radio>
        </Radio.Group>
      </Row>
      <Row className='wrapperSubmitSms'>
        <Button onClick={handleClose}>
          <FormattedMessage id='IDS_TEXT_SKIP' />
        </Button>
        <Button
          loading={isLoading}
          type='primary'
          onClick={() => {
            retrievePnrAndCompare({
              bookingId: booking.id,
              pnr: isOutbound ? booking.outboundPnrCode : booking.inboundPnrCode,
            });
          }}
        >
          <FormattedMessage id='IDS_TEXT_ACCEPT' />
        </Button>
      </Row>
    </div>
  );

  const emptyContent = (
    <div>
      <span className='text-warning'>Đơn hàng không có sự thay đổi về thông tin mặt vé!</span>
    </div>
  );

  const mainContent = (
    <div>
      <Row gutter={12}>
        <Col span={8}>
          <b>Trường thông tin </b>
        </Col>
        <Col span={8}>
          <b>Giá trị trên hệ thống </b>
        </Col>
        <Col span={8}>
          <b>Giá trị từ hãng</b>
        </Col>
      </Row>
      {diff?.diff.map((item: some, idx: number) => (
        <div key={idx}>
          {item?.diffComponents?.map((el: some, indx: number) => (
            <Row gutter={12} key={indx}>
              <Divider style={{ margin: '12px 0px' }} />
              <Col span={6}>
                <div>
                  <b className='text-success'>{listNames[item?.factor]} </b>
                </div>
                <span>{formatValueFactor(el?.factorDetail, item?.factor)} </span>
              </Col>
              <Col span={9}>
                {el?.from &&
                  Object.keys(el?.from).map((ele: any) => (
                    <div key={ele} className={renderClass(el.diffs, ele)}>
                      {`${listNames[ele]}:  ${formatValue(ele, el.from[ele])}`}
                    </div>
                  ))}
                {el.result == 'MISS_FROM_OBJECT' && (
                  <p className='text-warning'>Không lấy được thông tin</p>
                )}
              </Col>
              <Col span={9}>
                {el?.to &&
                  Object.keys(el?.to).map((ele) => (
                    <div key={ele} className={renderClass(el?.diffs, ele)}>
                      {`${listNames[ele]}:  ${formatValue(ele, el?.to[ele])}`}
                    </div>
                  ))}
                {el.result == 'MISS_TO_OBJECT' && (
                  <p className='text-warning'>Không lấy được thông tin</p>
                )}
              </Col>
            </Row>
          ))}
        </div>
      ))}
      <Row className='wrapperSubmitSms'>
        <Button onClick={handleClose}>
          <FormattedMessage id='IDS_TEXT_SKIP' />
        </Button>
        <Button
          loading={isLoading}
          onClick={() => {
            patchBookingInfoByReservation({
              bookingId: booking.id,
              pnr: isOutbound ? booking.outboundPnrCode : booking.inboundPnrCode,
              key: diff.key,
            });
          }}
          type='primary'
        >
          <FormattedMessage id='IDS_TEXT_UPDATE' />
        </Button>
      </Row>
    </div>
  );

  const getContent = () => {
    if (errMes) {
      return errMesContent;
    }
    if (typeModal == MODAL_KEY_MENU.UPDATE_BOOKING_PNR_BEFORE) {
      return beforeUploadContent;
    }
    if (!diff?.diff?.length && !isLoading) {
      return emptyContent;
    }
    if (diff?.diff?.length) {
      return mainContent;
    }
    return (
      <Spin tip='Loading...'>
        <div style={{ height: 200 }}></div>
      </Spin>
    );
  };

  useEffect(() => {
    if (typeModal == MODAL_KEY_MENU.UPDATE_BOOKING_PNR && booking) {
      retrievePnrAndCompare({ bookingId: booking?.id, pnr: booking.outboundPnrCode });
    }
  }, [booking]);

  return (
    <Modal
      className='wrapperModal modal-add-additions'
      visible={modal}
      onCancel={handleClose}
      footer={null}
      width={typeModal == MODAL_KEY_MENU.UPDATE_BOOKING_PNR_BEFORE ? 500 : 900}
      title={
        typeModal == MODAL_KEY_MENU.UPDATE_BOOKING_PNR_BEFORE
          ? 'Chọn chiều muốn cập nhật'
          : 'Xác nhận thông tin đơn hàng thay đổi theo PNR'
      }
    >
      {getContent()}
    </Modal>
  );
};

export default UpdateBookingPnr;
