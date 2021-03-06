# node-reptile
基于node.js实现前程无忧求职页面的数据爬虫

# 1.对于爬虫的认知

**网络爬虫:**（英语：web crawler），也叫网络蜘蛛（spider），是一种用来自动浏览[万维网](https://zh.wikipedia.org/wiki/%E4%B8%87%E7%BB%B4%E7%BD%91)的[网络机器人](https://zh.wikipedia.org/w/index.php?title=%E7%BD%91%E7%BB%9C%E6%9C%BA%E5%99%A8%E4%BA%BA&action=edit&redlink=1)。其目的一般为编纂[网络索引](https://zh.wikipedia.org/w/index.php?title=%E7%BD%91%E7%BB%9C%E7%B4%A2%E5%BC%95&action=edit&redlink=1)。一般应用在网络搜索引擎上,搜索引擎通过爬虫软件更新自身的网站内容供用户搜索。

##### 网站反爬机制  :

爬虫访问网站的过程会消耗目标系统资源。不少网络系统并不默许爬虫工作。因此在访问大量页面时，爬虫需要考虑到规划、负载，还需要讲“礼貌”。 不愿意被爬虫访问、被爬虫主人知晓的公开站点可以使用[robots.txt](https://zh.wikipedia.org/wiki/Robots.txt)文件之类的方法避免访问。这个文件可以要求[机器人](https://zh.wikipedia.org/w/index.php?title=%E8%BD%AF%E4%BB%B6%E5%8A%A9%E7%90%86&action=edit&redlink=1)只对[网站](https://zh.wikipedia.org/wiki/%E7%BD%91%E7%AB%99)的一部分进行索引，或完全不作处理。



# 2.爬虫的流程

#### 2.1对想要的爬的页面进行分析

我们最终的目标是实现爬取前程无忧web前端工程师的职位名称,公司名称,工作地点,薪资,发布时间.

当然,我们可以进行深入爬取,爬取对应公司对技能的具体要求深入爬取涉及到对网页的二次请求.虽然node爬虫相对于python爬虫有自身的优点，可以凭借强大的异步特性很轻松的实现高效的异步并发请求，节省`cpu`的开销。 但是这会有较大概率被网站检测到你在极短的时间内对网页进行量化请求,会被认定是`DDos`攻击

[^DDos攻击]: (分布式拒绝服务攻击是指处于不同位置的多个攻击者同时向一个或数个目标发动攻击，或者一个攻击者控制了位于不同位置的多台机器并利用这些机器对受害者同时实施攻击。由于攻击的发出点是分布在不同地方的，这类攻击称为分布式拒绝服务攻击，其中的攻击者可以有多个。)

或者危害本网站,会触发反爬机制.所以这里我们不讨论深入爬取,有兴趣的可以了解一下python的深度爬取.



#### 2.2爬虫爬取的主要步骤： 

##### 1. 结构分析

我们要爬取页面的数据，第一步是要先分析清楚页面结构，要爬哪些页面，页面的结构是怎样的，需不需要登录；有没有`ajax`接口，返回什么样的数据等。

##### 2.数据抓取

分析清楚要爬取哪些页面和`ajax`，就要去抓取数据了。如今的网页的数据，大体分为同步页面和`ajax`接口。同步页面数据的抓取就需要我们先分析网页的结构，python抓取数据一般是通过正则表达式匹配来获取需要的数据；node有一个cheerio的工具，可以将获取的页面内容转换成`jquery`对象，然后就可以用`jquery`强大的`dom API`来获取节点相关数据， 其实大家看源码，这些`API`本质也就是正则匹配。`ajax`接口数据一般都是`json`格式的，处理起来还是比较简单的。

##### 3.数据存储

 抓取的数据后，会做简单的筛选，然后将需要的数据先保存起来，以便后续的分析处理。当然我们可以用`MySQL`和`Mongodb`等数据库存储数据。这里，我们为了方便，直接采用文件存储。 

##### 4.数据分析

因为我们最终是要展示数据的，所以我们要将原始的数据按照一定维度去处理分析，然后返回给客户端。这个过程可以在存储的时候去处理，也可以在展示的时候，前端发送请求，后台取出存储的数据再处理。这个看我们要怎么展示数据了。 

##### 5.数据可视化

前端展示页面,将数据展示出来才更直观，方便我们分析统计。 当然了,对于数据可视化的操作有很多,最最常见的就是我们之前学的`echarts`图表可视化,大家可以多看看这个插件的使用.

#### 2.3技术栈介绍：

##### 1. [Superagent](https://link.juejin.im?target=http%3A%2F%2Fvisionmedia.github.io%2Fsuperagent%2F)

`Superagent`是个轻量的的`http`方面的库，是`nodejs`里一个非常方便的客户端请求代理模块，当我们需要进行get、post、head等网络请求时，尝试下它吧。

##### 2.[Superagent-charset](http://www.tuicool.com/articles/6Rbyu2)

`Superagent-charset`是一个对字符集处理的一个轻量级的库,能让字符集之间实现互相转化。

##### 3. [Cheerio](https://link.juejin.im?target=https%3A%2F%2Fgithub.com%2Fcheeriojs%2Fcheerio)

Cheerio大家可以理解成一个 `Node.js` 版的 `jquery`，用来从网页中以` css` selector 取数据，使用方式跟 `jquery` 一模一样。

##### 4. [node-xlsx](https://www.jianshu.com/p/7d2e584cbcc1)

`node-xlsx`库是目前 `Github` 上 star 数量最多的处理 Excel 的库，功能强大，能够对excel文档进行读取,写入等操作。



# 3.页面结构分析

我们先进入想要爬取的前程无忧web前端工程师搜索页面

```
https://search.51job.com/list/020000,000000,0000,00,9,99,web%25E5%2589%258D%25E7%25AB%25AF,2,1.htmllang=c&stype=1&postchannel=0000&workyear=99&cotype=99°reefrom=99&jobterm=99&companysize=99&lonlat=0%2C0&radius=-1&ord_field=0&confirmdate=9&fromType=&dibiaoid=0&address=&line=&specialarea=00&from=&welfare=
```

 然后我们对其进行分析,按F12进入检查,查看信息的标签分别对应什么标签

 

# 4.模块代码

#### 1.引入我们需要的库

```js
const charset = require('superagent-charset')
const cheerio = require('cheerio')
const request = charset(require('superagent'))
const fs = require('fs')
const xlsx = require('node-xlsx')
```



#### 2.对页面进行抓取

```js
request
    .get(url, {
      encoding: null,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:57.0) Gecko/20100101 Firefox/57.0'
      }
    })
    .charset('gbk')
    .end((err, res) => {
      if (err) {
        console.log('爬取失败!')
      } else {
        // console.log(res);
        // 调用 cheerio.load() 方法，生成一个类似于 jQuery 的对象
        let $ = cheerio.load(res.text)
        // 获取对象中el的元素
        let list = $('#resultList .el').not('.title')
        list.each((index, element) => {
          let line = []
          const el = $(element)
          // 设置每条数据的id
          // line.push(data.length+1)
          // 获取数据中的职位
          line.push(el.find('.t1 span a').attr('title'))
          // 获取数据中的公司
          line.push(el.find('.t2 a').text())
          // 获取数据中的地址
          line.push(el.find('.t3').text())
          // 获取数据中的薪资
          line.push(el.find('.t4').text())
          // 获取数据中的发布时间
          line.push(el.find('.t5').text())
          data.push(line)
        })
        
        } else {
          return false
        }
      }
      // console.log(data)
      writeXls(data)
    })
}
```



####  3.对网站多页面的处理

```js
// 尝试进行多页面爬取
page++
if (page <= endPage) {
    // 根据地址栏地址找出规律
    let url =
   'https://search.51job.com/list/020000,000000,0000,00,9,99,web%25E5%2589%258D%25E7%25AB%25AF,2,' +page +'.html?lang=c&stype=1&postchannel=0000&workyear=99&cotype=99&degreefrom=99&jobterm=99&companysize=99&lonlat=0%2C0&radius=-1&ord_field=0&confirmdate=9&fromType=&dibiaoid=0&address=&line=&specialarea=00&from=&welfare='
start(url) //进行递归抓取
```



#### 4.将爬取到的数据写入excel

```js
function writeXls(data) {
  var buffer = xlsx.build([
    {
      name: 'sheet1',
      data: data
    }
  ])
  fs.writeFileSync('data.xlsx', buffer, { flag: 'w' })
}
```



 
