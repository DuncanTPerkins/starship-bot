export class SingletonManager {
    private static instances: any[] = [];

    public static get(object: any): any {
        const instance = this.instances.find(x => x);
        if (instance) {
            return instance;
        }
        const newObject = Object(object);
        this.instances.push(newObject);
        return newObject;
    }
}