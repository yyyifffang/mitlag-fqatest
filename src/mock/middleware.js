// middleware.js
import { v4 } from 'uuid';
const fs = require('fs');

module.exports =  (req, res, next) => {
  if (req.method === 'POST' && req.path === '/api/sudo/contact/fqa') {
    // 生成新的 UUID給新的FQA
    let newUUID;
    do {
      // 生成UUID并提取前八位数字
      const fullUUID = v4();
      newUUID = fullUUID.slice(0, 8);
    } while (uuidExists(newUUID));

    // 將新增項目增加到fqa.json
    const newItem = {
      uuid: newUUID,
      question:"",
      answer:""
    };
    let data = JSON.parse(fs.readFileSync('./fqa.json'));
    data.push(newItem);
    fs.writeFileSync('./fqa.json',JSON.stringify(data,null,2));

    //將新的uuid添加到response
    res.locals.data = [{
      uuid: newUUID
    }];
    // 调用 next() 表示中间件处理完毕
    next();
  } else if(req.method === 'GET' && req.path === '/api/sudo/contact/fqa') {
    //處理get請求，返回所有fqa數據
    const data = JSON.parse(fs.readFileSync('./fqa.json'));
    res.locals.data = data;
    next();
  } else if (req.method === 'PUT' && req.path.startsWith('/api/sudo/contact/fqa/')) {
    // 处理PUT请求，更新对应UUID的数据
    const uuid = req.path.split('/').pop();
    let data = JSON.parse(fs.readFileSync('./fqa.json'));
    const index = data.findIndex(item => item.uuid === uuid);
    if (index !== -1) {
      data[index] = { ...data[index], ...req.body };
      fs.writeFileSync('./fqa.json', JSON.stringify(data, null, 2));
      res.locals.data = [data[index]];
    }
    next();
  } else if (req.method === 'DELETE' && req.path.startsWith('/api/sudo/contact/fqa/')) {
    // 处理DELETE请求，删除对应UUID的数据
    const uuid = req.path.split('/').pop();
    let data = JSON.parse(fs.readFileSync('./fqa.json'));
    const index = data.findIndex(item => item.uuid === uuid);
    if (index !== -1) {
      const deletedItem = data.splice(index, 1);
      fs.writeFileSync('./fqa.json', JSON.stringify(data, null, 2));
      res.locals.data = deletedItem;
    }
    next();
  } else {
    // 如果请求不匹配，继续执行下一个中间件或路由处理程序
    next();
  }
};

function uuidExists(uuidToCheck) {
  // 检查是否已经存在相同前八位的UUID
  const db = require('./api/sudo/contact/fqa/fqa.json');
  return db.fqa.some(item => item.uuid.slice(0, 8) === uuidToCheck);
}
