import { RouterProvider } from 'react-router-dom';
import { router } from './router';

export default function RoutesWrapper() {
  return <RouterProvider router={router} />;
}
