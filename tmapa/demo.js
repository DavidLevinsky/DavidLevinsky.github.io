
var browser, renderer, map, demoTexture;

function restart() {
    browser.destroy();
    console.log('browser destoyed');
    startDemo();
}

function startDemo() {

    var v1 = vts.vec3.create();
    var v2 = vts.vec3.create();
    var v1 = vts.vec3.add(v1,v2);

    var m11 = vts.mat4.create();

    var params = vts.utils.getParamsFromUrl(window.location.href);
    
    for (key in params) {

        if (key == 'mapFeatureMaxOverlays') {
            params['mapFeaturesPerSquareInch'] = params[key];
            key = 'mapFeaturesPerSquareInch';
        } 
        
        if (key == 'mapFeatureRadius') {
            params['mapFeatureGridCells'] = params[key];
            key = 'mapFeatureGridCells';
        } 

        switch(key) {
            case 'rotate':
            case 'minViewExtent':
            case 'maxViewExtent':
            case 'mapTexelSizeFit':
            case 'mapLowresBackground':               
            case 'mapMaxProcessingTime':
            case 'mapMobileDetailDegradation':
            case 'mapFeaturesPerSquareInch':
            case 'mapNavSamplesPerViewExtent':  params[key] = parseFloat(params[key]); break;
            case 'mapCache':
            case 'mapGPUCache':
            case 'mapMetatileCache':
            case 'mapMaxHiresLodLevels':
            case 'mapRefreshCycles':
            case 'mapDownloadThreads':
            case 'mapForceFrameTime':
            case 'mapForcePipeline':
            case 'mapFeatureGridCells':
            case 'rendererAnisotropic':         params[key] = parseInt(params[key], 10); break;
            case 'panAllowed':
            case 'rotationAllowed':
            case 'zoomAlowed':
            case 'controlCompass':
            case 'controlZoom':
            case 'controlMeasure':
            case 'controlScale':
            case 'controlSpace':
            case 'controlSearch':
            case 'controlLayers':
            case 'controlLink':
            case 'controlMeasure':
            case 'controlLoading':
            case 'controlFullscreen':
            case 'controlCredits':
            case 'controlSearchElement':
            case 'controlSearchValue':
            case 'constrainCamera':
            case 'mapMobileMode':
            case 'mapMobileModeAutodect': 
            case 'mapIgnoreNavtiles':
            case 'mapFog':
            case 'mapPreciseCulling':
            case 'mapAllowHires':
            case 'mapAllowLowres':
            case 'mapAllowSmartSwitching':
            case 'mapHeightLodBlend':
            case 'mapHeightNodeBlend':
            case 'mapBasicTileSequence':
            case 'mapXhrImageLoad':
            case 'mapStoreLoadStats':
            case 'mapHeightfiledWhenUnloaded':
            case 'mapVirtualSurfaces':
            case 'mapPreciseBBoxTest':
            case 'mapPreciseDistanceTest':
            case "mapGridSurrogatez":   
            case 'mapNoTextures':  
            case 'rendererAntialiasing':
            case 'rendererAllowScreenshots':    params[key] = (params[key] == 'true' || params[key] == '1'); break;
            case 'inertia':
            case 'sensitivity':
            case 'tiltConstrainThreshold':
            case 'mapFeaturesReduceParams':
            case 'pan':
                var value = decodeURIComponent(params[key]);
                value = value.split(',');
                
                for (var i = 0, li = value.length; i < li; i++) {
                    value[i] = parseFloat(value[i]);
                }
                
                params[key] = value;
                break;

            case 'pos':
                var value = decodeURIComponent(params[key]);
                value = value.split(',');
                
                for (var i = 1, li = value.length; i < li; i++) {
                    if (i != 3) {
                        value[i] = parseFloat(value[i]);
                    }
                }
                
                params[key] = value;
                break;

            case 'mapGridMode':
            case 'mapLoadMode':
            case 'mapGeodataLoadMode':
            case 'mapFeaturesReduceMode':
            case 'navigationMode':
            case 'controlSearchUrl':
            case 'controlSearchSrs':
            case 'geodata':
            case 'geojson':
            case 'geojsonStyle':
            case 'debugBBox':
            case 'debugLBox':
            case 'debugNoEarth':
            case 'debugShader':
            case 'debugHeightmap':
            case 'debugRadar':
            case 'debugGridCells':
            case 'view':
                params[key] = decodeURIComponent(params[key]);
                break;
                
            case 'useCredentials':                
                vts.utils.useCredentials = (params[key] == 'true' || params[key] == '1'); break;                    
        }
    }
   
    


         vts['useCredentials'] = false; 

        params['map'] = 'https://rigel.mlwn.se/store/map-config/high-terrain/mapConfig.json';



    params['positionInUrl'] = true;
    params['jumpAllowed'] = true;
    
    params['inspector'] = true;
    params['mapLoadMode'] = 'fit';


    params['mapDefaultFont'] = 'https://cdn.melown.com/libs/vtsjs/fonts/noto-basic/1.0.0/noto.fnt';

    browser = vts.browser('melown-demo', params);

    browser.on('map-mapconfig-loaded', (function(data){

        data.boundLayers["eox-it-sentinel2-cloudless"] = {
            "credits" : { "eox-it" : { "id" : 125, "notice" : "Datasource: [https://mapy.cz mapy.cz] by Seznam.cz" } },
            "lodRange" : [ 3, 18 ],
            "tileRange" : [ [ 0, 0 ], [ 16, 16 ] ],
            "type" : "raster",
            //"url" : "https://mapserver.mapy.cz/mellown-base/{loclod}-{locx}-{locy}"
            //"url" : "https://mapserver.mapy.cz/mellown-roads/{loclod}-{locx}-{locy}"
            "url" : "https://cdn.melown.com/vts/melown-roads/{loclod}-{locx}-{locy}"

            //"shaderFilter" : "c.rgb = mix(c.rgb, vec3(1.0), 0.5);"
        };

       data['view'] = 
            {
              "surfaces": {
                "terrain-viewfinder3": [
                  "eox-it-sentinel2-cloudless"
                ]
              },
              "freeLayers": {

                "osm-maptiler": {
                  "style": {
                          "constants": {

                            /* FONTS */
                            "@main-font": ["noto-mix","noto-cjk"],
                            "@italic-font": ["noto-italic", "noto-mix","noto-cjk"],

                            /* ICONS */
                            "@icon-circle": ['circle', 0, 0, 63, 63],
                            "@icon-hill": ['hill', 0, 0, 63, 63],

                            /* GENERAL */
                            "@base-color": [0,0,0,255],
                            "@base-color2": [255,255,255,255],
                            "@base-stick": [70,5,2,0,0,0,100,14],
                            "@name-solver": {"if":[["has","$name"],{"if":[["any",["!has","$name:en"],["==",{"has-latin":"$name"},true]],"{$name}","{$name}\n{$name:en}"]},""]},

                            /* COUNTRIES */
                            "@country-caps": [255,255,255,255],
                            "@country-label": {"uppercase": {"if":[["==","@name-solver","Schweiz/Suisse/Svizzera/Svizra"],"Switzerland",{"if":[["==","@name-solver","België - Belgique - Belgien"],"België","{@name-solver}"]}]}},
                            "@country-imp": {"sub":[95,{"str2num":"$rank"}]},

                            /* PEAKS */
                            "@feet": {"round":{"mul":[3.2808399,{"str2num":"$ele"}]}},
                            "@ele-solver": {"if":[["==","#metric",true],"{{'round': {'str2num':'$ele'}}} m","{@feet} ft"]},
                            "@peak-name": {"if":[["has","$ele"],"{@name-solver}\n{@ele-solver}","{@name-solver}"]},
                            "@peak-name-3": {"if":[["has","$ele"],"{@name-solver}\n {@ele-solver} {@prominence-name} r{@peak-rank}","{@name-solver} {@prominence-name} r{@peak-rank}"]},
                            "@peak-name-2": "{@name-solver}\n {@prominence}}",
                            "@prominence": {"add":[{"if":[["has","$ele"],{"mul":[0.0001,{"str2num":"$ele"}]},0]},{"if":[["has","$prominence"],{"mul":[0.003048,{"str2num":"$prominence"}]},0]}]},
                            "@prominence2": {"if":[["has","$prominence"],{"mul":[0.3048,{"str2num":"$prominence"}]},0]},
                            "@prominence-name": {"round":"@prominence"},
                            "@osmid": {"if":[["has","$osm_id"],"$osm_id",""]},
                            "@id-solver": "{@osmid} {@ele-solver} {@name-solver}",
                            "@peak-rank": {"discrete2":["@prominence2", [[1,5],[2,4],[162,4],[164,3],[324,3],[326,2],[749,2],[751,1],[1499,1],[1501,0]]]},
                            "@peak-name2": "@peak-name",
                            "@peak-imp": {"add":[40,{"mul":[0.333,"@prominence"]}]},

                            /* TOWNS */
                            "@city-label": "{@name-solver}",
                            "@id-solver-town": "@city-label",
                            "@town-imp": {"sub":[90,{"str2num":"$rank"}]},

                            "@dummy-line": 0
                          },

                          "bitmaps": {
                              "hill": {"url":"data:image/png;base64,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","filter":"trilinear","tiled":false},
                              "circle" : {"url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NDkxMSwgMjAxMy8xMC8yOS0xMTo0NzoxNiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozMzdGNjlEMUUxMjAxMUU4OTU1MkMyNTA5OUFCMzRGNSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozMzdGNjlEMkUxMjAxMUU4OTU1MkMyNTA5OUFCMzRGNSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjMzN0Y2OUNGRTEyMDExRTg5NTUyQzI1MDk5QUIzNEY1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjMzN0Y2OUQwRTEyMDExRTg5NTUyQzI1MDk5QUIzNEY1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+E49TwQAACbNJREFUeNrsW/lTVNkV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", "filter":"trilinear", "tiled": false}
                          },

                          "fonts": {
                            "noto-italic": "../fonts/noto-italic/noto-i.fnt",
                            "noto-mix": "//cdn.melown.com/libs/vtsjs/fonts/noto-extended/1.0.0/noto.fnt",
                            "noto-cjk": "//cdn.melown.com/libs/vtsjs/fonts/noto-cjk/1.0.0/noto.fnt"
                          },

                          "layers": {
                            "country-boundaries": {
                              "filter": ["all",["==","#group","boundary"],["==","$admin_level","2"],["!=","$maritime","1"]],
                              "line": true,
                              "line-flat": false,
                              "line-width": 3,
                              "line-color": [0,0,0,180],
                              "zbuffer-offset": [-0.01,0,0]
                            },
                            /*
                            "state-boundaries": {
                              "filter": ["all",["==","#group","boundary"],["==","$admin_level","4"],["!=","$maritime","1"]],
                              "line": true,
                              "line-flat": false,
                              "line-width": 4,
                              "line-color": [255,255,255,64],
                              "zbuffer-offset": [-0.01,0,0]
                            },*/

                            "country-labels": {
                              "filter": ["all",["==","#group","place"],["==","$class","country"]],
                              "importance-source": "@country-imp",

                              "label": true,
                              "label-font": "@main-font",
                              "label-source" : "@country-label",
                              //"label-source" : "{@country-label} - {$rank}",
                              //"label-source" : "{@country-label} - {@country-imp}",                              

                              "label-color" : "@base-color",
                              "label-color2" : "@base-color2",
                              "label-stick": "@base-stick",
                              "label-size": {"linear2":["$rank",[[1,20],[3,17]]]},
                              "label-spacing": 1,
                              "label-line-height": 0.8,
                              "label-offset": [0,-8],

                              "label-no-overlap": true,
                              "label-no-overlap-factor": ["div-by-dist","@country-imp"],


                              //"visibility-abs": [230000,9999999],
                              "visibility-rel": [230000,1,0.001, 1],
                              "culling": 94,
                              "zbuffer-offset": [-0.15,0,0],
                              "hysteresis": [1500,1500,"@id-solver-town",true]

                            },

                            "towns-labels": {
                              "filter": ["all",["==","#group","place"],["in","$class","city","town","village"]],
                              "importance-source": "@town-imp",

                              "pack": true,

                              "label": true,
                              "label-font": "@main-font",
                              "label-source": "@city-label",
                              //"label-source" : "{@city-label} - {$rank}",
                              "label-offset": [0,-10],

                              "label-color" : "@base-color",
                              "label-color2" : "@base-color2",
                              "label-stick": "@base-stick",
                              "label-size": {"linear2":["$rank",[[1,17],[18,14]]]},

                              "label-no-overlap": true,
                              "label-no-overlap-factor": ["div-by-dist","@town-imp"],

                              "icon": true,
                              "icon-source": "@icon-circle",
                              "icon-color": [255,255,255,255],
                              "icon-scale": 0.4,
                              "icon-origin": "bottom-center",
                              "icon-offset": [0,10],

                              "culling": 94,
                              "zbuffer-offset": [-0.15,0,0],
                              "hysteresis": [1500,1500,"@id-solver-town",true]
                            },

                            "peaks": {
                              "filter": ["all",["==","#group","mountain_peak"]],
                              "visible": true,
                              "importance-source": "@peak-imp",

                              "pack": true,

                              "label": true,
                              "label-color" : "@base-color",
                              "label-color2" : "@base-color2",
                              "label-stick": "@base-stick",
                              "label-size": 15,
                              "label-offset": [0,-10],

                              "label-source": "@peak-name2",
                              "label-font": "@italic-font",

                              "label-no-overlap": true,
                              "label-no-overlap-factor": ["div-by-dist","@peak-imp"],

                              "icon": true,
                              "icon-source": "@icon-hill",
                              "icon-color": [50,50,50,255],
                              "icon-scale": 0.3,
                              "icon-origin": "bottom-center",
                              "icon-offset": [0,10],

                              "zbuffer-offset": [-0.25,0,0],
                              "culling": 94,
                              "hysteresis": [1500,1500,"@id-solver",true]
                            }
                          }
                        }
                }

                ,

                "peaklist-org-ultras": {
                  "style": {
                      "constants": {
                        /* FONTS */
                        "@main-font": ["noto-mix","noto-cjk"],
                        "@italic-font": ["noto-italic", "noto-mix","noto-cjk"],

                        /* ICONS */
                        "@icon-hill": ['hill', 0, 0, 63, 63],

                        /* GENERAL */
                        "@base-color": [0,0,0,255],
                        "@base-color2": [255,255,255,255],
                        "@base-stick": [70,5,2,0,0,0,100,14],

                        "@name-solver": {"if":[["has","$name"],"$name","$Name"]},
                        "@ele": {"if":[["has","$elevation"],"$elevation","$Elevation"]},
                        "@feet": {"round":{"mul":[3.2808399,{"str2num":"@ele"}]}},
                        "@ele-solver": {"if":[["==","#metric",true],"{{'round': {'str2num':'@ele'}}} m","{@feet} ft"]},
                        "@id-solver": "{@ele-solver} {@name-solver}",
                        "@prom-solver": {"mul":[0.01,{"str2num":{"if":[["has","$prom"],"$prom","$Prom"]}}]},

                        "@peak-imp": {"add":[40,{"mul":[0.333,"@prom-solver"]}]}
                      },

                      "fonts": {
                        "noto-italic": "../fonts/noto-italic/noto-i.fnt",
                        "noto-mix": "//cdn.melown.com/libs/vtsjs/fonts/noto-extended/1.0.0/noto.fnt",
                        "noto-cjk": "//cdn.melown.com/libs/vtsjs/fonts/noto-cjk/1.0.0/noto.fnt"
                      },

                      "bitmaps": {
                          "hill": {"url":"data:image/png;base64,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","filter":"trilinear","tiled":false}
                      },

                      "layers": {
                        "peak-labels": {
                          "importance-source": "@peak-imp",
                          "visible": true,

                          "pack": true,

                          "label": true,
                          "label-font": "@italic-font",
                          "label-source": "{@name-solver}\n{@ele-solver}",
                          //"label-source": "{@name-solver}\n{@peak-imp}",
                          //"label-source": "{@name-solver}\n{@peak-imp}",

                          "label-color" : "@base-color",
                          "label-color2" : "@base-color2",
                          "label-stick": "@base-stick",
                          "label-size": 15,
                          "label-offset": [0,-10],

                          "label-no-overlap": true,
                          "label-no-overlap-factor": ["div-by-dist","@peak-imp"],

                          
                          "icon": true,
                          "icon-source": "@icon-hill",
                          "icon-color": [50,50,50,255],
                          "icon-scale": 0.3,
                          "icon-origin": "bottom-center",
                          "icon-offset": [0,10],

                          "zbuffer-offset": [-1,0,0],
                          "culling": 92,
                          "hysteresis": [1500,1500,"@id-solver",true]
                        }
                      }
                    }
                }

              }
            };

        

    }));


    browser.on('geo-feature-enter', (function(event){
        console.log(JSON.stringify(event));
    }));

    //browser.ui.getMapElement().on('mousedown', demoClick2);
    //browser.ui.getMapElement().on('mousemove', demoMove);

    renderer = browser.renderer;

    browser.on('map-loaded', onMapLoaded);
    loadTexture();
}

function loadTexture() {
    var demoImage = vts.utils.loadImage(
        'http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png',
        (function(){
            demoTexture = renderer.createTexture({ source: demoImage });
        }));
}


function onMapLoaded() {
    map = browser.map;
    map.addRenderSlot('custom-render', onCustomRender, true);
    map.moveRenderSlotAfter('after-map-render', 'custom-render');
    //map.setRenderSlotEnabled('custom-render', true);   
    //map.getRenderSlotEnabled('custom-render');   
    map.removeRenderSlot('custom-render');   



};


function onCustomRender() {
    if (demoTexture) { //check whether texture is loaded
        var p = map.convertCoordsFromNavToCanvas([15.172978788057927,49.60550639057978,512.3574876002967], 'fix');

        //draw point image at the first line point
        renderer.drawImage({
            rect : [p[0]-25, p[1]-25, 50, 50],
            texture : demoTexture,
            color : [255,0,255,255],
            depth : p[2],
            depthTest : true,
            depthOffset : [-70,0,0],
            blend : true
            });
    }    
}

function demoMove(event_) {

    var map = browser.map;
    //map.click(coords[0], coords[1]);
    
    if (map) {
        var coords = event_.getMouseCoords();
        map.hover(coords[0], coords[1]);
    }

};



