import { Col, message, Modal, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { findTicketsFlight, rebookFlightBooking } from '~/apis/flight';
import '~/features/flight/components/modal/modal.scss';
import { AirlinesType } from '~/features/systems/systemSlice';
import { some } from '~/utils/constants/constant';
import { getSupplierStatus } from '~/utils/helpers/helpers';
import { useAppSelector } from '~/utils/hook/redux';

interface Props {
  modal: boolean;
  setModal: any;
  data: some;
}

interface DataType {
  airlineId?: some;
  pnrCode?: string;
  status?: string;
  type?: string;
  key?: number;
  ticketId?: string;
}

interface DataTable {
  supplierStatus: string;
  numPax: number;
  pnr: string;
  pnrArr?: [];
}

const ModalFindTickets: React.FC<Props> = (props) => {
  const { modal, setModal, data } = props;
  const intl = useIntl();
  const booking = useAppSelector((state) => state.flightReducer.flightOnlineDetail);
  const airlines: AirlinesType[] = useAppSelector((state) => state.systemReducer.airlines);
  const [dataSource, setdataSource] = useState<some[]>([]);

  const columns: ColumnsType<DataType> = [
    {
      title: 'Trạng thái',
      dataIndex: 'supplierStatus',
      render: (value, record) => {
        const result = getSupplierStatus(value);
        return <span style={{ color: result?.color }}>{result?.title} </span>;
      },
    },
    {
      title: 'Tổng số pax',
      dataIndex: 'numPax',
      render: (value, record) => {
        return <span>{value} </span>;
      },
    },
    {
      title: 'Danh sách PNR',
      dataIndex: 'pnrArr',
      render: (value) => {
        return (
          <>
            {value.map(
              (el: string, indx: number) =>
                el && (
                  <Tag key={indx} color='success'>
                    {el}
                  </Tag>
                ),
            )}
          </>
        );
      },
    },
  ];
  const findTicketsFlightBooking = async () => {
    const queryParams: some = {
      flightCode: data?.flightCode,
      scheduledDepartureDateTime: `${data.departureDate} ${data.departureTime}`,
      fromAirport: data.fromAirport,
      toAirport: data.toAirport,
    };
    try {
      const { data } = await findTicketsFlight(queryParams);
      if (data.code === 200) {
        let result: some[] = [];
        if (data?.data?.tickets.length) {
          data?.data?.tickets.forEach((el: some) => {
            if (result?.some((ele: some) => ele.supplierStatus == el.supplierStatus)) {
              result?.forEach((element: some) => {
                if (element.supplierStatus == el.supplierStatus) {
                  element.numPax = element.numPax + el.numPax;
                  element?.pnrArr?.push(el.pnr);
                }
              });
            } else {
              result.push({
                ...el,
                pnrArr: [el.pnr],
              });
            }
          });
        }
        setdataSource(result);
      } else {
        message.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setModal({
      open: false,
      data: null,
    });
  };
  useEffect(() => {
    if (data) {
      findTicketsFlightBooking();
    }
  }, [data]);

  return (
    <Modal
      className='wrapperModal'
      visible={modal}
      onCancel={handleCancel}
      footer={false}
      width={600}
    >
      <div className='title'>Danh sách PNR trong chuyến bay</div>
      <Table pagination={false} dataSource={dataSource} columns={columns} />
    </Modal>
  );
};
export default ModalFindTickets;
