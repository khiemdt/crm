import { Button, Col, message, Select } from 'antd';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import GoogleLogin from 'react-google-login';
import { FormattedMessage, useIntl } from 'react-intl';
import { getAvailableAgents, loginAccountViaFbGg } from '~/apis/system';
import { IconDownArrow, IconGoogle } from '~/assets';
import { visibleLoading } from '~/features/systems/systemSlice';
import { LAST_LINK_PREVIEW, routes, TOKEN } from '~/utils/constants/constant';
import { useAppDispatch } from '~/utils/hook/redux';

const { Option } = Select;

import { useNavigate } from 'react-router-dom';
import '~/features/login/login.scss';

const LoginViaGG = () => {
  const intl = useIntl();
  let navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [caId, setCaId] = useState<number | null>(1);
  const [caList, setCaList] = useState<[]>([]);

  useEffect(() => {
    getCaList();
  }, []);
  const handleChange = (value: number) => {
    setCaId(value);
  };
  const responseOnFailureGoogle = () => {};
  const handleOauth = async (response: any) => {
    try {
      const headers = {
        caId,
      };
      const dataViaFbGg = {
        accessToken: response.tokenId || '',
        type: 'GOOGLE',
      };
      dispatch(visibleLoading(true));
      const { data } = await loginAccountViaFbGg(dataViaFbGg, headers);
      if (data.code === 200) {
        Cookies.set(TOKEN, data?.access_token, { expires: 182 });
        if (localStorage.getItem(LAST_LINK_PREVIEW)) {
          navigate(localStorage.getItem(LAST_LINK_PREVIEW) || routes.DASHBOARD);
        } else {
          navigate(routes.DASHBOARD);
        }
      } else {
        data?.message && message.error(data?.message);
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'IDS_TEXT_ERR_MESS' }));
    } finally {
      dispatch(visibleLoading(false));
    }
  };
  const getCaList = async () => {
    try {
      const { data } = await getAvailableAgents();
      if (data.code === 200) {
        setCaList(data?.data);
      } else {
        data?.message && message.error(data?.message);
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'IDS_TEXT_ERR_MESS' }));
    } finally {
    }
  };
  return (
    <Col className='select-company'>
      <span className='via-login-company'>
        <FormattedMessage id='IDS_TEXT_COMPANY' />
      </span>
      <Select
        suffixIcon={<IconDownArrow />}
        className='via-login-select'
        defaultValue={caId}
        onChange={handleChange}
      >
        {caList.map((item: any) => (
          <Option value={item?.id} {...item} key={item?.id}>
            {item?.name}
          </Option>
        ))}
      </Select>

      <GoogleLogin
        clientId={import.meta.env.VITE_GG_PLUS_ID}
        buttonText='Login'
        onSuccess={handleOauth}
        onFailure={responseOnFailureGoogle}
        cookiePolicy={'single_host_origin'}
        render={(renderProps) => (
          <Button className='via-login-gg' icon={<IconGoogle />} onClick={renderProps.onClick}>
            <FormattedMessage id='IDS_TEXT_GG_LOGIN' />
          </Button>
        )}
      />
    </Col>
  );
};

export default LoginViaGG;
