import { FieldErrors, Noop } from "react-hook-form";

export type InputPropsType = {
    placeholder?: string;
    label?: string;
    onChange: (...event: any[]) => void;
    onBlur?:Noop;
    errors: FieldErrors<any>;
    name: string;
    type?: string;
    value: string
};
