import { ReactNode } from 'react';
export interface IInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    hint?: string;
    leftChildren?: ReactNode;
    rightChildren?: ReactNode;
    isValid?: boolean;
    isSubmitted?: boolean;
    isSubmitting?: boolean;
    size?: 'sm' | 'md' | 'lg';
}
export declare const Input: import("react").ForwardRefExoticComponent<IInputProps & import("react").RefAttributes<HTMLInputElement>>;
//# sourceMappingURL=Input.d.ts.map