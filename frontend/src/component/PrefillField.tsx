import React, { useState } from "react";
import { FormFieldObject } from "../types";

interface PrefillFieldProps {
    nodeId: string;
    fieldObject: FormFieldObject;
}

export const PrefillField: React.FC<PrefillFieldProps> = ({
    nodeId,
    fieldObject
}) => {

    return (
        <div>
            <div>
                <strong>{fieldObject.fieldName}</strong> {fieldObject.avantos_type}
            </div>
        </div>
    );
}
