(function() {
  var chokidar, colors, fs, helpers, iced, inquirer, mkdirp, parser, path, request, sass, __iced_k, __iced_k_noop;

  iced = require('iced-runtime');
  __iced_k = __iced_k_noop = function() {};

  helpers = require('./helpers');

  chokidar = require('chokidar');

  inquirer = require('inquirer');

  colors = require('colors');

  fs = require('fs');

  path = require('path');

  request = require('request');

  mkdirp = require('mkdirp');

  sass = require('node-sass');

  parser = require('gitignore-parser');

  exports.run = function(argv, done) {
    var config, err, ignore, pages, target, watcher, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "lib/watch.iced",
          funcname: "run"
        });
        helpers.loadConfig(__iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              err = arguments[0];
              return config = arguments[1];
            };
          })(),
          lineno: 15
        }));
        __iced_deferrals._fulfill();
      });
    })(this)((function(_this) {
      return function() {
        if (typeof err !== "undefined" && err !== null) {
          done(err);
        }
        if (config.ignore_file) {
          ignore = parser.compile(fs.readFileSync(config.ignore_file, 'utf8'));
        }
        (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "lib/watch.iced",
            funcname: "run"
          });
          helpers.getTarget(config, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                err = arguments[0];
                return target = arguments[1];
              };
            })(),
            lineno: 21
          }));
          __iced_deferrals._fulfill();
        })(function() {
          if (typeof err !== "undefined" && err !== null) {
            return done(err);
          }
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "lib/watch.iced",
              funcname: "run"
            });
            helpers.getShopPages(target, __iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  err = arguments[0];
                  return pages = arguments[1];
                };
              })(),
              lineno: 24
            }));
            __iced_deferrals._fulfill();
          })(function() {
            if (typeof err !== "undefined" && err !== null) {
              return done(err);
            }
            watcher = chokidar.watch('./', {
              ignored: /[\/\\]\./,
              persistent: true,
              ignoreInitial: true,
              usePolling: true,
              interval: 250,
              binaryInterval: 250,
              cwd: process.cwd()
            });
            watcher.on('all', function(event, filepath) {
              var assetsBody, data, err, extension, fileHandle, mainscss, page, res, result, targetscss, ___iced_passed_deferral1, __iced_deferrals, __iced_k;
              __iced_k = __iced_k_noop;
              ___iced_passed_deferral1 = iced.findDeferral(arguments);
              extension = path.extname(filepath).substr(1);
              if (filepath.match(/^quickshot.json$/)) {
                return;
              }
              if (filepath.match(/^\..*$/)) {
                return;
              }
              if (config.ignore_file) {
                if (ignore.denies(filepath)) {
                  return;
                }
              }
              switch (event) {
                case 'add':
                case 'change':
                  if (filepath.match(/[\(\)]/)) {
                    return console.log(colors.red("Filename may not contain parentheses, please rename - \"" + filepath + "\""));
                  }
                  (function(_this) {
                    return (function(__iced_k) {
                      if (filepath.match(/^pages/)) {
                        fileHandle = path.basename(filepath, '.html');
                        page = _.find(pages, {
                          handle: fileHandle
                        });
                        if (!page) {
                          return console.log(colors.red("Page with handle " + fileHandle + " was not found in shop for " + filepath));
                        }
                        (function(__iced_k) {
                          __iced_deferrals = new iced.Deferrals(__iced_k, {
                            parent: ___iced_passed_deferral1,
                            filename: "lib/watch.iced"
                          });
                          fs.readFile(filepath, __iced_deferrals.defer({
                            assign_fn: (function() {
                              return function() {
                                err = arguments[0];
                                return data = arguments[1];
                              };
                            })(),
                            lineno: 63
                          }));
                          __iced_deferrals._fulfill();
                        })(function() {
                          (function(__iced_k) {
                            __iced_deferrals = new iced.Deferrals(__iced_k, {
                              parent: ___iced_passed_deferral1,
                              filename: "lib/watch.iced"
                            });
                            helpers.shopifyRequest({
                              filepath: filepath,
                              method: 'put',
                              url: "https://" + target.api_key + ":" + target.password + "@" + target.domain + ".myshopify.com/admin/pages/" + page.id + ".json",
                              json: {
                                page: {
                                  id: page.id,
                                  body_html: data.toString('utf8')
                                }
                              }
                            }, __iced_deferrals.defer({
                              assign_fn: (function() {
                                return function() {
                                  err = arguments[0];
                                  res = arguments[1];
                                  return assetsBody = arguments[2];
                                };
                              })(),
                              lineno: 74
                            }));
                            __iced_deferrals._fulfill();
                          })(__iced_k);
                        });
                      } else {
                        (function(__iced_k) {
                          if (config.compile_scss && filepath.match(/\.scss$/)) {
                            mainscss = config.primary_scss_file;
                            targetscss = mainscss.replace('.scss', '.css');
                            console.log(colors.yellow("Compiling Sass: \"" + mainscss + "\" -> \"" + targetscss + "\""));
                            (function(__iced_k) {
                              __iced_deferrals = new iced.Deferrals(__iced_k, {
                                parent: ___iced_passed_deferral1,
                                filename: "lib/watch.iced"
                              });
                              sass.render({
                                file: mainscss,
                                outFile: targetscss
                              }, __iced_deferrals.defer({
                                assign_fn: (function() {
                                  return function() {
                                    err = arguments[0];
                                    return result = arguments[1];
                                  };
                                })(),
                                lineno: 82
                              }));
                              __iced_deferrals._fulfill();
                            })(function() {
                              if (err != null) {
                                done(err);
                              }
                              (function(__iced_k) {
                                __iced_deferrals = new iced.Deferrals(__iced_k, {
                                  parent: ___iced_passed_deferral1,
                                  filename: "lib/watch.iced"
                                });
                                fs.writeFile(targetscss, result.css, __iced_deferrals.defer({
                                  assign_fn: (function() {
                                    return function() {
                                      return err = arguments[0];
                                    };
                                  })(),
                                  lineno: 84
                                }));
                                __iced_deferrals._fulfill();
                              })(function() {
                                return __iced_k(err != null ? done(err) : void 0);
                              });
                            });
                          } else {
                            return __iced_k();
                          }
                        })(function() {
                          (function(__iced_k) {
                            __iced_deferrals = new iced.Deferrals(__iced_k, {
                              parent: ___iced_passed_deferral1,
                              filename: "lib/watch.iced"
                            });
                            fs.readFile(filepath, __iced_deferrals.defer({
                              assign_fn: (function() {
                                return function() {
                                  err = arguments[0];
                                  return data = arguments[1];
                                };
                              })(),
                              lineno: 87
                            }));
                            __iced_deferrals._fulfill();
                          })(function() {
                            (function(__iced_k) {
                              __iced_deferrals = new iced.Deferrals(__iced_k, {
                                parent: ___iced_passed_deferral1,
                                filename: "lib/watch.iced"
                              });
                              helpers.shopifyRequest({
                                filepath: filepath,
                                method: 'put',
                                url: "https://" + target.api_key + ":" + target.password + "@" + target.domain + ".myshopify.com/admin/themes/" + target.theme_id + "/assets.json",
                                json: {
                                  asset: {
                                    key: filepath,
                                    attachment: data.toString('base64')
                                  }
                                }
                              }, __iced_deferrals.defer({
                                assign_fn: (function() {
                                  return function() {
                                    err = arguments[0];
                                    res = arguments[1];
                                    return assetsBody = arguments[2];
                                  };
                                })(),
                                lineno: 98
                              }));
                              __iced_deferrals._fulfill();
                            })(function() {
                              return __iced_k(err != null ? console.log(colors.red(err)) : void 0);
                            });
                          });
                        });
                      }
                    });
                  })(this)((function(_this) {
                    return function() {
                      return __iced_k(typeof err === "undefined" || err === null ? console.log(colors.green("Added/Updated " + filepath)) : void 0);
                    };
                  })(this));
                  break;
                case 'unlink':
                  (function(_this) {
                    return (function(__iced_k) {
                      __iced_deferrals = new iced.Deferrals(__iced_k, {
                        parent: ___iced_passed_deferral1,
                        filename: "lib/watch.iced"
                      });
                      helpers.shopifyRequest({
                        method: 'delete',
                        url: "https://" + target.api_key + ":" + target.password + "@" + target.domain + ".myshopify.com/admin/themes/" + target.theme_id + "/assets.json",
                        qs: {
                          asset: {
                            key: filepath
                          }
                        }
                      }, __iced_deferrals.defer({
                        assign_fn: (function() {
                          return function() {
                            err = arguments[0];
                            res = arguments[1];
                            return assetsBody = arguments[2];
                          };
                        })(),
                        lineno: 110
                      }));
                      __iced_deferrals._fulfill();
                    });
                  })(this)((function(_this) {
                    return function() {
                      if (err != null) {
                        console.log(colors.red(err));
                      }
                      return __iced_k(console.log(colors.green("Deleted " + filepath)));
                    };
                  })(this));
                  break;
                default:
                  return __iced_k();
              }
            });
            return console.log("Watching Files...");
          });
        });
      };
    })(this));
  };

}).call(this);
