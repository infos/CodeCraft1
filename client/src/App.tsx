import { Switch, Route, Link } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import Layout from "./components/Layout";
import TimelinePage from "./pages/TimelinePage";
import ToursPage from "./pages/ToursPage";
import EmperorPage from "./pages/EmperorPage";
import NotFound from "./pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Switch>
          <Route path="/" component={TimelinePage} />
          <Route path="/tours" component={ToursPage} />
          <Route path="/emperor/:id" component={EmperorPage} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
