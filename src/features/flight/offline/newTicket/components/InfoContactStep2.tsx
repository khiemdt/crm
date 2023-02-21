import { Col, Form, Input, Row, Select } from 'antd';
import { useIntl } from 'react-intl';
import { some } from '~/utils/constants/constant';
import { listGenderContact } from '~/utils/constants/dataOptions';
import { IconChevronDown } from '~/assets';

const InfoContactStep2 = (props: some) => {
  const form = Form.useFormInstance();
  const intl = useIntl();
  return (
    <>
      <h2 style={{ margin: '32px 0 12px' }}>Thông tin liên hệ</h2>
      <div className='item-info-container'>
        <Row gutter={16}>
          <Col span={4}>
            <div style={{ marginBottom: 4 }}>Danh xưng</div>
            <Form.Item
              name={['contact', 'title']}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                },
              ]}
            >
              <Select
                placeholder='Chọn'
                suffixIcon={<IconChevronDown />}
                optionFilterProp='children'
              >
                {listGenderContact.map((el: some, indx: number) => (
                  <Select.Option key={indx} value={el.id}>
                    {el.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <div style={{ marginBottom: 4 }}>Họ</div>
            <Form.Item
              name={['contact', 'firstName']}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                },
              ]}
            >
              <Input placeholder='Nhập' />
            </Form.Item>
          </Col>
          <Col span={5}>
            <div style={{ marginBottom: 4 }}>Tên</div>
            <Form.Item
              name={['contact', 'lastName']}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                },
              ]}
            >
              <Input placeholder='Nhập' />
            </Form.Item>
          </Col>
          <Col span={5}>
            <div style={{ marginBottom: 4 }}>Email</div>
            <Form.Item
              name={['contact', 'email']}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'IDS_TEXT_REQUIRED' }),
                },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input placeholder='Nhập' />
            </Form.Item>
          </Col>
          <Col span={5}>
            <div style={{ marginBottom: 4 }}>Số điện thoại</div>
            <Form.Item
              name={['contact', 'phone']}
              wrapperCol={{ span: 24 }}
              rules={[
                { required: true, whitespace: true, message: 'Vui lòng nhập số điện thoại!' },
                {
                  max: 12,
                  message: 'Số điện thoại tối đa 12 kí tự',
                },
                {
                  pattern: /^[0-9+]*$/,
                  message: 'Số điện thoại không hợp lệ',
                },
              ]}
            >
              <Input placeholder='Nhập' />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default InfoContactStep2;
