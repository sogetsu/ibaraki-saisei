var saisei;
(function (saisei) {
    // Dataは各オブジェクトの性質に応じてCRUDを実装する
    // Dataに直接アクセスするのはModelのみ
    var ImgData = (function () {
        function ImgData() {
            var _this = this;
            this.select = function (key) {
                var result = new Array();
                for (var i = 0; i < _this.imgPathList.length; i++) {
                    var fileName = _this.imgPathList[i];
                    if (fileName.length > 0 && fileName.indexOf(key) !== -1) {
                        result.push(fileName);
                    }
                }
                //console.log("key " + key + " " + result);
                return result;
            };
            this.push = function (fileName) {
                _this.imgPathList.push(fileName);
            };
            this.delete = function () { }; // たぶん不要
            this.length = function () {
                return _this.imgPathList.length;
            };
            var temp = saisei.imgPathList;
            temp.sort(function (str1, str2) {
                var comp = 0;
                var n1 = Number(str1.substring(0, 6));
                var n2 = Number(str2.substring(0, 6));
                var p1 = str1.indexOf(saisei.imgOrderKey);
                var p2 = str2.indexOf(saisei.imgOrderKey);
                if (n1 > n2) {
                    comp = -1;
                }
                else if (n1 < n2) {
                    comp = 1;
                }
                else {
                    if (p1 > p2) {
                        comp = -1;
                    }
                    else if (p1 < p2) {
                        comp = 1;
                    }
                }
                return comp;
            });
            this.imgPathList = temp;
        }
        return ImgData;
    }());
    var NewsData = (function () {
        function NewsData() {
            var _this = this;
            this.newsList = saisei.eventListData;
            this.select = function (key, prop) {
                if (prop === void 0) { prop = "property"; }
                var result = new Array();
                // keyが年月，イベント名，開催場所のいずれかにヒットすれば返却する実装
                for (var i = 0; i < _this.newsList.length; i++) {
                    var record = _this.newsList[i];
                    var conVal = _this.concatValues(record);
                    if (conVal.length > 0 && conVal.indexOf(key) !== -1) {
                        result.push(record);
                    }
                }
                _this.sortDesc(result);
                return result;
            };
            this.push = function (record) {
                _this.newsList.push(record);
            };
            this.delete = function () { }; // たぶん不要
            this.length = function () {
                return _this.newsList.length;
            };
            // 全イベントリスト
            this.selectAll = function () {
                var result = new Array();
                result = _this.newsList;
                _this.sortDesc(result);
                return result;
            };
            // 型情報を保持したままプロパティリストを得る良い方法がなかった
            this.concatValues = function (record) {
                var result = "";
                if (record.yyyymmdd != null) {
                    result = result + record.yyyymmdd + " ";
                }
                if (record.eventName != null) {
                    result = result + record.eventName + " ";
                }
                if (record.location != null) {
                    result = result + record.location + " ";
                }
                return result;
            };
            this.sortDesc = function (list) {
                list.sort(function (n1, n2) {
                    var comp = 0;
                    if (n1.yyyymmdd > n2.yyyymmdd) {
                        comp = -1;
                    }
                    else if (n1.yyyymmdd < n2.yyyymmdd) {
                        comp = 1;
                    }
                    return comp;
                });
            };
        }
        return NewsData;
    }());
    var ImgRuleData = (function () {
        function ImgRuleData() {
            var _this = this;
            this.ruleList = saisei.rulePhotoName;
            this.select = function (imgName, prop) {
                if (prop === void 0) { prop = "creator"; }
                var result = new Array();
                for (var i = 0; i < _this.ruleList.length; i++) {
                    var hint = "";
                    if (prop === "event") {
                        hint = _this.ruleList[i].eventHint;
                    }
                    else if (prop === "location") {
                        hint = _this.ruleList[i].locationHint;
                    }
                    else {
                        hint = _this.ruleList[i].creatorHint;
                    }
                    if (imgName.length > 0 && imgName.indexOf(_this.ruleList[i].shortName) !== -1) {
                        result.push(_this.ruleList[i]);
                    }
                }
                return result;
            };
            this.push = function (record) {
                _this.ruleList.push(record);
            };
            this.delete = function () { }; // たぶん不要
            this.length = function () {
                return _this.ruleList.length;
            };
            // 全データ取得
            this.selectAll = function () {
                var result = new Array();
                for (var i = 0; i < _this.ruleList.length; i++) {
                    result.push(_this.ruleList[i]);
                }
                return result;
            };
        }
        return ImgRuleData;
    }());
    var LocationData = (function () {
        function LocationData() {
            this.getObject = function () {
                var result = new LocationData();
                result.location = "";
                result.eventList = new Array();
                return result;
            };
        }
        return LocationData;
    }());
    saisei.imgData = new ImgData();
    saisei.newsData = new NewsData();
    saisei.imgRuleData = new ImgRuleData();
    saisei.locationData = new LocationData();
})(saisei || (saisei = {}));
//# sourceMappingURL=saisei.data.js.map