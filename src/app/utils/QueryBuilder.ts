import { Query } from "mongoose";
import { exitToruQuery } from "./constand";

export class QueryModel<T> {
    public modelQuery: Query<T[], T>;
    public query: Record<string, string>;

    constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
        this.modelQuery = modelQuery,
            this.query = query
    }

    filter(): this {
        const filter = { ...this.query }
        for (const field of exitToruQuery) {
            delete filter[field]
        }

        // ---- fare range filter (like old code) ----
        const minFare = this.query.minFare ? Number(this.query.minFare) : 0;
        const maxFare = this.query.maxFare ? Number(this.query.maxFare) : Infinity;

        if (this.query.minFare || this.query.maxFare) {
            (filter as any).fare = { $gte: minFare, $lte: maxFare }
        }

        this.modelQuery = this.modelQuery.find(filter) //TourCollection.find().find(filter)
        return this;
    }

    search(searchFields: string[]): this {
        const searchTerm = this.query.searchTerm || "";

        console.log("searchFields", searchFields)
        console.log("searchTerm", searchTerm)

        const searchArray = searchFields
            .filter(field => field !== "fare")
            .map(field => ({ [field]: { $regex: searchTerm, $options: "i" } }))

        const searchQuery = {
            $or: searchArray
        }
        this.modelQuery = this.modelQuery.find(searchQuery)

        return this;
    }

    sort(): this {
        const sort = this.query.sort || "-createdAt";

        this.modelQuery = this.modelQuery.sort(sort)

        return this;
    }

    // select(): this {
    //     console.log("select", this.query.select)
    //     const select = this.query.select?.split(",").join(" ") || "";

    //     this.modelQuery = this.modelQuery.select(select)

    //     return this;
    // }

    pagination(): this {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 5;
        const skip = (page - 1) * limit;

        this.modelQuery = this.modelQuery.skip(skip).limit(limit)

        return this;
    }

    build() {
        return this.modelQuery
    }

    async getMeta() {
        const totalDocuments = await this.modelQuery.model.countDocuments()
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 5;
        const totalPage = Math.ceil(totalDocuments / limit);

        return {
            page, limit, totalPage, total: totalDocuments
        }
    }
}