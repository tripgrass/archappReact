import { axiosWrapper } from '@/utilities/AxiosWrapper';

export const ArtifactsService = async function({
        method,
        id,
        data
    }){
    switch (method) {
        case 'create':
            console.log('create data: ', data);
            var results = await axiosWrapper({
                method:'post',
                url:'artifacts/store',
                data:data
            }).catch((error) => {
                console.log(error);
            });
            return results;
                console.log('ArtifactsService create', results);
            break;

        case 'getAll':
            var results = await axiosWrapper({
                method:'get',
                url:'artifacts'
            });
            console.log('ArtifactsService getall', results);
            return results;
            break;

        case 'getById':
            console.log('in getbyid service');
            var results = await axiosWrapper({
                method:'get',
                url:'artifacts/'+id,
                params:{id:id}
            });
            return results;
    }

}
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

function getById( id ) {
    return axiosWrapper.get('artifacts/' + id);
}

