<template>
  <div>
    <el-row style="margin-top: 10px">
      <el-col>
        <el-card>
          <div slot="header">
            <svg-icon class="gayhub" icon-class="github" style="float:left" @click="goToProject"/>
            <svg-icon class="dianbao" icon-class="telegram" style="float:left;margin-left: 10px"
                      @click="gotoTgChannel"/>
            <svg-icon class="bilibili" icon-class="bilibili" style="float:right;margin-left:10px"
                      @click="gotoBiliBili"/>
            <svg-icon class="youguan" icon-class="youtube" style="float:right;margin-left:10px" @click="gotoYouTuBe"/>
            <svg-icon class="channel" icon-class="telegram" style="float:right;margin-left: 10px"
                      @click="gotoTgChannel"/>
            <div style="text-align:center;font-size:15px">璁?闃?杞?鎹?/div>
          </div>
          <el-container>
            <el-form :model="form" label-width="80px" label-position="left" style="width: 100%">
              <el-form-item label="璁㈤槄閾炬帴:">
                <el-input
                    v-model="form.sourceSubUrl"
                    type="textarea"
                    rows="3"
                    placeholder="鏀寔鍚勭璁㈤槄閾炬帴鎴栧崟鑺傜偣閾炬帴锛屽涓摼鎺ユ瘡琛屼竴涓垨鐢?| 鍒嗛殧"
                />
              </el-form-item>
              <el-form-item label="鐢熸垚绫诲瀷:">
                <el-select v-model="form.clientType" style="width: 100%">
                  <el-option v-for="(v, k) in options.clientTypes" :key="k" :label="k" :value="v"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="鍚庣鍦板潃:">
                <el-select
                    v-model="form.customBackend"
                    allow-create
                    filterable
                    @change="selectChanged"
                    placeholder="鍙緭鍏ヨ嚜宸辩殑鍚庣"
                    style="width: 100%"
                >
                  <el-option v-for="(v, k) in options.customBackend" :key="k" :label="k" :value="v"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="鐭摼閫夋嫨:">
                <el-select
                    v-model="form.shortType"
                    allow-create
                    filterable
                    placeholder="鍙緭鍏ュ叾浠栧彲鐢ㄧ煭閾続PI"
                    style="width: 100%"
                >
                  <el-option v-for="(v, k) in options.shortTypes" :key="k" :label="k" :value="v"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="杩滅▼閰嶇疆:">
                <el-select
                    v-model="form.remoteConfig"
                    allow-create
                    filterable
                    placeholder="璇烽€夋嫨"
                    style="width: 100%"
                >
                  <el-option-group
                      v-for="group in options.remoteConfig"
                      :key="group.label"
                      :label="group.label"
                  >
                    <el-option
                        v-for="item in group.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
              <el-form-item label-width="0px">
                <el-collapse>
                  <el-collapse-item>
                    <template slot="title">
                      <el-form-item label="楂樼骇鍔熻兘:" style="width: 100%;">
                        <el-button
                            type="limr"
                            style="width: 100%;"
                            icon="el-icon-more-outline"
                        >鐐瑰嚮鏄剧ず/闅愯棌
                        </el-button>
                      </el-form-item>
                    </template>
                    <el-form-item label="鍖呭惈鑺傜偣:">
                      <el-input v-model="form.includeRemarks" placeholder="瑕佷繚鐣欑殑鑺傜偣锛屾敮鎸佹鍒?/>
                    </el-form-item>
                    <el-form-item label="鎺掗櫎鑺傜偣:">
                      <el-input v-model="form.excludeRemarks" placeholder="瑕佹帓闄ょ殑鑺傜偣锛屾敮鎸佹鍒?/>
                    </el-form-item>
                    <el-form-item label="鑺傜偣鍛藉悕:">
                      <el-input v-model="form.rename" placeholder="涓句緥锛歚a@b``1@2`锛寍绗﹀彲鐢╘杞箟"/>
                    </el-form-item>
                    <el-form-item label="杩滅▼璁惧:">
                      <el-input v-model="form.devid" placeholder="鐢ㄤ簬璁剧疆QuantumultX鐨勮繙绋嬭澶嘔D"/>
                    </el-form-item>
                    <el-form-item label="鏇存柊闂撮殧:">
                      <el-input v-model="form.interval" placeholder="杩旂敤浜庤缃墭绠￠厤缃洿鏂伴棿闅旓紝鍗曚綅涓哄ぉ"/>
                    </el-form-item>
                    <el-form-item label="璁㈤槄鍛藉悕:">
                      <el-input v-model="form.filename"
                                placeholder="杩斿洖鐨勮闃呮枃浠跺悕锛屽彲浠ュ湪鏀寔鏂囦欢鍚嶇殑瀹㈡埛绔腑鏄剧ず鍑烘潵"/>
                    </el-form-item>
                    <el-form-item class="eldiy" label-width="0px">
                      <el-row type="flex">
                        <el-col>
                          <el-checkbox v-model="form.nodeList" label="浠呰緭鍑鸿妭鐐逛俊鎭? border></el-checkbox>
                        </el-col>
                        <el-popover placement="bottom" v-model="form.extraset">
                          <el-row :gutter="10">
                            <el-col :span="12">
                              <el-checkbox v-model="form.emoji" label="Emoji"></el-checkbox>
                            </el-col>
                            <el-col :span="12">
                              <el-checkbox v-model="form.insert" label="鎻掑叆榛樿鑺傜偣"></el-checkbox>
                            </el-col>
                          </el-row>
                          <el-row :gutter="10">
                            <el-col :span="12">
                              <el-checkbox v-model="form.udp" label="鍚敤 UDP"></el-checkbox>
                            </el-col>
                            <el-col :span="12">
                              <el-checkbox v-model="form.xudp" label="鍚敤 XUDP"></el-checkbox>
                            </el-col>
                          </el-row>
                          <el-row :gutter="10">
                            <el-col :span="12">
                              <el-checkbox v-model="form.tfo" label="鍚敤 TFO"></el-checkbox>
                            </el-col>
                            <el-col :span="12">
                              <el-checkbox v-model="form.sort" label="鍩虹鑺傜偣鎺掑簭"></el-checkbox>
                            </el-col>
                          </el-row>
                          <el-row :gutter="10">
                            <el-col :span="12">
                              <el-checkbox v-model="form.tpl.clash.doh" label="Clash.DoH"></el-checkbox>
                            </el-col>
                            <el-col :span="12">
                              <el-checkbox v-model="form.appendType" label="鎻掑叆鑺傜偣绫诲瀷"></el-checkbox>
                            </el-col>
                          </el-row>
                          <el-row :gutter="10">
                            <el-col :span="12">
                              <el-checkbox v-model="form.tpl.surge.doh" label="Surge.DoH"></el-checkbox>
                            </el-col>
                            <el-col :span="12">
                              <el-checkbox v-model="form.tls13" label="寮€鍚疶LS_1.3"></el-checkbox>
                            </el-col>
                          </el-row>
                          <el-row :gutter="10">
                            <el-col :span="12">
                              <el-checkbox v-model="form.expand" label="灞曞紑瑙勫垯鍏ㄦ枃"></el-checkbox>
                            </el-col>
                            <el-col :span="12">
                              <el-checkbox v-model="form.new_name" label="Clash鏂板瓧娈靛悕"></el-checkbox>
                            </el-col>
                          </el-row>
                          <el-row :gutter="10">
                            <el-col :span="12">
                              <el-checkbox v-model="form.scv" label="璺宠繃璇佷功楠岃瘉"></el-checkbox>
                            </el-col>
                            <el-col :span="12">
                              <el-checkbox v-model="form.fdn" label="杩囨护涓嶆敮鎸佽妭鐐?></el-checkbox>
                            </el-col>
                          </el-row>
                          <el-row :gutter="10">
                            <el-col :span="12">
                              <div style="margin-left: 35%">
                                <el-checkbox v-model="form.tpl.singbox.ipv6" label="Sing-Box鏀寔IPV6"></el-checkbox>
                              </div>
                            </el-col>
                          </el-row>
                          <el-button slot="reference">鏇村閫夐」</el-button>
                        </el-popover>
                      </el-row>
                    </el-form-item>
                  </el-collapse-item>
                </el-collapse>
              </el-form-item>
              <div style="margin-top: 30px"></div>
              <el-divider content-position="center">
                <el-button
                    type="zhuti"
                    @click="change">
                  <i id="rijian" class="el-icon-sunny"></i>
                  <i id="yejian" class="el-icon-moon"></i>
                </el-button>
              </el-divider>
              <el-form-item label="瀹氬埗璁㈤槄:">
                <el-input class="copy-content" disabled v-model="customSubUrl">
                  <el-button
                      slot="append"
                      v-clipboard:copy="customSubUrl"
                      v-clipboard:success="onCopy"
                      ref="copy-btn"
                      icon="el-icon-document-copy"
                  >澶嶅埗
                  </el-button>
                </el-input>
              </el-form-item>
              <el-form-item label="璁㈤槄鐭摼:">
                <el-input class="copy-content" v-model="customShortSubUrl"
                          placeholder="杈撳叆鑷畾涔夌煭閾炬帴鍚庣紑锛岀偣鍑荤敓鎴愮煭閾炬帴鍙弽澶嶇敓鎴?>
                  <el-button
                      slot="append"
                      v-clipboard:copy="customShortSubUrl"
                      v-clipboard:success="onCopy"
                      ref="copy-btn"
                      icon="el-icon-document-copy"
                  >澶嶅埗
                  </el-button>
                </el-input>
              </el-form-item>
              <el-form-item label-width="0px" style="margin-top: 40px; text-align: center">
                <el-button
                    style="width: 120px"
                    type="danger"
                    @click="makeUrl"
                    :disabled="form.sourceSubUrl.length === 0 || btnBoolean"
                >鐢熸垚璁㈤槄閾炬帴
                </el-button>
                <el-button
                    style="width: 120px"
                    type="danger"
                    @click="makeShortUrl"
                    :loading="loading1"
                    :disabled="customSubUrl.length === 0"
                >鐢熸垚鐭摼鎺?
                </el-button>
              </el-form-item>
              <el-form-item label-width="0px" style="text-align: center">
                <el-button
                    style="width: 120px"
                    type="primary"
                    icon="el-icon-copy-document"
                    :loading="loading3"
                ><a href="https://t.me/CitizenScyu" style="color: inherit;">鍔犲叆棰戦亾</a></el-button>
                <el-button
                    style="width: 120px"
                    type="primary"
                    @click="dialogLoadConfigVisible = true"
                    icon="el-icon-copy-document"
                    :loading="loading3"
                >浠嶶RL瑙ｆ瀽</el-button>
              </el-form-item>
              <el-form-item label-width="0px" style="text-align: center">
                <el-button
                    style="width: 120px;"
                    type="primary"
                    icon="el-icon-video-play"
                    @click="centerDialogVisible = true"
                >瑙嗛鏁欑▼
                </el-button>
              <el-button
                    style="width: 120px"
                    type="primary"
                    @click="dialogUploadConfigVisible = true"
                    icon="el-icon-upload"
                    :loading="loading2"
                >鑷畾涔夐厤缃?
                </el-button>
              </el-form-item>
            </el-form>
          </el-container>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
        title="璇烽€夋嫨闇€瑕佽鐪嬬殑瑙嗛鏁欑▼"
        :visible.sync="centerDialogVisible"
        :show-close="false"
        width="40vh"
        top="30vh"
        center>
      <div label-width="0px" style="text-align: center">
        <el-button
            style="width: 200px;"
            type="primary"
            icon="el-icon-video-play"
            @click="gotoBasicVideo();centerDialogVisible = false"
        >鍩虹瑙嗛鏁欑▼
        </el-button>
      </div>
      <div label-width="0px" style="text-align: center;margin: 3vh 0 2vh">
        <el-button
            style="width: 200px;"
            type="danger"
            icon="el-icon-video-play"
            @click="gotoAdvancedVideo();centerDialogVisible = false"
        >杩涢樁瑙嗛鏁欑▼
        </el-button>
      </div>
      <div label-width="0px" style="text-align: center;margin: 3vh 0 2vh">
        <el-button
            style="width: 200px;"
            type="warning"
            icon="el-icon-download"
            @click="toolsDown"
        >浠ｇ悊宸ュ叿闆嗗悎
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
        :visible.sync="dialogUploadConfigVisible"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="80%"
    >
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="杩滅▼閰嶇疆涓婁紶" name="first">
          <el-link type="danger" :href="sampleConfig" style="margin-bottom: 15px" target="_blank" icon="el-icon-info">
            鍙傝€冩渚?
          </el-link>
          <el-form label-position="left">
            <el-form-item prop="uploadConfig">
              <el-input
                  v-model="uploadConfig"
                  type="textarea"
                  :autosize="{ minRows: 15, maxRows: 15}"
                  maxlength="50000"
                  show-word-limit
              ></el-input>
            </el-form-item>
          </el-form>
          <div style="float: right">
            <el-button type="primary" @click="uploadConfig = ''; dialogUploadConfigVisible = false">鍙?娑?/el-button>
            <el-button
                type="primary"
                @click="confirmUploadConfig"
                :disabled="uploadConfig.length === 0"
            >纭?瀹?
            </el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="JS鎺掑簭鑺傜偣" name="second">
          <el-link type="success" :href="scriptConfig" style="margin-bottom: 15px" target="_blank" icon="el-icon-info">
            鍙傝€冩渚?
          </el-link>
          <el-form label-position="left">
            <el-form-item prop="uploadScript">
              <el-input
                  v-model="uploadScript"
                  placeholder="鏈姛鑳芥殏鍋滀娇鐢紝濡傛湁鍏磋叮锛岃嚜琛屽幓鎴戠殑GitHub鍙傝€僺ub-web-api椤圭洰閮ㄧ讲锛?
                  type="textarea"
                  :autosize="{ minRows: 15, maxRows: 15}"
                  maxlength="50000"
                  show-word-limit
              ></el-input>
            </el-form-item>
          </el-form>
          <div style="float: right">
            <el-button type="primary" @click="uploadScript = ''; dialogUploadConfigVisible = false">鍙?娑?/el-button>
            <el-button
                type="primary"
                @click="confirmUploadScript"
                :disabled="uploadScript.length === 0"
            >纭?瀹?
            </el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="JS绛涢€夎妭鐐? name="third">
          <el-link type="warning" :href="filterConfig" style="margin-bottom: 15px" target="_blank" icon="el-icon-info">
            鍙傝€冩渚?
          </el-link>
          <el-form label-position="left">
            <el-form-item prop="uploadFilter">
              <el-input
                  v-model="uploadFilter"
                  placeholder="鏈姛鑳芥殏鍋滀娇鐢紝濡傛湁鍏磋叮锛岃嚜琛屽幓鎴戠殑GitHub鍙傝€僺ub-web-api椤圭洰閮ㄧ讲锛?
                  type="textarea"
                  :autosize="{ minRows: 15, maxRows: 15}"
                  maxlength="50000"
                  show-word-limit
              ></el-input>
            </el-form-item>
          </el-form>
          <div style="float: right">
            <el-button type="primary" @click="uploadFilter = ''; dialogUploadConfigVisible = false">鍙?娑?/el-button>
            <el-button
                type="primary"
                @click="confirmUploadScript"
                :disabled="uploadFilter.length === 0"
            >纭?瀹?
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog
        :visible.sync="dialogLoadConfigVisible"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="80%"
    >
      <div slot="title">
        鍙互浠庣敓鎴愮殑闀?鐭摼鎺ヤ腑瑙ｆ瀽淇℃伅,濉叆椤甸潰涓幓
      </div>
      <el-form label-position="left">
        <el-form-item prop="uploadConfig">
          <el-input
              v-model="loadConfig"
              type="textarea"
              :autosize="{ minRows: 15, maxRows: 15}"
              maxlength="5000"
              show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="loadConfig = ''; dialogLoadConfigVisible = false">鍙?娑?/el-button>
        <el-button
            type="primary"
            @click="confirmLoadConfig"
            :disabled="loadConfig.length === 0"
        >纭?瀹?
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
const project = process.env.VUE_APP_PROJECT
const configScriptBackend = process.env.VUE_APP_CONFIG_UPLOAD_BACKEND + '/api.php'
const remoteConfigSample = process.env.VUE_APP_SUBCONVERTER_REMOTE_CONFIG
const scriptConfigSample = process.env.VUE_APP_SCRIPT_CONFIG
const filterConfigSample = process.env.VUE_APP_FILTER_CONFIG
const defaultBackend = process.env.VUE_APP_SUBCONVERTER_DEFAULT_BACKEND
const shortUrlBackend = process.env.VUE_APP_MYURLS_DEFAULT_BACKEND + '/short'
const configUploadBackend = process.env.VUE_APP_CONFIG_UPLOAD_BACKEND + '/sub.php'
const basicVideo = process.env.VUE_APP_BASIC_VIDEO
const advancedVideo = process.env.VUE_APP_ADVANCED_VIDEO
const tgBotLink = process.env.VUE_APP_BOT_LINK
const yglink = process.env.VUE_APP_YOUTUBE_LINK
const bzlink = process.env.VUE_APP_BILIBILI_LINK
const downld = 'http://' + window.location.host + '/download.html'
export default {
  data() {
    return {
      backendVersion: "",
      centerDialogVisible: false,
      activeName: 'first',
      // 鏄惁涓?PC 绔?
      isPC: true,
      btnBoolean: false,
      options: {
        clientTypes: {
          Clash: "clash",
          "Surge4/5": "surge&ver=4",
          "Sing-Box": "singbox",
          V2Ray: "v2ray",
          Trojan: "trojan",
          ShadowsocksR: "ssr",
          "娣峰悎璁㈤槄锛坢ixed锛?: "mixed",
          Surfboard: "surfboard",
          Quantumult: "quan",
          "Quantumult X": "quanx",
          Loon: "loon",
          Mellow: "mellow",
          Surge3: "surge&ver=3",
          Surge2: "surge&ver=2",
          ClashR: "clashr",
          "Shadowsocks(SIP002)": "ss",
          "Shadowsocks Android(SIP008)": "sssub",
          ShadowsocksD: "ssd",
          "鑷姩鍒ゆ柇瀹㈡埛绔?: "auto",
        },
        shortTypes: {
          "v1.mk": "https://v1.mk/short",
          "d1.mk": "https://d1.mk/short",
          "dlj.tf": "https://dlj.tf/short",
          "suo.yt": "https://suo.yt/short",
          "sub.cm": "https://sub.cm/short",
        },
        customBackend: {
          "鎴戠殑鑷缓鍚庣": "https://subconverter.1040327027.workers.dev/sub",
          "澶ц薄鍚庣": "https://sub2.dxdyzh.tk",
          "浣╁鍚庣": "https://api.nexconvert.com",
          "鑲ョ緤澧炲己鍨嬪悗绔€恦less reality+hy1+hy2銆?: "https://url.v1.mk",
          "鑲ョ緤澶囩敤鍚庣銆恦less reality+hy1+hy2銆?: "https://sub.d1.mk",
          "銇ゃ仱-澶氬湴闃插け鑱斻€愯礋杞藉潎琛?鍥藉唴浼樺寲銆?: "https://api.tsutsu.one",
          nameless13鎻愪緵: "https://www.nameless13.com",
          subconverter浣滆€呮彁渚? "https://sub.xeton.dev",
          "sub-web浣滆€呮彁渚?: "https://api.wcc.best",
          "澧欐礊": "https://api.dler.io",
        },
        backendOptions: [
          {value: "https://subconverter.1040327027.workers.dev/sub"},
          {value: "https://sub2.dxdyzh.tk"},
          {value: "https://api.nexconvert.com"},
          {value: "https://url.v1.mk"},
          {value: "https://sub.d1.mk"},
          {value: "https://api.tsutsu.one"},
          {value: "https://www.nameless13.com"},
          {value: "https://sub.xeton.dev"},
          {value: "https://api.wcc.best"},
          {value: "https://api.dler.io"},
        ],
        remoteConfig: [
          {
            label: "閫氱敤",
            options: [
              {
                label: "DNS闃叉硠婕?,
                value: "https://raw.githubusercontent.com/CitizenScyu/clash-rules/master/DNS.ini"
              },
              {
                label: "榛樿锛堣嚜鍔ㄦ祴閫燂級",
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_AdblockPlus.ini"
              }, 
            ]
          },
          {
            label: "ACL瑙勫垯",
            options: [
              {
                label: "ACL_榛樿鐗?,
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online.ini"
              },
              {
                label: "ACL_鏃犳祴閫熺増",
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_NoAuto.ini"
              },
              {
                label: "ACL_鍘诲箍鍛婄増",
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_AdblockPlus.ini"
              },
              {
                label: "ACL_澶氬浗瀹剁増",
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_MultiCountry.ini"
              },
              {
                label: "ACL_鏃燫eject鐗?,
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_NoReject.ini"
              },
              {
                label: "ACL_鏃犳祴閫熺簿绠€鐗?,
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_NoAuto.ini"
              },
              {
                label: "ACL_鍏ㄥ垎缁勭増",
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full.ini"
              },
              {
                label: "ACL_鍏ㄥ垎缁勮胺姝岀増",
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_Google.ini"
              },
              {
                label: "ACL_鍏ㄥ垎缁勫妯″紡鐗?,
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_MultiMode.ini"
              },
              {
                label: "ACL_鍏ㄥ垎缁勫椋炵増",
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_Netflix.ini"
              },
              {
                label: "ACL_绮剧畝鐗?,
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini.ini"
              },
              {
                label: "ACL_鍘诲箍鍛婄簿绠€鐗?,
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_AdblockPlus.ini"
              },
              {
                label: "ACL_Fallback绮剧畝鐗?,
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_Fallback.ini"
              },
              {
                label: "ACL_澶氬浗瀹剁簿绠€鐗?,
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_MultiCountry.ini"
              },
              {
                label: "ACL_澶氭ā寮忕簿绠€鐗?,
                value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_MultiMode.ini"
              }
            ]
          },
          {
            label: "鍏ㄧ綉鎼滈泦瑙勫垯",
            options: [
              {
                label: "甯歌瑙勫垯",
                value: "https://raw.githubusercontent.com/flyhigherpi/merlinclash_clash_related/master/Rule_config/ZHANG.ini"
              },
              {
                label: "閰烽叿鑷敤",
                value: "https://raw.githubusercontent.com/xiaoshenxian233/cool/rule/complex.ini"
              },
              {
                label: "PharosPro鏃犳祴閫?,
                value:
                    "https://subweb.s3.fr-par.scw.cloud/RemoteConfig/special/phaors.ini"
              },
              {
                label: "鍒嗗尯鍩熸晠闅滆浆绉?,
                value: "https://raw.githubusercontent.com/flyhigherpi/merlinclash_clash_related/master/Rule_config/ZHANG_Area_Fallback.ini"
              },
              {
                label: "鍒嗗尯鍩熻嚜鍔ㄦ祴閫?,
                value: "https://raw.githubusercontent.com/flyhigherpi/merlinclash_clash_related/master/Rule_config/ZHANG_Area_Urltest.ini"
              },
              {
                label: "鍒嗗尯鍩熸棤鑷姩娴嬮€?,
                value: "https://raw.githubusercontent.com/flyhigherpi/merlinclash_clash_related/master/Rule_config/ZHANG_Area_NoAuto.ini"
              },
              {
                label: "OoHHHHHHH",
                value: "https://raw.githubusercontent.com/OoHHHHHHH/ini/master/config.ini"
              },
              {
                label: "CFW-TAP",
                value: "https://raw.githubusercontent.com/OoHHHHHHH/ini/master/cfw-tap.ini"
              },
              {
                label: "lhl77鍏ㄥ垎缁勶紙瀹氭湡鏇存柊锛?,
                value: "https://raw.githubusercontent.com/lhl77/sub-ini/main/tsutsu-full.ini"
              },
              {
                label: "lhl77绠€鏄撶増锛堝畾鏈熸洿鏂帮級",
                value: "https://raw.githubusercontent.com/lhl77/sub-ini/main/tsutsu-mini-gfw.ini"
              },
              {
                label: "ConnersHua 绁炴満瑙勫垯 Outbound",
                value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/connershua_new.ini"
              },
              {
                label: "ConnersHua 绁炴満瑙勫垯 Inbound 鍥炲浗涓撶敤",
                value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/connershua_backtocn.ini"
              },
              {
                label: "lhie1 娲炰富瑙勫垯锛堜娇鐢?Clash 鍒嗙粍瑙勫垯锛?,
                value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/lhie1_clash.ini"
              },
              {
                label: "lhie1 娲炰富瑙勫垯瀹屾暣鐗?,
                value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/lhie1_dler.ini"
              },
              {
                label: "eHpo1 瑙勫垯",
                value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/ehpo1_main.ini"
              },
              {
                label: "澶氱瓥鐣ョ粍榛樿鐧藉悕鍗曟ā寮?,
                value: "https://raw.nameless13.com/api/public/dl/ROzQqi2S/white.ini"
              },
              {
                label: "澶氱瓥鐣ョ粍鍙互鏈夋晥鍑忓皯瀹¤瑙﹀彂",
                value: "https://raw.nameless13.com/api/public/dl/ptLeiO3S/mayinggfw.ini"
              },
              {
                label: "绮剧畝绛栫暐榛樿鐧藉悕鍗?,
                value: "https://raw.nameless13.com/api/public/dl/FWSh3dXz/easy3.ini"
              },
              {
                label: "澶氱瓥鐣ュ鍔燬MTP绛栫暐",
                value: "https://raw.nameless13.com/api/public/dl/L_-vxO7I/youtube.ini"
              },
              {
                label: "鏃犵瓥鐣ュ叆闂ㄦ帹鑽?,
                value: "https://raw.nameless13.com/api/public/dl/zKF9vFbb/easy.ini"
              },
              {
                label: "鏃犵瓥鐣ュ叆闂ㄦ帹鑽愬浗瀹跺垎缁?,
                value: "https://raw.nameless13.com/api/public/dl/E69bzCaE/easy2.ini"
              },
              {
                label: "鏃犵瓥鐣ヤ粎IPIP CN + Final",
                value: "https://raw.nameless13.com/api/public/dl/XHr0miMg/ipip.ini"
              },
              {
                label: "鏃犵瓥鐣ラ瓍褰眝ip鍒嗙粍",
                value: "https://raw.nameless13.com/api/public/dl/BBnfb5lD/MAYINGVIP.ini"
              },
              {
                label: "鍝佷簯涓撳睘閰嶇疆锛堜粎棣欐腐鍖哄煙鍒嗙粍锛?,
                value: "https://raw.githubusercontent.com/Mazeorz/airports/master/Clash/Examine.ini"
              },
              {
                label: "鍝佷簯涓撳睘閰嶇疆锛堝叏鍦板煙鍒嗙粍锛?,
                value: "https://raw.githubusercontent.com/Mazeorz/airports/master/Clash/Examine_Full.ini"
              },
              {
                label: "nzw9314 瑙勫垯",
                value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/nzw9314_custom.ini"
              },
              {
                label: "maicoo-l 瑙勫垯",
                value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/maicoo-l_custom.ini"
              },
              {
                label: "DlerCloud Platinum 鏉庡摜瀹氬埗瑙勫垯",
                value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/dlercloud_lige_platinum.ini"
              },
              {
                label: "DlerCloud Gold 鏉庡摜瀹氬埗瑙勫垯",
                value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/dlercloud_lige_gold.ini"
              },
              {
                label: "DlerCloud Silver 鏉庡摜瀹氬埗瑙勫垯",
                value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/dlercloud_lige_silver.ini"
              },
              {
                label: "ProxyStorage鑷敤",
                value: "https://unpkg.com/proxy-script/config/Clash/clash.ini"
              },
              {
                label: "ShellClash淇敼鐗堣鍒?(by UlinoyaPed)",
                value: "https://github.com/UlinoyaPed/ShellClash/raw/master/rules/ShellClash.ini"
              }
            ]
          },
          {
            label: "鍚勫ぇ鏈哄満瑙勫垯",
            options: [
              {
                label: "EXFLUX",
                value:
                    "https://gist.github.com/jklolixxs/16964c46bad1821c70fa97109fd6faa2/raw/EXFLUX.ini"
              },
              {
                label: "NaNoport",
                value:
                    "https://gist.github.com/jklolixxs/32d4e9a1a5d18a92beccf3be434f7966/raw/NaNoport.ini"
              },
              {
                label: "CordCloud",
                value:
                    "https://gist.github.com/jklolixxs/dfbe0cf71ffc547557395c772836d9a8/raw/CordCloud.ini"
              },
              {
                label: "BigAirport",
                value:
                    "https://gist.github.com/jklolixxs/e2b0105c8be6023f3941816509a4c453/raw/BigAirport.ini"
              },
              {
                label: "璺戣矾浜?,
                value:
                    "https://gist.github.com/jklolixxs/9f6989137a2cfcc138c6da4bd4e4cbfc/raw/PaoLuCloud.ini"
              },
              {
                label: "WaveCloud",
                value:
                    "https://gist.github.com/jklolixxs/fccb74b6c0018b3ad7b9ed6d327035b3/raw/WaveCloud.ini"
              },
              {
                label: "鍑犻浮",
                value:
                    "https://gist.github.com/jklolixxs/bfd5061dceeef85e84401482f5c92e42/raw/JiJi.ini"
              },
              {
                label: "鍥涘鍔犻€?,
                value:
                    "https://gist.github.com/jklolixxs/6ff6e7658033e9b535e24ade072cf374/raw/SJ.ini"
              },
              {
                label: "ImmTelecom",
                value:
                    "https://gist.github.com/jklolixxs/24f4f58bb646ee2c625803eb916fe36d/raw/ImmTelecom.ini"
              },
              {
                label: "AmyTelecom",
                value:
                    "https://gist.github.com/jklolixxs/b53d315cd1cede23af83322c26ce34ec/raw/AmyTelecom.ini"
              },
              {
                label: "LinkCube",
                value:
                    "https://subweb.s3.fr-par.scw.cloud/RemoteConfig/customized/convenience.ini"
              },
              {
                label: "Miaona",
                value:
                    "https://gist.github.com/jklolixxs/ff8ddbf2526cafa568d064006a7008e7/raw/Miaona.ini"
              },
              {
                label: "Foo&Friends",
                value:
                    "https://gist.github.com/jklolixxs/df8fda1aa225db44e70c8ac0978a3da4/raw/Foo&Friends.ini"
              },
              {
                label: "ABCloud",
                value:
                    "https://gist.github.com/jklolixxs/b1f91606165b1df82e5481b08fd02e00/raw/ABCloud.ini"
              },
              {
                label: "鍜搁奔",
                value: "https://raw.githubusercontent.com/SleepyHeeead/subconverter-config/master/remote-config/customized/xianyu.ini"
              },
              {
                label: "渚垮埄搴?,
                value: "https://subweb.oss-cn-hongkong.aliyuncs.com/RemoteConfig/customized/convenience.ini"
              },
              {
                label: "CNIX",
                value: "https://raw.githubusercontent.com/Mazeorz/airports/master/Clash/SSRcloud.ini"
              },
              {
                label: "Nirvana",
                value: "https://raw.githubusercontent.com/Mazetsz/ACL4SSR/master/Clash/config/V2rayPro.ini"
              },
              {
                label: "V2Pro",
                value: "https://raw.githubusercontent.com/Mazeorz/airports/master/Clash/V2Pro.ini"
              },
              {
                label: "鍙茶开浠?鑷姩娴嬮€?,
                value: "https://raw.githubusercontent.com/Mazeorz/airports/master/Clash/Stitch.ini"
              },
              {
                label: "鍙茶开浠?璐熻浇鍧囪　",
                value: "https://raw.githubusercontent.com/Mazeorz/airports/master/Clash/Stitch-Balance.ini"
              },
              {
                label: "Maying",
                value: "https://raw.githubusercontent.com/SleepyHeeead/subconverter-config/master/remote-config/customized/maying.ini"
              },
              {
                label: "Ytoo",
                value: "https://subweb.s3.fr-par.scw.cloud/RemoteConfig/customized/ytoo.ini"
              },
              {
                label: "w8ves",
                value: "https://raw.nameless13.com/api/public/dl/M-We_Fn7/w8ves.ini"
              },
              {
                label: "NyanCAT",
                value: "https://raw.githubusercontent.com/SleepyHeeead/subconverter-config/master/remote-config/customized/nyancat.ini"
              },
              {
                label: "Nexitally",
                value: "https://subweb.s3.fr-par.scw.cloud/RemoteConfig/customized/nexitally.ini"
              },
              {
                label: "SoCloud",
                value: "https://raw.githubusercontent.com/SleepyHeeead/subconverter-config/master/remote-config/customized/socloud.ini"
              },
              {
                label: "ARK",
                value: "https://raw.githubusercontent.com/SleepyHeeead/subconverter-config/master/remote-config/customized/ark.ini"
              },
              {
                label: "N3RO",
                value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/n3ro_optimized.ini"
              },
              {
                label: "Scholar",
                value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/scholar_optimized.ini"
              },
              {
                label: "Flowercloud",
                value: "https://subweb.s3.fr-par.scw.cloud/RemoteConfig/customized/flower.ini"
              }
            ]
          },
          {
            label: "鐗规畩",
            options: [
              {
                label: "NeteaseUnblock",
                value: "https://raw.githubusercontent.com/SleepyHeeead/subconverter-config/master/remote-config/special/netease.ini"
              },
              {
                label: "Basic",
                value: "https://raw.githubusercontent.com/SleepyHeeead/subconverter-config/master/remote-config/special/basic.ini"
              }
            ]
          }
        ]
      },
      form: {
        sourceSubUrl: "",
        clientType: "",
        customBackend: this.getUrlParam() == "" ? "https://sub2.dxdyzh.tk" : this.getUrlParam(),
        shortType: "https://v1.mk/short",
        remoteConfig: "https://raw.githubusercontent.com/CitizenScyu/clash-rules/master/DNS.ini",
        excludeRemarks: "",
        includeRemarks: "",
        filename: "",
        rename: "",
        devid: "",
        interval: "",
        emoji: true,
        nodeList: false,
        extraset: false,
        tls13: false,
        udp: false,
        xudp: false,
        tfo: false,
        sort: false,
        expand: true,
        scv: false,
        fdn: false,
        appendType: false,
        insert: false, // 鏄惁鎻掑叆榛樿璁㈤槄鐨勮妭鐐癸紝瀵瑰簲閰嶇疆椤?insert_url
        new_name: true, // 鏄惁浣跨敤 Clash 鏂板瓧娈?
        tpl: {
          surge: {
            doh: false // dns 鏌ヨ鏄惁浣跨敤 DoH
          },
          clash: {
            doh: false
          },
          singbox: {
            ipv6: false
          }
        }
      },
      loading1: false,
      loading2: false,
      loading3: false,
      customSubUrl: "",
      customShortSubUrl: "",
      dialogUploadConfigVisible: false,
      loadConfig: "",
      dialogLoadConfigVisible: false,
      uploadFilter: "",
      uploadScript: "",
      uploadConfig: "",
      myBot: tgBotLink,
      filterConfig: filterConfigSample,
      scriptConfig: scriptConfigSample,
      sampleConfig: remoteConfigSample
    };
  },
  created() {
    document.title = "澶ц薄璁㈤槄杞崲宸ュ叿";
    this.isPC = this.$getOS().isPc;
  },
  mounted() {
    this.form.clientType = "clash";
    this.getBackendVersion();
    this.anhei();
    let lightMedia = window.matchMedia('(prefers-color-scheme: light)');
    let darkMedia = window.matchMedia('(prefers-color-scheme: dark)');
    let callback = (e) => {
      if (e.matches) {
        this.anhei();
      }
    };
    if (typeof darkMedia.addEventListener === 'function' || typeof lightMedia.addEventListener === 'function') {
      lightMedia.addEventListener('change', callback);
      darkMedia.addEventListener('change', callback);
    } //鐩戝惉绯荤粺涓婚锛岃嚜鍔ㄥ垏鎹紒
  },
  methods: {
    selectChanged() {
      this.getBackendVersion();
    },
    getUrlParam() {
      let query = window.location.search.substring(1);
      let vars = query.split('&');
      for (let i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (pair[0] == "backend") {
          return decodeURIComponent(pair[1]);
        }
      }
      return "";
    },
    anhei() {
      const getLocalTheme = window.localStorage.getItem("localTheme");
      const lightMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)');
      const darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
      if (getLocalTheme) {
        document.getElementsByTagName('body')[0].className = getLocalTheme;
      } //璇诲彇localstorage锛屼紭鍏堢骇鏈€楂橈紒
      else if (getLocalTheme == null || getLocalTheme == "undefined" || getLocalTheme == "") {
        if (new Date().getHours() >= 19 || new Date().getHours() < 7) {
          document.getElementsByTagName('body')[0].setAttribute('class', 'dark-mode');
        } else {
          document.getElementsByTagName('body')[0].setAttribute('class', 'light-mode');
        } //鏍规嵁褰撳墠鏃堕棿鏉ュ垽鏂紝鐢ㄦ潵瀵逛粯QQ绛変笉鏀寔濯掍綋鍙橀噺鏌ヨ鐨勬祻瑙堝櫒
        if (lightMode && lightMode.matches) {
          document.getElementsByTagName('body')[0].setAttribute('class', 'light-mode');
        }
        if (darkMode && darkMode.matches) {
          document.getElementsByTagName('body')[0].setAttribute('class', 'dark-mode');
        } //鏍规嵁绐楀彛涓婚鏉ュ垽鏂綋鍓嶄富棰橈紒
      }
    },
    change() {
      var zhuti = document.getElementsByTagName('body')[0].className;
      if (zhuti === 'light-mode') {
        document.getElementsByTagName('body')[0].setAttribute('class', 'dark-mode');
        window.localStorage.setItem('localTheme', 'dark-mode');
      }
      if (zhuti === 'dark-mode') {
        document.getElementsByTagName('body')[0].setAttribute('class', 'light-mode');
        window.localStorage.setItem('localTheme', 'light-mode');
      }
    },
    onCopy() {
      this.$message.success("宸插鍒?);
    },
    goToProject() {
      window.open(project);
    },
    gotoTgChannel() {
      window.open(tgBotLink);
    },
    gotoBiliBili() {
      window.open(bzlink);
    },
    gotoYouTuBe() {
      window.open(yglink);
    },
    toolsDown() {
      window.open(downld);
    },
    gotoBasicVideo() {
      this.$alert("鎬т环姣旀満鍦?https://m5js.top/register?code=XQeYp0Eu", {
        type: "warning",
        confirmButtonText: '纭畾',
        customClass: 'msgbox',
        showClose: false,
      })
          .then(() => {
            window.open(basicVideo);
          });
    },
    gotoAdvancedVideo() {
      this.$alert("娆㈣繋鍔犲叆TG棰戦亾@CitizenScyu", {
        type: "warning",
        confirmButtonText: '纭畾',
        customClass: 'msgbox',
        showClose: false,
      })
          .then(() => {
            window.open(advancedVideo);
          });
    },
    makeUrl() {
      if (this.form.sourceSubUrl === "" || this.form.clientType === "") {
        this.$message.error("璁㈤槄閾炬帴涓庡鎴风涓哄繀濉」");
        return false;
      }
      let backend =
          this.form.customBackend === ""
              ? defaultBackend
              : this.form.customBackend;
      let sourceSub = this.form.sourceSubUrl;
      sourceSub = sourceSub.replace(/(\n|\r|\n\r)/g, "|");
      this.customSubUrl =
          backend +
          "/sub?target=" +
          this.form.clientType +
          "&url=" +
          encodeURIComponent(sourceSub) +
          "&insert=" +
          this.form.insert;
      if (this.form.remoteConfig !== "") {
        this.customSubUrl +=
            "&config=" + encodeURIComponent(this.form.remoteConfig);
      }
      if (this.form.excludeRemarks !== "") {
        this.customSubUrl +=
            "&exclude=" + encodeURIComponent(this.form.excludeRemarks);
      }
      if (this.form.includeRemarks !== "") {
        this.customSubUrl +=
            "&include=" + encodeURIComponent(this.form.includeRemarks);
      }
      if (this.form.filename !== "") {
        this.customSubUrl +=
            "&filename=" + encodeURIComponent(this.form.filename);
      }
      if (this.form.rename !== "") {
        this.customSubUrl +=
            "&rename=" + encodeURIComponent(this.form.rename);
      }
      if (this.form.interval !== "") {
        this.customSubUrl +=
            "&interval=" + encodeURIComponent(this.form.interval * 86400);
      }
      if (this.form.devid !== "") {
        this.customSubUrl +=
            "&dev_id=" + encodeURIComponent(this.form.devid);
      }
      if (this.form.appendType) {
        this.customSubUrl +=
            "&append_type=" + this.form.appendType.toString();
      }
      if (this.form.tls13) {
        this.customSubUrl +=
            "&tls13=" + this.form.tls13.toString();
      }
      if (this.form.sort) {
        this.customSubUrl +=
            "&sort=" + this.form.sort.toString();
      }
      this.customSubUrl +=
          "&emoji=" +
          this.form.emoji.toString() +
          "&list=" +
          this.form.nodeList.toString() +
          "&xudp=" +
          this.form.xudp.toString() +
          "&udp=" +
          this.form.udp.toString() +
          "&tfo=" +
          this.form.tfo.toString() +
          "&expand=" +
          this.form.expand.toString() +
          "&scv=" +
          this.form.scv.toString() +
          "&fdn=" +
          this.form.fdn.toString();
      if (this.form.clientType.includes("surge")) {
        if (this.form.tpl.surge.doh === true) {
          this.customSubUrl += "&surge.doh=true";
        }
      }
      if (this.form.clientType === "clash") {
        if (this.form.tpl.clash.doh === true) {
          this.customSubUrl += "&clash.doh=true";
        }
        this.customSubUrl += "&new_name=" + this.form.new_name.toString();
      }
      if (this.form.clientType === "singbox") {
        if (this.form.tpl.singbox.ipv6 === true) {
          this.customSubUrl += "&singbox.ipv6=1";
        }
      }
      this.$copyText(this.customSubUrl);
      this.$message.success("瀹氬埗璁㈤槄宸插鍒跺埌鍓创鏉?);
    },
    makeShortUrl() {
      let duan =
          this.form.shortType === ""
              ? shortUrlBackend
              : this.form.shortType;
      this.loading1 = true;
      let data = new FormData();
      data.append("longUrl", btoa(this.customSubUrl));
      if (this.customShortSubUrl.trim() != "") {
        data.append("shortKey", this.customShortSubUrl.trim().indexOf("http") < 0 ? this.customShortSubUrl.trim() : "");
      }
      this.$axios
          .post(duan, data, {
            header: {
              "Content-Type": "application/form-data; charset=utf-8"
            }
          })
          .then(res => {
            if (res.data.Code === 1 && res.data.ShortUrl !== "") {
              this.customShortSubUrl = res.data.ShortUrl;
              this.$copyText(res.data.ShortUrl);
              this.$message.success("鐭摼鎺ュ凡澶嶅埗鍒板壀璐存澘锛圛OS璁惧鍜孲afari娴忚鍣ㄤ笉鏀寔鑷姩澶嶅埗API锛岄渶鎵嬪姩鐐瑰嚮澶嶅埗鎸夐挳锛?);
            } else {
              this.$message.error("鐭摼鎺ヨ幏鍙栧け璐ワ細" + res.data.Message);
            }
          })
          .catch(() => {
            this.$message.error("鐭摼鎺ヨ幏鍙栧け璐?);
          })
          .finally(() => {
            this.loading1 = false;
          });
    },
    confirmUploadConfig() {
      this.loading2 = true;
      let data = new FormData();
      data.append("config", encodeURIComponent(this.uploadConfig));
      this.$axios
          .post(configUploadBackend, data, {
            header: {
              "Content-Type": "application/form-data; charset=utf-8"
            }
          })
          .then(res => {
            if (res.data.code === 0 && res.data.data !== "") {
              this.$message.success(
                  "杩滅▼閰嶇疆涓婁紶鎴愬姛锛岄厤缃摼鎺ュ凡澶嶅埗鍒板壀璐存澘"
              );
              this.form.remoteConfig = res.data.data;
              this.$copyText(this.form.remoteConfig);
              this.dialogUploadConfigVisible = false;
            } else {
              this.$message.error("杩滅▼閰嶇疆涓婁紶澶辫触: " + res.data.msg);
            }
          })
          .catch(() => {
            this.$message.error("杩滅▼閰嶇疆涓婁紶澶辫触");
          })
          .finally(() => {
            this.loading2 = false;
          });
    },
    analyzeUrl() {
      if (this.loadConfig.indexOf("target") !== -1) {
        return this.loadConfig;
      } else {
        this.loading3 = true;
        return (async () => {
          try {
            let response = await fetch(this.loadConfig, {
              method: "GET",
              redirect: "follow",
            });
            return response.url;
          } catch (e) {
            this.$message.error("瑙ｆ瀽鐭摼鎺ュけ璐ワ紝璇锋鏌ョ煭閾炬帴鏈嶅姟绔槸鍚﹂厤缃法鍩燂細" + e)
          } finally {
            this.loading3 = false;
          }
        })();
      }
    },
    confirmLoadConfig() {
      if (this.loadConfig.trim() === "" || !this.loadConfig.trim().includes("http")) {
        this.$message.error("寰呰В鏋愮殑璁㈤槄閾炬帴涓嶅悎娉?);
        return false;
      }
      (async () => {
        let url
        try {
          url = new URL(await this.analyzeUrl())
        } catch (error) {
          this.$message.error("璇疯緭鍏ユ纭殑璁㈤槄鍦板潃!");
          return;
        }
        this.form.customBackend = url.origin
        let param = new URLSearchParams(url.search);
        if (param.get("target")) {
          let target = param.get("target");
          if (target === 'surge' && param.get("ver")) {
            // 绫诲瀷涓簊urge,鏈塿er
            this.form.clientType = target + "&ver=" + param.get("ver");
          } else if (target === 'surge') {
            //绫诲瀷涓簊urge,娌℃湁ver
            this.form.clientType = target + "&ver=4"
          } else {
            //绫诲瀷涓哄叾浠?
            this.form.clientType = target;
          }
        }
        if (param.get("url")) {
          this.form.sourceSubUrl = param.get("url");
        }
        if (param.get("insert")) {
          this.form.insert = param.get("insert") === 'true';
        }
        if (param.get("config")) {
          this.form.remoteConfig = param.get("config");
        }
        if (param.get("exclude")) {
          this.form.excludeRemarks = param.get("exclude");
        }
        if (param.get("include")) {
          this.form.includeRemarks = param.get("include");
        }
        if (param.get("filename")) {
          this.form.filename = param.get("filename");
        }
        if (param.get("rename")) {
          this.form.rename = param.get("rename");
        }
        if (param.get("interval")) {
          this.form.interval = Math.ceil(param.get("interval") / 86400);
        }
        if (param.get("dev_id")) {
          this.form.devid = param.get("dev_id");
        }
        if (param.get("append_type")) {
          this.form.appendType = param.get("append_type") === 'true';
        }
        if (param.get("tls13")) {
          this.form.tls13 = param.get("tls13");
        }
        if (param.get("xudp")) {
          this.form.xudp = param.get("xudp") === 'true';
        }
        if (param.get("sort")) {
          this.form.sort = param.get("sort") === 'true';
        }
        if (param.get("emoji")) {
          this.form.emoji = param.get("emoji") === 'true';
        }
        if (param.get("list")) {
          this.form.nodeList = param.get("list") === 'true';
        }
        if (param.get("udp")) {
          this.form.udp = param.get("udp") === 'true';
        }
        if (param.get("tfo")) {
          this.form.tfo = param.get("tfo") === 'true';
        }
        if (param.get("expand")) {
          this.form.expand = param.get("expand") === 'true';
        }
        if (param.get("scv")) {
          this.form.scv = param.get("scv") === 'true';
        }
        if (param.get("fdn")) {
          this.form.fdn = param.get("fdn") === 'true';
        }
        if (param.get("surge.doh")) {
          this.form.tpl.surge.doh = param.get("surge.doh") === 'true';
        }
        if (param.get("clash.doh")) {
          this.form.tpl.clash.doh = param.get("clash.doh") === 'true';
        }
        if (param.get("new_name")) {
          this.form.new_name = param.get("new_name") === 'true';
        }
        if (param.get("singbox.ipv6")) {
          this.form.tpl.singbox.ipv6 = param.get("singbox.ipv6") === '1';
        }
        this.dialogLoadConfigVisible = false;
        this.$message.success("闀?鐭摼鎺ュ凡鎴愬姛瑙ｆ瀽涓鸿闃呬俊鎭?);
      })();
    },
    renderPost() {
      let data = new FormData();
      data.append("target", encodeURIComponent(this.form.clientType));
      data.append("url", encodeURIComponent(this.form.sourceSubUrl));
      data.append("config", encodeURIComponent(this.form.remoteConfig));
      data.append("exclude", encodeURIComponent(this.form.excludeRemarks));
      data.append("include", encodeURIComponent(this.form.includeRemarks));
      data.append("rename", encodeURIComponent(this.form.rename));
      data.append("tls13", encodeURIComponent(this.form.tls13.toString()));
      data.append("xudp", encodeURIComponent(this.form.xudp.toString()));
      data.append("emoji", encodeURIComponent(this.form.emoji.toString()));
      data.append("list", encodeURIComponent(this.form.nodeList.toString()));
      data.append("udp", encodeURIComponent(this.form.udp.toString()));
      data.append("tfo", encodeURIComponent(this.form.tfo.toString()));
      data.append("expand", encodeURIComponent(this.form.expand.toString()));
      data.append("scv", encodeURIComponent(this.form.scv.toString()));
      data.append("fdn", encodeURIComponent(this.form.fdn.toString()));
      data.append("sdoh", encodeURIComponent(this.form.tpl.surge.doh.toString()));
      data.append("cdoh", encodeURIComponent(this.form.tpl.clash.doh.toString()));
      data.append("newname", encodeURIComponent(this.form.new_name.toString()));
      return data;
    },
    confirmUploadScript() {
      if (this.form.sourceSubUrl.trim() === "") {
        this.$message.error("璁㈤槄閾炬帴涓嶈兘涓虹┖");
        return false;
      }
      this.loading2 = true;
      let data = this.renderPost();
      data.append("sortscript", encodeURIComponent(this.uploadScript));
      data.append("filterscript", encodeURIComponent(this.uploadFilter));
      this.$axios
          .post(configScriptBackend, data, {
            header: {
              "Content-Type": "application/form-data; charset=utf-8"
            }
          })
          .then(res => {
            if (res.data.code === 0 && res.data.data !== "") {
              this.$message.success(
                  "鑷畾涔塉S涓婁紶鎴愬姛锛岃闃呴摼鎺ュ凡澶嶅埗鍒板壀璐存澘锛圛OS璁惧鍜孲afari娴忚鍣ㄤ笉鏀寔鑷姩澶嶅埗API锛岄渶鎵嬪姩鐐瑰嚮澶嶅埗鎸夐挳锛?
              );
              this.customSubUrl = res.data.data;
              this.$copyText(res.data.data);
              this.dialogUploadConfigVisible = false;
              this.btnBoolean = true;
            } else {
              this.$message.error("鑷畾涔塉S涓婁紶澶辫触: " + res.data.msg);
            }
          })
          .catch(() => {
            this.$message.error("鑷畾涔塉S涓婁紶澶辫触");
          })
          .finally(() => {
            this.loading2 = false;
          })
    },
    getBackendVersion() {
      this.$axios
          .get(
              this.form.customBackend + "/version"
          )
          .then(res => {
            this.backendVersion = res.data.replace(/backend\n$/gm, "");
            this.backendVersion = this.backendVersion.replace("subconverter", "SubConverter");
            let a = this.form.customBackend.indexOf("url.v1.mk") !== -1 || this.form.customBackend.indexOf("sub.d1.mk") !== -1;
            let b = this.form.customBackend.indexOf("127.0.0.1") !== -1;
            a ? this.$message.success(`${this.backendVersion}` + "娆㈣繋鍔犲叆TG棰戦亾@CitizenScyu锛岄澶栨敮鎸乿less reality+hysteria+hysteria2璁㈤槄杞崲") : b ? this.$message.success(`${this.backendVersion}` + "鏈湴灞€鍩熺綉鑷缓鐗堝悗绔?) : this.$message.success(`${this.backendVersion}` + "瀹樻柟鍘熺増鍚庣涓嶆敮鎸乿less/hysteria璁㈤槄杞崲");
          })
          .catch(() => {
            this.$message.error("娆㈣繋鍔犲叆TG棰戦亾@CitizenScyu");
          });
    }
  }
};
</script>
