import { axiosWrapper } from '@/utilities/AxiosWrapper';

export const ImagesService = async function({
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
                url:'images/store',
                data:data
            }).catch((error) => {
                console.log(error);
            });
            console.log('ImagesService create', results);
            return results;
            break;




        case 'getAll':
            var results = await axiosWrapper({
                method:'get',
                url:"images"
            });
            console.log('ImagesService getall', results);
            return results;
            break;

        case 'getById':
            console.log('in getbyid service');
            var results = await axiosWrapper({
                method:'get',
                url:'images/'+id,
                params:{id:id}
            });
            return results;

        case 'delete' :
            console.log('delete in service:::');
            var results = await axiosWrapper({
                method:'delete',
                url:'images/'+ id + '/delete',
                params:{
                    image_id: id,
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

