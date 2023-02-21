import { Col, Row } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import moment from 'moment';
import * as React from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/scss/image-gallery.scss';
import { listFlightFormatName } from '~/features/flight/offline/constant';
import '~/features/flight/online/detail/FlightDetail.scss';
import { some } from '~/utils/constants/constant';
import { listAgeCategory, listGender } from '~/utils/constants/dataOptions';
import { DATE_TIME_FORMAT } from '~/utils/constants/moment';
import { isEmpty } from '~/utils/helpers/helpers';

interface Props {
  type: string;
  onClose: () => void;
  data: some;
}

const WorkLogDetailModal: React.FunctionComponent<Props> = ({ data, type, onClose }) => {
  const [handleBeforeResult, setHandleBefore] = React.useState<any[]>([]);
  const [handleAfterResult, setHandleAfter] = React.useState<any[]>([]);
  const listNames: some = listFlightFormatName;
  const handleWorkLog = () => {
    if (isEmpty(data?.beforeChange) || isEmpty(data?.afterChange)) {
      return;
    }
    const before = JSON.parse(data?.beforeChange);
    const after = JSON.parse(data?.afterChange);
    let result = [];
    switch (typeof after) {
      case 'string':
        setHandleBefore([
          {
            value: '',
            name: before,
          },
        ]);
        setHandleAfter([
          {
            value: '',
            name: after,
          },
        ]);
      case 'object':
        if (before?.length) {
          result = diffValueFormat(before, after);
        } else {
          result = diffValueFormat([before], [after]);
        }
        setHandleBefore(result[0]);
        setHandleAfter(result[1]);
      default:
        break;
    }
  };

  const diffValueFormat = (be: some, aff: some) => {
    const handleBefore: any[] = [];
    const handleAfter: any[] = [];
    be?.forEach((ele: some, index: number) => {
      Object.keys(ele)?.forEach((el: string) => {
        if (
          JSON.stringify(aff[index][el]) != undefined &&
          JSON.stringify(be[index][el]) != undefined &&
          JSON.stringify(aff[index][el]) != JSON.stringify(be[index][el])
        ) {
          console.log(be[index][el]);

          if (listNames[el]) {
            if (
              el == 'GuestValidateResult' ||
              el == 'TicketValidateResult' ||
              el == 'BookingBaggageValidateResult'
            ) {
              handleBefore.push({
                value: listNames[el],
                info: formatObjValid(be[index][el]),
                name: forMatNameTriPNR(be[index][el]),
              });
              handleAfter.push({
                value: listNames[el],
                info: formatObjValid(aff[index][el]),
                name: forMatNameTriPNR(aff[index][el]),
              });
            } else {
              handleBefore.push({
                value: listNames[el],
                name: formatValue(el, be[index][el]),
              });
              handleAfter.push({
                value: listNames[el],
                name: formatValue(el, aff[index][el]),
              });
            }
          }
        }
      });
    });
    return [handleBefore, handleAfter];
  };

  const forMatNameTriPNR = (value: any) => (
    <>
      {Object.keys(value)?.map(
        (el: any, idx: number) =>
          el != 'factor' && <div key={idx}>{`- ${listNames[el]}:  ${value?.[el]}`} </div>,
      )}
      {Object.keys(value?.factor)?.map((el: any, idx: number) => (
        <div key={idx}>{`- ${listNames[el]}:  ${value?.factor[el]}`} </div>
      ))}
    </>
  );
  const formatObjValid = (value: some) => {
    let result: any = '';
    if (value?.factor?.fromAirport) {
      result = `${value?.factor?.fromAirport}  -  ${value?.factor?.toAirport}`;
      return result;
    }
    if (value?.factor?.fromAirport && (value?.factor?.ageCategory || value?.factor?.firstName)) {
      result = `${result} ;`;
    }
    if (value?.factor?.ageCategory || value?.factor?.firstName) {
      result = `${result}
      ${formatAgeCategory(value?.factor?.ageCategory)}
      ${value?.factor?.lastName} ${value?.factor?.firstName}`;
    }
    return result;
  };

  const formatAgeCategory = (stt: string) => {
    return listAgeCategory.find((el: some) => el.code == stt)?.name;
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

  React.useEffect(() => {
    if (data) {
      setHandleBefore([]);
      setHandleAfter([]);
      handleWorkLog();
    }
  }, [data]);
  return (
    <Modal
      title='Lịch sử thay đổi thông tin'
      visible={type == 'WORK_LOGS'}
      onCancel={onClose}
      width={900}
      footer={false}
    >
      <Row gutter={10}>
        <Col span={6}>
          <b>Người xử lý</b>
          <div className='text-success'>{data?.saleInfo?.name}</div>

          <div>{moment(data?.time).format(DATE_TIME_FORMAT)}</div>
          <div>{data?.action}</div>
        </Col>
        <Col span={9}>
          <b>Nội dung cũ</b>
          {handleBeforeResult?.map((el: any, idx: number) => (
            <div key={idx}>
              {`${el?.value} ${el?.info ? `(${el?.info})` : ':'}`} <span>{el?.name} </span>
            </div>
          ))}
        </Col>
        <Col span={9}>
          <b>Nội dung mới</b>
          {handleAfterResult?.map((el: any, idx: number) => (
            <div key={idx}>
              {`${el?.value} ${el?.info ? `(${el?.info})` : ':'}`} <span>{el?.name} </span>
            </div>
          ))}
        </Col>
      </Row>
    </Modal>
  );
};

export default WorkLogDetailModal;
