import React, { useEffect, useState } from "react";
import { FormDependenciesDict, FormFieldObject, FormFieldsDict, TempFormValueDict } from "../types";

import { CustomModal } from './CustomModal'
import { useFormValues } from '../context/TempFormValusContext'
import { useFieldMapping } from '../context/FieldMappingContext';
import { MappingDict } from '../types';

interface PrefillFieldProps {
    nodeId: string;
    fieldObject: FormFieldObject;
    formDependenciesDict: FormDependenciesDict,
    formFieldsDict: FormFieldsDict,
    usePrefill: boolean

    localValue: string | string[] | null
    onSubmit: () => void;
    onLocalChange: (val: string | string[]) => void;
}

const renderInputField = (
    avantos_type: string,
    displayValue: string | string[],
    usePrefill: boolean,
    onLocalChange: (val: string | string[]) => void,
    onSubmit: () => void,

    mappings: MappingDict,
    nodeId: string,
    formFieldsDict: FormFieldsDict,
) => {
    switch (avantos_type) {
        // TODO: handle submit
        case 'button':
            return <button onClick={onSubmit}> Submit </button>;

        case 'multi-select':
            const dummy_multiOptions = ['foo', 'bar', 'foobar'];
            const selectedMulti = Array.isArray(displayValue) ? displayValue : [];
            
            return (
                <select
                    multiple
                    value={selectedMulti}
                    disabled={usePrefill}
                    onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
                        onLocalChange(selected);
                    }}
                >
                    {dummy_multiOptions.map(option => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            );

        case 'multi-line-text':
            return (
                <div style={{ display: 'flex'}}>
                    <textarea
                        value={displayValue}
                        disabled={usePrefill}
                        rows={3}
                        onChange={(e) => onLocalChange(e.target.value)}
                        placeholder="Enter"
                    />
                    {!usePrefill && (
                        <button
                            type="button"
                            onClick={() => onLocalChange('')}
                            style={{height: '100%',}}
                        >
                            X
                        </button>
                    )}
                </div>
            );

        case 'short-text':
            return (
                <div>
                    <input
                        type="text"
                        disabled={usePrefill}
                        value={displayValue}
                        onChange={(e) => onLocalChange(e.target.value)}
                        placeholder="Enter"
                    />
                    {!usePrefill && (
                        <button
                            type="button"
                            onClick={() => onLocalChange('')}
                        >
                            ✕
                        </button>
                    )}
                </div>
            );

        case 'checkbox-group':
            if (mappings[nodeId]?.['dynamic_checkbox_group']) {
                return (
                    <span style={{ color: '#888', marginLeft: '8px' }}>
                        - {formFieldsDict[mappings[nodeId]?.['dynamic_checkbox_group'].sourceId]?.formName}
                                .{mappings[nodeId]?.['dynamic_checkbox_group'].sourceField}
                    </span>
                )
            }

            return <div>click to select a dynamic object</div>

            // not sure about the dynamic field rendering spec
            // const dummy_option = ['foo', 'bar', 'foobar'];
            // const selectedValues = Array.isArray(displayValue) ? displayValue : [];

            // return (
            //     <div>
            //         {dummy_option.map(option => (
            //             <label key={option}>
            //                 <input
            //                     type="checkbox"
            //                     value={option}
            //                     disabled={usePrefill}
            //                     checked={selectedValues.includes(option)}
            //                     onChange={(e) => {
            //                         const updated = e.target.checked
            //                             ? [...selectedValues, option]
            //                             : selectedValues.filter(v => v!== option)  
            //                         onLocalChange(updated)
            //                     }}
            //                 />
            //                 {option}
            //             </label>
            //         ))};
            //     </div>
            // );
        case 'object-enum':
            if (mappings[nodeId]?.['dynamic_object']) {
                return (
                    <span style={{ color: '#888', marginLeft: '8px' }}>
                        - {formFieldsDict[mappings[nodeId]?.['dynamic_object'].sourceId]?.formName}
                                .{mappings[nodeId]?.['dynamic_object'].sourceField}
                    </span>
                )
            }

            return <div>click to select a dynamic object</div>

        default:
            return <div>other avantos_type: {avantos_type}</div>
    }
}

const get_prefillValue_bfs_source = (
    nodeId: string,
    fieldName: string,
    formDependenciesDict: FormDependenciesDict,
    formFieldsDict: FormFieldsDict
) : string | string[] | null => {
    // TODO: handle mapping for dynamic field
    if (fieldName === 'dynamic_checkbox_group'
        || fieldName === 'dynamic_object'
        || fieldName === 'button'
    ) return null;

    const visited = new Set<string>();
    const que: string[] = [...(formDependenciesDict[nodeId]?.parentIds || [])];

    while (que.length > 0) {
        const curId = que.shift()!;
        if (visited.has(curId)) continue;
        
        visited.add(curId);
        const parentForm = formFieldsDict[curId];
        if (!parentForm) continue;

        const matchingField = parentForm.fields.find(f => 
            f.fieldName === fieldName
            && f.avantos_type !== 'dynamic_checkbox_group'
            && f.avantos_type !== 'dynamic_object'
            && f.avantos_type !== 'button'
        );

        // TODO: check is has value from parent, prefill
        const hasValue = true;

        // if found 
        // TODO: return value
        if (matchingField && hasValue) {
            return (parentForm.formName + "." + fieldName);
        }

        const parentIds = formDependenciesDict[curId]?.parentIds || [];
        que.push(...parentIds)

    }

    return null;

}

const get_prefillValue_bfs = (
    nodeId: string,
    fieldName: string,
    formDependenciesDict: FormDependenciesDict,
    formFieldsDict: FormFieldsDict,
    formValues: TempFormValueDict
) :  string | string[] | null => {
    // TODO: handle mapping for dynamic field
    if (fieldName === 'dynamic_checkbox_group'
        || fieldName === 'dynamic_object'
        || fieldName === 'button'
    ) return null;

    

    const visited = new Set<string>();
    const que: string[] = [...(formDependenciesDict[nodeId]?.parentIds || [])];

    while (que.length > 0) {
        const curId = que.shift()!;
        if (visited.has(curId)) continue;
        
        visited.add(curId);
        const parentForm = formFieldsDict[curId];
        if (!parentForm) continue;

        const matchingField = parentForm.fields.find(f => 
            f.fieldName === fieldName
            && f.avantos_type !== 'dynamic_checkbox_group'
            && f.avantos_type !== 'dynamic_object'
            && f.avantos_type !== 'button'
        );

        const parentFieldValue = formValues[curId]?.[fieldName];
        const hasValue = parentFieldValue?.value !== null 
                            && parentFieldValue?.value !== undefined
                            && parentFieldValue?.value !== '';

        if (matchingField && hasValue) {
            return parentFieldValue?.value;
        }

        const parentIds = formDependenciesDict[curId]?.parentIds || [];
        que.push(...parentIds)

    }

    return null;

}

export const PrefillField: React.FC<PrefillFieldProps> = ({
    nodeId,
    fieldObject,
    formDependenciesDict,
    formFieldsDict,
    usePrefill,

    localValue,
    onSubmit,
    onLocalChange,
}) => {
    const [ modalOpen, setModalOpen ] = useState(false);
    const [selectedField, setSelectedField] = useState<string | null>(null);

    const { formValues } = useFormValues();

    const handleFieldClick = (fieldName: string) => {
        if (fieldName === 'dynamic_checkbox_group'
            || fieldName === 'dynamic_object') {
        
        setSelectedField(fieldName);
        setModalOpen(!modalOpen);
        }
    };

    const { mappings, setMappings } = useFieldMapping(); 
    const handleMappingSelect = (type: string, id: string, field: string) => {
        setMappings(prev => ({
        ...prev,
        [nodeId]: {
            ...prev[nodeId],
            [fieldObject.fieldName]: {
            sourceType: type,
            sourceId: id,
            sourceField: field
            }
        }
        }));
        setModalOpen(false);
    };

    // get prefill value
    // Apply prefill logic when usePrefill is true
    useEffect(() => {
        if (usePrefill) {
            const prefill = get_prefillValue_bfs(
                nodeId,
                fieldObject.fieldName,
                formDependenciesDict,
                formFieldsDict,
                formValues
            );
            if (prefill !== null) {
                onLocalChange(prefill);
            }
        }
    }, [usePrefill, nodeId, fieldObject.fieldName, formDependenciesDict, formFieldsDict, formValues, onLocalChange]);

    const prefillValueSource = get_prefillValue_bfs_source(
        nodeId,
        fieldObject.fieldName,
        formDependenciesDict,
        formFieldsDict
    );

    const displayValue = localValue !== null ? localValue : '';

    
    return (
        <div>
            <div
                key={nodeId + "_" + fieldObject.fieldName}
                style={{
                    border: '0.1rem solid #ddd',
                    padding: '0.4rem',
                    marginBottom: '0.3rem',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}
                onClick={() => handleFieldClick(fieldObject.fieldName)}
            >
                <div>
                    <strong>{fieldObject.fieldName}</strong> {fieldObject.avantos_type}
                </div>
                <div style={{ color: "gray"}}>
                    {prefillValueSource
                        ? `${prefillValueSource}`
                        : 'No Mapping'}
                </div>
                {renderInputField(
                    fieldObject.avantos_type, 
                    displayValue, 
                    usePrefill, 
                    onLocalChange, 
                    onSubmit,
                    mappings,
                    nodeId,
                    formFieldsDict
                )}
                
            </div>

            <CustomModal
                    currentNodeId={nodeId}
                    isOpen={modalOpen}
                    formDependenciesDict={formDependenciesDict}
                    formFieldsDict={formFieldsDict}

                    onClose={() => {
                        setModalOpen(false);
                        setSelectedField(null);
                    }}
                    onSelect={handleMappingSelect}
                />
        </div>
        
    );
}
