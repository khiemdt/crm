import 'moment/dist/locale/vi';
import { FC, ReactNode } from 'react';
import { ConfigProvider, message } from 'antd';
import { IntlProvider } from 'react-intl';
import vi_VN from 'antd/lib/locale-provider/vi_VN';
import en_US from 'antd/lib/locale-provider/en_US';

import vi from '~/utils/locales/vi.json';
import en from '~/utils/locales/en.json';
import { useAppSelector } from '~/utils/hook/redux';
import moment from 'moment';
import localeVi from 'antd/es/locale/vi_VN';

moment.locale('vi');

import colors from '../../scss/variables.module.scss';

const getLocale = (locale: string) => ({
  locale,
  messages: locale === 'en' ? en : vi,
});

interface SomeComponentProps {
  children: ReactNode;
}

ConfigProvider.config({
  theme: {
    primaryColor: colors.primaryColor,
  },
  prefixCls: 'ant',
  iconPrefixCls: 'anticon',
});

message.config({
  top: 56,
  duration: 4,
  maxCount: 3,
});

const LocaleComponent: FC<SomeComponentProps> = ({ children }) => {
  const locale1 = useAppSelector((state) => state.systemReducer.locale);

  return (
    <IntlProvider {...getLocale(locale1)}>
      <ConfigProvider locale={localeVi}>{children}</ConfigProvider>
    </IntlProvider>
  );
};

export default LocaleComponent;
