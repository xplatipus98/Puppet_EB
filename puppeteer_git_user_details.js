const puppeteer = require('puppeteer');

const CREDS = require('./creds');

async function run() {
  const browser = await puppeteer.launch({
      headless: false
  });
  const page = await browser.newPage();
  await page.goto('https://github.com/login');
  
  
  const Username_selector = '#login_field';
  const Userpass_selector = '#password';
  const BUTTON_SELECTOR = '#login > form > div.auth-form-body.mt-3 > input.btn.btn-primary.btn-block';
  
  await page.click(Username_selector);
  await page.keyboard.type(CREDS.username);

  await page.click(Userpass_selector);
  await page.keyboard.type(CREDS.password);

  await page.click(BUTTON_SELECTOR);

 // await page.waitForNavigation();
  const userToSearch = 'john';
  const searchUrl = `https://github.com/search?q=${userToSearch}&type=Users&utf8=%E2%9C%93`;

  await page.goto(searchUrl);
  await page.waitFor(2*1000);
  const Search_seletor = '#js-pjax-container > div > div.col-12.px-2.py-2.py-md-3.d-lg-none.d-flex > button';
  await page.click(Search_seletor);
  //await page.waitForNavigation();
  
  // const LIST_USERNAME_SELECTOR = '#user_search_results > div.user-list > div:nth-child(1) > div.d-flex > div > a';
  //const LIST_USERNAME_SELECTOR = '#user_search_results > div.user-list > div:nth-child(INDEX) > div.d-flex > div > a';
  const LIST_USERNAME_SELECTOR = '#user_search_results > div.user-list > div:nth-child(INDEX) > div.d-flex.flex-auto > div>a'
  // const LIST_EMAIL_SELECTOR = '#user_search_results > div.user-list > div:nth-child(2) > div.d-flex > div > ul > li:nth-child(2) > a';
  const LIST_EMAIL_SELECTOR = '#user_search_results > div.user-list > div:nth-child(INDEX) > div.d-flex > div > ul > li:nth-child(INDEX) > a';  
  const LENGTH_SELECTOR_CLASS = 'user-list-item';
                              
  const INFO_SELECTOR = '#js-pjax-container > div > div.h-card.col-lg-3.col-md-4.col-12.float-md-left.pr-md-3.pr-xl-6 > div.clearfix.mb-2 > div.float-left.col-9.col-md-12.pl-2.pl-md-0 > div:nth-child(4) > div > div>div ';
  
  //const '#js-pjax-container > div > div.h-card.col-lg-3.col-md-4.col-12.float-md-left.pr-md-3.pr-xl-6 > div.clearfix.mb-2 > div.float-left.col-9.col-md-12.pl-2.pl-md-0 > div:nth-child(4) > div > div > div'
  let listLength = await page.evaluate((sel) => {
  return document.getElementsByClassName(sel).length;
}, LENGTH_SELECTOR_CLASS);


for (let i = 1; i < listLength; i++) {
  await page.waitFor(2*1000);
  // change the index to the next child
  let usernameSelector = LIST_USERNAME_SELECTOR.replace("INDEX", i);

  let username = await page.evaluate((sel)=> {
    return document.querySelector(sel).getAttribute('href').replace('/', '');
  }, usernameSelector);


  //let usernameClick = await page.click(username);

  let usersUrl = `https://github.com/${username}`;
  await page.goto(usersUrl);
  await page.waitFor(2*1000);

  let infoSelector = INFO_SELECTOR.replace("INDEX",i);
  let info = await page.evaluate((sel) => {
    let element = document.querySelector(sel);
    return element? element.innerHTML: null;
  }, infoSelector);

  console.log(username,'  ==>>  ',info);
  await page.waitFor(2*1000);
  await page.goBack();
  //await page.goto(searchUrl);
  await page.waitFor(2*1000);
  // TODO save this user
}

//#user_search_results > div.paginate-container.codesearch-pagination-container > div > a.next_page


}

run();