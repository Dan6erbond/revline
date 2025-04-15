/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateCarInput {
    name: string;
    make?: Nullable<string>;
    model?: Nullable<string>;
    year?: Nullable<number>;
}

export class UpdateCarInput {
    id: string;
    name?: Nullable<string>;
    make?: Nullable<string>;
    model?: Nullable<string>;
    year?: Nullable<number>;
}

export class Car {
    id: string;
    name: string;
    make?: Nullable<string>;
    model?: Nullable<string>;
    year?: Nullable<number>;
    owner: User;
}

export abstract class IQuery {
    abstract car(id: string): Nullable<Car> | Promise<Nullable<Car>>;

    abstract cars(): Car[] | Promise<Car[]>;

    abstract profile(): Nullable<Profile> | Promise<Nullable<Profile>>;

    abstract me(): Nullable<User> | Promise<Nullable<User>>;
}

export abstract class IMutation {
    abstract createCar(input: CreateCarInput): Car | Promise<Car>;

    abstract updateCar(input: UpdateCarInput): Car | Promise<Car>;
}

export class Profile {
    username: string;
}

export class User {
    id: string;
    email: string;
}

type Nullable<T> = T | null;
