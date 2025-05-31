import React, { useState } from 'react';
import Modal from 'react-modal';

import { useFieldMapping } from '../context/FieldMappingContext';
import { getAllAncestorFormIds } from '../utils/dependencyUtils';

import { FormDependenciesDict, FormFieldsDict } from "../types";


interface CustomModalProps {
    isOpen: boolean;
    currentNodeId: string;
    formDependenciesDict: FormDependenciesDict,
    formFieldsDict: FormFieldsDict,


    onClose: () => void;
    onSelect: (sourceType: string, sourceId: string, fieldId: string) => void;
}

const mockActionProperties = [
  { fieldName: 'id-dummy', avantos_type: 'short-text' },
  { fieldName: 'name-dummy', avantos_type: 'short-text' },
  { fieldName: 'category-dummy', avantos_type: 'short-text' }
];

const mockClientProperties = [
  { fieldName: 'orgId-dummy', avantos_type: 'short-text' },
  { fieldName: 'orgName-dummy', avantos_type: 'short-text' }
];

export const CustomModal: React.FC<CustomModalProps> = ({ 
    isOpen, 
    currentNodeId,
    formDependenciesDict,
    formFieldsDict,
    
    onClose, 
    onSelect,  
}) => {

  const [openGroupId, setOpenGroupId] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<{ type: string; id: string; fieldId: string } | null>(null);

  const directDeps = formDependenciesDict[currentNodeId]?.parentIds || [];
  const transitiveDeps 
            = getAllAncestorFormIds(currentNodeId, formDependenciesDict).filter(
                    id => !directDeps.includes(id)
                );

  const { mappings, setMappings } = useFieldMapping(); 

  const allDeps = [
    {
      id: 'action-properties',
      name: 'Action Properties',
      type: 'global',
      fields: mockActionProperties
    },
    {
      id: 'client-properties',
      name: 'Client Organisation Properties',
      type: 'global',
      fields: mockClientProperties
    },
    ...directDeps.map(id => ({
      id,
      name: `${formFieldsDict[id]?.formName || id} (Direct)`,
      type: 'form-direct',
      fields: formFieldsDict[id]?.fields || []
    })),
    ...transitiveDeps.map(id => ({
      id,
      name: `${formFieldsDict[id]?.formName || id} (Transitive)`,
      type: 'form-transitive',
      fields: formFieldsDict[id]?.fields || []
    }))
  ];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Mapping Modal"
      style={{
        content: {
          width: '500px',
          height: '400px',
          margin: 'auto',
          padding: '20px',
          overflow: 'auto'
        }
      }}
    >
      <h2>Select a Source Field</h2>
      {allDeps.map(group => (
        <div key={group.id} style={{ marginBottom: '12px' }}>
          <div
            style={{
              fontWeight: 'bold',
              cursor: 'pointer',
              padding: '8px',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px'
            }}
            onClick={() => setOpenGroupId(prev => (prev === group.id ? null : group.id))}
          >
            {group.name} {openGroupId === group.id ? '▼' : '▶' }
          </div>

          {openGroupId === group.id && (
            <div style={{ padding: '8px 12px' }}>
              {group.fields.map(field => {
                const isDynamic =
                  field.fieldName === 'dynamic_checkbox_group' ||
                  field.fieldName === 'dynamic_object';

                const mapped = isDynamic
                  ? mappings[group.id]?.[field.fieldName]
                  : null;

                return (
                  <div
                    key={field.fieldName}
                    style={{
                      cursor: 'pointer',
                      marginBottom: '6px',
                      backgroundColor:
                        selectedSource?.id === group.id && selectedSource?.fieldId === field.fieldName
                          ? '#e0f7fa'
                          : 'transparent'
                    }}
                    onClick={() => setSelectedSource({ type: group.type, id: group.id, fieldId: field.fieldName })}
                  >
                    - {field.fieldName}
                    {mapped && (
                      <span style={{ color: '#888', marginLeft: '8px' }}>
                        - {formFieldsDict[mapped.sourceId]?.formName}.{mapped.sourceField}
                      </span>
                    )}
                  </div>
                );
              })}

            </div>
          )}
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
        <button onClick={onClose}>Cancel</button>
        
        <button
          disabled={!selectedSource}
          onClick={() => {
            if (selectedSource) {
              onSelect(selectedSource.type, selectedSource.id, selectedSource.fieldId);
              onClose();
            }
          }}
        >
          Select
        </button>
      </div>
    </Modal>
  );
};
