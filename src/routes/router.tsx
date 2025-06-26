import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/layout/Layout';
import LoginWithPassword from '@/pages/Login/LoginWithPassword';
import StartAssessment from '@/pages/StartAssessment';
import PrivateRoutes from './private-routes';
import NotFound from '@/pages/404';
import LoginWithOneId from '@/pages/Login/LoginWithOneId';
import Indicators from '@/pages/Settings/Indicators/Indicators';
import AssessmentResults from '@/pages/AssessmentResults';
import IndicatorTypes from '@/pages/Settings/IndicatorTypes';
import Users from '@/pages/Settings/Users';
import OrganizationsList from '@/pages/Settings/OrganizationsList';
import Home from '@/pages/Home';
// import OngoingAssessments from '@/pages/OngoingAssessments';
// import Checklist from '@/pages/Checklist';
// import Checklists from '@/pages/Settings/Checklists';
import QuestionsList from '@/pages/Settings/QuestionsList';
import Questions from '@/pages/Questions';
import Auth from '@/pages/Login/Auth';
import Organizations from '@/pages/Organizations';
import AssessmentDetails from '@/pages/AssessmentDetails';
import Forbidden from '@/pages/403';
import RoleGuard from '@/shared/components/RoleGuard';
import {
  _RESPONSIBLE,
  _SUPER_ADMIN,
  _READ_ONLY,
  _AUTHORITY,
  _TERRITORIAL_RESPONSIBLE,
} from '@/service/const/roles';
import AOKAOrganizations from '@/pages/Settings/AOKAOrganizations';

export const router = createBrowserRouter([
  {
    element: <PrivateRoutes />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: '/',
            element: (
              <RoleGuard
                allowedRoles={[_RESPONSIBLE, _TERRITORIAL_RESPONSIBLE, _SUPER_ADMIN, _READ_ONLY]}
              >
                <Home />
              </RoleGuard>
            ),
          },
          {
            path: '/start-assessments',
            element: (
              <RoleGuard allowedRoles={[_RESPONSIBLE, _TERRITORIAL_RESPONSIBLE, _SUPER_ADMIN]}>
                <StartAssessment />
              </RoleGuard>
            ),
          },
          // {
          //   path: '/ongoing-assessments',
          //   element: (
          //     <RoleGuard allowedRoles={[_RESPONSIBLE, _TERRITORIAL_RESPONSIBLE, _SUPER_ADMIN]}>
          //       <OngoingAssessments />
          //     </RoleGuard>
          //   ),
          // },
          {
            path: '/assessment-results',
            element: (
              <RoleGuard
                allowedRoles={[_RESPONSIBLE, _TERRITORIAL_RESPONSIBLE, _SUPER_ADMIN, _READ_ONLY]}
              >
                <AssessmentResults />
              </RoleGuard>
            ),
          },
          {
            path: '/organizations',
            element: (
              <RoleGuard
                allowedRoles={[_RESPONSIBLE, _TERRITORIAL_RESPONSIBLE, _SUPER_ADMIN, _READ_ONLY]}
              >
                <Organizations />
              </RoleGuard>
            ),
          },
          // {
          //   path: '/checklist',
          //   element: (
          //     <RoleGuard allowedRoles={[_SUPER_ADMIN, _AUTHORITY]}>
          //       <Checklist />
          //     </RoleGuard>
          //   ),
          // },
          {
            path: '/normative-documents',
            element: (
              <RoleGuard allowedRoles={[_SUPER_ADMIN, _AUTHORITY]}>
                <Questions />
              </RoleGuard>
            ),
          },
          {
            path: '/assessment-details/:id',
            element: (
              <RoleGuard
                allowedRoles={[_RESPONSIBLE, _TERRITORIAL_RESPONSIBLE, _SUPER_ADMIN, _READ_ONLY]}
              >
                <AssessmentDetails />
              </RoleGuard>
            ),
          },
          {
            path: '/settings/indicators',
            element: (
              <RoleGuard allowedRoles={[_SUPER_ADMIN]}>
                <Indicators />
              </RoleGuard>
            ),
          },
          {
            path: '/settings/indicator-types',
            element: (
              <RoleGuard allowedRoles={[_SUPER_ADMIN]}>
                <IndicatorTypes />
              </RoleGuard>
            ),
          },
          {
            path: '/settings/users',
            element: (
              <RoleGuard allowedRoles={[_SUPER_ADMIN]}>
                <Users />
              </RoleGuard>
            ),
          },
          {
            path: '/settings/organizations',
            element: (
              <RoleGuard allowedRoles={[_SUPER_ADMIN]}>
                <OrganizationsList />
              </RoleGuard>
            ),
          },
          {
            path: '/settings/aoka-organizations',
            element: (
              <RoleGuard allowedRoles={[_SUPER_ADMIN]}>
                <AOKAOrganizations />
              </RoleGuard>
            ),
          },
          // {
          //   path: '/settings/checklists',
          //   element: (
          //     <RoleGuard allowedRoles={[_SUPER_ADMIN]}>
          //       <Checklists />
          //     </RoleGuard>
          //   ),
          // },
          {
            path: '/settings/normative-documents',
            element: (
              <RoleGuard allowedRoles={[_SUPER_ADMIN]}>
                <QuestionsList />
              </RoleGuard>
            ),
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <LoginWithOneId />,
  },
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '/login-with-password',
    element: <LoginWithPassword />,
  },
  {
    path: '/403',
    element: <Forbidden />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
