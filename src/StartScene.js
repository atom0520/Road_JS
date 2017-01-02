/**
 * Created by atom on 16/7/23.
 */
var StartLayer = cc.Layer.extend({

    ctor:function(){
        this._super();
        var bgSprite1 = new cc.Sprite(res.startBg1_png);
        bgSprite1.setAnchorPoint(cc.p(0.5,1));
        bgSprite1.setPosition(cc.p(cc.winSize.width/2,cc.winSize.height));
        this.addChild(bgSprite1,1);

        var bgSprite2 = new cc.Sprite(res.startBg2_png);
        bgSprite2.setPosition(cc.p(cc.winSize.width/2,cc.winSize.height/2));
        this.addChild(bgSprite2,2);

        var logoSprite = new cc.Sprite(res.startLogo_png);
        logoSprite.setPosition(cc.p(cc.winSize.width/2,cc.winSize.height/2));
        this.addChild(logoSprite,3);

        var pressHintSprite = new cc.Sprite(res.pressButtonHint_png);
        pressHintSprite.setPosition(cc.p(cc.winSize.width/2,
            logoSprite.getPositionY()
            -logoSprite.getContentSize().height/2
            -pressHintSprite.getContentSize().height/2));
        
        this.addChild(pressHintSprite,4);

        var pressHintSpriteRepeatFadeUpFadeDownAction = cc.repeatForever(
            cc.sequence(
                cc.fadeTo(1.0,32),cc.fadeTo(1.0,255)
            )
        );

        pressHintSprite.runAction(pressHintSpriteRepeatFadeUpFadeDownAction);


    },
    onEnterTransitionDidFinish:function(){
        this._super();
        cc.eventManager.addListener({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan:function(touch,event){
                return true;
            }.bind(this),
            onTouchEnded:function(touch,event){

                var sceneTransition = new cc.TransitionFade(g_sceneTransitionDuration,new GameScene());
                cc.director.runScene(sceneTransition);

            }.bind(this)
        },this);




        if(cc.sys.platform === cc.sys.DESKTOP_BROWSER) {

        }else{
            var exitLabel = new cc.LabelTTF("Exit","Marker Felt",48);

            exitLabel.setAnchorPoint(cc.p(1.0,0.0));
            exitLabel.setPosition(cc.p(cc.winSize.width-12,8));
            exitLabel.setFontFillColor(cc.color(128,128,128,222));
            this.addChild(exitLabel,5);

            cc.eventManager.addListener({
                event:cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches:true,
                onTouchBegan: function(touch,event){
                    var exitLabelBoudingBox = exitLabel.getBoundingBox();
                    var touchPos = touch.getLocation();
                    if(touchPos.x >= exitLabelBoudingBox.x
                        && touchPos.x <= exitLabelBoudingBox.x+exitLabelBoudingBox.width
                        && touchPos.y >= exitLabelBoudingBox.y
                        && touchPos.y <= exitLabelBoudingBox.y+exitLabelBoudingBox.height){

                        return true;
                    }else{

                        return false;
                    }
                }.bind(this),
                onTouchEnded:function(touch,event){
                    cc.director.end();
                    if(cc.sys.os === cc.sys.OS_IOS){
                        //终止应用程序???
                        cc.sys.os.exit();
                    }
                }.bind(this)
            },exitLabel);
        }


    },
    onExitTransitionDidStart:function(){
        this._super();
      
        cc.eventManager.removeAllListeners();
        
    }
});

var StartScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new StartLayer();
        //layer.init();
        this.addChild(layer);
    }
});
