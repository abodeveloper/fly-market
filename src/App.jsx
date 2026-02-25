import { ThemeProvider } from '@/providers/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AppRoutes } from '@/routes';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="marketplace-theme">
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <AppRoutes />
        </main>
        <Footer />
      </div>
      <Toaster position="bottom-right" richColors />
    </ThemeProvider>
  );
}

export default App;
