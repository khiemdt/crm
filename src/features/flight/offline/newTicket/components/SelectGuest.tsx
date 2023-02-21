import { Button, Form, Input, Row } from 'antd';
import { IconMinus, IconPlus } from '~/assets';

const guestInfo = [
  {
    type: 'numAdults',
    name: 'Người lớn',
    des: 'Trên 18 tuổi',
  },
  {
    type: 'numChildren',
    name: 'Trẻ em',
    des: '12 đến 18',
  },
  {
    type: 'numInfants',
    name: 'Em bé',
    des: 'Dưới 2 tuổi',
  },
];

const SelectGuest = () => {
  const form = Form.useFormInstance();
  const handleChangeGuest = (type: string, typeValue: string) => {
    const currentValue = form.getFieldValue(typeValue);
    form.setFieldsValue({
      [typeValue]: type === 'plus' ? currentValue + 1 : currentValue - 1,
    });
  };

  const checkDisable = (type: string) => {
    if (
      form.getFieldValue(type) === 0 ||
      (form.getFieldValue(type) === 1 && type === 'numAdults')
    ) {
      return true;
    }
    return false;
  };

  return (
    <div className='guest-select'>
      <h3>Hành khách</h3>
      {guestInfo.map((guest, inx: number) => (
        <Row key={inx}>
          <div key={guest.type} className='item-packet'>
            <div>
              <span>{guest.name}</span>
              <br />
              <span className='text-grey'>{guest.des}</span>
            </div>
            <div className='action-right'>
              <Button
                className='icon-btn'
                type='primary'
                shape='circle'
                icon={<IconMinus />}
                onClick={() => handleChangeGuest('minus', guest.type)}
                disabled={checkDisable(guest.type)}
              />
              <span className='value-item'>{form.getFieldValue(guest.type)}</span>
              <Button
                className='icon-btn'
                type='primary'
                shape='circle'
                icon={<IconPlus />}
                onClick={() => handleChangeGuest('plus', guest.type)}
              />
            </div>
            <Form.Item name={guest.type} style={{ display: 'none' }}>
              <Input />
            </Form.Item>
          </div>
        </Row>
      ))}
    </div>
  );
};
export default SelectGuest;
