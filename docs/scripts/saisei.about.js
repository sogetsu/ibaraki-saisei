var saisei;
(function (saisei) {
    var About = (function () {
        function About() {
            var _this = this;
            this.htmlStructure = '';
            this.initModule = function ($container) {
                //alert("start initabout");
                _this.$aboutElem = $container.find('.saisei-main-about');
                _this.$aboutContents = $container.find('.saisei-main-contents');
                _this.bindHoverHandle(_this.$aboutElem);
                _this.bindClickHandle(_this.$aboutElem);
            };
            this.bindHoverHandle = function ($elem) {
                $elem.hover(function () {
                    $($elem).toggleClass('saisei-hover');
                });
            };
            this.bindClickHandle = function ($elem) {
                $elem.bind("click", function () {
                    // 草月のリンクページを表示する
                    // リンク切れ対策も検討する
                    window.open("http://www.sogetsu.or.jp/study/class/areaB/8/0038738001.html");
                });
            };
        }
        return About;
    }());
    saisei.about = new About();
})(saisei || (saisei = {}));
//# sourceMappingURL=saisei.about.js.map