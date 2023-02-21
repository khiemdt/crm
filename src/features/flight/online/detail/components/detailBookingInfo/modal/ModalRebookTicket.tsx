import { Button, Col, message, Modal, Popconfirm, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { rebookFlightBooking, rebookFlightSingleTicket } from '~/apis/flight';
import '~/features/flight/components/modal/modal.scss';
import { AirlinesType } from '~/features/systems/systemSlice';
import { some } from '~/utils/constants/constant';
import { isEmpty } from '~/utils/helpers/helpers';
import { useAppSelector } from '~/utils/hook/redux';

interface Props {
  modal: boolean;
  setModal: any;
}

interface DataType {
  airlineId?: some;
  pnrCode?: string;
  status?: string;
  type?: string;
  key?: number;
  ticketId?: string;
}

const ModalOriginTicket: React.FC<Props> = (props) => {
  const { modal, setModal } = props;
  const intl = useIntl();
  const booking = useAppSelector((state) => state.flightReducer.flightOnlineDetail);
  const airlines: AirlinesType[] = useAppSelector((state) => state.systemReducer.airlines);
  const [keySelect, setKeySelect] = useState<React.Key[]>([]);
  const [dataSelect, setDataSelect] = useState<DataType[]>([]);

  const getIcon = (airlineId: number) => {
    const item = airlines.find((el) => el?.id === airlineId);
    return item?.logo || '';
  };
  const dataSource = [
    {
      key: 1,
      airlineId: booking?.outbound,
      pnrCode: booking?.outboundPnrCode,
      status: booking?.outboundPnrCode ? 'Đặt thành công' : '',
      type: 'outbound',
      ticketId: booking.outbound?.ticketId,
    },
  ];
  if (booking?.inbound) {
    dataSource.push({
      key: 2,
      airlineId: booking?.inbound,
      pnrCode: booking?.inboundPnrCode,
      status: booking?.inboundPnrCode ? 'Đặt thành công' : '',
      type: 'inbound',
      ticketId: booking.inbound?.ticketId,
    });
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Chặng bay',
      dataIndex: 'airlineId',
      render: (value, record) => {
        return (
          <Col className='air-box gap-8'>
            <img src={getIcon(value?.airlineId)} alt='' style={{ width: 24 }} />
            <span>{record?.type === 'outbound' ? 'Chiều đi:' : 'Chiều về'} </span>
            <b>{value?.fromAirport} </b> - <b>{value?.toAirport} </b>
          </Col>
        );
      },
    },
    {
      title: 'Mã đặt chỗ',
      dataIndex: 'pnrCode',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (value) => {
        return <span className='text-success'>{value} </span>;
      },
    },
  ];
  const confirmFlightBooking = async () => {
    const queryParams: some = {
      bookingId: booking.id,
    };
    try {
      let dataRes: some = {};
      const { data } = await rebookFlightBooking(queryParams);
      dataRes = data;
      if (dataRes.code === 200) {
        message.success(intl.formatMessage({ id: 'IDS_TEXT_REBOOK_SUCCESS' }));
        handleCancel();
      } else {
        message.error(dataRes?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const rowSelection = {
    selectedRowKeys: keySelect,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setKeySelect(selectedRowKeys);
      setDataSelect(selectedRows);
    },
  };

  const handleCancel = () => {
    setModal(false);
  };
  useEffect(() => {
    if (!modal) {
      setKeySelect([]);
    }
  }, [modal]);

  return (
    <Modal
      className='wrapperModal'
      visible={modal}
      onCancel={handleCancel}
      footer={false}
      width={600}
    >
      <div className='title'>Giữ chỗ cho Vé máy bay</div>
      <p className='text-sm text-grey'>
        Hệ thống sẽ tự động giữ chỗ cho vé máy bay và trả kết quả về sau khi đặt xong
      </p>
      <Table pagination={false} dataSource={dataSource} columns={columns} />
      <div style={{ paddingTop: 24 }} className='wrapperSubmitSms'>
        <Button onClick={() => handleCancel()}>
          <FormattedMessage id='IDS_TEXT_SKIP' />
        </Button>
        <Popconfirm
          placement='topRight'
          title='Bạn có chắc muốn đặt lại vé máy bay?'
          okText='Đồng ý'
          cancelText='Hủy'
          onConfirm={confirmFlightBooking}
        >
          <Button type='primary' htmlType='submit'>
            Giữ chỗ
          </Button>
        </Popconfirm>
      </div>
    </Modal>
  );
};
export default ModalOriginTicket;
