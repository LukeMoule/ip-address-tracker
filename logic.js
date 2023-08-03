
async function main() {
    const API_KEYS_LOCAL_PATH = "./config/api-keys.json"

    const IPIFY_API_KEY = await loadAPIKey("ipify");
    const IPIFY_API_URL = "https://geo.ipify.org/api/v2/country,city?";

    async function loadAPIKey(str) {
        const res = await fetch(API_KEYS_LOCAL_PATH);
        const resObj = await res.json();
        return resObj[str];
    }

    //handle enter
    //want to prevent user from holding down enter to spam requests 
    let down = false;
    document.addEventListener('keydown', function (event) {
        if (down) return;
        down = true;

        if (event.key === 'Enter'){
            commit();
        }
    }, false);

    document.addEventListener('keyup', function () {
        down = false;
    }, false);

    //handle submit button click
    document.querySelector("#submit-button").addEventListener("click", commit)

    let previousInput = "";

    function commit(){
        const input = document.querySelector("#input-field").value;
        if(input === "" || input === previousInput){
            return;
        }
        const url = generateIpifyURL(input);
        console.log(url);
        //callIpifyAPI(url);

        previousInput = input;
    }


    function generateIpifyURL(input){
        return IPIFY_API_URL + new URLSearchParams({
            apiKey: IPIFY_API_KEY,
            domain: input,
        });
    }

    async function callIpifyAPI(url){
        try{
            const res = await fetch(url);
            const resObj = await res.json();
            console.log(resObj);
        } catch(error) {
            console.log(error);
        }
    }






}



main();