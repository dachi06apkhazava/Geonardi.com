import { useEffect } from 'react';
import { useDataContext } from './DataContext';

const AdminRedirect = () => {
  const { baseUrl } = useDataContext();

  useEffect(() => {
    window.location.replace(`${baseUrl}/admin`);
  }, [baseUrl]);

  return null;
};

export default AdminRedirect;
