var saisei;
(function (saisei) {
    var Home = (function () {
        function Home() {
            var _this = this;
            this.htmlStructure = '<button class="saisei-home-img"></button>'
                + '<div id="home-dialog">'
                + '<div class="saisei-home-dialog"><img src="images/shell-img001.jpg" alt="test" class="saisei-home-dialog-img" /></div>'
                + '</div>'
                + '<div class="saisei-home-img-text">作品タイトル</div>'
                + '<div class="saisei-home-dl-title">更新情報</div>';
            this.initModule = function ($container) {
                _this.$homeElem = $container.find('.saisei-main-home');
                _this.$homeContents = $container.find('.saisei-main-contents');
                _this.bindHoverHandle(_this.$homeElem);
                _this.bindClickHandle(_this.$homeElem);
            };
            this.bindHoverHandle = function ($elem) {
                $elem.hover(function () {
                    $($elem).toggleClass('saisei-hover');
                });
            };
            this.bindClickHandle = function ($elem) {
                $elem.bind("click", function () {
                    // ロードするデータ（写真ファイルのパス，説明，更新履歴情報）を取得
                    // タグを生成して，$homeContentsに追加する
                    // 更新履歴のテキストからは，該当するイベントのギャラリーページが生成されるようにする
                    _this.reloadPage();
                    _this.initImgList();
                    _this.initNewsList();
                });
            };
            this.reloadPage = function () {
                var homeHtml = _this.htmlStructure + _this.getDlTags(saisei.newsRowNumber);
                _this.setJQueryAccess(_this.$homeContents.empty().append(homeHtml));
            };
            this.initImgList = function () {
                // topPagePhotoの取得，割り付け
                var photoList = saisei.model.requestImgData(saisei.topPagePhoto);
                var imgPath = saisei.prefixPath + photoList[0];
                var imgUrl = 'url("' + imgPath + '")';
                _this.$home_img.css('background-image', imgUrl);
                _this.$home_dialog_img.attr('src', imgPath);
                var titleText = saisei.model.requestCreatorName(photoList[0]) + " 作品";
                _this.$saisei_home_img_text.text(titleText);
                _this.bindDialogHandle();
            };
            // なくても良いが一応置いておく
            this.getDlTags = function (newsRowNumber) {
                var sdl = '<dl class="saisei-home-dl">';
                var edl = '</dl>';
                var dtdd = "";
                for (var i = 0; i < newsRowNumber; i++) {
                    var dt = '<dt id = "home-dt' + i + '" class="saisei-home-dt">YYYY年MM月DD日（aa）～MM月DD日（aa）</dt>';
                    var dd = '<dd id = "home-dd' + i + '" class="saisei-home-dd">eventName(location)を更新しました</dd>';
                    dtdd = dtdd + dt + dd;
                }
                return (sdl + dtdd + edl);
            };
            this.setJQueryAccess = function ($elem) {
                _this.$home_img = $elem.find(".saisei-home-img");
                _this.$home_dialog = $elem.find("#home-dialog");
                _this.$home_dialog_img = $elem.find(".saisei-home-dialog-img");
                _this.$saisei_home_img_text = $elem.find(".saisei-home-img-text");
                _this.$saisei_home_dl = $elem.find(".saisei-home-dl");
            };
            this.initNewsList = function () {
                var dt = new Date();
                var thisYear = String(dt.getFullYear());
                var newsList = saisei.model.requestNewsData(thisYear);
                dt.setMonth(dt.getMonth() - 12);
                var lastYear = String(dt.getFullYear());
                var lastYearList = saisei.model.requestNewsData(lastYear);
                for (var i = 0; i < lastYearList.length; i++) {
                    newsList.push(lastYearList[i]);
                }
                _this.pushNewsData(newsList);
                _this.bindDlDtHandle();
            };
            this.pushNewsData = function (newsList) {
                var dtTag1 = '<dt class="saisei-home-dt">';
                var dtTag2 = '</dt>';
                var ddTag1a = '<dd id="';
                var ddTag1b = '" class="saisei-home-dd">';
                var ddTag2 = '</dd>';
                var newsHtml = "";
                for (var i = 0; i < saisei.newsRowNumber; i++) {
                    //alert(newsList.length + " " + newsList[i].yyyymmdd);
                    // 年月，開始日，イベント名は必須とする
                    var dtStr = newsList[i].yyyyNen + newsList[i].mmddaaStart;
                    var ddTag1AndStr = ddTag1a + i + "-" + newsList[i].yyyymmdd + ddTag1b + newsList[i].eventName + " " + newsList[i].titleName;
                    if (newsList[i].mmddaaEnd.length > 0) {
                        dtStr = dtStr + " ～ " + newsList[i].mmddaaEnd;
                    }
                    if (newsList[i].location.length > 0) {
                        if (i === 0) {
                            ddTag1AndStr = ddTag1AndStr + "(" + newsList[i].location + ") を更新しました";
                        }
                        else {
                            ddTag1AndStr = ddTag1AndStr + "(" + newsList[i].location + ") ";
                        }
                    }
                    else {
                        ddTag1AndStr = ddTag1AndStr + " ";
                    }
                    newsHtml = newsHtml + dtTag1 + dtStr + dtTag2 + ddTag1AndStr + ddTag2;
                }
                _this.$saisei_home_dl.empty().append(newsHtml);
            };
            this.bindDlDtHandle = function () {
                $(".saisei-home-dd").bind("click", function (event) {
                    var ddId = event.target.id;
                    var ddText = $("#" + ddId).text();
                    var yyyymmdd = ddId.substring(2, "i-yyyymmdd".length);
                    var eventName = ddText.substring(0, ddText.indexOf("("));
                    var values = yyyymmdd + "," + eventName;
                    //JQueryのイベントデータでも可能だが，別の方法で試行
                    saisei.shell.requestText = values;
                    $(".saisei-main-gallery").trigger("click");
                });
            };
            this.bindDialogHandle = function () {
                _this.$home_dialog.dialog({
                    autoOpen: false,
                    width: 500,
                    buttons: [
                        {
                            text: "Close",
                            click: function () {
                                $(this).dialog("close");
                            }
                        }
                    ]
                });
                _this.$home_img.bind("click", function () {
                    var title = $(".saisei-home-img-text").text();
                    var tempPath = $(".saisei-home-img").css('background-image');
                    var imgPath = "images/ui-bg_diagonals-small_0_aaaaaa_40x40.png";
                    if (tempPath.indexOf("jpg") !== -1) {
                        var startIndex = tempPath.indexOf("images/");
                        var endIndex = tempPath.indexOf(".jpg") + 4;
                        imgPath = tempPath.substring(startIndex, endIndex);
                    }
                    if (imgPath.indexOf(".jpg") !== -1) {
                        $(".saisei-home-img").attr('src', imgPath);
                        $("#home-dialog").dialog("option", "title", title).dialog("open");
                        event.preventDefault();
                    }
                });
            };
        }
        return Home;
    }());
    saisei.home = new Home();
})(saisei || (saisei = {}));
//# sourceMappingURL=saisei.home.js.map