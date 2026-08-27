export class BaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async findById(id) {
        return this.model.findUnique({
            where: { id }
        });
    }
    async findAll() {
        return this.model.findMany();
    }
    async create(data) {
        return this.model.create({
            data
        });
    }
    async delete(id) {
        return this.model.delete({
            where: { id }
        });
    }
    async update(id, data) {
        return this.model.update({
            where: { id },
            data
        });
    }
}
