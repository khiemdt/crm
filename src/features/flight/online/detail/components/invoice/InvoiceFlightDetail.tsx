import { Table } from 'antd';
import { useEffect, useState } from 'react';
import { getVatInvoiceDetail } from '~/apis/flight';
import '~/features/flight/online/detail/FlightDetail.scss';
import { some } from '~/utils/constants/constant';
import { formatMoney, isEmpty } from '~/utils/helpers/helpers';
import { InvoiceFlightType } from '~/features/flight/online/Modal';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { IconEye } from '~/assets';
import OrderInvoice from '~/features/flight/online/detail/components/invoice/OrderInvoice';

const InvoiceFlightDetail = (props: some) => {
  const { record, module } = props;
  const [invoiceDetail, setInvoiceDetail] = useState<some>({});
  const [modal, setModal] = useState({
    open: false,
    item: {},
  });

  useEffect(() => {
    fetVatInvoiceDetail();
  }, []);

  const fetVatInvoiceDetail = async () => {
    try {
      const { data } = await getVatInvoiceDetail({
        bookerRequestId: record.id,
      });
      if (data.code === 200) {
        setInvoiceDetail(data.data);
      }
    } catch (error) {}
  };

  const columns: ColumnsType<InvoiceFlightType> = [
    {
      title: 'Mã đơn',
      key: 'id',
      dataIndex: 'id',
    },
    {
      title: 'Thời gian đặt',
      key: 'completedDate',
      dataIndex: 'completedDate',
      render: (text) => {
        return `${moment(text).format('DD-MM-YYYY HH:mm')}`;
      },
    },
    {
      title: 'Thông tin đơn hàng',
      key: 'typeDesc',
      dataIndex: 'typeDesc',
    },
    {
      title: '',
      align: 'center',
      width: 40,
      render: (text, record, index) => (
        <span
          style={{ cursor: 'pointer' }}
          onClick={() =>
            setModal({
              open: true,
              item: record,
            })
          }
        >
          <IconEye />
        </span>
      ),
      key: 'action',
    },
  ];

  if (isEmpty(invoiceDetail)) return null;
  return (
    <div className='invoice-detail'>
      <div className='left-content'>
        <span className='title'>Thông tin hóa đơn</span>
        <div className='item-content'>
          <div className='title-item'>Tên khách hàng:</div>
          <span>{invoiceDetail?.customerName}</span>
        </div>
        <div className='item-content'>
          <div className='title-item'>Tên công ty:</div>
          <span>{invoiceDetail?.companyName}</span>
        </div>
        <div className='item-content'>
          <div className='title-item'>Địa chỉ:</div>
          <span>{invoiceDetail?.companyAddress}</span>
        </div>
        <div className='item-content'>
          <div className='title-item'>Mã số thuế:</div>
          <span>{invoiceDetail?.taxCode}</span>
        </div>
        <span className='title' style={{ paddingTop: 20 }}>
          Thông tin người nhận
        </span>
        <div className='item-content'>
          <div className='title-item title-item-bottom'>Tên người nhận:</div>
          <span>{invoiceDetail?.recipientName}</span>
        </div>
        <div className='item-content'>
          <div className='title-item title-item-bottom'>Email:</div>
          <span>{invoiceDetail?.recipientEmail}</span>
        </div>
        <div className='item-content'>
          <div className='title-item title-item-bottom'>Địa chỉ:</div>
          <span>{invoiceDetail?.recipientAddress}</span>
        </div>
        <div className='item-content'>
          <div className='title-item title-item-bottom'>Số điện thoại:</div>
          <span>{invoiceDetail?.recipientPhone}</span>
        </div>
        <div className='item-content'>
          <div className='title-item title-item-bottom'>Ghi chú:</div>
          <span>{invoiceDetail?.note}</span>
        </div>
        {!isEmpty(invoiceDetail?.benefitPackage) && (
          <div className='item-content'>
            <div className='title-item title-item-bottom'>Tổng tiền gói dịch vụ:</div>
            <span>{`${formatMoney(
              invoiceDetail?.benefitPackage?.benefitPackageTotalAmount,
            )}`}</span>
          </div>
        )}
        {!isEmpty(invoiceDetail?.benefitPackage) && (
          <div className='item-content'>
            <div className='title-item title-item-bottom'>Tổng tiền cần thanh toán:</div>
            <span style={{ color: '#ff2c00' }}>{`${formatMoney(
              invoiceDetail?.benefitPackage?.benefitPackagePrice,
            )}`}</span>
          </div>
        )}
      </div>
      {module === 'flight' && (
        <div className='right-content'>
          <span className='title' style={{ marginBottom: 8 }}>
            Thông tin đơn hàng
          </span>
          <Table
            rowKey={(record) => record.id}
            columns={columns}
            dataSource={invoiceDetail?.orders || []}
            pagination={false}
          />
        </div>
      )}

      <OrderInvoice modal={modal} setModal={setModal} />
    </div>
  );
};
export default InvoiceFlightDetail;
