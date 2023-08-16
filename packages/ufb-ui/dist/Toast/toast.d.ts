import { IconNameType } from '../Icon';
import { IToastInfoBoxProps } from './ToastPromiseBox';
interface IToastProps {
    title?: string;
    description?: string;
    iconName?: IconNameType;
}
export declare const toast: {
    positive: (input: IToastProps) => string;
    negative: (input: IToastProps) => string;
    promise: (fn: Promise<any>, input: {
        title: {
            success: string;
            loading: string;
            error: string;
        };
        description?: {
            success?: string;
            loading?: string;
            error?: string;
        };
    }, theme?: 'light' | 'dark', option?: Omit<IToastInfoBoxProps, 't' | 'title' | 'status'>) => Promise<any>;
};
export declare const Toaster: () => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=toast.d.ts.map