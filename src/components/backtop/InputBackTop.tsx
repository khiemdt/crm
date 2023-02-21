import { BackTop } from 'antd';
import * as React from 'react';
import { IconCaretUp } from '~/assets';
import './InputBackTop.scss';

interface IInputBackTopProps {}

const InputBackTop: React.FunctionComponent<IInputBackTopProps> = (props) => {
  return (
    <BackTop>
      <div className='common-btn-scroll-top'>
        <IconCaretUp />
      </div>
    </BackTop>
  );
};

export default InputBackTop;
