安装依赖
```
# puppeteer-core不会下载浏览器
npm install puppeteer-core
```

有两个参数需要自行决定修改：浏览器的exe地址和用户目录（可以右键浏览器-属性-目标里去查找）
```
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  args: [
      '--user-data-dir=C:/ChromeWorksapce/user2',
    ],
```

启动bot
```
node pet-bot.js
```
