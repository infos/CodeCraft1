import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import Layout from "./components/Layout";
import CopyOfEras from "./pages/CopyOfEras";
import BuildTourCopy from "./pages/BuildTourCopy";

import TourDetailsPage from "./pages/TourDetailsPage";
import TourDetailPage from "./pages/TourDetailPage";
import NotFound from "./pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Switch>
          <Route path="/" component={CopyOfEras} />
          <Route path="/copy-of-eras" component={CopyOfEras} />
          <Route path="/build-tour-copy" component={BuildTourCopy} />
  
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