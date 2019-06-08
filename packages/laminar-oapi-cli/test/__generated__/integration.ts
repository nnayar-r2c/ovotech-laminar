import { LaminarResponse } from "@ovotech/laminar";

import { OapiConfig, OapiContext, OapiSecurityResolver } from "@ovotech/laminar-oapi";

export interface Config<C extends {} = {}> extends OapiConfig<C> {
    paths: {
        "/pets": {
            /**
             * Returns all pets from the system that the user has access to
             * Nam sed condimentum est. Maecenas tempor sagittis sapien, nec rhoncus sem sagittis sit amet. Aenean at gravida augue, ac iaculis sem. Curabitur odio lorem, ornare eget elementum nec, cursus id lectus. Duis mi turpis, pulvinar ac eros ac, tincidunt varius justo. In hac habitasse platea dictumst. Integer at adipiscing ante, a sagittis ligula. Aenean pharetra tempor ante molestie imperdiet. Vivamus id aliquam diam. Cras quis velit non tortor eleifend sagittis. Praesent at enim pharetra urna volutpat venenatis eget eget mauris. In eleifend fermentum facilisis. Praesent enim enim, gravida ac sodales sed, placerat id erat. Suspendisse lacus dolor, consectetur non augue vel, vehicula interdum libero. Morbi euismod sagittis libero sed lacinia.
             *
             * Sed tempus felis lobortis leo pulvinar rutrum. Nam mattis velit nisl, eu condimentum ligula luctus nec. Phasellus semper velit eget aliquet faucibus. In a mattis elit. Phasellus vel urna viverra, condimentum lorem id, rhoncus nibh. Ut pellentesque posuere elementum. Sed a varius odio. Morbi rhoncus ligula libero, vel eleifend nunc tristique vitae. Fusce et sem dui. Aenean nec scelerisque tortor. Fusce malesuada accumsan magna vel tempus. Quisque mollis felis eu dolor tristique, sit amet auctor felis gravida. Sed libero lorem, molestie sed nisl in, accumsan tempor nisi. Fusce sollicitudin massa ut lacinia mattis. Sed vel eleifend lorem. Pellentesque vitae felis pretium, pulvinar elit eu, euismod sapien.
             *
             */
            get: (context: PetsGetContext & C) => PetsGetResponse;
            /**
             * Creates a new pet in the store.  Duplicates are allowed
             */
            post: (context: PetsPostContext & C) => PetsPostResponse;
        };
        "/pets/{id}": {
            /**
             * Returns a user based on a single ID, if the user does not have access to the pet
             */
            get: (context: PetsIdGetContext & C) => PetsIdGetResponse;
            /**
             * deletes a single pet based on the ID supplied
             */
            delete: (context: PetsIdDeleteContext & C) => PetsIdDeleteResponse;
        };
    };
    security: {
        BasicAuth: OapiSecurityResolver<C>;
        BearerAuth: OapiSecurityResolver<C>;
        ApiKeyAuth: OapiSecurityResolver<C>;
    };
}

export type Pet = NewPet & {
    id: number;
    [key: string]: any;
};

export interface NewPet {
    name: string;
    tag?: string;
    [key: string]: any;
}

export interface Error {
    code: number;
    message: string;
    [key: string]: any;
}

export type PetsGetResponse = (Pet[] | LaminarResponse<Pet[]> | Promise<Pet[]> | Promise<LaminarResponse<Pet[]>>) | (Error | LaminarResponse<Error> | Promise<Error> | Promise<LaminarResponse<Error>>);

export interface PetsGetContext extends OapiContext {
    query: {
        tags?: string[];
        limit?: number;
    };
}

export interface PetCreated {
    pet?: NewPet;
    user?: string;
    [key: string]: any;
}

export type PetsPostResponse = (PetCreated | LaminarResponse<PetCreated> | Promise<PetCreated> | Promise<LaminarResponse<PetCreated>>) | (Error | LaminarResponse<Error> | Promise<Error> | Promise<LaminarResponse<Error>>);

export interface PetsPostContext extends OapiContext {
    body: NewPet;
}

export type PetsIdGetResponse = (Pet | LaminarResponse<Pet> | Promise<Pet> | Promise<LaminarResponse<Pet>>) | (Error | LaminarResponse<Error> | Promise<Error> | Promise<LaminarResponse<Error>>);

export interface PetsIdGetContext extends OapiContext {
    path: {
        id: string;
    };
}

export type PetsIdDeleteResponse = (Error | LaminarResponse<Error> | Promise<Error> | Promise<LaminarResponse<Error>>);

export interface PetsIdDeleteContext extends OapiContext {
    path: {
        id: string;
    };
}