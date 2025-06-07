const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: [
      '--user-data-dir=C:/ChromeWorksapce/user2',
      '--profile-directory=Default',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1400,900'
    ],
    defaultViewport: null,
    ignoreDefaultArgs: ['--disable-extensions'],
  });

  const page = await browser.newPage();
  const tempPage = await browser.newPage();

  const targetUrl = 'https://x.com/jobs';

  async function ensurePageReady() {
    await page.bringToFront();

    const currentUrl = page.url();
    if (!currentUrl.includes('x.com/jobs')) {
      console.log('⏳ 当前不在目标页面，正在跳转...');
      await page.goto(targetUrl, { waitUntil: 'networkidle2' });
    }

    try {
      await page.waitForSelector('.metapals__wrapper__pet', { timeout: 10000 });
    } catch {
      console.warn('⚠️ 宠物元素未加载，重新加载页面...');
      await page.reload({ waitUntil: 'networkidle2' });
      await page.waitForSelector('.metapals__wrapper__pet', { timeout: 10000 });
    }
  }

  const getCenter = async () => {
    const pet = await page.$('.metapals__wrapper__pet');
    const box = await pet.boundingBox();
    return {
      x: box.x + box.width / 2,
      y: box.y + box.height / 2,
      width: box.width,
      height: box.height,
      box
    };
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const movePet = async () => {
    const { x, y } = await getCenter();
    const offsetX = Math.random() * 300 - 150;
    const offsetY = Math.random() * 200 - 100;

    try {
      await page.mouse.move(x, y);
      await page.mouse.down();
      await page.mouse.move(x + offsetX, y + offsetY, { steps: 20 });
      await page.mouse.up();
      console.log('🐾 推动了宠物');
    } catch (err) {
      console.warn('⚠️ 推动宠物失败，尝试释放鼠标');
      await page.mouse.up(); // 强制释放
    }
  };

  const petThePet = async () => {
    const { x, y } = await getCenter();

    try {
      await page.mouse.move(x, y - 10);
      await page.mouse.down();

      const duration = 6000;
      const steps = 60;
      const interval = duration / steps;

      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const posY = y - 10 + 20 * t;
        await page.mouse.move(x, posY);
        await sleep(interval);
      }

      await page.mouse.up();
      console.log('👐 抚摸了宠物（6秒）');
    } catch (err) {
      console.warn('⚠️ 抚摸宠物失败，尝试释放鼠标');
      await page.mouse.up();
    }
  };

const clickDarkmatter = async () => {
  try {
    await tempPage.bringToFront();
    await page.bringToFront();
    await ensurePageReady();

    // 等待 darkmatter 元素在 shadow DOM 中加载
    const maxTries = 20;
    const delay = 300;
    let darkHandle = null;

    for (let i = 0; i < maxTries; i++) {
      const jsHandle = await page.evaluateHandle(() => {
        const host = document.querySelector('#metapals-ext-app-root');
        if (!host || !host.shadowRoot) return null;
        const dark = host.shadowRoot.querySelector('.metapals__world__darkmatter');
        return dark || null;
      });

      darkHandle = jsHandle.asElement();

      if (darkHandle) break;
      await sleep(delay);
    }

    if (!darkHandle) {
      console.log('❌ 等待超时：无法从 shadowRoot 中找到 darkmatter 元素');
      return;
    }

    const box = await darkHandle.boundingBox();
    if (!box) {
      console.log('❌ 找到了 darkmatter，但无法获取坐标（可能是隐藏）');
      return;
    }

    const petBox = (await getCenter()).box;
    const isOverlapping = !(
      box.x + box.width < petBox.x ||
      box.x > petBox.x + petBox.width ||
      box.y + box.height < petBox.y ||
      box.y > petBox.y + petBox.height
    );

    if (isOverlapping) {
      console.log('🚧 darkmatter 被宠物遮挡，尝试先移开宠物');
      await movePet();
      await sleep(1000);
    }

    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    await page.mouse.click(cx, cy);
    console.log('🧲 成功点击了 shadow DOM 中的 darkmatter');
  } catch (err) {
    console.error('❌ 点击 darkmatter 失败:', err);
  }
};




  const performRandomAction = async () => {
    await ensurePageReady();

    const r = Math.random();
    if (r < 0.5) {
      await movePet();
    } else if (r < 0.8) {
      await petThePet();
    } else {
      await clickDarkmatter();
    }
  };

  await ensurePageReady();
  console.log('✨ 开始自动宠物互动');

  setInterval(() => {
    performRandomAction().catch(console.error);
  }, 30000);
})();
