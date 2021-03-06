var api = require("../../api.js"), app = getApp();

Page({
    data: {
        order: null,
        getGoodsTotalPrice: function() {
            return this.data.order.total_price;
        }
    },
    onLoad: function(t) {
        app.pageOnLoad(this);
        var a = this;
        a.setData({
            store: wx.getStorageSync("store")
        }), wx.showLoading({
            title: "正在加载"
        }), app.request({
            url: api.order.detail,
            data: {
                order_id: t.id
            },
            success: function(t) {
                0 == t.code && a.setData({
                    order: t.data
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    copyText: function(t) {
        var a = t.currentTarget.dataset.text;
        wx.setClipboardData({
            data: a,
            success: function() {
                wx.showToast({
                    title: "已复制"
                });
            }
        });
    },
    location: function() {
        var t = this.data.order.shop;
        wx.openLocation({
          latitude: parseFloat(t.lng),
          longitude: parseFloat(t.lat),
            address: t.address,
            name: t.name
        });
    }
});