import { Button, message, Modal, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { getTransInfoPostProcessing } from '~/apis/flight';
import { IconCloseNoneCycle } from '~/assets';
import '~/features/flight/components/modal/modal.scss';
import { some } from '~/utils/constants/constant';
import {
  formatMoney,
  getListstatusTransfer,
  getPaymentStatusPSTFlight,
  isEmpty,
} from '~/utils/helpers/helpers';
import './AriseMoreFlight.scss';

interface DataType {
  id: number;
  amount: number;
  status: string;
  receivedTime: string;
}

const TransInfoPostProcessingModal = (props: any) => {
  const { modal, setModal } = props;
  const handleCancel = () => {
    setModal({
      type: '',
      item: {},
    });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: 'ID giao dịch',
      dataIndex: 'id',
    },
    {
      title: 'Tổng tiền thanh toán',
      dataIndex: 'amount',
      render: (text) => {
        return <div>{formatMoney(text)} </div>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (text) => {
        const status = getListstatusTransfer(text);
        return <span style={{ color: status.color }}>{`${status.title}`}</span>;
      },
    },
    {
      title: 'Thời gian chuyển khoản',
      dataIndex: 'receivedTime',
      render: (text) => {
        return <div>{text} </div>;
      },
    },
  ];

  return (
    <Modal
      className='modal-trans-info-post-processing modal-delete-invoice'
      visible={modal.type === 'TRANSINFO' || modal.type === 'TRANS_BANK'}
      onCancel={handleCancel}
      footer={false}
      closeIcon={<IconCloseNoneCycle />}
      centered
      width={620}
    >
      {!isEmpty(modal) && modal.type === 'TRANSINFO' && (
        <>
          <div className='title'>Thông tin chuyển khoản</div>
          <div className='list-bank'>
            {modal.item?.transferOptions?.map((el: some, idx: number) => (
              <div key={idx} className='item-bank'>
                <div className='left-item'>
                  <img src={el.bankLogo} className='icon-bank' />
                </div>
                <div className='right-item'>
                  <span style={{ fontWeight: 500 }}>{el.bankName}</span>
                  <span>{`Số tài khoản: ${el.accountNumber}`}</span>
                </div>
              </div>
            ))}
          </div>
          <div className='info-trans'>
            <div className='item-info-trans'>
              <span style={{ color: '#677072' }}>Tên chủ tài khoản</span>
              <span>{modal.item?.transferOptions[0]?.accountName}</span>
            </div>
            <div className='item-info-trans'>
              <span style={{ color: '#677072' }}>Số tiền</span>
              <span style={{ color: ' #FF2C00', fontWeight: 600 }}>
                {formatMoney(modal.item?.transferInfo?.totalAmount)}
              </span>
            </div>
            <div className='item-info-trans'>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#677072' }}>Nội dung chuyển khoản</span>
                <span style={{ color: ' #FF2C00', fontSize: 12, fontStyle: 'italic' }}>
                  Cần ghi rõ nội dung chuyển khoản
                </span>
              </div>

              <span style={{ color: ' #007864', fontWeight: 600 }}>
                {modal.item?.transferInfo?.message}
              </span>
            </div>
          </div>
          <div className='bottom'>
            <Button type='primary' onClick={handleCancel}>
              Đóng
            </Button>
          </div>
        </>
      )}
      {!isEmpty(modal.item) && modal.type === 'TRANS_BANK' && (
        <>
          <div className='title'>Danh sách chuyển khoản</div>
          <p
            style={{ fontWeight: 'bold' }}
            dangerouslySetInnerHTML={{
              __html: `Tổng tiền chuyển khoản: <span class='text-success'>${formatMoney(
                modal.item?.amountPaid,
              )}</span>/${formatMoney(modal.item?.amount)}`,
            }}
          ></p>
          <div>
            <Table columns={columns} dataSource={modal?.item?.transactions} pagination={false} />
          </div>
          <div className='bottom'>
            <Button type='primary' onClick={handleCancel}>
              Đóng
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};
export default TransInfoPostProcessingModal;
