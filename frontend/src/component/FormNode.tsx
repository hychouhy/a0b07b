import React, { useState } from "react";
import { DependencyObject, FormDependenciesDict, FormFieldObject, FormFieldsDict } from '../types'

import { PrefillField } from './PrefillField'
import { useFormValues } from '../context/TempFormValusContext'

interface FormNodeProps {
    nodeId: string;
    nodeName: string;
    nodeField: FormFieldObject[];
    formDependenciesDict: FormDependenciesDict,
    formFieldsDict: FormFieldsDict
}

export const FormNode: React.FC<FormNodeProps> = ({
    nodeId,
    nodeName,
    nodeField,
    formDependenciesDict,
    formFieldsDict,
}) => {
    const [ isExpanded, setIsExpanded ] = useState(false);
    const { setFormValues } = useFormValues();
    const [ localFormValues, setLocalFormValues ] = useState<Record<string, Record<string, string | string[]>>>({});
    
    const [ usePrefill, setUsePrefill ] = useState(false);
    
    const handleSubmitForm = () => {
        const nodeLocalValues = localFormValues[nodeId];
        if (!nodeLocalValues) return;

        setFormValues(prev => ({
            ...prev,
            [nodeId]: {
                ...Object.fromEntries(
                    Object.entries(localFormValues[nodeId] || {}).map(([fieldName, val]) => [
                        fieldName,
                        {
                            value: val
                        }
                    ])
                )
            }
        }));
    }

    return (
        <div style={{ border: '0.1rem solid #ccc', marginBottom: '1rem', borderRadius: '8px' }}>
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    paddingLeft : '1rem',
                    paddingRight : '1rem',
                    backgroundColor: '#f5f5f5',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}
            >
                <h3> {nodeName} </h3>
                <p>{isExpanded ? '▼' : '▶'}</p>
            </div>
            {isExpanded && (
                <div style={{
                                paddingLeft : '1rem', 
                                paddingRight : '1rem'
                            }}
                > 

                    <p> Form ID: {nodeId} </p>
                    {formDependenciesDict[nodeId].parentIds.length > 0 &&
                        <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <input
                                type="checkbox"
                                checked={usePrefill}
                                onChange={() => setUsePrefill(!usePrefill)}
                                style={{ cursor: 'pointer', width: '1.2rem', height: '1.2rem' }}
                            />
                            Use Prefill
                        </label>
                    }

                    <ul style={{paddingLeft : '0'}}>
                    {nodeField.map((field) => {
                        return (
                            <div key={field.fieldName}>
                                <PrefillField
                                    nodeId={nodeId}
                                    fieldObject={field}
                                    formDependenciesDict={formDependenciesDict}
                                    formFieldsDict={formFieldsDict}
                                    localValue={localFormValues[nodeId]?.[field.fieldName] || ''}
                                    usePrefill={usePrefill}

                                    onSubmit={handleSubmitForm}
                                    onLocalChange={(val) => {
                                        setLocalFormValues(prev => ({
                                            ...prev,
                                            [nodeId]: {
                                                ...prev[nodeId],
                                                [field.fieldName]: val
                                            }
                                        }));
                                    }}
                                    
                                />
                            </div>
                        )
                    })}
                    </ul>
                </div>
                
            )}
        </div>
    );
}