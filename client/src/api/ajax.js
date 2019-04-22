import axios from 'axios'
const baseUrl = ''

export default function ajax(url, data={}, type='GET') {
  url = baseUrl + url;
  if(type==='GET') { // 发送GET请求
    let paramStr = ''
    Object.keys(data).forEach(key => {
      paramStr += key + '=' + data[key] + '&'
    })
    if(paramStr) {
      paramStr = paramStr.substring(0, paramStr.length-1)
    }
    // 使用axios发get请求
    return axios.get(url + '?' + paramStr)
  } else {// 发送POST请求
    // 使用axios发post请求
    return axios.post(url, data)
  }
}
