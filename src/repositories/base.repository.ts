type PrismaModelDelegate = {
    findUnique(args: { where: { id: string } }): Promise<any>;
    findMany(args?: any): Promise<any[]>;
    create(args: { data: any }): Promise<any>;
    delete(args: { where: { id: string } }): Promise<any>;
    update(args: { where: { id: string }; data: any }): Promise<any>;
};

export abstract class BaseRepository<TModel, TCreateInput> {
    
    constructor(protected model: PrismaModelDelegate) {
    }

    async findById(id: string): Promise<TModel | null> {
        return this.model.findUnique({
            where: { id }
        });
    }

    async findAll(): Promise<TModel[]> {
        return this.model.findMany();
    }

    abstract create(data: TCreateInput): Promise<TModel>;

    async delete(id: string): Promise<TModel> {
        return this.model.delete({
            where: { id }
        });
    }

    async update(id: string, data: any): Promise<TModel> {
        return this.model.update({
            where: { id },
            data
        });
    }
}