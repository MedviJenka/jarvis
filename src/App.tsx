import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { AgentGalleryPage } from './pages/AgentGalleryPage';
import { AgentDetailPage } from './pages/AgentDetailPage';
import { PipelinesPage } from './pages/PipelinesPage';
import { AgentCreatorPage } from './pages/AgentCreatorPage';
import { PipelineBuilderPage } from './pages/PipelineBuilderPage';

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/agents" element={<AgentGalleryPage />} />
          <Route path="/agents/:name" element={<AgentDetailPage />} />
          <Route path="/pipelines" element={<PipelinesPage />} />
          <Route path="/create/agent" element={<AgentCreatorPage />} />
          <Route path="/create/pipeline" element={<PipelineBuilderPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
