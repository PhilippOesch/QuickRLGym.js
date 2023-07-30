import { InputStyleType } from '../enums';

interface BaseInputProps {
    name: string;
    inputStyle?: InputStyleType;
    styleClasses?: string;
    disabled?: boolean;
    title: string;
}

export default BaseInputProps;
