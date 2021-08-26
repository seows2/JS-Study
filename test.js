"use strict";
function _instanceof(t, i) {
  return null != i && "undefined" != typeof Symbol && i[Symbol.hasInstance]
    ? !!i[Symbol.hasInstance](t)
    : t instanceof i;
}
function _classCallCheck(t, i) {
  if (!_instanceof(t, i))
    throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(t, i) {
  for (var e = 0; e < i.length; e++) {
    var h = i[e];
    (h.enumerable = h.enumerable || !1),
      (h.configurable = !0),
      "value" in h && (h.writable = !0),
      Object.defineProperty(t, h.key, h);
  }
}
function _createClass(t, i, e) {
  return (
    i && _defineProperties(t.prototype, i), e && _defineProperties(t, e), t
  );
}
!(function (t, i) {
  function e(t, i) {
    var e = t + Math.random() * (i - t);
    return Math.random() > 0.5 ? e : -e;
  }
  var h = 60,
    n = 1e3 / h,
    s = 2,
    a = 2.5,
    r = 180,
    o = 0.1,
    c = 0.2,
    l = "rgba(97, 145, 154, ",
    d = (function () {
      function t(i, h, n) {
        _classCallCheck(this, t),
          (this.id = i),
          (this.x = Math.random() * h),
          (this.y = Math.random() * n),
          (this.xSpeed = e(o, c)),
          (this.ySpeed = e(o, c));
      }
      return (
        _createClass(t, [
          {
            key: "update",
            value: function (t, i) {
              (this.x += this.xSpeed),
                (this.y += this.ySpeed),
                (this.x < a || this.x + a > t) &&
                  ((this.x = this.x < a ? a : t - a),
                  (this.xSpeed = -this.xSpeed)),
                (this.y < a || this.y + a > i) &&
                  ((this.y = this.y < a ? a : i - a),
                  (this.ySpeed = -this.ySpeed));
            },
          },
          {
            key: "draw",
            value: function (t) {
              t.beginPath(), t.arc(this.x, this.y, a, 0, 2 * Math.PI), t.fill();
            },
          },
        ]),
        t
      );
    })(),
    u = (function () {
      function t(i, e, h) {
        _classCallCheck(this, t),
          (this.ctx = i),
          (this.width = e),
          (this.height = h),
          (this.ctx.globalCompositeOperation = "lighter"),
          this.reset();
      }
      return (
        _createClass(t, [
          {
            key: "reset",
            value: function () {
              (this.points = []), this.populate();
            },
          },
          {
            key: "populate",
            value: function () {
              for (
                var t = Math.ceil(((this.width + this.height) / 100) * s),
                  i = 0;
                t > i;
                i++
              ) {
                var e = new d(i, this.width, this.height);
                this.points.push(e);
              }
            },
          },
          {
            key: "update",
            value: function (t, i) {
              (this.width = t), (this.height = i);
              for (var e = 0; e < this.points.length; e++) {
                var h = this.points[e];
                h.update(t, i);
              }
            },
          },
          {
            key: "draw",
            value: function () {
              this.ctx.fillStyle = l + "0.9)";
              for (var t = {}, i = 0; i < this.points.length; i++) {
                var e = this.points[i];
                e.draw(this.ctx);
                for (var h = 0; h < this.points.length; h++) {
                  var n = this.points[h];
                  if (n.id !== e.id) {
                    var s = Math.abs(e.x - n.x),
                      a = Math.abs(e.y - n.y),
                      o = Math.sqrt(Math.pow(s, 2) + Math.pow(a, 2));
                    if (r >= o) {
                      var c =
                        e.id > n.id
                          ? "".concat(n.id, "_").concat(e.id)
                          : "".concat(e.id, "_").concat(n.id);
                      if (t.hasOwnProperty(c)) continue;
                      t[c] = {
                        x1: e.x,
                        y1: e.y,
                        x2: n.x,
                        y2: n.y,
                        distance: o,
                      };
                    }
                  }
                }
              }
              for (var d = Object.values(t), u = 0; u < d.length; u++) {
                var f = d[u],
                  p = 1 - f.distance / r;
                (this.ctx.strokeStyle = l + p + ")"),
                  this.ctx.beginPath(),
                  this.ctx.moveTo(f.x1, f.y1),
                  this.ctx.lineTo(f.x2, f.y2),
                  this.ctx.stroke();
              }
            },
          },
        ]),
        t
      );
    })(),
    f = (function () {
      function t(i, e, h) {
        _classCallCheck(this, t),
          (this.ctx = i),
          (this.width = e),
          (this.height = h),
          (this.scene = new u(i, e, h)),
          (this.lastDraw = null);
      }
      return (
        _createClass(t, [
          {
            key: "update",
            value: function () {
              this.scene.update(this.width, this.height);
            },
          },
          {
            key: "draw",
            value: function () {
              var t = Date.now();
              if (null !== this.lastDraw) {
                var i = t - this.lastDraw;
                if (n > i) return;
              }
              this.ctx.clearRect(0, 0, this.width, this.height),
                this.scene.draw(),
                (this.lastDraw = t);
            },
          },
          {
            key: "didResize",
            value: function () {
              this.scene.reset();
            },
          },
        ]),
        t
      );
    })();
  !(function (t, i) {
    function e() {
      i.addEventListener("resize", n),
        (c = void 0 != i.devicePixelRatio ? i.devicePixelRatio : 1),
        (s.width = r * c),
        (s.height = o * c),
        (l.width = r),
        (l.height = o),
        a.scale(c, c),
        h();
    }
    function h() {
      l.update(), l.draw(), i.requestAnimationFrame(h);
    }
    function n() {
      (r = s.width = i.innerWidth),
        (o = s.height = i.innerHeight),
        (s.width = r * c),
        (s.height = o * c),
        (l.width = r),
        (l.height = o),
        a.scale(c, c),
        l.didResize();
    }
    var s = t.querySelector("canvas"),
      a = s.getContext("2d"),
      r = (s.width = i.innerWidth),
      o = (s.height = i.innerHeight),
      c = 1,
      l = new f(a, r, o);
    e();
  })(t, i);
})(document, window);
