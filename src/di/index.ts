import { Container } from './container';
import { BindingScope } from './binding';



const container = new Container();

/**
 * ��������ע��������������û�ж�Ӧ�Ķ��󣬲��ᱨ��
 * @param key ����  
 * @param args ����
 */
export function tryResolve(key, ...args) {
    const bean = container.resolve(key, ...args);
    if (bean) {
        return bean;
    }
    return null;
}

/**
 * ��������ע��������������û�ж�Ӧ�Ķ��󣬻ᱨ��
 * @param key ����  
 * @param args ����
 */
export function Resolve<T>(key, ...args) {
    const bean = tryResolve(key, ...args);
    if (bean) {
        return bean;
    } else {
        console.error(`Context has no bean with name ${key}. 
      Available beans: ${container.getNames().join(", ")}`);
    }
}

/**
 * ����һ��������������ע��
 * @param injectKey �����key 
 */
export function Inject(injectKey = null, ...args): any {
    return function (target: any, propertyKey: string,desc?):any {
        let options = {
            get() {
                var key = injectKey || propertyKey;
                var binding = container.get(key);
                let bean;
                if (binding.scope == BindingScope.Transient) {
                    bean = binding.resolve(...args);
                } else {
                    var targetKey = `__diImport__${key}__`;
                    if (!target[targetKey]) {
                        target[targetKey] = binding.resolve(...args);
                    }
                    bean = target[targetKey];
                }
                return bean;
            },
            set(value) {
                throw new Error("Not allowed");
            },
            enumerable: true,
            configurable: true
        }
        if (desc) {
            return options;
        }

        Object.defineProperty(target, propertyKey, options);
    };
}
export default {
    container,
    tryResolve,
    Resolve,
    Inject
}
