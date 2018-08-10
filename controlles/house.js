const House = require("../models/house");
const superagent = require("superagent");
const cheerio = require("cheerio");

const tmsfUrl = "http://www.tmsf.com/newhouse/property_searchall.htm";

const priceFilterArr = {
    numbbone: 1,
    numbbtwo: 2,
    numbbthree: 3,
    numbbfour: 4,
    numbbfive: 5,
    numbbsix: 6,
    numbbseven: 7,
    numbbeight: 8,
    numbbnine: 9,
    numbbzero: 0
};

module.exports = {
    async getDataFromTmsf(page) {
        try {
            console.log(`正在获取第${page}页`);
            const res = await superagent
                .get(tmsfUrl)
                .set("User-Agent", "request")
                .query({ page });
            console.log(`获取第${page}页成功`);
            const $ = cheerio.load(res.text);
            const arr = $(".searchpageall ul li");
            const resultArr = [];
            arr.each(function() {
                const priceArr = $(this)
                    .find(".colordg .word1")
                    .children();
                var price = "";
                priceArr.each(function() {
                    const num = priceFilterArr[$(this).attr("class")];
                    price += num.toString();
                });
                price = Number(price);
                var tel = $(this)
                    .find(".build_txt05 font.colordg .colordg")
                    .text()
                    .split(" ")
                    .map(el => {
                        if (el !== "") {
                            return global.trim(el);
                        }
                    });

                resultArr.push({
                    name: global.trim(
                        $(this)
                            .find(".build_word01 a")
                            .text()
                    ),
                    otherName: global
                        .trim(
                            $(this)
                                .find(".build_word01 .black")
                                .text()
                        )
                        .replace("推广名：", ""),
                    location: global.trim(
                        $(this)
                            .find(".build_txt03.outof")
                            .text()
                    ),
                    price,
                    imgUrl: `http://www/tmsf.com${$(this)
                        .find(".build_pic .dingwei img")
                        .attr("src")}`,
                    saleNum: $(this)
                        .find(".build_pic .howsell .colormg a")
                        .text()
                        .match(/\d+/g)[0],
                    totalNum: $(this)
                        .find(".build_pic .howsell .colorlg a")
                        .text()
                        .match(/\d+/g)[0],
                    type: $(this)
                        .find(".build_txt01 .build_txt03.colormg:not(.outof)")
                        .text(),
                    tel
                });
            });
            resultArr.forEach(el => {
                console.log(el);
                House.countDocuments(
                    { name: el.name, otherName: el.otherName },
                    function(err, res) {
                        if (!err) {
                            if (res === 0) {
                                new House(el).save();
                            }
                        }
                    }
                );
            });
            return resultArr;
        } catch (error) {
            console.error(error);
        }
    },
    async getAllHouse() {
        await House.find({},function(err,res){
            if(!err){
                res.forEach(el=>{
                    console.log(el)
                    House.update({_id:el._id},{imgUrl:el.imgUrl.replace('www/','www.')},function(_err,_res){
                        if(!_err){
                            console.log(_res)
                        }
                    })
                })
            }
        })
    }
};
