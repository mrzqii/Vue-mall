<!--  -->
<template>
  <div>
      <HeaderNav></HeaderNav>
      <BreadNav>
        <span>Goods</span>
      </BreadNav>
<div class="accessory-result-page accessory-page">
  <div class="container">
    <div class="filter-nav">
      <span class="sortby">Sort by:</span>
      <a href="javascript:void(0)" class="default cur">Default</a>
      <a href="javascript:void(0)" class="price" @click="sortGoods">Price 
        <svg class="icon-arrow-short" :class="{'short-up':!sortFlag}">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href='#icon-arrow-short'></use>
        </svg>
      </a>
      <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
    </div>
    <div class="accessory-result">
      <!-- filter -->
      <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
        <dl class="filter-price">
          <dt>Price:</dt>
          <dd><a href="javascript:void(0)" :class="{'cur':priceChecked=='all'}" @click="setPriceFilter('all')">All</a></dd>
          <dd v-for="(item, index) in preiceFilter" :key="index">
            <a href="javascript:void(0)" @click="setPriceFilter(index)" :class="{'cur':priceChecked==index}">{{item.startPrice}} - {{item.endPrice}}</a>
          </dd>
        </dl>
      </div>

      <!-- search result accessories list -->
      <div class="accessory-list-wrap">
        <div class="accessory-list col-4">
          <ul>
            <li v-for="(item, index) in goodsList" :key="index">
              <div class="pic">
                <!-- 这个地方使用v-bind:src 使这个地址是动态响应的 -->
                <!-- 然后现在这个src就必须写变量了，如果要写字符串，还需要使用引号引起来 -->
                <a href="#"><img v-lazy="'/static/'+ item.productImage" alt="" /></a>
              </div>
              <div class="main">
                <div class="name">{{item.productName}}</div>
                <div class="price">{{item.salePrice}}</div>
                <div class="btn-area">
                  <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                </div>
              </div>
            </li>
             
          </ul>
          <div class="infinite-box" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
            <img src="./../assets/loading-bubbles.svg" alt="" v-show="loading">
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- 第一个弹出框 -->
<model :mdShow="mdShow" @close="closeModal">
  <p slot="msg">
    未登录，不能加入购物车！
  </p>
  <div slot="btn-group">
    <a href="javascript:;" class="btn btn--m" @click="mdShow=false">关闭</a>
  </div>
</model>
<!-- 第二个弹出框 -->
<model :mdShow="mdShowCart" @close="closeModal">
  <p slot="msg">
    <span>√</span>
    <span>加入购物车成功！</span>
  </p>
  <div slot="btn-group">
    <a href="javascript:;" class="btn btn--m" @click="mdShowCart=false">继续购物</a>
    <router-link href="javascript:;" class="btn btn--m" to="/cart">查看购物车</router-link>
  </div>
</model>
<div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
<FooterNav></FooterNav>
 
  </div>
</template>

<script type='text/ecmascript-6'>
import HeaderNav from "@/components/headerNav";
import FooterNav from "@/components/footerNav";
import BreadNav from "@/components/breadNav";
import Model from '@/components/model'

import "./../assets/css/base.css";
import "./../assets/css/product.css";
import "./../assets/css/login.css";

import axios from "axios";

export default {
  data() {
    return {
      goodsList: [],
      sortFlag: true,
      page: 1,
      pageSize: 8,
      busy:true, // 配合vue-infinite-scroll插件的属性 为false 就会执行loadMore方法
      priceChecked: "all",
      loading:false, //商品加载时候的loading
      filterBy: false,
      overLayFlag: false,
      mdShow:false,
      mdShowCart:false,
      preiceFilter: [
        {
          startPrice: 0.0,
          endPrice: 100.0
        },
        {
          startPrice: 100.0,
          endPrice: 500.0
        },
        {
          startPrice: 500.0,
          endPrice: 1000.0
        },
        {
          startPrice: 1000.0,
          endPrice: 2000.0
        }
      ]
    };
  },
  components: {
    HeaderNav,
    FooterNav,
    BreadNav,
    Model
  },
  mounted: function() {
    this.getGoodsList();
  },
  methods: {
    // 获取商品的信息
    getGoodsList(flag) {
      this.loading = true
      var param = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        priceLevel: this.priceChecked
      };
      axios
        .get("/goods/list", {
          params: param //注意传参数的方式
        })
        .then(result => {
          this.loading = false
          let res = result.data;
          if (res.status == "0") {
            if(flag) { //设置如果是vue-infinite-scroll插件触发的
              this.goodsList = this.goodsList.concat(res.result.list)
              if(res.result.count == 0){ //当数据加载完了 就不再触发loadMore方法
                this.busy = true
              }else{
                this.busy = false
              }
            }else{
              this.goodsList = res.result.list;
              this.busy = false
            }
          } else {
            this.goodsList = [];
          }
        });
    },
    sortGoods() {
      this.sortFlag = !this.sortFlag;
      this.getGoodsList();
    },
    loadMore(){ //配合vue-infinite-scroll插件
      this.busy = true;
      setTimeout( () => { // 不然滚动到底部会有无数个请求发送出去
        this.page++;
        this.getGoodsList(true)
      }, 500)
      
    },
    //  移动端：点击fliter by 弹出遮罩和价格栏
    showFilterPop() {
      (this.filterBy = true), (this.overLayFlag = true);
    },
    //  移动端：点击遮罩，价格栏隐藏
    closePop() {
      (this.filterBy = false), (this.overLayFlag = false);
    },
    //  点击价格
    setPriceFilter(index) {
      this.priceChecked = index;
      this.page = 1
      this.getGoodsList()
      this.closePop();
    },
    addCart(productId){
      axios.post("/goods/addCart",{
        productId:productId
      }).then( res => {
        if(res.data.status == "0") {
           this.mdShowCart = true
        }else{
          this.mdShow = true
        }
      })
    },
    closeModal(){
      this.mdShow = false
      this.mdShowCart = false
    }
  }
};
</script>
<style>
  .short-up{
      transform: rotate(180deg);
      transition: all .3s ease-out;
    }
  .infinite-box{
    text-align: center;
    line-height: 100px;
    height: 100px;
  }
</style>
