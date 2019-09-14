import React, {Component} from 'react';
import Head from '../component/head'
import './index.less';
import axios from 'axios';

class Page extends Component{
  componentDidMount() {
    axios.get('j/search_subjects?type=movie&tag=%E7%83%AD%E9%97%A8&page_limit=50&page_start=0').then(res => {
      console.log('res', res)
    })
  }
  
  render() {
    return (
      <div>
        <Head.Title title='组件页面' />
        <Head.FontSize uiSize={375} multiple={100} />
      </div>
    )
  }
}

export default Page
