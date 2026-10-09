(function(){
"use strict";
var root = document.documentElement;
var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var small = window.innerWidth < 760;
var $ = function(s, el){ return (el || document).querySelector(s); };
var $$ = function(s, el){ return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

/* ---------- Depth model ---------- */
var Y_BOTTOM = -74;
var PAGE = {
  home:{ y0:3.2, y1:3.2 },
  dives:{ y0:-9, y1:-9 },
  interfaces:{ y0:-5, y1:-17, dive:true, stage:true },
  systems:{ y0:-21, y1:-37, dive:true, stage:true },
  ai:{ y0:-41, y1:-56, dive:true, stage:true },
  work:{ y0:-60, y1:-74, dive:true, stage:true }
};
function smooth(a,b,x){ var t=Math.min(1,Math.max(0,(x-a)/(b-a))); return t*t*(3-2*t); }
function metersAt(y){ return y >= 0 ? 0 : Math.round(Math.pow(Math.min(1, -y/(-Y_BOTTOM)), 1.5)*4200/5)*5; }
function zoneFor(m){ return m < 1 ? 'Surface' : m < 200 ? 'Sunlight zone' : m < 1000 ? 'Twilight zone' : m < 4000 ? 'Midnight zone' : 'Abyssal plain'; }
var TEMP = [[0,20],[200,16],[1000,5],[4000,2.2],[4200,2]];
function tempAt(m){ for (var i=0;i<TEMP.length-1;i++){ if (m <= TEMP[i+1][0]){ var t=(m-TEMP[i][0])/(TEMP[i+1][0]-TEMP[i][0]); return TEMP[i][1]+(TEMP[i+1][1]-TEMP[i][1])*t; } } return 2; }
var rDepth = $('#r-depth'), rTemp = $('#r-temp'), rZone = $('#r-zone'), rDisc = $('#r-disc'), rBar = $('#r-bar');
var discovered = { interfaces:0, systems:0, ai:0, work:0 };
function readout(y){
  var m = metersAt(y);
  rDepth.textContent = m.toLocaleString('en-US') + ' m';
  rTemp.textContent = tempAt(m).toFixed(1) + '°C';
  var z = (typeof STAGE !== 'undefined' && STAGE.on && STAGE.loc) ? STAGE.loc : zoneFor(m); if (rZone.textContent !== z){ rZone.textContent = z; flicker(rZone); }
  var d = discoveredPct();
  var pct = Math.round(d*100) + '%'; if (rDisc.textContent !== pct) rDisc.textContent = pct;
  rBar.style.transform = 'scaleX(' + d.toFixed(3) + ')';
}
var sTarget = 0, sSmooth = 0, setCurrents = function(){};
function pageFrac(){ var max = root.scrollHeight - window.innerHeight; return max > 4 ? Math.min(1, Math.max(0, window.scrollY/max)) : 0; }

