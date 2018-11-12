import {ACCESS_TOKEN, API_BASE_URL} from './constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};

    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>

            response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            }))
        .catch(error => {
            return Promise.reject(error)
        });
};

export function logout() {
    localStorage.removeItem(ACCESS_TOKEN);
}


export function getVotingProcess(id) {
    return request({
        url: API_BASE_URL + "/proc/" + id,
        method: 'GET'
    })
}

export function vote(procId, itemId) {
    return request({
        url: API_BASE_URL + "/proc/" + procId + "/vote/" + itemId,
        method: 'GET'
    })
}

export function getAllVotingProcess() {
    return request({
        url: API_BASE_URL + "/proc",
        method: 'GET'
    });
}

export function getAllInvitations() {
    return request({
        url: API_BASE_URL + "/invitations",
        method: 'GET'
    });
}


export function getAllItems(query) {
    console.log("INPUT: " + query);
    return request({
        url: API_BASE_URL + "/items?q=" + encodeURI(query),
        method: 'GET',
    });
}

export function getUsers(query) {
    return request({
        url: API_BASE_URL + "/users?q=" + encodeURI(query),
        method: 'GET'
    });
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function notifications() {
    return request({
        url: API_BASE_URL + "/auth/profile/notifications",
        method: 'GET',
    });
}


export function acceptNotification(notificationAccept) {
    return request({
        url: API_BASE_URL + "/notification/ack",
        method: 'POST',
        body: JSON.stringify(notificationAccept)
    });
}

export function acceptVotingInvitation(procId) {
    return request({
        url: API_BASE_URL + "/proc/" + procId + "/accept",
        method: 'GET',
    });
}

export function rejectVotingInvitation(procId) {
    return request({
        url: API_BASE_URL + "/proc/" + procId + "/reject",
        method: 'GET',
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function createVotingRequest(createRequest) {
    return request({
        url: API_BASE_URL + "/proc",
        method: 'POST',
        body: JSON.stringify(createRequest)
    });
}

export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/user/checkUsername?q=" + username,
        method: 'GET'
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/user/checkEmail?q=" + email,
        method: 'GET'
    });
}

export function checkItemNameAvailability(itemRequest) {
    return request({
        url: API_BASE_URL + "/item/checkName",
        method: 'POST',
        body: JSON.stringify(itemRequest)
    });
}

export function checkImUrlAvailability(itemRequest) {
    return request({
        url: API_BASE_URL + "/item/checkImgUrl",
        method: 'POST',
        body: JSON.stringify(itemRequest)
    });
}

export function addNewItems(newItemsRequest) {
    return request({
        url: API_BASE_URL + "/items",
        method: 'POST',
        body: JSON.stringify(newItemsRequest)
    });
}


export function getCurrentUser() {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/auth/profile",
        method: 'GET'
    });
}


export function sendMessage(messageRequest, procId) {
    return request({
        url: API_BASE_URL + "/proc/" + procId + "/message",
        method: 'POST',
        body: JSON.stringify(messageRequest)
    })
}
