import {MutateMethods} from "./useEntity";
import {AxiosError} from "axios";
import {BaseService} from "../services/BaseService";
import {IEntity} from "../types/IEntity";
import {Dispatch, Reducer, useEffect, useReducer} from "react";
import {IPagedData} from "../types/IPage";
import {IRequestFilterOptions} from "../services/ServiceInterfaces";
import _ from "lodash";
import {usePrevious} from "./usePrevious";

export interface EntitiesMutateInput<T, InputT = T> {
    data?: T[] | Partial<InputT>[];
    ids?: number[];
    method?: MutateMethods;
    mutator?: (dispatch: Dispatch<EntitiesStateAction<T, InputT>>) => Promise<void>;
}

export interface EntitiesState<T> {
    entities: Map<number, T>;
    loading: boolean;
    mutating: boolean;
    error: AxiosError<T[]> | null;
    page: IPagedData<T> | null;
}

export interface EntitiesResult<T, InputT = T> extends EntitiesState<T> {
    issueMutate: (input: EntitiesMutateInput<T, InputT>) => void;
}

function initEntitiesState<T>(): EntitiesState<T> {
    return {
        entities: new Map<number, T>(),
        loading: true,
        mutating: false,
        error: null,
        page: null
    }
}

export enum EntitiesStateActionType {
    SET_ENTITIES,
    REPLACE_ENTITIES,
    REMOVE_ENTITIES,
    SET_ENTITY,
    REMOVE_ENTITY,
    FETCHING_ENTITIES,
    MUTATING_ENTITIES,
    ERROR,
    NO_ERROR
}

export interface EntitiesStateAction<T, InputT = T> {
    type: EntitiesStateActionType;
    data?: T[] | null;
    page?: IPagedData<T>  | null;
    error?: AxiosError<T[]> | null;
    id?: number;
    ids?: number[];
    entity?: T;
    inputData?: InputT[];
}

function entitiesStateReducer<T extends IEntity, InputT = T>(state: EntitiesState<T>, action: EntitiesStateAction<T, InputT>): EntitiesState<T> {
    let newState = {...state};
    switch (action.type) {
        case EntitiesStateActionType.SET_ENTITIES:
            if (action.data) {
                for (let entity of action.data) {
                    newState.entities.set(entity.id, entity);
                }
            }
            if (action.page) {
                newState.page = action.page;
            }
            newState.loading = false;
            newState.error = null;
            newState.mutating = false;
            break;
        case EntitiesStateActionType.REPLACE_ENTITIES:
            if (action.data) {
                newState.entities.clear();
                for (let entity of action.data) {
                    newState.entities.set(entity.id, entity);
                }
            }
            if (action.page) {
                newState.page = action.page;
            }
            newState.loading = false;
            newState.error = null;
            newState.mutating = false;
            break;
        case EntitiesStateActionType.REMOVE_ENTITIES:
            if (action.ids) {
                for (let id of action.ids) {
                    newState.entities.delete(id);
                }
            }
            newState.page = null;
            newState.loading = false;
            newState.error = null;
            newState.mutating = false;
            break;
        case EntitiesStateActionType.SET_ENTITY:
            if (action.entity && action.id) {
                newState.entities.set(action.id, action.entity);
            }
            newState.loading = false;
            newState.error = null;
            newState.mutating = false;
            break;
        case EntitiesStateActionType.REMOVE_ENTITY:
            if (action.id) {
                newState.entities.delete(action.id);
            }
            newState.loading = false;
            newState.error = null;
            newState.mutating = false;
            break;
        case EntitiesStateActionType.FETCHING_ENTITIES:
            newState.loading = true;
            break;
        case EntitiesStateActionType.MUTATING_ENTITIES:
            newState.mutating = true;
            break;
        case EntitiesStateActionType.ERROR:
            if (action.error)
                newState.error = action.error;
            newState.loading = false;
            newState.mutating = false;
            break;
        case EntitiesStateActionType.NO_ERROR:
            newState.error = null;
            newState.loading = false;
            newState.mutating = false;
            break;
    }
    return newState;
}

export function useEntities<T extends IEntity, InputT = T>(service: BaseService<T, InputT>, filterOption?: IRequestFilterOptions<T>): EntitiesResult<T, InputT> {
    const [state, dispatch] = useReducer<Reducer<EntitiesState<T>, EntitiesStateAction<T, InputT>>>(entitiesStateReducer, initEntitiesState());
    const previousFilter = usePrevious<IRequestFilterOptions<T> | undefined>(filterOption);
    useEffect(() => {
        if (!(filterOption && _.isEqual(previousFilter, filterOption))) {
            let fetchEntities = async () => {
                dispatch({type: EntitiesStateActionType.FETCHING_ENTITIES});
                let pagedData = await service.getAll(filterOption);
                dispatch({
                    type: EntitiesStateActionType.REPLACE_ENTITIES,
                    page: pagedData
                });
            };
            fetchEntities().catch((e)=>{
                dispatch({type: EntitiesStateActionType.ERROR, error: e});
            })
        }
    }, [service, filterOption]);

    function useEntitiesMutate(mutate: EntitiesMutateInput<T, InputT>) {
        dispatch({type: EntitiesStateActionType.MUTATING_ENTITIES});
        if (mutate.mutator) {
            mutate.mutator(dispatch);
            return;
        }
        const execMutates = async () => {
            let mutated: number[] = [];
            let mutatedEntities: T[] = [];
            let mutateReqs: Promise<T | boolean>[] = [];
            switch (mutate.method) {
                case MutateMethods.DELETE:
                    mutate.ids?.forEach(value => mutateReqs.push(service.delete(value).then(res => {
                        if (res) {
                            mutated.push(value);
                        }
                        return res;
                    })));
                    break;
                case MutateMethods.PATCH:
                    mutate.ids?.forEach((id, index) =>
                        mutateReqs.push(service.patch(id, (mutate.data as InputT[])[index]).then(value => {
                            mutated.push(id);
                            mutatedEntities.push(value);
                            return value;
                        })));
                    break;
                case MutateMethods.PUT:
                    mutate.ids?.forEach((id, index) =>
                        mutateReqs.push(service.put(id, (mutate.data as InputT[])[index]).then(value => {
                            mutated.push(id);
                            mutatedEntities.push(value);
                            return value;
                        })));
                    break;
            }
            await Promise.all(mutateReqs);
            switch (mutate.method) {
                case MutateMethods.DELETE:
                    dispatch({type: EntitiesStateActionType.REMOVE_ENTITIES, ids: mutated});
                    break;
                case MutateMethods.PUT:
                case MutateMethods.PATCH:
                    dispatch({type: EntitiesStateActionType.SET_ENTITIES, data: mutatedEntities});
                    break;
            }
        }
        execMutates();
    }

    return {
        entities: state.entities,
        loading: state.loading,
        mutating: state.mutating,
        error: state.error,
        page: state.page,
        issueMutate: useEntitiesMutate
    }
}
