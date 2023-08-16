/// <reference types="react" />
import { Toast } from 'react-hot-toast';
export interface IToastInfoBoxProps {
    t: Toast;
    closeable?: boolean;
    title: string;
    description?: string;
    status: 'loading' | 'success' | 'error';
    theme: 'light' | 'dark';
}
export declare const ToastPromiseBox: React.FC<IToastInfoBoxProps>;
//# sourceMappingURL=ToastPromiseBox.d.ts.map