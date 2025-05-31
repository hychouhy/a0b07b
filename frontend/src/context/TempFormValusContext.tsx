import React, { createContext, useContext, useState} from "react";
import { TempFormValueDict } from "../types";

type TempFormValuesContextType = {
    formValues: TempFormValueDict;
    setFormValues: React.Dispatch<React.SetStateAction<TempFormValueDict>>;
};

const TempFormValuesContext = createContext<TempFormValuesContextType | undefined>(undefined);

export const TempFormValuesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [ formValues, setFormValues ] = useState<TempFormValueDict>({});

    return (
        <TempFormValuesContext.Provider value={{ formValues, setFormValues }}>
            {children}
        </TempFormValuesContext.Provider>
    );
};

export const useFormValues = () => {
    const context = useContext(TempFormValuesContext);
    if (!context) throw new Error('error in FormValuesProvider');
    return context;
}