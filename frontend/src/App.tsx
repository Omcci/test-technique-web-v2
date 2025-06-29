import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EquipmentList } from './components/equipment/EquipmentList';
import { CreateEquipmentDialog } from './components/equipment/CreateEquipmentDialog';
import { useState } from 'react';
import { Toaster } from "@/components/ui/sonner"


const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground p-4">
        <div className="w-full px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Equipment Management</h1>
            <EquipmentList />
          </div>
        </div>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;