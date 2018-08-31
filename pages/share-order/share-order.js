var api = require("../../api.js"),
  app = getApp(),
  is_no_more = !1,
  is_loading = !1,
  p = 2;

Page({
  data: {
    status: -1,
    list: [],
    hidden: -1,
    searchIndex: 1,
    inputValue: '',
  },
  onLoad: function(t) {
    app.pageOnLoad(this);
    is_loading = is_no_more = !1, p = 2, this.GetList(t.status || -1);
  },
  GetList: function(t) {
    var a = this;
    a.setData({
      status: parseInt(t || -1)
    }), wx.showLoading({
      title: "正在加载",
      mask: !0
    }), app.request({
      url: api.share.get_order,
      data: {
        status: a.data.status
      },
      success: function(t) {
        a.setData({
          list: t
        });

      },
      complete: function() {
        wx.hideLoading();
      }
    });
  },
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {},
  click: function(t) {
    var a = t.currentTarget.dataset.index;
    this.setData({
      hidden: this.data.hidden == a ? -1 : a
    });
  },
  onReachBottom: function() {
    var s = this;
    s.data.searchIndex++;
    is_loading || is_no_more || (is_loading = !0, app.request({
      url: api.share.get_order,
      data: {
        status: s.data.status,
        page: p
      },
      success: function(t) {
        if (0 == t.code) {
          var a = s.data.list.concat(t.data);
          s.setData({
            list: a
          }), 0 == t.data.length && (is_no_more = !0);
        }
        p++;
      },
      complete: function() {
        is_loading = !1;
      }
    }));
  },

  bindInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  search: function(e) {
    var a = this;
    wx.showLoading({
      title: '加载中...',
    })
    var value = a.data.inputValue;
    if(value==null||value==''){
      this.GetList();
      return
    }
    var params = {};
    params.mobile = value;
    params.page = a.data.searchIndex;
    if (a.data.status != -1) {
      params.state = a.data.status;
    }
    app.request({
      url: api.share.find_order,
      data: params,
      success: function(t) {
        a.setData({
          list: t
        });
      },
      complete: function() {
        wx.hideLoading();
      }
    });
  },

  confirmOrder: function(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定分销该订单吗？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.upOrder(e);
        } else if (res.cancel) {
          console.log('用户点击取消')

        }
      }
    })

  },

  upOrder: function(e) {
    var index = e.currentTarget.dataset.index;
    var a = this;
    wx.showLoading({
      title: '加载中...',
    })
    app.request({
      url: api.share.up_order,
      data: {
        order_id: a.data.list[index].order_id
      },
      success: function(t) {
        wx.showToast({
          title: '核销成功',
        })
      },
      complete: function() {
        wx.hideLoading();
        a.GetList();
      }
    });

  }
});