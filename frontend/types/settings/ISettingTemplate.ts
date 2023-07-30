import Setting from './Setting';

type ISettingTemplate = {
    [x: string]: Setting<any>;
};

export default ISettingTemplate;
