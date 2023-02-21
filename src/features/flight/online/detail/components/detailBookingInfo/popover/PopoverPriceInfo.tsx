import { Divider, Popover, Row } from 'antd';
import { FC, useState } from 'react';
import { IconCloseOutline, IconEdit, IconInfoHover } from '~/assets';
import { some } from '~/utils/constants/constant';

interface InOutBoundType {
  title: string;
  content: some;
  children: any;
}

interface contentChild {
  name: string;
  value?: string;
  divider?: boolean;
  element?: any;
  class?: string;
}

const PopoverPriceInfo: FC<InOutBoundType> = (props: some) => {
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
            (el: contentChild, indx: number) =>
              el.value && (
                <Row key={indx}>
                  <Row className='popover-ct-content'>
                    <span className='name'>{el.name}:</span>
                    <span className={`gap-4-center ${el.class}`}>
                      {el.value}
                      {el?.element && (
                        <Row>
                          <el.element />
                        </Row>
                      )}
                    </span>
                  </Row>
                  {el.divider && <Divider style={{ margin: '0px 0px 10px' }} />}
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
      placement='leftBottom'
      trigger='click'
      visible={visible}
      onVisibleChange={handleVisibleChange}
    >
      {/* <IconEdit className='pointer' /> */}
      {children}
    </Popover>
  );
};
export default PopoverPriceInfo;
