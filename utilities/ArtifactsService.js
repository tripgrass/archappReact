import { axiosWrapper } from '@/utilities/AxiosWrapper';

export const ArtifactsService = {
    artifact,
    getById,
    getAll
};
/*
        getById,
    update,
    create,
    delete: _delete
};
*/
function artifact() {
    //return axiosWrapper.get('artifacts');
}
function getAll() {
    return axiosWrapper.get('artifacts');
}
function getById( id ) {
    return axiosWrapper.get('artifacts/' + id);
}

