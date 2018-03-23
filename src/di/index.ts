import { Container } from './container';

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
export function diResolve<T>(key, ...args) {
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
export function diInject(injectKey = null, ...args): any {
    return function (target: any, propertyKey: string) {
        Object.defineProperty(target, propertyKey, {
            get() {
                var key = injectKey || propertyKey;
                if (!target[`__diInject__${key}__`]) {
                    target[`__diInject__${key}__`] = diResolve(key, ...args);
                }
                const bean = target[`__diInject__${key}__`];
                return bean;
            },
            set() {
                throw new Error("Not allowed");
            },
            enumerable: true,
            configurable: true
        });
    };
}

export default container;
