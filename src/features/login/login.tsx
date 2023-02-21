import { Col, Row } from 'antd';
import { FormattedMessage } from 'react-intl';

import { LogoLogin } from '~/assets';
import LoginViaGG from '~/features/login/components/LoginViaGG';

import '~/features/login/login.scss';
import { listImg } from '~/utils/constants/constant';

const Login = () => {
  return (
    <>
      <Row>
        <Col span={12}>
          <div className='via-login-content'>
            <img src={LogoLogin} alt='anh logo login' />
            <span className='title-login'>
              <FormattedMessage id='IDS_TEXT_WELCOME_BACK'/>
            </span>
            <LoginViaGG />
          </div>
        </Col>
        <Col span={12}>
          <img className='via-login-img' src={listImg.bannerLoginUrl} alt='anh banner login' />
        </Col>
      </Row>
    </>
  );
};

export default Login;
