const https = require('https');
const fs = require('fs');
const path = require('path');

// 配置参数 - 已将pageSize改为40
const CONFIG = {
  mediaId: 217805894,       // 收藏夹ID
  startPage: 1,             // 起始页码
  endPage: 100,              // 结束页码
  pageSize: 40,             // 每页数量
  outputPath: 'D:\\yanhanfrontend.github.io\\public\\musics.json', // 输出文件路径
  timeout: 10000,           // 请求超时时间(ms)
  retryTimes: 3             // 请求失败重试次数
};

/**
 * 发送HTTP请求获取单页数据
 * @param {number} page - 页码
 * @returns {Promise<Array<string>>} 该页的标题列表
 */
async function fetchPageData(page) {
  return new Promise((resolve, reject) => {
    // 构建请求URL - ps参数自动读取CONFIG.pageSize（已改为40）
    const url = `https://api.bilibili.com/x/v3/fav/resource/list?media_id=${CONFIG.mediaId}&pn=${page}&ps=${CONFIG.pageSize}&keyword=&order=mtime&type=0&tid=0&platform=web&web_location=333.1387`;
    
    let retryCount = 0;
    
    // 发送请求的核心函数
    const sendRequest = () => {
      const req = https.get(url, { timeout: CONFIG.timeout }, (res) => {
        let data = '';
        
        // 接收数据
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        // 数据接收完成
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            
            // 检查B站接口返回状态
            if (result.code !== 0) {
              throw new Error(`接口返回错误 [页码${page}]: ${result.message || '未知错误'}`);
            }
            
            // 提取标题
            const titles = result.data?.medias?.map(item => item.title) || [];
            console.log(`✅ 第${page}页获取完成，共${titles.length}个标题`);
            resolve(titles);
          } catch (err) {
            handleError(err);
          }
        });
      });
      
      // 请求超时处理
      req.on('timeout', () => {
        req.destroy();
        handleError(new Error(`请求超时 [页码${page}]`));
      });
      
      // 请求错误处理
      req.on('error', (err) => {
        handleError(new Error(`网络错误 [页码${page}]: ${err.message}`));
      });
      
      // 错误处理（含重试逻辑）
      function handleError(err) {
        retryCount++;
        if (retryCount <= CONFIG.retryTimes) {
          console.log(`⚠️ ${err.message}，正在重试(${retryCount}/${CONFIG.retryTimes})...`);
          setTimeout(sendRequest, 1000 * retryCount); // 指数退避重试
        } else {
          reject(new Error(`❌ 第${page}页获取失败: ${err.message}`));
        }
      }
    };
    
    sendRequest();
  });
}

/**
 * 主函数：遍历所有页码获取数据并写入文件
 */
async function main() {
  try {
    console.log(`🚀 开始获取B站收藏夹数据，页码范围：${CONFIG.startPage}-${CONFIG.endPage}，每页数量：${CONFIG.pageSize}`);
    
    // 存储所有标题的数组
    const allTitles = [];
    
    // 遍历所有页码
    for (let page = CONFIG.startPage; page <= CONFIG.endPage; page++) {
      try {
        const pageTitles = await fetchPageData(page);
        allTitles.push(...pageTitles); // 将当前页标题合并到总数组
      } catch (err) {
        console.error(err.message);
        // 可选：遇到错误是否继续，这里选择继续
        continue;
      }
    }
    
    // 将数据写入JSON文件
    await writeJsonFile(CONFIG.outputPath, allTitles);
    console.log(`🎉 全部完成！共获取${allTitles.length}个标题，已写入：${CONFIG.outputPath}`);
    
  } catch (err) {
    console.error('💥 程序执行失败：', err.message);
    process.exit(1);
  }
}

/**
 * 写入JSON文件的工具函数
 * @param {string} filePath - 文件路径
 * @param {any} data - 要写入的数据
 * @returns {Promise<void>}
 */
function writeJsonFile(filePath, data) {
  return new Promise((resolve, reject) => {
    // 格式化JSON输出，便于阅读
    const jsonStr = JSON.stringify(data, null, 2);
    
    fs.writeFile(filePath, jsonStr, 'utf8', (err) => {
      if (err) {
        reject(new Error(`写入文件失败：${err.message}`));
        return;
      }
      resolve();
    });
  });
}

// 启动程序
main();