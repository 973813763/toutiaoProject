// 搜索请求模块
import request from '@/utils/request'

// 请求获取联想列表数据
export const getCearchSuggestions = q => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      q
    }
  })
}

// 请求获取联想结果列表数据
export const getCearchResult = params => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params
  })
}
