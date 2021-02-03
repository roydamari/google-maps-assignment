const puppeteer = require("puppeteer");

let page;
let browser;

describe("Client Tests", () => {
    beforeAll(async () => {
        browser = await puppeteer.launch({
            slowMo: 10,
        });
        page = await browser.newPage();
    });

    afterAll(() => {
        browser.close();
    });

    beforeEach(async () => {
        page.close();
        page = await browser.newPage();
    });

    test("Query the location of the user", async () => {
        let requestSent = false;
        //Intercept ell HTTP requests
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            request.continue()
        })
        page.on('response', (response) => {
            //Find the IpData response
            if (response.url().includes('api.ipdata')) {
                response.json().then((json) => {
                    //Make sure the request was actually sent and check it is valid
                    requestSent = true;
                    expect(json).toHaveProperty('ip');
                })
            }
        })
        await page.goto("http://localhost:3000/", { waitUntil: 'networkidle2' });
        await page.waitForSelector(".info", { waitUntil: 'networkidle2' });
        //Incase the HTTP request wasn't sent or gave a response
        expect(requestSent).toBe(true);

    }, 30000);

    test("Show that location on a map", async () => {
        let requestSent = false;
        let requestJson = {};
        //Intercept ell HTTP requests
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            request.continue()
        })
        page.on('response', (response) => {
            //Find the IpData response
            if (response.url().includes('api.ipdata')) {
                response.json().then((json) => {
                    //Make sure the request was actually sent and save it
                    requestSent = true;
                    requestJson = json;
                })
            }
        })
        await page.goto("http://localhost:3000/", { waitUntil: 'networkidle2' });
        await page.waitForSelector("iframe", { waitUntil: 'networkidle2', visible: true });
        //Find the iframe element
        const iframe = await page.$("iframe");
        const propertyHandle = await iframe.getProperty('src');
        //Check to see if the iframe src has the country name of the IpDate request
        expect(propertyHandle._remoteObject.value.split('q=')[1].includes(requestJson.country_name)).toBe(true);
        //Incase the HTTP request wasn't sent or gave a response
        expect(requestSent).toBe(true);
    }, 30000);

    test("Show the city and country name of that location", async () => {
        let requestSent = false;
        let requestJson = {};
        //Intercept ell HTTP requests
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            request.continue()
        })
        page.on('response', (response) => {
            //Find the IpData response
            if (response.url().includes('api.ipdata')) {
                response.json().then((json) => {
                    //Make sure the request was actually sent and save it
                    requestSent = true;
                    requestJson = json;
                })
            }
        })
        await page.goto("http://localhost:3000/", { waitUntil: 'networkidle2' });
        await page.waitForSelector(".info", { waitUntil: 'networkidle2', visible: true });
        //Find the info element
        const info = await page.$(".info");
        const propertyHandle = await info.getProperty('innerText');
        //Check to see if the info text has the country and city name of the IpDate request
        expect(propertyHandle._remoteObject.value).toMatch(requestJson.country_name);
        expect(propertyHandle._remoteObject.value).toMatch(requestJson.city);
        //Incase the HTTP request wasn't sent or gave a response
        expect(requestSent).toBe(true);
    }, 30000);

});