import { FC, useEffect } from 'react';
import { Modal, Form, Row, Button, Space, message, Input } from 'antd';
import './Reconciliation.scss';
import { useParams } from 'react-router-dom';
import { IconCloseNoneCycle } from '~/assets/index';
import { addNotes } from '~/apis/flight';

type Props = {
  modal: boolean;
  setModal: any;
  getData: any;
};
interface Params {
  id?: string;
}

const AddNote: FC<Props> = (props) => {
  const { modal, setModal, getData } = props;
  const [form] = Form.useForm();
  const { id } = useParams();

  const handleCancel = () => {
    setModal(false);
  };

  useEffect(() => {
    if (modal) {
      form.resetFields();
    }
  }, [modal]);

  const onFinish = async (values: any) => {
    try {
      const { data } = await addNotes({
        ...values,
        module: 'flight',
        noteType: 'reconcile_error_tags',
        referenceId: id,
      });
      if (data.code === 200) {
        getData();
        handleCancel();
        message.success('Thực hiện thành công!');
      }
    } catch (error) {}
  };

  return (
    <Modal
      width={550}
      title='Thêm ghi chú cho lỗi đối soát'
      visible={modal}
      onCancel={handleCancel}
      className='modal-edit-po'
      footer={false}
      closeIcon={<IconCloseNoneCycle />}
    >
      <Form
        form={form}
        className='form-create-ticket'
        scrollToFirstError
        colon={false}
        onFinish={onFinish}
        labelCol={{ span: 0 }}
        wrapperCol={{ span: 24 }}
        initialValues={{
          content: '',
        }}
      >
        <div>Nội dung</div>
        <Form.Item name='content'>
          <Input.TextArea
            rows={4}
            style={{ width: '100%' }}
            placeholder='Thêm nội dung tại đây'
            showCount
            maxLength={1000}
          />
        </Form.Item>
        <Row justify='end'>
          <Space size={12}>
            <Button style={{ width: 90 }} onClick={handleCancel}>
              Huỷ
            </Button>
            <Button style={{ width: 90 }} type='primary' htmlType='submit'>
              Xác nhận
            </Button>
          </Space>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddNote;
