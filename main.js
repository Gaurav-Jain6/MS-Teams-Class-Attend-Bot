const puppeteer = require("puppeteer");
var cron = require('cron').CronJob;

let id = "**********.onmicrosoft.com" ;
let pass = "**********" ;

let tab ;

async function teams(){
    let browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized" , '--use-fake-ui-for-media-stream'],
        executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    });

    let pages = await browser.pages() ;
    tab = pages[0] ;

    await tab.goto("https://teams.microsoft.com/_?culture=en-in&country=IN&lm=deeplink&lmsrc=homePageWeb&cmpid=WebSignIn#/school//?ctx=teamsGrid") ;
    await tab.waitForSelector("#i0116") ;
    await tab.type("#i0116" , id) ;
    await tab.click("#idSIButton9") ;

    await tab.waitForSelector("#i0118") ;
    await tab.type("#i0118" , pass) ;
    await tab.waitForTimeout(2000) ;
    await tab.click("#idSIButton9") ;

    await tab.waitForTimeout(2000) ;
    await tab.click("#idSIButton9") ;

    await tab.waitForTimeout(20000) ;

    let cards = await tab.$$(".team-card") ;
    for(let i = 0 ; i < cards.length ; i++)
    {
        oneCard = cards[i] ;
        if(i == 8)
        {
            
            await tab.evaluate(function(elem){return elem.click() ;} , oneCard) ;
        }
    }

    await tab.waitForSelector('[translate-once="Dismiss"]') ;
    await tab.click('[translate-once="Dismiss"]') ;
    
    let allClasses = await tab.$$(".name-channel-type .truncate") ;

    for(let i = 0 ; i < allClasses.length ; i++)
    {
        let oneClass = allClasses[i] ;
        await oneClass.click() ;

        await tab.waitForTimeout(2000) ;
        let el = await tab.$(".ts-calling-thread-header.acc-thread-focusable") ;
        let ans =  el ? "Gaurav Join Button is Present" : "" ;
        console.log(ans) ;

        if(ans != "")
        {
            await joinMeeting() ;
        }
    }

} ;


async function jobs(){

    var job = new cron('30 9-17 * * *', function() {
        console.log('You will see this message every second');
        teams() ;
    });
    job.start();
}

async function joinMeeting()
{
    let joinBox = await tab.$(".ts-calling-thread-header.acc-thread-focusable") ;

    await tab.evaluate(function(elem){ document.querySelector(".ts-sym.ts-btn.ts-btn-primary.inset-border.icons-call-jump-in").click() ;} , joinBox)

    await tab.waitForSelector(".style-layer" , {visible:true}) ;
    let allopt = await tab.$$(".style-layer") ;
    for(let i = 0 ; i < allopt.length ; i++)
    {
        let opt = allopt[i]
        await tab.evaluate(function(elem){return elem.click() ;} , opt) ;
    }
    await tab.click(".join-btn.ts-btn.inset-border.ts-btn-primary") ;
}

jobs() ;