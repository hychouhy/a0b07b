import React, { createContext, useContext, useState } from 'react';
import { MappingDict } from '../types';

const FieldMappingContext = createContext<{
  mappings: MappingDict;
  setMappings: React.Dispatch<React.SetStateAction<MappingDict>>;
} | undefined>(undefined);

export const FieldMappingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mappings, setMappings] = useState<MappingDict>({});
  return (
    <FieldMappingContext.Provider value={{ mappings, setMappings }}>
      {children}
    </FieldMappingContext.Provider>
  );
};

export const useFieldMapping = () => {
  const ctx = useContext(FieldMappingContext);
  if (!ctx) throw new Error('useFieldMapping must be used inside FieldMappingProvider');
  return ctx;
};
