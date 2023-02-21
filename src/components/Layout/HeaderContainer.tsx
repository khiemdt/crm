import { Avatar, Button, Layout, message, Popover } from 'antd';
import cookie from 'js-cookie';
import { useNavigate } from 'react-router-dom';

import {
  IconCamera,
  IconEmail,
  IconLogout,
  IconNotiHeader,
  IconVNTravelLogo,
} from '~/assets/index';
import { routes, TOKEN } from '~/utils/constants/constant';

import { setUserInfo } from '~/features/systems/systemSlice';
import { useAppDispatch, useAppSelector } from '~/utils/hook/redux';

import { FormattedMessage, useIntl } from 'react-intl';
import { logoutAuth, uploadImagePublic } from '~/apis/system';
import '~/components/Layout/layout.scss';
import { visibleLoading } from '~/features/flight/flightSlice';

const { Header } = Layout;

interface userInfo {
  name?: string;
}
interface UserInfo {
  roles?: Array<string>;
  emailInfo?: string;
  profilePhoto?: string;
  userInfo?: userInfo;
  nameNotNullOrEmpty?: string;
}

const HeaderContainer = () => {
  const intl = useIntl();
  let navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userInfo: UserInfo = useAppSelector((state) => state.systemReducer.userInfo);
  const collapsible: boolean = useAppSelector((state) => state.systemReducer.collapsible);

  const handleLogout = async () => {
    try {
      const { data } = await logoutAuth();
      if (data.code === 200) {
        dispatch(setUserInfo({}));
        cookie.remove(TOKEN);
        navigate(routes.LOGIN);
      }
    } catch (error) {}
  };

  const handleUploadFile = async (e: any) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const maxUpload = files[0].size / 1024 / 1024 <= 5;
      if (!files[0].name.match(/\.(jpg|jpeg|png)$/)) {
        message.error(intl.formatMessage({ id: 'IDS_TEXT_FILE_FORMAT_NOT_CORRECT' }));
        return null;
      }
      if (maxUpload) {
        const formData = new FormData();
        formData.append('file', files[0]);
        try {
          dispatch(visibleLoading(true));
          const dataUpload = await uploadImagePublic(formData);

          if (dataUpload.data.code === 200) {
            dispatch(visibleLoading(false));
            message.success(dataUpload?.data?.message);
          } else {
            message.error(dataUpload?.data?.message);
          }
        } catch (error) {
          console.log(error);
          dispatch(visibleLoading(false));
        }
      } else {
        dispatch(visibleLoading(false));
        message.error(intl.formatMessage({ id: 'IDS_TEXT_MAX_SIZE_IMG_5M' }));
      }
    }
  };

  const content = (
    <>
      <div className='content-user-info'>
        <Avatar src={userInfo?.profilePhoto} className='avatar-content' />
        <span className='name-user'>{userInfo?.userInfo?.name}</span>
        <span className='email-user'>{userInfo?.emailInfo}</span>
        <Button
          disabled
          onClick={() => {
            document?.getElementById('upload_file')?.click();
          }}
          type='text'
          className='icon-camera'
          icon={<IconCamera />}
        ></Button>
        <input
          type='file'
          style={{ display: 'none' }}
          id='upload_file'
          onChange={handleUploadFile}
          // onClick={(e) => {
          //   e?.target?.value = null;
          // }}
        />
      </div>
      <div className='item-menu-user' onClick={handleLogout}>
        <IconLogout />
        <span className='name-item-menu-user'>{intl.formatMessage({ id: 'IDS_TEXT_LOGOUT' })}</span>
      </div>
    </>
  );

  return (
    <Header className='header-container'>
      <div className='badge-header'>
        {/* tạm cmt vào sau có thể dùng lại */}
        {/* <IconMenu
          className='collapsible-menu'
          onClick={() => dispatch(visiblecollaps(!collapsible))}
        /> */}
        <IconVNTravelLogo />
      </div>
      <div className='badge-header'>
        <IconNotiHeader />
        <IconEmail />
        <Popover
          trigger='click'
          className='avatar-info'
          placement='bottomRight'
          overlayClassName='popover-userinfo'
          content={content}
        >
          <span>{userInfo?.nameNotNullOrEmpty} </span>
          <Avatar src={userInfo?.profilePhoto} />
        </Popover>
      </div>
    </Header>
  );
};

export default HeaderContainer;
