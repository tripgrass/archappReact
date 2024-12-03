import { axiosWrapper } from '@/utilities/AxiosWrapper';

export const PersonsService = async function({
        method,
        id,
        artifact_id,
        data
    }){
console.log('method:', method);
    switch (method) {
        case 'create':
            console.log('create data: ', data);
            var results = await axiosWrapper({
                method:'post',
                url:'persons/store',
                data:data
            }).catch((error) => {
                console.log(error);
            });
            console.log('PersonsService create', results);
            return results;
            break;




        case 'getAll':
            var results = await axiosWrapper({
                method:'get',
                url:"persons",
                params:data
            });
            console.log('PersonsService getall', results);
            return results;
            break;

        case 'getById':
            console.log('in getbyid service');
            var results = await axiosWrapper({
                method:'get',
                url:'persons/'+id,
                params:{id:id}
            });
            return results;

        case 'delete' :
            console.log('delete in service:::');
            var results = await axiosWrapper({
                method:'delete',
                url:'persons/'+ id + '/delete',
                params:{
                    person_id: id,
                    artifact_id: artifact_id
                }
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

