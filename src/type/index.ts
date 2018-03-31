

export type IsFunction = (obj) => boolean;


export interface IsType {
    /*
     *  isArguments
     */
    isArguments?: IsFunction;
    /*
     * �Ƿ���
     */
    isFunction?: IsFunction;
    /*
     * �Ƿ�String
     */
    isString?: IsFunction;
    /*
     * �Ƿ�����
     */
    isNumber?: IsFunction;
    /*
     * �Ƿ�����
     */
    isDate?: IsFunction;
    /*
     * �Ƿ�����
     */
    isRegExp?: IsFunction;
    /*
     * �Ƿ񲼶�
     */
    isBoolean?: IsFunction;
    /*
     * �Ƿ����
     */
    isObject?: IsFunction;
    /*
     * �Ƿ�����
     */
    isArray?: IsFunction;
}
const nativeIsArray = Array.isArray;

export const Type: IsType = {
    isBoolean: function (obj) {
        return typeof (obj) === "boolean";
    },
    isObject: function (obj) {
        return obj === Object(obj);
    },
    isArray: nativeIsArray || function (obj) {
        return toString.call(obj) == '[object Array]';
    }
}

var isChecks = ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'];
function makeIsFunction(name) {
    var value = `[object ${name}]`;
    Type[`is${name}`] = function (obj) {
        return toString.call(obj) == value;
    };
}
for (var check of isChecks) {
    makeIsFunction(check);
}

export default Type