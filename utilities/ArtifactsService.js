import { axiosWrapper } from '@/utilities/AxiosWrapper';

export const ArtifactsService = async function({
        method,
        id,
        data,
        url
    }){
    switch (method) {
        case 'create':
            var results = await axiosWrapper({
                method:'post',
                url:'artifacts/store',
                data:data
            }).catch((error) => {
                console.log(error);
            });
            return results;
            break;

        case 'getAll':
            var results = await axiosWrapper({
                method:'get',
                url:'artifacts'
            });
            return results;
            break;

        case 'getById':
            var results = await axiosWrapper({
                method:'get',
                url:'artifacts/'+id,
                params:{id:id}
            });
            return results;

        case 'delete' :
            var results = await axiosWrapper({
                method:'delete',
                url:'artifacts/'+id + '/delete',
                params:{id:id}
            });
            return results;
            break;
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

