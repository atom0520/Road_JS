/**
 * Created by atom on 16/7/21.
 */
var GameScene = cc.Scene.extend({
    onEnter:function(){
        this._super();
        var controller = new GameSceneController();
        this.addChild(controller);
    }
});