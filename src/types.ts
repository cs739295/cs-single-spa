export interface Application {
    name: string;
    loadApp: () => Promise<any>;
    activeRule: Function | string;
    status?: string;
    props: AnyObject | Function;
    bootsrap?: (props: AnyObject) => Promise<any>
    mount?: (props: AnyObject) => Promise<any>
    unmount?: (props: AnyObject) => Promise<any>
}

export interface AnyObject {
    [key: string]: any
}

export enum AppStatus {
    BEFORE_BOOTSTRAP = 'BEFORE_BOOTSTRAP',
    BOOTSTRAPPED = 'BOOTSTRAPPED',
    BEFORE_MOUNT = 'BEFORE_MOUNT',
    MOUNTED = 'MOUNTED',
    BEFORE_UNMOUNT = 'BEFORE_UNMOUNT',
    UNMOUNTED = 'UNMOUNTED',
    BOOTSTRAP_ERROR = 'BOOTSTRAP_ERROR',
    MOUNT_ERROR = 'MOUNT_ERROR',
    UNMOUNT_ERROR = 'UNMOUNT_ERROR',
}