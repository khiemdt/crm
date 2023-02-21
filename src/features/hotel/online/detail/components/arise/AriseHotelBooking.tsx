import { Button, Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { additions } from '~/apis/hotel';
import { some } from '~/utils/constants/constant';
import { formatMoney, getPaymentStatusPaymentAriseHotel } from '~/utils/helpers/helpers';
import AriseAddModal from './AriseAddModal';
import AriseDetail from './AriseDetail';
import ModalConfirmAction from './ModalConfirmAction';

const AriseHotelBooking = (props: some) => {
  const { id } = props;
  const [modal, setModal] = useState({
    type: '',
    item: {},
  });
  const [listAdditions, setListAdditions] = useState<some[] | undefined>(undefined);
  useEffect(() => {
    fetAdditions();
  }, []);

  const fetAdditions = async () => {
    try {
      const { data } = await additions({ bookingId: id });
      if (data.code === 200) {
        setListAdditions(data?.data?.items);
      }
    } catch (error) {}
  };

  const columns: ColumnsType<some> = [
    {
      title: 'Thời gian phát sinh',
      dataIndex: 'createdTime',
      key: 'createdTime',
      render: (text) => {
        return <div>{moment(text).format('DD/MM/YYYY HH:mm')}</div>;
      },
      width: 95,
    },
    {
      title: 'Thông tin thanh toán',
      key: 'infoPayment',
      render: (text, record) => {
        const status = getPaymentStatusPaymentAriseHotel(
          record.paymentStatus,
          record.paymentMethodCode,
        );
        return (
          <div className='item-col'>
            <Row gutter={8}>
              <Col span={10}>Trạng thái:</Col>
              <Col span={14} className='value-item'>
                <span style={{ color: status.color }}>{`${status?.title}`}</span>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={10}>Phương thức:</Col>
              <Col span={14} className='value-item'>
                {record?.paymentMethodName}
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={10}>Mã:</Col>
              <Col span={14} className='value-item'>
                {record.bookingCode}
              </Col>
            </Row>
          </div>
        );
      },
    },
    {
      title: 'Tiền thanh toán',
      key: 'pricePayment',
      render: (text, record) => {
        return (
          <div className='item-col'>
            <Row gutter={8}>
              <Col span={10}>Giá NET:</Col>
              <Col span={14} className='value-item'>
                {formatMoney(record.netPrice)}
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={10}>Phí dịch vụ:</Col>
              <Col span={14} className='value-item'>
                {formatMoney(record?.processingFee)}
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={10}>Tiền khách TT:</Col>
              <Col span={14} className='value-item'>
                {formatMoney(record.totalAmount)}
              </Col>
            </Row>
          </div>
        );
      },
    },
    {
      title: 'Ghi chú',
      key: 'note',
      dataIndex: 'note',
    },
    {
      title: '',
      key: 'action',
      render: (text, record, index) => (
        <div className='item-col-action'>
          <Button
            type='text'
            style={{ color: '#004EBC', fontWeight: 400 }}
            onClick={() =>
              setModal({
                type: 'MODAL_DETAIL',
                item: record,
              })
            }
          >
            Chi tiết
          </Button>
          <div>
            {record.paymentStatus === 'pending' && record.paymentMethodCode != 'DBT' && (
              <div className='action-top'>
                <Button
                  type='primary'
                  style={{ width: '50%' }}
                  onClick={() =>
                    setModal({
                      type: 'MODAL_CONFIRM',
                      item: record,
                    })
                  }
                >
                  Xác nhận
                </Button>
                <Button
                  type='default'
                  className='btn-cancel'
                  onClick={() =>
                    setModal({
                      type: 'MODAL_CANCEL',
                      item: record,
                    })
                  }
                >
                  Hủy bỏ
                </Button>
              </div>
            )}
            {record.paymentStatus === 'pending' &&
              (record.paymentMethodCode === 'DBT' || record.paymentMethodCode === 'CD') && (
                <Button
                  type='primary'
                  onClick={() =>
                    setModal({
                      type: 'MODAL_STATUS',
                      item: record,
                    })
                  }
                >
                  Chuyển trạng thái thanh toán
                </Button>
              )}
          </div>
        </div>
      ),
    },
  ];

  if (listAdditions?.length === 0)
    return (
      <>
        <EmptyData setModal={setModal} />
        <AriseAddModal modal={modal} setModal={setModal} />
      </>
    );

  return (
    <div className='list-data'>
      <div className='header'>
        <span>Danh sách phát sinh thêm</span>
        <Button
          type='primary'
          onClick={() =>
            setModal({
              type: 'MODAL_ADD',
              item: {},
            })
          }
        >
          Tạo phát sinh thêm
        </Button>
      </div>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={listAdditions || []}
        loading={listAdditions === undefined}
        pagination={false}
      />
      <AriseDetail modal={modal} setModal={setModal} />
      <AriseAddModal modal={modal} setModal={setModal} handleOk={fetAdditions} />
      <ModalConfirmAction modal={modal} setModal={setModal} handleOk={fetAdditions} />
    </div>
  );
};

export default AriseHotelBooking;

const EmptyData = (props: some) => {
  const { setModal } = props;
  return (
    <div className='empty-data'>
      <img src='https://storage.googleapis.com/tripi-assets/crm_premium/icon_empty_data_size160.png' />
      <span className='title'>Đơn hàng chưa có phát sinh thêm.</span>
      <Button
        onClick={() =>
          setModal({
            type: 'MODAL_ADD',
            item: {},
          })
        }
        type='primary'
      >
        Tạo phát sinh thêm
      </Button>
    </div>
  );
};
