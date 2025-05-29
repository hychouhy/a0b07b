// src/types.ts

export interface NodeData {
    id: string;
    component_key: string;
    component_type: string;
    component_id: string;
    name: string;
    prerequisites: string[];
}

export interface Node {
    id: string;
    type: string;
    position: {x: number; y: number};
    data: NodeData;
}

export interface Edge {
    source: string;
    target: string;
}

export interface FieldProperty {
    avantos_type: string;
    title: string;
    type: string;
}

export interface Form {
    id: string;
    name: string;
    description: string;
    field_schema: {
        type: string;
        properties: Record<string, FieldProperty>;
        required: string[];
    }
}

export interface GraphData {
    id: string;
    name: string;
    description: string;
    nodes: Node[];
    edges: Edge[];
    forms: Form[];
}

export interface DependencyObject {
    formId: string;
    formName: string;
    parentIds: string[];
}

export interface FormDependenciesDict {
    [formId: string]: DependencyObject;
}

export interface FormFieldObject {
    fieldName: string;
    type: string;
    title: string;
    avantos_type: string;
    endpoint_id?: string;
}

export interface FormFieldsDict {
    [formId: string]: {
        formName: string;
        fields: FormFieldObject[];
    }
}


export interface ProcessedGraphData {
    GraphId: string;
    formDependenciesDict: FormDependenciesDict;
    formFiedlsDict: FormFieldsDict;
    sortedFormIds: string[];
}