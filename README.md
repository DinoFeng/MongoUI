@[TOC](Welcome)

# 欢迎使用Mongo UI
本项目的开发是为了解决以下两个问题：
    
![image](https://github.com/DinoFeng/MongoUI/blob/master/Solution.png)
    
1.  因防火墙，mongo client端管理工具无法直连Cloud mongoDB服务器。你要以将本项目Deploy到可以连接Cloud mongoDB的地方。
    
![image](https://github.com/DinoFeng/MongoUI/blob/master/Solution2.png)
    
2. 某些Web版mongo管理工具，连接mongoDB字符串直接保存在后端，令所有连该服务器的用户都可以看到。本项目的方案是将连接字符串保存在浏览器的Storage，只有自己本机可见。
    
    
    
## 语言
NodeJS

## 框架
- vue
- quasar

## 启动
首先安装依赖库
    
```yarn install```
    

- 开发环境
    
```yarn dev```
    

- 部署
```
yarn build
yarn start
```

## Docker镜像制作
项目根目录下
```
docker build -f Dockerfile .
```

