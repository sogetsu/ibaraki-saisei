var saisei;
(function (saisei) {
    var Shell = (function () {
        function Shell() {
            var _this = this;
            //should have to remove blank space add by auto formator
            this.htmlStructure = '<div class="saisei-head">'
                + '<div class="saisei-head-logo">'
                + 'ようこそ灑清教室へ'
                + '</div>'
                + '</div>'
                + '<div class="saisei-main">'
                + '<div class="saisei-main-home">Home</div >'
                + '<div class="saisei-main-gallery">Gallery</div>'
                + '<div class="saisei-main-about">About</div>'
                + '<div class="saisei-main-contents"></div>'
                + '</div>'
                + '<div class="saisei-foot"><h6>Copyright© SAISEI SITE All Rights Reserved.</h6></div>';
            this.requestText = "";
            this.initModule = function ($mainId) {
                $mainId.html(_this.htmlStructure);
                _this.$container = $mainId;
                saisei.home.initModule(_this.getContainer());
                saisei.gallery.initModule(_this.getContainer());
                saisei.about.initModule(_this.getContainer());
                $(".saisei-main-home").trigger("click");
            };
            this.getContainer = function () {
                return _this.$container;
            };
        }
        return Shell;
    }());
    saisei.shell = new Shell();
})(saisei || (saisei = {}));
//# sourceMappingURL=saisei.shell.js.map