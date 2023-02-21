import { Popover, Row } from 'antd';
import { FC, useState } from 'react';
import { IconCloseOutline, IconInfoHover } from '~/assets';
import { some } from '~/utils/constants/constant';

interface InOutBoundType {
  title?: string;
  content?: some;
  children?: any;
}

const PopoverInfo: FC<InOutBoundType> = (props: some) => {
  const { title, content, children } = props;
  const [visible, setVisible] = useState(false);
  const hide = () => {
    setVisible(false);
  };
  const handleVisibleChange = (newVisible: boolean) => {
    setVisible(newVisible);
  };
  const items = (
    <>
      <div className='popover-ct-info'>
        <Row className='popover-ct-title'>
          <b>{title}</b>
          <IconCloseOutline onClick={hide} style={{ cursor: 'pointer' }} />
        </Row>
        <div>
          {content?.map(
            (el: any, indx: number) =>
              el.value && (
                <Row key={indx} className='popover-ct-content'>
                  <span className='name'>{el.name}:</span>
                  <span className={el.class}>
                    {typeof el.value === 'object'
                      ? el.value?.name + ' - ' + el.value?.phone
                      : el.value}
                  </span>
                </Row>
              ),
          )}
        </div>
      </div>
    </>
  );
  return (
    <Popover
      content={items}
      trigger='click'
      visible={visible}
      onVisibleChange={handleVisibleChange}
    >
      {children}
    </Popover>
  );
};
export default PopoverInfo;
