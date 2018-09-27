// components/refresh.js
Component({

  /**
  
  * 组件的属性列表
  
  */

  properties: {



  },



  options: {

    multipleSlots: true,

  },



  ready: function () {

    var that = this;

    const query = wx.createSelectorQuery().in(this)

    query.select(".pull").boundingClientRect(function (e) {

      that.setData({

        height: e.height,

      })

    }).exec()

  },



  /**
  
  * 组件的初始数据
  
  */

  data: {

    scrollHeight: 0,

    tips: '下拉刷新',

    isTop: false,

    isRefreshing: false

  },



  /**
  
  * 组件的方法列表
  
  */

  methods: {

    bindscroll: function (e) {

      // console.log('bindscroll---');

      // console.log(e);

    },

    bindscrolltoupper: function (e) {

      // console.log('滑动到顶部');

      // console.log(e);

    },

    bindscrolltolower: function (e) {

      // console.log('滑动到底部');

      // console.log(e);

      this.triggerEvent('onLoadMore')

    },

    start: function (e) {

      // console.log('start');

      // console.log(e);

      this.data.startY = e.touches[0].pageY;

    },

    move: function (e) {

      var that = this;

      // console.log('start');

      // console.log(e);

      var query = wx.createSelectorQuery().in(this)

      query.select('.scroll-wrap').fields({

        dataset: true,

        size: true,

        scrollOffset: true,

        properties: ['scrollX', 'scrollY'],

        computedStyle: ['margin', 'backgroundColor']

      }, function (res) {

        res.dataset // 节点的dataset

        res.width // 节点的宽度

        res.height // 节点的高度

        res.scrollLeft // 节点的水平滚动位置

        res.scrollTop // 节点的竖直滚动位置

        res.scrollX // 节点 scroll-x 属性的当前值

        res.scrollY // 节点 scroll-y 属性的当前值

        // 此处返回指定要返回的样式名

        res.margin

        res.backgroundColor



        // console.log('-----------');

        // console.log(res);

        if (res.scrollTop == 0) {

          that.data.isTop = true;

        } else {

          that.data.isTop = false;

          return

        }



        if (that.data.isRefreshing) {

          return

        }



        var dy = e.touches[0].pageY - that.data.startY;

        if (dy >= 0 && dy < that.data.height / 2) {

          that.setData({

            scrollHeight: dy

          })

        } else if (dy >= that.data.height && dy <= that.data.height * 3 / 2) {

          that.setData({

            scrollHeight: dy,

            tips: '松手释放'

          })

        } else if (dy >= that.data.height * 3 / 2) {

          that.setData({

            scrollHeight: that.data.height * 3 / 2

          })

        }

      }).exec()

    },

    end: function (e) {

      // console.log('end');

      // console.log(e);

      if (this.data.isRefreshing) {

        return

      }

      if (this.data.scrollHeight > this.data.height / 2) {

        this.setData({

          scrollHeight: this.data.height,

          tips: '正在刷新...',

          isRefreshing: true

        })

        this.triggerEvent('onRefresh')

      } else if (this.data.scrollHeight < this.data.height / 2 && this.data.scrollHeight > 0) {

        this.setData({

          scrollHeight: 0,

          tips: '下拉刷新',

          isRefreshing: false

        })

      }



    },



    stopRefresh: function () {

      this.setData({

        scrollHeight: 0,

        tips: '下拉刷新',

        isRefreshing: false

      })

    }

  }

})

