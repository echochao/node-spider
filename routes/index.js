const router = require("koa-router")();
const houseApi = require("../controlles/house");

var loading = false
var page = 99
var finish = false

router.get("/", async (ctx, next) => {
    await ctx.render("index", {
        title: "Hello Koa 2!"
    });
});

router.get("/test", async (ctx, next) => {
    async function loopGetData(p) {
        loading = true
        await houseApi.getDataFromTmsf(p);
        page++;
        if (page <= ctx.query.totalPage) {
            await loopGetData(page);
        } else {
            loading = false
            finish = true
        }
    }
    if(finish){
        ctx.body = "获取完成";
        return;
    }
    if(loading){
        ctx.body = `${page}`;
        return;
    }
    loopGetData(page);
    ctx.body = "获取开始";
});

router.get("/json", async (ctx, next) => {
    ctx.body = {
        title: "koa2 json"
    };
});


houseApi.getAllHouse()
module.exports = router;
