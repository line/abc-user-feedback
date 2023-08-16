/// <reference types="react" />
import { IconNameType } from '../Icon';
import { IInputProps } from './Input';
export interface ITextInputProps extends Omit<IInputProps, 'leftChildren'> {
    isValid?: boolean;
    isSubmitted?: boolean;
    isSubmitting?: boolean;
    leftIconName?: IconNameType;
}
export declare const TextInput: import("react").ForwardRefExoticComponent<ITextInputProps & import("react").RefAttributes<HTMLInputElement>>;
//# sourceMappingURL=TextInput.d.ts.map