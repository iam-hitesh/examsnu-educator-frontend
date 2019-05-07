import {BASE_URL} from './BaseUrl'

export function PostData(type, userData){
    let BaseUrl = BASE_URL;

    return new Promise((resolve, reject) => {
        fetch(BaseUrl+type+"/",{
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: JSON.stringify(userData),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                  resolve(responseJson);
            })
            .catch((error) => {
                 reject(error);
            })
    });
}