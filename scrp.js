//utilisation de la librairie puppeteer (peut néecessiter une installation via 'npm install puppeteer')

import puppeteer from 'puppeteer';
import fs from 'fs';


//fonction sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var data = {
    altitude: "",
    speed: "",
    coordinates: ""

}

//on va enregistrer nos donnees dans un json pour pouvoir y avoir accès depuis notre html
const SaveData = (data) => {
    //on gère les erreurs pour éviter d'enregistrer les donnees sous un mauvais format dans le json
    const finished = (error) => {
        if(error) {
            console.error(error);
            return;
        }
    }
    const jsonData = JSON.stringify(data, null, 2);
    console.log("data => ",data);
    fs.writeFile('data.json', jsonData, finished);

}


function getData() {

    (async () => {
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        await page.goto('https://www.astroviewer.net/iss/en/');

    
        //on laisse le temps à la page de se charger correctement
        await sleep(5000);
    
        var alt = await page.evaluate(()=> {
    
            let altitude = document.querySelector("#cockpit > div:nth-child(3) > p ").textContent; 
            return altitude;       
        });
    
        var speed = await page.evaluate(()=> {
            let sp = document.querySelector("#speed").textContent;
            return sp;
        });
    
        var coordinates = await page.evaluate(()=> {
            let coo = document.querySelector("#gpt").textContent;
            return coo;
        });
        data = {
            altitude: alt,
            speed: speed,
            coordinates: coordinates     
        };

        await browser.close();   
        SaveData(data);  
    })();
}



setInterval(function(){getData(); }, 10000);








