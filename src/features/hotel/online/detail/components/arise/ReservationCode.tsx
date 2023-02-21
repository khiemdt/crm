import { Popover, Button, Form, Row, Col } from 'antd';

import '~/components/popover/PopoverSelect.scss';
import { FC, useState, useEffect } from 'react';

import { formatMoney, isEmpty } from '~/utils/helpers/helpers';
import { HandMoney, IconDelete } from '~/assets';
import { searchReservationCode } from '~/apis/hotel';
import { some } from '~/utils/constants/constant';

const ReservationCode: FC<some> = ({
  trigger = 'click',
  placement = 'bottomLeft',
  defaultVisible = false,
  hotelOnlineDetail = {},
  netPrice = 0,
  processingFee = 0,
}) => {
  const form = Form.useFormInstance();
  const [visible, setVisible] = useState(defaultVisible);
  const [reservationCodes, setReservationCodes] = useState<some[]>([]);
  const codesTemp: some[] = Form.useWatch('codes', form);

  useEffect(() => {
    handleSearchReservationCode();
  }, []);

  useEffect(() => {
    if (isEmpty(codesTemp)) {
      const reservationCodesTemp = reservationCodes.map((el: some) => ({
        ...el,
        isSelected: false,
      }));
      setReservationCodes(reservationCodesTemp);
    }
  }, [codesTemp]);

  const addCode = (item: some) => {
    let temp = [];
    if (item.isSelected) {
      temp = codesTemp.filter((el: some) => el.code !== item.code);
    } else {
      temp = [...codesTemp];
      temp.push({
        code: item.code,
        amount: item.remainingAmount,
        expiredDate: item.expiredDate,
      });
    }
    form.setFieldsValue({ codes: temp });
    const reservationCodesTemp = reservationCodes.map((el: some) => ({
      ...el,
      isSelected: el.code === item.code ? (item.isSelected ? false : true) : el.isSelected,
    }));
    setReservationCodes(reservationCodesTemp);
    setVisible(false);
  };

  const removeCode = (item: some) => {
    let temp: some[] = [];
    temp = codesTemp.filter((el: some) => el.code !== item.code);
    form.setFieldsValue({ codes: temp });
    const reservationCodesTemp = reservationCodes.map((el: some) => ({
      ...el,
      isSelected: el.code === item.code ? false : el.isSelected,
    }));
    setReservationCodes(reservationCodesTemp);
    setVisible(false);
  };

  const handleSearchReservationCode = async () => {
    try {
      const { data } = await searchReservationCode({
        caId: hotelOnlineDetail.caId,
        customerPhone: hotelOnlineDetail.customerPhone,
        rootHotelId: hotelOnlineDetail.hotelId,
        userId: hotelOnlineDetail.userId,
      });
      if (data.code === 200) {
        setReservationCodes(data?.data?.codes);
      }
    } catch (error) {}
  };

  const checkAdd = () => {
    let totalPriceCodes: number = 0;
    codesTemp?.forEach((el: some) => {
      totalPriceCodes += el.amount;
    });
    return totalPriceCodes >= netPrice + processingFee && !isEmpty(codesTemp);
  };

  const content = (
    <div className='content-popover-input'>
      <div className='title'>Danh sách mã bảo lưu</div>
      {reservationCodes.map((code: some) => (
        <div key={code.code} style={{ marginBottom: 12 }}>
          <Row gutter={12} style={{ alignItems: 'center' }}>
            <Col span={8}>{code.expiredDate}</Col>
            <Col span={6}>{code.code}</Col>
            <Col span={5}>{formatMoney(code.remainingAmount)}</Col>
            <Col span={5}>
              <Button className='btn-apply' onClick={() => addCode(code)}>
                {code.isSelected ? 'Hủy' : 'Áp dụng'}
              </Button>
            </Col>
          </Row>
        </div>
      ))}
    </div>
  );

  const popoverContent = (
    <Popover
      trigger={trigger}
      placement={placement}
      overlayClassName='popover-reservation-code'
      content={content}
      visible={visible}
      onVisibleChange={(visible) => {
        if (!checkAdd()) {
          setVisible(visible);
        }
      }}
    >
      <Button type='text' className='btn-code-save' disabled={checkAdd()}>
        <HandMoney style={{ marginRight: 8 }} />
        Thêm mã bảo lưu
      </Button>
    </Popover>
  );

  return (
    <>
      {isEmpty(codesTemp) ? (
        popoverContent
      ) : (
        <div className='reservation-hotel-container'>
          <div className='header'>
            <span>Code bảo lưu</span>
            {popoverContent}
          </div>
          {codesTemp.map((code: some) => (
            <div key={code.code}>
              <Row gutter={12} style={{ alignItems: 'center' }} className='item-code'>
                <Col span={14}>{code.code}</Col>
                <Col span={7}>{formatMoney(code.amount)}</Col>
                <Col span={3}>
                  <IconDelete
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      removeCode(code);
                    }}
                  />
                </Col>
              </Row>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ReservationCode;
