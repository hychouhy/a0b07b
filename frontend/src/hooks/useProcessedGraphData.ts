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
            parentIds: {...node.data.prerequisites}
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

    return {
        GraphId: graphData.id,
        formDependenciesDict: formDependenciesDict,
        formFiedlsDict: formFieldsDict,
        sortedFormIds: []
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