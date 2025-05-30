// src/App.tsx
import React from 'react';
import { useProcessedGraphData } from './hooks/useProcessedGraphData'

import { FormNode } from './component/FormNode'

const App: React.FC = () => {
  const {data, loading, error } = useProcessedGraphData();

  if (loading) return <div>Loading</div>
  if (error) return <div>Error: {error}</div>
  if (!data) return <div>No data</div>

  return (
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
  );
};

export default App;
