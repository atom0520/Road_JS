/**
 * Created by atom on 16/7/21.
 */
var GameSceneView = cc.LayerColor.extend({
    m_delegate:null,

    m_beatSpriteLayer:null,
    m_hudLayer:null,
    m_bgArmatureLayer:null,

    m_heartSprite:null,
    m_heroSprite:null,
    m_beatTrackWhiteLineSprite:null,
    m_beatTrackGreyLineSprite:null,

    m_comboNumLabel:null,
    m_bgArmatures:null,
                                   
    m_blankWhiteLayer:null,
    
    m_testLabel1:null,
    m_testLabel2:null,
    m_testLabel3:null,
    m_testLabel4:null,
    m_testLabel5:null,
    ctor:function () {
        this._super(cc.color(0,0,0,255));

        this.m_beatSpriteLayer = new cc.Layer();
        this.addChild(this.m_beatSpriteLayer, BEAT_SPRITE_GAME_SCENE_VIEW_Z_ORDER);

        this.m_hudLayer = new cc.Layer();
        this.addChild(this.m_hudLayer, HUD_LAYER_GAME_SCENE_VIEW_Z_ORDER);

        this.m_bgArmatureLayer = new cc.Layer();
        this.addChild( this.m_bgArmatureLayer , BG_ARMATURE_LAYER_GAME_SCENE_VIEW_Z_ORDER);

        if(DEBUG_MODE == true){
            this.m_testLabel1 = new cc.LabelTTF("", "Arial", 18);
            this.m_testLabel1.x = 8;
            this.m_testLabel1.y = 8;
            this.m_testLabel1.setFontFillColor(cc.color(8,8,8,255));
            this.m_testLabel1.setAnchorPoint(cc.p(0,0));
            this.addChild(this.m_testLabel1, TEST_LABEL_GAME_SCENE_VIEW_Z_ORDER);

            this.m_testLabel2 = new cc.LabelTTF("", "Arial", 18);
            this.m_testLabel2.x = 8;
            this.m_testLabel2.y = 8+24;
            this.m_testLabel2.setFontFillColor(cc.color(8,8,8,255));
            this.m_testLabel2.setAnchorPoint(cc.p(0,0));
            this.addChild(this.m_testLabel2, TEST_LABEL_GAME_SCENE_VIEW_Z_ORDER);

            this.m_testLabel3 = new cc.LabelTTF("", "Arial", 18);
            this.m_testLabel3.x = 8;
            this.m_testLabel3.y = 8+24*2;
            this.m_testLabel3.setFontFillColor(cc.color(8,8,8,255));
            this.m_testLabel3.setAnchorPoint(cc.p(0,0));
            this.addChild(this.m_testLabel3, TEST_LABEL_GAME_SCENE_VIEW_Z_ORDER);

            this.m_testLabel4 = new cc.LabelTTF("", "Arial", 18);
            this.m_testLabel4.x = 8;
            this.m_testLabel4.y = 8+24*3;
            this.m_testLabel4.setFontFillColor(cc.color(8,8,8,255));
            this.m_testLabel4.setAnchorPoint(cc.p(0,0));
            this.addChild(this.m_testLabel4, TEST_LABEL_GAME_SCENE_VIEW_Z_ORDER);

            this.m_testLabel5 = new cc.LabelTTF("", "Arial", 32);
            this.m_testLabel5.x = cc.winSize.width-12;
            this.m_testLabel5.y = cc.winSize.height-8;
            this.m_testLabel5.setFontFillColor(cc.color(8,8,8,255));
            this.m_testLabel5.setAnchorPoint(cc.p(1,1));
            this.addChild(this.m_testLabel5, TEST_LABEL_GAME_SCENE_VIEW_Z_ORDER);
        }
    }
});