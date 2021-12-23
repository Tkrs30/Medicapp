import fetchival from 'fetchival';
import Storage from '../storage/Storage'

const url = 'http://192.168.1.191/api'

const api = (
    endPoint,
    data = {},
    method = 'get',
) => {

    const gettoken = async () => {
        var temp = null
        await Storage.getItem('@token').then(value => {temp = 'Bearer ' + value})
        console.log('temp = ', temp)
        return temp
    }
    const token = await gettoken()
    console.log('ici le token ', token)
    const args = data.args;
    let endPointCalculate = url + endPoint;
    if (args) {
        args.forEach((element, index) => {
            endPointCalculate = endPointCalculate.replace('#arg' + index, element);
        });
    }
    return fetchival(endPointCalculate, {
        headers: {
            Authorization: token
        }
    })[method](data).catch(error => console(error))
}

export const login = data => api('/login', data, 'post');
export const getPatients = data => api('/getpatients', data);
export const getChanges = data => api('/history', data);
export const putPatient = data => api('/editpatient/#arg0', data, 'put');
export const postPatient = data => api('/newpatient', data, 'post');
export const delPatient = data => api('/delpatient/#arg0', data, 'delete');