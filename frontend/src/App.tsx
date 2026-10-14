import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '@/store/auth';
import AppRoutes from '@/routes';
import ScrollToTop from '@/components/common/ScrollToTop';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </BrowserRouter>
  );
}
