/**
 * Created by atom on 16/7/21.
 */
var GameSceneController = cc.Node.extend({
    m_view:null,
    m_gameModel:null,

    m_gameState:null,
    m_updateCounter:0,
    m_beatSpriteManager:null,
    m_nextWillPlayBgArmaturesTimeOrder:0,

    ctor:function(){
        this._super();
        this.m_view = new GameSceneView();
        this.m_view.m_delegate = this;
        this.addChild(this.m_view);

        this.m_gameModel = new GameModel();
        this.m_gameState = GameState.init;
        this.m_updateCounter = 0;

        this.m_beatSpriteManager = new BeatSpriteManager();

    },
    onEnterTransitionDidFinish:function(){
        this._super();

        cc.eventManager.addListener({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan:this.onTouchBegan.bind(this),
        },this.m_view);
        
        cc.eventManager.addListener({
            event:cc.EventListener.CUSTOM,
            eventName:NOTIFICATION_BEAT_APPEAR,
            callback:this.beatAppearCallback.bind(this)
        },this);

        cc.eventManager.addListener({
            event:cc.EventListener.CUSTOM,
            eventName:NOTIFICATION_BEAT_PASS_MISS,
            callback:this.beatPassMissCallback.bind(this)
        },this);

        cc.eventManager.addListener({
            event:cc.EventListener.CUSTOM,
            eventName:NOTIFICATION_BEAT_GET_TOUCHED,
            callback:this.beatGetTouchedCallback.bind(this)
        },this);

        cc.eventManager.addListener({
            event:cc.EventListener.CUSTOM,
            eventName:NOTIFICATION_HERO_CHANGE_STATE,
            callback:this.heroChangeStateCallback.bind(this)
        },this);

        cc.eventManager.addListener({
            event:cc.EventListener.CUSTOM,
            eventName:NOTIFICATION_ENTER_ENDING,
            callback:this.enterEndingCallback.bind(this)
        },this);

        cc.eventManager.addListener({
            event:cc.EventListener.CUSTOM,
            eventName:NOTIFICATION_VIEW_CLARITY_CHANGE,
            callback:this.viewClarityChangeCallback.bind(this)
        },this);

        this.schedule(this.update.bind(this),1/120);

    },
    onExitTransitionDidStart:function () {
        this._super();
        SoundManager.stopMusic();
        cc.log("GameSceneController onExitTransitionDidStart");
        this.m_beatSpriteManager.deleteAllBeatSpritesVars();

        cc.eventManager.removeAllListeners();
    },
    onTouchBegan:function(touch,event) {
        //cc.log("on Touch Began!");
        if (this.m_gameState == GameState.inTheGame) {
            if (SoundManager.isMusicPlaying() == false) {
                return false;
            }
            //this.m_gameModel.touchBeatJudge(SoundManager.getCurrentMusicTime());
            this.m_gameModel.touchBeatJudge(this.m_gameModel.m_gameTimer);

            return true;
        } else if (this.m_gameState == GameState.waitForTouchToReturn) {
            cc.log("return StartScene!");
            var sceneTransition = new cc.TransitionFade(g_sceneTransitionDuration,new StartScene());
            cc.director.runScene(sceneTransition);
            return true;
        }
        return false;
    }
    ,
    update:function(dt){
        this._super(dt);
        
        switch (this.m_gameState){
            case GameState.pause:

                break;
            case GameState.init:

                this.m_updateCounter++;
                if(this.m_updateCounter == 5){
                    this.m_gameModel.initCurrBeatsVars(0);
                    this.initGameSceneView();
                    this.m_view.m_bgArmatures[0].setVisible(true);
                    this.m_view.m_bgArmatures[0].getAnimation().play(g_bgArmaturesVars[0].animationName);
                    this.m_nextWillPlayBgArmaturesTimeOrder = 1;

                    this.m_gameState = GameState.inTheGame;
                    this.m_updateCounter=0;
                }
                break;
            case GameState.inTheGame:
                var systemTime = (new Date()).getTime();
                var musicCurrentTime = SoundManager.getCurrentMusicTime();

                this.m_updateCounter++;

                if(this.m_updateCounter == 1){
                    SoundManager.playMusic(res.gameBgm_mp3);
                }
                this.m_gameModel.update(dt,systemTime,musicCurrentTime);

                var gameTime = this.m_gameModel.m_gameTimer;

                if(this.m_nextWillPlayBgArmaturesTimeOrder<g_bgAnimaturesPlayTimeData.length){
                    if(gameTime>=g_bgAnimaturesPlayTimeData[this.m_nextWillPlayBgArmaturesTimeOrder].timePoint){
                        var willPlayBgArmaturesId = g_bgAnimaturesPlayTimeData[this.m_nextWillPlayBgArmaturesTimeOrder].bgAmaturesId;
                        for(var i=0;i<willPlayBgArmaturesId.length;i+=1){
                            var bgArmatureId = willPlayBgArmaturesId[i];
                            this.m_view.m_bgArmatures[bgArmatureId].getAnimation().play(g_bgArmaturesVars[bgArmatureId].animationName);
                            this.m_view.m_bgArmatures[bgArmatureId].setVisible(true);
                        }

                        this.m_nextWillPlayBgArmaturesTimeOrder+=1;
                    }
                }

                if(DEBUG_MODE == true){
                    this.m_view.m_testLabel1.setString("gameTimer: "+Math.floor(gameTime));

                    if(this.m_gameModel.m_nextWillTouchBeatIndex < this.m_gameModel.m_currBeatsVars.length) {
                        this.m_view.m_testLabel2.setString("nextWillTouchBeatTouchTime: "
                            + this.m_gameModel.m_currBeatsVars[this.m_gameModel.m_nextWillTouchBeatIndex].touchTime);
                    }else{
                        this.m_view.m_testLabel2.setString("nextWillTouchBeatTouchTime: "
                            + "-1");
                    }

                    var testLabel3Str = "gameTimer(from game model): "
                        + Math.floor(Math.floor(gameTime/1000)/60)
                        + ":" + ("00" + Math.floor(gameTime/1000) % 60).slice(-2)
                        + ":" + ("000"+(Math.floor(gameTime)-Math.floor(gameTime/1000)*1000)).slice(-3);

                    //var testLabel3Str = "gameTimer(from system time): "+gameTime;
                    this.m_view.m_testLabel3.setString(testLabel3Str);

                    var testLabel4Str = "musicCurrTime(from audio engine): "
                        + Math.floor(Math.floor(musicCurrentTime/1000)/60)
                        + ":" + ("00" + Math.floor(musicCurrentTime/1000) % 60).slice(-2)
                        + ":" + ("000"+(Math.floor(musicCurrentTime)-Math.floor(musicCurrentTime/1000)*1000)).slice(-3);
                    //var testLabel4Str = "musicCurrTime(from audio engine): "+musicCurrentTime;

                    this.m_view.m_testLabel4.setString(testLabel4Str);

                    var testLabel5Str = "viewClarity: "+this.m_gameModel.m_viewClarity;
                    this.m_view.m_testLabel5.setString(testLabel5Str);
                }

                break;
            case GameState.ending:
                break
        }
    },
    initGameSceneView:function(){
        cc.log("initGameSceneView");

        var heartSprite = new cc.Sprite();
        this.m_view.m_heartSprite = heartSprite;
        heartSprite.setPosition(cc.p(HEART_SPRITE_POS_X,HEART_SPRITE_POS_Y));
        heartSprite.setScale(HEART_SPRITE_SCALE);
        heartSprite.setOpacity(0);

        var heartSpriteFadeInAction = cc.fadeIn(g_heartSpriteFadeInDuration);
        heartSprite.runAction(heartSpriteFadeInAction);

        this.m_view.addChild(heartSprite,HEART_SPRITE_GAME_SCENE_VIEW_Z_ORDER);

        heartSprite.stopActionByTag(HEART_SPRITE_REPEAT_BEAT_ACTION_TAG);

        var heartSpriteRepeatBeatAction = cc.repeatForever(
            cc.animate(cc.animationCache.getAnimation(HEART_BEAT_ANIMATION_NAME))
        );
        heartSpriteRepeatBeatAction.setTag(HEART_SPRITE_REPEAT_BEAT_ACTION_TAG)
        heartSprite.runAction(heartSpriteRepeatBeatAction);

        var heroSprite = new cc.Sprite();
        this.m_view.m_heroSprite = heroSprite;

        heroSprite.setScale(HERO_SPRITE_SCALE);
        heroSprite.setPosition(cc.p(HERO_SPRITE_POS_X,CHILD_HERO_SPRITE_POS_Y));
        heroSprite.setOpacity(0);

        var heroSpriteFadeInAction = cc.fadeIn(g_heroSpriteFadeInDuration);
        heroSprite.runAction(heroSpriteFadeInAction);

        this.m_view.addChild(heroSprite,HERO_SPRITE_GAME_SCENE_VIEW_Z_ORDER);

        var childHeroWalkAction = cc.repeatForever(
            cc.animate(cc.animationCache.getAnimation(CHILD_HERO_WALK_ANIMATION_NAME))
        );

        heroSprite.runAction(childHeroWalkAction);

        var beatTrackWhiteLineSprite = new cc.Sprite(res.beatTrackWhiteLine_png);
        this.m_view.m_beatTrackWhiteLineSprite = beatTrackWhiteLineSprite;
        var beatTrackWhiteLineSpriteScale = cc.winSize.width/beatTrackWhiteLineSprite.getContentSize().width;
        beatTrackWhiteLineSprite.setScale(beatTrackWhiteLineSpriteScale);

        beatTrackWhiteLineSprite.setAnchorPoint(cc.p(0,0.5));
        beatTrackWhiteLineSprite.setPosition(BEAT_TRACK_LINE_SPRITE_POS_X,BEAT_TRACK_LINE_SPRITE_POS_Y);

        this.m_view.addChild(beatTrackWhiteLineSprite,BEAT_TRACK_WHITE_LINE_SPRITE_GAME_SCENE_VIEW_Z_ORDER);

        var beatTrackGreyLineSprite = new cc.Sprite(res.beatTrackGreyLine_png);
        this.m_view.m_beatTrackGreyLineSprite = beatTrackGreyLineSprite;
        var beatTrackGreyLineSpriteScale = cc.winSize.width/beatTrackGreyLineSprite.getContentSize().width;
        beatTrackGreyLineSprite.setScale(beatTrackGreyLineSpriteScale);

        beatTrackGreyLineSprite.setAnchorPoint(cc.p(0,0.5));
        beatTrackGreyLineSprite.setPosition(BEAT_TRACK_LINE_SPRITE_POS_X,BEAT_TRACK_LINE_SPRITE_POS_Y);

        this.m_view.addChild(beatTrackGreyLineSprite,BEAT_TRACK_GREY_LINE_SPRITE_GAME_SCENE_VIEW_Z_ORDER);

        var comboNumLabel = new cc.LabelTTF("", "Arial", COMBO_NUM_LABEL_FONT_SIZE);
        this.m_view.m_comboNumLabel = comboNumLabel;

        comboNumLabel.setPosition(cc.p(COMBO_LABEL_POS_X,COMBO_LABEL_POS_Y));
        comboNumLabel.setAnchorPoint(cc.p(0,1));
        comboNumLabel.setFontFillColor(cc.color(8,8,8,255));
        comboNumLabel.setString(COMBO_NUM_LABEL_STR_PREFIX+this.m_gameModel.m_comboNum);

        this.m_view.m_hudLayer.addChild(comboNumLabel);

        this.m_view.m_bgArmatures = [];
        for(var i = 0;i<g_bgArmaturesVars.length;i++){
            this.m_view.m_bgArmatures[i] = new ccs.Armature(g_bgArmaturesVars[i].armatureName);
            this.m_view.m_bgArmatures[i].setPosition(g_bgArmaturesVars[i].initPos);
            this.m_view.m_bgArmatures[i].setScale(g_bgArmaturesVars[i].initScale);
            this.m_view.m_bgArmatures[i].setVisible(false);
            //this.m_view.addChild(this.m_view.m_bgArmatures[i],1);
            this.m_view.m_bgArmatureLayer.addChild(this.m_view.m_bgArmatures[i],g_bgArmaturesVars[i].zOrder);
        }

        var blankWhiteLayer = new cc.LayerColor(cc.color(222,222,222,255));
        this.m_view.m_blankWhiteLayer = blankWhiteLayer;
        blankWhiteLayer.setOpacity(0);

        this.m_view.addChild(blankWhiteLayer,BLANK_WHITE_LAYER_GAME_VIEW_Z_ORDER);
    },
    beatAppearCallback:function(event){

        var eventData = event.getUserData();
        var beatIndex = eventData.beatIndex;
        var beatType = eventData.beatType;

        var beatSprite = this.m_beatSpriteManager.getBeatSprite(beatType);

        var beatSpriteMoveFromAppearToDisappearAction = cc.sequence(
                cc.moveTo(g_beatSpriteMoveFromAppearToDisappearDuration,
                    cc.p(BEAT_SPRITE_DISAPPEAR_POS_X,BEAT_SPRITE_APPEAR_POS_Y)),
                cc.callFunc(
                    function(){
                        this.m_beatSpriteManager.setBeatSpriteVisible(beatSprite,false);
                        this.m_beatSpriteManager.removeBeatSpriteFromParent(beatSprite,beatType);
                    }.bind(this)
                )
        );

        beatSprite.setPosition(cc.p(BEAT_SPRITE_APPEAR_POS_X,BEAT_SPRITE_APPEAR_POS_Y));

        beatSpriteMoveFromAppearToDisappearAction.setTag(BEAT_SPRITE_MOVE_FROM_APPEAR_TO_DISAPPEAR_ACTION_TAG);
        beatSprite.runAction(beatSpriteMoveFromAppearToDisappearAction);

        beatSprite.setTag(beatIndex);

        if(beatSprite.getParent() == null){
            this.m_view.m_beatSpriteLayer.addChild(beatSprite);
        }
    },
    beatGetTouchedCallback:function(event){
        var eventData = event.getUserData();
        var beatIndex = eventData.beatIndex;
        var beatType = eventData.beatType;
        var judgeResult = eventData.judgeResult;
        
        SoundManager.playEffect(res.tab_wav);

        this.m_view.m_comboNumLabel.setString(COMBO_NUM_LABEL_STR_PREFIX+this.m_gameModel.m_comboNum);

        //var beatType = this.m_gameModel.m_currBeatsVars[beatIndex].type;

        var beatSprite = this.m_view.m_beatSpriteLayer.getChildByTag(beatIndex);

        beatSprite.stopActionByTag(BEAT_SPRITE_MOVE_FROM_APPEAR_TO_DISAPPEAR_ACTION_TAG);

        var beatSpriteGetTouchedAction = cc.sequence(
            this.m_beatSpriteManager.createBeatSpriteFadeOutAction(beatSprite,beatType,g_beatSpriteFadeOutDuration),
            cc.callFunc(
                function(){
                    this.m_beatSpriteManager.setBeatSpriteVisible(beatSprite,false);
                    this.m_beatSpriteManager.removeBeatSpriteFromParent(beatSprite,beatType)
                }.bind(this)
            )
        );

        beatSpriteGetTouchedAction.setTag(BEAT_SPRITE_GET_TOUCHED_ACTION_TAG);
        beatSprite.runAction(beatSpriteGetTouchedAction);

        switch(judgeResult){
            case JudgeResult.miss:
                var missJudgeHeartEffectSprite = new cc.Sprite(res.missJudgeHeartEffect_png);
                missJudgeHeartEffectSprite.setPosition(cc.p(HEART_SPRITE_POS_X,HEART_SPRITE_POS_Y));
                missJudgeHeartEffectSprite.setScale(MISS_JUDGE_HEART_EFFECT_SPRITE_SCALE);
                missJudgeHeartEffectSprite.setOpacity(0);

                this.m_view.addChild(missJudgeHeartEffectSprite,MISS_JUDGE_HEART_EFFECT_SPRITE_GAME_SCENE_VIEW_Z_ORDER);

                var missJudgeHeartEffectSpriteAction = cc.sequence(
                    cc.fadeTo(0.15,222),
                    cc.fadeTo(0.15,0),
                    cc.callFunc(
                        function(){
                            this.removeFromParent(true);
                        }.bind(missJudgeHeartEffectSprite)
                    )
                );
                missJudgeHeartEffectSprite.runAction(missJudgeHeartEffectSpriteAction);

                break;
            case JudgeResult.good:
                this.m_view.m_heartSprite.stopActionByTag(HEART_SPRITE_REPEAT_BEAT_ACTION_TAG);
                this.m_view.m_heartSprite.stopActionByTag(GOOD_JUDGE_HEART_SPRITE_ACTION_TAG);
                this.m_view.m_heartSprite.stopActionByTag(PERFECT_JUDGE_HEART_SPRITE_ACTION_TAG);

                var goodJudgeHeartSpriteAction = cc.sequence(
                    cc.animate(cc.animationCache.getAnimation(GOOD_JUDGE_HEART_ANIMATION_NAME)),
                    cc.callFunc(
                        function(){
                            this.stopActionByTag(HEART_SPRITE_REPEAT_BEAT_ACTION_TAG);

                            var heartSpriteRepeatBeatAction = cc.repeatForever(
                                cc.animate(cc.animationCache.getAnimation(HEART_BEAT_ANIMATION_NAME))
                            );
                            heartSpriteRepeatBeatAction.setTag(HEART_SPRITE_REPEAT_BEAT_ACTION_TAG);
                            this.runAction(heartSpriteRepeatBeatAction);
                        }.bind(this.m_view.m_heartSprite)
                    )
                );
                goodJudgeHeartSpriteAction.setTag(GOOD_JUDGE_HEART_SPRITE_ACTION_TAG);
                
                this.m_view.m_heartSprite.runAction(goodJudgeHeartSpriteAction);

                var goodJudgeHeartEffectSprite = new cc.Sprite(res.goodJudgeHeartEffect_png);

                goodJudgeHeartEffectSprite.setPosition(cc.p(HEART_SPRITE_POS_X,HEART_SPRITE_POS_Y));
                goodJudgeHeartEffectSprite.setScale(GOOD_JUDGE_HEART_EFFECT_SPRITE_SCALE);
                goodJudgeHeartEffectSprite.setOpacity(0);

                this.m_view.addChild(goodJudgeHeartEffectSprite,GOOD_JUDGE_HEART_EFFECT_SPRITE_GAME_SCENE_VIEW_Z_ORDER);

                var goodJudgeHeartEffectSpriteAction = cc.sequence(
                    cc.fadeTo(0.15,128),
                    cc.fadeTo(0.15,0),
                    cc.callFunc(
                        function(){
                            this.removeFromParent(true);
                        }.bind(goodJudgeHeartEffectSprite)
                    )
                );
                goodJudgeHeartEffectSprite.runAction(goodJudgeHeartEffectSpriteAction);


                break;
            case JudgeResult.perfect:
                this.m_view.m_heartSprite.stopActionByTag(HEART_SPRITE_REPEAT_BEAT_ACTION_TAG);
                this.m_view.m_heartSprite.stopActionByTag(GOOD_JUDGE_HEART_SPRITE_ACTION_TAG);
                this.m_view.m_heartSprite.stopActionByTag(PERFECT_JUDGE_HEART_SPRITE_ACTION_TAG);

                var perfectJudgeHeartSpriteAction = cc.sequence(
                    cc.animate(cc.animationCache.getAnimation(PERFECT_JUDGE_HEART_ANIMATION_NAME)),
                    cc.callFunc(
                        function(){
                            this.stopActionByTag(HEART_SPRITE_REPEAT_BEAT_ACTION_TAG);

                            var heartSpriteRepeatBeatAction = cc.repeatForever(
                                cc.animate(cc.animationCache.getAnimation(HEART_BEAT_ANIMATION_NAME))
                            );
                            heartSpriteRepeatBeatAction.setTag(HEART_SPRITE_REPEAT_BEAT_ACTION_TAG);
                            this.runAction(heartSpriteRepeatBeatAction);
                        }.bind(this.m_view.m_heartSprite)
                    )
                );
                perfectJudgeHeartSpriteAction.setTag(PERFECT_JUDGE_HEART_SPRITE_ACTION_TAG);

                this.m_view.m_heartSprite.runAction(perfectJudgeHeartSpriteAction);

                var perfectJudgeHeartEffectSprite = new cc.Sprite(res.perfectJudgeHeartEffect_png);
                
                perfectJudgeHeartEffectSprite.setPosition(cc.p(HEART_SPRITE_POS_X,HEART_SPRITE_POS_Y));
                perfectJudgeHeartEffectSprite.setScale(PERFECT_JUDGE_HEART_EFFECT_SPRITE_SCALE);
                perfectJudgeHeartEffectSprite.setOpacity(0);

                this.m_view.addChild(perfectJudgeHeartEffectSprite,PERFECT_JUDGE_HEART_EFFECT_SPRITE_GAME_SCENE_VIEW_Z_ORDER);

                var perfectJudgeHeartEffectSpriteAction = cc.sequence(
                    cc.fadeTo(0.15,128),
                    cc.fadeTo(0.15,0),
                    cc.callFunc(
                        function(){
                            this.removeFromParent(true);
                        }.bind(perfectJudgeHeartEffectSprite)
                    )
                );
                perfectJudgeHeartEffectSprite.runAction(perfectJudgeHeartEffectSpriteAction);

                break;
        }
    },
    beatPassMissCallback:function(event){
        this.m_view.m_comboNumLabel.setString(COMBO_NUM_LABEL_STR_PREFIX+this.m_gameModel.m_comboNum);

    },
    viewClarityChangeCallback:function(event){
        var eventData = event.getUserData();
        var newViewClarity = eventData.newViewClarity;

        var heroSpriteViewClarityChangeFadeAction = cc.fadeTo(
            g_viewClarityChangeFadeDuration,
            newViewClarity);

        heroSpriteViewClarityChangeFadeAction.setTag(VIEW_CLARITY_CHANGE_FADE_ACTION_TAG);

        this.m_view.m_heroSprite.stopActionByTag(VIEW_CLARITY_CHANGE_FADE_ACTION_TAG);
        this.m_view.m_heroSprite.runAction(heroSpriteViewClarityChangeFadeAction);

        var beatTrackWhiteLineSpriteViewClarityChangeFadeAction = cc.fadeTo(
            g_viewClarityChangeFadeDuration,
            newViewClarity);

        beatTrackWhiteLineSpriteViewClarityChangeFadeAction.setTag(VIEW_CLARITY_CHANGE_FADE_ACTION_TAG);

        this.m_view.m_beatTrackWhiteLineSprite.stopActionByTag(VIEW_CLARITY_CHANGE_FADE_ACTION_TAG);
        this.m_view.m_beatTrackWhiteLineSprite.runAction(beatTrackWhiteLineSpriteViewClarityChangeFadeAction);

        var blankWhiteLayerViewClarityChangeFadeAction = cc.fadeTo(
            g_viewClarityChangeFadeDuration,
            255-newViewClarity);

        blankWhiteLayerViewClarityChangeFadeAction.setTag(VIEW_CLARITY_CHANGE_FADE_ACTION_TAG);

        this.m_view.m_blankWhiteLayer.stopActionByTag(VIEW_CLARITY_CHANGE_FADE_ACTION_TAG);
        this.m_view.m_blankWhiteLayer.runAction(blankWhiteLayerViewClarityChangeFadeAction);
        
    },
    heroChangeStateCallback:function (event) {
        //cc.log("heroChangeStateCallback!");
        var eventData = event.getUserData();
        var newHeroState = eventData.newHeroState;

        var oldHeartSprite = this.m_view.m_heartSprite;
        var heartSpriteFadeOutRemoveAction = cc.sequence(
            cc.fadeOut(g_heartSpriteFadeOutDuration),
            cc.callFunc(
                function () {
                    this.removeFromParent(true);
                }.bind(oldHeartSprite)
            )
        );
        oldHeartSprite.runAction(heartSpriteFadeOutRemoveAction);

        var newHeartSprite = new cc.Sprite();
        this.m_view.m_heartSprite = newHeartSprite;

        newHeartSprite.setPosition(cc.p(HEART_SPRITE_POS_X,HEART_SPRITE_POS_Y));
        newHeartSprite.setScale(HEART_SPRITE_SCALE);
        newHeartSprite.setOpacity(0);

        var heartSpriteFadeInAction = cc.fadeIn(g_heartSpriteFadeInDuration);

        newHeartSprite.runAction(heartSpriteFadeInAction);

        this.m_view.addChild(newHeartSprite,HEART_SPRITE_GAME_SCENE_VIEW_Z_ORDER);

        newHeartSprite.stopActionByTag(HEART_SPRITE_REPEAT_BEAT_ACTION_TAG);

        var heartSpriteRepeatBeatAction = cc.repeatForever(
            cc.animate(cc.animationCache.getAnimation(HEART_BEAT_ANIMATION_NAME))
        );

        heartSpriteRepeatBeatAction.setTag(HEART_SPRITE_REPEAT_BEAT_ACTION_TAG);
        newHeartSprite.runAction(heartSpriteRepeatBeatAction);

        var oldHeroSprite = this.m_view.m_heroSprite;
        var heroSpriteFadeOutRemoveAction = cc.sequence(
            cc.fadeOut(g_heroSpriteFadeOutDuration),
            cc.callFunc(
                function () {
                    this.removeFromParent(true);
                }.bind(oldHeroSprite)
            )
        );
        oldHeroSprite.runAction(heroSpriteFadeOutRemoveAction);
        var oldHeroSpriteOpacity = oldHeroSprite.getOpacity();

        var newHeroSprite = new cc.Sprite();
        this.m_view.m_heroSprite = newHeroSprite;

        newHeroSprite.setScale(HERO_SPRITE_SCALE);
        newHeroSprite.setOpacity(0);

        switch(newHeroState){
            case HeroState.teen:
                newHeroSprite.setPosition(cc.p(HERO_SPRITE_POS_X,TEEN_HERO_SPRITE_POS_Y));

                var teenHeroWalkAction = cc.repeatForever(
                    cc.animate(cc.animationCache.getAnimation(TEEN_HERO_WALK_ANIMATION_NAME))
                );

                newHeroSprite.runAction(teenHeroWalkAction);
                break;
            case HeroState.adult:
                newHeroSprite.setPosition(cc.p(HERO_SPRITE_POS_X,ADULT_HERO_SPRITE_POS_Y));

                var adultHeroWalkAction = cc.repeatForever(
                    cc.animate(cc.animationCache.getAnimation(ADULT_HERO_WALK_ANIMATION_NAME))
                );

                newHeroSprite.runAction(adultHeroWalkAction);
                break;
            case HeroState.old:
                newHeroSprite.setPosition(cc.p(HERO_SPRITE_POS_X,OLD_HERO_SPRITE_POS_Y));

                var oldHeroWalkAction = cc.repeatForever(
                    cc.animate(cc.animationCache.getAnimation(OLD_HERO_WALK_ANIMATION_NAME))
                );

                newHeroSprite.runAction(oldHeroWalkAction);
                break;
        }
        this.m_view.addChild(newHeroSprite,HERO_SPRITE_GAME_SCENE_VIEW_Z_ORDER);

        var oldSpriteOpacity = oldHeroSprite.getOpacity();
        var heroSpriteFadeUpAction = cc.fadeTo(g_heroSpriteFadeUpDuration,oldHeroSpriteOpacity);
        //var heroSpriteFadeInAction = cc.fadeIn(g_heroSpriteFadeUpDuration);

        newHeroSprite.runAction(heroSpriteFadeUpAction);
    },
    enterEndingCallback:function(event){
        //cc.log("enterEndingCallback");
        var eventData = event.getUserData();
        var endingType = eventData.endingType;

        this.m_gameState = GameState.ending;
        
        var controllerWaitStopMusicAction = cc.sequence(
        	cc.delayTime(g_endingDelayBeforeControllerStopMusic),
        	cc.callFunc(
        		function(){
        			 SoundManager.stopMusic();
        		}.bind(this)
        	)
        );
        
        this.runAction(controllerWaitStopMusicAction);

        switch(endingType){
            case EndingType.childTimeUnnaturallyDieEnding:
            case EndingType.teenTimeUnnaturallyDieEnding:
            case EndingType.adultTimeUnnaturallyDieEnding:
            case EndingType.oldTimeUnnaturallyDieEnding:
                var beatsSprite = this.m_view.m_beatSpriteLayer.getChildren();
                for(var i=0;i<beatsSprite.length;i++){
                    var beatSprite = beatsSprite[i];
                    var beatSpriteFadeOutAction = cc.sequence(
                        cc.fadeOut(g_beatSpriteFadeOutDuration)
                    );
                    beatSprite.runAction(beatSpriteFadeOutAction);
                }

                var heartSpriteFadeOutRemoveAction = cc.sequence(
                    cc.fadeOut(g_heartSpriteFadeOutDuration),
                    cc.callFunc(
                        function(){
                            this.removeFromParent(true);
                        }.bind(this.m_view.m_heartSprite)
                    )
                );
                this.m_view.m_heartSprite.runAction(heartSpriteFadeOutRemoveAction);

                var beatTrackGreyLineSpriteMoveLeftOutRemoveAction = cc.sequence(
                    cc.moveTo(g_beatTrackGreyLineSpriteMoveLeftOutDuraton,cc.p(-cc.winSize.width,cc.winSize.height/2.0)),
                    cc.callFunc(
                        function(){
                            this.removeFromParent(true);
                        }.bind(this.m_view.m_beatTrackGreyLineSprite)
                    )
                );

                this.m_view.m_beatTrackGreyLineSprite.runAction(beatTrackGreyLineSpriteMoveLeftOutRemoveAction);

                var beatTrackWhiteLineSpriteFadeOutRemoveAction = cc.sequence(
                    cc.fadeOut(g_beatTrackWhiteLineSpriteFadeOutDuration),
                    cc.callFunc(
                        function(){
                            this.removeFromParent(true);
                        }.bind(this.m_view.m_beatTrackWhiteLineSprite)
                    )
                );
                this.m_view.m_beatTrackWhiteLineSprite.runAction(beatTrackWhiteLineSpriteFadeOutRemoveAction);

                var tombSprite = new cc.Sprite(res.tomb_png);
                tombSprite.setPosition(ENDING_TOMB_SPRITE_INIT_POS_X,ENDING_TOMB_SPRITE_INIT_POS_Y);
                tombSprite.setOpacity(0);
                tombSprite.setScale(ENDING_TOMB_SPRITE_SCALE);
                this.m_view.addChild(tombSprite,ENDING_TOMB_SPRITE_GAME_SCENE_VIEW_Z_ORDER);
 
                var endingTombSpriteWaitAppearAction = cc.sequence(
                    cc.delayTime(g_delayBeforeEndingTombSpriteAppearDuration),
                    cc.spawn(
                        cc.moveTo(g_endingTombSpriteMoveUpDuration,
                            cc.p(ENDING_TOMB_SPRITE_FINAL_POS_X,ENDING_TOMB_SPRITE_FINAL_POS_Y)),
                        cc.fadeIn(g_endingTombSpriteFadeInDuration)
                    )
                );
                tombSprite.runAction(endingTombSpriteWaitAppearAction);

                var endingLabel1 = new cc.LabelTTF("","",ENDIND_LABEL_1_FONT_SIZE);
                var endingLabel2 = new cc.LabelTTF("","",ENDIND_LABEL_2_FONT_SIZE);
                switch(endingType){
                    case EndingType.childTimeUnnaturallyDieEnding:
                        endingLabel1.setString(CHILD_TIME_UNNATURALLY_DIE_ENDING_LABEL_1_STR);
                        endingLabel2.setString(CHILD_TIME_UNNATURALLY_DIE_ENDING_LABEL_2_STR);
                        break;
                    case EndingType.teenTimeUnnaturallyDieEnding:
                        endingLabel1.setString(
                            TEEN_TIME_UNNATURALLY_DIE_ENDING_LABEL_1_STR);
                        endingLabel2.setString(TEEN_TIME_UNNATURALLY_DIE_ENDING_LABEL_2_STR);
                        break;
                    case EndingType.adultTimeUnnaturallyDieEnding:
                        endingLabel1.setString(ADULT_TIME_UNNATURALLY_DIE_ENDING_LABEL_1_STR);
                        endingLabel2.setString(ADULT_TIME_UNNATURALLY_DIE_ENDING_LABEL_2_STR);
                        break;
                    case EndingType.oldTimeUnnaturallyDieEnding:
                        endingLabel1.setString(OLD_TIME_UNNATURALLY_DIE_ENDING_LABEL_1_STR);
                        endingLabel2.setString(OLD_TIME_UNNATURALLY_DIE_ENDING_LABEL_2_STR);
                        break;
                }

                endingLabel1.setPosition(UNNATURALLY_DIE_ENDING_LABEL_1_POS_X,UNNATURALLY_DIE_ENDING_LABEL_1_POS_Y);
                endingLabel1.setFontFillColor(cc.color(139,0,0,255));
                endingLabel1.setOpacity(0);
                this.m_view.addChild(endingLabel1,ENDING_LABEL_GAME_SCENE_VIEW_Z_ORDER);
                
                var endingLabel1WaitAppearAction = cc.sequence(
                    cc.delayTime(g_unnaturallyDieEndingDelayBeforeEndingLabel1AppearDuration),
                    cc.fadeIn(g_endingLabel1FadeInDuration)
                );
                endingLabel1.runAction(endingLabel1WaitAppearAction);


                endingLabel2.setFontFillColor(cc.color(8,8,8,255));
                endingLabel2.setPosition(UNNATURALLY_DIE_ENDING_LABEL_2_POS_X,UNNATURALLY_DIE_ENDING_LABEL_2_POS_Y);
                endingLabel2.setOpacity(0);
                this.m_view.addChild(endingLabel2,ENDING_LABEL_GAME_SCENE_VIEW_Z_ORDER);

                var endingLabel2WaitAppearAction = cc.sequence(
                    cc.delayTime(g_unnaturallyDieEndingDelayBeforeEndingLabel2AppearDuration),
                    cc.fadeIn(g_endingLabel2FadeInDuration)
                );
                endingLabel2.runAction(endingLabel2WaitAppearAction);

                var endingLabel3 = new cc.LabelTTF(ENDING_LABEL_3_STR,"Marker Felt",ENDIND_LABEL_3_FONT_SIZE);
                // var endingLabel3 = new cc.Sprite(res.pressButtonHint_png);
                endingLabel3.setFontFillColor(cc.color(8,8,8,255));
                endingLabel3.setPosition(
                    UNNATURALLY_DIE_ENDING_LABEL_3_POS_X,
                    UNNATURALLY_DIE_ENDING_LABEL_3_POS_Y);
                endingLabel3.setOpacity(0);
                this.m_view.addChild(endingLabel3,ENDING_LABEL_3_GAME_SCENE_VIEW_Z_ORDER);

                var endingLabel3WaitAppearAction = cc.sequence(
                    cc.delayTime(g_unnaturallyDieEndingDelayBeforeEndingLabel3AppearDuration),
                    cc.callFunc(
                        function(){
                            var endingLabel3RepeatFadeUpFadeDownAction = cc.repeatForever(
                                cc.sequence(
                                    cc.fadeTo(g_endingLabel3FadeUpDuration,ENDING_LABEL_3_FADE_UP_OPACITY),
                                    cc.fadeTo(g_endingLabel3FadeDownDuration,ENDING_LABEL_3_FADE_DOWN_OPACITY)
                                )
                            );
                            this.runAction(endingLabel3RepeatFadeUpFadeDownAction);
                        }.bind(endingLabel3)
                    )
                );

                endingLabel3.runAction(endingLabel3WaitAppearAction);

                var controllerBeginWaitForTouchToReturn = cc.sequence(
                    cc.delayTime(g_unnaturallyDieEndingDelayBeforeBeginWaitForTouchToReturnDurtion),
                    cc.callFunc(function () {
                        this.m_gameState = GameState.waitForTouchToReturn;
                    }.bind(this))
                );

                this.runAction(controllerBeginWaitForTouchToReturn);
                
                break;

            case EndingType.childStateNaturallyDieEnding:
            case EndingType.teenStateNaturallyDieEnding:
            case EndingType.adultStateNaturallyDieEnding:
            case EndingType.oldStateNaturallyDieEnding:
                var heartSpriteFadeOutRemoveAction = cc.sequence(
                    cc.fadeOut(g_heartSpriteFadeOutDuration),
                    cc.callFunc(
                        function(){
                            this.removeFromParent(true);
                        }.bind(this.m_view.m_heartSprite)
                    )
                );
                this.m_view.m_heartSprite.runAction(heartSpriteFadeOutRemoveAction);

                var beatTrackGreyLineSpriteFadeOutRemoveAction = cc.sequence(
                    cc.fadeOut(g_beatTrackGreyLineSpriteFadeOutDuration),
                    cc.callFunc(
                        function(){
                            this.removeFromParent(true);
                        }.bind(this.m_view.m_beatTrackGreyLineSprite)
                    )
                );
                this.m_view.m_beatTrackGreyLineSprite.runAction(beatTrackGreyLineSpriteFadeOutRemoveAction);

                var beatTrackWhiteLineSpriteFadeOutRemoveAction = cc.sequence(
                    cc.fadeOut(g_beatTrackWhiteLineSpriteFadeOutDuration),
                    cc.callFunc(
                        function(){
                            this.removeFromParent(true);
                        }.bind(this.m_view.m_beatTrackWhiteLineSprite)
                    )
                );
                this.m_view.m_beatTrackWhiteLineSprite.runAction(beatTrackWhiteLineSpriteFadeOutRemoveAction);

                var coffinSprite = new cc.Sprite(res.coffin_png);
                var coffinMaskSprite = new cc.Sprite(res.coffinRightHalf_png);

                coffinMaskSprite.setAnchorPoint(cc.p(1.0,0.5));
                coffinSprite.setScale(COFFIN_SPRITE_INIT_SCALE);
                coffinMaskSprite.setScale(COFFIN_SPRITE_INIT_SCALE);

                coffinSprite.setPosition(cc.p(cc.winSize.width+coffinSprite.getContentSize().width*coffinSprite.getScaleX()/2,
                    COFFIN_SPRITE_POS_Y));
                coffinMaskSprite.setPosition(cc.p(cc.winSize.width+coffinSprite.getContentSize().width*coffinSprite.getScaleX(),
                    COFFIN_SPRITE_POS_Y));

                this.m_view.addChild(coffinSprite,COFFIN_SPRITE_GAME_SCENE_VIEW_Z_ORDER);
                this.m_view.addChild(coffinMaskSprite,COFFIN_MASK_SPRITE_GAME_SCENE_VIEW_Z_ORDER)

                var coffinSpriteFinalScale = Math.min(cc.winSize.width/coffinSprite.getContentSize().width,
                    cc.winSize.height/coffinSprite.getContentSize().height);

                var coffinSpriteMoveIntoAndZoomInAction = cc.sequence(
                    cc.moveTo(g_coffinSpriteMoveIntoDuration,
                        cc.p(COFFIN_SPRITE_MOVE_INTO_POS_X,coffinSprite.getPositionY())),
                    cc.delayTime(g_delayBetweenCoffinSpriteMoveIntoAndZoomInDuration),
                    cc.spawn(
                        cc.moveTo(g_coffinSpriteZoomInDuration,cc.p(COFFIN_SPRITE_FINAL_POS_X,COFFIN_SPRITE_FINAL_POS_Y)),
                        cc.scaleTo(g_coffinSpriteZoomInDuration,coffinSpriteFinalScale)
                    )
                );

                var coffinMaskSpriteMoveIntoAndRemoveAction = cc.sequence(
                    cc.moveTo(g_coffinSpriteMoveIntoDuration,
                        cc.p(COFFIN_SPRITE_MOVE_INTO_POS_X+coffinSprite.getContentSize().width*coffinSprite.getScaleX()/2,
                            coffinSprite.getPositionY())),
                    cc.delayTime(g_delayBetweenCoffinMaskSpriteMoveIntoAndRemoveDuration),
                    cc.callFunc(
                        function(){
                            this.removeFromParent(true);
                        }.bind(coffinMaskSprite)
                    )
                );

                var heroSpriteMoveToCenterXAndWaitHideAction = cc.sequence(
                    cc.moveTo(g_heroSpriteMoveToCenterXDuration,
                        cc.p(cc.winSize.width/2,this.m_view.m_heroSprite.getPositionY())),
                    cc.delayTime(g_delayBetweenHeroSpriteMoveToCenterXAndHideDuration),
                    cc.callFunc(
                        function(){
                            this.setVisible(false);
                        }.bind(this.m_view.m_heroSprite)
                    )
                );

                coffinSprite.runAction(coffinSpriteMoveIntoAndZoomInAction);
                coffinMaskSprite.runAction(coffinMaskSpriteMoveIntoAndRemoveAction);
                this.m_view.m_heroSprite.runAction(heroSpriteMoveToCenterXAndWaitHideAction);

                var controllerDisplayMemberListAction = cc.sequence(
                    cc.delayTime(g_delayBeforeDisplayMemberListDurtion),
                    cc.callFunc(this.displayMemberList.bind(this))
                );

                // var controllerDisplayEndingLabelAction = cc.sequence(
                //     cc.delayTime(g_naturallyDieEndingDelayBeforeDisplayEndingLabelsDuration),
                //     cc.callFunc(this.displayEndingLabel.bind(this))
                // );

                var endingLabel1 = new cc.LabelTTF("","",ENDIND_LABEL_1_FONT_SIZE);
                switch(endingType){
                    case EndingType.childStateNaturallyDieEnding:
                        endingLabel1.setString(CHILD_STATE_NATURALLY_DIE_ENDING_LABEL_1_STR);
                        break;
                    case EndingType.teenStateNaturallyDieEnding:
                        endingLabel1.setString(TEEN_STATE_NATURALLY_DIE_ENDING_LABEL_1_STR);
                        break;
                    case EndingType.adultStateNaturallyDieEnding:
                        endingLabel1.setString(ADULT_STATE_NATURALLY_DIE_ENDING_LABEL_1_STR);
                        break;
                    case EndingType.oldStateNaturallyDieEnding:
                        endingLabel1.setString(OLD_STATE_NATURALLY_DIE_ENDING_LABEL_1_STR);
                        break;
                }

                endingLabel1.setFontFillColor(cc.color(255,215,0,255));

                endingLabel1.setPosition(NATURALLY_DIE_ENDING_LABEL_1_POS_X,NATURALLY_DIE_ENDING_LABEL_1_POS_Y);
           
                endingLabel1.setOpacity(0);
                this.m_view.addChild(endingLabel1,ENDING_LABEL_GAME_SCENE_VIEW_Z_ORDER);

                var endingLabel1WaitAppearAction = cc.sequence(
                    cc.delayTime(g_naturallyDieEndingDelayBeforeEndingLabel1AppearDuration),
                    cc.fadeIn(g_endingLabel1FadeInDuration)
                );
                endingLabel1.runAction(endingLabel1WaitAppearAction);

                var endingLabel2 = new cc.LabelTTF(OLD_STATE_NATURALLY_DIE_ENDING_LABEL_2_STR,"",ENDIND_LABEL_2_FONT_SIZE);
                switch(endingType){
                    case EndingType.childStateNaturallyDieEnding:
                        endingLabel2.setString(CHILD_STATE_NATURALLY_DIE_ENDING_LABEL_2_STR);
                        break;
                    case EndingType.teenStateNaturallyDieEnding:
                        endingLabel2.setString(TEEN_STATE_NATURALLY_DIE_ENDING_LABEL_2_STR);
                        break;
                    case EndingType.adultStateNaturallyDieEnding:
                        endingLabel2.setString(ADULT_STATE_NATURALLY_DIE_ENDING_LABEL_2_STR);
                        break;
                    case EndingType.oldStateNaturallyDieEnding:
                        endingLabel2.setString(OLD_STATE_NATURALLY_DIE_ENDING_LABEL_2_STR);
                        break;
                }

                //endingLabel2.setFontFillColor(cc.color(128,128,128,255));

                endingLabel2.setPosition(NATURALLY_DIE_ENDING_LABEL_2_POS_X,NATURALLY_DIE_ENDING_LABEL_2_POS_Y);
                endingLabel2.setOpacity(0);
                this.m_view.addChild(endingLabel2,ENDING_LABEL_GAME_SCENE_VIEW_Z_ORDER);

                var endingLabel2WaitAppearAction = cc.sequence(
                    cc.delayTime(g_naturallyDieEndingDelayBeforeEndingLabel2AppearDuration),
                    cc.fadeIn(g_endingLabel2FadeInDuration)
                );
                endingLabel2.runAction(endingLabel2WaitAppearAction);


                var endingLabel3 = new cc.LabelTTF(ENDING_LABEL_3_STR,"Marker Felt",ENDIND_LABEL_3_FONT_SIZE);
                //endingLabel3.setFontFillColor(cc.color(128,128,128,255));
                endingLabel3.setPosition(
                    NATURALLY_DIE_ENDING_LABEL_3_POS_X,
                    NATURALLY_DIE_ENDING_LABEL_3_POS_Y);
                endingLabel3.setOpacity(0);
                this.m_view.addChild(endingLabel3,ENDING_LABEL_3_GAME_SCENE_VIEW_Z_ORDER);

                var endingLabel3WaitAppearAction = cc.sequence(
                    cc.delayTime(g_naturallyDieEndingDelayBeforeEndingLabel3AppearDuration),
                    cc.callFunc(
                        function(){
                            var endingLabel3RepeatFadeUpFadeDownAction = cc.repeatForever(
                                cc.sequence(
                                    cc.fadeTo(g_endingLabel3FadeUpDuration,ENDING_LABEL_3_FADE_UP_OPACITY),
                                    cc.fadeTo(g_endingLabel3FadeDownDuration,ENDING_LABEL_3_FADE_DOWN_OPACITY)
                                )
                            );
                            this.runAction(endingLabel3RepeatFadeUpFadeDownAction);
                        }.bind(endingLabel3)
                    )
                );

                endingLabel3.runAction(endingLabel3WaitAppearAction);


                var controllerBeginWaitForTouchToReturn = cc.sequence(
                    cc.delayTime(g_naturallyDieEndingDelayBeforeBeginWaitForTouchToReturnDurtion),
                    cc.callFunc(function () {
                        this.m_gameState = GameState.waitForTouchToReturn;
                    }.bind(this))
                );

                this.runAction(controllerDisplayMemberListAction);
                this.runAction(controllerBeginWaitForTouchToReturn);
                
                break;
        }
    },
    displayMemberList:function(){
        SoundManager.playMusic(res.endingBgm_wav);
        var memberListSprite = new cc.Sprite(res.memberList_png);
        memberListSprite.setScale(MEMBER_LIST_SPRITE_SCALE);
        memberListSprite.setAnchorPoint(cc.p(0.5,1.0));
        memberListSprite.setPosition(cc.p(cc.winSize.width/2.0,0));
        this.m_view.addChild(memberListSprite,MEMBER_LIST_SPRITE_GAME_SCENE_VIEW_Z_ORDER);

        var memberListSpriteScrollUpAndRemoveAction = cc.sequence(
            cc.moveTo(g_memberListSpriteScrollUpDuration,
            cc.p(memberListSprite.getPositionX(),
                cc.winSize.height+memberListSprite.getContentSize().height*memberListSprite.getScale())),
            cc.callFunc(
                function(){
                    this.removeFromParent(true);
                }.bind(memberListSprite)
            )
        );

        var memberListSpriteRepeatFadeUpFadeDownAction = cc.repeatForever(
            cc.sequence(
                cc.fadeTo(g_memberListSpriteFadeUpDuration,MEMBER_LIST_SPRITE_FADE_UP_OPACITY),
                cc.fadeTo(g_memberListSpriteFadeDownDuration,MEMBER_LIST_SPRITE_FADE_DOWN_OPACITY)
            )
        );

        memberListSprite.runAction(memberListSpriteScrollUpAndRemoveAction);
        memberListSprite.runAction(memberListSpriteRepeatFadeUpFadeDownAction);
    }//,
    // displayEndingLabel:function(){
    //     var endingLabel = new cc.LabelTTF("---The End---", "", ENDING_LABEL_FONT_SIZE);
    //     endingLabel.setOpacity(0);
    //     endingLabel.setPosition(cc.p(NATURALLY_DIE_ENDING_LABEL_POS_X,NATURALLY_DIE_ENDING_LABEL_POS_Y));
    //     this.m_view.addChild(endingLabel,ENDING_LABEL_GAME_SCENE_VIEW_Z_ORDER);
    //     var endingLabelRepeatFadeUpFadeDownAction = cc.repeatForever(
    //         cc.sequence(
    //             cc.fadeTo(g_endingLabelFadeUpDuration,ENDING_LABEL_FADE_UP_OPACITY),
    //             cc.fadeTo(g_endingLabelFadeDownDuration,ENDING_LABEL_FADE_DOWN_OPACITY)
    //         )
    //     );
    //     endingLabel.runAction(endingLabelRepeatFadeUpFadeDownAction);
    // }
});