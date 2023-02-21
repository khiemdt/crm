import { Button, Col, Drawer, Form, message, Row, Space, Spin } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useEffect, useState } from 'react';
import { createFlightBookingNote, getFlightBookingNote } from '~/apis/flight';
import { IconCloseNoneCycle, IconExpand } from '~/assets';
import { some } from '~/utils/constants/constant';
import { useAppSelector } from '~/utils/hook/redux';

const titleList = [
  { id: '_booking_content', name: 'Nội dung đơn hàng', ref: 'BookingContent' },
  { id: '_ticket_content', name: 'Nội dung xuất vé', ref: 'TicketContent' },
  { id: '_ticket_policies', name: 'Điều kiện vé', ref: 'TicketPolicies' },
];

const BookingRemarkAndPolicy = () => {
  const booking = useAppSelector((state) => state.flightReducer.flightOnlineDetail);
  const [itemData, setItemData] = useState({});
  const [form] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<some>({
    type: undefined,
    item: undefined,
    title: undefined,
  });

  const handleClose = () => {
    form.resetFields();
    setModal({
      type: undefined,
      item: undefined,
      title: undefined,
    });
  };

  const fetGetBookingNotes = async () => {
    setLoading(true);
    try {
      const { data } = await getFlightBookingNote({
        bookingId: booking?.id || null,
        module: 'flight',
      });
      if (data.code === 200) {
        setItemData(data?.data);
      } else {
        message?.error(data?.message);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetUpdateBookingNote = async (params: any) => {
    setLoading(true);
    try {
      const { data } = await createFlightBookingNote({
        ...params,
        module: 'flight',
        bookingId: booking.id,
      });
      if (data.code === 200) {
        message?.success('Ghi nhận thành công');
        handleClose();
        fetGetBookingNotes();
      } else {
        message?.error(data?.message);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const BookingRemarkContent = (props: any) => {
    const { type, item } = props;
    if (!item) {
      return <></>;
    }
    return (
      <Row gutter={12}>
        {titleList.map((el: some) => (
          <Col span={8}>
            <Form
              initialValues={{
                content: item[`${type}${el.ref}`],
                type: `${type}${el.id}`,
              }}
              onFinish={fetUpdateBookingNote}
            >
              <Row align='middle' justify='space-between'>
                <Space>
                  <b>{`${el.name} ${type == 'outbound' ? 'chiều đi' : 'chiều về'}`}</b>
                  <IconExpand
                    className='text-blue'
                    onClick={() => {
                      setModal({
                        type: `${type}${el.id}`,
                        item: item[`${type}${el.ref}`],
                        title: `${el.name} ${type == 'outbound' ? 'chiều đi' : 'chiều về'}`,
                      });
                    }}
                    height={14}
                  />
                </Space>
                <Form.Item name='type' hidden>
                  <TextArea />
                </Form.Item>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    htmlType='submit'
                    className='text-blue'
                    style={{ paddingRight: 0 }}
                    type='text'
                  >
                    Ghi nhận
                  </Button>
                </Form.Item>
              </Row>
              <Form.Item name='content'>
                <TextArea rows={4} />
              </Form.Item>
            </Form>
          </Col>
        ))}
      </Row>
    );
  };

  useEffect(() => {
    fetGetBookingNotes();
  }, []);

  if (loading) {
    return (
      <Spin tip='Loading...'>
        <div style={{ height: 325 }}></div>
      </Spin>
    );
  }

  return (
    <div>
      <BookingRemarkContent item={itemData} type={'outbound'} />
      {booking.inbound && <BookingRemarkContent item={itemData} type={'inbound'} />}
      <BookingNotesDrawer
        fetUpdateBookingNote={fetUpdateBookingNote}
        modal={modal}
        setModal={setModal}
        loading={loading}
        handleClose={handleClose}
      />
    </div>
  );
};

export default BookingRemarkAndPolicy;

const BookingNotesDrawer = (props: any) => {
  const { modal, setModal, fetUpdateBookingNote, loading, handleClose } = props;
  const [form] = Form.useForm();
  const title = (
    <div className='header-detail'>
      <span>{modal.title} </span>
      <IconCloseNoneCycle
        style={{ cursor: 'pointer' }}
        onClick={() => {
          handleClose();
        }}
      />
    </div>
  );
  useEffect(() => {
    form.resetFields();
  }, [modal]);

  return (
    <Drawer
      title={title}
      placement='right'
      onClose={() => {
        handleClose();
      }}
      closable={false}
      visible={modal.type}
      width={400}
      className='drawer-arise-detail'
    >
      <>
        <Form
          form={form}
          initialValues={{
            content: modal.item,
            type: modal.type,
          }}
          onFinish={fetUpdateBookingNote}
        >
          <Form.Item name='type' hidden>
            <TextArea />
          </Form.Item>
          <Form.Item name='content'>
            <TextArea rows={40} />
          </Form.Item>
          <Form.Item>
            <Button htmlType='submit' type='primary' className='send-note' loading={loading}>
              Ghi nhận
            </Button>
          </Form.Item>
        </Form>
      </>
    </Drawer>
  );
};
