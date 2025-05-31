import { FormDependenciesDict } from '../types';

export const getAllAncestorFormIds = (
  formId: string,
  formDependenciesDict: FormDependenciesDict
): string[] => {
  const visited = new Set<string>();
  const result: string[] = [];

  const dfs = (currentId: string) => {
    const parents = formDependenciesDict[currentId]?.parentIds || [];
    for (const parentId of parents) {
      if (!visited.has(parentId)) {
        visited.add(parentId);
        result.push(parentId);
        dfs(parentId);
      }
    }
  };

  dfs(formId);
  return result;
};
