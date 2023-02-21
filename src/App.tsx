import 'antd/dist/antd.css';
import 'antd/dist/antd.variable.min.css';
import { BrowserRouter } from 'react-router-dom';

import LocaleProvider from '~/utils/localeProvider/LocaleProvider';

import Routes from '~/Routes';

import '~/App.scss';

function App() {
  return (
    <LocaleProvider>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </LocaleProvider>
  );
}

export default App;
