import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import Layout from "./components/Layout";
import CopyOfEras from "./pages/CopyOfEras";
import BuildTourCopy from "./pages/BuildTourCopy";
import HistoricalTimelineTours from "./pages/HistoricalTimelineTours";
import TourDetailsPage from "./pages/TourDetailsPage";
import TourDetailPage from "./pages/TourDetailPage";
import EmperorPage from "./pages/EmperorPage";
import TimelinePage from "./pages/TimelinePage";
import ToursPage from "./pages/ToursPage";
import NotFound from "./pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Switch>
          <Route path="/" component={BuildTourCopy} />
          <Route path="/heritage-tours" component={BuildTourCopy} />
          <Route path="/timeline-tours" component={HistoricalTimelineTours} />
          <Route path="/historical-tours" component={CopyOfEras} />
          <Route path="/eras" component={CopyOfEras} />
          <Route path="/emperors" component={EmperorPage} />
          <Route path="/timeline" component={TimelinePage} />
          <Route path="/tours" component={ToursPage} />
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