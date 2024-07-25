const puppeteer = require('puppeteer');
const keypress = require('keypress');

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function startClicker(bigCookie) {
    while (true) {
        if (isClicking) {
            await bigCookie.click();
            console.log("Clicked");
        }
        await delay(1); // Tiempo por cada click
    }
}

let isClicking = true;

async function start() {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        await page.goto('https://orteil.dashnet.org/cookieclicker/', { waitUntil: 'networkidle2' });

        // Tiempo de carga de la página
        await delay(5000);

        const bigCookie = await page.$('#bigCookie');

        if (bigCookie) {
            startClicker(bigCookie);
        } else {
            console.log("Big cookie not found");
        }

        // Manejo de atajos de teclado
        keypress(process.stdin);
        process.stdin.on('keypress', (ch, key) => {
            if (key && key.ctrl && key.name === 'c') {
                console.log("Exiting...");
                browser.close();
                process.exit();
            }
            if (key && key.name === 'p') {
                isClicking = !isClicking;
                console.log(isClicking ? "Resumed clicking" : "Paused clicking");
            }
        });

        process.stdin.setRawMode(true);
        process.stdin.resume();
    } catch (error) {
        console.error("Error:", error);
    }
}

start();
