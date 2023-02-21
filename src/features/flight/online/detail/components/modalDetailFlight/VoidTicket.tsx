import { Button, Col, Divider, message, Modal, Row } from 'antd';
import confirm from 'antd/lib/modal/confirm';
import Table, { ColumnsType } from 'antd/lib/table';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { voidedItinerary, voidFlightSingleTicket } from '~/apis/flight';
import { IconCloseOutline, IconCompletedImage, IconWarningImage } from '~/assets';
import { OPTION_FIGHT_TICKET, OPTION_PNR_STATUS } from '~/features/flight/constant';
import { AirlinesType } from '~/features/systems/systemSlice';
import { routes, some } from '~/utils/constants/constant';
import { isEmpty } from '~/utils/helpers/helpers';
import { useAppSelector } from '~/utils/hook/redux';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

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
          <img src={record?.image} />
          <span>
            {key === 0 ? 'Chiều đi' : 'Chiều về'}:{' '}
            <b>
              {record?.fromAirport} - {record?.toAirport}
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
  {
    title: 'Số pax void',
    dataIndex: 'voidedPaxNum',
  },
  Table.EXPAND_COLUMN,
];

const VoidTicket: React.FC<Props> = ({ open, handleClose }) => {
  const [checkedItemsTable, setCheckedItemsTable] = useState<some[]>([]);
  const booking = useAppSelector((state) => state.flightReducer.flightOnlineDetail);
  const airlines: AirlinesType[] = useAppSelector((state) => state.systemReducer.airlines);
  const [dataSource, setDataSource] = useState<some[]>([]);
  const { id } = useParams();

  const getIcon = (airlineId: number) => {
    const item = airlines.find((el) => el?.id === airlineId);
    return item?.logo || '';
  };

  const fetVoidFlightSingleTicket = async (query = {}) => {
    try {
      const { data } = await voidFlightSingleTicket(query);
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
          <h3>Cập nhật không thành công!</h3>
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
          <h3>Cập nhật thành công!</h3>
        </div>
      ),
      okText: 'Ok',
    });
  };

  const handleVoidFlightTicker = () => {
    confirm({
      title: '(VOID) Hủy đặt chỗ',
      content: 'Hãy chắc chắn rằng bạn muốn hủy (VOID) đặt chỗ',
      okText: 'Xác nhận',
      cancelText: 'Hủy bỏ',
      wrapClassName: 'wrap-show-confirm',
      onOk() {
        fetVoidFlightSingleTicket({
          bookingId: booking?.id,
          isOutbound: isEmpty(
            checkedItemsTable?.find((val) => val?.type === OPTION_FIGHT_TICKET.INBOUND),
          ),
        });
      },
    });
  };

  const fetVoidedItinerary = async (params: some) => {
    let temp: any[] = [];
    const dataFlight = [
      {
        type: OPTION_FIGHT_TICKET.OUTBOUND,
        code: booking?.outboundPnrCode,
        status: booking?.outboundPnrStatus,
        journeyIndex: 0,
        voidedItineraryRefs: [],
        voidedPaxNum: 0,
        image: getIcon(booking?.outbound?.airlineId),
        fromAirport: booking?.outbound?.fromAirport,
        toAirport: booking?.outbound?.toAirport,
      },
    ];

    if (booking?.inbound) {
      dataFlight?.push({
        type: OPTION_FIGHT_TICKET.INBOUND,
        code: booking?.inboundPnrCode,
        status: booking?.inboundPnrStatus,
        journeyIndex: 1,
        voidedPaxNum: 0,
        voidedItineraryRefs: [],
        image: getIcon(booking?.inbound?.airlineId),
        fromAirport: booking?.inbound?.fromAirport,
        toAirport: booking?.inbound?.toAirport,
      });
    }
    try {
      const { data } = await voidedItinerary(params);
      if (data.code === 200) {
        temp = data?.data;
      } else {
        showConfirmError(data?.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      dataFlight.forEach((element: some) => {
        temp.forEach((el: some) => {
          if (element?.journeyIndex == el?.journeyIndex) {
            element.voidedItineraryRefs = [...el.voidedItineraryRefs];
            element.voidedPaxNum = el.voidedItineraryRefs.reduce(
              (accumulator: number, currentValue: some) => accumulator + currentValue.voidedPaxNum,
              0,
            );
          }
        });
      });
      setDataSource(dataFlight);
    }
  };

  useEffect(() => {
    if (open) {
      fetVoidedItinerary({
        bookingId: id,
      });
    }
  }, [open]);

  return (
    <Modal
      className='wrapper-modal-void-ticket'
      title={<div className='title-modal'>Hủy mã đặt chỗ</div>}
      visible={open}
      footer={false}
      closeIcon={<IconCloseOutline />}
      onCancel={handleClose}
      width={950}
    >
      <Table
        rowKey={(record) => record.journeyIndex}
        rowSelection={{
          selectedRowKeys: checkedItemsTable?.map((val) => val?.journeyIndex),
          onChange: (selectedRowKeys: React.Key[], selectedRows: some[]) => {
            setCheckedItemsTable(selectedRows);
          },
        }}
        className='table-split-code'
        pagination={false}
        columns={columns}
        dataSource={dataSource}
        expandable={{
          expandedRowRender: (record) =>
            !isEmpty(record?.voidedItineraryRefs) && (
              <Row>
                <Col span={15}></Col>
                <Col span={9}>
                  <Table
                    pagination={false}
                    columns={[
                      {
                        title: 'BookingId',
                        dataIndex: 'bookingId',
                        render: (text) => (
                          <b
                            onClick={() => {
                              window.open(
                                `${location.origin}/${routes.SALE}/${routes.FLIGHT}/${routes.FLIGHT_ONLINE}/${text}`,
                                '_blank',
                              );
                            }}
                            className='text-blue'
                          >
                            F{text}
                          </b>
                        ),
                      },
                      {
                        title: 'Pnr',
                        dataIndex: 'pnr',
                      },
                      {
                        title: 'Số pax',
                        dataIndex: 'voidedPaxNum',
                      },
                      {
                        title: 'TicketId',
                        dataIndex: 'ticketId',
                      },
                    ]}
                    dataSource={record?.voidedItineraryRefs}
                  />
                </Col>
              </Row>
            ),
          expandIcon: ({ expanded, onExpand, record }) =>
            !isEmpty(record?.voidedItineraryRefs) && (
              <Button
                className='fl-approval-icon-button'
                onClick={(e) => onExpand(record, e)}
                icon={!expanded ? <DownOutlined /> : <UpOutlined />}
              />
            ),
        }}
      />
      <div className='footer-table-split-code footer-void-ticket'>
        <div className='button-void-ticket'>
          <Button onClick={handleClose}>Bỏ qua</Button>
          <Button
            disabled={isEmpty(checkedItemsTable)}
            type='primary'
            onClick={handleVoidFlightTicker}
          >
            Xác nhận
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default VoidTicket;
