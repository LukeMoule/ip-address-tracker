
async function main() {
    const API_KEYS_LOCAL_PATH = "./config/api-keys.json"

    const IPIFY_API_KEY = await loadAPIKey("ipify");
    const IPIFY_API_URL = "https://geo.ipify.org/api/v2/country,city";

    async function loadAPIKey(str) {
        const res = await fetch(API_KEYS_LOCAL_PATH);
        const resObj = await res.json();
        return resObj[str];
    }

    //handle enter
    document.addEventListener('keydown', (event)=>{
        if (event.key === 'Enter'){
            commit();
        }
    });

    //handle submit button click
    document.querySelector("#submit-button").addEventListener("click", commit)

    let previousInput = "";

    function commit(){
        const input = document.querySelector("#input-field").value;

        /* Don't send request if no input or blank input.
        Could also try to check whether it is a valid ip address or domain,
        but we'll let the api handle that (errors won't use up request). */
        if(input === "" || input === previousInput){
            return;
        }

        const params = {
            apiKey: IPIFY_API_KEY,
            domain: input,
        }

        const url = urlWithParams(IPIFY_API_URL, params)
        previousInput = input;

        console.log(url);
        //queryInput(url);


    }

    function urlWithParams(url, params){
        return url + '?' + new URLSearchParams(params);
    }

    async function queryInput(url){
        fetchData(url);
    }

    async function fetchData(url){
        const res = await fetch(url);
        if(!res.ok){
            throw new Error(`${res.status} ${res.statusText}`);
        }
        const resObj = await res.json();
        console.log(resObj);
    }






}



main();

var map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);