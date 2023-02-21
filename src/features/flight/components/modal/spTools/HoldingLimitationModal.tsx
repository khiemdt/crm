import { Button, Col, Form, Input, message, Modal, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { changeLimitation, checkHoldingHistory } from '~/apis/paymentSupport';
import { IconCloseOutline } from '~/assets';
import '~/features/flight/components/modal/modal.scss';
import { DEFAULT_PAGING } from '~/features/flight/constant';
import { AllowAgentType } from '~/features/systems/systemSlice';
import { some } from '~/utils/constants/constant';
import { DATE_TIME_FORMAT } from '~/utils/constants/moment';
import { useAppSelector } from '~/utils/hook/redux';

interface Props {
  modal: some;
  setModal: React.Dispatch<React.SetStateAction<some>>;
}
let timeoutSearch: any = null;

let module: any = null;
const HoldingLimitationModal: React.FC<Props> = (props) => {
  const { modal, setModal } = props;
  const [isLoading, setLoading] = React.useState(false);
  const [listItem, setListItem] = React.useState([]);
  const [options, setOptions] = React.useState<{ value: string }[]>([]);
  const allowAgents: AllowAgentType[] = useAppSelector((state) => state.systemReducer.allowAgents);

  const [form] = Form.useForm();
  const intl = useIntl();
  const item = modal.item;
  const { Search } = Input;

  const onSearch = async (id: string) => {
    setLoading(true);
    const params = {
      bookerId: id,
      page: DEFAULT_PAGING.page,
      size: DEFAULT_PAGING.pageSize,
    };
    try {
      const { data } = await checkHoldingHistory({
        ...params,
      });
      if (data.code === 200) {
        form.setFieldsValue({
          ...data?.data?.limitation,
          lastModifierName: data?.data?.lastModifierName,
          updatedAt: moment(data?.data?.limitation?.updatedAt).format(DATE_TIME_FORMAT),
        });
        setListItem(data?.data?.bookings);
      } else {
        form.resetFields();
        setListItem([]);
        message.error(data.message);
      }
    } catch (error) {}
    setLoading(false);
  };

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
      key: 'id',
      dataIndex: 'id',
      render: (text, record) => {
        return (
          <span className='text-blue'>{`${record.module == 'flight' ? 'F' : 'H'}${text}`} </span>
        );
      },
    },
    {
      title: 'Số khách',
      key: 'guests',
      dataIndex: 'guests',
      render: (text, record) => {
        return <span className='text-blue'>{text?.length} </span>;
      },
    },
    {
      title: 'Thời gian cập nhật',
      key: 'expiredTime',
      dataIndex: 'expiredTime',
    },
    {
      title: 'Thời gian tạo',
      key: 'created',
      dataIndex: 'created',
    },
  ];

  const getBankTransferRequests = async (values: some) => {
    setLoading(true);
    const params = {
      bookerId: values.userId,
      maxBooking: values.maxBooking,
      maxPax: values.maxPax,
    };
    try {
      const { data } = await changeLimitation({
        ...params,
      });
      if (data.code === 200) {
        message.success('Cập nhật thành công');
      } else {
        message.error(data.message);
      }
    } catch (error) {}
    setLoading(false);
  };

  React.useEffect(() => {
    form.resetFields();
    setListItem([]);
  }, [modal]);

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
          lastModifierName: undefined,
          maxBooking: undefined,
          maxPax: undefined,
          updatedAt: undefined,
          caId: 1,
          bookerId: undefined,
          term: undefined,
        }}
        scrollToFirstError
        colon={false}
        layout='vertical'
        onFinish={onFinish}
      >
        <Row gutter={12} style={{ marginBottom: 18 }}>
          <Col span={7}>
            <Form.Item name='term'>
              <Search placeholder='Nhập Id khách hàng' onSearch={onSearch} enterButton />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={4}>
            <Form.Item name='userId' label='ID khách hàng'>
              <Input type='text' disabled />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name='maxPax' label='Số Pax tối đa'>
              <Input type='number' min={0} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name='maxBooking' label='Số đơn tối đa'>
              <Input type='number' min={0} />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name='updatedAt' label='Thời gian cập nhật'>
              <Input type='text' disabled />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name='lastModifierName' label='Lần sửa cuối'>
              <Input type='text' disabled />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label=' '
              shouldUpdate={(prevValues, curValues) => prevValues.userId !== curValues.userId}
            >
              {() => (
                <Button
                  loading={isLoading}
                  htmlType='submit'
                  type='primary'
                  shape='round'
                  className='submit-button'
                  disabled={!form.getFieldValue('userId')}
                >
                  Lưu
                </Button>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div>
        <b>Top 10 booking gần đây</b>
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
export default HoldingLimitationModal;
