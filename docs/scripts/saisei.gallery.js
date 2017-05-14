var saisei;
(function (saisei) {
    var Gallery = (function () {
        function Gallery() {
            var _this = this;
            this.imgBlockIds = ["#galleryImgBlock01", "#galleryImgBlock02", "#galleryImgBlock03", "#galleryImgBlock04", "#galleryImgBlock05"];
            this.stateMap = new GalleryState();
            this.htmlStructure = '<div class="saisei-gallery-search">'
                + '    <div id="accordion">'
                + '        <h3>イベント名</h3>'
                + '        <div>'
                + '            <select id="selectmenu01" class="saisei-gallery-select">'
                + '                <option>イベント名を選択</option>'
                + '            </select>'
                + '        </div>'
                + '        <h3>作者名</h3>'
                + '        <div>'
                + '            <select id="selectmenu02" class="saisei-gallery-select">'
                + '                <option>作者名を選択</option>'
                + '            </select>'
                + '        </div>'
                + '        <h3>施設・場所名</h3>'
                + '        <div>'
                + '            <select id="selectmenu03" class="saisei-gallery-select">'
                + '                <option>施設・場所名を選択</option>'
                + '            </select>'
                + '        </div>'
                + '    </div>'
                + '</div>'
                + '<!-- 横並びは前後のタグの改行を削除する 余白対策 -->'
                + '<div class="saisei-gallery-upperblock">'
                + '    <div id="galleryImgBlock01" class="saisei-gallery-block">'
                + '        <div class="saisei-gallery-upperimg-text">作品タイトル</div>'
                + '        <button class="saisei-gallery-image" style="background-image:url(' + "'images/shell-img001.jpg'" + ')"></button> '
                + '    </div><div id="galleryImgBlock02" class="saisei-gallery-block">'
                + '        <div class="saisei-gallery-upperimg-text">作品タイトル</div>'
                + '        <button class="saisei-gallery-image" style="background-image:url(' + "'images/shell-img001.jpg'" + ')"></button> '
                + '    </div><div id="galleryImgBlock03" class="saisei-gallery-block">'
                + '        <div class="saisei-gallery-upperimg-text">作品タイトル</div>'
                + '        <button class="saisei-gallery-image" style="background-image:url(' + "'images/shell-img001.jpg'" + ')"></button> '
                + '    </div>'
                + '</div>'
                + '<div class="saisei-gallery-lowerblock">'
                + '    <div id="galleryImgBlock04" class="saisei-gallery-block">'
                + '        <button class="saisei-gallery-image" style="background-image:url(' + "'images/shell-img001.jpg'" + ')"></button> '
                + '        <div class="saisei-gallery-lowerimg-text">作品タイトル</div>'
                + '    </div><div id="galleryImgBlock05" class="saisei-gallery-block">'
                + '        <button class="saisei-gallery-image" style="background-image:url(' + "'images/shell-img001.jpg'" + ')"></button> '
                + '        <div class="saisei-gallery-lowerimg-text">作品タイトル</div>'
                + '    </div><div class="saisei-gallery-block">'
                + '        <div class="saisei-gallery-buttonset">'
                + '            <div class="saisei-gallery-buttondummy"></div>'
                + '            <button id="button-icon01">最初のページ</button>'
                + '            <button id="button-icon02">前のページ</button>'
                + '            <button id="button-icon03">次のページ</button>'
                + '            <button id="button-icon04">最後のページ</button>'
                + '        </div>'
                + '        <div class="saisei-gallery-blockdummy">続きがあります</div>'
                + '    </div>'
                + '<!-- ui-dialog -->'
                + '<div id="gallery-dialog" title="Dialog Title">'
                + '    <div class="saisei-gallery-dialog"><img src="images/shell-img001.jpg" alt="jpg photo data" class="saisei-gallery-dialog-img" /></div>'
                + '</div>'
                + '</div>';
            this.initModule = function ($container) {
                //alert("start initgallery");
                _this.$galleryElem = $container.find('.saisei-main-gallery');
                _this.$galleryContents = $container.find('.saisei-main-contents');
                _this.bindHoverHandle(_this.$galleryElem);
                _this.bindClickHandle(_this.$galleryElem);
            };
            this.bindHoverHandle = function ($elem) {
                $elem.hover(function () {
                    $($elem).toggleClass('saisei-hover');
                });
            };
            this.bindClickHandle = function ($elem) {
                $elem.bind("click", function () {
                    var width1 = _this.$galleryContents.width();
                    // ロードするデータ（写真ファイルのパス，説明）を取得
                    // 検索用タグを生成して，$galleryContentsに追加する
                    // 検索結果に応じて新しいページ内コンテンツを生成する
                    // 検索条件は，年月，イベント名，作者の組合せ
                    _this.reloadPage();
                    _this.initElements();
                    _this.initMenu();
                    _this.initHandle();
                    // 初期表示
                    _this.initDisplay(saisei.shell.requestText);
                });
            };
            this.initDisplay = function (requestText) {
                var yyyymmdd;
                var eventName;
                if (requestText.length > "yyyymmdd,".length) {
                    var reqVals = requestText.split(",");
                    yyyymmdd = reqVals[0];
                    eventName = reqVals[1];
                }
                else {
                    var defaultVal = $("#selectmenu01 option:first").val();
                    var defaultText = $("#selectmenu01 option:first").text();
                    var values = saisei.utils.parseTuple(defaultVal);
                    yyyymmdd = values[0];
                    eventName = defaultText.substring("yyyy年 ".length);
                }
                var selectKey = saisei.utils.getKeyByEvent(yyyymmdd, eventName);
                var imgList = saisei.model.requestImgData(selectKey);
                $(".saisei-gallery-search").trigger("changeImgList", imgList.join(","));
            };
            this.reloadPage = function () {
                _this.$galleryContents.empty();
                _this.setJQueryAccess(_this.$galleryContents.append(_this.htmlStructure));
            };
            this.initElements = function () {
                $("#accordion").accordion();
                $("#gallery-dialog").dialog({
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
                // Link to open the dialog
                $(".saisei-gallery-upperblock,.saisei-gallery-lowerblock")
                    .bind("openDialog", function (event, data) {
                    var tempText = data.split(",");
                    var title = tempText[0];
                    var imgPath = saisei.utils.getPathFromStyleUri(tempText[1]);
                    // データのある時だけdialog表示
                    if (imgPath.indexOf(".jpg") !== -1) {
                        $(".saisei-gallery-dialog-img").attr('src', imgPath.replace('"', "").replace('"', "")); //IEが自動で""を補完してしまうため除去
                        $("#gallery-dialog").dialog("option", "title", title).dialog("open");
                        event.preventDefault();
                    }
                });
                $("#button-icon01").button({
                    icon: "ui-icon ui-icon-seek-first",
                    showLabel: false
                });
                $("#button-icon02").button({
                    icon: "ui-icon ui-icon-circle-triangle-w",
                    showLabel: false
                });
                $("#button-icon03").button({
                    icon: "ui-icon ui-icon-circle-triangle-e",
                    showLabel: false
                });
                $("#button-icon04").button({
                    icon: "ui-icon ui-icon-seek-end",
                    showLabel: false
                });
            };
            this.setJQueryAccess = function ($elem) {
                _this.$gallerySearch = $elem.find('.saisei-gallery-search');
                _this.$galleryEvent = $elem.find("#selectmenu01");
                _this.$galleryCreator = $elem.find("#selectmenu02");
                _this.$galleryLocation = $elem.find("#selectmenu03");
                _this.$galleryImages = $elem.find(".saisei-gallery-upperblock");
                _this.$galleryButtonSet = $elem.find(".saisei-gallery-buttonset");
            };
            this.initMenu = function () {
                // selectMenu
                _this.initEventVal();
                _this.initCreatorVal();
                _this.initLocationVal();
            };
            this.initEventVal = function () {
                var eventList = saisei.model.requestAllEvents();
                var menuEvent = "";
                var opTag1 = '<option>';
                var opTag1a = '<option value=';
                var opTag1b = '>';
                var opTag2 = '</option>';
                // イベント名にはyyyymmddとlocationを割り振っておく
                var eventRec = "";
                for (var i = 0; i < eventList.length; i++) {
                    // yyyymmdd,eventName,locationは必須なので存在チェックは省略
                    var eventVal = "{" + eventList[i].yyyymmdd + "," + eventList[i].location + "}";
                    var disEventText = eventList[i].yyyyNen + " " + eventList[i].eventName + " " + eventList[i].titleName;
                    eventRec = eventRec + opTag1a + eventVal + opTag1b + disEventText + opTag2;
                }
                _this.$galleryEvent.empty().append(eventRec);
            };
            this.initCreatorVal = function () {
                var creatorList = saisei.model.requestAllCreators();
                var menuCreator = "";
                var opTag1 = '<option>';
                var opTag1a = '<option value=';
                var opTag1b = '>';
                var opTag2 = '</option>';
                // 作者名にはshortNameを割り振っておく
                var creatorRec = "";
                for (var i = 0; i < creatorList.length; i++) {
                    creatorRec = creatorRec + opTag1a + creatorList[i].shortName + opTag1b + creatorList[i].creatorHint + opTag2;
                }
                _this.$galleryCreator.empty().append(creatorRec);
            };
            this.initLocationVal = function () {
                var locationList = saisei.model.requestAllLocations();
                var menuLocation = "";
                var opTag1 = '<option>';
                var opTag1a = '<option value=';
                var opTag1b = '>';
                var opTag2 = '</option>';
                // eventAllとlocationAllは別のリクエストにして，modelに隠ぺいする．データ構造依存は切り離す
                var locationRec = "";
                for (var i = 0; i < locationList.length; i++) {
                    var locVal = "";
                    for (var j = 0; j < locationList[i].eventList.length; j++) {
                        locVal = locVal + "{" + locationList[i].eventList[j].yyyymmdd + "," + locationList[i].eventList[j].eventName + "}";
                    }
                    locationRec = locationRec + opTag1a + locVal + opTag1b + locationList[i].location + opTag2;
                }
                _this.$galleryLocation.empty().append(locationRec);
            };
            this.initHandle = function () {
                //alert("initHandle");
                _this.initButton01Handle($("#button-icon01"));
                _this.initButton02Handle($("#button-icon02"));
                _this.initButton03Handle($("#button-icon03"));
                _this.initButton04Handle($("#button-icon04"));
                _this.initChange01Handle(_this.$galleryEvent);
                _this.initChange02Handle(_this.$galleryCreator);
                _this.initChange03Handle(_this.$galleryLocation);
                _this.initChangeImgListHandle();
                _this.initChangeImgSrcHandle();
            };
            this.initButton01Handle = function ($elem) {
                $elem.bind("click", function () {
                    if (_this.stateMap.isStartPage) {
                        alert("最初のページです");
                    }
                    else if (_this.stateMap.hasMulchPages) {
                        _this.stateMap.startIndex = 0;
                        _this.swichPageState(_this.stateMap.startIndex);
                        $(".saisei-gallery-image").trigger("changeImgSrc");
                    }
                    else {
                        alert("not need action"); // dummy action
                    }
                });
            };
            this.initButton02Handle = function ($elem) {
                $elem.bind("click", function () {
                    if (_this.stateMap.isStartPage) {
                        alert("最初のページです");
                    }
                    else if (_this.stateMap.hasMulchPages) {
                        var nextStartIndex = Math.max(_this.stateMap.startIndex - saisei.maxPhotoInPage, 0);
                        _this.stateMap.startIndex = nextStartIndex;
                        _this.swichPageState(_this.stateMap.startIndex);
                        $(".saisei-gallery-image").trigger("changeImgSrc");
                    }
                    else {
                        alert("not need action"); // dummy action
                    }
                });
            };
            this.initButton03Handle = function ($elem) {
                $elem.bind("click", function () {
                    if (_this.stateMap.isEndPage) {
                        alert("最後のページです");
                    }
                    else if (_this.stateMap.hasMulchPages) {
                        var nextStartIndex = Math.min(_this.stateMap.startIndex + saisei.maxPhotoInPage, _this.stateMap.imgList.length - 1);
                        _this.stateMap.startIndex = nextStartIndex;
                        _this.swichPageState(_this.stateMap.startIndex);
                        $(".saisei-gallery-image").trigger("changeImgSrc");
                    }
                    else {
                        alert("not need action"); // dummy action
                    }
                });
            };
            this.initButton04Handle = function ($elem) {
                $elem.bind("click", function () {
                    if (_this.stateMap.isEndPage) {
                        alert("最後のページです");
                    }
                    else if (_this.stateMap.hasMulchPages) {
                        _this.stateMap.startIndex = _this.stateMap.imgList.length - saisei.maxPhotoInPage;
                        _this.swichPageState(_this.stateMap.startIndex);
                        $(".saisei-gallery-image").trigger("changeImgSrc");
                    }
                    else {
                        alert("not need action"); // dummy action
                    }
                });
            };
            this.swichPageState = function (startIndex) {
                var imgTotal = _this.stateMap.imgList.length;
                if (imgTotal === 0 || imgTotal === saisei.maxPhotoInPage) {
                    _this.stateMap.isStartPage = true;
                    _this.stateMap.isEndPage = true;
                }
                else if (startIndex === 0) {
                    _this.stateMap.isStartPage = true;
                    _this.stateMap.isEndPage = false;
                }
                else if ((imgTotal - startIndex - 1) < saisei.maxPhotoInPage) {
                    _this.stateMap.isStartPage = false;
                    _this.stateMap.isEndPage = true;
                }
                else {
                    _this.stateMap.isStartPage = false;
                    _this.stateMap.isEndPage = false;
                }
                _this.swichContinueGuideText(_this.stateMap.hasMulchPages);
            };
            this.initChange01Handle = function ($elem) {
                $elem.selectmenu({
                    change: function (event, ui) {
                        var values = saisei.utils.parseTuple(ui.item.value);
                        var eventName = ui.item.label.substring("yyyy年 ".length);
                        var selectKey = saisei.utils.getKeyByEvent(values[0], eventName);
                        var imgList = saisei.model.requestImgData(selectKey);
                        $(".saisei-gallery-search").trigger("changeImgList", imgList.join(","));
                    }
                });
            };
            this.initChange02Handle = function ($elem) {
                $elem.selectmenu({
                    change: function (event, ui) {
                        var imgList = saisei.model.requestImgData(ui.item.value);
                        $(".saisei-gallery-search").trigger("changeImgList", imgList.join(","));
                    }
                });
            };
            this.initChange03Handle = function ($elem) {
                $elem.selectmenu({
                    change: function (event, ui) {
                        var imgList = new Array();
                        var values = saisei.utils.parseTuple(ui.item.value);
                        for (var i = 0; (2 * i) < values.length; i++) {
                            var selectKey = saisei.utils.getKeyByEvent(values[2 * i], values[2 * i + 1]);
                            var tempList = saisei.model.requestImgData(selectKey);
                            for (var j = 0; j < tempList.length; j++) {
                                imgList.push(tempList[j]);
                            }
                        }
                        $(".saisei-gallery-search").trigger("changeImgList", imgList.join(","));
                    }
                });
            };
            this.getImgListFromEvent = function (yyyymmdd, eventName) {
                var selectKey = saisei.utils.getKeyByEvent(yyyymmdd, eventName);
                var imgList = saisei.model.requestImgData(selectKey);
                return imgList;
            };
            this.initChangeImgListHandle = function () {
                _this.$gallerySearch.bind("changeImgList", function (event, imgList) {
                    _this.initStateMap(imgList);
                    $(".saisei-gallery-image").trigger("changeImgSrc");
                });
            };
            this.initChangeImgSrcHandle = function () {
                for (var i = 0; i < _this.imgBlockIds.length; i++) {
                    _this.changeImgSrcImp(i); // ここに直接Impの中身を書くとiがクロージャから外れてしまう
                }
            };
            this.changeImgSrcImp = function (index) {
                $(_this.imgBlockIds[index]).bind("changeImgSrc", function () {
                    var divTag1a = '<div class="saisei-gallery-upperimg-text">';
                    var divTag1aa = '<div class="saisei-gallery-lowerimg-text">';
                    var divTag1b = '</div>';
                    var btnTag1a = '<button class="saisei-gallery-image" style="background-image:url(';
                    var btnTag1b = ')"></button>';
                    var imgIndex = _this.stateMap.startIndex + index;
                    var imgPath = saisei.prefixPath + _this.stateMap.imgList[imgIndex]; // IEでsaisei.prefixPathが解決できない対応
                    var titleText = "";
                    if (_this.stateMap.imgList.length > imgIndex && _this.stateMap.imgList[imgIndex].length > 0) {
                        titleText = saisei.model.requestCreatorName(_this.stateMap.imgList[imgIndex]) + " 作品";
                    }
                    var blockHtml = "";
                    if (index < 3) {
                        blockHtml = divTag1a + titleText + divTag1b + btnTag1a + imgPath + btnTag1b;
                    }
                    else {
                        blockHtml = btnTag1a + imgPath + btnTag1b + divTag1aa + titleText + divTag1b;
                    }
                    $(_this.imgBlockIds[index]).empty().append(blockHtml);
                }).bind("click", function () {
                    var title = $(_this.imgBlockIds[index]).text();
                    var srcStr = $(_this.imgBlockIds[index]).find('button').attr('style');
                    $(_this.imgBlockIds[index]).trigger('openDialog', title + "," + srcStr);
                });
            };
            this.initStateMap = function (imgList) {
                var list = imgList.split(",");
                _this.stateMap.imgList = saisei.utils.validateImgList(list);
                _this.stateMap.startIndex = 0;
                if (list.length > saisei.maxPhotoInPage) {
                    _this.stateMap.hasMulchPages = true;
                }
                else {
                    _this.stateMap.hasMulchPages = false;
                }
                _this.swichPageState(_this.stateMap.startIndex);
                _this.swichContinueGuideText(_this.stateMap.hasMulchPages);
            };
            this.swichContinueGuideText = function (hasMulchPages) {
                var disText = "";
                if (hasMulchPages && !_this.stateMap.isEndPage) {
                    disText = "続きがあります";
                }
                else if (!hasMulchPages || _this.stateMap.isEndPage) {
                    disText = "続きはありません";
                }
                $(".saisei-gallery-blockdummy").text(disText);
            };
        }
        return Gallery;
    }());
    var GalleryState = (function () {
        function GalleryState() {
            this.isStartPage = true;
            this.hasMulchPages = false;
            this.isEndPage = true;
            this.imgList = new Array();
            this.startIndex = 0;
        }
        return GalleryState;
    }());
    saisei.gallery = new Gallery();
})(saisei || (saisei = {}));
//# sourceMappingURL=saisei.gallery.js.map