import React, { useState } from "react";
import { FormDependenciesDict, FormFieldsDict } from '../types'

interface FormNodeProps {
    formDependenciesDict: FormDependenciesDict;
    formFieldsDict: FormFieldsDict;
    sortedFormIds: string[];
}

export const FormNode: React.FC<FormNodeProps> = ({
    formDependenciesDict,
    formFieldsDict,
    sortedFormIds,
}) => {


    return (
        <div>
            {sortedFormIds.map(id => {
                const formNode = formFieldsDict[id]
                return (
                    <div>
                        <h2> Form ID: {id} </h2>
                        <h3> Form Name: {formNode.formName} </h3>
                        <ul>
                        {formNode.fields.map((field, index) => (
                            <li>
                            Field Name: {field.fieldName}
                            Field Type: {field.type}
                            </li>
                        ))}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
}