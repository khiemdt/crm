import { Button, Col, Form, Input, message, Modal, Row, Select, Table, Tabs } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { fetGetBankTransferRequests, fetResolveBankTransferTransaction } from '~/apis/paymentSupport';
import { IconCloseOutline } from '~/assets';
import '~/features/flight/components/modal/modal.scss';
import { some } from '~/utils/constants/constant';
import { formatMoney, isEmpty } from '~/utils/helpers/helpers';
import { useAppDispatch } from '~/utils/hook/redux';
import { TYPE_MODAL_BANK_TRANSFER } from '../../constant';
import { fetGetBankTransfer } from '../../PaymentSlice';

interface Props {
  modal: some;
  setModal: React.Dispatch<React.SetStateAction<some>>;
}
let module: any = null;
const MergeBookingModal: React.FC<Props> = (props) => {
  const { modal, setModal } = props;
  const [isLoading, setLoading] = React.useState(false);
  const [listItem, setListItem] = React.useState([]);
  const [bankTransferRequestCode, setBankTransferRequestCode] = React.useState<React.Key[]>([]);
  const dispatch = useAppDispatch();

  const [form] = Form.useForm();
  const item = modal.item;

  const handleCancel = () => {
    setModal({
      type: undefined,
      item: undefined,
      title: undefined,
    });
  };

  const onFinish = (params: some) => {
    getBankTransferRequests(params);
  };
  const columns: ColumnsType<some> = [
    {
      title: 'Mã đơn hàng',
      key: 'bookingId',
      dataIndex: 'bookingId',
      render: (text) => {
        return <span>{`${module == 'hotel' ? 'H' : 'F'}${text} `}</span>;
      },
    },
    {
      title: 'Mã giao dịch',
      key: 'bookingCode',
      dataIndex: 'bookingCode',
    },
    {
      title: 'Mã thanh toán',
      key: 'transactionCode',
      dataIndex: 'transactionCode',
    },
    {
      title: 'Tiền đã thanh toán',
      key: 'amount',
      dataIndex: 'amount',
      render: (text) => {
        return <span>{formatMoney(text)} </span>;
      },
    },
    {
      title: 'Tiền cần thanh toán',
      key: 'transferredAmount',
      dataIndex: 'transferredAmount',
      render: (text) => {
        return <span>{formatMoney(text)} </span>;
      },
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: some) => {
      setBankTransferRequestCode(selectedRowKeys);
    },
    getCheckboxProps: (record: some) => ({
      disabled: record.status !== 'waiting', // Column configuration not to be checked
      name: record?.transactionCode,
    }),
  };

  const getBankTransferRequests = async (params: some) => {
    setLoading(true);
    const bookingId = params.bookingId ? params.bookingId.replace(/\D/g, '') : null;
    const bookingPrefix = params.bookingId ? params.bookingId.replace(/[0-9]/g, '') : null;
    module = params.bookingId ? (bookingPrefix === 'H' ? 'hotel' : 'flight') : null;
    try {
      const { data } = await fetGetBankTransferRequests({
        ...params,
        module,
        bookingId,
      });
      if (data.code === 200) {
        const { bankTransferRequestList } = data.data;
        setListItem(bankTransferRequestList);
      } else {
        message.error(data.message);
      }
    } catch (error) {}
    setLoading(false);
  };

  const resolveBankTransferTransaction = async () => {
    setLoading(true);
    try {
      const { data } = await fetResolveBankTransferTransaction({
        bankTransferRequestCode: bankTransferRequestCode[0],
        transactionId: item.id,
      });
      if (data.code === 200) {
        message.success(data.message);
        handleCancel();
        dispatch(fetGetBankTransfer());
      } else {
        message.error(data.message);
      }
    } catch (error) {}
    setLoading(false);
  };

  React.useEffect(() => {
    form.resetFields();
    setListItem([]);
    setBankTransferRequestCode([]);
  }, [item]);

  return (
    <Modal
      closeIcon={<IconCloseOutline />}
      className='wrapperModal'
      visible={modal?.type == TYPE_MODAL_BANK_TRANSFER.MERGE_BOOKING}
      onCancel={handleCancel}
      footer={false}
      width={900}
      title={modal.title}
    >
      <Form
        form={form}
        initialValues={{
          bookingCode: undefined,
          bookingId: undefined,
          transactionCode: undefined,
        }}
        scrollToFirstError
        colon={false}
        className='form-modal'
        onFinish={onFinish}
      >
        <Row gutter={10}>
          <Col span={6}>
            <Form.Item name='bookingId'>
              <Input placeholder='Nhập mã đơn hàng' />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name='bookingCode'>
              <Input allowClear placeholder='Nhập mã giao dịch' />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name='transactionCode'>
              <Input allowClear placeholder='Nhập mã thanh toán' />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item>
              <Button
                loading={isLoading}
                htmlType='submit'
                type='primary'
                shape='round'
                className='submit-button'
              >
                Tìm kiếm
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div>
        <Table
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={listItem}
          loading={isLoading}
          pagination={false}
          rowSelection={{
            type: 'radio',
            ...rowSelection,
          }}
          style={{ marginBottom: '20px' }}
        />
        {!isEmpty(bankTransferRequestCode) && (
          <Row className='wrapperSubmitSms'>
            <Button onClick={handleCancel}>
              <FormattedMessage id='IDS_TEXT_SKIP' />
            </Button>
            <Button
              loading={isLoading}
              onClick={() => {
                Modal.confirm({
                  title: 'Xác nhận ghép đơn hàng',
                  content: 'Vui lòng xác nhận kỹ thông tin trước khi thêm mã đơn hàng!',
                  okText: 'Xác nhận',
                  cancelText: 'Hủy',
                  onOk() {
                    resolveBankTransferTransaction();
                  },
                });
              }}
              type='primary'
            >
              <FormattedMessage id='IDS_TEXT_UPDATE' />
            </Button>
          </Row>
        )}
      </div>
    </Modal>
  );
};
export default MergeBookingModal;
