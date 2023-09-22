function y(p) {
  let { root: s, fn: $, fns: v, deps: T, ctx: E } = p;
  var b,
    o,
    l,
    x,
    _,
    O,
    m = [];
  function d(r) {
    return new Proxy(
      {},
      {
        get(h, a) {
          if (O) {
            let u = x.indexOf(a);
            if (u >= 0) return r[u];
          }
          return a === x
            ? r
            : x.includes(a)
            ? r[a]
            : a == _
            ? l.indexOf(r)
            : E[a];
        },
      }
    );
  }
  function w(r, h, a, u) {
    let c = N({ fns: v, dom: s.cloneNode(!0) }, d(r), T, E);
    m[u ? "unshift" : "push"](c),
      c.before(u || b),
      E.oninsert?.call(E, c.$el, r, {
        index: h,
        is_repaint: !!a,
        is_first: !h,
        is_last: h == l.length - 1,
        items: l,
      });
  }
  function j() {
    m.forEach((r) => r.unmount()), (m = []), l.forEach(w);
  }
  function P(r) {
    let { unshift: h, splice: a, push: u, sort: c, reverse: t } = r;
    return Object.assign(r, {
      push(e) {
        u.call(l, e), w(e, l.length - 1);
      },
      unshift(e) {
        h.call(l, e), w(e, 0, null, m[0].$el);
      },
      sort(e) {
        c.call(l, e), j();
      },
      reverse() {
        t.call(l), j();
      },
      splice(e, n) {
        m.slice(e, e + n).forEach((i) => i.unmount()),
          m.splice(e, n),
          a.call(l, e, n);
      },
      shift() {
        r.splice(0, 1);
      },
      pop() {
        r.splice(r.length - 1, 1);
      },
      remove(e) {
        let n = l.indexOf(e);
        n >= 0 && r.splice(n, 1);
      },
    });
  }
  function S() {
    var r;
    if ((([x, r, _, O] = $(E)), l))
      return (
        r !== o && ((l = P(r)), j(), (o = r)), m.forEach((h) => h.update())
      );
    if (r) {
      let h = s.parentElement;
      (b = new Text("")),
        h.insertBefore(b, s),
        h.removeChild(s),
        (l = P(r)),
        r.forEach(w),
        (o = r);
    }
  }
  return { update: S };
}
function B(p) {
  let { root: s, fn: $, fns: v, deps: T, ctx: E } = p,
    b = [];
  var o = s,
    l,
    x;
  function _(m, d) {
    p.processAttrs(m);
    let w = N({ fns: v, dom: m }, E, T);
    b.push(w), (w.fn = d);
  }
  for (_(s, $); (o = o.nextElementSibling); ) {
    let m = o.getAttribute(":else-if");
    if (m) _(o, v[m]), o.removeAttribute(":else-if");
    else if (o.hasAttribute(":else"))
      _(o, () => !0), o.removeAttribute(":else");
    else {
      x = o;
      break;
    }
  }
  function O() {
    if (!l) {
      let d = s.parentElement;
      (l = new Text("")), d.insertBefore(l, s);
    }
    let m = b.find((d) => d.fn(E));
    b.forEach((d) => (d == m ? d.before(l) : d.unmount()));
  }
  return { update: O, next: x };
}
var I = { ":if": B, ":for": y },
  R = ["class", "style", "id"];
function N(p, s = {}, $ = [], v = {}) {
  let { Impl: T, tmpl: E, fns: b = [], dom: o, inner: l } = p,
    x = [];
  function _(t) {
    let e = t.nodeType;
    if (e == 3) {
      let [n, i] = /:(\d+):/.exec(t.textContent.trim()) || [],
        f = b[i];
      f && x.push(() => (t.textContent = L(f(c))));
    }
    if (e == 1) {
      for (let g in I) {
        let A = b[t.getAttribute(g)];
        if (g == ":if" && A && t.getAttribute(":for")) {
          if (A(c)) continue;
          t.removeAttribute(":for");
        }
        if (A) {
          t.removeAttribute(g);
          let C = I[g]({
            root: t,
            fn: A,
            fns: b,
            deps: $,
            ctx: c,
            processAttrs: O,
          });
          return x.push(C.update || C), C;
        }
      }
      let n = t.tagName.toLowerCase(),
        i = t.nextSibling;
      if (l && n == "slot") return l.replace(t), { next: i };
      let f = $.find((g) => g.name == n);
      if (f) {
        if (t.firstChild) {
          let C = document.createElement("_");
          C.append(...t.childNodes), (f.inner = N({ fns: b, dom: C }, c, $));
        }
        let g = S(t),
          A = N(f, s, $, g).mount(t);
        return (
          o?.tagName.toLowerCase() == f.name && (u.$el = A.$el),
          x.push(() => r(A.$el, g)),
          (u.$refs[t.getAttribute("ref") || n] = A.impl),
          { next: i }
        );
      } else O(t), w(t, _);
    }
  }
  function O(t) {
    for (let e of [...t.attributes]) d(t, e.name, e.value);
  }
  function m(t, e, n) {
    t.getAttribute(e) !== n && t.setAttribute(e, n);
  }
  function d(t, e, n) {
    (e == "ref" || e == "name") && (u.$refs[n] = t);
    let i = b[n];
    if (!i) return;
    let f = e.slice(1),
      g = e[0];
    if ((":@$".includes(g) && t.removeAttribute(e), f == "attr"))
      return x.push(() => {
        for (let [A, C] of Object.entries(i(c))) m(t, A, C === !0 ? "" : C);
      });
    g == ":" &&
      f != "bind" &&
      x.push(() => {
        let A = i(c);
        m(t, f, L(A));
      }),
      g == "@" &&
        (t[`on${f}`] = (A) => {
          i.call(c, c, A), h();
        }),
      g == "$" && x.push(() => (i(c) ? (t[f] = f) : t.removeAttribute(f))),
      f == "html" && x.push(() => (t.innerHTML = i(c)));
  }
  function w(t, e) {
    let n = t.firstChild;
    for (; n; ) n = e(n)?.next || n.nextSibling;
  }
  function j(t, e) {
    let n = b[t.getAttribute(":" + e)];
    return n ? n(c) : t.getAttribute(e) || t[e] || void 0;
  }
  function P(t) {
    let e = {};
    for (let n of [...t.attributes]) {
      let i = n.name.replace(":", ""),
        f = j(t, i);
      !R.includes(i) && typeof f != "object" && (e[i] = f ?? !0);
    }
    return e;
  }
  function S(t) {
    return (
      (t.$attrs = P(t)),
      new Proxy(t, {
        get(e, n) {
          return j(t, n);
        },
      })
    );
  }
  function r(t, e) {
    let n = k(j(t, "class") || [], e.class);
    n[0] && (t.className = L(n, " "));
    let { id: i, style: f } = e;
    f && f.x != "" && (t.style = L(f)), i && (t.id = L(i));
  }
  function h(t) {
    return (
      t && Object.assign(a, t), x.map((e) => e()), a.updated?.call(c, c), u
    );
  }
  let a = {},
    u = {
      update: h,
      $el: o,
      get root() {
        return u.$el;
      },
      $refs: {},
      $parent: v,
      impl: a,
      mount(t) {
        let e = o || (u.$el = W(E)),
          n = t.querySelector("script");
        n &&
          (Object.assign(s, JSON.parse(n.textContent)),
          t.insertAdjacentElement("afterend", n)),
          T && ((a = u.impl = new T(c)), (a.$refs = u.$refs), (a.update = h)),
          _(e),
          t.replaceWith(e);
        for (let i of [...t.attributes]) m(e, i.name, i.value);
        return a.mounted?.call(c, c), h();
      },
      replace(t) {
        _(o), t.replaceWith(...o.children), h();
      },
      before(t) {
        if (o)
          return (
            (u.$el = o), t.before(o), o.walked || (_(o), (o.walked = 1)), h()
          );
      },
      unmount() {
        u.root.remove(), a.unmounted?.call(c, c), h();
      },
    },
    c = new Proxy(
      {},
      {
        get(t, e) {
          for (let n of [u, a, s, v, v.bind]) {
            let i = n && n[e];
            if (i != null) return i;
          }
        },
        set(t, e, n) {
          return (
            v && v[e] !== void 0 ? ((v[e] = n), v.update()) : (u[e] = n), !0
          );
        },
      }
    );
  return u;
}
function W(p) {
  let s = document.createElement("_");
  return (s.innerHTML = p.trim()), s.firstChild;
}
function L(p, s = "") {
  return p?.join
    ? p
        .filter(($) => $ != null)
        .join(s)
        .trim()
        .replace(/\s+/g, " ")
    : p || "";
}
function k(p, s) {
  return p == s
    ? [p]
    : (p.join || (p = [p]), s && !s.join && (s = [s]), p.concat(s));
}
export { N as createApp, N as default };
