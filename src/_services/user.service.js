
export const userService = {
    login,
    logout,
    register,
    smsSend,
}

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Accept': 'application/json','Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    }
    return fetch('/users/authenticate', requestOptions)
                .then(response => {
                    //alert('response')
                    if(response.status === 404) {
                        //alert('response not ok')
                        //alert(response.statusText)
                        //alert(response.json())
                        
                        throw new Error('Error: Invalid Credentials');
                    }
                    else if(response.status !== 200) {
                        //return Promise.reject(response.json());
                    }
                    return response.json();
                })
                .then(user => {
                    //alert(".then(user)")
                    return user;
                })
                .catch(err => console.log(err))
}

function logout() {

}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(user)
    }
    return fetch('/users/register', requestOptions)
        .then(response => {
                if(response.ok) {
                    //alert('response ok')
                    return response.json()
                }
                //alert('response not ok throw error')
                throw new Error("Error in registering")
        })
        .then(user => { return user})
        .catch(err => { console.log(err)})
}

function smsSend(user_id, smsText, contactArray) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({user_id: user_id, smsText: smsText , contactArray: contactArray })
    }
    //alert(JSON.stringify({smsText: smsText , clientArray: clientArray }))
    return fetch('/users/smsSend' , requestOptions)
            .then(response => {
                if(response.ok) {
                    return response.json()
                }
                throw new Error("Error in sending SMS to contacts")
            })
            .then(success => {return success})
            .catch(err => {console.log(err)})
}

