(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=document.getElementById(`app`);if(!e)throw Error(`App root was not found.`);e.innerHTML=`
  <div id="route-outlet"></div>
`;var t=`
  <main class="app game-page">
    <section class="shell" aria-label="Stuffed animal control room">
      <div class="panel">
        <canvas id="stage" width="960" height="640" aria-label="Playable rectangle for the squirrel sprite"></canvas>
        <div id="game-timer" class="game-timer" aria-live="off">0s</div>
        <div id="polygon-layer" class="polygon-layer" aria-hidden="true"></div>
        <div id="editor-controls" class="editor-controls" aria-label="Collision editor controls"></div>
        <div id="editor-status" class="editor-status" aria-live="polite"></div>
      </div>
    </section>
  </main>
`,n=new URL(`/assets/ChatGPT%20Image%20May%2022_%202026%20at%2007_02_43%20PM-CULcfpaL.jpg`,``+import.meta.url).href,r=document.createElement(`style`);r.textContent=`
  :root {
    color-scheme: dark;
    --bg-0: #110f0b;
    --bg-1: #24180f;
    --panel-border: rgba(255, 235, 214, 0.22);
    --text: #fff5e8;
    --muted: rgba(255, 245, 232, 0.72);
    --accent: #ffb77c;
    --accent-strong: #ffd7b0;
  }

  * {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    min-height: 100%;
  }

  body {
    font-family:
      ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      sans-serif;
    color: var(--text);
    background:
      radial-gradient(circle at top, rgba(255, 180, 120, 0.18), transparent 34%),
      radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.08), transparent 20%),
      linear-gradient(180deg, var(--bg-1), var(--bg-0));
  }

  .app {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 24px;
  }

  .text-page {
    width: min(840px, 100%);
    align-content: center;
  }

  .text-page .shell {
    gap: 22px;
  }

  .page-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .button-link {
    display: inline-flex;
    min-height: 42px;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.1);
    color: var(--text);
    font-weight: 700;
    text-decoration: none;
  }

  .home-page {
    min-height: 100vh;
    display: grid;
    place-items: center;
    overflow: hidden;
    padding: 0;
    background: #8cc3ac;
  }

  .home-art {
    position: relative;
    width: min(100vw, calc(100vh * 0.75));
    height: min(100vh, calc(100vw / 0.75));
    background-image: url("${n}");
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
  }

  .home-start-hit {
    position: absolute;
    left: 23.5%;
    top: 61.5%;
    width: 53.5%;
    height: 16.6%;
    border-radius: 22px;
    color: transparent;
    text-indent: -999px;
    overflow: hidden;
  }

  .home-start-hit:focus-visible {
    outline: 4px solid rgba(255, 245, 232, 0.95);
    outline-offset: 4px;
  }

  .game-page {
    overflow: hidden;
    padding: 0;
  }

  .game-page .shell {
    width: auto;
    gap: 0;
  }

  .shell {
    width: min(1100px, 100%);
    display: grid;
    gap: 18px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: end;
    padding: 4px 2px;
  }

  .eyebrow {
    margin: 0 0 6px;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--accent-strong);
  }

  h1 {
    margin: 0;
    font-size: clamp(1.8rem, 4vw, 3.6rem);
    line-height: 0.95;
    letter-spacing: -0.04em;
  }

  .copy {
    max-width: 38rem;
    margin: 0;
    color: var(--muted);
    line-height: 1.5;
    text-align: right;
  }

  .panel {
    position: relative;
    padding: 0;
    border-radius: 0;
    background: transparent;
    border: 0;
    box-shadow: none;
    overflow: hidden;
  }

  .panel::before {
    content: none;
  }

  canvas {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 0;
    background: transparent;
  }

  .game-timer {
    position: absolute;
    top: 0;
    left: 0;
    min-width: 58px;
    padding: 7px 10px;
    background: #120d08;
    border: 1px solid rgba(255, 231, 196, 0.45);
    color: #fff5e8;
    font-size: 18px;
    font-weight: 900;
    line-height: 1;
    text-align: center;
    z-index: 5;
  }

  .polygon-layer {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 2;
  }

  .editor-controls {
    position: absolute;
    right: 8px;
    bottom: 8px;
    display: none;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    z-index: 4;
    pointer-events: none;
  }

.editor-status {
    position: absolute;
    right: 16px;
    bottom: 92px;
    max-width: min(340px, calc(100% - 32px));
    padding: 10px 12px;
    border-radius: 14px;
    background: rgba(16, 13, 10, 0.78);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: rgba(255, 245, 232, 0.9);
    font-size: 0.92rem;
    line-height: 1.35;
    backdrop-filter: blur(10px);
    z-index: 4;
    cursor: pointer;
    pointer-events: auto;
  }

  .editor-status[hidden] {
    display: none;
  }

  .editor-controls button,
  .polygon-delete {
    appearance: none;
    border: 0;
    border-radius: 999px;
    font: inherit;
    cursor: pointer;
    transition: transform 120ms ease, background 120ms ease, color 120ms ease, opacity 120ms ease;
  }

  .editor-controls button {
    min-width: 36px;
    min-height: 36px;
    padding: 0;
    background: rgba(18, 14, 11, 0.52);
    color: var(--text);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.16);
    font-size: 1.05rem;
    letter-spacing: 0.01em;
    opacity: 0.68;
  }

  .editor-controls button[data-action="pause-toggle"] {
    display: grid;
    place-items: center;
    font-size: 1.1rem;
    opacity: 0.86;
  }

  .editor-controls button:hover,
  .polygon-delete:hover {
    transform: translateY(-1px);
  }

  .editor-controls button[data-tone="green"] {
    color: #a6ffb8;
  }

  .editor-controls button[data-tone="red"] {
    color: #ffb0a6;
  }

  .editor-controls button[data-tone="neutral"] {
    color: var(--accent-strong);
  }

  .polygon-delete {
    position: absolute;
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    pointer-events: auto;
    background: rgba(14, 12, 10, 0.9);
    color: #fff3eb;
    border: 1px solid rgba(255, 255, 255, 0.14);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.26);
    transform: translate(-50%, -50%);
  }

  .polygon-delete[data-kind="green"] {
    color: #a6ffb8;
  }

  .polygon-delete[data-kind="red"] {
    color: #ffb0a6;
  }

  .editor-controls button[data-tone="blue"],
  .polygon-delete[data-kind="teleport"] {
    color: #8addff;
  }

  @media (max-width: 700px) {
    .header {
      flex-direction: column;
      align-items: start;
    }

    .copy {
      text-align: left;
      max-width: none;
    }

    .panel {
      padding: 0;
    }
  }
`,document.head.appendChild(r);var i=document.getElementById(`route-outlet`);if(!i)throw Error(`Route outlet was not found.`);var a={"/":s,"/play":f,"/about":c},o=null;function s(){return i.innerHTML=`
    <main class="home-page" aria-label="Acornquest home">
      <section class="home-art" aria-label="Acornquest title screen">
        <a class="home-start-hit" href="/play" data-route aria-label="Start game">Start</a>
      </section>
    </main>
  `,()=>{}}function c(){return i.innerHTML=`
    <main class="app text-page">
      <section class="shell" aria-label="About Acornquest">
        <header class="header">
          <div>
            <p class="eyebrow">About</p>
            <h1>Stuffed animal control room</h1>
          </div>
          <p class="copy">
            This page is routed separately from the playable canvas so page changes can mount and unmount game controls.
          </p>
        </header>
        <div class="page-actions">
          <a class="button-link" href="/play" data-route>Play</a>
        </div>
      </section>
    </main>
  `,()=>{}}function l(){return a[window.location.pathname]?window.location.pathname:`/`}function u(){o&&=(o(),null),o=a[l()]()}function d(e){if(window.location.pathname===e){u();return}window.history.pushState({},``,e),u()}document.addEventListener(`click`,e=>{let t=e.target;if(!(t instanceof Element))return;let n=t.closest(`[data-route]`);!(n instanceof HTMLAnchorElement)||n.origin!==window.location.origin||(e.preventDefault(),d(n.pathname))}),window.addEventListener(`popstate`,u);function f(){i.innerHTML=t;let e=document.getElementById(`stage`);if(!(e instanceof HTMLCanvasElement))throw Error(`Canvas element #stage was not found.`);let n=e.getContext(`2d`);if(!n)throw Error(`Canvas support is required.`);let r=document.getElementById(`game-timer`),a={width:960,height:640},o={x:48,y:48,width:864,height:544},s={size:138,columns:4,rows:4,frameMs:120,speed:220,idleColumn:1,hitboxInsetX:18,facingRows:{up:1,down:0,right:2,left:3},minScale:.5,maxScale:1.12},c={columns:4,rows:4,frameMs:180,durationMs:720,facingRows:{up:1,down:1,right:2,left:0}},l={size:38,reach:42,standingReach:24,caveChance:.5,pathEndChance:.65,edgeChance:.39,minDistanceFromPrevious:220,crop:{x:24,y:192,width:92,height:100},regions:[{x:338,y:360,width:128,height:96},{x:584,y:350,width:118,height:98},{x:704,y:368,width:104,height:104},{x:330,y:440,width:150,height:106},{x:606,y:412,width:128,height:122},{x:724,y:470,width:126,height:78},{x:552,y:520,width:148,height:52},{x:246,y:506,width:112,height:58}],edgeRegions:[{x:340,y:318,width:82,height:0},{x:586,y:318,width:104,height:0},{x:704,y:326,width:76,height:0},{x:334,y:318,width:88,height:94},{x:574,y:318,width:138,height:88},{x:704,y:326,width:96,height:90}],pathEndRegions:[{x:610,y:222,width:128,height:88},{x:650,y:258,width:116,height:72}],fallbackSpot:{x:712,y:506},caveRegions:[{x:336,y:474,width:142,height:96},{x:484,y:398,width:132,height:92},{x:626,y:438,width:112,height:92},{x:698,y:508,width:132,height:70},{x:184,y:348,width:136,height:70}],caveEdgeRegions:[{x:188,y:318,width:118,height:46},{x:462,y:358,width:124,height:54},{x:668,y:408,width:112,height:52}],cavePathEndRegions:[{x:610,y:188,width:120,height:82},{x:698,y:220,width:118,height:78}],caveFallbackSpot:{x:548,y:470}},u={forest:`forest`,cave:`cave`},d=.55,f={x:o.x+220,y:o.y+o.height-s.size-24},p={x:138,y:o.y+o.height-s.size-16},m={x:640,y:196},h={forest:[{id:`forest-to-cave`,points:[{x:.581,y:.085},{x:.813,y:.085},{x:.813,y:.511},{x:.581,y:.511}]}],cave:[{id:`cave-to-forest`,points:[{x:.696,y:.085},{x:.854,y:.085},{x:.854,y:.433},{x:.696,y:.433}]}]},g={key:`acornquest.yyCollisionConfig`,fileName:`yy-collision-config.json`},_=new Set,ee=new Image;ee.src=new URL(`/assets/ChatGPT%20Image%20May%2023_%202026%20at%2002_24_32%20PM-Cw5S8k9b.jpg`,``+import.meta.url).href;let te=new Image;te.src=new URL(`/assets/ChatGPT%20Image%20May%2027_%202026%20at%2004_58_18%20PM-aI9zV1lK.jpg`,``+import.meta.url).href;let v=document.createElement(`canvas`),ne=v.getContext(`2d`,{willReadFrequently:!0}),y=new Image;y.onload=()=>{ae(),S.loaded=!0},y.onerror=()=>{S.loaded=!1},y.src=new URL(`/assets/ChatGPT%20Image%20May%2022_%202026%20at%2007_04_38%20PM-CPwC0xSj.jpg`,``+import.meta.url).href;let b=document.createElement(`canvas`),re=b.getContext(`2d`,{willReadFrequently:!0}),x=new Image;x.onload=()=>{O(x,b,re),S.pickupLoaded=!0},x.onerror=()=>{S.pickupLoaded=!1},x.src=new URL(`/assets/ChatGPT%20Image%20May%2022_%202026%20at%2007_03_51%20PM-D4AxB5oc.jpg`,``+import.meta.url).href;let S={x:f.x,y:f.y,facing:`up`,moving:!1,frame:0,frameTimer:0,falling:!1,fallTimer:0,fallScale:1,fallVelocityX:0,fallVelocityY:0,loaded:!1,pickupLoaded:!1,pickingUp:!1,pickupTimer:0,acornVisible:!0,acornScene:u.forest,acornSpot:{...l.fallbackSpot},scene:u.forest,sceneTransition:null,transitionCooldown:0,won:!1,elapsedSeconds:0,winSeconds:0,winScene:u.forest,paused:!1};y.complete&&y.naturalWidth>0&&(ae(),S.loaded=!0),x.complete&&x.naturalWidth>0&&(O(x,b,re),S.pickupLoaded=!0);let ie={greenPolygons:[{id:`left-tree`,points:[{x:0,y:0},{x:.07,y:0},{x:.088,y:.19},{x:.082,y:.43},{x:.057,y:.62},{x:0,y:.64}]},{id:`center-tree`,points:[{x:.472,y:.2},{x:.552,y:.2},{x:.575,y:.425},{x:.578,y:.565},{x:.548,y:.585},{x:.47,y:.485}]},{id:`mushroom`,points:[{x:.805,y:.255},{x:.85,y:.195},{x:.918,y:.205},{x:.94,y:.3},{x:.925,y:.43},{x:.882,y:.455},{x:.822,y:.435},{x:.8,y:.33}]},{id:`right-tree`,points:[{x:.955,y:0},{x:1,y:0},{x:1,y:.64},{x:.968,y:.62},{x:.955,y:.38}]}],redPolygons:[{id:`left-chasm`,points:[{x:0,y:.16},{x:.072,y:.156},{x:.118,y:.205},{x:.154,y:.305},{x:.176,y:.47},{x:.188,y:.685},{x:.19,y:1},{x:0,y:1}]}]},C=ce({greenPolygons:[{id:`cave-left-wall`,points:[{x:0,y:0},{x:.165,y:0},{x:.155,y:.51},{x:0,y:.52}]},{id:`cave-center-pillar`,points:[{x:.335,y:0},{x:.515,y:0},{x:.505,y:.515},{x:.43,y:.56},{x:.36,y:.48}]},{id:`cave-right-wall`,points:[{x:.925,y:0},{x:1,y:0},{x:1,y:1},{x:.935,y:.96},{x:.91,y:.57}]}],redPolygons:[{id:`cave-left-gap`,points:[{x:.18,y:.37},{x:.315,y:.34},{x:.39,y:.565},{x:.27,y:.67},{x:.145,y:.57}]},{id:`cave-center-gap`,points:[{x:.445,y:.48},{x:.58,y:.43},{x:.645,y:.72},{x:.515,y:.91},{x:.38,y:.73}]},{id:`cave-right-gap`,points:[{x:.66,y:.34},{x:.82,y:.3},{x:.875,y:.5},{x:.765,y:.61},{x:.64,y:.51}]}]}),w=A(ie),T=A(C),E=j(h),D=null;ee.onload=()=>{S.won||W()};function ae(){O(y,v,ne)}function O(e,t,n){if(!n||e.naturalWidth===0||e.naturalHeight===0)return;t.width=e.naturalWidth,t.height=e.naturalHeight,n.clearRect(0,0,t.width,t.height),n.drawImage(e,0,0);let r=n.getImageData(0,0,t.width,t.height),{data:i}=r;for(let e=0;e<i.length;e+=4)i[e]>245&&i[e+1]>245&&i[e+2]>245&&(i[e+3]=0);n.putImageData(r,0,0)}function oe(e=`poly`){return typeof crypto<`u`&&typeof crypto.randomUUID==`function`?`${e}-${crypto.randomUUID()}`:`${e}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}function se(e){return{x:P(Number(e?.x)||0,0,1),y:P(Number(e?.y)||0,0,1)}}function k(e,t){let n=Array.isArray(e)?e:Array.isArray(e?.points)?e.points:null;return!n||n.length<3?null:{id:typeof e==`object`&&e&&typeof e.id==`string`?e.id:oe(t),points:n.map(se)}}function ce(e){return{greenPolygons:Array.isArray(e?.greenPolygons)?e.greenPolygons.map(e=>k(e,`green`)).filter(Boolean):[],redPolygons:Array.isArray(e?.redPolygons)?e.redPolygons.map(e=>k(e,`red`)).filter(Boolean):[]}}function le(e){return{forest:Array.isArray(e?.forest)?e.forest.map(e=>k(e,`teleport`)).filter(Boolean):[],cave:Array.isArray(e?.cave)?e.cave.map(e=>k(e,`teleport`)).filter(Boolean):[]}}function A(e){return ce(e)}function j(e){return le(e)}function M(e){return e?.version>=2||e?.forestCollision||e?.caveCollision||e?.teleport?{forestCollision:A(e?.forestCollision||ie),caveCollision:A(e?.caveCollision||C),teleport:j(e?.teleport||h)}:{forestCollision:A(e||ie),caveCollision:A(C),teleport:j(h)}}function ue(e){return JSON.stringify({version:3,owner:`user`,updatedAt:new Date().toISOString(),forestCollision:{greenPolygons:e.forestCollision.greenPolygons.map(e=>({id:e.id,points:e.points.map(e=>({x:e.x,y:e.y}))})),redPolygons:e.forestCollision.redPolygons.map(e=>({id:e.id,points:e.points.map(e=>({x:e.x,y:e.y}))}))},caveCollision:{greenPolygons:e.caveCollision.greenPolygons.map(e=>({id:e.id,points:e.points.map(e=>({x:e.x,y:e.y}))})),redPolygons:e.caveCollision.redPolygons.map(e=>({id:e.id,points:e.points.map(e=>({x:e.x,y:e.y}))}))},teleport:{forest:e.teleport.forest.map(e=>({id:e.id,points:e.points.map(e=>({x:e.x,y:e.y}))})),cave:e.teleport.cave.map(e=>({id:e.id,points:e.points.map(e=>({x:e.x,y:e.y}))}))}},null,2)}function N(e){return e===`teleport`?`teleport boundaries`:e===`green`?`green boundaries`:`red boundaries`}function P(e,t,n){return Math.min(n,Math.max(t,e))}function F(e,t){return Math.hypot(e.x-t.x,e.y-t.y)}function de(e=S.scene){return e===u.cave?te:ee}function I(e=S.scene){return e===u.cave?T:w}function L(e){let t=o.y,n=o.y+o.height-s.size,r=P((e-t)/(n-t||1),0,1)**1.45;return s.minScale+(s.maxScale-s.minScale)*r}function fe(){return S.falling?S.fallScale:L(S.y)}function pe(e){let t=L(e),n=s.size*t,r=(s.size-n)/2,i=s.size-n;return{minX:o.x-r,maxX:o.x+o.width-n-r,minY:o.y-i,maxY:o.y+o.height-s.size}}function R(e,t){let n=pe(t),r=P(t,n.minY,n.maxY),i=pe(r);return{x:P(e,i.minX,i.maxX),y:r}}function z(e=S.scene){let t=de(e);if(!t.complete||t.naturalWidth===0||t.naturalHeight===0)return null;let n=t.naturalWidth/t.naturalHeight;if(n>a.width/a.height){let e=a.height,t=Math.ceil(e*n);return{x:Math.floor((a.width-t)/2),y:0,width:t,height:e}}let r=a.width,i=Math.ceil(r/n);return{x:0,y:Math.floor((a.height-i)/2),width:r,height:i}}function me(e){let t=z();return t?{x:P((e.x-t.x)/(t.width||1),0,1),y:P((e.y-t.y)/(t.height||1),0,1)}:{x:0,y:0}}function B(e,t){return t.map(t=>({x:e.x+e.width*t.x,y:e.y+e.height*t.y}))}function he(e=S.scene){let t=z(e);return t?I(e).greenPolygons.map(e=>B(t,e.points)):[]}function ge(e=S.scene){let t=z(e);return t?I(e).redPolygons.map(e=>B(t,e.points)):[]}function _e(e=S.scene){let t=z(e);return t?(e===u.cave?E.cave:E.forest).map(e=>B(t,e.points)):[]}function V(e,t,n=1){let r=s.size*n,i=r*.2,a=r*.1,o=e+(s.size-i)/2;return{left:o,top:t+s.size-a,right:o+i,bottom:t+s.size}}function ve(){let e=L(S.y),t=V(S.x,S.y,e);return{x:(t.left+t.right)/2,y:t.bottom}}function H(e,t){let n=V(e,t,L(t));return{x:(n.left+n.right)/2,y:n.bottom}}function ye(){let e=ve();return S.facing===`left`?{x:e.x-l.reach*.75,y:e.y-10}:S.facing===`right`?{x:e.x+l.reach*.75,y:e.y-10}:S.facing===`up`?{x:e.x,y:e.y-l.reach*.75}:{x:e.x,y:e.y+l.reach*.25}}function be(e){return R(e.x-s.size/2,e.y-s.size)}function xe(){return S.acornSpot}function Se(){if(S.scene!==S.acornScene||!S.acornVisible||S.won)return!1;let e=ve(),t=ye(),n=xe();return F(e,n)<=l.standingReach||F(t,n)<=l.reach}function Ce(e,t=S.scene){let n=be(e);return F(H(n.x,n.y),e)>l.reach*.7?!1:!Fe(n.x,n.y,t)&&!Ie(n.x,n.y,t)}function we(e){return{x:e.x+Math.random()*e.width,y:e.y+Math.random()*e.height}}function U(e,t=S.acornSpot,n=120,r=S.scene){let i=[...e].sort(()=>Math.random()-.5),a=null,o=-1;for(let e=0;e<n;e+=1){let n=i[e%i.length],s=we(n);if(!Ce(s,r))continue;let c=t?F(s,t):1/0;if(c>o&&(a=s,o=c),c>=l.minDistanceFromPrevious)return s}return a}function Te(e,t=S.acornSpot){let n=e===u.cave?l.caveRegions:l.regions,r=e===u.cave?l.caveEdgeRegions:l.edgeRegions,i=e===u.cave?l.cavePathEndRegions:l.pathEndRegions,a=e===u.cave?l.caveFallbackSpot:l.fallbackSpot;if(Math.random()<l.pathEndChance){let n=U(i,t,140,e);if(n)return n}if(Math.random()<l.edgeChance){let n=U(r,t,80,e);if(n)return n}return U(n,t,120,e)||a}function W(){let e=Math.random()<l.caveChance?u.cave:u.forest,t=S.acornScene===e?S.acornSpot:null;S.acornScene=e,S.acornSpot=Te(e,t),S.acornVisible=S.scene===S.acornScene&&!S.won}function Ee(e=S.scene){return e===u.cave?p:f}function De(e,t=S.facing){let n=R(e.x,e.y);S.x=n.x,S.y=n.y,S.facing=t,S.moving=!1,S.frameTimer=0}function Oe(){if(!S.sceneTransition||S.sceneTransition.swapped)return;let{to:e,position:t,facing:n}=S.sceneTransition;S.scene=e,S.falling=!1,S.fallTimer=0,S.fallScale=1,S.fallVelocityX=0,S.fallVelocityY=0,S.pickingUp=!1,S.pickupTimer=0,S.acornVisible=e===S.acornScene&&!S.won,De(t,n),S.sceneTransition.swapped=!0,Z()}function ke(e,t,n){S.sceneTransition||(S.sceneTransition={from:S.scene,to:e,position:t,facing:n,timer:0,swapped:!1},S.transitionCooldown=1,S.moving=!1,S.frameTimer=0,_.clear())}function Ae(e){return S.sceneTransition?(S.sceneTransition.timer+=e,S.sceneTransition.timer>=d/2&&Oe(),S.sceneTransition.timer>=d&&(Oe(),S.sceneTransition=null),S.moving=!1,S.frameTimer=0,!0):!1}function je(e,t,n){let r=H(e,t),i=V(e,t,L(t)),a={left:i.left-32,top:i.top-32,right:i.right+32,bottom:i.bottom+32};return Me(r,n)||Pe(n,a)}function G(e=S.x,t=S.y){return S.transitionCooldown>0||S.sceneTransition||S.falling||S.pickingUp||S.won?!1:S.scene===u.forest&&_e(u.forest).some(n=>je(e,t,n))?(ke(u.cave,p,`up`),!0):S.scene===u.cave&&_e(u.cave).some(n=>je(e,t,n))?(ke(u.forest,m,`down`),!0):!1}function Me(e,t){let n=!1;for(let r=0,i=t.length-1;r<t.length;i=r++){let a=t[r].x,o=t[r].y,s=t[i].x,c=t[i].y;o>e.y!=c>e.y&&e.x<(s-a)*(e.y-o)/(c-o||1)+a&&(n=!n)}return n}function K(e,t,n){let r=(t.y-e.y)*(n.x-t.x)-(t.x-e.x)*(n.y-t.y);return Math.abs(r)<1e-9?0:r>0?1:2}function q(e,t,n){return Math.min(e.x,n.x)<=t.x&&t.x<=Math.max(e.x,n.x)&&Math.min(e.y,n.y)<=t.y&&t.y<=Math.max(e.y,n.y)}function Ne(e,t,n,r){let i=K(e,t,n),a=K(e,t,r),o=K(n,r,e),s=K(n,r,t);return!!(i!==a&&o!==s||i===0&&q(e,n,t)||a===0&&q(e,r,t)||o===0&&q(n,e,r)||s===0&&q(n,t,r))}function Pe(e,t){let n=[{x:t.left,y:t.top},{x:t.right,y:t.top},{x:t.right,y:t.bottom},{x:t.left,y:t.bottom}];if(n.some(t=>Me(t,e))||e.some(e=>e.x>=t.left&&e.x<=t.right&&e.y>=t.top&&e.y<=t.bottom))return!0;let r=e.map((t,n)=>[t,e[(n+1)%e.length]]),i=[[n[0],n[1]],[n[1],n[2]],[n[2],n[3]],[n[3],n[0]]];return r.some(([e,t])=>i.some(([n,r])=>Ne(e,t,n,r)))}function Fe(e,t,n=S.scene){let r=V(e,t,L(t));return he(n).some(e=>Pe(e,r))}function Ie(e,t,n=S.scene){let r=H(e,t);return ge(n).some(e=>Me(r,e))}function Le(){let e=Ee();S.x=e.x,S.y=e.y,S.facing=`up`,S.moving=!1,S.frame=0,S.frameTimer=0,S.falling=!1,S.fallTimer=0,S.fallScale=1,S.fallVelocityX=0,S.fallVelocityY=0,S.pickingUp=!1,S.pickupTimer=0,S.sceneTransition=null,S.transitionCooldown=.45}function J(){r&&(r.textContent=`${Math.floor(S.elapsedSeconds)}s`)}function Y(){return S.paused?`Resume game`:`Pause game`}function Re(){return S.paused?`▶`:`⏸`}function ze(){let e=document.querySelector(`[data-action="pause-toggle"]`);e instanceof HTMLButtonElement&&(e.textContent=Re(),e.title=Y(),e.setAttribute(`aria-label`,Y()),e.setAttribute(`aria-pressed`,String(S.paused)))}function Be(){S.won||D||(S.paused=!S.paused,S.moving=!1,S.frameTimer=0,_.clear(),ze())}function Ve(){S.falling||S.pickingUp||S.won||(S.falling=!0,S.fallTimer=0,S.fallScale=L(S.y),S.moving=!1,S.frameTimer=0,S.fallVelocityX=-18,S.fallVelocityY=180)}function He(){S.pickingUp||S.falling||!Se()||(_.clear(),S.pickingUp=!0,S.pickupTimer=0,S.acornVisible=!1,S.moving=!1,S.frame=0,S.frameTimer=0)}function Ue(){S.pickingUp=!1,S.pickupTimer=0,S.won=!0,S.winSeconds=Math.floor(S.elapsedSeconds),S.winScene=S.scene,S.moving=!1,_.clear(),J()}function We(){if(!S.won)return;let e=$e(),t=S.winScene;S.won=!1,S.scene=t,S.sceneTransition=null,S.elapsedSeconds=0,S.winSeconds=0,S.paused=!1,Le(),w=A(e.forestCollision),T=A(e.caveCollision),E=j(e.teleport),W(),_.clear(),J(),Z(),ze()}function X(e){let t=document.getElementById(`editor-status`);t&&(t.textContent=e,t.hidden=!e)}function Z(){let e=document.getElementById(`editor-controls`);if(e){if(!D){let t=S.scene===u.cave?`cave`:`forest`;e.innerHTML=`
      <button type="button" data-tone="neutral" data-action="pause-toggle" aria-label="${Y()}" aria-pressed="${S.paused}" title="${Y()}">${Re()}</button>
      <button type="button" data-tone="green" data-action="mode" data-mode="green" aria-label="Edit green ${t} boundaries" title="Edit green ${t} boundaries">G</button>
      <button type="button" data-tone="red" data-action="mode" data-mode="red" aria-label="Edit red ${t} boundaries" title="Edit red ${t} boundaries">R</button>
      <button type="button" data-tone="blue" data-action="mode" data-mode="teleport" aria-label="Edit ${t} teleport boundaries" title="Edit ${t} teleport boundaries">T</button>
    `;return}e.innerHTML=`
    <button type="button" data-tone="neutral" data-action="save">Save</button>
    <button type="button" data-tone="neutral" data-action="cancel">Cancel</button>
  `}}function Ge(t){let n=e.getBoundingClientRect();return n.width===0||n.height===0?null:{x:(t.clientX-n.left)/n.width*a.width,y:(t.clientY-n.top)/n.height*a.height}}function Ke(t){let n=e.getBoundingClientRect();return n.width===0||n.height===0?null:{x:t.x/a.width*n.width,y:t.y/a.height*n.height}}function qe(e,t){return e.length<3?null:{id:oe(t),points:e.map(se)}}function Je(e){_.clear(),D={mode:e,scene:S.scene,draftConfig:A(I()),draftTeleportConfig:j(E),draftPoints:[]},Z(),X(`Editing ${S.scene} ${N(e)}. Click points to draw a polygon, click near the first point to close it, and use Save or Cancel when you are done.`),$()}function Ye(){_.clear(),D=null,Z(),X(``),$()}function Xe(e=!1){if(!D||D.draftPoints.length<3)return D.draftPoints=[],!1;if(!e&&D.draftPoints.length>=3){let e=D.draftPoints[0],t=D.draftPoints[D.draftPoints.length-1];if(F(e,t)>18)return!1}let t=qe(D.draftPoints,D.mode);if(!t)return D.draftPoints=[],!1;if(D.mode===`teleport`){let e=D.scene===u.cave?`cave`:`forest`;D.draftTeleportConfig[e]=[...D.draftTeleportConfig[e],t]}else{let e=D.mode===`red`?`redPolygons`:`greenPolygons`;D.draftConfig[e]=[...D.draftConfig[e],t]}return D.draftPoints=[],!0}function Ze(e){if(D){if(D.mode===`teleport`){let t=D.scene===u.cave?`cave`:`forest`;D.draftTeleportConfig[t]=D.draftTeleportConfig[t].filter(t=>t.id!==e)}else{let t=D.mode===`red`?`redPolygons`:`greenPolygons`;D.draftConfig[t]=D.draftConfig[t].filter(t=>t.id!==e)}$()}}function Qe(e){if(!D)return;let t=me(e);if(D.draftPoints.length>=3){let e=D.draftPoints[0];if(F(e,t)<=.035){Xe(!0),$();return}}D.draftPoints.push(t),$()}function $e(){return{forestCollision:A(w),caveCollision:A(T),teleport:j(E)}}async function et(e=$e()){let t=ue(M(e));if(navigator.storage?.getDirectory)try{let e=await(await(await navigator.storage.getDirectory()).getFileHandle(g.fileName,{create:!0})).createWritable();await e.write(t),await e.close()}catch{}try{localStorage.setItem(g.key,t)}catch{}}function tt(e){if(!e)return null;try{let t=JSON.parse(e);return{config:M(t),updatedAt:Number.isFinite(Date.parse(t?.updatedAt))?Date.parse(t.updatedAt):0}}catch{return null}}async function nt(){try{let e=await fetch(`/yy-collision-default.json`,{cache:`no-cache`});if(e.ok)return M(await e.json())}catch{}return M(null)}async function rt(){let e=await nt();w=A(e.forestCollision),T=A(e.caveCollision),E=j(e.teleport),W(),X(``),D||$()}function it(e){return e===` `?`Space`:e.length===1?e.toLowerCase():e}function Q(...e){return e.some(e=>_.has(e))}function at(){let t=window.innerWidth,r=window.innerHeight,i=Math.min(t/a.width,r/a.height),o=window.devicePixelRatio||1;e.style.width=`${Math.max(1,Math.round(a.width*i))}px`,e.style.height=`${Math.max(1,Math.round(a.height*i))}px`,e.width=Math.max(1,Math.round(a.width*i*o)),e.height=Math.max(1,Math.round(a.height*i*o)),n.setTransform(i*o,0,0,i*o,0,0),n.imageSmoothingEnabled=!0,n.imageSmoothingQuality=`high`}function ot(e){if(S.won){e.preventDefault(),We();return}if(S.paused){(e.code===`Space`||e.code===`ArrowLeft`||e.code===`ArrowRight`||e.code===`ArrowUp`||e.code===`ArrowDown`)&&e.preventDefault();return}if(_.add(e.code),_.add(it(e.key)),e.code===`Space`||it(e.key)===`Space`){e.preventDefault(),He();return}(e.code===`ArrowLeft`||e.code===`ArrowRight`||e.code===`ArrowUp`||e.code===`ArrowDown`)&&e.preventDefault()}function st(e){_.delete(e.code),_.delete(it(e.key))}function ct(){_.clear()}function lt(e){if(!D)return;e.preventDefault();let t=Ge(e);t&&Qe(t)}function ut(e){if(!D)return;let t=e.target;if(!(t instanceof HTMLElement))return;let n=t.closest(`.polygon-delete`);if(n instanceof HTMLElement){let t=n.dataset.polygonId;t&&(e.preventDefault(),e.stopPropagation(),Ze(t));return}e.preventDefault();let r=Ge(e);r&&Qe(r)}function dt(e){S.won&&(e.preventDefault(),e.stopPropagation(),We())}function ft(e){let t=e.target;if(!(t instanceof HTMLElement))return;let n=t.dataset.action;if(n){if(n===`mode`){let e=t.dataset.mode;(e===`green`||e===`red`||e===`teleport`)&&Je(e);return}if(n===`pause-toggle`){Be();return}if(D){if(n===`save`){Xe(!0),D.mode===`teleport`?E=j(D.draftTeleportConfig):D.scene===u.cave?T=A(D.draftConfig):w=A(D.draftConfig),et().catch(()=>{}),Ye();return}n===`cancel`&&Ye()}}}function pt(e){if(D){S.moving=!1,S.frameTimer=0;return}if(S.won){S.moving=!1,S.frameTimer=0;return}if(S.paused){S.moving=!1,S.frameTimer=0;return}if(S.elapsedSeconds+=e,S.transitionCooldown=Math.max(0,S.transitionCooldown-e),J(),Ae(e))return;if(S.falling){S.fallTimer+=e,S.fallVelocityY+=920*e,S.x+=S.fallVelocityX*e,S.y+=S.fallVelocityY*e,S.fallTimer>=3e3/1e3&&Le();return}if(S.pickingUp){S.pickupTimer+=e,S.moving=!1,S.pickupTimer>=c.durationMs/1e3&&Ue();return}if(G())return;let t=Q(`ArrowLeft`),n=Q(`ArrowRight`),r=Q(`ArrowUp`),i=Q(`ArrowDown`),a=!!n-+!!t,o=!!i-+!!r,l=a!==0||o!==0;if(S.moving=l,l){Math.abs(o)>=Math.abs(a)?o<0?S.facing=`up`:o>0&&(S.facing=`down`):a<0?S.facing=`left`:a>0&&(S.facing=`right`);let t=Math.hypot(a,o)||1;a/=t,o/=t;let n=R(S.x+a*s.speed*e,S.y).x;if(G(n,S.y))return;let r=n,i=S.y;if(Ie(r,i)){S.x=r,S.y=i,Ve();return}Fe(n,S.y)||(S.x=n);let c=R(S.x,S.y+o*s.speed*e).y;if(G(S.x,c))return;if(Ie(S.x,c)){S.x=S.x,S.y=c,Ve();return}if(Fe(S.x,c)||(S.y=c),G())return;S.frameTimer+=e;let l=s.frameMs/1e3;for(;S.frameTimer>=l;)S.frame=(S.frame+1)%s.columns,S.frameTimer-=l}else S.frameTimer=0}function mt(){if(!S.loaded){let e=fe(),t=s.size*e,r=S.x+(s.size-t)/2,i=S.y+(s.size-t);n.save(),n.fillStyle=`rgba(255, 178, 117, 0.25)`,n.strokeStyle=`rgba(255, 220, 196, 0.85)`,n.lineWidth=4,n.beginPath(),n.ellipse(r+t/2,i+t/2,t*.42,t*.52,0,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle=`rgba(255, 245, 232, 0.9)`,n.font=`700 16px ui-sans-serif, system-ui, sans-serif`,n.fillText(`loading squirrel`,r+12,i+t+22),n.restore();return}let e=S.pickingUp&&S.pickupLoaded?b:v,t=S.pickingUp&&S.pickupLoaded?c.columns:s.columns,r=S.pickingUp&&S.pickupLoaded?c.rows:s.rows,i=e.width/t,a=e.height/r,o=S.pickingUp&&S.pickupLoaded?c.facingRows[S.facing]:s.facingRows[S.facing],l=Math.min(t-1,Math.floor(S.pickupTimer/(c.frameMs/1e3))),u=(S.pickingUp&&S.pickupLoaded?l:S.moving?S.frame:s.idleColumn)*i,d=o*a,f=S.moving&&!S.pickingUp?Math.sin(S.frameTimer/s.frameMs*Math.PI)*7:0,p=fe(),m=s.size*p,h=S.x+(s.size-m)/2,g=S.y+(s.size-m)+f;n.save(),n.shadowColor=`rgba(63, 36, 20, 0.25)`,n.shadowBlur=14,n.shadowOffsetY=8,n.drawImage(e,u,d,i,a,h,g,m,m),n.restore()}function ht(){if(S.scene!==S.acornScene||!S.acornVisible||b.width===0||b.height===0)return;let e=xe(),t=l.size,r=e.x-t/2,i=e.y-t;n.save(),n.shadowColor=`rgba(40, 22, 10, 0.28)`,n.shadowBlur=10,n.shadowOffsetY=5,n.drawImage(b,l.crop.x,l.crop.y,l.crop.width,l.crop.height,r,i,t,t),n.restore()}function gt(e,t){if(!(!t||t.length===0)){e.beginPath(),e.moveTo(t[0].x,t[0].y);for(let n=1;n<t.length;n+=1)e.lineTo(t[n].x,t[n].y);e.closePath()}}function _t(e){return e.reduce((e,t)=>({left:Math.min(e.left,t.x),top:Math.min(e.top,t.y),right:Math.max(e.right,t.x),bottom:Math.max(e.bottom,t.y)}),{left:1/0,top:1/0,right:-1/0,bottom:-1/0})}function vt(){let e=document.getElementById(`polygon-layer`);if(!D){e?.replaceChildren(),e&&(e.style.pointerEvents=`none`);return}e&&(e.style.pointerEvents=`auto`);let t=D.draftConfig,r=z();if(!r)return;let i=(e,t,i,a)=>{e.forEach(e=>{let o=B(r,e.points);o.length!==0&&(n.save(),n.lineJoin=`round`,n.lineCap=`round`,gt(n,o),n.fillStyle=i,n.strokeStyle=t,n.lineWidth=a?3:2,n.fill(),n.stroke(),a&&o.forEach(e=>{n.beginPath(),n.fillStyle=t,n.arc(e.x,e.y,4.5,0,Math.PI*2),n.fill()}),n.restore())})},o=D.mode===`teleport`?D.draftTeleportConfig[D.scene===u.cave?`cave`:`forest`]:D.mode===`red`?t.redPolygons:t.greenPolygons;if(i(o,D.mode===`teleport`?`hsla(196, 100%, 62%, 0.98)`:D.mode===`red`?`hsla(8, 100%, 58%, 0.95)`:`hsla(120, 100%, 50%, 0.95)`,D.mode===`teleport`?`hsla(196, 100%, 58%, 0.16)`:D.mode===`red`?`hsla(8, 100%, 55%, 0.14)`:`hsla(120, 100%, 55%, 0.16)`,!0),D.draftPoints.length>0){let e=D.draftPoints.map(e=>({x:r.x+r.width*e.x,y:r.y+r.height*e.y}));n.save(),n.lineJoin=`round`,n.lineCap=`round`,gt(n,e),n.strokeStyle=D.mode===`teleport`?`rgba(120, 220, 255, 0.98)`:D.mode===`red`?`rgba(255, 150, 140, 0.98)`:`rgba(160, 255, 180, 0.98)`,n.lineWidth=3,n.stroke(),e.length>=3&&(n.fillStyle=`rgba(255, 255, 255, 0.05)`,n.fill()),e.forEach((e,t)=>{n.beginPath(),n.fillStyle=t===0?`rgba(255, 255, 255, 0.98)`:n.strokeStyle,n.arc(e.x,e.y,t===0?5.5:4,0,Math.PI*2),n.fill()}),n.restore()}e&&(e.replaceChildren(),o.forEach(t=>{let n=_t(B(r,t.points));if(!Number.isFinite(n.left))return;let i=Ke({x:P(n.right+16,16,a.width-16),y:P(n.top+10,16,a.height-16)});if(!i)return;let o=document.createElement(`button`);o.type=`button`,o.className=`polygon-delete`,o.dataset.kind=D.mode,o.dataset.polygonId=t.id,o.textContent=`×`,o.title=`Delete ${N(D.mode)} polygon`,o.style.left=`${i.x}px`,o.style.top=`${i.y}px`,e.appendChild(o)}))}function yt(){let e=z();e&&n.drawImage(de(),e.x,e.y,e.width,e.height)}function bt(){if(S.won){n.save(),n.fillStyle=`rgba(255, 247, 219, 0.98)`,n.strokeStyle=`rgba(82, 45, 16, 0.5)`,n.lineWidth=5,n.textAlign=`center`,n.textBaseline=`top`,n.font=`900 54px ui-sans-serif, system-ui, sans-serif`,n.strokeText(`You WIN!`,a.width/2,24),n.fillText(`You WIN!`,a.width/2,24),n.font=`800 24px ui-sans-serif, system-ui, sans-serif`,n.strokeText(`${S.winSeconds} seconds`,a.width/2,88),n.fillText(`${S.winSeconds} seconds`,a.width/2,88),n.restore();return}D&&(n.save(),n.fillStyle=`rgba(255, 245, 232, 0.9)`,n.font=`600 18px ui-sans-serif, system-ui, sans-serif`,n.fillText(`Editing ${N(D.mode)}. Save or Cancel in the corner.`,34,38),n.restore())}function xt(){if(!S.sceneTransition)return;let e=P(S.sceneTransition.timer/.275,0,2),t=e<=1?e:2-e;n.save(),n.fillStyle=`rgba(5, 4, 3, ${P(t,0,1)})`,n.fillRect(0,0,a.width,a.height),n.restore()}function $(){n.clearRect(0,0,a.width,a.height),yt(),ht(),vt(),mt(),bt(),xt()}let St=performance.now(),Ct=0;function wt(e){let t=Math.min((e-St)/1e3,.05);St=e,pt(t),$(),Ct=window.requestAnimationFrame(wt)}return window.addEventListener(`resize`,at),window.addEventListener(`keydown`,ot,{passive:!1}),window.addEventListener(`keyup`,st),window.addEventListener(`blur`,ct),window.addEventListener(`pointerdown`,dt,{capture:!0}),e.addEventListener(`pointerdown`,lt),document.getElementById(`editor-controls`)?.addEventListener(`click`,ft),document.getElementById(`polygon-layer`)?.addEventListener(`pointerdown`,ut),document.getElementById(`editor-status`)?.addEventListener(`click`,()=>X(``)),at(),Z(),J(),X(`Loading collision config...`),rt().catch(()=>{X(`Loaded built-in collision layout.`)}),Ct=window.requestAnimationFrame(wt),()=>{window.cancelAnimationFrame(Ct),window.removeEventListener(`resize`,at),window.removeEventListener(`keydown`,ot),window.removeEventListener(`keyup`,st),window.removeEventListener(`blur`,ct),window.removeEventListener(`pointerdown`,dt,{capture:!0})}}u();