import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Table,
  Tabs,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  fetGetBankTransferRequests,
  fetResolveBankTransferTransaction,
  fetresolveCreditHolding,
  getHoldingCredit,
} from '~/apis/paymentSupport';
import { IconCloseOutline, IconDelete } from '~/assets';
import '~/features/flight/components/modal/modal.scss';
import { some } from '~/utils/constants/constant';
import { DATE_TIME_FORMAT } from '~/utils/constants/moment';
import { formatMoney, isEmpty } from '~/utils/helpers/helpers';
import { useAppDispatch } from '~/utils/hook/redux';
import { TYPE_MODAL_BANK_TRANSFER } from '../../constant';
import { fetGetBankTransfer, fetGetHoldingCredit } from '../../PaymentSlice';

interface Props {
  modal: some;
  setModal: React.Dispatch<React.SetStateAction<some>>;
}
let module: any = null;
const UnholdCreditModal: React.FC<Props> = (props) => {
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
      title: 'UserId',
      key: 'userId',
      dataIndex: 'userId',
    },
    {
      title: 'BookingId',
      key: 'bookingId',
      dataIndex: 'bookingId',
      render: (text, record) => {
        return (
          <span className='text-blue'>{`${record.module == 'flight' ? 'F' : 'H'}${text}`} </span>
        );
      },
    },
    {
      title: 'Số tiền giữ',
      key: 'amount',
      dataIndex: 'amount',
      render: (text) => {
        return <span>{formatMoney(text)} </span>;
      },
      align: 'right',
    },
    {
      title: 'Thời gian tạo',
      key: 'createdTime',
      dataIndex: 'createdTime',
      render: (text) => {
        return <span>{moment(text).format(DATE_TIME_FORMAT)} </span>;
      },
    },
    {
      title: 'Số dư',
      key: 'currentAvailable',
      dataIndex: 'currentAvailable',
      render: (text) => {
        return <span>{formatMoney(text)} </span>;
      },
      align: 'right',
    },
    {
      title: 'Chi tiết',
      key: 'description',
      dataIndex: 'description',
      width: 250,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
    },
    {
      title: 'Thao tác',
      key: 'status',
      render: (text, record) => {
        return (
          <Popconfirm
            placement='top'
            title='Bạn có chắc chắn muốn unhold?'
            onConfirm={() => {
              resolveCreditHolding(record);
            }}
            okText='Ok'
            cancelText='Hủy'
          >
            <Button htmlType='submit' type='primary'>
              Unhold
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  const getBankTransferRequests = async (params: some) => {
    setLoading(true);
    try {
      const { data } = await getHoldingCredit({
        ...params,
      });
      if (data.code === 200) {
        setListItem(data.data);
      } else {
        message.error(data.message);
      }
    } catch (error) {}
    setLoading(false);
  };

  const resolveCreditHolding = async (params: some) => {
    setLoading(true);
    try {
      const { data } = await fetresolveCreditHolding({
        creditHoldingId: params.id,
        bookingStatus: params.bookingStatus,
      });
      if (data.code === 200) {
        message.success(data.message);
        getBankTransferRequests(form.getFieldsValue(true));
      } else {
        message.error(data.message);
      }
    } catch (error) {}
    setLoading(false);
  };

  React.useEffect(() => {
    form.resetFields();
  }, [item]);

  return (
    <Modal
      closeIcon={<IconCloseOutline />}
      className='wrapperModal'
      visible={modal?.type == 'unhold'}
      onCancel={handleCancel}
      footer={false}
      width={1000}
      title={modal.title}
    >
      <Form
        form={form}
        initialValues={{
          userId: undefined,
          bookingId: undefined,
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
            <Form.Item name='userId'>
              <Input allowClear placeholder='Nhập userId' />
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
          style={{ marginBottom: '20px' }}
        />
      </div>
    </Modal>
  );
};
export default UnholdCreditModal;
