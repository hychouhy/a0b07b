// src/App.tsx
import React from 'react';
import { useProcessedGraphData } from './hooks/useProcessedGraphData'
import { formatDiagnostic } from 'typescript';
import { debugPort } from 'node:process';

const App: React.FC = () => {
  const {data, loading, error } = useProcessedGraphData();

  if (loading) return <div>Loading</div>
  if (error) return <div>Error: {error}</div>
  if (!data) return <div>No data</div>

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Journey Builder!</h1>
      {Object.entries(data.formFiedlsDict).map(([formId, formFields]) => (
        <div>
          <h2> Form ID: {formId} </h2>
          <h3> Form Name: {formFields.formName} </h3>
          <ul>
            {formFields.fields.map((field, index) => (
              <li>
                Field Name: {field.fieldName}
                Field Type: {field.type}
              </li>
            ))}
          </ul>
        </div>
      ))}

    </div>
  );
};

export default App;
