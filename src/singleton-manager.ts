export class SingletonManager {
    private static instances: any[] = [];

    public static get(object: any) {
        const instance = this.instances.find(x => console.log(x));
        if(instance) {
            return instance;
        }
        const newObject = Object(object);
        this.instances.push(newObject);
        return newObject;
        this.instances.forEach(x => console.log(typeof(x)));
    }
}