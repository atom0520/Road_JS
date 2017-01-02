/**
 * Created by atom on 16/7/22.
 */
var BeatSpriteManager = cc.Node.extend({
    m_beatSpritesVars:null,
    m_beatSpritesVars:null,
    ctor:function(){
        this._super();
        this.m_beatSpritesVars = [];
    },
    getBeatSprite:function(type){
        for(var i=0;i<this.m_beatSpritesVars.length;i++){
            if(this.m_beatSpritesVars[i].type == type
            && this.m_beatSpritesVars[i].sprite.isVisible() == false){
                //this.m_beatSpritesVars[i].sprite.setVisible(true);
                this.setBeatSpriteVisible(this.m_beatSpritesVars[i].sprite,true);

                switch (type){
                    case BeatType.elec:
                        this.m_beatSpritesVars[i].sprite.setOpacity(255);
                        break;
                    case BeatType.rose:
                    case BeatType.mask:
                    case BeatType.bell:
                        var beatSubSprite1 = this.m_beatSpritesVars[i].sprite.getChildByTag(SPECIAL_BEAT_SUB_SPRITE_1_TAG);
                        var beatSubSprite2 = this.m_beatSpritesVars[i].sprite.getChildByTag(SPECIAL_BEAT_SUB_SPRITE_2_TAG);
                        beatSubSprite1.setOpacity(0);
                        beatSubSprite2.setOpacity(255);

                        var beatSubSprite1RepeatFadeInFadeOutAction = cc.repeatForever(
                            cc.sequence(
                                cc.fadeIn(g_beatSubSprite1FadeInDuration),
                                cc.fadeOut(g_beatSubSprite1FadeOutDuration)

                            )
                        );
                        beatSubSprite1RepeatFadeInFadeOutAction.setTag(BEAT_SUB_SPRITE_1_REPEAT_FADE_IN_FADE_OUT_ACTION_TAG);
                        var beatSubSprite2RepeatFadeOutFadeInAction = cc.repeatForever(
                            cc.sequence(
                                cc.fadeOut(g_beatSubSprite1FadeInDuration),
                                cc.fadeIn(g_beatSubSprite1FadeOutDuration)
                            )
                        );
                        beatSubSprite2RepeatFadeOutFadeInAction.setTag(BEAT_SUB_SPRITE_2_REPEAT_FADE_OUT_FADE_IN_ACTION_TAG);
                        beatSubSprite1.runAction(beatSubSprite1RepeatFadeInFadeOutAction);
                        beatSubSprite2.runAction(beatSubSprite2RepeatFadeOutFadeInAction);
                        break;
                }

                return this.m_beatSpritesVars[i].sprite;
            }
        }

        var beatSprite;
        switch (type){
            case BeatType.elec:
                beatSprite = new cc.Sprite(res.beatElec_png);
                break;
            case BeatType.rose:
            case BeatType.mask:
            case BeatType.bell:
                beatSprite = new cc.Sprite();
                var beatSubSprite1 = new cc.Sprite(res.beatElec_png);
                beatSubSprite1.setOpacity(0);
                beatSprite.addChild(beatSubSprite1);
                beatSubSprite1.setTag(SPECIAL_BEAT_SUB_SPRITE_1_TAG);

                var beatSubSprite2;
                switch (type){
                    case BeatType.rose:
                        beatSubSprite2 = new cc.Sprite(res.beatRose_png);
                        beatSubSprite2.setScale(BEAT_ROSE_SUB_SPRITE_SCALE);
                        break;
                    case BeatType.mask:
                        beatSubSprite2 = new cc.Sprite(res.beatMask_png);
                        beatSubSprite2.setScale(BEAT_MASK_SUB_SPRITE_SCALE);
                        break;
                    case BeatType.bell:
                        beatSubSprite2 = new cc.Sprite(res.beatBell_png);
                        beatSubSprite2.setScale(BEAT_BELL_SUB_SPRITE_SCALE);
                        break;
                }

                beatSubSprite2.setOpacity(255);
                beatSprite.addChild(beatSubSprite2);
                beatSubSprite2.setTag(SPECIAL_BEAT_SUB_SPRITE_2_TAG);

                var beatSubSprite1RepeatFadeInFadeOutAction = cc.repeatForever(
                    cc.sequence(
                        cc.fadeIn(g_beatSubSprite1FadeInDuration),
                        cc.fadeOut(g_beatSubSprite1FadeOutDuration)

                    )
                );
                beatSubSprite1RepeatFadeInFadeOutAction.setTag(BEAT_SUB_SPRITE_1_REPEAT_FADE_IN_FADE_OUT_ACTION_TAG);
                var beatSubSprite2RepeatFadeOutFadeInAction = cc.repeatForever(
                    cc.sequence(
                        cc.fadeOut(g_beatSubSprite1FadeInDuration),
                        cc.fadeIn(g_beatSubSprite1FadeOutDuration)
                    )
                );
                beatSubSprite2RepeatFadeOutFadeInAction.setTag(BEAT_SUB_SPRITE_2_REPEAT_FADE_OUT_FADE_IN_ACTION_TAG);
                beatSubSprite1.runAction(beatSubSprite1RepeatFadeInFadeOutAction);
                beatSubSprite2.runAction(beatSubSprite2RepeatFadeOutFadeInAction);

                break;
        }
        beatSprite.retain();
        this.m_beatSpritesVars.push(this.createBeatSpriteVars(type,beatSprite));
        return beatSprite;
    },
    createBeatSpriteVars:function(type,sprite){
        return {type:type,sprite:sprite}
    },
    deleteAllBeatSpritesVars:function(){
        for(var i=0;i<this.m_beatSpritesVars.length;){
            this.m_beatSpritesVars[i].sprite.release();
            this.m_beatSpritesVars[i].sprite = null;
            this.m_beatSpritesVars.splice(i,1);
        }
    },
    setBeatSpriteVisible:function(sprite,bool){
        var beatSprite = sprite;
        beatSprite.setVisible(bool);
        var beatSubSprites = beatSprite.getChildren();
        for(var i=0;i<beatSubSprites.length;i++){
            beatSubSprites[i].setVisible(bool);
        }
    },
    removeBeatSpriteFromParent:function(sprite,type){
        switch (type) {
            case BeatType.elec:
                sprite.removeFromParent(false);
                break;
            case BeatType.rose:
            case BeatType.mask:
            case BeatType.bell:

                var subBeatSprite1 = sprite.getChildByTag(SPECIAL_BEAT_SUB_SPRITE_1_TAG);
                subBeatSprite1.stopActionByTag(BEAT_SUB_SPRITE_1_REPEAT_FADE_IN_FADE_OUT_ACTION_TAG);
                var subBeatSprite2 = sprite.getChildByTag(SPECIAL_BEAT_SUB_SPRITE_2_TAG);
                subBeatSprite2.stopActionByTag(BEAT_SUB_SPRITE_2_REPEAT_FADE_OUT_FADE_IN_ACTION_TAG);

                sprite.removeFromParent(false);
                break;
        }
    },
    createBeatSpriteFadeOutAction:function(beatSprite,type,duration){
        switch (type) {
            case BeatType.elec:
                return cc.fadeOut(duration);
                //break;
            case BeatType.rose:
            case BeatType.mask:
            case BeatType.bell:
                return cc.spawn(
                    cc.callFunc(
                        function(){
                            var subBeatSprite1 = this.getChildByTag(SPECIAL_BEAT_SUB_SPRITE_1_TAG);
                            subBeatSprite1.stopActionByTag(BEAT_SUB_SPRITE_1_REPEAT_FADE_IN_FADE_OUT_ACTION_TAG);

                            var subBeatSprite2 = this.getChildByTag(SPECIAL_BEAT_SUB_SPRITE_2_TAG);
                            subBeatSprite2.stopActionByTag(BEAT_SUB_SPRITE_2_REPEAT_FADE_OUT_FADE_IN_ACTION_TAG);

                            subBeatSprite1.runAction(cc.fadeOut(duration));
                            subBeatSprite2.runAction(cc.fadeOut(duration));
                        }.bind(beatSprite)
                    ),
                    cc.delayTime(duration)
                );
                //break;
        }
    }
});