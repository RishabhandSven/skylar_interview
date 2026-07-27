import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import { DashboardLayout } from './components/DashboardLayout';
import { OverviewView } from './features/dashboard/views/OverviewView';
import { AnalyticsView } from './features/dashboard/views/AnalyticsView';
import { SettingsView } from './features/dashboard/views/SettingsView';
import { ExecutiveAdvisorView } from './features/executive/views/ExecutiveAdvisorView';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes caching
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <DashboardLayout>
          {(currentTab) => {
            switch (currentTab) {
              case 'overview':
                return <OverviewView key="overview" />;
              case 'analytics':
                return <AnalyticsView key="analytics" />;
              case 'settings':
                return <SettingsView key="settings" />;
              case 'advisor':
                return <ExecutiveAdvisorView key="advisor" />;
              default:
                return <OverviewView key="overview-default" />;
            }
          }}
        </DashboardLayout>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
