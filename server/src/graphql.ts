
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface CreateCarInput {
    name: string;
    make?: Nullable<string>;
    model?: Nullable<string>;
    year?: Nullable<number>;
}

export interface UpdateCarInput {
    id: string;
    name?: Nullable<string>;
    make?: Nullable<string>;
    model?: Nullable<string>;
    year?: Nullable<number>;
}

export interface Car {
    id: string;
    name: string;
    make?: Nullable<string>;
    model?: Nullable<string>;
    year?: Nullable<number>;
    owner: User;
}

export interface IQuery {
    car(id: string): Nullable<Car> | Promise<Nullable<Car>>;
    cars(): Car[] | Promise<Car[]>;
    profile(): Nullable<Profile> | Promise<Nullable<Profile>>;
    me(): Nullable<User> | Promise<Nullable<User>>;
}

export interface IMutation {
    createCar(input: CreateCarInput): Car | Promise<Car>;
    updateCar(input: UpdateCarInput): Car | Promise<Car>;
}

export interface Profile {
    id: string;
    username: string;
}

export interface User {
    id: string;
    email: string;
    profile?: Nullable<Profile>;
}

type Nullable<T> = T | null;
