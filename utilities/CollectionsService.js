import { axiosWrapper } from '@/utilities/AxiosWrapper';

export const CollectionsService = async function({
        method,
        id,
        data,
        url
    }){
    switch (method) {
        case 'create':
            var results = await axiosWrapper({
                method:'post',
                url:'collections/store',
                data:data
            }).catch((error) => {
                console.log(error);
            });
            return results;
            break;

        case 'getAll':
            var results = await axiosWrapper({
                method:'get',
                url:'collections'
            });
            return results;
            break;

        case 'getById':
            var results = await axiosWrapper({
                method:'get',
                url:'collections/'+id,
                params:{id:id}
            });
            return results;

        case 'delete' :
            var results = await axiosWrapper({
                method:'delete',
                url:'collections/'+id + '/delete',
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

