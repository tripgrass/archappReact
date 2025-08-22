import { axiosWrapper } from '@/utilities/AxiosWrapper';

export const ArtifactsService = async function({
        method,
        id,
        data,
        url
    }){
    switch (method) {
        case 'create':
            console.log('ArtifactsService 11');
            var results = await axiosWrapper({
                method:'post',
                url:'artifacts/store',
                data:data
            }).catch((error) => {
            console.log('ArtifactsService 11 error' );
                console.log(error);
            });
            console.log('ArtifactsService 11 reuslts' , results);
            return results;
            break;

        case 'getAll':
            console.log('ArtifactsService 23');
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

