import React, { useState } from "react";
import { DependencyObject, FormDependenciesDict, FormFieldObject, FormFieldsDict } from '../types'

import { PrefillField } from './PrefillField'

interface FormNodeProps {
    nodeId: string;
    nodeName: string;
    nodeField: FormFieldObject[];
}

export const FormNode: React.FC<FormNodeProps> = ({
    nodeId,
    nodeName,
    nodeField,
}) => {
    const [ isExpanded, setIsExpanded ] = useState(false);


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
                <div style={{paddingLeft : '1rem',}}> 
                    <p> Form ID: {nodeId} </p>
                    <ul>
                    {nodeField.map((field) => {
                        return (
                            <div>
                                <PrefillField
                                    nodeId={nodeId}
                                    fieldObject={field}
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