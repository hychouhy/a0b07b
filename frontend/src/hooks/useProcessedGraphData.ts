import { useState, useEffect } from "react";
import { 
    GraphData, 
    ProcessedGraphData, 
    FormDependenciesDict, 
    FormFieldsDict,
    FormFieldObject,

} from "../types";

const processedGraphData = (graphData: GraphData) : ProcessedGraphData => {
    const formDependenciesDict: FormDependenciesDict = {};

    graphData.nodes.forEach(node => {
        formDependenciesDict[node.id] = {
            formId: node.id,
            formName: node.data.name,
            parentIds: [...node.data.prerequisites]
        }
    });

    const formFieldsDict: FormFieldsDict = {};
    graphData.nodes.forEach(node => {
        const form = graphData.forms.find(f => f.id === node.data.component_id);
        if (form) {
            formFieldsDict[node.id] = {
                formName: node.data.name,
                fields: []
            };

            Object.entries(form.field_schema.properties)
                    .forEach(([fieldName, fieldSchema]) => {
                
                const newField : FormFieldObject = {
                    fieldName: fieldName,
                    type: fieldSchema.type,
                    title: fieldSchema.title,
                    avantos_type: fieldSchema.avantos_type
                }
                formFieldsDict[node.id].fields.push(newField);
            });
        }
    });

    // sort for proper DAG ordering
    const sortedFormIds: string[] = [];
    const visited = new Set<string>();
    const tempVisited = new Set<string>();

    const visit = (nodeId: string) => {
        if (tempVisited.has(nodeId)) {
            console.warn('Cycle in graph');
            return;
        }

        if (visited.has(nodeId)) {
            return;
        }

        tempVisited.add(nodeId);

        const node = formDependenciesDict[nodeId];
        if (node) {
            node.parentIds.forEach(parentIds => {
                visit(parentIds)
            });
        }

        tempVisited.delete(nodeId);
        visited.add(nodeId);
        sortedFormIds.push(nodeId);
    };

    graphData.nodes.forEach(node => {
        if (!visited.has(node.id)) {
            visit(node.id);
        }
    });

    return {
        GraphId: graphData.id,
        formDependenciesDict,
        formFieldsDict,
        sortedFormIds
    };

};


export const useProcessedGraphData = () => {
    const [data, setData] = useState<ProcessedGraphData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('http://localhost:3000/api/v1/1/actions/blueprints/bp_01jk766tckfwx84xjcxazggzyc/graph')
            .then(res => res.json())
            .then((graphData: GraphData) => {
                const processedData = processedGraphData(graphData);
                setData(processedData);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }, []);

    return { data, loading, error };
}