import './App.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RoutesWrapper from './routes';
import { ToastContainer } from 'react-toastify';
import { I18nextProvider } from 'react-i18next';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import AntdWrapper from './shared/components/AntdWrapper';
import i18n from '@/shared/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 0, refetchOnWindowFocus: false, staleTime: 1000 * 60 },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <AntdWrapper>
          <React.Suspense fallback='loading'>
            <RoutesWrapper />
          </React.Suspense>
          <ToastContainer theme='colored' />
        </AntdWrapper>
      </I18nextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
