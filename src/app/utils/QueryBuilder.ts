import { PopulateOptions, Query } from "mongoose";
import { exitToruQuery } from "./constand";

export class QueryModel<T> {
    public modelQuery: Query<T[], T>;
    public query: Record<string, string>;

    constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
        this.modelQuery = modelQuery;
        this.query = query;
    }

    filter(): this {
        const filter = { ...this.query };
        for (const field of exitToruQuery) {
            delete filter[field];
        }

        if (this.query.minFare || this.query.maxFare) {
            const minFare = this.query.minFare ? Number(this.query.minFare) : 0;
            const maxFare = this.query.maxFare ? Number(this.query.maxFare) : Infinity;
            (filter as any).fare = { $gte: minFare, $lte: maxFare };
        }

        if (this.query.date) {
            const startOfDay = new Date(this.query.date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(this.query.date);
            endOfDay.setHours(23, 59, 59, 999);

            (filter as any).createdAt = { $gte: startOfDay, $lte: endOfDay };
            delete (filter as any).date;
        }

        this.modelQuery = this.modelQuery.find(filter);
        return this;
    }

    search(searchFields: string[]): this {
        const searchTerm = this.query.searchTerm?.trim();
        if (!searchTerm) return this;

        const searchArray = searchFields
            .filter(field => field !== "fare")
            .map(field => ({ [field]: { $regex: searchTerm, $options: "i" } }));

        if (searchArray.length > 0) {
            this.modelQuery = this.modelQuery.find({ $or: searchArray });
        }

        return this;
    }

    sort(): this {
        const sort = this.query.sort || "-createdAt";
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }

    select(): this {
        if (this.query.select) {
            const select = this.query.select.split(",").join(" ");
            this.modelQuery = this.modelQuery.select(select);
        }
        return this;
    }

    pagination(): this {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 5;
        const skip = (page - 1) * limit;

        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }

    populate(populateFields: PopulateOptions | (string | PopulateOptions)[]): this {
        this.modelQuery = this.modelQuery.populate(populateFields);
        return this;
    }

    build() {
        return this.modelQuery;
    }

    async getMeta() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 5;

        const countQuery = this.modelQuery.model.find(
            (this.modelQuery as any)._conditions
        );

        const totalDocuments = await countQuery.countDocuments();
        const totalPage = Math.ceil(totalDocuments / limit);

        return {
            page,
            limit,
            totalPage,
            total: totalDocuments,
        };
    }
}