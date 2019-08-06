const charset = require('superagent-charset')
const cheerio = require('cheerio')
const request = charset(require('superagent'))
const fs = require('fs')
const xlsx = require('node-xlsx')
const url =
  'https://search.51job.com/list/020000,000000,0000,00,9,99,web%25E5%2589%258D%25E7%25AB%25AF,2,1.html?lang=c&stype=1&postchannel=0000&workyear=99&cotype=99&degreefrom=99&jobterm=99&companysize=99&lonlat=0%2C0&radius=-1&ord_field=0&confirmdate=9&fromType=&dibiaoid=0&address=&line=&specialarea=00&from=&welfare='
const startPage = 1
const endPage = 10
let page = startPage

let data = []
function start(url) {
  // 对页面进行抓取
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
        // 尝试进行多页面爬取
        page++
        if (page <= endPage) {
          // 根据地址栏地址找出规律
          let url =
            'https://search.51job.com/list/020000,000000,0000,00,9,99,web%25E5%2589%258D%25E7%25AB%25AF,2,' +
            page +
            '.html?lang=c&stype=1&postchannel=0000&workyear=99&cotype=99&degreefrom=99&jobterm=99&companysize=99&lonlat=0%2C0&radius=-1&ord_field=0&confirmdate=9&fromType=&dibiaoid=0&address=&line=&specialarea=00&from=&welfare='
          start(url) //进行递归抓取
        } else {
          return false
        }
      }
      // console.log(data)
      writeXls(data)
    })
}

//创建xlsx表格
function writeXls(data) {
  var buffer = xlsx.build([
    {
      name: 'sheet1',
      data: data
    }
  ])
  fs.writeFileSync('data.xlsx', buffer, { flag: 'w' })
}

start(url)
