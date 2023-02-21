import { Button, Table } from 'antd';
import { useEffect, useState } from 'react';
import { getBookerRequests } from '~/apis/flight';
import '~/features/flight/online/detail/FlightDetail.scss';
import { listImg, some } from '~/utils/constants/constant';
import { getInvoiceStatusFlight, isEmpty } from '~/utils/helpers/helpers';
import type { ColumnsType } from 'antd/es/table';
import { InvoiceFlightType } from '~/features/flight/online/Modal';
import { IconChevronDown, IconDelete } from '~/assets';
import InvoiceFlightDetail from '~/features/flight/online/detail/components/invoice/InvoiceFlightDetail';
import ModalDeleteInvoice from '~/features/flight/online/detail/components/invoice/ModalDeleteInvoice';
import AddInvoiceFlight from '~/features/flight/online/detail/components/invoice/AddInvoiceFlight';

const typeModal = {
  MODAL_ADD: 'MODAL_ADD',
  MODAL_DELETE: 'MODAL_DELETE',
};

const InvoiceFlight = (props: some) => {
  const { id, module } = props;
  const [invoices, setInvoices] = useState<InvoiceFlightType[] | undefined>(undefined);
  const [modal, setModal] = useState({
    type: '',
    item: {},
  });

  useEffect(() => {
    fetBookerRequests();
  }, []);

  const fetBookerRequests = async () => {
    try {
      const { data } = await getBookerRequests({
        filters: {
          bookingId: id,
          modules: [module],
          types: ['vat_invoice'],
        },
      });
      if (data.code === 200) {
        setInvoices(data?.data?.requests);
      }
    } catch (error) {}
  };

  const columns: ColumnsType<InvoiceFlightType> = [
    {
      title: '#',
      key: 'index',
      render: (text, record, index) => {
        return `${index + 1}`;
      },
    },
    {
      title: 'Mã yêu cầu',
      key: 'id',
      dataIndex: 'id',
    },
    {
      title: 'Người yêu cầu',
      key: 'createdByUser',
      dataIndex: 'createdByUser',
      render: (text) => {
        return `${text?.name}`;
      },
    },
    {
      title: 'Ngày yêu cầu',
      key: 'requestTime',
      dataIndex: 'requestTime',
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: (text) => {
        const status = getInvoiceStatusFlight(text);
        return <span style={{ color: status.color }}>{`${status?.title}`}</span>;
      },
    },
    {
      title: '',
      align: 'center',
      width: 20,
      render: (text, record, index) => (
        <>
          {(record?.status === 'open' || record?.status === 'handling') && (
            <span
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setModal({
                  type: typeModal.MODAL_DELETE,
                  item: record,
                });
              }}
            >
              <IconDelete />
            </span>
          )}
        </>
      ),
      key: 'action',
    },
    Table.EXPAND_COLUMN,
  ];

  return (
    <div className='invoice-flight'>
      <div className='group-action'>
        <Button
          className='btn-action'
          onClick={() =>
            setModal({
              type: typeModal.MODAL_ADD,
              item: { id },
            })
          }
        >
          Thêm yêu cầu xuất hóa đơn
        </Button>
        {/* {!isEmpty(invoices) && (
          <>
            <Button className='btn-action'>Kiểm tra MST</Button>
            <Button className='btn-action'>Gửi email</Button>
            <Button className='btn-action'>Xem hóa đơn</Button>
          </>
        )} */}
      </div>
      {invoices?.length === 0 ? (
        <div className='empty-invoice'>
          <img src={listImg.imgEmptyInvoiceFlight} alt='' className='img-empty' />
          <span>Bạn chưa có yêu cầu xuất hóa đơn nào</span>
        </div>
      ) : (
        <Table
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={invoices || []}
          loading={invoices === undefined}
          pagination={false}
          expandable={{
            expandedRowRender: (record) => <InvoiceFlightDetail record={record} module={module} />,
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <span onClick={(e) => onExpand(record, e)}>
                  <IconChevronDown style={{ transform: 'rotate(180deg)' }} />
                </span>
              ) : (
                <span onClick={(e) => onExpand(record, e)}>
                  <IconChevronDown />
                </span>
              ),
            expandRowByClick: true,
          }}
        />
      )}
      <ModalDeleteInvoice
        open={modal.type === typeModal.MODAL_DELETE}
        modal={modal}
        setModal={setModal}
        handleOk={fetBookerRequests}
        module={module}
      />
      <AddInvoiceFlight
        open={modal.type === typeModal.MODAL_ADD}
        modal={modal}
        setModal={setModal}
        handleOk={fetBookerRequests}
        id={id}
        module={module}
      />
    </div>
  );
};
export default InvoiceFlight;
