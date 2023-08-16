/// <reference types="react" />
import { Toast } from 'react-hot-toast';
import { IconNameType } from '../Icon';
interface IProps {
    type: 'positive' | 'negative';
    title?: string;
    description?: string;
    iconName?: IconNameType;
    t: Toast;
}
export declare const ToastBox: React.FC<IProps>;
export {};
//# sourceMappingURL=ToastBox.d.ts.map