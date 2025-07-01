import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import Layout from "./components/Layout";
import CuisineExample from "./pages/CuisineExample";
import CopyOfEras from "./pages/CopyOfEras";
import TourDetailsPage from "./pages/TourDetailsPage";
import TourDetailPage from "./pages/TourDetailPage";
import EmperorPage from "./pages/EmperorPage";
import NotFound from "./pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Switch>
          <Route path="/" component={CuisineExample} />
          <Route path="/cuisine-example" component={CuisineExample} />
          <Route path="/copy-of-eras" component={CopyOfEras} />
          <Route path="/emperors" component={EmperorPage} />
          <Route path="/emperor/:id" component={EmperorPage} />
          <Route path="/tour/:id" component={TourDetailsPage} />
          <Route path="/tours/:id" component={TourDetailPage} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;