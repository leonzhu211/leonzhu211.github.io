var componentHomePage = {
    template: '#templateHomePage',
}


var pathItems = [
    'homePage',
]

var router = new VueRouter({
    'routes': pathItems.map(function (item) {
        var arr = item.split('/');
        return {
            name: arr[0],
            path: '/' + item,
            component: window['component' + arr[0][0].toUpperCase() + arr[0].slice(1, arr[0].length)],
        }
    })
})

var Main = {
    data() {
        return {
            snackbarText: "",
            snackbar: false,
            activeIndex: this.$route.name,
            menuItems: [{
                group: '栏目一',
                icon: 'work',
                items: [{
                        action: 'homePage',
                        title: '1-1',
                        icon: 'add',
                    },
                    {
                        action: 'homePage',
                        title: '1-2',
                        icon: 'list',
                    },
                ]
            }, ],
        };
    },
    methods: {
        onClickMenu(action) {
            console.log('onClickMenu', action);
            pathItems.forEach((item, i) => {
                if (action == item) {
                    console.log('router push', item);
                    this.$router.push({
                        name: item
                    });
                    return false;
                }
            });
        },
    }
}

Vue.prototype.showMessage = function (msg) {
    console.log('showMessage:', msg, this);
    app.snackbar = true;
    app.snackbarText = msg;
};

Vue.use(VuetifyUploadButton);

var ExVue = Vue.extend(Main)
var app = new ExVue({
    router,
    data: {},
});
app.$mount('#app')

// goto homepage on invalid url
if (pathItems.map((item) => item.split('/')[0]).indexOf(app.$route.name) == -1) {
    app.$router.push({
        name: 'homePage',
        params: {}
    });
}