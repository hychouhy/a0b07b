import React, { useState } from "react";
import { FormFieldObject } from "../types";
import { fileURLToPath } from "url";

interface PrefillFieldProps {
    nodeId: string;
    fieldObject: FormFieldObject;
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

export const PrefillField: React.FC<PrefillFieldProps> = ({
    nodeId,
    fieldObject
}) => {

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
            {renderInputField(fieldObject.avantos_type)}
        </div>
    );
}
