// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

exports.defineManualTests = function(rootEl, addButton) {
  var addr = '127.0.0.1';
  var port = 1234;

  function connectAndWrite(type, data) {
    chrome.socket.create(type, {}, function(socketInfo) {
      chrome.socket.connect(socketInfo.socketId, addr, port, function(connectResult) {
        var connected = (connectResult === 0);
        if (connected) {
          chrome.socket.write(socketInfo.socketId, data, function(writeResult) {
            console.log('connectAndWrite: success');
            chrome.socket.disconnect(socketInfo.socketId);
            chrome.socket.destroy(socketInfo.socketId);
          });
        }
      });
    });
  }

  function connectAndRead(type, data) {
    chrome.socket.create(type, {}, function(socketInfo) {
      chrome.socket.connect(socketInfo.socketId, addr, port, function(connectResult) {
        var connected = (connectResult === 0);
        if (connected) {
          chrome.socket.write(socketInfo.socketId, data, function(writeResult) {
            chrome.socket.read(socketInfo.socketId, function(readResult) {
              console.log('connectAndRead: success');
              chrome.socket.disconnect(socketInfo.socketId);
              chrome.socket.destroy(socketInfo.socketId);
            });
          });
        }
      });
    });
  }

  function acceptAndWrite() {
  }

  function acceptAndRead() {
    chrome.socket.create('tcp', {}, function(socketInfo) {
      chrome.socket.listen(socketInfo.socketId, addr, port, function(listenResult) {
        chrome.socket.accept(socketInfo.socketId, function(acceptInfo) {
          chrome.socket.read(acceptInfo.socketId, function(readResult) {
            console.log('acceptAndRead: success');
            chrome.socket.disconnect(acceptInfo.socketId);
            chrome.socket.destroy(acceptInfo.socketId);
            chrome.socket.disconnect(socketInfo.socketId);
            chrome.socket.destroy(socketInfo.socketId);
          });
        });
      });
    });
  }

  function acceptConnectReadWrite(data) {
    chrome.socket.create('tcp', {}, function(socketInfo) {
      chrome.socket.listen(socketInfo.socketId, addr, port, function(listenResult) {

        chrome.socket.accept(socketInfo.socketId, function(acceptInfo) {
          chrome.socket.read(acceptInfo.socketId, function(readResult) {
            var sent = new Uint8Array(data);
            var recv = new Uint8Array(readResult.data);

            chrome.socket.disconnect(acceptInfo.socketId);
            chrome.socket.destroy(acceptInfo.socketId);
            chrome.socket.disconnect(socketInfo.socketId);
            chrome.socket.destroy(socketInfo.socketId);

            if (recv.length != sent.length) {
              return;
            }

            for (var i = 0; i < recv.length; i++) {
              if (recv[i] != sent[i]) {
                return;
              }
            }

            console.log('acceptConnectReadWrite: success');
          });
        });

        chrome.socket.create('tcp', {}, function(socketInfo) {
          chrome.socket.connect(socketInfo.socketId, addr, port, function(connectResult) {
            var connected = (connectResult === 0);
            if (connected) {
              chrome.socket.write(socketInfo.socketId, data, function(writeResult) {
                chrome.socket.disconnect(socketInfo.socketId);
                chrome.socket.destroy(socketInfo.socketId);
              });
            }
          });
        });
      });
    });
  }

  function acceptConnectReadWriteGetInfo(data) {
    chrome.socket.create('tcp', {}, function(socketInfo) {
      chrome.socket.listen(socketInfo.socketId, addr, port, function(listenResult) {

        chrome.socket.accept(socketInfo.socketId, function(acceptInfo) {
          chrome.socket.read(acceptInfo.socketId, function(readResult) {
            var sent = new Uint8Array(data);
            var recv = new Uint8Array(readResult.data);

            chrome.socket.disconnect(acceptInfo.socketId);
            chrome.socket.destroy(acceptInfo.socketId);
            chrome.socket.disconnect(socketInfo.socketId);
            chrome.socket.destroy(socketInfo.socketId);

            if (recv.length != sent.length) {
              return;
            }

            for (var i = 0; i < recv.length; i++) {
              if (recv[i] != sent[i]) {
                return;
              }
            }

            console.log('acceptConnectReadWrite: success');
          });
        });

        chrome.socket.create('tcp', {}, function(socketInfo) {
          chrome.socket.connect(socketInfo.socketId, addr, port, function(connectResult) {
            var connected = (connectResult === 0);
            if (connected) {
              chrome.socket.getInfo(socketInfo.socketId, function(info) {
                if (info) {
                  console.log(info.socketType + ': connected(' + info.connected + ') ' + (info.connected ? info.peerAddress + ':' + info.peerPort + ' -> ' + info.localAddress + ':' + info.localPort : ''));
                }

                chrome.socket.write(socketInfo.socketId, data, function(writeResult) {
                  chrome.socket.disconnect(socketInfo.socketId);
                  chrome.socket.destroy(socketInfo.socketId);
                });
              });
            }
          });
        });
      });
    });
  }

  function sendTo(data) {
    chrome.socket.create('udp', {}, function(socketInfo) {
      chrome.socket.sendTo(socketInfo.socketId, data, addr, port, function(result) {
        console.log('sendTo: success');
        chrome.socket.destroy(socketInfo.socketId);
      });
    });
  }

  function bindAndRecvFrom(data) {
    chrome.socket.create('udp', {}, function(socketInfo) {
      chrome.socket.bind(socketInfo.socketId, addr, port, function(result) {
        chrome.socket.recvFrom(socketInfo.socketId, function(readResult) {
          console.log('recvFrom: success');
          chrome.socket.destroy(socketInfo.socketId);
        });
      });
    });
  }

  function bindRecvFromSendTo(data) {
    chrome.socket.create('udp', {}, function(socketInfo) {
      chrome.socket.bind(socketInfo.socketId, addr, port, function(result) {
        chrome.socket.recvFrom(socketInfo.socketId, function(readResult) {
          var sent = new Uint8Array(data);
          var recv = new Uint8Array(readResult.data);

          if (recv.length != sent.length) {
            return;
          }

          for (var i = 0; i < recv.length; i++) {
            if (recv[i] != sent[i]) {
              return;
            }
          }

          console.log('bindRecvFromSendTo: success');
          chrome.socket.destroy(socketInfo.socketId);
        });

        chrome.socket.create('udp', {}, function(socketInfo) {
          chrome.socket.sendTo(socketInfo.socketId, data, addr, port, function(result) {
            chrome.socket.destroy(socketInfo.socketId);
          });
        });
      });
    });
  }

  function bindConnectReadWrite(data) {
    chrome.socket.create('udp', {}, function(socketInfo1) {
      chrome.socket.bind(socketInfo1.socketId, addr, port, function(result) {

        chrome.socket.create('udp', {}, function(socketInfo2) {
          chrome.socket.bind(socketInfo2.socketId, addr, port+1, function(result) {

            chrome.socket.connect(socketInfo1.socketId, addr, port+1, function(result) {
              chrome.socket.connect(socketInfo2.socketId, addr, port, function(result) {

                chrome.socket.read(socketInfo1.socketId, function(readResult) {
                  var sent = new Uint8Array(data);
                  var recv = new Uint8Array(readResult.data);

                  if (recv.length != sent.length) {
                    return;
                  }

                  for (var i = 0; i < recv.length; i++) {
                    if (recv[i] != sent[i]) {
                      return;
                    }
                  }

                  console.log('bindConnectReadWrite: success');
                  chrome.socket.destroy(socketInfo1.socketId);
                });

                chrome.socket.write(socketInfo2.socketId, data, function(result) {
                  chrome.socket.destroy(socketInfo2.socketId);
                });

              });
            });

          });
        });

      });
    });
  }

  function getNetworkList() {
    chrome.socket.getNetworkList(function(info) {
      if (!info) return;
      for (var i = 0; i < info.length; i++) {
        console.log(info[i].name + ': ' + info[i].address);
      }
    });
  }

  function initPage() {
    console.log('Run this in terminal:');
    console.log('while true; do');
    console.log('  (nc -lv 1234 | xxd) || break; echo;');
    console.log('done');

    var arr = new Uint8Array(256);
    for (var i = 0; i < arr.length; i++) {
      arr[i] = i;
    }

    addButton('TCP: connect & write', function() {
      connectAndWrite('tcp', arr.buffer);
    });

    addButton('TCP: connect & read', function() {
      connectAndRead('tcp', arr.buffer);
    });

    addButton('TCP: accept & read', function() {
      acceptAndRead();
    });

    addButton('TCP: all-in-one', function() {
      acceptConnectReadWrite(arr.buffer);
    });

    addButton('TCP: all-in-one with getInfo', function() {
      acceptConnectReadWriteGetInfo(arr.buffer);
    });


    addButton('UDP: connect & write', function() {
      connectAndWrite('udp', arr.buffer);
    });

    addButton('UDP: connect & read', function() {
      connectAndRead('udp', arr.buffer);
    });

    addButton('UDP: sendTo', function() {
      sendTo(arr.buffer);
    });

    addButton('UDP: bind & recvFrom', function() {
      bindAndRecvFrom(arr.buffer);
    });

    addButton('UDP: all-in-one connectionless', function() {
      bindRecvFromSendTo(arr.buffer);
    });

    addButton('UDP: all-in-one w/ connections', function() {
      bindConnectReadWrite(arr.buffer);
    });

    addButton('getNetworkList', function() {
      getNetworkList();
    });
  }

  initPage();
};

exports.defineAutoTests = function() {
  'use strict';

  require('cordova-plugin-chrome-apps-test-framework.jasmine_helpers').addJasmineHelpers();

  // constants
  var bindAddr = '0.0.0.0';
  var connectAddr = '127.0.0.1';
  var multicastAddr = '224.0.1.' + Math.floor(Math.random()*256); // 224.0.1.0 to 239.255.255.255
  var multicastAddr2 = '224.0.2.' + Math.floor(Math.random()*256);
  var port = Math.floor(Math.random() * (65535-1024)) + 1024; // random in 1024 -> 65535
  var arr = new Uint8Array(256);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = i;
  }
  var data = arr.buffer;

  // Socket management -- Make sure we clean up sockets after each test, even upon failure
  var sockets = [];
  afterEach(function() {
    sockets.forEach(function(createInfo) {
      chrome.socket.disconnect(createInfo.socketId);
      chrome.socket.destroy(createInfo.socketId);
    });
    sockets = [];
  });

  function createSocket(type, callback) {
    chrome.socket.create(type, function(createInfo) {
      expect(createInfo).toBeTruthy();
      expect(createInfo.socketId).toBeDefined();
      sockets.push(createInfo);
      callback();
    });
  }
  function createSockets(type, count, callback) {
    if (!count)
      return setTimeout(callback, 0);
    createSocket(type, createSockets.bind(null, type, count-1, callback));
  }

  it('should contain definitions', function() {
    expect(chrome.socket).toBeDefined();
    expect(chrome.socket.destroy).toBeDefined();
    expect(chrome.socket.connect).toBeDefined();
    expect(chrome.socket.bind).toBeDefined();
    expect(chrome.socket.disconnect).toBeDefined();
    expect(chrome.socket.read).toBeDefined();
    expect(chrome.socket.write).toBeDefined();
    expect(chrome.socket.recvFrom).toBeDefined();
    expect(chrome.socket.sendTo).toBeDefined();
    expect(chrome.socket.listen).toBeDefined();
    expect(chrome.socket.accept).toBeDefined();
    expect(chrome.socket.setKeepAlive).toBeDefined();
    expect(chrome.socket.setNoDelay).toBeDefined();
    expect(chrome.socket.getInfo).toBeDefined();
    expect(chrome.socket.getNetworkList).toBeDefined();
    expect(chrome.socket.joinGroup).toBeDefined();
    expect(chrome.socket.leaveGroup).toBeDefined();
    expect(chrome.socket.setMulticastTimeToLive).toBeDefined();
    expect(chrome.socket.setMulticastLoopbackMode).toBeDefined();
    expect(chrome.socket.getJoinedGroups).toBeDefined();
  });

  describe('System', function() {
    it('getNetworkList', function(done) {
      chrome.socket.getNetworkList(function(result) {
        expect(result).toBeTruthy();
        expect(result.length).toBeGreaterThan(0);
        result.forEach(function(networkInterface) {
          expect(networkInterface.name).toBeTruthy();
          expect(networkInterface.address).toBeTruthy();
        });
        done();
      });
    });
  });

  describe('TCP', function() {
    beforeEach(function() {
      var customMatchers = {
        toBeValidTcpReadResultEqualTo: function(util, customEqualityTesters) {
          return {
            compare: function(actual, expected) {
              if (Object.prototype.toString.call(expected).slice(8, -1) !== "ArrayBuffer")
                throw new Error("toBeValidTcpReadResultEqualTo expects an ArrayBuffer");
              var result = { pass: true };

              if (!actual) result.pass = false;
              if (actual.resultCode <= 0) result.pass = false;
              if (actual.resultCode != expected.byteLength) result.pass = false;
              if (!actual.data) result.pass = false;
              if (Object.prototype.toString.call(actual.data).slice(8, -1) !== "ArrayBuffer") result.pass = false;

              var sent = new Uint8Array(expected);
              var recv = new Uint8Array(actual.data);
              if (recv.length !== sent.length) result.pass = false;

              for (var i = 0; i < recv.length; i++) {
                if (recv[i] !== sent[i]) result.pass = false;
              }
              return result;
            }
          };
        }
      };

      jasmine.addMatchers(customMatchers);
    });

    beforeEach(function(done) {
      createSockets('tcp', 2, done);
    });


    it('port is available (sanity test)', function(done) {
      chrome.socket.listen(sockets[0].socketId, bindAddr, port, function(listenResult) {
        expect(listenResult).toEqual(0);
        done();
      });
    });

    it('accept connect read write', function(done) {
      chrome.socket.listen(sockets[0].socketId, bindAddr, port, function(listenResult) {
        expect(listenResult).toEqual(0);

        chrome.socket.accept(sockets[0].socketId, function(acceptInfo) {
          sockets.push(acceptInfo);
          expect(acceptInfo).toBeTruthy();
          expect(acceptInfo.resultCode).toEqual(0);
          expect(acceptInfo.socketId).toBeDefined();

          chrome.socket.read(acceptInfo.socketId, function(readResult) {
            expect(readResult).toBeValidTcpReadResultEqualTo(data);
            done();
          });
        });

        chrome.socket.connect(sockets[1].socketId, connectAddr, port, function(connectResult) {
          expect(connectResult).toEqual(0);

          chrome.socket.write(sockets[1].socketId, data, function(writeResult) {
            expect(writeResult.bytesWritten).toBeGreaterThan(0);
          });
        });
      });
    });

    it('read with larger bufferSize', function(done) {
      chrome.socket.listen(sockets[0].socketId, bindAddr, port, function(listenResult) {
        expect(listenResult).toEqual(0);

        chrome.socket.accept(sockets[0].socketId, function(acceptInfo) {
          sockets.push(acceptInfo);
          expect(acceptInfo).toBeTruthy();
          expect(acceptInfo.resultCode).toEqual(0);
          expect(acceptInfo.socketId).toBeDefined();

          chrome.socket.read(acceptInfo.socketId, data.byteLength * 2, function(readResult) {
            expect(readResult).toBeValidTcpReadResultEqualTo(data);
            done();
          });
        });

        chrome.socket.connect(sockets[1].socketId, connectAddr, port, function(connectResult) {
          expect(connectResult).toEqual(0);

          chrome.socket.write(sockets[1].socketId, data, function(writeResult) {
            expect(writeResult.bytesWritten).toBeGreaterThan(0);
          });
        });
      });
    });

    it('read with null bufferSize', function(done) {
      chrome.socket.listen(sockets[0].socketId, bindAddr, port, function(listenResult) {
        expect(listenResult).toEqual(0);

        chrome.socket.accept(sockets[0].socketId, function(acceptInfo) {
          sockets.push(acceptInfo);
          expect(acceptInfo).toBeTruthy();
          expect(acceptInfo.resultCode).toEqual(0);
          expect(acceptInfo.socketId).toBeDefined();

          chrome.socket.read(acceptInfo.socketId, null, function(readResult) {
            expect(readResult).toBeValidTcpReadResultEqualTo(data);
            done();
          });
        });

        chrome.socket.connect(sockets[1].socketId, connectAddr, port, function(connectResult) {
          expect(connectResult).toEqual(0);

          chrome.socket.write(sockets[1].socketId, data, function(writeResult) {
            expect(writeResult.bytesWritten).toBeGreaterThan(0);
          });
        });
      });
    });

    it('connect before accept', function(done) {
      chrome.socket.listen(sockets[0].socketId, bindAddr, port, function(listenResult) {
        expect(listenResult).toEqual(0);

        chrome.socket.connect(sockets[1].socketId, connectAddr, port, function(connectResult) {
          expect(connectResult).toEqual(0);
        });

        setTimeout(function() {
          chrome.socket.accept(sockets[0].socketId, function(acceptInfo) {
            sockets.push(acceptInfo);
            expect(acceptInfo).toBeTruthy();
            expect(acceptInfo.resultCode).toEqual(0);
            expect(acceptInfo.socketId).toBeDefined();

            done();
          });
        }, 50);
      });
    });

    it('getInfo works', function(done) {
      chrome.socket.getInfo(sockets[0].socketId, function(socketInfo) {
        expect(socketInfo.socketType).toEqual('tcp');
        expect(socketInfo.connected).toBeFalsy();
        expect(socketInfo.localAddress).toBeFalsy();
        expect(socketInfo.localPort).toBeFalsy();
        expect(socketInfo.peerAddress).toBeFalsy();
        expect(socketInfo.peerPort).toBeFalsy();

        chrome.socket.listen(sockets[0].socketId, bindAddr, port, function(listenResult) {
          expect(listenResult).toEqual(0);

          chrome.socket.getInfo(sockets[0].socketId, function(socketInfo) {
            expect(socketInfo.socketType).toEqual('tcp');
            expect(socketInfo.connected).toBeFalsy();
            expect(socketInfo.localAddress).toBeTruthy();
            expect(socketInfo.localPort).toEqual(port);
            expect(socketInfo.peerAddress).toBeFalsy();
            expect(socketInfo.peerPort).toBeFalsy();

            chrome.socket.accept(sockets[0].socketId, function(acceptInfo) {
              sockets.push(acceptInfo);
              expect(acceptInfo).toBeTruthy();
              expect(acceptInfo.resultCode).toEqual(0);
              expect(acceptInfo.socketId).toBeDefined();

              chrome.socket.getInfo(acceptInfo.socketId, function(socketInfo) {
                expect(socketInfo.socketType).toEqual('tcp');
                expect(socketInfo.connected).toBeTruthy();
                expect(socketInfo.localAddress).toBeTruthy();
                expect(socketInfo.localPort).toBeGreaterThan(0);
                expect(socketInfo.peerAddress).toBeTruthy();
                expect(socketInfo.peerPort).toBeGreaterThan(0);

                chrome.socket.read(acceptInfo.socketId, function(readResult) {
                  done();
                });
              });
            });

            chrome.socket.connect(sockets[1].socketId, connectAddr, port, function(connectResult) {
              expect(connectResult).toEqual(0);

              chrome.socket.getInfo(sockets[1].socketId, function(socketInfo) {
                expect(socketInfo.socketType).toEqual('tcp');
                expect(socketInfo.connected).toBeTruthy();
                expect(socketInfo.localAddress).toBeTruthy();
                expect(socketInfo.localPort).toBeGreaterThan(0);
                expect(socketInfo.peerAddress).toBeTruthy();
                expect(socketInfo.peerPort).toBeGreaterThan(0);

                chrome.socket.write(sockets[1].socketId, data, function(writeResult) {
                });
              });
            });
          });
        });
      });
    });

  });

  describe('UDP', function() {

    beforeEach(function() {
      var customMatchers = {
        toBeValidUdpReadResultEqualTo: function(util, customEqualityTesters) {
          return {
            compare: function(actual, expected) {
              if (Object.prototype.toString.call(expected).slice(8, -1) !== "ArrayBuffer")
                throw new Error("toBeValidUdpReadResultEqualTo expects an ArrayBuffer");
              var result = { pass: true };
              if (!actual) result.pass = false;
              if (actual.resultCode <= 0) result.pass = false;
              if (actual.resultCode != expected.byteLength) result.pass = false;
              if (!actual.data) result.pass = false;
              if (Object.prototype.toString.call(actual.data).slice(8, -1) !== "ArrayBuffer") result.pass = false;

              var sent = new Uint8Array(expected);
              var recv = new Uint8Array(actual.data);
              if (recv.length !== sent.length) result.pass = false;

              for (var i = 0; i < recv.length; i++) {
                if (recv[i] !== sent[i]) result.pass = false;
              }
              return result;
            }
          };
        },
        toBeValidUdpRecvFromResultEqualTo: function(util, customEqualityTesters) {
          return {
            compare: function(actual, expected) {
              var result = customMatchers.toBeValidUdpReadResultEqualTo(util, customEqualityTesters).compare(actual, expected);
              if (!actual.address) result.pass = false;
              if (!actual.port) result.pass = false;
              return result;
            }
          };
        }
      };

      jasmine.addMatchers(customMatchers);
    });

    beforeEach(function(done) {
      createSockets('udp', 2, done);
    });


    it('port is available (sanity test)', function(done) {
      chrome.socket.bind(sockets[0].socketId, bindAddr, port, function(bindResult) {
        expect(bindResult).toEqual(0);
        done();
      });
    });

    it('bind to port 0 works', function(done) {
      chrome.socket.bind(sockets[0].socketId, bindAddr, 0, function(bindResult) {
        expect(bindResult).toEqual(0);
        done();
      });
    });

    it('bind to addr 0.0.0.0 works', function(done) {
      chrome.socket.bind(sockets[0].socketId, '0.0.0.0', 0, function(bindResult) {
        expect(bindResult).toEqual(0);
        done();
      });
    });

    it('getInfo works', function(done) {
      chrome.socket.bind(sockets[0].socketId, bindAddr, port, function(bindResult) {
        expect(bindResult).toEqual(0);

        chrome.socket.getInfo(sockets[0].socketId, function(socketInfo) {
          expect(socketInfo.socketType).toEqual('udp');
          expect(socketInfo.connected).toBeFalsy();
          expect(socketInfo.peerAddress).toBeFalsy();
          expect(socketInfo.peerPort).toBeFalsy();
          expect(socketInfo.localAddress).toBeTruthy();
          expect(socketInfo.localPort).toBeTruthy();

          done();
        });
      });
    });

    it('bind recvFrom sendTo with reply', function(done) {
      chrome.socket.bind(sockets[0].socketId, bindAddr, port, function(bindResult) {
        expect(bindResult).toEqual(0);

        chrome.socket.recvFrom(sockets[0].socketId, function(readResult) {
          expect(readResult).toBeValidUdpRecvFromResultEqualTo(data);

          chrome.socket.sendTo(sockets[0].socketId, data, readResult.address, readResult.port, function(writeResult) {
            expect(writeResult).toBeTruthy();
            expect(writeResult.bytesWritten).toBeGreaterThan(0);
          });
        });

        chrome.socket.bind(sockets[1].socketId, bindAddr, port+1, function(bindResult) {
          expect(bindResult).toEqual(0);

          chrome.socket.sendTo(sockets[1].socketId, data, connectAddr, port, function(writeResult) {
            expect(writeResult).toBeTruthy();
            expect(writeResult.bytesWritten).toBeGreaterThan(0);

            chrome.socket.recvFrom(sockets[1].socketId, function(readResult) {
              done();
            });
          });
        });
      });
    });

    it('recvFrom with larger bufferSize', function(done) {
      chrome.socket.bind(sockets[0].socketId, bindAddr, port, function(bindResult) {
        expect(bindResult).toEqual(0);

        chrome.socket.recvFrom(sockets[0].socketId, data.byteLength * 2, function(readResult) {
          expect(readResult).toBeValidUdpRecvFromResultEqualTo(data);

          chrome.socket.sendTo(sockets[0].socketId, data, readResult.address, readResult.port, function(writeResult) {
            expect(writeResult).toBeTruthy();
            expect(writeResult.bytesWritten).toBeGreaterThan(0);
          });
        });

        chrome.socket.bind(sockets[1].socketId, bindAddr, port+1, function(bindResult) {
          expect(bindResult).toEqual(0);

          chrome.socket.sendTo(sockets[1].socketId, data, connectAddr, port, function(writeResult) {
            expect(writeResult).toBeTruthy();
            expect(writeResult.bytesWritten).toBeGreaterThan(0);

            chrome.socket.recvFrom(sockets[1].socketId, function(readResult) {
              done();
            });
          });
        });
      });
    });

    it('recvFrom with null bufferSize', function(done) {
      chrome.socket.bind(sockets[0].socketId, bindAddr, port, function(bindResult) {
        expect(bindResult).toEqual(0);

        chrome.socket.recvFrom(sockets[0].socketId, null, function(readResult) {
          expect(readResult).toBeValidUdpRecvFromResultEqualTo(data);

          chrome.socket.sendTo(sockets[0].socketId, data, readResult.address, readResult.port, function(writeResult) {
            expect(writeResult).toBeTruthy();
            expect(writeResult.bytesWritten).toBeGreaterThan(0);
          });
        });

        chrome.socket.bind(sockets[1].socketId, bindAddr, port+1, function(bindResult) {
          expect(bindResult).toEqual(0);

          chrome.socket.sendTo(sockets[1].socketId, data, connectAddr, port, function(writeResult) {
            expect(writeResult).toBeTruthy();
            expect(writeResult.bytesWritten).toBeGreaterThan(0);

            chrome.socket.recvFrom(sockets[1].socketId, function(readResult) {
              done();
            });
          });
        });
      });
    });


    describeExcludeChrome('fail on desktop', function() {

    it('bind connect x2 read write', function(done) {
      chrome.socket.bind(sockets[0].socketId, bindAddr, port, function(bindResult1) {
        expect(bindResult1).toEqual(0);
        chrome.socket.bind(sockets[1].socketId, bindAddr, port+1, function(bindResult2) {
          expect(bindResult2).toEqual(0);

          chrome.socket.getInfo(sockets[0].socketId, function(info1) {
            chrome.socket.getInfo(sockets[1].socketId, function(info2) {
              chrome.socket.connect(sockets[0].socketId, connectAddr, info2.localPort, function(connectResult1) {
                expect(connectResult1).toEqual(0);

                chrome.socket.connect(sockets[1].socketId, connectAddr, info1.localPort, function(connectResult2) {
                  expect(connectResult2).toEqual(0);

                  chrome.socket.getInfo(sockets[0].socketId, function(info1) {
                    chrome.socket.getInfo(sockets[1].socketId, function(info2) {

                      chrome.socket.read(sockets[0].socketId, function(readResult) {
                        expect(readResult).toBeValidUdpReadResultEqualTo(data);
                        done();
                      });

                      chrome.socket.write(sockets[1].socketId, data, function(writeResult) {
                        expect(writeResult).toBeTruthy();
                        expect(writeResult.bytesWritten).toBe(data.byteLength);
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });

    it('read with null bufferSize', function(done) {
      chrome.socket.bind(sockets[0].socketId, bindAddr, port, function(bindResult1) {
        expect(bindResult1).toEqual(0);
        chrome.socket.bind(sockets[1].socketId, bindAddr, port+1, function(bindResult2) {
          expect(bindResult2).toEqual(0);

          chrome.socket.getInfo(sockets[0].socketId, function(info1) {
            chrome.socket.getInfo(sockets[1].socketId, function(info2) {
              chrome.socket.connect(sockets[0].socketId, connectAddr, info2.localPort, function(connectResult1) {
                expect(connectResult1).toEqual(0);

                chrome.socket.connect(sockets[1].socketId, connectAddr, info1.localPort, function(connectResult2) {
                  expect(connectResult2).toEqual(0);

                  chrome.socket.getInfo(sockets[0].socketId, function(info1) {
                    chrome.socket.getInfo(sockets[1].socketId, function(info2) {

                      chrome.socket.read(sockets[0].socketId, null, function(readResult) {
                        expect(readResult).toBeValidUdpReadResultEqualTo(data);
                        done();
                      });

                      chrome.socket.write(sockets[1].socketId, data, function(writeResult) {
                        expect(writeResult).toBeTruthy();
                        expect(writeResult.bytesWritten).toBe(data.byteLength);
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });

    });


    it('multiCast joinGroup single local client', function(done) {
      chrome.socket.bind(sockets[0].socketId, bindAddr, port, function(bindResult1) {
        expect(bindResult1).toEqual(0);
        chrome.socket.joinGroup(sockets[0].socketId, multicastAddr, function(joinResult1) {
          expect(joinResult1).toEqual(0);
          chrome.socket.recvFrom(sockets[0].socketId, function(readResult) {
            expect(readResult).toBeValidUdpRecvFromResultEqualTo(data);
            done();
          });

          chrome.socket.bind(sockets[1].socketId, bindAddr, 0, function(bindResult2) {
            expect(bindResult2).toEqual(0);
            chrome.socket.sendTo(sockets[1].socketId, data, multicastAddr, port, function(writeResult) {
              expect(writeResult).toBeTruthy();
              expect(writeResult.bytesWritten).toBeGreaterThan(0);
            });

          });
        });

      });
    });

    it('multiCast leaveGroup', function(done) {
      chrome.socket.bind(sockets[0].socketId, bindAddr, port, function(bindResult1) {
        expect(bindResult1).toEqual(0);
        chrome.socket.joinGroup(sockets[0].socketId, multicastAddr, function(joinResult1) {
          expect(joinResult1).toEqual(0);
          chrome.socket.leaveGroup(sockets[0].socketId, multicastAddr, function(leaveResult1) {
            expect(leaveResult1).toEqual(0);
            chrome.socket.recvFrom(sockets[0].socketId, function(readResult) {
              expect(readResult).toBeNull();
            });
            setTimeout(done, 100);

            chrome.socket.bind(sockets[1].socketId, bindAddr, 0, function(bindResult2) {
              expect(bindResult2).toEqual(0);
              chrome.socket.sendTo(sockets[1].socketId, data, multicastAddr, port, function(writeResult) {
                expect(writeResult).toBeTruthy();
                expect(writeResult.bytesWritten).toBeGreaterThan(0);
              });

            });
          });
        });

      });
    });

    it('multiCast getJoinedGroups', function(done) {
      chrome.socket.bind(sockets[0].socketId, bindAddr, port, function(bindResult1) {
        expect(bindResult1).toEqual(0);
        chrome.socket.joinGroup(sockets[0].socketId, multicastAddr, function(joinResult1) {
          expect(joinResult1).toEqual(0);
          chrome.socket.joinGroup(sockets[0].socketId, multicastAddr2, function(joinResult2) {
            expect(joinResult2).toEqual(0);
            chrome.socket.getJoinedGroups(sockets[0].socketId, function(joinedGroups) {
              expect(joinedGroups.length).toBe(2);
              expect(joinedGroups).toContain(multicastAddr);
              expect(joinedGroups).toContain(multicastAddr2);
              done();
            });
          });
        });

      });
    });

  });
};
