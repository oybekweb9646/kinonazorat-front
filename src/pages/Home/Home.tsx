import { JSX } from 'react';
import AssessmentResultsChart from './components/AssessmentResultsChart';
import OrganizationCountBy from './components/OrganizationCountBy';
import { CheckOutlined } from '@ant-design/icons';

const Home = (): JSX.Element => {
  return (
    <div className='grid grid-cols-2 gap-4'>
      <OrganizationCountBy
        title="Profilaktikadan o'tkazilganligi bo'yicha"
        prefix={<CheckOutlined />}
        color='#B9D3E0'
        api='/authority/count-question'
      />

      <AssessmentResultsChart />
    </div>
  );
};

export default Home;
