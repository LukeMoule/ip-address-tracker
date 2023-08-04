//TODO: sort out function structure; 
//TODO: color variables

const SET_VIEW_ZOOM = 13;


async function main() {
    const API_KEYS_LOCAL_PATH = "./config/api-keys.json"

    const IPIFY_API_KEY = await loadAPIKey("ipify");
    const IPIFY_API_URL = "https://geo.ipify.org/api/v2/country,city";

    async function loadAPIKey(str) {
        try {
            const res = await fetch(API_KEYS_LOCAL_PATH);
            const resObj = await res.json();
            return resObj[str];
        } catch (error) {
            let key = prompt("No API key found. Please input ipify API key:");
        }
        
    }

    //handle enter
    document.addEventListener('keydown', (event)=>{
        if (event.key === 'Enter'){
            commit();
        }
    });

    //handle submit button click
    document.querySelector("#submit-button").addEventListener("click", commit);

    let previousInputs = {};


    async function commit(){
        resetErrorDisplay();
        startLoading();
        const input = document.querySelector("#input-field").value;

        /* Don't send request if blank input.
        TODO: blank imput send user's ip
        TODO: if input same as previous just use known coords
        Store all previous inputs
        Could also try to check whether it is a valid ip address or domain,
        but we'll let the api handle that (errors won't use up request). */
        // if(input === ""){
        //     return;
        // }

        if(previousInputs.hasOwnProperty(input)){
            display(previousInputs[input]);
        } else {
            const params = {
                apiKey: IPIFY_API_KEY,
                domain: input,
            }

            const url = URLPlusParams(IPIFY_API_URL, params)

            //console.log(url);
            const locationObj = await fetchIpify(url);
            //console.log(locationObj);

            //can key value be any string? could be any nonsense input from user
            previousInputs[input] = locationObj;
            display(locationObj);
        }
        //console.log(previousInputs);
        finishLoading();
    }

    function display(obj){

        if(typeof obj === 'string'){
            displayError(obj);
        } else {
            const ip = obj.ip;
            const timezone = obj.location.timezone;
            const isp = obj.isp;
            const location = `${obj.location.city}, ${obj.location.region}`

            document.querySelector("#ip-address").innerHTML = ip;
            document.querySelector("#timezone").innerHTML = `UTC ${timezone}`;
            document.querySelector("#isp").innerHTML = isp;
            document.querySelector("#location").innerHTML = location;



            const lat = obj.location.lat;
            const long = obj.location.lng;

            //TODO: remove old markers
            map.setView([lat, long], SET_VIEW_ZOOM);
            L.marker([lat, long], {icon: customIcon}).addTo(map);
        }
    }

    function displayError(str){
        const inputField = document.querySelector("#input-field");
        inputField.style.setProperty('--placeholder-text-color', 'hsl(0, 100%, 50%)');
        let message;
        if(parseInt(str) === 422){
            message = 'Invalid IP address or domain';
        } else if(parseInt(str) === 403){
            message = 'Invalid API key';
        } else {
            message = str;
        }
        inputField.setAttribute('placeholder', message);
        inputField.value = "";
    }

    function resetErrorDisplay(){
        const inputField = document.querySelector("#input-field");
        inputField.style.setProperty('--placeholder-text-color', 'hsl(0, 0%, 59%)');
        inputField.setAttribute('placeholder', 'Search for any IP address or domain');
        
    }

    function URLPlusParams(url, params){
        qm = '?'
        if(url.slice(-1)==='?'){
            qm = '';
        }
        return url + qm + new URLSearchParams(params);
    }

    async function fetchIpify(url){
        try {
            console.warn("MAKING IPIFY REQUEST")
            const res = await fetchData(url)
            const resObj = await res.json();
            return resObj;
        } catch (error) {
            return(error.message);
        }
 
    }

    async function fetchData(url){
        const res = await fetch(url);
        if(!res.ok){
            throw new Error(`${res.status} ${res.statusText}`);
        }
        return res;
    }


    function startLoading(){
        document.querySelector("body").classList.add("waiting");
    }

    function finishLoading(){
        document.querySelector("body").classList.remove("waiting");
    }


    //run once with blank input to display user's ip
    //commit();
}





var map = L.map('map',{zoomControl: false}).setView([51.505, -0.09], SET_VIEW_ZOOM);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

var customIcon = L.icon({
    iconUrl: './images/icon-location.svg',
    iconSize: [46, 56],
    iconAnchor: [23, 56],
});

main();