import { Button, Col, Form, Input, InputNumber, message, Modal, Row } from 'antd';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { fetchEditUserOfBooking, fetchLookupUserBy } from '~/apis/flight';
import { SUCCESS_CODE } from '~/features/flight/constant';
import { some } from '~/utils/constants/constant';
import { isEmpty } from '~/utils/helpers/helpers';

interface Props {
  modal: boolean;
  setModal: any;
  data?: some;
}

const ChangeCustomer: React.FC<Props> = ({ modal, setModal, data }) => {
  const [form] = Form.useForm();
  const [isDisableSearch, setIsDisableSearch] = useState(true);
  const [userSearch, setUserSearch] = useState<some[]>([]);
  const [isLoading, setLoading] = useState(false);

  const handleClose = () => {
    setModal(false);
  };

  const lookupUser = async () => {
    const params = { ...form.getFieldsValue() };
    let item: any = [];
    try {
      const { data } = await fetchLookupUserBy(params);
      if (data.code === SUCCESS_CODE) {
        const dataOP = data.data;
        form.setFieldsValue({
          id: dataOP.id,
        });
        item = [
          {
            name: 'Id',
            value: dataOP.id,
          },
          {
            name: 'Tên',
            value: dataOP.name,
          },
          {
            name: 'Booker',
            value: dataOP.moduleBooker ? 'Yes' : 'No',
          },
          {
            name: 'Số điện thoại',
            value: dataOP.phoneInfo,
          },
          {
            name: 'Người hỗ trợ',
            value: dataOP?.supporter
              ? `${dataOP?.supporter?.email} -  ${dataOP?.supporter?.phone}`
              : undefined,
          },
        ];
      } else {
        message.error(data?.message);
      }
    } catch (error) {
    } finally {
      setUserSearch(item);
    }
  };

  const onFinish = async (values: some) => {
    setLoading(true);
    delete values?.phoneNumber;
    const params = { ...values, bookingId: data?.id };
    try {
      const { data } = await fetchEditUserOfBooking(params);
      if (data.code === SUCCESS_CODE) {
        message.success(data.message);
        handleClose();
      } else {
        message.error(data?.message);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      className='wrapperModal'
      visible={modal}
      onCancel={handleClose}
      footer={false}
      width={515}
      title='Thay đổi khách hàng'
    >
      <Form
        form={form}
        className='filter-form-flight'
        initialValues={{
          caId: data?.caInfo?.id,
          id: undefined,
          phoneNumber: undefined,
        }}
        scrollToFirstError
        colon={false}
        onValuesChange={(_, allValues) => {
          setIsDisableSearch(!allValues.id && !allValues.phoneNumber);
        }}
        onFinish={onFinish}
      >
        <Row gutter={12}>
          <Form.Item name='caId' hidden>
            <Input />
          </Form.Item>
          <Col>
            <Form.Item name='id'>
              <InputNumber onPressEnter={lookupUser} placeholder='Nhập id khách hàng ' />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name='phoneNumber'>
              <Input onPressEnter={lookupUser} placeholder='Nhập sdt khách hàng ' />
            </Form.Item>
          </Col>
          <Form.Item>
            <Col>
              <div className='action-form'>
                <Button type='primary' onClick={lookupUser} disabled={isDisableSearch}>
                  Tìm kiếm
                </Button>
              </div>
            </Col>
          </Form.Item>
        </Row>
        {!isEmpty(userSearch) && (
          <>
            <div className='border-info-customer'>
              {userSearch.map(
                (el: some) =>
                  el.value && (
                    <Row>
                      <Col span={12}>{el?.name} </Col>
                      <Col span={12}>
                        <b>{el?.value}</b>
                      </Col>
                    </Row>
                  ),
              )}
            </div>
            <div className='wrapperSubmitSms'>
              <Button onClick={() => handleClose()}>
                <FormattedMessage id='IDS_TEXT_SKIP' />
              </Button>
              <Form.Item shouldUpdate className='buttonSubmit'>
                {() => (
                  <Button type='primary' htmlType='submit' loading={isLoading}>
                    <FormattedMessage id='IDS_TEXT_ACCEPT' />
                  </Button>
                )}
              </Form.Item>
            </div>
          </>
        )}
      </Form>
    </Modal>
  );
};
export default ChangeCustomer;
