import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LAST_LINK_PREVIEW, routes } from '~/utils/constants/constant';

const Dashboard = () => {
  let navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem(LAST_LINK_PREVIEW)) {
      navigate(localStorage.getItem(LAST_LINK_PREVIEW) || routes.DASHBOARD);
    }
  }, []);
  return <h2></h2>;
};
export default Dashboard;
