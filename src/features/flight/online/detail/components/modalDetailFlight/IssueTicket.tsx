import { Button, Modal } from 'antd';
import confirm from 'antd/lib/modal/confirm';
import Table, { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { confirmFlightSingleTicket, rebookFlightBooking } from '~/apis/flight';
import { IconCloseOutline, IconCompletedImage, IconWarningImage } from '~/assets';
import { OPTION_FIGHT_TICKET, OPTION_PNR_STATUS } from '~/features/flight/constant';
import { AirlinesType } from '~/features/systems/systemSlice';
import { some } from '~/utils/constants/constant';
import { isEmpty } from '~/utils/helpers/helpers';
import { useAppSelector } from '~/utils/hook/redux';

interface Props {
  open: boolean;
  handleClose: () => void;
}

const columns: ColumnsType<any> = [
  {
    title: 'Chặng bay',
    dataIndex: 'flight',
    render: (text, record, key) => {
      return (
        <div className='name-table-void-ticket'>
          <img src={record?.flight?.image} />
          <span>
            {key === 0 ? 'Chiều đi' : 'Chiều về'}:{' '}
            <b>
              {record?.flight?.fromAirport} - {record?.flight?.toAirport}
            </b>
          </span>
        </div>
      );
    },
  },
  {
    title: 'Mã đặt chỗ',
    dataIndex: 'code',
    render: (text) => <div className='name-table'>{text}</div>,
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    render: (text, record) => {
      return (
        <div className={record?.status}>
          {OPTION_PNR_STATUS?.find((val) => val?.code === record?.status)?.name}
        </div>
      );
    },
  },
];

const IssueTicket: React.FC<Props> = ({ open, handleClose }) => {
  const [checkedItemsTable, setCheckedItemsTable] = useState<some[]>([]);
  const booking = useAppSelector((state) => state.flightReducer.flightOnlineDetail);
  const airlines: AirlinesType[] = useAppSelector((state) => state.systemReducer.airlines);

  const getIcon = (airlineId: number) => {
    const item = airlines.find((el) => el?.id === airlineId);
    return item?.logo || '';
  };

  const dataColumns = () => {
    const dataFlight = [
      {
        type: OPTION_FIGHT_TICKET.OUTBOUND,
        flight: booking?.outbound,
        code: booking?.outboundPnrCode,
        status: booking?.outboundPnrStatus,
      },
    ];

    if (booking?.inbound) {
      dataFlight?.push({
        type: OPTION_FIGHT_TICKET.INBOUND,
        flight: booking?.inbound,
        code: booking?.inboundPnrCode,
        status: booking?.inboundPnrStatus,
      });
    }

    return dataFlight
      ?.map((val: some, index: number) => ({
        id: index + 1,
        type: val?.type,
        code: val?.code,
        status: val?.status,
        flight: {
          image: getIcon(val?.flight?.airlineId),
          fromAirport: val?.flight?.fromAirport,
          toAirport: val?.flight?.toAirport,
        },
      }))
      ?.filter((val) => val?.id);
  };

  const fetConfirmFlightSingleTicket = async (query = {}) => {
    try {
      const { data } = await rebookFlightBooking(query);
      if (data.code === 200) {
        showConfirmSuccess();
        setCheckedItemsTable([]);
        handleClose();
      } else {
        showConfirmError(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showConfirmError = (message: string) => {
    Modal.error({
      wrapClassName: 'wrap-show-confirm-info',
      content: (
        <div className='wrap-show-confirm-content'>
          <IconWarningImage />
          <h3>Xuất vé thất bại</h3>
          <p>{message}</p>
        </div>
      ),
    });
  };

  const showConfirmSuccess = () => {
    Modal.success({
      wrapClassName: 'wrap-show-confirm-info',
      content: (
        <div className='wrap-show-confirm-content'>
          <IconCompletedImage />
          <h3>Xuất vé thành công </h3>
          <p>Hãy kiểm tra lại đơn hàng để xem chi tiết kết quả</p>
        </div>
      ),
      okText: 'Ok',
    });
  };

  const handleVoidFlightTicker = () => {
    confirm({
      title: 'Xác nhận mã giữ chỗ',
      content: 'Hãy chắc chắn rằng bạn muốn xác nhận mã giữ chỗ',
      okText: 'Xác nhận',
      cancelText: 'Hủy bỏ',
      wrapClassName: 'wrap-show-confirm',
      onOk() {
        fetConfirmFlightSingleTicket({
          bookingId: booking?.id,
          // isOutbound: isEmpty(
          //   checkedItemsTable?.find((val) => val?.type === OPTION_FIGHT_TICKET.INBOUND),
          // ),
        });
      },
    });
  };

  const resetVoidTicket = () => {
    setCheckedItemsTable([]);
  };

  useEffect(() => {
    !open && resetVoidTicket();
  }, [open]);

  return (
    <Modal
      className='wrapper-modal-void-ticket'
      title={
        <div className='wrapper-modal-header'>
          <div className='title-modal'>Xuất vé</div>
          <p>
            Hệ thống sẽ tự động xuất vé và cập nhật trạng thái xác nhận cho mã đặt chỗ nếu thực hiện
            thành công
          </p>
        </div>
      }
      visible={open}
      footer={false}
      closeIcon={<IconCloseOutline />}
      onCancel={handleClose}
      width={600}
    >
      <Table
        rowKey={(record) => record.id}
        // rowSelection={{
        //   selectedRowKeys: checkedItemsTable?.map((val) => val?.id),
        //   onChange: (selectedRowKeys: React.Key[], selectedRows: some[]) => {
        //     setCheckedItemsTable(selectedRows);
        //   },
        // }}
        className='table-split-code'
        pagination={false}
        columns={columns}
        dataSource={dataColumns()}
      />
      <div className='footer-table-split-code footer-void-ticket'>
        <div className='button-void-ticket'>
          <Button onClick={handleClose}>Bỏ qua</Button>
          <Button
            type='primary'
            onClick={handleVoidFlightTicker}
          >
            Xuất vé
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default IssueTicket;
