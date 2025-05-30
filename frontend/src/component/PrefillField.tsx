import React, { useState } from "react";
import { FormDependenciesDict, FormFieldObject, FormFieldsDict } from "../types";
import { fileURLToPath } from "url";

interface PrefillFieldProps {
    nodeId: string;
    fieldObject: FormFieldObject;
    formDependenciesDict: FormDependenciesDict,
    formFieldsDict: FormFieldsDict
}

const renderInputField = (
    avantos_type: string,
) => {
    switch (avantos_type) {
        case 'button':
            return <button onClick={() => {}}> Submit </button>;
        
        case 'checkbox-group':
            const dummy_option = ['foo', 'bar', 'foobar'];
            const selectedValues:string[] = [];

            return (
                <div>
                    {dummy_option.map(option => (
                        <label key={option}>
                            <input
                                type="checkbox"
                                value={option}
                                checked={selectedValues.includes(option)}
                                onChange={(e) => {
                                    const updated = e.target.checked
                                        ? [...selectedValues, option]
                                        : selectedValues.filter(v => v!== option)  
                                    // TODO: set updated to local display value
                                }}
                            />
                            {option}
                        </label>
                    ))};
                </div>
            );

        case 'multi-select':
            const dummy_multiOptions = ['foo', 'bar', 'foobar'];
            const selectedMulti : string[] = []
            
            return (
                <select
                    multiple
                    value={selectedMulti}
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
                <textarea
                    placeholder="Enter"
                />
            )

        case 'short-text':
            return (
                <input
                    type="text"
                    placeholder="Enter"
                />
            );

        default:
            return <div>other avantos_type: {avantos_type}</div>
    }
}

const get_prefillValue_bfs = (
    nodeId: string,
    fieldName: string,
    formDependenciesDict: FormDependenciesDict,
    formFieldsDict: FormFieldsDict
) : string | null => {
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
        if (matchingField && hasValue) {
            return (parentForm.formName + "." + fieldName);
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
    formFieldsDict
}) => {

    // get prefill value
    let prefillValue: string | null = null;
    prefillValue = get_prefillValue_bfs(
                        nodeId,
                        fieldObject.fieldName,
                        formDependenciesDict,
                        formFieldsDict
                    );


    return (
        <div
            key={nodeId + "_" + fieldObject.fieldName}
            style={{
                border: '0.1rem solid #ddd',
                padding: '0.4rem',
                marginBottom: '0.3rem',
                display: 'flex',
                justifyContent: 'space-between'
            }}
        >
            <div>
                <strong>{fieldObject.fieldName}</strong> {fieldObject.avantos_type}
            </div>
            <div style={{ color: "gray"}}>
                {prefillValue
                    ? `${prefillValue}`
                    : 'No Mapping'}
            </div>
            {renderInputField(fieldObject.avantos_type)}
        </div>
    );
}
