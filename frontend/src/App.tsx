// src/App.tsx
import React from 'react';
import { useProcessedGraphData } from './hooks/useProcessedGraphData'

import { TempFormValuesProvider } from './context/TempFormValusContext';
import { FieldMappingProvider } from './context/FieldMappingContext';
import { FormNode } from './component/FormNode'


const App: React.FC = () => {
  const {data, loading, error } = useProcessedGraphData();

  if (loading) return <div>Loading</div>
  if (error) return <div>Error: {error}</div>
  if (!data) return <div>No data</div>

  return (
    <TempFormValuesProvider>
      <FieldMappingProvider>
        <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
          <h1>Journey Builder!</h1>
          {data.sortedFormIds.map(id => {
            const formNode = data.formFieldsDict[id]
            const nodeDependency = data.formDependenciesDict[id]
            return (
              <div>
                <FormNode
                  nodeId={id}
                  nodeName={formNode.formName}
                  nodeField={formNode.fields}
                  formDependenciesDict={data.formDependenciesDict}
                  formFieldsDict={data.formFieldsDict}
                />
              </div>
              
            );
          })}

        </div>
      </FieldMappingProvider>
    </TempFormValuesProvider>
  );
};

export default App;
