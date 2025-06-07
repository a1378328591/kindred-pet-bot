安装依赖
```
# puppeteer-core不会下载浏览器
npm install puppeteer-core
```

有两个必要参数需要修改：浏览器的exe地址和用户目录（可以右键浏览器-属性-目标里去查找）
```
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  args: [
      '--user-data-dir=C:/ChromeWorksapce/user2',
    ],
```

其他辅助的参数，自定决定是否修改
1. 
```
 # 因为空白页kindred不展示宠物，无法扒元素，所以自行决定打开那个tab页，有宠物元素就行
 const targetUrl = 'https://x.com/jobs';
```
2. 
```
  # 定时去选取操作（performRandomAction方法里定义的操作，如抚摸，拖动，收集DM）
  setInterval(() => {
    performRandomAction().catch(console.error);
  }, 30000);
```
3.
```
  # 简单的用随机数决定执行操作的权重吧
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
```

启动bot
```
node pet-bot.js
```
