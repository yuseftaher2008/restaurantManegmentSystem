type PrismaModelDelegate = {
    findUnique(args: { where: { id: string } }): Promise<any>;
    findMany(args?: any): Promise<any[]>;
    create(args: { data: any }): Promise<any>;
    delete(args: { where: { id: string } }): Promise<any>;
    update(args: { where: { id: string }; data: any }): Promise<any>;
};

export class BaseRepository<T> {
    protected model: PrismaModelDelegate;

    constructor(model: PrismaModelDelegate) {
        this.model = model;
    }

    async findById(id: string): Promise<T | null> {
        return this.model.findUnique({
            where: { id }
        });
    }

    async findAll(): Promise<T[]> {
        return this.model.findMany();
    }

    async create(data: any): Promise<T> {
        return this.model.create({
            data
        });
    }

    async delete(id: string): Promise<T> {
        return this.model.delete({
            where: { id }
        });
    }

    async update(id: string, data: any): Promise<T> {
        return this.model.update({
            where: { id },
            data
        });
    }
}