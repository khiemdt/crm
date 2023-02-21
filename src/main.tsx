import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import App from './App';
import '~/index.scss';
import { store } from '~/utils/redux/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
