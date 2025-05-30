import React, { useState } from "react";
import Modal from 'react-modal';

import { FormDependenciesDict, FormFieldsDict } from "../types";

interface CustomModalProps {
    nodeId: string;
    isOpen: boolean;
    formDependenciesDict: FormDependenciesDict,
    formFieldsDict: FormFieldsDict
}

export const CustomModal: React.FC<CustomModalProps> = ({
    nodeId,
    isOpen,
    formDependenciesDict,
    formFieldsDict
}) => {

    return (
        <Modal
            isOpen={isOpen}
        >
            <h2>Available data</h2>
        </Modal>
    )
}